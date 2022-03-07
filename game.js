const express = require("express");
const http = require("http");
const app = express();
const { Server } = require("socket.io");
const server = http.createServer(app);
const io = new Server(server);
const path = require("path");
global.count = 10;
const port = process.env.PORT || 4000;
app.use(express.static(path.join(__dirname, "public")));
const name = "sanad";
app.get("/", (req, res) => {
	res.sendFile(__dirname + "/public/views/gamePage.html");
});

io.on("connection", (socket) => {
	console.log("A user connected");
	socket.broadcast.emit("message", "A USER has joined");

	socket.on("chat message", (msg) => {
		io.emit("chat message", name + " ::" + msg);
	});

	socket.on("disconnect", () => {
		console.log("user disconnected");

		io.emit("message", "A USER has LEFT!!");
	});
});

server.listen(port, () => {
	console.log(`listening at http://localhost:${port}`);
});
