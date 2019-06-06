$(document).ready(function () {
    $("form").submit(function (event) {
        
        makePOSTrequest("", $(" form "), formToJsonString);

        event.preventDefault();
    });

    showCreateUsernamePopup();

    createUsername();
});

window.onload = async function () {
    let data = await makeGETrequest("");
    $("#results").empty();
    $.each(data._embedded.channelList, function (key, value) {
        $("#results").append(JSON.stringify(value.name) + "<br>");
    });
}

async function createUsername() {
    $("#smbtUser, .popup-overlay").on("click", function () {
        var username = $("#user").val();
        if (username == "") {
            alert("Please enter a username!");
        }
        makePOSTrequest("", username, userCreateToJsonString);
        
        hideCreateUsernamePopup();

        setInterval(loadMessages, 1000);

        showTextField();
    });
}

function hideCreateUsernamePopup() {
    $(".popup-overlay, .popup-content").removeClass("active");
}

function showCreateUsernamePopup() {
    $("#results").click(function () {
        $(".popup-overlay, .popup-content").addClass("active");
    });
}

function userCreateToJsonString(username) {
    return JSON.stringify({ "creator": username, "content": username +" has joined the channel." });
}

function formToJsonString(form) {
    return JSON.stringify({ "name": $(form).find('[name="name"]').val(), "topic": $(form).find('[name="topic"]').val() });
}

async function loadMessages() {
    let data = await makeGETrequest("");
    $(".messages").empty();
    console.log("Feuer frei!");
    $.each(data._embedded.messageList, function (key, value) {
        $(".messages").append(JSON.stringify(value.content) + "<br>");
    });
}

function showTextField() {
    $(".message-box").addClass("active");
}

function makeGETrequest(url) {
    return $.ajax({
        url: url,
        headers: {
            "X-Group-Token": "",
        },
        method: "GET",
        dataType: "json",
    });
}

function makePOSTrequest(url, data, funct) {
    $.ajax({
        url: url,
        headers: {
            "X-Group-Token": "",
        },
        method: "POST",
        contentType: "application/json",
        data: funct(data)
    });
}