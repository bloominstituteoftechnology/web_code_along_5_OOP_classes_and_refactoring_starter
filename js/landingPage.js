let blackJack = document.getElementById("blackJack");
let poker = document.getElementById("poker")
let minesweeper = document.getElementById("minesweeper");

let pokerPhoto = document.createElement('img');
let blackJackPhoto = document.createElement('img');
let minesweeperPhoto = document.createElement('img');

pokerPhoto.src = "images/pokerPhoto.png";
blackJackPhoto.src = "images/blackjackPhoto.png";
minesweeperPhoto.src = "images/minesweeperPhoto.png";

pokerPhoto.classList.add('images');
blackJackPhoto.classList.add('images');
minesweeperPhoto.classList.add('images');

poker.appendChild(pokerPhoto);
blackJack.appendChild(blackJackPhoto);
minesweeper.appendChild(minesweeperPhoto);

pokerPhoto.addEventListener('click', goToPoker);
blackJackPhoto.addEventListener('click', goToBlackJack);
minesweeperPhoto.addEventListener('click', goToMinesweeper);

function goToPoker() {
    location.href="poker.html";
}

function goToBlackJack() {
    location.href='blackjack.html';    
}

function goToMinesweeper() {
    location.href='minesweeper.html';
}
animateDiv();
isLoggedIn();

function isLoggedIn() {
    let logIn = sessionStorage.getItem('logIn');
    if (logIn) {
        let currentName = localStorage.getItem("currentName");
        playerData = JSON.parse(localStorage.getItem(currentName));

        document.getElementById('firstVisit').innerHTML = "Back for more, eh? Good luck, chump. You have $" + playerData.money;
        document.getElementById('nameContainer').style.display = 'none';
        document.getElementById('passContainer').style.display = 'none';
        displayGameImages(playerData);
    } else {
        document.getElementById('gameImages').style.display = 'none';
        document.getElementById('passContainer').style.display = 'none';
        document.getElementById('enterName').addEventListener('click', playerPass);
        document.getElementById('enterPass').addEventListener('click', start);
    }
}

function playerPass() {
    document.getElementById('nameContainer').style.display = 'none';
    document.getElementById('passContainer').style.display = 'block';
}

function start() {
    let currentName = "";
    let playerData = "";
    
    currentName = document.getElementById("playerName").value.toLowerCase();
    
    let passwordOne = document.getElementById("playerPassword1").value;
    let passwordTwo = document.getElementById("playerPassword2").value;

    localStorage.setItem("currentName", currentName);

    playerData = JSON.parse(localStorage.getItem(currentName));

    if (playerData === null) {
        playerData = {"name": currentName, "playerScore": 0, "size": 0, "bestScore": 0, "money": 0, "password": passwordOne};
        localStorage.setItem(currentName, JSON.stringify(playerData));
        
        sessionStorage.setItem('logIn', true);
        document.getElementById('passContainer').style.display = 'none';
        displayGameImages(playerData);    
        document.getElementById('firstVisit').innerHTML = "Ah, a first time visitor. Welcome, welcome. Your password has been saved for your next visit. You'd better start with minesweeper to earn some dough."
    } else {
        if (validate(currentName, passwordOne, passwordTwo, playerData)) {
            sessionStorage.setItem('logIn', true);
            if (playerData.money > 0) {
                document.getElementById('firstVisit').innerHTML = "Welcome back, welcome back. Continue this way for your money...Current money: " + playerData.money;
            } else {
                document.getElementById('firstVisit').innerHTML = "Woah, woah, woah, looks like you had a bit too much fun last time...better head to minesweeper to make some dough.";
            }
            document.getElementById('passContainer').style.display = 'none';
            displayGameImages(playerData);
        } else {
            erasePassword();
        }
    }

    document.getElementById('nameContainer').style.display = 'none';
    document.getElementById('headH').innerHTML = "Welcome to Casey's Palace, <br>" + capitalizeName(name);
}

function capitalizeName(name) {
    return name.charAt(0).toUpperCase() + name.slice(1);
}

function erasePassword() {
    document.getElementById('playerPassword1').value = '';
    document.getElementById('playerPassword2').value = '';
}

function validate(playerName, passOne, passTwo, playerData) {
    console.log(playerData);
    console.log(playerName, passOne, passTwo, playerData.password);
    if (passOne === passTwo) {
        if (passOne === playerData.password) {
            return true;        
        } else {
            alert("Incorrect password...");
            return false;
        }
    } else {
        alert("Your passwords don't match, please check your typing and try again!");
        return false;
    }
}

function displayGameImages(playerData) {
    console.log(playerData.money);
    if (playerData.money > 0) {
        document.getElementById('gameImages').style.display = 'block';
    } else {
//add a 'lock' over the image...separate the image from the html and
//add in a click event so that you can take it off!
        blackJackPhoto.removeEventListener('click', goToBlackJack);
        pokerPhoto.removeEventListener('click', goToPoker);
        blackJackPhoto.style.opacity = 0.2;
        pokerPhoto.style.opacity = 0.2;
        blackJackPhoto.removeEventListener('click', goToBlackJack)
        pokerPhoto.removeEventListener('click', goToPoker)

        document.getElementById('gameImages').style.display = 'block';

    }
}

//Borrowed from http://jsfiddle.net/Xw29r/15/
function makeNewPosition(){
    let height = $(window).height() - 50;
    let width = $(window).width() - 50;
    
    let newHeight = Math.floor(Math.random() * height);
    let newWidth = Math.floor(Math.random() * width);
    
    return [newHeight,newWidth];    
    
}

function animateDiv(){
    let newPosition1 = makeNewPosition();
    let newPosition2 = makeNewPosition();
    let newPosition3 = makeNewPosition();
    let newPosition4 = makeNewPosition();
    let newPosition5 = makeNewPosition();
    let newPosition6 = makeNewPosition();
    
    $('#dot1').animate({ top: newPosition1[0], left: newPosition1[1] }, 4000, function(){
      animateDiv();        
    });
    $('#dot2').animate({ top: newPosition2[0], left: newPosition2[1] }, 7000, function(){
      animateDiv();        
    });
    $('#dot3').animate({ top: newPosition3[0], left: newPosition3[1] }, 500, function(){
      animateDiv();        
    });
    $('#dot4').animate({ top: newPosition4[0], left: newPosition4[1] }, 1000, function(){
      animateDiv();        
    });
    $('#dot5').animate({ top: newPosition5[0], left: newPosition5[1] }, 750, function(){
      animateDiv();        
    });
    $('#dot6').animate({ top: newPosition6[0], left: newPosition6[1] }, 1000, function(){
      animateDiv();        
    });
}