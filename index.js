const express = require("express");
const app = express();
const http = require("http");
const port = process.env.PORT || 5000;
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
app.get("/", (req, res) => {
	res.sendFile(__dirname + "/index.html");
});
app.post("/register", function (req, res) {
	console.log(req.body);
	res.redirect("./gamePage.html");
});
app.post("/success", function (req, res) {
	console.log(req.body);
	res.redirect("./gamePage.html");
	res.end();
});
io.on("connection", (socket) => {
	socket.on("chat message", (msg) => {
		io.emit("chat message", msg);
	});
});
server.listen(port, () => {
	console.log(`listening at http://localhost:${port}`);
});
