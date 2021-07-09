import Header from './components/Header.js'
import Books from './components/Books.js';
import Info from './components/Info.js';
import Input from './components/Input.js';
import Toast from './components/Toast.js';
import { socket } from "./socket";
import { useState, useEffect } from 'react';

function App() {
  const [token, setToken] = useState();
  const [books, setBooks] = useState();
  const [toast, setToast] = useState();

  const loadBooks = () => {
    socket.emit('loadBooks', token, (res) => {
      console.log(res);
      setBooks(res);
    });
  }

  const downloadBook = (id) => {
    socket.emit('downloadBook', token, id, (res) => {
      setBooks(res);
    });
  }

  useEffect(() => {
    socket.on('connect_error', function () {
      setToast({ message: "Es konnte keine Verbindung zum Server hergestellt werden.", type: "error" });
    });

    socket.on('error', message => {
      setToast({message, type: "error"});
    });

    socket.on('status', message => {
      setToast({message, type: "info"});
    });

    socket.on('download', url => {
      const path = `${window.location.origin}${url}`;
      setToast({message: `Fertig. Download unter: ${path}`, type: "info"});
      window.open(path,'_blank');
    });
  }, []);

  return (
    <div className="bg-gray-200">
      <Header />
      <div className="px-20 py-10">
        <Info />
        <Input onChange={setToken} onSubmit={loadBooks} />
        <Books books={books} onClick={downloadBook} />
      </div>
      <Toast {...toast} />
    </div>
  );
}

export default App;
