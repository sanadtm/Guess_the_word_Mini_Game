const express = require("express");
const http = require("http");
const app = express();
const { Server } = require("socket.io");
const server = http.createServer(app);
const io = new Server(server);
const path = require("path");
const { SocketAddress } = require("net");
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
let onlineUsersID = [];
let rooms = {};


app.post("/room", function (req, res) {
	const { username, nationality, room } = req.body;
	rooms[req.body.room] = { users: {} };
	eachname = req.body.name;
	//console.log(req.body);
	//console.log(userData);

	name_points = { name: req.body.name, points: 15 };
	userData.push(name_points);

	res.render("gamePage.html", { uname: name, userData: userData, rooms: rooms, cnt: 1 });
});

//Send the ary to the client
/* io.on('connection', (socket) => {
	socket.on('ary-answer', (answerArray) => {
		//console.log(answerArray);
		io.emit('ary-answer', answerArray);
	});

}); */




io.on("connection", (socket) => {

	socket.on('ary-answer', (answerArray) => {
		console.log(answerArray);
		io.emit('ary-answer', answerArray);
	});


	console.log("A user connected");
	socket.broadcast.emit("message", "A USER has joined");
	socket.name = eachname;
	socket.on("chat message", (msg) => {
		io.emit("chat message", socket.name + " :: " + msg);
	});
	console.log("socket ID ::" + socket.client.id);
	socket.join("chatroom");
	socket.on("displayUsers", (username) => {
		io.emit("displayUsers", " :: " + username);
	});
	//check
	if (onlineUsersID.length === 0) {
		onlineUsersID.push(socket.client.id);
	} else {
		onlineUsersID.forEach((socketID) => {
			if (socket.client.id === socketID) {
				//display previous users
			} else {
				io.emit("displayPrevUsers", userData);
				socket.on("send_allUsers2", function (data) {
					if (data.name || data.points) {
						console.log("Server :: " + data);
						io.emit("displayPrevUsers", data);
					}
				});
			}
		});
	}
	socket.broadcast.emit("chat message", socket.name + ":: Connected");
	socket.on("disconnect", () => {
		socket.broadcast.emit("chat message", socket.name + ":: Disconnected");
	});
	io.emit("displayUsers", name_points);
	console.log
	console.log(name_points);

	socket.on("send_allUsers", function (data) {
		//io.emit("displayUsers", data);
		io.emit("send_allUsers", data);
		//console.log("testingtttttttttt", data);
		/* if (data.name || data.points) {
			console.log("Server :: " + data);
			io.emit("displayUsers", data);
		} */
	});
	io.to("chatroom").emit("usersInRoom", socket.name);
	// io.emit("displayUsers", userData);
});

server.listen(port, () => {
	console.log(`listening at http://localhost:${port}`);
});
