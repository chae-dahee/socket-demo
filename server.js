const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.listen(8080);

//웹소켓 서버 열기
const WebSocket = require("ws");
const socket = new WebSocket.Server({ port: 8081 });

const clients = [];

//클라이언트가 서버에 연결될때 실행
socket.on("connection", (ws) => {
  console.log("클라이언트가 연결되었습니다.");
  clients.push(ws);

  //클라이언트로부터 메시지를 수신했을 때
  ws.on("message", (message) => {
    console.log(`수신한 메시지: ${message}`);
    // ws.send(message);
    // 모든 클라이언트에게 메시지를 브로드캐스트
    clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  //클라이언트와의 연결이 종료되었을 때
  ws.on("close", () => {
    console.log("클라이언트와의 연결이 종료되었습니다.");
    // 연결이 종료된 클라이언트를 배열에서 제거
    const index = clients.indexOf(ws);
    if (index !== -1) {
      clients.splice(index, 1);
    }
  });
});
