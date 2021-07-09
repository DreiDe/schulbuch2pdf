const axios = require('axios');
var fs = require('fs');
const PDFDocument = require('pdfkit');
const { v4: uuidv4 } = require('uuid');
const express = require("express");
const socket = require('socket.io');

const PORT = process.env.PORT || 5000;
const TEMP_FOLDER = './tmp';
const PDF_NAME = 'Buch.pdf';
const BIBOX_URL = 'https://backend.bibox2.westermann.de/api';
const DOWNLOAD_PATH = '/download';

const app = express();
const server = app.listen(PORT, () => {
    console.log(`Server listening on Port ${PORT}`)
});
const io = socket(server);

app.use(express.static("public"));

app.get(`${DOWNLOAD_PATH}/:uuid`, (req, res) => {
    const file = `${TEMP_FOLDER}/${req.params.uuid}/${PDF_NAME}`;
    res.download(file);
});

io.on('connection', socket => {
    console.log("connected");
    socket.on('loadBooks', (token, cb) => {
        axios({
            method: 'get',
            url: `${BIBOX_URL}/books`,
            headers: {
                'authorization': `Bearer ${token}`
            }
        })
            .then(function (response) {
                const books = response.data.map(book => {
                    return { name: book.title, id: book.id, isbn: book.isbn, url: book.coverUrl };
                });
                cb(books);
            })
            .catch(function (error) {
                console.log(error);
                socket.emit('error', 'Der eingegebene Token ist ungültig.');
            });
    });

    socket.on('downloadBook', (token, id, cb) => {
        socket.emit('status', 'Buchseiten werden eingelesen.');
        axios({
            method: 'get',
            url: `${BIBOX_URL}/sync/${id}`,
            headers: {
                'authorization': `Bearer ${token}`
            }
        })
            .then(function (response) {
                const pageUrls = response.data.pages.map(page => {
                    return page.images[1].url;
                });

                const downloadFolder = createTempFolder();
                socket.emit('status', 'Buchseiten werden heruntergeladen...');
                downloadImages(pageUrls, downloadFolder)
                    .then(() => {
                        pdfFromImages(downloadFolder, socket);
                        socket.emit('download', downloadFolder.replace(TEMP_FOLDER, DOWNLOAD_PATH));
                    });
            })
            .catch(function (error) {
                console.log(error);
                socket.emit('error', 'Es ist ein Fehler augetreten.');
            });
    });
});

const downloadImages = (urls, folder) => {
    const promises = [];
    for (let i = 0; i < urls.length; i++) {
        promises.push(downloadImage(urls[i], `${folder}${i}.png`));
    }
    return Promise.all(promises);
}

const createTempFolder = () => {
    const name = `${TEMP_FOLDER}/${uuidv4()}/`;
    fs.mkdirSync(name);
    return name;
}

const deleteTempFolder = (name) => {
    fs.rmdirSync(name, { recursive: true });
    return true;
}

const downloadImage = async (url, location) => {
    const writer = fs.createWriteStream(location)

    const response = await axios({
        url,
        method: 'GET',
        responseType: 'stream'
    })

    response.data.pipe(writer)

    return new Promise((resolve, reject) => {
        writer.on('finish', resolve)
        writer.on('error', reject)
    })
};

const pdfFromImages = (folder, socket) => {
    var pdf = new (PDFDocument)({
        autoFirstPage: false
    });
    let currentPage = 0;
    var collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });
    let pages = fs.readdirSync(folder).sort(collator.compare);

    pdf.pipe(fs.createWriteStream(`${folder}/${PDF_NAME}`));
    pages.forEach(file => {
        currentPage++;
        if (currentPage % 5 == 0) {
            socket.emit('status', `PDF wird erzeugt: Seite ${currentPage}`);
        }
        var img = pdf.openImage(`${folder}${file}`);
        pdf.addPage({ size: [img.width, img.height] });
        pdf.image(img, 0, 0);
    });

    pdf.end();
}