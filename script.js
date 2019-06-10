var selectedChannelId;
var activeChannelId;

$(document).ready(function () {
    //wird beim erzeugen eines channels aufgerufen
    createChannel();
    //wird beim nach dem klicken auf einen channel aufgerufen
    showCreateUsernamePopup();
    //erstellt einen username fuer den channel
    createUsername();

});

window.onload = function () {
    //laedt die channels wenn die seite aufgerufen wird
    loadChannels();
    //aktualisiert die channels alle 10 sek
    setInterval(loadChannels, 10000);
}

function createUsername() {
    $("#smbtUser, .popup-overlay").on("click", function () {
        var username = $("#user").val();
        if (username == "") {
            alert("Please enter a username!");
        }
        makePOSTrequest("http://34.243.3.31:8080/channels/"+ selectedChannelId +"/messages", username, userCreateToJsonString);
        
        hideCreateUsernamePopup();

        facilitateMessageBox();
    });
}

function createChannel(){
    $("#cForm").submit(function (event) {
        makePOSTrequest("http://34.243.3.31:8080/channels", $("form"), formToJsonString);
    });
}

function facilitateMessageBox() {
    setInterval(loadMessages, 1000);

    showTextField();

    showChannelInfo();

    sendMessage();
}

function sendMessage() {
    $("#send").click(function () {
        makePOSTrequest("http://34.243.3.31:8080/channels/"+ selectedChannelId +"/messages", $("#messageInput"), messageFormToJsonString);
    })
}

async function showChannelInfo() {
    let data = await makeGETrequest("http://34.243.3.31:8080/channels/"+ activeChannelId);
    $("#channelName").text(data.name);
    $("#channelTopic").text(data.topic);
}

async function loadMessages() {
    console.log("messages have been updated!")
    let data = await makeGETrequest("http://34.243.3.31:8080/channels/"+ selectedChannelId +"/messages");
    $(".messages").empty();
    $.each(data._embedded.messageList, function (key, value) {
        $(".messages").append(value.content + "<br>");
    });
}

async function loadChannels() {
    console.log("channels have been updated!")
    let data = await makeGETrequest("http://34.243.3.31:8080/channels");
    $("#channelList").empty();
    $.each(data._embedded.channelList, function (key, value) {
        $("#channelList").append($("<li>").attr("id", value.id).attr("class", ".").text(value.name));
    });
}

//sendet einen get request
function makeGETrequest(url) {
    return $.ajax({
        url: url,
        headers: {
            "X-Group-Token": accessToken,
        },
        method: "GET",
        dataType: "json",
    });
}

//sendet einen post request
function makePOSTrequest(url, data, funct) {
    $.ajax({
        url: url,
        headers: {
            "X-Group-Token": accessToken,
        },
        method: "POST",
        contentType: "application/json",
        data: funct(data)
    });
}

function hideCreateUsernamePopup() {
    $(".popup-overlay, .popup-content").removeClass("active");
    activeChannelId = selectedChannelId;
}

function showCreateUsernamePopup() {
    $(".channelList").on("click", "li", function () {
        selectedChannelId = $(this).attr("id");
        $(".popup-overlay, .popup-content").addClass("active");
    });
}

function showTextField() {
    $(".message-box").addClass("active");
}

function userCreateToJsonString(username) {
    return JSON.stringify({ "creator": username, "content": username +" has joined the channel." });
}

function formToJsonString(form) {
    return JSON.stringify({ "name": $(form).find('[name="name"]').val(), "topic": $(form).find('[name="topic"]').val() });
}

function messageFormToJsonString(textarea) {
    return JSON.stringify({ "creator": "test4", "content": textarea.val() });
}