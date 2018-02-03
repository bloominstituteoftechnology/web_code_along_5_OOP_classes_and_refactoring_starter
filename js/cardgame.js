/* 
 ** Possibly have a separate class for AI behavior
 ** but that will change so much depending on the game.
 ** Maybe have a prototype AI class that you can utilize
 ** ----------THINGS TO RESEARCH----------
 **
 */

 //Card graphics from https://code.google.com/archive/p/vector-playing-cards/
const suitArr = ["Clubs", "Diamonds", "Hearts", "Spades"];
const rankArr = [2,3,4,5,6,7,8,9, "10", "Jack", "Queen", "King", "Ace"];

document.getElementById('hit').addEventListener('click', hit);
document.getElementById('stay').addEventListener('click', stay);
let computerTop = document.getElementById('computerTop');
let betMid = document.getElementById('betMid');
let playerBottom = document.getElementById('playerBottom');
let imageHeader = "images/CardGameImages/PNG/";

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
 		/*if (score > 21 && this.hand.includes("Ace") != false) {
 			score -= 9;
 		}*/
 		return score;
 	}

 	cleanBoard() {
 		while (playerBottom.firstChild) {
 			playerBottom.removeChild(playerBottom.firstChild);
 		}
 	}

 	displayPlayerHand() {
 		for (let i = 0; i < this.hand.length; i++) {
 			let rank = this.hand[i].rank;
 			let suit = this.hand[i].suit;
 			console.log(this.hand[i]);
 			let cardString = imageHeader + rank + "_of_" + suit + ".png";
 			let cardImg = document.createElement('img');
 			cardImg.setAttribute('src', cardString);
 			playerBottom.appendChild(cardImg);
 		}
 	}

 	displayComputerHand() {
	 	for (let i = 0; i < this.hand.length; i++) { 		
	 		let cardString = imageHeader + "red_back.png"
	 		let cardImg = document.createElement('img');
	 		cardImg.setAttribute('src', cardString);
	 		computerTop.appendChild(cardImg);
	 	}
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
 	}

 	printPlayerHand() {
 		return(this.player.toString());
 	}

 	printComputerHand() {
 		return(this.computer.toString());
 	}

 	dealPlayer() {
 		this.player.addCard();
 		this.player.cleanBoard();
 		this.player.displayPlayerHand();
 	}

 	dealComputer() {
  		this.computer.addCard();
  		this.computer.cleanBoard();
  		this.computer.displayComputerHand();
 	}

 	buildHand() {
 		for (let i = 0; i < 2; i++) {
  			this.player.addCard();
 			this.computer.addCard();
 		}
 		this.player.displayPlayerHand();
 		this.computer.displayComputerHand();
 	}

 	flipCards() {
		let computerArr = this.computer.returnCards();
		let rank;
		let suit;
		for (let i = 0; i < computerArr.length; i++) {
			rank = computerArr[i].rank;
			suit = computerArr[i].suit;
			let cardString = imageHeader + rank + "_of_" + suit + ".png";
		} 		
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
}

game = new blackJack();
game.buildHand();
/*console.log(game.printPlayerHand());
console.log(game.countPlayerScore());
console.log(game.printComputerHand());
console.log(game.countComputerScore());*/


function hit() {
	console.log("hit");
	game.dealPlayer();
	console.log("Player Hand -> ", game.printPlayerHand());
	console.log("Player Score -> ", game.countPlayerScore());
	if (game.countPlayerScore() > 21) {
		alert("You busted! Game over...");
		endGame();
	}
}

function stay() {
	console.log("stay");
	computerPlay();
}

function computerPlay() {
	console.log("This is the computer playing...");
	while (game.countComputerScore() < 16) {
		game.dealComputer();
		console.log(game.printComputerHand());
		console.log(game.countComputerScore());
	}
	endGame();
}

function endGame() {
	document.getElementById('hit').removeEventListener('click', hit);
	document.getElementById('stay').removeEventListener('click', stay);
	playerScore = game.countPlayerScore();
	computerScore = game.countComputerScore();
	if (playerScore > 21) {
		console.log("Better luck next time");
	} else if (computerScore > 21) {
		alert("Computer busted! You win!");
	} else {
		console.log(playerScore > computerScore ? "You win!" : "You loose!");
	}
}