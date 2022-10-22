import Book from './Book.js';

class Westermann extends Book {
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
            this.error('Die API Antwort von Westermann wurde geändert');
        }
    }
}

export default Westermann;
