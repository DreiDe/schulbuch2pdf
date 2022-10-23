import Downloader from './Downloader.js';

class Buchner extends Downloader {
    constructor(onMessage, token) {
        super(onMessage, 'https://www.click-and-study.de', {
            'cookie': `ccb_token_secure=${token}`
        });

        return this;
    }

    async getBooks() {
        const idRegex = /background-image:url\(\/Media\/page\/([0-9]+)/gm;
        const titleRegex = /<div class="title">([^<]*)<\/div>/gm;
        const resp = await this.api.get('/Buecher');
        if (!resp) return;
        try {
            const bookIds = [...resp.data.matchAll(idRegex)].map(match => match[1]);
            const bookTitles = [...resp.data.matchAll(titleRegex)].map(match => match[1]);

            return bookIds.map((bookId, index) => (
                { name: bookTitles[index], id: bookId, isbn: "", url: `https://www.click-and-study.de/Media/page/${bookId}/1/1000x1000` }
            ));
        }
        catch {
            this.error('Die API Antwort von C.C. Buchner wurde geändert');
        }
    }

    async downloadAllPages(bookId) {
        this.status("Page download started");
        const tempFolder = Downloader.createTempFolder();
        const promises = [];
        for (let i = 1; i < 366; i++) {
            promises.push(this.downloadImage(`https://www.click-and-study.de/Media/page/${bookId}/${i}`, `${tempFolder}${i}.png`, 2.5));
        }
        return Promise.all(promises);
    }
}

export default Buchner;
