import axios from 'axios'

class Book {
    constructor(onMessage, baseUrl, headers) {
        this.error = (message) => onMessage("error", message);

        this.api = axios.create({
            baseURL: baseUrl,
            timeout: 5000,
            headers
        });

        this.api.interceptors.response.use((response) => response, (error) => {
            console.log(error);
            if (!error.response) this.error('Anfrage an Verlagsserver fehlgschlagen');
            else if ([401, 403].includes(error.response.status)) this.error('Der eingegebene Token ist ungültig.');
            else if ([400, 404, 405].includes(error.response.status)) this.error('Die API des Verlags hat sich vermutlich geändert.');
            else if ([502, 503].includes(error.response.status)) this.error('Der Server des Verlags kann nicht erreicht werden.');
            else this.error('Der Verlagsserver hat eine ungültige Antwort gesendet.');
        });
    }
}

export default Book;
