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
});

send_message_btn.addEventListener('click', () => {
    socket.emit('send_message', message.value);
    message.value = "";
});

socket.on("update_chat", (type, data) => {
    if (type === "INFO") {
        chat_display.innerHTML = `<div class='announcement'><span>${data}</span></div>`;
    } else {

        chat_display.innerHTML += `<div class="message_holder ${type === my_username ? "me" : ""}">
                                    <div class="pic"></div>
                                        <div class="message_box">
                                            <div id="message" class="message">
                                                <span class="message_name">${type}</span>
                                                <span class="message_text">${data}</span>
                                            </div>
                                    </div>
                                </div>`;
    }

    chat_display.scrollTop = chat_display.scrollHeight;
});

function changeRoom(room) {
    if (room != currentRoom) {
        socket.emit("updateRooms", room);
        document.getElementById(currentRoom).classList.remove("active_item");
        currentRoom = room;
        document.getElementById(currentRoom).classList.add("active_item");
    }
}