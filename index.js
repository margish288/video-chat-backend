import { Server } from "socket.io";

const PORT = 8000;
const io = new Server(PORT, {
  cors: true,
});

const emailToSocketIdMap = new Map();
const socketIdToEmailMap = new Map();

io.on("connection", (socket) => {
  console.log("Socket connected - ", socket.id);
  socket.on("room:join", (data) => {
    const { email, room } = data;
    console.log(data);
    emailToSocketIdMap.set(email, socket.id);
    socketIdToEmailMap.set(socket.id, email);

    io.to(room).emit("room:joined", { email, id: socket.id });
    socket.join(room);
    io.to(socket.id).emit("room:join", data);
  });
});
