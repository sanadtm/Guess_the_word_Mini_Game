const path = require("path");
const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
app.get("/", (req, res) => {
	res.sendFile(__dirname + "/public/views/gamePage.html");
});

app.use(express.static(path.join(__dirname, "public")));

io.on("connection", (socket) => {
	socket.on("chat message", (msg) => {
		io.emit("chat message", msg);
	});
});
server.listen(port, () => {
	console.log(`listening at http://localhost:${port}`);
});
