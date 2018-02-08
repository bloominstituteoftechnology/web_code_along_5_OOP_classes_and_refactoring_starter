class Player {
	constructor(name, playerScore, size, bestScore, money, password) {
		this.name = name;
		this.score = playerScore;
		this.size = size;
		this.bestScore = bestScore;
		this.money = money;
		this.password = password
	}
}

document.getElementById('playAgain').addEventListener('click', playAgain);
document.getElementById('quit').addEventListener('click', quit);

setUp();

function setUp() {
	document.getElementById('repeatPara').style.display = 'none';
	playerName = localStorage.getItem("currentName");
	playerData = JSON.parse(localStorage.getItem(playerName));

	let boardSize = 0;

	while (!boardSize) {
		boardSize = parseInt(prompt("How big would you like the board?"));
	}

	if (!playerData.bestScore) {
		playerOne = new Player(playerName, 0, boardSize, 0, playerData.money, playerData.password);
		document.getElementById('scorePara').innerHTML = "Good luck, " + capitalizeName(playerName);
	} else {
		bestScore = playerData.bestScore;
		playerOne = new Player(playerName, 0, boardSize, playerData.bestScore, playerData.money, playerData.password);
		document.getElementById('scorePara').innerHTML = "Welcome back, " + capitalizeName(playerName) + ". Previous best score: " + playerData.bestScore;
	}	

	createMineArr(playerOne);
}

function capitalizeName(name) {
    return name.charAt(0).toUpperCase() + name.slice(1);
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
	let gameBoard = document.getElementById('game-board');
	grid.className = 'grid';
	gameBoard.appendChild(grid);
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
	spaceElement.setAttribute('src', 'images/MinesweeperImages/Minesweeper_0.png');
	spaceElement.setAttribute('locX', i);
	spaceElement.setAttribute('locY', k);
	spaceElement.addEventListener('contextmenu', function() {event.preventDefault(); rightClick(event, playerOne)});
	spaceElement.addEventListener('mouseup', function() {clickFunction(event, playerOne)});
	cell.appendChild(spaceElement);
	return spaceElement;
}

function rightClick(e, playerOne) {
	let xLoc = e.target.getAttribute('locX');
	let yLoc = e.target.getAttribute('locY');
	if (playerOne.mineArr[xLoc][yLoc].status != 'open') {
		playerOne.elementArr[xLoc][yLoc].setAttribute('src', 'images/MinesweeperImages/Minesweeper_flagged.png');
	}
}

function clickFunction(e, playerOne) {
	if (e.which != 3) {
		event.preventDefault();
		let xLoc = e.target.getAttribute('locX');
		let yLoc = e.target.getAttribute('locY');
		if (!checkWin(playerOne)) {
				if (playerOne.mineArr[xLoc][yLoc].value > 9) {
					playerOne.elementArr[xLoc][yLoc].setAttribute('src', 'images/MinesweeperImages/Minesweeper_bomb.png')
					endGame(playerOne);
				} else {
					checkForMine(xLoc, yLoc, playerOne);
					updateBoard(playerOne);
				}
		} else {
			alert("You won!!!! Adding fifty to your score!");
			playerOne.score += 50;
			endGame(playerOne);
		}
		document.getElementById('score').innerHTML = 'Player Score: ' + playerOne.score;
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
				playerOne.elementArr[i][k].setAttribute('src', 'images/MinesweeperImages/Minesweeper_10.png');
			} else if (playerOne.mineArr[i][k].value > 9) {
				playerOne.elementArr[i][k].setAttribute('src', 'images/MinesweeperImages/Minesweeper_bomb.png')
			} else {
				playerOne.elementArr[i][k].setAttribute('src', 'images/MinesweeperImages/Minesweeper_' + playerOne.mineArr[i][k].value + '.png');
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
							playerOne.elementArr[i][k].setAttribute('src', 'images/MinesweeperImages/Minesweeper_10.png');
						} else {
							playerOne.score += 1;
							playerOne.elementArr[i][k].setAttribute('src', 'images/MinesweeperImages/Minesweeper_' + playerOne.mineArr[i][k].value + '.png');
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
// if the random number is less than size (less than five mines)
// add the size of the board to it to ensure that there 
// are a sufficient number of mines.
	if (randomNum < size) {
		randomNum += size;
	}
	
	let x, y = 0;
	
	for (let i = 0; i < randomNum; i++) {
		x = Math.floor(Math.random() * size);
		y = Math.floor(Math.random() * size);

// Check to make sure there isn't already a mine there, if there is
// remove one from the loop counter and continue on.
		let tooManyMines = placeMine(x, y, size, playerOne);
		if (tooManyMines) {
			i -=1;
		}
	}
}

function placeMine(x, y, size, playerOne) {
	if (playerOne.mineArr[x][y].value < 10) {
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
	playerOne.money += playerOne.score;
	localStorage.removeItem(playerOne.name);
	
	if (!playerOne.bestScore) {
		playerOne.bestScore = 0;
	}

	if (playerOne.score > playerOne.bestScore) {
		playerData = {"name": playerOne.name, "playerScore": playerOne.score, "bestScore": playerOne.score, "money": playerOne.money, "password": playerOne.password};
		localStorage.setItem(playerOne.name, JSON.stringify(playerData));
	} else {
		playerData = {"name": playerOne.name, "playerScore": playerOne.score, "bestScore": playerOne.bestScore, "money": playerOne.money, "password": playerOne.password};
		localStorage.setItem(playerOne.name, JSON.stringify(playerData));
	}

	revealBoard(playerOne);
	setTimeout(function() {cleanBoard();}, 3000);
}

function cleanBoard() {
	alert("Final score " + playerOne.score);
	document.getElementById('repeatPara').style.display = 'block';
	document.getElementById('scorePara').innerHTML = "";
}

function playAgain() {
	document.getElementById('repeatPara').style.display = 'none';
	let div = document.getElementById('game-board');
	while(div.firstChild) {
    	div.removeChild(div.firstChild);
	}
	setUp();
}

function quit() {
	window.location.href = "index.html";
}