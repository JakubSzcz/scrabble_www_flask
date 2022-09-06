
var socket = io.connect('http://127.0.0.1:5000'); //łacze z serwerm

function isValid() {

    let name = document.getElementById("roomName");
    let password = document.getElementById("roomPassword");
    let message = document.getElementById("wrongPass");
    let elements = [name, password];
    let flag = false;

    for (let temp of elements) {
        if (temp.value.trim() === "") {
            temp.classList.add('is-invalid');
            flag = true;
        } else {
            for (let temp of elements) {
                if (temp.value.trim() !== "") {
                    try {
                        temp.classList.remove('is-invalid');
                    } catch { }
                    temp.classList.add('is-valid');
                }
            }
        }
    }

    if (flag) {
        message.innerHTML = "Błąd dołączania, pozostawiono puste pole.";
        message.style.visibility = "visible";
        return false;
    }

    return true;
}

function resetForm() {

    let name = document.getElementById("roomName");
    let password = document.getElementById("roomPassword");
    let message = document.getElementById("wrongPass");
    let elements = [name, password];

    for (let temp of elements) {
        try {
            temp.classList.remove('is-invalid');
            temp.classList.remove('is-valid');
        } catch { }
    }
    message.style.visibility = "hidden";

    return true;
}

$(document).ready(function () {
    $('#joinGameModal').on('click', function () {
        console.log("numer" + "testnumeru")
        var numer = document.getElementById("roomName").value;
        var haslo = document.getElementById("roomPassword").value;

        socket.emit("dolacz_do_gry", numer, haslo)
    });

    socket.on("redirect_to_game", function () {
        var numer = document.getElementById("roomName").value;
        window.location.href = "/game" + "?" + numer;
    });
});