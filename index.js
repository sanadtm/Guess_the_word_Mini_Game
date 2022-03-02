const express = require("express");
const http = require("http");
const app = express();
const { Server } = require("socket.io");
const server = http.createServer(app);
const io = new Server(server);
const path = require("path");
const port = process.env.PORT || 4000;
app.use(express.static(path.join(__dirname, "public")));

app.set("views", __dirname + "/public/views");
app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.get("/", (req, res) => {
	res.sendFile(__dirname + "/index.html");
});

app.post("/submit", function (req, res) {
	console.log(req.body.name);
	console.log(req.body.GameID);
	//res.send(req.body);
	const { username, nationality, gameRoomId } = req.body;
	res.sendFile(__dirname + "/public/views/gamePage.html");

	io.on("connection", (socket) => {
		socket.on("chat message", (msg) => {
			io.emit("chat message", req.body.name + " :: " + msg);
		});
	});
	res.redirect;
});

// io.on("connection", (socket) => {
// 	socket.on("chat message", (msg) => {
// 		io.emit("chat message", msg);
// 	});
// });
server.listen(port, () => {
	console.log(`listening at http://localhost:${port}`);
});
