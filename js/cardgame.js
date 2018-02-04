/* 
 ** Possibly have a separate class for AI behavior
 ** but that will change so much depending on the game.
 ** Maybe have a prototype AI class that you can utilize
 ** ----------THINGS TO RESEARCH----------
 **
 */

 //Card graphics from https://code.google.com/archive/p/vector-playing-cards/
 //Betting background image from http://suptg.thisisnotatrueending.com/archive/18015714/images/1329697290100.png
 //Small poker chip image from https://icons8.com/iconizer/files/Gamble/orig/Chips.png
const suitArr = ["Clubs", "Diamonds", "Hearts", "Spades"];
const rankArr = [2,3,4,5,6,7,8,9, "10", "Jack", "Queen", "King", "Ace"];
const imageHeader = "images/CardGameImages/PNG/";
const backgroundImage = document.createElement('img');
const bottomCardOne = document.createElement('img');
const bottomCardTwo = document.createElement('img');
const bottomCardThree = document.createElement('img');
const bottomCardFour = document.createElement('img');
const betTinyImage = document.createElement('img');
const betSmallImage = document.createElement('img');
const betBigImage = document.createElement('img');
const betHugeImage = document.createElement('img');


function setUp() {
	document.getElementById('hit').addEventListener('click', hit);
	document.getElementById('stay').addEventListener('click', stay);
	document.getElementById('bet').addEventListener('click', bet);

	let computerTop = document.getElementById('computerTop');
	let betMid = document.getElementById('betMid');
	let playerBottom = document.getElementById('playerBottom');
	let topScreen = document.getElementById('topCardImages');
	let bottomScreen = document.getElementById('bottomCardImages');

	bottomCardOne.setAttribute('src', imageHeader + 'honor_clubs.png');
	bottomCardTwo.setAttribute('src', imageHeader + 'honors_spade-14.png');
	bottomCardThree.setAttribute('src', imageHeader + 'honor_diamond.png');
	bottomCardFour.setAttribute('src', imageHeader + 'honor_heart-14.png');
	backgroundImage.setAttribute('src', imageHeader + 'betting-circle.png');
	betHugeImage.setAttribute('src', imageHeader + 'big-bet.png');
	betBigImage.setAttribute('src', imageHeader + 'poker-chips.png');
	betSmallImage.setAttribute('src', imageHeader + 'Chips.png');
	betTinyImage.setAttribute('src', imageHeader + 'small-bet.png');

	betTinyImage.style.height = '50px';
	betTinyImage.style.width = '50px';
	backgroundImage.className = "circle-image";
	betTinyImage.className = "bet-image";
	betSmallImage.className = "bet-image";
	betBigImage.className = "bet-image";
	betHugeImage.className = "bet-image";

	bottomScreen.appendChild(bottomCardOne);
	bottomScreen.appendChild(bottomCardTwo);
	betMid.appendChild(backgroundImage);
	betMid.appendChild(betTinyImage);
	betMid.appendChild(betSmallImage);
	betMid.appendChild(betBigImage);
	betMid.appendChild(betHugeImage);
	topScreen.appendChild(bottomCardThree);
	topScreen.appendChild(bottomCardFour);

	betTinyImage.style.display = 'none';
	betSmallImage.style.display = 'none';
	betBigImage.style.display = 'none';
	betHugeImage.style.display = 'none';
}

class Deck {
 	constructor(numDecks) {
 		this.numDecks = numDecks;
 		this.deck = [];
 	}

 	buildDeck() {
 		let counter = 0;
 		for (let j = 0; j < this.numDecks; j++) {
	 		for (let i = 0; i < 4; i++) {
	 			for (let k = 0; k < 13; k++) {
	 				this.deck[counter] = new Card(suitArr[i], rankArr[k]);
	 				counter++;
	 			}
	 		}
	 	}
 	}

 	printDeck() {
 		console.log(this.deck);
 	}

 	shuffleDeck() {
 	//Fisher-Yates shuffle
 		let i = 0;
 		let j = 0;
 		let temp = null;

  		for (i = this.deck.length - 1; i > 0; i -= 1) {
    		j = Math.floor(Math.random() * (i + 1));
    		temp = this.deck[i];
    		this.deck[i] = this.deck[j];
    		this.deck[j] = temp;
  		}
 	}

 	dealCard() {
 		return this.deck.pop();
 	}
}

class Hand {
	constructor() {
		this.deck = new Deck(1);
		this.deck.buildDeck();
		this.deck.shuffleDeck();
		this.hand = [];
	}

	addCard() {
		this.hand.push(this.deck.dealCard());
	}

	handScore() {
		let score = 0;
 		for (let i = 0; i < this.hand.length; i++) {
 			switch (this.hand[i].rank) {
 				case '10':
 					score += 10;
 					break;
 				case 'Jack':
 					score += 11;
 					break;
 				case 'Queen':
 					score += 12;
 					break;
 				case 'King':
 					score += 13;
 					break;
 				case 'Ace':
 					score += 14;
 					break;
 				default:
 					score += this.hand[i].rank;
 			}
 		}
 		return score;
	}

	toString() {
		let returnString = "";
		for (let i = 0; i < this.hand.length; i++) {
			returnString += this.hand[i].rank + " of " + this.hand[i].suit + " ";
		}
		return returnString;
	}

	returnCards() {
		let returnArr = [];
		for (let i = 0; i < this.hand.length; i++) {
			returnArr.push(this.hand[i]);
		}
		return returnArr;
	}

	countBlackJackScore() {
		let score = this.handScore();
 		for (let i = 0; i < this.hand.length; i++) {
 			if (typeof this.hand[i].rank === 'string') {
	 			if (this.hand[i].rank.includes("Jack")) {
	 				score -= 1;
	 			} else if (this.hand[i].rank.includes("Queen")) {
	 				score -= 2;
	 			} else if (this.hand[i].rank.includes("King")) {
	 				score -= 3;
	 			} else if (this.hand[i].rank.includes("Ace")) {
	 				score -= 3;
	 			}
 			}
 		}

 		if (score > 21) {
	 		for (let i = 0; i < this.hand.length; i++) {
	 			if (this.hand[i].rank === "Ace") {
	 				score -= 10;
	 			}
	 		}
	 	}
 		return score;
 	}

 	cleanPlayerBoard() {
 		while (playerBottom.firstChild) {
 			playerBottom.removeChild(playerBottom.firstChild);
 		}
 	}

 	cleanComputerBoard() {
 		while (computerTop.firstChild) {
 			computerTop.removeChild(computerTop.firstChild);
 		}
 	}

 	displayPlayerCards() {
 		for (let i = 0; i < this.hand.length; i++) {
 			let rank = this.hand[i].rank;
 			let suit = this.hand[i].suit;
 			let cardString = imageHeader + rank + "_of_" + suit + ".png";
 			let cardImg = document.createElement('img');
 			cardImg.setAttribute('src', cardString);
 			playerBottom.appendChild(cardImg);
 		}
 	}

 	displayComputerCards() {
 		for (let i = 0; i < this.hand.length; i++) {
 			let rank = this.hand[i].rank;
 			let suit = this.hand[i].suit;
 			let cardString = imageHeader + rank + "_of_" + suit + ".png";
 			let cardImg = document.createElement('img');
 			cardImg.setAttribute('src', cardString);
 			computerTop.appendChild(cardImg);
 		}
 	}

 	displayComputerHand() {	
 		let cardString = imageHeader + "red_back.png"
 		let cardImg = document.createElement('img');
 		cardImg.setAttribute('src', cardString);
 		computerTop.appendChild(cardImg);
	 	let showComputerCard = document.createElement('img');
	 	let rank = this.hand[0].rank;
	 	let suit = this.hand[0].suit;
	 	showComputerCard .setAttribute('src', imageHeader + rank + "_of_" + suit + ".png");
	 	computerTop.appendChild(showComputerCard);
 	}

 	addComputerImage() {
 		let cardString = imageHeader + "red_back.png"
 	}
}

class Card {
 	constructor(suit, rank) {
 		this.suit = suit;
 		this.rank = rank;
 	}
}

class blackJack {
 	constructor() {
 		this.player = new Hand();
 		this.computer = new Hand();
 		this.money;
 		this.bet;
 	}

 	printPlayerHand() {
 		return(this.player.toString());
 	}

 	printComputerHand() {
 		return(this.computer.toString());
 	}

 	dealPlayer() {
 		this.player.addCard();
 		this.player.cleanPlayerBoard();
		this.player.displayPlayerCards();
 	}

 	dealComputer() {
  		this.computer.addCard();
  		this.computer.cleanComputerBoard();
  		this.computer.displayComputerCards();
 	}

 	buildHand() {
 		for (let i = 0; i < 2; i++) {
  			this.player.addCard();
 			this.computer.addCard();
 		}

 		this.player.displayPlayerCards();
 		this.computer.displayComputerHand();
 	}

 	flipCards() {
 		this.computer.cleanComputerBoard();
 		this.computer.displayComputerCards();
 	}

 	countPlayerScore() {
 		return this.player.countBlackJackScore();
 	}

 	countComputerScore() {
 		return this.computer.countBlackJackScore();
 	}

 	playerHasBlackJack() {
 		let blackArr = this.player.returnCards();
 		if (typeof blackArr[0] === 'string' && typeof blackArr[1] === 'string') {
 			return true;
 		} else {
 			return false;
 		}
 	}

 	computerHasBlackJack() {
 		let blackArr = this.computer.returnCards();
 		if (typeof blackArr[0].rank === 'string' && typeof blackArr[1].rank === 'string') {
 			return true;
 		} else {
 			return false;
 		}
 	}

 	playerMoney(money) {
 		this.money = money;
 	}

 	playerBet(bet) {
 		if (bet > this.money) {
 			alert("Come on, Charlie, we both know you don't have that kinda dough...");
 		}
 		else {
 			this.money -= bet;
 			this.bet += bet;
 			if (bet > 5) {
 				betTinyImage.style.display = 'block';
				betSmallImage.style.display = 'none';
				betBigImage.style.display = 'none';
				betHugeImage.style.display = 'none';
 			} else if (bet > 10) {
 				betTinyImage.style.display = 'none';
				betSmallImage.style.display = 'block';
				betBigImage.style.display = 'none';
				betHugeImage.style.display = 'none';
 			} else if (bet > 50) {
 				betTinyImage.style.display = 'none';
				betSmallImage.style.display = 'none';
				betBigImage.style.display = 'block';
				betHugeImage.style.display = 'none';
 			} else if (bet > 100) {
 				betTinyImage.style.display = 'none';
				betSmallImage.style.display = 'none';
				betBigImage.style.display = 'none';
				betHugeImage.style.display = 'block';
 			}
 		}
 	}
}

setUp();
game = new blackJack();
game.buildHand();
game.playerMoney(500);

if (game.playerHasBlackJack() || game.computerHasBlackJack()) {
	console.log(game.playerHasBlackJack(), game.computerHasBlackJack());
	game.flipCards();
	endGame();
}

function bet() {
	bet = document.getElementById('betNumber').value;
	game.playerBet(bet);
}

function hit() {
	console.log("hit");
	game.dealPlayer();
	console.log("Player Hand -> ", game.printPlayerHand());
	console.log("Player Score -> ", game.countPlayerScore());
	if (game.countPlayerScore() > 21) {
		endGame();
	}
}

function stay() {
	console.log("stay");
	computerPlay();
}

function computerPlay() {
	console.log("This is the computer playing...");
	game.flipCards();
	while (game.countComputerScore() < 16) {
		game.dealComputer();
	}
	endGame();
}

function endGame() {
	document.getElementById('hit').removeEventListener('click', hit);
	document.getElementById('stay').removeEventListener('click', stay);

	playerScore = game.countPlayerScore();
	computerScore = game.countComputerScore();
	if (game.playerHasBlackJack()) {
		console.log("YOU'RE IN THE MONEY");
	} else if (game.computerHasBlackJack()) {
		console.log("Woah, baby, looks like you're fresh outta luck...");
	} else if (playerScore > 21) {
		console.log("Better luck next time");
	} else if (computerScore > 21) {
		console.log("Computer busted! You win!");
	} else {
		console.log(playerScore > computerScore ? "You win!" : "You loose!");
	}
}