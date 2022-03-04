const path = require("path");
const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const http = require("http");
const server = http.createServer(app);
app.set("view engine", "ejs");

app.get("/", (req, res) => {
	res.sendFile(__dirname + "/public/views/gamePage.html");
});

app.use(express.static(path.join(__dirname, "public")));

server.listen(port, () => {
	console.log(`listening at http://localhost:${port}`);
});
