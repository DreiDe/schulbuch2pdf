import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import PDFDocument from 'pdfkit'; // the fastest and most ram efficient node library i could find
import fs from 'fs'; 
import axiosThrottle from 'axios-request-throttle';
import { ImagePool } from '@squoosh/lib';
import { cpus } from 'os';

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

        const writer = fs.createWriteStream(location);
        resp.data.pipe(writer);

        return new Promise((resolve, reject) => {
            writer.on('finish', resolve)
            writer.on('error', reject)
        })
    };

    static async compressImagesInFolder(folderPath, noCompressionBelowSize) {
        let pages = await fs.promises.readdir(folderPath);
        const imagePool = new ImagePool(cpus().length);

        const promises = pages.map(async (file) => {
            const fileStats = await fs.promises.stat(`${folderPath}${file}`);
            if (fileStats.size < noCompressionBelowSize) return;
            const image = imagePool.ingestImage(`${folderPath}${file}`);

            await image.encode({
                mozjpeg: {
                    quality: 50,
                }
            });
            const { binary } = await image.encodedWith.mozjpeg;
            await fs.promises.writeFile(`${folderPath}${file}.jpg`, binary);
            await fs.promises.rm(`${folderPath}${file}`);
        });

        await Promise.all(promises);
        await imagePool.close();
    }

    static createTempFolder = async () => {
        const folderPath = `${this.DOWNLOAD_FOLDER}/${uuidv4()}/`;
        await fs.promises.mkdir(folderPath);
        return folderPath;
    }

    static async pdfFromTempFolder(folderPath, onMessage) {
        var pdf = new (PDFDocument)({
            autoFirstPage: false
        });
        let currentPage = 0;
        var collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });
        let pages = (await fs.promises.readdir(folderPath)).sort(collator.compare);

        const writeStream = fs.createWriteStream(`${folderPath}/${this.PDF_NAME}`);
        pdf.pipe(writeStream);
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

        onMessage('status', `PDF wird abgespeichert...`);
        await new Promise(resolve => {
            writeStream.on("finish", () => {
                resolve();
            });
        });
    }

    static setImmediatePromise() {
        return new Promise((resolve) => {
            setImmediate(() => resolve());
        });
    }

    static deleteTempFolder = async (name) => {
        await fs.promises.rm(name, { recursive: true });
        return true;
    }

}

export default Downloader;
