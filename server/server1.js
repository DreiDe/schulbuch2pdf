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
    onMessage("error", "Socket Event enthält falsche Parameter.")
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
        cb((await new Klett(onMessage, token).getBooks()));
    });

    socket.on('buchner/load', async (token, cb) => {
        if (!isLoadRequestValid(token, cb, onMessage)) return;
        cb((await new Buchner(onMessage, token).getBooks()));
    });

    socket.on('cornelsen/load', async (token, cb) => {
        if (!isLoadRequestValid(token, cb, onMessage)) return;
        cb((await new Cornelsen(onMessage, token).getBooks()));
    });

    /*
    socket.on('cornelsen/load', (token, cb) => { });
    socket.on('klett/load', (token, cb) => { });
    socket.on('buchner/load', (token, cb) => { });
    */
});
