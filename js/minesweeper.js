class Player {
	constructor(name, playerScore, size, playerData, bestScore, password) {
		this.name = name;
		this.score = playerScore;
		this.size = size;
		this.data = playerData;
		this.bestScore = bestScore;
		this.password = password;
	}
}

let loopCounter = 0;

document.getElementById('passPara').style.display = 'none';
document.getElementById('repeatPara').style.display = 'none';
document.getElementById('enterName').addEventListener('click', playerPass);
document.getElementById('enterPass').addEventListener('click', setUp);

function playerPass() {
	document.getElementById('namePara').style.display = 'none';
	document.getElementById('passPara').style.display = 'block';
}

function setUp() {	
	if (setUpPass()) {
		document.getElementById('passPara').style.display = 'none';
		password = document.getElementById("playerPassword1").value;
		playerName = document.getElementById("playerName").value.toLowerCase();
		playerData = JSON.parse(localStorage.getItem(playerName));
		//let boardSize = prompt("How big would you like the board?");
		let boardSize = 20;

		if (playerData === null) {
			playerData = {"name": playerName, "playerScore": 0, "size": 0, "playerData": null, "bestScore": 0, "password": password};
			localStorage.setItem(playerName, JSON.stringify(playerData));
			bestScore = 0;
			playerOne = new Player(playerName, 0, boardSize, playerData, bestScore, password);
			playerName = capitalizeName(playerName);
			document.getElementById('scorePara').innerHTML = "Good luck, " + playerName;
		} else {
			bestScore = playerData.bestScore;
			playerOne = new Player(playerData.playerName, 0, boardSize, playerData, bestScore, playerData.password);
			playerName = capitalizeName(playerName);
			document.getElementById('scorePara').innerHTML = "Welcome back, " + playerName + ". Previous best score: " + playerData.bestScore;
		}
		
		createMineArr(playerOne);
	}
}

function capitalizeName(name) {
	return name.charAt(0).toUpperCase() + name.slice(1);
}

function setUpPass() {
	let passOne = document.getElementById("playerPassword1").value;
	let passTwo = document.getElementById("playerPassword2").value;
	let playerName = document.getElementById("playerName").value.toLowerCase();
	let playerData = JSON.parse(localStorage.getItem(playerName));
	if (validate(playerName, passOne, passTwo, playerData)) {
		return true;
	}
}

function erasePassword() {
	document.getElementById('playerPassword1').value = '';
	document.getElementById('playerPassword2').value = '';
}

function validate(playerName, passOne, passTwo, playerData) {
	if (passOne === passTwo) {
		if (playerData === null) {
			return true;
		} else {
			if (passOne === playerData.password) {
				return true;		
			} else {
				alert("Incorrect password...");
				return false;
			}
		}
	} else {
		alert("Your passwords don't match, please check your typing and try again!");
		return false;
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
	spaceElement.addEventListener('contextmenu', event => event.preventDefault());
	spaceElement.addEventListener('mousedown', function() {clickFunction(event, playerOne)});
	cell.appendChild(spaceElement);
	return spaceElement;
}

function clickFunction(e, playerOne) {
	let xLoc = e.target.getAttribute('locX');
	let yLoc = e.target.getAttribute('locY');
	if (!checkWin(playerOne)) {
		if (e.which != 3) {
			if (playerOne.mineArr[xLoc][yLoc].value > 9) {
				playerOne.elementArr[xLoc][yLoc].setAttribute('src', 'images/Minesweeper_bomb.png')
				endGame(playerOne);
			}
			console.log("Left Click");
			checkForMine(xLoc, yLoc, playerOne);
			updateBoard(playerOne);
		} else if (e.which === 3) {
			if (playerOne.mineArr[xLoc][yLoc].status != 'open'){
				playerOne.elementArr[xLoc][yLoc].setAttribute('src', 'images/Minesweeper_flagged.png');
			}
			console.log("Right Click");
		}
		document.getElementById('score').innerHTML = 'Player Score: ' + playerOne.score;
	} else {
		alert("You won!!!! Adding fifty to your score!");
		playerOne.score += 50;
		endGame(playerOne);
	}
}

function checkWin(playerOne) {
	let win = true;
	for (let i = 0; i < playerOne.size; i++) {
		for (let k = 0; k < playerOne.size; k++) {
			if (playerOne.mineArr[i][k].status === 'closed' && playerOne.mineArr[i][k].value < 10) {
				win = false;
			}
		}
	}
	return win;
}

function revealBoard(playerOne) {
	for (let i = 0; i < playerOne.size; i++) {
		for (let k = 0; k < playerOne.size; k++) {
			if (playerOne.mineArr[i][k].value === 0) {
				playerOne.elementArr[i][k].setAttribute('src', 'images/Minesweeper_10.png');
			} else if (playerOne.mineArr[i][k].value > 9) {
				playerOne.elementArr[i][k].setAttribute('src', 'images/Minesweeper_bomb.png')
			} else {
				playerOne.elementArr[i][k].setAttribute('src', 'images/Minesweeper_' + playerOne.mineArr[i][k].value + '.png');
			}
		}
	}
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
	let size = playerOne.size;
	let randomNum = Math.floor(Math.random() * size) + size;
//if the random number is less than five (less than five mines) add ten to it to 
//ensure that there is a sufficient number of mines	
	if (randomNum < 10) {
		randomNum += 5;
	}
	
	let x, y = 0;
	
	for (let i = 0; i < randomNum; i++) {
		x = Math.floor(Math.random() * size);
		y = Math.floor(Math.random() * size);

//Check to make sure there isn't already a mine there, if there is
//remove one from the loop counter and continue on
		let tooManyMines = placeMine(x, y, size, playerOne);
		if (tooManyMines) {
			i -=1;
		}
	}
}

function placeMine(x, y, size, playerOne) {
	if (playerOne.mineArr[x][y].value != 10) {
		playerOne.mineArr[x][y].value = 10;
		if (!xTooBig(x, size)) {
			playerOne.mineArr[x+1][y].value += 1;
		}
		if (!xTooSmall(x)) {
			playerOne.mineArr[x-1][y].value += 1;
		}
		if (!yTooBig(y, size)) {
			playerOne.mineArr[x][y+1].value += 1;
		}
		if (!yTooSmall(y)) {
			playerOne.mineArr[x][y-1].value += 1;
		}
		if (!xTooBig(x, size) && !yTooBig(y, size)) {
			playerOne.mineArr[x+1][y+1].value += 1;
		}
		if (!xTooSmall(x) && !yTooSmall(y)) {
			playerOne.mineArr[x-1][y-1].value += 1;
		}
		if (!xTooBig(x, size) && !yTooSmall(y)) {
			playerOne.mineArr[x+1][y-1].value += 1;
		}
		if (!xTooSmall(x) && !yTooBig(y, size)) {
			playerOne.mineArr[x-1][y+1].value += 1;
		}
	} else {
		return true;
	}
}

function checkForMine(x, y, playerOne) {
	let size = playerOne.size;
	x = parseInt(x);
	y = parseInt(y);
	if (playerOne.mineArr[x][y].status != 'open') {
		if (playerOne.mineArr[x][y].value < 10) {
			if (playerOne.mineArr[x][y].value > 0) {
				playerOne.mineArr[x][y].status = 'open';
				return;
			} else {
				playerOne.mineArr[x][y].status = 'open';
				if (!xTooSmall(x)) {
					checkForMine((x-1), y, playerOne);
				}
				if (!xTooBig(x, size)) {
					checkForMine((x+1), y, playerOne);
				}
				if (!yTooSmall(y)) {
					checkForMine(x, (y-1), playerOne);
				}
				if (!yTooBig(y, size)) {
					checkForMine(x, (y+1), playerOne);
				} 
				if (!xTooBig(x, size) && !yTooBig(y, size)) {
					checkForMine((x+1), y+1, playerOne);
				}
				if (!xTooSmall(x) && !yTooSmall(y)) {
					checkForMine((x-1), y-1, playerOne);	
				}
				if (!xTooSmall(x) && !yTooBig(y, size)) {
					checkForMine((x-1), (y+1), playerOne);
				}
				if (!xTooBig(x, playerOne.size) && !yTooSmall(y)) {
					checkForMine((x+1), (y-1), playerOne);
				}
			}
		}
	} 
}

function yTooBig(y, size) {
	if ((y + 1) > (size - 1)) {
		return true;
	}
	return false;
}

function yTooSmall(y) {
	if ((y - 1) < 0) {
		return true;
	} 
	return false;
}

function xTooBig(x, size) {
	if ((x + 1) > (size - 1)) {
		return true;
	}
	return false;
}

function xTooSmall(x) {
	if ((x - 1) < 0) {
		return true;
	}
	return false;
}

function endGame(playerOne) {
	console.log("Final score: " + playerOne.score, playerOne.bestScore);
	if (playerOne.score > playerOne.bestScore) {
		console.log(playerOne.score, playerOne.bestScore);
		let data = {"name": playerOne.name, "playerScore": playerOne.score, "size": playerOne.size, "playerData": playerOne.data, "bestScore": playerOne.score, "password": playerOne.password};
		console.log(data);
		localStorage.setItem(playerOne.name, JSON.stringify(data));
	} else {
		let data = {"name": playerOne.name, "playerScore": playerOne.score, "size": playerOne.size, "playerData": playerOne.data, "bestScore": playerOne.bestScore, "password": playerOne.password};
		localStorage.setItem(playerOne.name, JSON.stringify(data));
	}
	revealBoard(playerOne);
	setTimeout(function() {cleanBoard();}, 3000);
}

function cleanBoard() {
	alert("Final score " + playerOne.score);
	document.getElementById('repeatPara').style.display = 'block';
	let playAgain = document.getElementById("playAgain").value.toLowerCase();
	if (playAgain === 'y') {
		playerOne.playerData = null;
		data = null;
		location = location;
		gamePlay();
	} else {
		alert("You either entered 'n' or an incorrect answer...in either case, get outta my casino!");
		location = location;
	}
}