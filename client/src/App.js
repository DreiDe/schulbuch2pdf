import Header from './components/Header.js'
import Books from './components/Books.js';
import Toast from './components/Toast.js';
import Tabs from './components/Tabs.js';
import { socket } from "./socket";
import { useState, useEffect } from 'react';

function App() {
  const [token, setToken] = useState();
  const [books, setBooks] = useState();
  const [toast, setToast] = useState();
  const [publisher, setPublisher] = useState("westermann");

  const downloadBook = (id) => {
    socket.emit(`${publisher}/download`, token, id);
  }

  const loadBooks = () => {
    socket.emit(`${publisher}/load`, token, (res) => {
      setBooks(res);
    });
  }

  useEffect(() => {
    socket.on('connect_error', function () {
      setToast({ message: "Es konnte keine Verbindung zum Server hergestellt werden.", type: "error" });
    });

    socket.on('error', message => {
      setToast({ message, type: "error" });
    });

    socket.on('status', message => {
      setToast({ message, type: "info" });
    });

    socket.on('download', url => {
      const path = `${window.location.origin}${url}`;
      setToast({ message: `Fertig. Download unter: ${path}`, type: "info" });
      window.open(path, '_blank');
    });
  }, []);

  return (
    <div className="bg-gray-200">
      <Header />
      <div className="px-20 py-10">
        <Tabs publisher={publisher} onTokenChange={setToken} onPublisherChange={setPublisher} onSubmit={loadBooks} />
        <Books books={books} onClick={downloadBook} />
      </div>
      <Toast {...toast} />
    </div>
  );
}

export default App;
