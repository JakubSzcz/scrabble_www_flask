
var socket = io.connect('http://127.0.0.1:5000'); //łacze z serwerm

function isValid(numerek) {

    let name;
    let password;
    let message;
    if (numerek === 0) {
        name = document.getElementById("roomName");
        password = document.getElementById("roomPassword");
        message = document.getElementById("wrongPass");
    } else if (numerek === 1) {
        name = document.getElementById("roomName1");
        password = document.getElementById("roomPassword1");
        message = document.getElementById("wrongPass1");
    }
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

function resetForm(numerek) {

    let name;
    let password;
    let message;
    if (numerek === 0) {
        name = document.getElementById("roomName");
        password = document.getElementById("roomPassword");
        message = document.getElementById("wrongPass");
    } else if (numerek === 1) {
        name = document.getElementById("roomName1");
        password = document.getElementById("roomPassword1");
        message = document.getElementById("wrongPass1");
    }
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
    $('#joinGameModal').on('click', function () {   //stworz gre
        var numer = document.getElementById("roomName").value;
        var haslo = document.getElementById("roomPassword").value;

        socket.emit("stworz_gre", numer, haslo)
    });

    $('#joinGameModal1').on('click', function () {
        var numer = document.getElementById("roomName1").value;
        var haslo = document.getElementById("roomPassword1").value;

        socket.emit("dolacz_do_gry", numer, haslo)
    });

    socket.on("redirect_to_game", function () {
        var numer = document.getElementById("roomName").value;
        var haslo = document.getElementById("roomPassword").value;
        window.location.href = "/game" + "?" + numer + "?" + haslo + "?";
    });

    socket.on("redirect_to_game1", function () {
        var numer = document.getElementById("roomName1").value;
        var haslo = document.getElementById("roomPassword1").value;
        window.location.href = "/game" + "?" + numer + "?" + haslo + "?";
    });

    socket.on("zle_haslo_do_gry", function () {
        document.getElementById("wrongPass1").innerHTML = "Błąd, niepoprawne haslo!";
        document.getElementById("roomPassword1").classList.add("is-invalid");
        try {
            document.getElementById("roomPassword1").classList.remove("is-valid");
        } catch { }
        document.getElementById("wrongPass1").style.visibility = "visible";
    });

    socket.on("nie_ma_takiego_pokoju", function () {
        document.getElementById("wrongPass1").innerHTML = "Błąd, nie ma takiego pokoju!";
        document.getElementById("roomName1").classList.add("is-invalid");
        try {
            document.getElementById("roomName1").classList.remove("is-valid");
        } catch { }
        document.getElementById("wrongPass1").style.visibility = "visible";
    });

    socket.on("pokoj_juz_istnieje", function () {
        document.getElementById("wrongPass").innerHTML = "Błąd, istnieje już taki pokoj!";
        document.getElementById("roomName").classList.add("is-invalid");
        try {
            document.getElementById("roomName").classList.remove("is-valid");
        } catch { }
        document.getElementById("wrongPass").style.visibility = "visible";
    });
});