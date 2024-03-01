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

  // when user accpets the call
  // socket data :-
  // to : socketId (which is "from" of user:call),
  // ans :
  socket.on("call:accepted", ({ to, ans }) => {
    console.log("call accepted : ", to, ans);

    io.to(to).emit("call:accepted", { from: socket.id, ans });
  });

  // negotiation socket needed
  socket.on("peer:nego:needed", ({ to, offer }) => {
    console.log("peer:nego:needed", to, offer);
    io.to(to).emit("peer:nego:needed", { from: socket.id, offer });
  });

  // negotiation socket done
  socket.on("peer:nego:done", ({ to, ans }) => {
    console.log("peer:nego:done", to, ans);
    io.to(to).emit("peer:nego:final", { from: socket.id, ans });
  });
});
