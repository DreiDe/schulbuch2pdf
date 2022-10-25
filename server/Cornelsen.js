import Downloader from './Downloader.js';

class Cornelsen extends Downloader {
    constructor(onMessage, token) {
        super(onMessage, 'https://mein.cornelsen.de', {
            'authorization': `Bearer ${token}` // authorization header can be used with pspdfkit endpoint, cornelsen-jwt cookie not
        });

        return this;
    }

    async getBooks() {
        const resp = await this.api.post('/bibliothek/api', '{\r\n    "operationName": "licenses",\r\n    "variables": {},\r\n    "query": "query licenses {\\n  licenses {\\n    activeUntil\\n    isExpired\\n    isNew\\n    coverUrl\\n    canBeStarted\\n    salesProduct {\\n      id\\n      url\\n      heading\\n      shortTitle\\n      subheading\\n      info\\n      coverUrl\\n      licenseModelId\\n      fullVersionId\\n      fullVersionUrl\\n      isDemo\\n      __typename\\n    }\\n    usageProduct {\\n      id\\n      url\\n      heading\\n      shortTitle\\n      subheading\\n      info\\n      coverUrl\\n      usagePlatformId\\n      __typename\\n    }\\n    __typename\\n  }\\n}\\n"\r\n}');
        if (!resp) return;

        try {
            return resp.data.data.licenses.map((book) => ({
                name: book.usageProduct.shortTitle, id: `${book.usageProduct.id} ${book.salesProduct.id}`, isbn: book.salesProduct.id, url: book.coverUrl
            }));
        } catch {
            this.error('Die API Antwort von Cornelsen wurde geändert.');
        }
    }

    async #getPdfKitJwt(usageId, salesId) {
        const resp = await this.api.get(`/uma20/api/v2/pspdfkitjwt/${usageId}/${salesId}`, { baseURL: 'https://ebook.cornelsen.de' });
        if (!resp) return;
        return resp.data;
    }

    async #pdfKitAuth(jwt, salesId) {
        const resp = await this.api.post(`/i/d/${salesId}/auth`, {
            jwt,
            origin: "https://ebook.cornelsen.de"
        }, {
            baseURL: 'https://uma20-pspdfkit.prod.aws.cornelsen.de',
            headers: {
                'pspdfkit-platform': "web",
                'pspdfkit-version': "protocol=4, client=2022.4.2, client-git=4003a852cd"
            }
        });
        if (!resp) return;

        if (!resp.data.layerHandle || !resp.data.imageToken) {
            this.error('Der Cornelsen PDF-Auth Endpoint wurde geändert.');
            return;
        }
        return { layerHandle: resp.data.layerHandle, imageToken: resp.data.imageToken };
    }

    async downloadAllPages(usageId, salesId) {
        const jwt = await this.#getPdfKitJwt(usageId, salesId);
        if (!jwt) return;
        const pdfCreds = await this.#pdfKitAuth(jwt, salesId);
        if (!pdfCreds) return;

        // TODO: make this a reusable function peace
        const tempFolder = Downloader.createTempFolder();
        let status = 'fulfilled';
        let counter = 0;

        while (status === 'fulfilled') {
            this.status(`Seiten werden eingelesen. Bisher ${counter} Seiten`);
            const promises = [];
            for (let i = counter; i < counter + 10; i++) {
                promises.push(this.downloadImage(
                    `https://uma20-pspdfkit.prod.aws.cornelsen.de/i/d/${salesId}/h/${pdfCreds.layerHandle}/page-${i}-dimensions-2155-2949-tile-0-0-2155-2949`,
                    `${tempFolder}${i}.png`,
                    undefined,
                    { 'x-pspdfkit-image-token': pdfCreds.imageToken }
                ))
            }
            const [result] = await Promise.allSettled(promises);
            console.log(result.status);
            status = result.status;
            counter += 10;
        }

        return tempFolder;
    }
}

export default Cornelsen;
