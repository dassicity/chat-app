var socket = io();

var user_list = document.getElementById("active_users_list");
var room_list = document.getElementById("active_rooms_list");
var message = document.getElementById("messageInput");
var send_message_btn = document.getElementById("send_message_btn");
var room_input = document.getElementById("roomInput");
var new_rrom_btn = document.getElementById("room_add_icon_holder");
var chat_display = document.getElementById("chat");

var default_chat_room = "global_chat";
var my_username = "";

socket.on("connect", () => {
    my_username = prompt("Enter Name :");
    socket.emit("create_user", my_username);    // this my_username argument will be received in the backend at the argument of the callback function of this connection
})
