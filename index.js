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
let onlineUsers = [];
let rooms = {};
let userGetPointsArr = [];

app.post("/room", function (req, res) {
	const { username, nationality, room } = req.body;
	rooms[req.body.room] = { users: {} };
	eachname = req.body.name;

	onlineUsers.push(eachname);

	name_points = { name: req.body.name, points: 0 };
	userData.push(name_points);

	res.render("gamePage.html", { uname: name, userData: userData, rooms: rooms, cnt: 1 });
});

io.on("connection", (socket) => {
	socket.on("ary-answer", (answerArray) => {
		io.emit("ary-answer", answerArray);
	});

	socket.on("country-answer", (answerArrayCountry) => {
		io.emit("country-answer", answerArrayCountry);
	});

	socket.on("fruit-answer", (answerArrayFruit) => {
		//console.log(answerArray);
		io.emit("fruit-answer", answerArrayFruit);
	});

	socket.on("user get points", (userGetPoints) => {
		userGetPointsArr.push(userGetPoints);
		let combineArr = userGetPointsArr.concat(userGetPoints);
	});

	io.emit("send_allUsers1", userData);
	console.log("line 50", userData);

	//console.log("A user connected");
	socket.broadcast.emit("message", "A USER has joined");
	socket.name = eachname;
	socket.on("chat message", (msg) => {
		io.emit("chat message", socket.name + " :: " + msg);
		console.log("chat box socket.name", socket.name);
	});

	io.emit("singleUser", eachname);

	console.log("current player ", socket.name);
	io.emit("current Player", onlineUsers);
	socket.join("chatroom");

	// testing user data
	if (userData.length === 0) {
	} else {
		userData.forEach((socketID) => {
			if (socket.client.id === socketID) {
			} else {
				socket.on("send_allUsers12", function (data) {
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

	io.to("chatroom").emit("usersInRoom", socket.name);
});

// server.listen(port, () => {
// 	console.log(`listening at http://localhost:${port}`);
// });
//heroku game serve
server.listen(process.env.PORT || port);
