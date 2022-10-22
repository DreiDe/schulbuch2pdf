import io from "socket.io-client";
//export const socket = io(`${window.location.origin}`);
export const socket = io(`http://localhost:5000`);
