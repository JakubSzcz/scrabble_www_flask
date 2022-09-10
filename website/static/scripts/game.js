// zmienna
var historiaRuchow = []; // tablica wsporzednych wybranych przyciskow z planszy- STRING
var czyMogeKopiowac = false; // flaga czy moge przenieść litere z reki na tablice -bool
var czyWymiana = false; // flaga czy aktualnie moge przeprowadzic wymiane, np. czy nie wybrałem wczesniej litery z reki- bool
var literaDoKopiowania = ""; //wartosc litery do skopiowania z reki do planszy- STRING
let planszaReka = document.getElementById("rekaDiv"); //div z literami w rece- obiekt div
var historiaRuchowReka = []; //tablica wsporzednych wybranych przyciskow z reki- STRING
var plansza = document.getElementById("planszaDiv"); // div z plansza do gry na litery- obiekt div
var czyMogeWybracLitere = true; //czy moge znow kliknac na litere na rece
var mojaTura = false; //sprawdza czy moge teraz wykonac ture bool
var userName;  //nazwa gracza String
var listaGraczy; //lista graczy STRING
var punktyGraczy; //TODO
var startGry = true; //flaga sprawdza czy to pierwszy ruch w grze, uzywane przy starcie gry
var czyjaTura; //string z nazwa gracza ktory wykonuje ruch
var socket = io.connect('http://127.0.0.1:5000'); //łacze z serwerm
var numer = window.location.search.substring(1);
var haslo = numer.substring(
    numer.indexOf("?") + 1,
    numer.lastIndexOf("?")
);
let slowa = [];
numer = numer.substring(0, numer.indexOf("?"))
var polaSpecjalne = {
    "0,0": "l2",
    "0,1": "s3",
    "1,1": "l4",
    "2,5": "l3",
    "3,5": "l3",
    "4,4": "s2",
    "4,5": "s2",
    "5,5": "s3",
    "5,4": "s4",
    "6,5": "l3",
    "7,5": "l3",
    "8,5": "l3",
    "9,5": "l3",
    "10,5": "l3",
    //todo
}
var literyPunktacja = {
    "A": 1,
    "E": 1,
    "I": 1,
    "O": 1,
    "N": 1,
    "Z": 1,
    "R": 1,
    "S": 1,
    "W": 1,
    "Y": 2,
    "C": 2,
    "D": 2,
    "K": 2,
    "L": 2,
    "M": 2,
    "P": 2,
    "T": 2,
    "B": 3,
    "G": 3,
    "H": 3,
    "J": 3,
    "Ł": 3,
    "U": 3,
    "Ą": 5,
    "Ę": 5,
    "F": 5,
    "Ó": 5,
    "Ś": 5,
    "Ż": 5,
    "Ć": 6,
    "Ń": 7,
    "Ź": 9
}
var liczbaPunktow = 0;
var punktowDoWygranej = 200;


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
document.getElementById("literaBtn5,5").classList.add("btn-start");
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
            alert("Pole jest już zajęte!");
        }
    } else {//gracz nie wybral litery
        alert("Najpierw wybierz litere");
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
        alert("Nie można cofnąć ruchu.");
    }
}

//aktywuje przyciski na rece
function aktywuj_przyciki() {
    //przyciski
    document.getElementById("cofnijRuchBtn").classList.remove("disabled");
    document.getElementById("potwierdzRuchBtn").classList.remove("disabled");
    document.getElementById("pominTureBtn").classList.remove("disabled");
    document.getElementById("wymienLitereBtn").classList.remove("disabled");
    //przyciski z literami
    for (let i = 0; i < 2; i++) {
        for (let j = 0; j < 4; j++) {
            let literaBtnReka = document.getElementById('literaBtnReka' + i.toString() + "," + j.toString()); //przycisk
            literaBtnReka.classList.remove("disabled");
        }
    }
}

//dezaktywuje przyciski na rece
function dezaktywuj_przyciski() {
    //przyciski
    document.getElementById("cofnijRuchBtn").classList.add("disabled");
    document.getElementById("potwierdzRuchBtn").classList.add("disabled");
    document.getElementById("pominTureBtn").classList.add("disabled");
    document.getElementById("wymienLitereBtn").classList.add("disabled");

    //przyciski z literami
    for (let i = 0; i < 2; i++) {
        for (let j = 0; j < 4; j++) {
            let literaBtnReka = document.getElementById('literaBtnReka' + i.toString() + "," + j.toString()); //przycisk
            literaBtnReka.classList.add("disabled");
        }
    }
}

//funkcj odpala sie po naciśnieciu przycisku potwierdz ruch, usuwa historie ruchow, losuje nowe litery i włącza je znów do użycia
function potwierdzRuch() {
    if (historiaRuchow.length === 0) {//sprawdza czy wykonano jakikolwiek ruch przed potwierdzeniem
        alert("Nie można potwierdzic ruchu");
        return 0;
    }
    //sprawdzam czy zajeto pole startu
    if (document.getElementById("literaBtn5,5").childNodes[0].innerHTML == "") {
        alert("Musisz zajać pole startu!");
        let temp_leng = historiaRuchow.length;
        for (let x = 0; x < temp_leng; x++) {
            cofnijRuch();
        }
        return 0;
    }
    //sprawdzam czy dobrze umiejscowiony litery, sprawdzam czy kazda litera ma przynajmniej jednego sasiada
    for (let i = 0; i < 11; i++) {
        for (let j = 0; j < 11; j++) {
            let sasiedzi = czyMaSaiada(i,j)[0].length;
            if ((sasiedzi == 0 || sasiedzi > 4) && (document.getElementById("literaBtn" + i.toString() + "," + j.toString()).childNodes[0].innerHTML != "")) {
                alert("Litery zostały źle umiejscowiony. Powtorz ruch.");
                let temp_leng = historiaRuchow.length;
                for(let x = 0; x<temp_leng; x++){
                    cofnijRuch();
                }
                return 0;
            }
        }
    }

    //sprawdzam czy jest w slowniku
    if (!sprawdzPoprawnosc()) {
        alert("Nie ma takiego słowa!");
        let temp_leng = historiaRuchow.length;
        for (let x = 0; x < temp_leng; x++) {
            cofnijRuch();
        }
        return 0;
    }

    for (let i = 0; i < 2; i++) {//losuje nowe litery na koniec tury i zamienia stan na active
        for (let j = 0; j < 4; j++) {
            let temp = document.getElementById("literaBtnReka" + i.toString() + "," + j.toString());
            if (temp.classList.contains("disabled")) {
                temp.classList.remove("disabled");
                temp.childNodes[0].innerHTML = losujLitere();
            }
        }
    }
    let nowePunkty = liczPunkty(historiaRuchow);
    liczbaPunktow = liczbaPunktow + nowePunkty
    punktowDoWygranej = punktowDoWygranej - nowePunkty;


    //usuwam historie ruchow
    historiaRuchow = [];
    historiaRuchowReka = [];
    //zmiana tury, jeśli indeks wiekszy niz dlugosc tablicy z graczami to zmienia ture od poczatku, kolejnosc graczy w zaleznosci od dolaczenia
    {
        let id = listaGraczy.indexOf(czyjaTura);
        if (id === listaGraczy.length - 1) {
            czyjaTura = listaGraczy[0];
        } else {
            czyjaTura = listaGraczy[id + 1];
        }
    }
    //emituje na event odbierz_plansze zmienne parsujPlansze i czyjaTura
    socket.emit('odbierz_plansze', parsujPlansze(), czyjaTura, numer, liczbaPunktow, userName, punktowDoWygranej);
    mojaTura = false; //bo przesłaniu jsona z plansza zmieniam moja ture na false i dezaktywuje plansze
    dezaktywuj_przyciski();
}

//funkcja parsuje całą plansze z literami do jsona
function parsujPlansze() {
    let planszaJson = new Map();
    for (let i = 0; i < 11; i++) {
        for (let j = 0; j < 11; j++) {
            let temp = document.getElementById("literaBtn" + i.toString() + "," + j.toString());
            planszaJson.set(temp.id, temp.childNodes[0].innerHTML);
        }
    }
    return Object.fromEntries(planszaJson); //zwraca json z danymi planszy id:wartosc literaBtnX,Y: "x"
}

//sprawdzam czy funkcja o podanych koordynatach ma sasiada
function czyMaSaiada(t, y){
    let sasiedzi = []
    let kierunki = []
    if (document.getElementById("literaBtn" + t.toString() + "," + y.toString()).childNodes[0].innerHTML != "") { // wyszukuje indeksy liter ktore maja wartosc
        try {
            if (document.getElementById("literaBtn" + (t).toString() + "," + (y + 1).toString()).childNodes[0].innerHTML != "") { //w prawo
                sasiedzi = sasiedzi.concat("literaBtn" + (t).toString() + "," + (y + 1).toString())
                kierunki = kierunki.concat("p")
            }
        } catch { };
        try {
            if (document.getElementById("literaBtn" + (t).toString() + "," + (y - 1).toString()).childNodes[0].innerHTML != "") { // w lewo
                sasiedzi = sasiedzi.concat("literaBtn" + (t).toString() + "," + (y - 1).toString())
                kierunki = kierunki.concat("l")
            }
        } catch { };
        try {
            if (document.getElementById("literaBtn" + (t - 1).toString() + "," + (y).toString()).childNodes[0].innerHTML != "") { // w gore
                sasiedzi = sasiedzi.concat("literaBtn" + (t-1).toString() + "," + (y).toString())
                kierunki = kierunki.concat("g")
            }
        } catch { };
        try {
            if (document.getElementById("literaBtn" + (t + 1).toString() + "," + (y).toString()).childNodes[0].innerHTML != "") { // w dol
                sasiedzi = sasiedzi.concat("literaBtn" + (t + 1).toString() + "," + (y).toString())
                kierunki = kierunki.concat("d")
                //console.log("dziala w dol")
            }
        } catch { };
    }
    return [sasiedzi, kierunki]
}

/*function sprawdzPoprawnosc(){
    let wykluczoneZi = []
    let wykluczoneZj = []
    for (let i = 0; i < 11; i++) {
        for (let j = 0; j < 11; j++) {
            if ((document.getElementById("literaBtn" + i.toString() + "," + j.toString()).childNodes[0].innerHTML) != ''){
                //sprawdzam w osi j:
                tempSlowo = '';
                t = 0;
                while ((document.getElementById("literaBtn" + i.toString() + "," + (j+t).toString()).childNodes[0].innerHTML) != '' && !(wykluczoneZj.some((element) => element == [i, (j+t)]))){
                    tempSlowo = tempSlowo.concat((document.getElementById("literaBtn" + i.toString() + "," + (j+t).toString()).childNodes[0].innerHTML))
                    wykluczoneZj.push([i, j])
                    if(j+t == 11) break;
                    t++;
                }
                //sprawdzam w osi i
                tempSlowo = '';
                t = 0;
                while ((document.getElementById("literaBtn" + (i+t).toString() + "," + j.toString()).childNodes[0].innerHTML) != '' && !(wykluczoneZi.some((element) => element == [(i+t), j]))){
                    tempSlowo = tempSlowo.concat((document.getElementById("literaBtn" + (i+t).toString() + "," + j.toString()).childNodes[0].innerHTML))
                    wykluczoneZi.push([i, j])
                    if(i+t == 11) break;
                    t++;
                }
                console.log(wykluczoneZi)
                console.log(wykluczoneZj)
            }
        }
    }
}*/

$.get('static/slownik.txt', {}, function (content) { //jaki adres słownika?
    slowa = content.split('\n');
    //console.log(slowa[3])
});

function liczPunkty(historiaRuchow){
    let kostkiDoPoliczenia = []
    for(let i = 0; i < historiaRuchow.length; i++){
        x = Number(historiaRuchow[i][11])
        y = Number(historiaRuchow[i][9])
        kierunki = []
        nowiSasiedzi = []
        for(let i = 0; i < czyMaSaiada(y, x)[0].length; i++){ //dodaję sąsiadów dookoła dodanej płytki
            if(!(historiaRuchow.includes(czyMaSaiada(y, x)[0][i].valueOf()) || nowiSasiedzi.includes(czyMaSaiada(y, x)[0][i].valueOf()))){
                nowiSasiedzi = nowiSasiedzi.concat(czyMaSaiada(y, x)[0][i].valueOf())
                kierunki = kierunki.concat(czyMaSaiada(y, x)[1][i])
                //console.log("dodano nowego sasiada")
                //historiaRuchow = tempHistoriaRuchow.concat(czyMaSaiada(y, x)[i].valueOf())
            }
        }
        for(let i = 0; i < nowiSasiedzi.length; i++){ //dodaję sąsiadów nowododanych sąsiadów lężących w danym kierunku
            x = Number(nowiSasiedzi[i][11])
            y = Number(nowiSasiedzi[i][9])
            //console.log(czyMaSaiada(y, x)[1])
            //console.log(kierunki[i].valueOf())
            if(czyMaSaiada(y, x)[1].includes(kierunki[i].valueOf())){
                if(!(historiaRuchow.includes(czyMaSaiada(y, x)[0][czyMaSaiada(y, x)[1].indexOf(kierunki[i].valueOf())]) || nowiSasiedzi.includes(czyMaSaiada(y, x)[0][czyMaSaiada(y, x)[1].indexOf(kierunki[i].valueOf())]))){
                    nowiSasiedzi = nowiSasiedzi.concat(czyMaSaiada(y, x)[0][czyMaSaiada(y, x)[1].indexOf(kierunki[i].valueOf())])
                    kierunki = kierunki.concat(kierunki[i].valueOf())
                    //console.log("dodano nowego sasiada")
                }
            }
            
        }
        kostkiDoPoliczenia = Array.from(new Set(kostkiDoPoliczenia.concat(nowiSasiedzi)))
    }
    kostkiDoPoliczenia = Array.from(new Set(kostkiDoPoliczenia.concat(historiaRuchow)))
    //console.log(kostkiDoPoliczenia)
    let sumaPunktow = 0
    let premiaSlowna = 1
    for(let i = 0; i < kostkiDoPoliczenia.length; i++){
        x = kostkiDoPoliczenia[i][11]
        y = kostkiDoPoliczenia[i][9]
        if(x.toString() + "," + y.toString() in polaSpecjalne){
            if(polaSpecjalne[x.toString() + "," + y.toString()][0].valueOf() == "l"){
                console.log("premia literowa" + polaSpecjalne[x.toString() + "," + y.toString()][1])
                //console.log(polaSpecjalne[x.toString() + "," + y.toString()][1])
                sumaPunktow = sumaPunktow + (Number(polaSpecjalne[x.toString() + "," + y.toString()][1]) * literyPunktacja[document.getElementById("literaBtn" + y.toString() + "," + x.toString()).childNodes[0].innerHTML])
                polaSpecjalne[x.toString() + "," + y.toString()] = polaSpecjalne[x.toString() + "," + y.toString()][0] + "1"
            }
            if (polaSpecjalne[x.toString() + "," + y.toString()][0].valueOf() == "s") {
                console.log("premiaSlowna" + polaSpecjalne[x.toString() + "," + y.toString()][1])
                premiaSlowna = premiaSlowna * Number(polaSpecjalne[x.toString() + "," + y.toString()][1])
                //console.log(polaSpecjalne[x.toString() + "," + y.toString()])
                sumaPunktow = sumaPunktow + literyPunktacja[document.getElementById("literaBtn" + y.toString() + "," + x.toString()).childNodes[0].innerHTML]
                polaSpecjalne[x.toString() + "," + y.toString()] = polaSpecjalne[x.toString() + "," + y.toString()][0] + "1"
            }
        } else {
            console.log("brak premii")
            sumaPunktow = sumaPunktow + literyPunktacja[document.getElementById("literaBtn" + y.toString() + "," + x.toString()).childNodes[0].innerHTML]
        }
    }
    if (premiaSlowna) {
        sumaPunktow = sumaPunktow * premiaSlowna
        console.log("całkowita premia slowna:" + premiaSlowna.toString())
    }
    return sumaPunktow
}

function sprawdzPoprawnosc() {
    for (let i = 0; i < 11; i++) {
        let liniaI = ''
        for (let j = 0; j < 11; j++) {
            if ((document.getElementById("literaBtn" + i.toString() + "," + j.toString()).childNodes[0].innerHTML) == '') {
                liniaI = liniaI.concat(" ")
            } else {
                liniaI = liniaI.concat((document.getElementById("literaBtn" + i.toString() + "," + j.toString()).childNodes[0].innerHTML))
            }
        }
        liniaI = liniaI.split(" ")
        for (let t = 0; t < liniaI.length; t++) {
            if (liniaI[t].length > 1) {
                //console.log(liniaI[t])
                //kod sprawdzający słownik
                if (slowa.some((element) => element.substring(0, element.length - 1).valueOf() == liniaI[t].toLowerCase().valueOf())) {
                    //return true
                } else {
                    //console.log(liniaI[t].toLowerCase())
                    return false
                }
            }
        }
    }
    for (let j = 0; j < 11; j++) {
        let liniaJ = ''
        for (let i = 0; i < 11; i++) {
            if ((document.getElementById("literaBtn" + i.toString() + "," + j.toString()).childNodes[0].innerHTML) == '') {
                liniaJ = liniaJ.concat(" ")
            } else {
                liniaJ = liniaJ.concat((document.getElementById("literaBtn" + i.toString() + "," + j.toString()).childNodes[0].innerHTML))
            }
        }
        liniaJ = liniaJ.split(" ")
        for (let t = 0; t < liniaJ.length; t++) {
            if (liniaJ[t].length > 1) {
                //console.log(liniaJ[t])
                //kod sprawdzający słownik
                if (slowa.some((element) => element.substring(0, element.length - 1).valueOf() == liniaJ[t].toLowerCase().valueOf())) {
                    //return true
                } else {
                    //console.log(liniaJ[t].toLowerCase())
                    return false
                }
            }
        }
    }
    return true;
}

//obsługa socketow
$(document).ready(function () {//gdy wczyta cały dokument
    userName = document.getElementById("userNameinfo").innerHTML.slice(0, -1); //bierze nazwe gracza
    //socket.emit('lista_graczy', userName); //emituje do wydarzenia lista graczy zmienna userName
    socket.on('message', function (data) { //na wydarzenie message wykonuje funkcje ze zmienna data
        let msg, czyjaTuraSerwer, punktyWyswietl, graczSerwer, doWygranej; //json data zamieniany na msg- json planszy, czyja tura String
        msg = data["plansza"];
        czyjaTuraSerwer = data["czyjaTura"];
        punktyWyswietl = data["liczbaPunktow"];
        graczSerwer = data["gracz"];
        doWygranej = data["doWygranej"]
        for (let i = 0; i < 11; i++) { //wypelnia plansze wartosciami z jsona, jesli nie ma wartosci daje ""
            for (let j = 0; j < 11; j++) {
                let temp_name = "literaBtn" + i.toString() + "," + j.toString();
                let temp = document.getElementById(temp_name);
                temp.childNodes[0].innerHTML = msg[temp_name];
                if (msg[temp_name] !== undefined && typeof msg[temp_name] != 'undefined') {
                    temp.childNodes[0].innerHTML = msg[temp_name];
                } else {
                    temp.childNodes[0].innerHTML = "";
                }
                if (temp.childNodes[0].innerHTML !== "") { //bo pole uzyte
                    temp.classList.add("active");
                }
            }
        }
        czyjaTura = czyjaTuraSerwer; //przekazuje ture pomiedzy graczami
        if (czyjaTura === userName) { //jesli teraz moja tura to aktywuje przyciski
            mojaTura = true;
            aktywuj_przyciki();
        }

        if (mojaTura) {//napis informujacy czyja tura, do konca nie dziala nie wiem czemu, przy pierwszej turze sie nie wyswietla
            document.getElementById("czyjaTuraInfo").innerHTML = "<b>Twój ruch!</b>";
        } else {
            document.getElementById("czyjaTuraInfo").innerHTML = "Akutalnie ruch wykonuje " + "<b>" + czyjaTuraSerwer + "</b>";
        }

        var indeksGracza = listaGraczy.indexOf(graczSerwer).toString();
        try {
            document.getElementById("wynikGracza" + indeksGracza).innerHTML = punktyWyswietl.toString();
            document.getElementById("roznicaGracza" + indeksGracza).innerHTML = doWygranej.toString();
        } catch { }
    });

    $('#pominTureBtn').on('click', function () {
        //TODO
    });

    socket.on("connect", function () {
        socket.emit('dolacz_do_gry', numer, haslo)
        socket.emit('lista_graczy', userName, numer);
        czyjaTura = userName
        socket.emit('odbierz_plansze_pierwsze', parsujPlansze(), czyjaTura, numer);
    })

    socket.on("odbierz_liste_graczy", function (users) { //odbiera zmienna z lista graczy od serwera na wydarzeniu odbierz_liste_graczy
        listaGraczy = users;
        //console.log("odebrano liste graczy")
        //TODO if lista graczy == 1 nie zaczniesz bo za mało graczy
        let tabelaUserow = document.getElementById("listaUzytkownikow"); //tworze i wypełniam tablice z graczami
        for (let i = 0; i < listaGraczy.length; i++) {
            if (tabelaUserow.rows.length != listaGraczy.length) {
                let temp_row = document.createElement("tr");
                let nazwaGracza = document.createElement("td");
                let punktyGracza = document.createElement("td");
                punktyGracza.setAttribute("id", "wynikGracza" + i.toString());
                let roznicaGracza = document.createElement("td");
                roznicaGracza.setAttribute("id", "roznicaGracza" + i.toString());
                nazwaGracza.innerHTML = listaGraczy[i];
                punktyGracza.innerHTML = "0";
                roznicaGracza.innerHTML = punktowDoWygranej.toString();
                temp_row.appendChild(nazwaGracza);
                temp_row.appendChild(punktyGracza);
                temp_row.appendChild(roznicaGracza);
                tabelaUserow.appendChild(temp_row);
            }
        }
        if (startGry) {   //start gry- jak pierwszy wszedłeś to zaczynasz
            startGry == false;
            czyjaTura = listaGraczy[0];
        }
        if (czyjaTura === userName) { // start gry= jak twoja tura to zaczynasz
            mojaTura = true;
        } else {
            dezaktywuj_przyciski(); //jeśli nie zaczynasz na poczatku tury to nie mozesz uzyc przyciskow
        }
    });
    document.getElementById("numerInfo").innerHTML = numer;
});