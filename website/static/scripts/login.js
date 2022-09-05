function isValid() {

    let name = document.getElementById("userName");
    let password = document.getElementById("userPassword");
    let message = document.getElementById("passSame");
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
        message.innerHTML = "Błąd logowania, pozostawiono puste pole.";
        message.style.visibility = "visible";
        return false;
    }

    return true;
}