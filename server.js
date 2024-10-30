const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", (socket) => {
  console.log("클라이언트가 연결되었습니다.");

  socket.on("chat message", (msg) => {
    io.emit("chat message", msg);
    console.log(`클라이언트에게 받은 메시지: ${msg}`);
  });

  socket.on("disconnect", () => {
    console.log("클라이언트가 연결 해제되었습니다.");
  });
});

const PORT = 8080;
server.listen(PORT, () => {
  console.log(`서버 실행 중입니다.`);
});
