// zmienna
var historiaRuchow = []; // tablica wsporzednych wybranych przyciskow z planszy- STRING
var czyMogeKopiowac = false; // flaga czy moge przenieść litere z reki na tablice -bool
var czyWymiana = false; // flaga czy aktualnie moge przeprowadzic wymiane, np. czy nie wybrałem wczesniej litery z reki- bool
var literaDoKopiowania = ""; //wartosc litery do skopiowania z reki do planszy- STRING
let planszaReka = document.getElementById("rekaDiv"); //div z literami w rece- obiekt div
var historiaRuchowReka = []; //tablica wsporzednych wybranych przyciskow z reki- STRING
var plansza = document.getElementById("planszaDiv"); // div z plansza do gry na litery- obiekt div
var czyMogePotwierdzic = true;
var czyMogeWybracLitere = true; //czy moge znow kliknac na litere na rece


// tworzenie DOM
// div z literami w rece
for (let i = 0; i < 2; i++) {
    let wierszReka = document.createElement("div"); //wiersz
    wierszReka.setAttribute('class', "row align-items-start mb-2 g-2");
    wierszReka.setAttribute('id', ('wierszReka' + i.toString()));
    for (let j = 0; j < 4; j++) {
        let literaKontenerReka = document.createElement("div"); //div opakowujacy
        literaKontenerReka.setAttribute('class', "col-sm");
        let literaBtnReka = document.createElement("div"); //przycisk
        literaBtnReka.setAttribute('class', "btn btn-primary mojaLiteraReka");
        literaBtnReka.setAttribute('id', ('literaBtnReka' + i.toString() + "," + j.toString())); //id przycisku w rece: literaBtnRekaX,Y
        let literaReka = document.createElement("h1");
        literaReka.setAttribute('id', ('literaReka' + i.toString() + j.toString())); //id litery na przycisku w rece: literaRekaXY
        literaReka.innerHTML = losujLitere(); //losuje poczatkowo litere
        literaBtnReka.appendChild(literaReka);
        literaBtnReka.setAttribute('onclick', "return kopiujWartosc(this);"); //po nacisnieciu wywoluje kopiujWarosc, this-> obiekt wciśniety Btn
        literaKontenerReka.appendChild(literaBtnReka);
        wierszReka.append(literaKontenerReka);
    }
    planszaReka.append(wierszReka);
}

//div z plansza do gry 
for (let i = 0; i < 11; i++) {
    let wiersz = document.createElement("div"); //div z wierszem na przyciski
    wiersz.setAttribute('class', "row align-items-start mb-2 g-2");
    wiersz.setAttribute('id', ('wiersz' + i.toString()));
    for (let j = 0; j < 11; j++) {
        let literaKontener = document.createElement("div"); //div opakowywujacy przycisk
        literaKontener.setAttribute('class', "col-sm");
        let literaBtn = document.createElement("div"); //przycisk z litera
        literaBtn.setAttribute('class', "btn btn-normal mojaLitera");
        literaBtn.setAttribute('id', ('literaBtn' + i.toString() + "," + j.toString())); //id przycisku: literaBtnX,Y
        let litera = document.createElement("h1"); // litera w przycisku
        litera.innerHTML = "";
        litera.setAttribute('id', ('litera' + i.toString() + j.toString())); //id litery: literaXY
        literaBtn.appendChild(litera);
        literaBtn.setAttribute('onclick', "return skopiujWartosc(this);"); //po nacisnieciu wywoluje skopiujWartosc, this-> obiekt wciśniety Btn
        literaKontener.appendChild(literaBtn);
        wiersz.append(literaKontener);
    }
    plansza.append(wiersz);
}

//kolorowanie pol specjalnych:
//przekątne
for (let i = 0; i < 11; i++) {
    if (i !== 5) {
        document.getElementById("literaBtn" + i.toString() + "," + i.toString()).classList.remove("btn-normal");
        document.getElementById("literaBtn" + i.toString() + "," + (10 - i).toString()).classList.remove("btn-normal");

        if (i === 1 || i === 9) {
            document.getElementById("literaBtn" + i.toString() + "," + i.toString()).classList.add("btn-slowo2");
            document.getElementById("literaBtn" + i.toString() + "," + (10 - i).toString()).classList.add("btn-slowo2");
        } else if (i % 2 == 0) {
            document.getElementById("literaBtn" + i.toString() + "," + i.toString()).classList.add("btn-litera2");
            document.getElementById("literaBtn" + i.toString() + "," + (10 - i).toString()).classList.add("btn-litera2");
        }
        else {
            document.getElementById("literaBtn" + i.toString() + "," + i.toString()).classList.add("btn-litera3");
            document.getElementById("literaBtn" + i.toString() + "," + (10 - i).toString()).classList.add("btn-litera3");
        }
    }
}
//pole startu
document.getElementById("literaBtn5,5").classList.remove("btn-normal");
document.getElementById("literaBtn5,5").classList.add("btn-start")
//trojkaty po bokach
for (let i = 0; i <= 10; i = i + 10) {
    document.getElementById("literaBtn" + (i).toString() + "," + "5").classList.add("btn-litera3");
}
for (let i = 4; i <= 6; i = i + 2) {
    document.getElementById("literaBtn" + "1" + "," + (i).toString()).classList.add("btn-litera2");
    document.getElementById("literaBtn" + "9" + "," + (i).toString()).classList.add("btn-litera2");
}
for (let i = 0; i <= 10; i = i + 10) {
    document.getElementById("literaBtn" + "5" + "," + (i).toString()).classList.add("btn-slowo2");
}
for (let i = 4; i <= 6; i = i + 2) {
    document.getElementById("literaBtn" + (i).toString() + "," + "1").classList.add("btn-litera2");
    document.getElementById("literaBtn" + (i).toString() + "," + "9").classList.add("btn-litera2");
}


//funkcje

//kopiuje wartosc nacisnietej litery z reki, wartosc zapisywana w zmiennej literaDoKopiowania
function kopiujWartosc(przycisk) {
    if (!czyWymiana) { //jesli nie nacisnal przycisku wymien
        if (czyMogeWybracLitere) {
            czyMogeWybracLitere = false;
            czyMogeKopiowac = true; //flaga odblokowywujaca ustawianie wartosci na planszy
            literaDoKopiowania = przycisk.childNodes[0].innerHTML;
            przycisk.classList.add("disabled"); // po wybraniu przycisku zamieniam go na disabled i zmieniam kolor na zielony
            przycisk.classList.remove("btn-primary");
            przycisk.classList.add("btn-success");
            historiaRuchowReka.push(przycisk.id); //dodaje do historii wybranych liter w rece
            document.getElementById("cofnijRuchBtn").classList.add("disabled"); //podczas ruchu nie mozna uzyc innych przyciskow
            document.getElementById("wymienLitereBtn").classList.add("disabled");
            document.getElementById("potwierdzRuchBtn").classList.add("disabled");
            document.getElementById("pominTureBtn").classList.add("disabled");
        }
    } else { //jesli gracz nacisnal wymien
        czyWymiana = false;
        przycisk.childNodes[0].innerHTML = losujLitere(); //wymieniam
        document.getElementById("cofnijRuchBtn").classList.remove("disabled"); //odblokowuje litery
        document.getElementById("potwierdzRuchBtn").classList.remove("disabled");
        document.getElementById("pominTureBtn").classList.remove("disabled");
        document.getElementById("wymienLitereBtn").innerHTML = "Wymień literę"; //powrot do starego napisu
    }
}

//funkcja po nacisnieciu przycisku z planszy skopiuje wartosc wczesniej wybranej litery do przycisku
function skopiujWartosc(przycisk1) {
    if (czyMogeKopiowac === true) { //klikanie przycisku bez wybrania litery
        if (!przycisk1.classList.contains("active")) { //jesli pole nie bylo juz zajete
            czyMogeKopiowac = false; //powrot do stanu sprzed skopiowania
            przycisk1.childNodes[0].innerHTML = literaDoKopiowania; //kopiowanie
            przycisk1.classList.add("active"); //zmiana wygladu
            historiaRuchow.push(przycisk1.id); //dodanie ruchu do historii
            document.getElementById("cofnijRuchBtn").classList.remove("disabled");//odblokowanie przyciskow
            document.getElementById("wymienLitereBtn").classList.remove("disabled");
            document.getElementById("potwierdzRuchBtn").classList.remove("disabled");
            document.getElementById("pominTureBtn").classList.remove("disabled");
            document.getElementById(historiaRuchowReka[historiaRuchowReka.length - 1]).classList.add("btn-primary");//powrot wybranej litery do wczesniejszego koloru
            document.getElementById(historiaRuchowReka[historiaRuchowReka.length - 1]).classList.remove("btn-success");
            czyMogeWybracLitere = true;
        } else {//pole jest zajete
            alert("Pole jest już zajęte!")
        }
    } else {//gracz nie wybral litery
        alert("Najpierw wybierz litere")
    }
}

//funkcja losuje litery z uwzgledniem charkterystyki jezykowej w oparciu o: https://sjp.pwn.pl/poradnia/haslo/frekwencja-liter-w-polskich-tekstach;7072.html
function losujLitere() {
    const litery = ["A", "A", "A", "A", "A", "A", "A", "A", "Ą", "B", "C", "C", "C", "C", "Ć", "D", "D", "D", "E", "E", "E", "E", "E", "E", "E",
        "E", "Ę", "F", "G", "H", "I", "I", "I", "I", "I", "I", "I", "I", "J", "J", "K", "K", "K", "K", "L", "L", "Ł", "Ł", "M", "M", "M",
        "N", "N", "N", "N", "N", "Ń", "O", "O", "O", "O", "O", "O", "O", "O", "Ó", "P", "P", "P", "R", "R", "R", "R", "R", "S", "S", "S",
        "S", "Ś", "T", "T", "T", "T", "U", "U", "U", "W", "W", "W", "W", "W", "Y", "Y", "Y", "Y", "Z", "Z", "Z", "Z", "Z", "Z", "Ź", "Ż"];
    return litery[Math.floor(Math.random() * litery.length)];
}

//funkcja ustawia flage wymiany na true, żeby odpalić odpowiedni kod w "kopiujWartosc" po nacisnieciu
//przycisku wymiany, jesli nacisnie sie go drugi raz, flaga jest zmieniana na false
function wymienLitere() {
    if (czyWymiana === false) {//wymiana
        czyWymiana = true;
        czyMogeKopiowac = false; // w trakcie wymiany nie moge wczesniej wybranej litery przeniesc na plansze, w zasadzie zbedne
        document.getElementById("cofnijRuchBtn").classList.add("disabled");// wylaczenie przycikow, zmiana napisu na przycisku
        document.getElementById("potwierdzRuchBtn").classList.add("disabled");
        document.getElementById("pominTureBtn").classList.add("disabled");
        document.getElementById("wymienLitereBtn").innerHTML = "Anuluj";
    } else {//anulowanie wymiana
        czyWymiana = false;
        document.getElementById("cofnijRuchBtn").classList.remove("disabled");
        document.getElementById("potwierdzRuchBtn").classList.remove("disabled");
        document.getElementById("pominTureBtn").classList.remove("disabled");
        document.getElementById("wymienLitereBtn").innerHTML = "Wymień literę";
    }
}

//po nacisnieciu przycisku cofa ostatni wykonany ruch
function cofnijRuch() {
    if (historiaRuchow.length > 0) {//jesli byly wykonane jakiekolwiek ruchy
        let temp = document.getElementById(historiaRuchow.pop()); //wspolrzedne ruchu na planszy
        temp.classList.remove("active");//usuniecie ruchu z planszy
        temp.childNodes[0].innerHTML = "";
        temp = document.getElementById(historiaRuchowReka.pop()); //wspolrzedne ruchu na rece
        temp.classList.remove("disabled"); //odblokowanie litery na rece
    } else {//nie wykonano zadnych ruchow
        alert("Nie można cofnąć ruchu.")
    }
}

//funkcj odpala sie po naciśnieciu przycisku potwierdz ruch, usuwa historie ruchow, losuje nowe litery i włącza je znów do użycia
//TODO-- ajaxem wysyłam słowo do serwera
function potwierdzRuch() {

    if (historiaRuchow.length === 0) {//sprawdza czy wykonano jakikolwiek ruch
        czyMogePotwierdzic = false;
    }


    //tu funkcja ktora sprawdz na serwerze czy wpisana litera jest poprawna


    if (czyMogePotwierdzic) {
        for (let i = 0; i < 2; i++) {//losuje nowe litery na koniec tury i zamienia stan na active
            for (let j = 0; j < 4; j++) {
                let temp = document.getElementById("literaBtnReka" + i.toString() + "," + j.toString())
                if (temp.classList.contains("disabled")) {
                    temp.classList.remove("disabled");
                    temp.childNodes[0].innerHTML = losujLitere();
                }
            }
        }
    } else {
        alert("Nie można potwierdzic ruchu")
    }

    //usuwam historie ruchow
    historiaRuchow = [];
    historiaRuchowReka = [];

    //TODO teraz ruch przeciwnika
}

//funkcja parsuje całą plansze z literami do jsona
function parsujPlansze() {
    let planszaJson = new Map();
    for (let i = 0; i < 11; i++) {
        for (let j = 0; j < 11; j++) {
            let temp = document.getElementById("literaBtn" + i.toString() + "," + j.toString())
            planszaJson.set(temp.id, temp.childNodes[0].innerHTML);
        }
    }
    return Object.fromEntries(planszaJson); //zwraca json z danymi planszy id:wartosc literaBtnX,Y: "x"
}

//obsługa socketow
$(document).ready(function () {

    var socket = io.connect('http://127.0.0.1:5000'); //łacze z serwerm

    socket.on('connect', function () {
        socket.send('User "{{current_user.first_name}}" has connected!'); //jeśli połączy drukuje to
    });

    socket.on('message', function (msg) {
        for (let i = 0; i < 11; i++) {
            for (let j = 0; j < 11; j++) {
                let temp_name = "literaBtn" + i.toString() + "," + j.toString();
                let temp = document.getElementById(temp_name)
                temp.childNodes[0].innerHTML = msg[temp_name];
                if (msg[temp_name] !== undefined && typeof msg[temp_name] != 'undefined') {
                    temp.childNodes[0].innerHTML = msg[temp_name];
                }else{
                    temp.childNodes[0].innerHTML = "";
                }
                if(temp.childNodes[0].innerHTML !== ""){
                    temp.classList.add("active");
                }

            }
        }
    });

    $('#potwierdzRuchBtn').on('click', function () {
        socket.send(parsujPlansze());
    });

});