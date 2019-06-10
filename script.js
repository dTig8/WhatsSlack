var selectedChannel;

$(document).ready(function () {
    $("form").submit(function (event) {
        
        makePOSTrequest("http://34.243.3.31:8080/channels", $(" form "), formToJsonString);

        event.preventDefault();
    });

    showCreateUsernamePopup();

    createUsername();
});

window.onload = async function () {
    let data = await makeGETrequest("http://34.243.3.31:8080/channels");
    $("#channelList").empty();
    $.each(data._embedded.channelList, function (key, value) {
        $("#channelList").append($("<li>").attr("id", value.id).attr("class", ".").text(value.name));
    });
}

function createUsername() {
    $("#smbtUser, .popup-overlay").on("click", function () {
        var username = $("#user").val();
        if (username == "") {
            alert("Please enter a username!");
        }
        makePOSTrequest("http://34.243.3.31:8080/channels/"+ selectedChannel +"/messages", username, userCreateToJsonString);
        
        hideCreateUsernamePopup();

        facilitateMessageBox();
    });
}

function facilitateMessageBox() {
    setInterval(loadMessages, 1000);

    showTextField();

    sendMessage();
}

function sendMessage() {
    $("#send").click(function () {
        makePOSTrequest("http://34.243.3.31:8080/channels/"+ selectedChannel +"/messages", $("#messageInput"), messageFormToJsonString);
    })
}

async function loadMessages() {
    let data = await makeGETrequest("http://34.243.3.31:8080/channels/"+ selectedChannel +"/messages");
    $(".messages").empty();
    console.log("Feuer frei!");
    $.each(data._embedded.messageList, function (key, value) {
        $(".messages").append(JSON.stringify(value.content) + "<br>");
    });
}

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
}

function showCreateUsernamePopup() {
    $(".channelList").on("click", "li", function () {
        selectedChannel = $(this).attr("id");
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
    console.log(textarea.val());
    return JSON.stringify({ "creator": "test4", "content": textarea.val() });
}