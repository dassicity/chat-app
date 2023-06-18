const express = require('express');
const http = require('http');

const { Server } = require('socket.io');

const app = express();
require('dotenv').config();

const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 1339;

// default middlewares
app.use(express.json());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));

const usernames = {};
const chat_rooms = [
    { name: "global_chat", creator: "anon" },
    { name: "psychology", creator: "anon" },
    { name: "chess", creator: "anon" }
]

io.on("connection", () => {
    socket.on("create_user", (username) => {
        socket.username = username;
        usernames[username] = username;
        socket.current_room = "global_chat";

        console.log(socket);
    });
})

server.listen(PORT, () => {
    console.log(`Successfully running on port ${PORT}`);
});