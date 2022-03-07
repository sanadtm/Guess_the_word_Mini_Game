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
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.get("/", (req, res) => {
	res.render("index.html");
});
let name_points = {};
let eachname;
let name;
let userData = [];
let userArray = [];
let rooms = {};
app.post("/room", function (req, res) {
	const { username, nationality, room } = req.body;
	userData.push(req.body);
	rooms[req.body.room] = { users: {} };
	eachname = req.body.name;
	//console.log(req.body);
	name_points = { name: req.body.name, points: 15 };
	res.render("gamePage.html", { uname: name, userData: userData, rooms: rooms, cnt: 1 });
});

io.on("connection", (socket) => {
	console.log("A user connected");
	socket.broadcast.emit("message", "A USER has joined");
	socket.name = eachname;
	socket.on("chat message", (msg) => {
		io.emit("chat message", socket.name + " :: " + msg);
	});
	socket.broadcast.emit("chat message", socket.name + ":: Connected");
	socket.on("disconnect", () => {
		socket.broadcast.emit("chat message", socket.name + ":: Disconnected");
	});

	io.emit("displayUsers", name_points);

	// io.emit("displayUsers", userData);
});

server.listen(port, () => {
	console.log(`listening at http://localhost:${port}`);
});
