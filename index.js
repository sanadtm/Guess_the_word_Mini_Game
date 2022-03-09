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
let onlineUsersID = [];
let rooms = {};

app.post("/room", function (req, res) {
	const { username, nationality, room } = req.body;
	rooms[req.body.room] = { users: {} };
	eachname = req.body.name;
	name_points = { name: req.body.name, points: 0 };
	userData.push(name_points);

	res.render("gamePage.html", { uname: name, userData: userData, rooms: rooms, cnt: 1 });
});

io.on("connection", (socket) => {
	socket.on("ary-answer", (answerArray) => {
		//console.log(answerArray);
		io.emit("ary-answer", answerArray);
	});

	io.emit("get_users", userData);
	console.log("Eachname : " + eachname);
	io.emit("correctUser", socket.name);
	//	io.emit("displayUsers", name_points);
	io.emit("send_allUsers1", userData);
	console.log("Line 45: ", userData);

	socket.broadcast.emit("message", "A USER has joined");

	socket.on("chat message", (msg) => {
		io.emit("chat message", socket.name + " :: " + msg);
	});
	//console.log("socket ID ::" + socket.client.id);
	socket.join("chatroom");
	// socket.on("displayUsers", (username) => {
	// 	io.emit("displayUsers", " :: " + username);
	// });

	//console.log;
	console.log(name_points);
	//console.log("User Data" + userData.name);
	socket.on("send_allUsers", function (ALLPlayers) {
		console.log("server test : ", ALLPlayers);
		io.emit("send_allUsers1", ALLPlayers);
	});
	//sending to client

	if (onlineUsersID.length === 0) {
		onlineUsersID.push(socket.client.id);
	} else {
		onlineUsersID.forEach((socketID) => {
			if (socket.client.id === socketID) {
				//display previous users
			} else {
				//io.emit("displayPrevUsers", userData);
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

	//io.to("chatroom").emit("usersInRoom", socket.name);
	// io.emit("displayUsers", userData);
});

server.listen(port, () => {
	console.log(`listening at http://localhost:${port}`);
});
