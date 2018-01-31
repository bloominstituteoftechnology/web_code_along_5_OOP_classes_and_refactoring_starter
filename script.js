//future refactoring:
//break this all up into classes? Or is that not necessary...
//...basically look through all of the functions
//right now and figure out how to reduce the number of passes variables;
//break out of bounds into its own function
//break out tallying square numbers into its own function
//

class Player {
	constructor(/*name, playerScore, size, playerData, bestScore, password, securityQuestion, securityAnswer*/) {
		/*this.name = name;
		this.score = playerScore;
		this.size = size;
		this.data = playerData;
		this.bestScore = bestScore;
		this.password = password;
		this.securityQuestion = securityQuestion;
		this.securityAnswer = securityAnswer;*/
	}
}

let loopCounter = 0;

document.getElementById('passPara').style.display = 'none';
document.getElementById('securityPara').style.display = 'none';
document.getElementById('enterName').addEventListener('click', playerPass);
document.getElementById('enterSecurity').addEventListener('click', setUp);
document.getElementById('enterPass').addEventListener('click', setUp);

function playerPass() {
	document.getElementById('passPara').style.display = 'block';
}

function setUp() {	
	let passValid = setUpPass;
	if (passValid) {
		let playerOne = new Player();
		document.getElementById('passPara').style.display = 'none';
		document.getElementById('securityPara').style.display = 'block';
		playerOne.passWord = document.getElementById("playerPassword1").value;
		playerOne.playerName = document.getElementById("playerName").value.toLowerCase();
		playerOne.playerData = JSON.parse(localStorage.getItem(playerName));
		let passSecure = setUpSecure(playerOne);
		if (playerOne.playerData != null) {
			if (passSecure) {
				document.getElementById('securityPara').style.display = 'none';
				gamePlay(playerOne);
			}
		} else if (passSecure) {
			playerOne.securityQuestion = document.getElementById("securityQuestion").value;
			playerOne.securityAnswer = document.getElementById("securityAnswer").value.toLowerCase();
			gamePlay(playerOne);
		}
	}
}

function setUpPass() {
	let passOne = document.getElementById("playerPassword1").value;
	let passTwo = document.getElementById("playerPassword2").value;

	let playerName = document.getElementById("playerName").value.toLowerCase();
	let playerData = JSON.parse(localStorage.getItem(playerName));
	
	valPlayer = validate(playerName, passOne, passTwo, playerData);
	if (valPlayer) {
		return true;
	}
}

function setUpSecure(playerOne) {
	if (playerOne.playerData != null) {
		let inputSecureQuestion = document.getElementById("securityQuestion").innerHTML = playerData.securityQuestion;
		let inputSecureAnswer = document.getElementById("securityAnswer").value.toLowerCase();
		let secureQuestion = playerOne.playerData.secureQuestion;
		let secureAnswer = playerOne.playerData.secureAnswer;
		
		if (inputSecureAnswer === secureAnswer) {
			return true;
		} else {
			alert("Incorrect security answer");
			return false;
		}
	} else {
		return true;
	}
}

function gamePlay(playerOne) {
	//let boardSize = prompt("How big would you like the board?");
	let boardSize = 10;
	playerOne.size = boardSize;
	
	if (playerOne.playerData === null) {
		bestScore = 0;
	} else {
		bestScore = playerOne.playerData.bestScore;
	}
	
	playerOne.bestScore = bestScore;
	playerOne.score = 0;
}

function erasePassword() {
	document.getElementById('playerPassword1').value = '';
	document.getElementById('playerPassword2').value = '';
}

function validate(playerName, passOne, passTwo, playerData) {
	if (loopCounter != 3) {
		if (passOne === passTwo) {
			if (playerData === null) {
				alert("Your password has been saved, please enter a security question and answer.");
				document.getElementById('namePara').innerHTML = "Good luck, " + playerName;
				playerData = {"name": playerName, "playerScore": 0, "size": 0, "playerData": null, "bestScore": 0, "password": passOne};
				localStorage.setItem(playerName, JSON.stringify(playerData));
				return true;
			} else {
				if (passOne === playerData.password) {
					localStorage.setItem(playerName, JSON.stringify(playerData));
					document.getElementById('namePara').innerHTML = "Welcome back, " + playerName;
					document.getElementById('scorePara').innerHTML = "Previous best score: " + playerData.bestScore;
					return true;		
				} else {
					alert("Incorrect password...");
					loopCounter++;
				}
			}
		} else {
			alert("Your passwords don't match, please check your typing and try again!");
			loopCounter++;
		}
	} else {
		alert("You provided three incorrect passwords, please answer your security question");
		document.getElementById('securityPara').style.display = 'block'

	}
}

function createMineArr(playerOne) {	
	let mineArr = new Object(playerOne.size);
	for (let i = 0; i < playerOne.size; i++) {
		mineArr[i] = new Object(playerOne.size);
		for (let k = 0; k < playerOne.size; k++) {
			mineArr[i][k] = {value: 0, status: 'closed', counted: 0};
		}
	}
	playerOne.mineArr = mineArr;
	createBoard(playerOne);
}

function createBoard(playerOne) {
	populateMines(playerOne);
	let grid = document.createElement('table');
	grid.className = 'grid';
	document.getElementById('game-board').appendChild(grid);
	let elementArr = new Object(playerOne.size);
	for (let i = 0; i < playerOne.size; i++) {
		let tr = grid.appendChild(document.createElement('tr'));
		elementArr[i] = new Object(playerOne.size);
		for (let k = 0; k < playerOne.size; k++) {
			elementArr[i][k] = addSquare(i, k, tr, playerOne);
		}
	}
	playerOne.elementArr = elementArr;
}

function addSquare(i, k, tr, playerOne) {
	let cell = tr.appendChild(document.createElement('td'));
	let spaceElement = document.createElement('img');
	spaceElement.setAttribute('data-id', playerOne.mineArr[i][k].value);
	spaceElement.setAttribute('src', 'images/Minesweeper_0.png');
	spaceElement.setAttribute('locX', i);
	spaceElement.setAttribute('locY', k);
	spaceElement.addEventListener('click', function() {clickFunction(event, playerOne)});
	cell.appendChild(spaceElement);
	return spaceElement;
}

function clickFunction(e, playerOne) {
	let xLoc = e.target.getAttribute('locX');
	let yLoc = e.target.getAttribute('locY');
	if (e.button != 3) {
		if (playerOne.mineArr[xLoc][yLoc].value > 9) {
			playerOne.elementArr[xLoc][yLoc].setAttribute('src', 'images/Minesweeper_bomb.png')
			endGame(playerOne);
		}
		checkForMine(xLoc, yLoc, playerOne);
		updateBoard(playerOne);
		console.log(playerOne.score);
	} else if (playerOne.mineArr[xLoc][yLoc].status != 'open'){
		playerOne.elementArr[xLoc][yLoc].setAttribute('src', 'images/Minesweeper_flag.png');
	}
	document.getElementById('score').innerHTML = 'Player Score: ' + playerOne.score;
}

function updateBoard(playerOne) {
	for (let i = 0; i < playerOne.size; i++) {
		for (let k = 0; k < playerOne.size; k++) {
			if (playerOne.mineArr[i][k].status === 'open') {
				if (playerOne.mineArr[i][k].value < 10) {
					if (playerOne.mineArr[i][k].counted != 1) {
						if (playerOne.mineArr[i][k].value === 0) {
							playerOne.score += 1;
							playerOne.mineArr[i][k].counted = 1;
							playerOne.elementArr[i][k].setAttribute('src', 'images/Minesweeper_10.png');
						} else {
							playerOne.score += 1;
							playerOne.elementArr[i][k].setAttribute('src', 'images/Minesweeper_' + playerOne.mineArr[i][k].value + '.png');
							playerOne.mineArr[i][k].counted = 1;
						}
					}
				} 
			}
		}
	}
}

 
function populateMines(playerOne) {
	let randomNum = Math.floor(Math.random() * playerOne.size) + 5;
//if the random number is less than five (less than five mines) add ten to it to 
//ensure that there is a sufficient number of mines	
	if (randomNum < 10) {
		randomNum += 5;
	}
	
	let ranX, ranY = 0;
	
	for (let i = 0; i < randomNum; i++) {
		ranX = Math.floor(Math.random() * playerOne.size);
		ranY = Math.floor(Math.random() * playerOne.size);

//Make sure that we are not going out of bounds when checking the addition of
//counters on the spaces in the next if statement
		if (ranX + 1 > playerOne.size - 1) {
			ranX -=1;
		} else if (ranX - 1 < 0) {
			ranX += 1;
		}
		if (ranY + 1 > playerOne.size - 1) {
			ranY -= 1;
		} else if (ranY - 1 < 0) {
			ranY += 1;
		}

//Check to make sure there isn't already a mine there, if there is
//remove one from the loop counter and continue on
		if (playerOne.mineArr[ranX][ranY].value != 10) {
			playerOne.mineArr[ranX][ranY].value = 10;
			playerOne.mineArr[ranX+1][ranY].value += 1;
			playerOne.mineArr[ranX][ranY+1].value += 1;
			playerOne.mineArr[ranX+1][ranY+1].value += 1;
			playerOne.mineArr[ranX-1][ranY].value += 1;
			playerOne.mineArr[ranX][ranY-1].value += 1;
			playerOne.mineArr[ranX-1][ranY-1].value += 1;
			playerOne.mineArr[ranX+1][ranY-1].value += 1;
			playerOne.mineArr[ranX-1][ranY+1].value += 1;
		} else {
			i -= 1;
		}
	}
}

function checkForMine(x, y, playerOne) {
	console.log(playerOne);
	x = parseInt(x);
	y = parseInt(y);
	if (playerOne.mineArr[x][y].status != 'open') {
		if (playerOne.mineArr[x][y].value < 10) {
			if (playerOne.mineArr[x][y].value > 0) {
				playerOne.mineArr[x][y].status = 'open';
				return;
			} else {
				playerOne.mineArr[x][y].status = 'open';
				if (checkArrayDownXIndex(x)) {
					checkForMine(x-1, y, playerOne);
				}
				if (checkArrayUpXIndex(x, playerOne.size)) {
					checkForMine(x+1, y, playerOne);
				}
				if (checkArrayDownYIndex(y)) {
					checkForMine(x, y-1, playerOne);
				}
				if (checkArrayUpYIndex(y, playerOne.size)) {
					checkForMine(x, y+1, playerOne);
				} 
				if (checkArrayUpXIndex(x, playerOne.size) && checkArrayUpYIndex(y, playerOne.size)) {
					checkForMine(x+1, y+1, playerOne);
				}
				if (checkArrayDownXIndex(x) && checkArrayDownYIndex(y)) {
					checkForMine(x-1, y-1, playerOne);	
				}
				if (checkArrayDownXIndex(x) && checkArrayUpYIndex(y, playerOne.size)) {
					checkForMine(x-1, y+1, playerOne);
				}
				if (checkArrayUpXIndex(x, playerOne.size) && checkArrayDownYIndex(y)) {
					checkForMine(x+1, y-1, playerOne);
				}
			}
		}
	} 
}

function checkArrayDownXIndex(x) {
	if (x > 0) {
		return true;
	}
	return false;
}
function checkArrayUpXIndex(x, size) {
	if (x+1 < size - 1) {
		return true;
	}
	return false;
}
function checkArrayDownYIndex(y) {
	if (y > 0) {
		return true;
	}
	return false;
}
function checkArrayUpYIndex(y, size) {
	if (y+1 < size - 1) {
		return true;
	}
	return false;
}

function endGame(playerOne) {
	console.log("Final score: " + playerOne.score);
	if (playerOne.score > playerOne.bestScore) {
		let data = {"name": playerOne.name, "playerScore": playerOne.score, "size": playerOne.size, "playerData": playerOne.data, "bestScore": playerOne.score, "password": playerOne.password};
		localStorage.setItem(playerOne.name, JSON.stringify(data));
	} else {
		let data = {"name": playerOne.name, "playerScore": playerOne.score, "size": playerOne.size, "playerData": playerOne.data, "bestScore": playerOne.bestScore, "password": playerOne.password};
		localStorage.setItem(playerOne.name, JSON.stringify(data));
	}
	alert("Final score " + playerOne.score);
	cleanBoard();
}

function cleanBoard() {
	location = location;
	gamePlay();
}