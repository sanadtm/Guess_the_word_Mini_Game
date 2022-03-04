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
var globalArray = {
	user: "sanad",
};
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.get("/", (req, res) => {
	res.render("index.html");
});

app.post("/submit", function (req, res) {
	console.log(req.body.name);
	console.log(req.body.GameID);
	let name = req.body.name;
	res.render("gamePage.html", { uname: name });
	//res.json({ name1: req.body.name });
	io.on("connection", (socket) => {
		socket.on("chat message", (msg) => {
			io.emit("chat message", req.body.name + " :: " + msg);
		});
	});
	io.on("connection", (socket) => {
		socket.emit("chat message", req.body.name + ":: Connected");
		socket.on("disconnect", () => {
			socket.emit("chat message", req.body.name + ":: Disconnected");
		});
	});
});

// io.on("connection", (socket) => {
// 	socket.on("chat message", (msg) => {
// 		io.emit("chat message", msg);
// 	});
// });
server.listen(port, () => {
	console.log(`listening at http://localhost:${port}`);
});
