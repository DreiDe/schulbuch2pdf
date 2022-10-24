import Downloader from './Downloader.js';

class Westermann extends Downloader {
    constructor(onMessage, token) {
        super(onMessage, 'https://backend.bibox2.westermann.de/api', {
            'authorization': `Bearer ${token}`
        });

        return this;
    }

    async getBooks() {
        const resp = await this.api.get('/books');
        if (!resp) return;

        try {
            const books = resp.data.map(book => {
                return { name: book.title, id: book.id, isbn: book.isbn, url: book.coverUrl };
            });
            return books;
        } catch {
            this.error('Der Westermann Bücher Endpunkt wurde geändert.');
        }
    }

    async #getPageUrls(bookId) {
        const resp = await this.api.get(`/sync/${bookId}`);
        if (!resp) return;

        try {
            const pageUrls = resp.data.pages.map(page => {
                return page.images[1].url;
            });
            if (pageUrls.length === 0) {
                this.error('Keine Seiten konnten gelesen werden.');
                return;
            }
            return pageUrls;
        } catch {
            this.error('Der Westermann Seiten Endpunkt wurde geändert.');
        }
    }

    async downloadAllPages(bookId) {
        // TODO: return status of resolved Promises in Promise.all
        this.status("Seiten werden eingelesen. Bitte warten...");
        const urls = await this.#getPageUrls(bookId);
        if (!urls) return;

        const tempFolder = Downloader.createTempFolder();
        const promises = [];
        for (let i = 0; i < urls.length; i++) {
            promises.push(this.downloadImage(urls[i], `${tempFolder}${i}.png`));
        }
        return Promise.all(promises).then(() => tempFolder);
    }
}

export default Westermann;
