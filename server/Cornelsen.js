import Book from './Book.js';

class Cornelsen extends Book {
    constructor(onMessage, token) {
        super(onMessage, 'https://mein.cornelsen.de', {
            'cookie': `cornelsen-jwt=${token}`
        });

        return this;
    }

    async getBooks() {
        const resp = await this.api.post('/bibliothek/api', '{\r\n    "operationName": "licenses",\r\n    "variables": {},\r\n    "query": "query licenses {\\n  licenses {\\n    activeUntil\\n    isExpired\\n    isNew\\n    coverUrl\\n    canBeStarted\\n    salesProduct {\\n      id\\n      url\\n      heading\\n      shortTitle\\n      subheading\\n      info\\n      coverUrl\\n      licenseModelId\\n      fullVersionId\\n      fullVersionUrl\\n      isDemo\\n      __typename\\n    }\\n    usageProduct {\\n      id\\n      url\\n      heading\\n      shortTitle\\n      subheading\\n      info\\n      coverUrl\\n      usagePlatformId\\n      __typename\\n    }\\n    __typename\\n  }\\n}\\n"\r\n}');
        if (!resp) return;

        try {
            return resp.data.data.licenses.map((book) => ({ name: book.usageProduct.shortTitle, id: book.usageProduct.id, isbn: book.salesProduct.id, url: book.coverUrl }));
        } catch {
            this.error('Die API Antwort von Cornelsen wurde geändert.');
        }
    }
}

export default Cornelsen;
