var socket = io();

var user_list = document.getElementById("active_users_list");
var room_list = document.getElementById("active_rooms_list");
var message = document.getElementById("messageInput");
var send_message_btn = document.getElementById("send_message_btn");
var room_input = document.getElementById("roomInput");
var new_room_btn = document.getElementById("room_add_icon_holder");
var chat_display = document.getElementById("chat");

var current_room = "global_chat";
var my_username = "";

// prompt user for name when s/he enters the page
socket.on("connect", async () => {
    my_username = prompt("Enter Name :");
    console.log("Inside Connect prompt " + my_username);
    socket.emit("create_user", my_username);    // this my_username argument will be received in the backend at the argument of the callback function of this connection
});

//send  message when user clicks send button
send_message_btn.addEventListener('click', () => {
    socket.emit('send_message', message.value);
    message.value = "";
});

// Send message on enter key press
message.addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
        send_message_btn.click();
    }
});

// Create new room when user clicks new room button
new_room_btn.addEventListener("click", function () {
    // socket.emit("createRoom", prompt("Enter new room: "));
    let room_name = room_input.value.trim();
    if (room_name !== "") {
        socket.emit("create_room", room_name);
        room_input.value = "";
    }
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

socket.on("update_users", function (usernames) {
    user_list.innerHTML = "";
    // console.log("usernames returned from server", usernames);
    for (var user in usernames) {
        user_list.innerHTML += `<div class="user_card">
                                <div class="pic"></div>
                                <span>${user}</span>
                              </div>`;
    }
});

socket.on("update_rooms", function (rooms) {
    room_list.innerHTML = "";

    for (var index in rooms) {
        room_list.innerHTML += `<div class="room_card" id="${rooms[index].name}"
                                  onclick="change_room('${rooms[index].name}')">
                                  <div class="room_item_content">
                                      <div class="pic"></div>
                                      <div class="roomInfo">
                                      <span class="room_name">#${rooms[index].name}</span>
                                      <span class="room_author">${rooms[index].creator}</span>
                                      </div>
                                  </div>
                              </div>`;
    }

    document.getElementById(current_room).classList.add("active_item");
});

function change_room(room) {
    if (room != current_room) {
        socket.emit("update_rooms", room);
        document.getElementById(current_room).classList.remove("active_item");
        current_room = room;
        document.getElementById(current_room).classList.add("active_item");
    }
}