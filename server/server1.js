import express from 'express';
import { Server } from "socket.io";
import Westermann from './Westermann.js';
import Klett from './Klett.js';
import Buchner from './Buchner.js';
import Cornelsen from './Cornelsen.js';

const PORT = 5000;
const TEMP_FOLDER = './tmp';
const PDF_NAME = 'Buch.pdf';
const DOWNLOAD_PATH = '/download';

const app = express();
const server = app.listen(PORT, () => console.log(`Server listening on Port ${PORT}`));
const io = new Server(server, {
    cors: {
        origin: "*"
    }
});

const isLoadRequestValid = (token, cb, onMessage) => {
    if (token && cb && typeof cb === 'function') return true;
    onMessage("error", "Socket Load Event enthält falsche Parameter.")
    return false;
}

const isDownloadRequestValid = (token, bookId, onMessage) => {
    if (token && bookId) return true;
    onMessage("error", "Socket Download Event enthält falsche Parameter.")
    return false;
}

io.on('connection', socket => {
    const onMessage = (type, message) => socket.emit(type, message);

    socket.on('westermann/load', async (token, cb) => {
        if (!isLoadRequestValid(token, cb, onMessage)) return;
        cb((await new Westermann(onMessage, token).getBooks()));
    });

    socket.on('klett/load', async (token, cb) => {
        if (!isLoadRequestValid(token, cb, onMessage)) return;
        const sessions = token.split(" ");
        if(sessions.length !== 2){
            onMessage("error", "klett_session und SESSION wurden nicht mit einem Leerzeichen getrennt");
            return;
        }
        cb((await new Klett(onMessage, sessions[0], sessions[1]).getBooks()));
    });

    socket.on('buchner/load', async (token, cb) => {
        if (!isLoadRequestValid(token, cb, onMessage)) return;
        cb((await new Buchner(onMessage, token).getBooks()));
    });

    socket.on('cornelsen/load', async (token, cb) => {
        if (!isLoadRequestValid(token, cb, onMessage)) return;
        cb((await new Cornelsen(onMessage, token).getBooks()));
    });

    socket.on('westermann/download', async (token, bookId) => {
        if (!isDownloadRequestValid(token, bookId, onMessage)) return;
        const downloader = new Westermann(onMessage, token).downloadAllPages(bookId);
    });

    socket.on('buchner/download', async (token, bookId) => {
        if (!isDownloadRequestValid(token, bookId, onMessage)) return;
        const downloader = new Buchner(onMessage, token).downloadAllPages(bookId);
    });

    socket.on('klett/download', async (token, bookId) => {
        if (!isDownloadRequestValid(token, bookId, onMessage)) return;
        const sessions = token.split(" ");
        if(sessions.length !== 2){
            onMessage("error", "klett_session und SESSION wurden nicht mit einem Leerzeichen getrennt");
            return;
        }
        const downloader = new Klett(onMessage, sessions[0], sessions[1]).downloadAllPages(bookId);
    });

    socket.on('cornelsen/download', async (token, bookId) => {
        if (!isDownloadRequestValid(token, bookId, onMessage)) return;
        const bookIds = bookId.split(" ");
        if(bookIds.length !== 2){
            onMessage("error", "usageId und salesId nicht mit Leerzeichen getrennt.");
            return;
        }
        const downloader = new Cornelsen(onMessage, token).downloadAllPages(bookIds[0], bookIds[1]);
    });
});
