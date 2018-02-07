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

const changeCards = document.getElementById('changeCards');
let exchangeCards = [];

const delay = 2000;

document.getElementById('betButt').addEventListener('click', playerBet);
document.getElementById('playButt').addEventListener('click', play);
document.getElementById('quitButt').addEventListener('click', quit);
document.getElementById('changeCardsButt').addEventListener('click', switchCards);

function setUp() {
	let playerName = localStorage["currentName"];
	let playerData = JSON.parse(localStorage.getItem(playerName));

	if (playerData.money === 0) {
		winLoose.innerHTML = "Come on, chump. We both know you ain't got enough money to play here. Either check out Minesweeper or scram! Guards!";
		setTimeout(quit, delay);
	}

	playAgain.style.display = "none";
	changeCardsButt.style.display = "none";
	playingBoard.style.display = "block";
	winLoose.innerHTML = "";

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
	game.playerMoney(playerData.money);
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

	removeCard(loc) {
		this.hand.splice(loc, 1);
	}

	updatePlayerHand(loc) {
		this.hand.splice(loc, 0, this.deck.dealCard());
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
 			cardImg.setAttribute('loc', i);
 			cardImg.id = i;
 			cardImg.addEventListener('click', selectCard);
 			playerBottom.appendChild(cardImg);
 			let div = document.createElement('div');
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
		let pairArr = this.findPairs();
		let returnBool = false;
		pairArr.forEach(function(el) {
			if (el === 4) {
				returnBool = true;
			}
		});
		return returnBool;		
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
		let pairArr = this.findPairs();
		let returnBool = false;
		pairArr.forEach(function(el) {
			if (el === 3) {
				returnBool = true;
			}
		});
		return returnBool;
	}

	twoPair() {
		let count = 0;
		let pairArr = this.findPairs();
		pairArr.forEach(function(el) {
			if (el === 2) {
				count++;
			}
		});
		return (count === 4);
	}

	onePair() {
		let returnBool = false;
		let pairArr = this.findPairs();
		pairArr.forEach(function(el) {
			if (el === 2) {
				returnBool = true;
			}
		});
		return returnBool;
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
		let returnArr = [0,0,0,0,0];
		//let count = 1;
		for (let i = 0; i < handArr.length; i++) {
			for (let j = 0; j < handArr.length; j++) {
				if (handArr[i] === handArr[j]) {
					returnArr[i]++;
				}
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
 		this.cardExchange = 0;
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
 			} else if (this.bet < 50) {
 				betTinyImage.style.display = 'none';
				betSmallImage.style.display = 'block';
				betBigImage.style.display = 'none';
				betHugeImage.style.display = 'none';
 			} else if (this.bet < 100) {
 				betTinyImage.style.display = 'none';
				betSmallImage.style.display = 'none';
				betBigImage.style.display = 'block';
				betHugeImage.style.display = 'none';
 			} else if (this.bet >= 100) {
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
 		let finalScore = 0;
		if(this.player.royalFlush()) {
			finalScore = 10;
		} else if (this.player.straightFlush()) {
			finalScore = 9;
		} else if(this.player.fourOfAKind()) {
			finalScore = 8;
		} else if (this.player.fullHouse()) {
			finalScore = 7;
		} else if (this.player.flush()) {
			finalScore = 6;
		} else if (this.player.straight()) {
			finalScore = 5;
		} else if (this.player.threeOfAKind()) {
			finalScore = 4;
		} else if (this.player.twoPair()) {
			finalScore = 3;
		} else if (this.player.onePair()) {
			finalScore = 2;
		} else {
			finalScore = 1;
		}
		return finalScore;
	}

	computerHandScore() {
 		let finalScore = 0;
		if(this.computer.royalFlush()) {
			finalScore = 10;
		} else if (this.computer.straightFlush()) {
			finalScore = 9;
		} else if(this.computer.fourOfAKind()) {
			finalScore = 8;
		} else if (this.computer.fullHouse()) {
			finalScore = 7;
		} else if (this.computer.flush()) {
			finalScore = 6;
		} else if (this.computer.straight()) {
			finalScore = 5;
		} else if (this.computer.threeOfAKind()) {
			finalScore = 4;
		} else if (this.computer.twoPair()) {
			finalScore = 3;
		} else if (this.computer.onePair()) {
			finalScore = 2;
		} else {
			finalScore = 1;
		}
		return finalScore;
	}

	compareHands() {
		let playerHand = this.player.returnCards();
		let computerHand = this.computer.returnCards();
		for (let i = playerHand.length-1; i >= 0; i--) {
			if (this.player.getValueOfCard(playerHand[i]) > this.computer.getValueOfCard(computerHand[i])) {
				return "Player"
			} else if (this.player.getValueOfCard(computerHand[i]) > this.player.getValueOfCard(playerHand[i])) {
				return "Computer";
			}
		}
		return "Tie";
	}

	sortPlayerCards() {
		this.player.hand = this.player.sortCards(this.player.returnCards());
	}

	sortComputerCards() {
		this.computer.hand = this.computer.sortCards(this.computer.returnCards());
	}

	changeCards(loc) {
		this.player.updatePlayerHand(loc);
 		this.player.cleanPlayerBoard();
		this.player.displayPlayerCards();
	}

	cardsSelected() {
		this.cardExchange = parseInt(this.cardExchange);
		this.cardExchange++;
		return this.cardExchange;
	}
}

function playerBet() {
	bet = document.getElementById('betNumber').value;
	if (bet) {
		document.getElementById('betNumber').value = "";
		game.playerBet(bet);
		game.updateMoneyDisplay();
	}
}

function computerPlay() {
	game.flipCards();
	while (game.countComputerScore() < 16) {
		game.dealComputer();
	}
	setTimeout(endGame, delay);
}

function endGame() {
	game.sortPlayerCards();
	game.sortComputerCards();
	
	cleanUp();

	if (game.playerHandScore() === game.computerHandScore()) {
		winString = game.compareHands();
		if (winString === "Player") {
			console.log("You won!!")
		} else if (winString === "Computer") {
			console.log("Computer won!!");
		} else {
			console.log("Ended in a tie...");
		}
	} else {
		console.log(game.playerHandScore() > game.computerHandScore() ? "You win!" : "You loose!");
	}

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

function switchCards(event) {
	for (let i = 0; i < exchangeCards.length; i++) {
		game.player.removeCard(exchangeCards[i]);
		game.changeCards(exchangeCards[i]);
	}
	exchangeCards = [];
	game.cardExchange = 0;
	changeCardsButt.style.display = 'none';
}

function selectCard(event) {
	cardLoc = parseInt(event.target.getAttribute('loc'));
	let currentImage = document.getElementById(cardLoc);
	if (!currentImage.classList.contains("selected")) {
		currentImage.classList = "selected";
		exchangeCards[game.cardExchange] = cardLoc;
		game.cardsSelected();
	
		if (game.cardExchange < 4) {
			changeCardsButt.style.display = 'block';
		} else if (game.cardExchange > 3) {
			for (let i = 0; i < exchangeCards.length; i++) {
				document.getElementById(exchangeCards[i]).removeAttribute('class');
			}
			exchangeCards = [];
			game.cardExchange = 0;
			changeCardsButt.style.display = 'none';
		}
	} else {
		currentImage.removeAttribute('class');
		exchangeCards.pop();
		game.cardExchange--;
		if (game.cardExchange === 0) {
			changeCardsButt.style.display = 'none';
		}
	}

}

function quit() {

}

function play() {
	setUp();
}

play();