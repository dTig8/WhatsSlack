$(document).ready(function () {
    $("form").submit(function (event) {
        $.ajax({
            url: "add url here",
            headers: {
                "X-Group-Token": "add token here",
            },
            method: "POST",
            contentType: "application/json",
            data: formToJsonString($(" form ")),
            success: function () {
                alert("Creating the new Channel was successful!");
            },
            error: function () {
                alert("Failure! This channel name is already taken!");
            }
        });
        event.preventDefault();
    });

    showCreateUsernamePopup();

    createUsername();
});

window.onload = function () {
    $.ajax({
        url: "add url here",
        headers: {
            "X-Group-Token": "add token here",
        },
        method: "GET",
        dataType: "json",
    }).done(function (data) {
        $("#results").empty();
        $.each(data._embedded.channelList, function (key, value) {
            $("#results").append(JSON.stringify(value.name) + "<br>");
        });
    });
}

function createUsername() {
    $("#smbtUser, .popup-overlay").on("click", function () {
        var username = $("#user").val();
        if (username == "") {
            alert("Please enter a username!");
        }
        $.ajax({
            url: "add url here",
            headers: {
                "X-Group-Token": "add token here",
            },
            method: "POST",
            contentType: "application/json",
            data: userCreateToJsonString(username),
            success: function () {
                alert("Joining the channel was successful");
            },
            error: function () {
                alert("Failure! Somehow couldn't join channel!");
            }
        });

        hideCreateUsernamePopup();
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