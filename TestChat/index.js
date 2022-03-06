const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const port = process.env.PORT || 4000;
const user = "sanad";
app.get("/", (req, res) => {
	res.sendFile(__dirname + "/index.html");
});
io.on("connection", (socket) => {
	console.log("A user connected");
	console.log(user);
	socket.broadcast.emit("message", "A USER has joined");

	socket.on("chat message", (msg) => {
		io.emit("chat message", msg, user);
	
	});

	socket.on("disconnect", () => {
		console.log("user disconnected");
		console.log(user);
		io.emit("message", "A USER has LEFT!!");
	});
});
server.listen(port, () => {
	console.log(`listening at http://localhost:${port}`);
});
