import { Server } from "socket.io";

const PORT = 8000;
const io = new Server(PORT);

io.on("connection", (socket) => {
  console.log("Socket connected - ", socket.id);
});
