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

io.on("connection", (socket) => {
    socket.on("create_user", (username) => {
        socket.username = username;
        usernames[username] = username;
        socket.current_room = "global_chat";
        // console.log(socket);
        socket.join("global_chat");
        socket.emit("update_chat", "INFO", "You have joined Global Chat");
    });

    socket.on("send_message", (data) => {
        io.sockets.to(socket.current_room).emit("update_chat", socket.username, data);
    });

    socket.on("update_rooms", (room) => {
        socket.broadcast
            .to(socket.currentRoom)
            .emit("updateChat", "INFO", socket.username + " left room");
        socket.leave(socket.currentRoom);
        socket.current_room = room;
        socket.join(room);
        socket.emit("update_chat", "INFO", "You have joined " + room + " room");
        socket.broadcast.to(room).emit("update_chat", "INFO", socket.username + " has joined " + room + " room");
    });
})

server.listen(PORT, () => {
    console.log(`Successfully running on port ${PORT}`);
});