import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import PDFDocument from 'pdfkit';
import fs from 'fs';
import axiosThrottle from 'axios-request-throttle';

class Downloader {
    static DOWNLOAD_FOLDER = './tmp';
    static PDF_NAME = "Buch.pdf";

    constructor(onMessage, baseUrl, headers) {
        this.error = (message) => onMessage("error", message);
        this.status = (message) => onMessage("status", message);
        this.headers = headers;

        this.api = axios.create({
            baseURL: baseUrl,
            timeout: 5000,
            headers
        });

        this.api.interceptors.response.use((response) => response, (error) => {
            if (!error.response) this.error('Anfrage an Verlagsserver fehlgschlagen');
            else if ([401, 403].includes(error.response.status)) this.error('Zugriff verweigert. Token ungültig?');
            else if ([400, 404, 405].includes(error.response.status)) this.error('Die API des Verlags hat sich vermutlich geändert.');
            else if ([502, 503].includes(error.response.status)) this.error('Der Server des Verlags kann nicht erreicht werden.');
            else this.error('Der Verlagsserver hat eine ungültige Antwort gesendet.');
        });
    }

    async downloadImage(url, location, requestsPerSecond, headers = {}) {
        if (requestsPerSecond) axiosThrottle.use(axios, { requestsPerSecond });
        const resp = await axios.get(url, { responseType: 'stream', headers: { ...this.api.defaults.headers, ...headers } });

        const writer = fs.createWriteStream(location)
        resp.data.pipe(writer)

        return new Promise((resolve, reject) => {
            writer.on('finish', resolve)
            writer.on('error', reject)
        })
    };

    static createTempFolder = () => {
        const folderPath = `${this.DOWNLOAD_FOLDER}/${uuidv4()}/`;
        fs.mkdirSync(folderPath);
        return folderPath;
    }

    static async pdfFromTempFolder(folderPath, onMessage) {
        var pdf = new (PDFDocument)({
            autoFirstPage: false
        });
        let currentPage = 0;
        var collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });
        let pages = fs.readdirSync(folderPath).sort(collator.compare);

        pdf.pipe(fs.createWriteStream(`${folderPath}/${this.PDF_NAME}`));
        for (const file of pages) {
            currentPage++;
            if (currentPage % 5 == 0) {
                onMessage('status', `PDF wird erzeugt: Seite ${currentPage}`);
                await this.setImmediatePromise();
            }
            var img = pdf.openImage(`${folderPath}/${file}`);
            pdf.addPage({ size: [img.width, img.height] });
            pdf.image(img, 0, 0);
        }

        pdf.end();
    }

    static setImmediatePromise() {
        return new Promise((resolve) => {
            setImmediate(() => resolve());
        });
    }

    static deleteTempFolder = (name) => {
        fs.rmdirSync(name, { recursive: true });
        return true;
    }

}

export default Downloader;
