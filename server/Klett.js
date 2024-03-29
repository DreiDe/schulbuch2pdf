import Downloader from './Downloader.js';

class Klett extends Downloader {
    constructor(onMessage, klett_session, session) {
        super(onMessage, 'https://www.klett.de', {
            'cookie': `klett_session=${klett_session};SESSION=${session}`
        });

        return this;
    }

    async getBooks() {
        const bookIds = await this.#getBookIds();
        return await this.#getBooksByIds(bookIds);
    }

    async #getBookIds() {
        const bookIds = {};
        const resp = await this.api.get('/drm/api/1.0/private/license/usage', {
            params: {
                valid: "true"
            },
        });
        if (!resp) return bookIds;

        try {
            resp.data.items.forEach(book => {
                bookIds[book.produktnummer] = book.dienst_id;
            });
        } catch {
            this.error('Der Klett Endpunkt für Lizenzen wurde geändert.');
        }

        return bookIds;
    }

    #generateUrlParams(bookIds) {
        const urlParams = {};
        let i = 0;
        Object.keys(bookIds).forEach((produktnummer) => {
            urlParams[`produktnummerList[${i}]`] = produktnummer;
            i++;
        });
        return urlParams;
    }


    async #getBooksByIds(bookIds) {
        const resp = await this.api.get('/catalog/api/1.0/public/produkt', {
            params: this.#generateUrlParams(bookIds)
        });
        if (!resp) return;

        try {
            const books = resp.data.items.map((book) => (
                { name: book.titel, id: bookIds[book.produktnummer], isbn: book.dienstVonList[0].produktnummer, url: book.cover_url }
            ));
            return books;
        } catch {
            this.error('Der Klett Endpunkt für Buchdetails wurde geändert.');
        }
    }

    async downloadAllPages(bookId) {
        // TODO: make this a reusable function peace
        const tempFolder = await Downloader.createTempFolder();
        let status = 'fulfilled';
        let counter = 0;

        while (status === 'fulfilled') {
            this.status(`Seiten werden eingelesen. Bisher ${counter} Seiten`);
            const promises = [];
            for (let i = counter; i < counter + 10; i++) {
                promises.push(this.downloadImage(`https://bridge.klett.de/${bookId}/content/pages/page_${i}/Scale4.png`, `${tempFolder}${i}.png`));
            }
            const [result] = await Promise.allSettled(promises);
            status = result.status;
            counter += 10;
        }
        this.status(`Große Seiten werden komprimiert...`);
        await Downloader.compressImagesInFolder(tempFolder, 1048576);
        return tempFolder;
    }
};

export default Klett;
