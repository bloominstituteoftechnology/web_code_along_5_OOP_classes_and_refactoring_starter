/** Make a set card class and a set deck class
 ** From there you can have a main class where
 ** the user can select the game they want to play
 ** and have the separate card games in separate
 ** classes that all utilize the card class and deck
 ** class...
 ** Possibly have a separate class for AI behavior
 ** but that will change so much depending on the game.
 ** Maybe have a prototype AI class that you can utilize
 ** ----------THINGS TO RESEARCH----------
 **/
const suitArr = ["Clubs", "Diamonds", "Hearts", "Spades"];
const rankArr = [2,3,4,5,6,7,8,9, "10", "Jack", "Queen", "King", "Ace"];

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

 		if (score > 21 && this.hand.includes("Ace") != -1) {
 			score -= 9;
 		}
 		return score;
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
 		return (this.player.countBlackJackScore() <= 21);
 	}

 	dealComputer() {
  		this.computer.addCard();
  		return (this.computer.countBlackJackScore() <= 21);
 	}

 	buildHand() {
 		for (let i = 0; i < 2; i++) {
 			this.player.addCard();
 			this.computer.addCard();
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
console.log("Player Hand ->", game.printPlayerHand());
console.log("Computer Hand ->", game.printComputerHand());

let playerScore = game.countPlayerScore();
let computerScore = game.countComputerScore();
console.log("Player blackJack ", game.playerHasBlackJack());
console.log("Computer blackJack ", game.computerHasBlackJack());
console.log("Player Score ->", playerScore, "Computer Score ->", computerScore);
while (game.countPlayerScore() < 21) {
	console.log()
	console.log("Player Hand ->", game.printPlayerHand());
	console.log("Computer Hand ->", game.printComputerHand());
}
console.log("Player Hand ->", game.printPlayerHand());
console.log("Computer Hand ->", game.printComputerHand());
console.log("Player Score ->", game.countPlayerScore(), "Computer Score ->", game.countComputerScore());
console.log(game.countPlayerScore() < game.countComputerScore() ? "Computer wins!" : "Player Wins!");