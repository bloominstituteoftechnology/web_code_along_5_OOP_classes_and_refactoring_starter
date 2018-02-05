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
const moneyPara = document.getElementById('dough');
const winLoosePara = document.getElementById('winLoose');
const playAgain = document.getElementById('playAgain');
const computerTop = document.getElementById('computerTop');
const betMid = document.getElementById('betMid');
const playerBottom = document.getElementById('playerBottom');
const topScreen = document.getElementById('topCardImages');
const bottomScreen = document.getElementById('bottomCardImages');
const playingBoard = document.getElementById('playingBoard');
const moneyLost = document.getElementById('moneyLost');
const moneyLeft = document.getElementById('moneyLeft');
const initialMoney = 500;
const delay = 2000;

document.getElementById('betButt').addEventListener('click', playerBet);
document.getElementById('playButt').addEventListener('click', play);
document.getElementById('quitButt').addEventListener('click', quit);

function setUp() {
	playAgain.style.display = "none";
	winLoose.innerHTML = "";
	playingBoard.style.display = 'block';
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

	game = new poker();
	game.cleanPlayerHand();
	game.cleanComputerHand();
	game.buildHand();
	game.playerMoney(initialMoney);
	game.updateMoneyDisplay();
}

function cleanUp() {
	playingBoard.style.display = 'none';
	game.cleanPlayerHand();
	game.cleanComputerHand();
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

 	displayHiddenComputerCards() {
  		for (let i = 0; i < this.hand.length; i++) {
 			let cardString = imageHeader + "red_back.png";
 			let cardImg = document.createElement('img');
 			cardImg.setAttribute('src', cardString);
 			computerTop.appendChild(cardImg);
 		}
 	}



//Basic merge sort that I adjusted to work with card values
//(aka Jack's being eleven, Queens twleve, etc, etc)

	sortCards(arr) {
 		let length = arr.length;
  		if (length < 2) {
 			return arr;
 		}
 		let middle = Math.floor(length / 2);
 		let left = arr.slice(0, middle);
 		let right = arr.slice(middle);
 		return this.merge(this.sortCards(left), this.sortCards(right));
 	}

 	merge(left, right) {
 		let sortHand = [];
 		let leftLength = left.length;
 		let rightLength = right.length;
 		let l = 0;
 		let r = 0;
 		while (l < leftLength && r < rightLength) {
 			let leftCard = this.getValueOfCard(left[l]);
 			let rightCard = this.getValueOfCard(right[r]);
 			if (leftCard < rightCard) {
 				sortHand.push(left[l++]);
 			} else {
 				sortHand.push(right[r++]);
 			}
 		}
 		return sortHand.concat(left.slice(l).concat(right.slice(r)));
 	}

 	getValueOfCard(card) {
 		let score = 0;
		switch (card.rank) {
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
				score += card.rank;
		}
 		return score;
 	}

 	getValueOfHand(playerHand) {
 		let returnHand = [];
 		for (let i = 0; i < playerHand.length; i++) {
 			returnHand.push(this.getValueOfCard(playerHand[i]));
 		}
 		return returnHand;
 	}

 	addComputerImage() {
 		let cardString = imageHeader + "red_back.png"
 	}

	royalFlush() {
		let cardOne;
		let cardTwo;
		for (let i = 0; i < this.hand.length-2; i++) {
			cardOne = this.hand[i];
			cardTwo = this.hand[i+1]
			if (cardOne != 10) {
				return false;
			}
			if (cardOne != cardTwo + 1) {
				return false;
			}
			if (cardOne.suit != cardTwo.suit) {
				return false;
			}
		}
		return true;
	}

	straightFlush() {
		return this.straight() && this.flush();
	}

	fourOfAKind() {
		let pairArr = this.hand.findPairs();
		pairArr.forEach(function(el) {
			if (el === 4) {
				return true;
			}
		});
		return false;		
	}

	fullHouse() {
		return (this.threeOfAKind() && this.onePair());
	}

	flush() {
		let correctSuit = this.hand[0].suit;
		for (let i = 0; i < this.hand.length; i++) {
			if (this.hand[i].suit != correctSuit) {
				return false;
			}
		}

		return true;
	}

	straight() {
		let handArr = this.getValueOfHand(this.hand);
		for (let i = 0; i < handArr.length - 1; i++) {
			if (handArr[i] != (handArr[i+1] + 1)) {
				return false;
			}
		}
		return true;
	}

	threeOfAKind() {
		let pairArr = this.hand.findPairs();
		pairArr.forEach(function(el) {
			if (el === 3) {
				return true;
			}
		});
		return false;
	}

	twoPair() {
		let count = 0;
		let pairArr = this.hand.findPairs();
		pairArr.forEach(function(el) {
			if (el === 2) {
				count++;
			}
		});
		return (count === 2);
	}

	onePair() {
		let pairArr = this.hand.findPairs();
		pairArr.forEach(function(el) {
			if (el === 1) {
				return true;
			}
		});
		return false;
	}

	highCard() {
		let handArr = this.getValueOfHand(this.hand);
		let highCard = 0;
		let highIndex = 0;
		for (let i = 0; i < handArr.length; i++) {
			if (handArr[i] > highCard) {
				highCard = handArr[i];
				highIndex = i;
			}
		}
		return this.hand[highIndex];
	}

	findPairs() {
		let handArr = this.getValueOfHand(this.hand);
		console.log(handArr);
		let returnArr = [];
		let count = 1;
		for (let i = 0; i < handArr.length; i++) {
			if (handArr[i] === handArr[i+1]) {
				count++;
			} else {
				returnArr.push(count);
				count = 1;
			}
		}
		return returnArr;
	}
}

class Card {
 	constructor(suit, rank) {
 		this.suit = suit;
 		this.rank = rank;
 	}
}

class poker {
 	constructor() {
 		this.player = new Hand();
 		this.computer = new Hand();
 		this.money = 0;
 		this.bet = 0;
 	}

 	printPlayerHand() {
 		return(this.player.toString());
 	}

 	printComputerHand() {
 		return(this.computer.toString());
 	}

 	cleanPlayerHand() {
 		this.player.cleanPlayerBoard();
 	}

 	cleanComputerHand() {
 		this.computer.cleanComputerBoard();
 	}

 	dealPlayer() {
 		this.player.addCard();
 		this.player.cleanPlayerBoard();
		this.player.displayPlayerCards();
 	}

 	dealComputer() {
  		this.computer.addCard();
  		this.computer.cleanComputerBoard();
  		this.computer.displayHiddenComputerCards();
 	}

 	buildHand() {
 		for (let i = 0; i < 5; i++) {
  			this.player.addCard();
 			this.computer.addCard();
 		}

 		this.player.displayPlayerCards();
 		this.computer.displayHiddenComputerCards();
 	}

 	flipCards() {
 		this.computer.cleanComputerBoard();
 		this.computer.displayComputerCards();
 		this.player.cleanPlayerBoard();
		this.player.displayPlayerCards();
 	}

 	countPlayerScore() {
 		return this.player.countBlackJackScore();
 	}

 	countComputerScore() {
 		return this.computer.countBlackJackScore();
 	}

 	playerMoney(money) {
 		this.money = money;
 	}

 	playerBet(bet) {
 		bet = parseInt(bet);
 		this.bet = parseInt(this.bet);
 		if (bet > this.money) {
 			alert("Come on, Charlie, we both know you don't have that kinda dough...");
 		}
 		else {
 			this.money -= bet;
 			this.bet += bet;
 			if (this.bet < 5) {
 				betTinyImage.style.display = 'block';
				betSmallImage.style.display = 'none';
				betBigImage.style.display = 'none';
				betHugeImage.style.display = 'none';
 			} else if (this.bet < 10) {
 				betTinyImage.style.display = 'none';
				betSmallImage.style.display = 'block';
				betBigImage.style.display = 'none';
				betHugeImage.style.display = 'none';
 			} else if (this.bet < 50) {
 				betTinyImage.style.display = 'none';
				betSmallImage.style.display = 'none';
				betBigImage.style.display = 'block';
				betHugeImage.style.display = 'none';
 			} else if (this.bet > 100) {
 				betTinyImage.style.display = 'none';
				betSmallImage.style.display = 'none';
				betBigImage.style.display = 'none';
				betHugeImage.style.display = 'block';
 			}
 		}
 	}

 	updateMoneyDisplay() {
 		dough.innerHTML = "Remaining Dough: " + this.money;
 	}

 	playerHandScore() {
		return this.player.royalFlush();
		return this.player.straightFlush();
		return this.player.fourOfAKind();
		return this.player.fullHouse();
		return this.player.flush();
		return this.player.straight();
		return this.player.threeOfAKind();
		return this.player.twoPair();
		return this.player.onePair();
		return this.player.highCard();
	}

	computerHandScore() {
		return this.computer.royalFlush();
		return this.computer.straightFlush();
		return this.computer.fourOfAKind();
		return this.computer.fullHouse();
		return this.computer.flush();
		return this.computer.straight();
		return this.computer.threeOfAKind();
		return this.computer.twoPair();
		return this.computer.onePair();
		return this.computer.highCard();		
	}

	sortPlayerCards() {
		this.player.hand = this.player.sortCards(this.player.returnCards());
		this.player.findPairs();
	}

	sortComputerCards() {
		this.computer.hand = this.computer.sortCards(this.computer.returnCards());
	}
}

function playerBet() {
	bet = document.getElementById('betNumber').value;
	game.playerBet(bet);
	game.updateMoneyDisplay();
}

function computerPlay() {
	game.flipCards();
	while (game.countComputerScore() < 16) {
		game.dealComputer();
	}
	setTimeout(endGame, delay);
}

function endGame() {
	cleanUp();

	playerScore = game.countPlayerScore();
	computerScore = game.countComputerScore();

	let loss = initialMoney - game.money;
	if (loss < 0) {
		loss = loss * -1;
		
	} else {
		
	}
	if (game.money < 1) {
		playAgain.style.display = 'none';
		moneyLeft.innerHTML = "You'd better come back when you have a bit more dough...guards, get 'em outta here.";
	} else {
		playAgain.style.display = 'block';
		moneyLeft.innerHTML = "You've got some dough yet, here's how much you've got: $" + game.money;
	}
}

function play() {
	setUp();
	game.sortPlayerCards();
	game.sortComputerCards();
	game.flipCards();
}

function quit() {

}

play();