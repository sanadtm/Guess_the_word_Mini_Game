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
let users = { name: {}, nationality: {} };
const rooms = {};

app.get("/:room", (req, res) => {
	if (rooms[req.params.room] == null) {
		return res.redirect("/");
	}
	res.render("room", { roomName: req.params.room });
});

app.post("/room", function (req, res) {
	rooms[req.body.room] = { users: {} };

	users = req.body;
	console.log(req.body);
	//console.log(req.body.GameID);
	let name = req.body.name;

	res.render("gamePage.html", { uname: name, users: users, rooms: rooms });
	//res.json({ name1: req.body.name });
	io.emit("user-joined", req.body);

	io.on("connection", (socket) => {
		socket.on("chat message", (msg) => {
			io.emit("chat message", req.body.name + " :: " + msg);
			console.log("Rooms " + Object.keys(socket.rooms));
			console.log("Rooms " + socket.rooms);
			socket.on("disconnect", () => {
				socket.emit("chat message", req.body.name + ":: Disconnected");
			});
		});
	});
	app.post("/room", function (req, res) {
		rooms[req.body.room] = { users: {} };

		users = req.body;
		console.log(req.body);
		//console.log(req.body.GameID);
		let name = req.body.name;

		res.render("gamePage.html", { uname: name, users: users, rooms: rooms });
		//res.json({ name1: req.body.name });
		io.emit("user-joined", req.body);

		io.on("connection", (socket) => {
			socket.on("chat message", (msg) => {
				io.emit("chat message", req.body.name + " :: " + msg);
				console.log("Rooms " + Object.keys(socket.rooms));
				console.log("Rooms " + socket.rooms);
				socket.on("disconnect", () => {
					socket.emit("chat message", req.body.name + ":: Disconnected");
				});
			});
		});

		io.on("connection", (socket) => {
			socket.emit("chat message", req.body.name + ":: Connected");

			socket.on("disconnect", () => {
				socket.emit("chat message", req.body.name + ":: Disconnected");
			});
		});
	});
	io.on("connection", (socket) => {
		socket.emit("chat message", req.body.name + ":: Connected");

		socket.on("disconnect", () => {
			socket.emit("chat message", req.body.name + ":: Disconnected");
		});
	});
});

server.listen(port, () => {
	console.log(`listening at http://localhost:${port}`);
});
