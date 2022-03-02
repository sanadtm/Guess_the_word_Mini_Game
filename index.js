const express = require("express");
const app = express();
const path = require("path");
const http = require("http");
const port = process.env.PORT || 5000;
const server = http.createServer(app);
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.get("/", (req, res) => {
	res.sendFile(__dirname + "/index.html");
});

app.post("/register", function (req, res) {
	console.log(req.body);
	res.send(req.body);
	const { username, nationality, gameRoomId } = req.body;
	//res.setHeader("Content-Type", "text/html");
	res.render("gamePage.html", { username, nationality, gameRoomId });
	res.end;
});

// io.on("connection", (socket) => {
// 	socket.on("chat message", (msg) => {
// 		io.emit("chat message", msg);
// 	});
// });
server.listen(port, () => {
	console.log(`listening at http://localhost:${port}`);
});
