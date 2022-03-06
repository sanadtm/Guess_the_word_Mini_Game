// const express = require("express");
// const http = require("http");
// const app = express();
// const { Server } = require("socket.io");
// const server = http.createServer(app);
// const io = new Server(server);
// const path = require("path");
// global.count = 10;
// const port = process.env.PORT || 4000;
// app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
	res.sendFile(__dirname + "/public/views/gamePage.html");
});

server.listen(port, () => {
	console.log(`listening at http://localhost:${port}`);
});
