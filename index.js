import { Server } from "socket.io";

const PORT = 8000;
const io = new Server(PORT, {
  cors: true,
});

const emailToSocketIdMap = new Map();
const socketIdToEmailMap = new Map();

// "connection" event
io.on("connection", (socket) => {
  console.log("Socket connected - ", socket.id);

  // "room:join" event -> data = { email, roomId}
  socket.on("room:join", (data) => {
    const { email, room } = data;
    console.log(data);
    emailToSocketIdMap.set(email, socket.id);
    socketIdToEmailMap.set(socket.id, email);

    // emitting the event "room:joined" with data = { email, id }
    io.to(room).emit("room:joined", { email, id: socket.id });
    socket.join(room);
    io.to(socket.id).emit("room:join", data);
  });

  // when user calls to other this "user:call" is triggers
  // we get data { to, offer } => to:SocketId, offer : {}
  socket.on("user:call", ({ to, offer }) => {
    console.log(`user:call - ${to}`, offer);
    io.to(to).emit("incoming:call", { from: socket.id, offer });
  });
});
