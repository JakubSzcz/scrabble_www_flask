function isValid() {

    //sprawdza czy puste
    let name = document.getElementById("userName");
    let password = document.getElementById("userPassword");
    let password2 = document.getElementById("userPassword2");
    let email = document.getElementById("userEmail");
    let message = document.getElementById("passSame");
    let elements = [name, password, password2, email];
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
        message.innerHTML = "Błąd logowania, pozostawiono puste pole.";
        message.style.visibility = "visible";
        return false;
    } else {
        message.style.visibility = "hidden";
    }

    //sprawdza czy hasło takie samo
    if (password.value !== password2.value) {
        message.innerHTML = "Błąd logowania, hasła są różne.";
        message.style.visibility = "visible";
        try {
            password2.classList.remove('is-valid');
        } catch { }
        password2.classList.add('is-invalid');
        return false;
    }

    return true;
}