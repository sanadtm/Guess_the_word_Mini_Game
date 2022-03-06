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

app.set("views", __dirname + "/public/views");
app.engine("html", require("ejs").renderFile);
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.get("/", (req, res) => {
	res.render("index.html");
});
let user = { name: {}, nationality: {} };
const rooms = {};
app.get("/:room", (req, res) => {
	console.log(req.body);
	res.render("gamePage.html", { roomName: req.params.room });
});

app.post("/room", function (req, res) {
	const { username, nationality, room } = req.body;

	rooms[req.body.room] = { users: {} };
	users = req.body;
	//console.log(req.body);
	let name = req.body.name;
	res.render("gamePage.html", { uname: name, users: users, rooms: rooms, cnt: 1 });

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

	//res.json({ name1: req.body.name });
	// io.emit("user-joined", req.body);

	// io.on("connection", (socket) => {
	// 	socket.on("chat message", (msg) => {
	// 		io.emit("chat message", req.body.name + " :: " + msg);
	// 		console.log("Rooms " + Object.keys(socket.rooms));
	// 		console.log("Rooms " + socket.rooms);
	// 		socket.on("disconnect", () => {
	// 			socket.emit("chat message", req.body.name + ":: Disconnected");
	// 		});
	// 	});
	// });

	// io.on("connection", (socket) => {
	// 	socket.emit("chat message", req.body.name + ":: Connected");

	// 	socket.on("disconnect", () => {
	// 		socket.emit("chat message", req.body.name + ":: Disconnected");
	// 	});
	// });
});
app.use((req, res, next) => {
	const err = new Error("Not Found");
	err.status = 404;
	next(err);
});

app.use((err, req, res, next) => {
	res.locals.error = err;
	const status = err.status || 500;
	res.status(status);
	//res.render("error");
});
server.listen(port, () => {
	console.log(`listening at http://localhost:${port}`);
});
