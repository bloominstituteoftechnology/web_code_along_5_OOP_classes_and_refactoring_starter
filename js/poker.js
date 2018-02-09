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

function setUp(money) {
	let playerName = localStorage["currentName"];
	let playerData = JSON.parse(localStorage.getItem(playerName));

	if (playerData.money === 0) {
		winLoose.innerHTML = "Come on, chump. We both know you ain't got enough money to play here. Either check out Minesweeper or scram! Guards!";
		setTimeout(quit, delay);
	}

	if (money) {
		playerData.money += money;
	}

	document.getElementById('betContainer').style.display = 'block';
	playAgain.style.display = "none";
	changeCardsButt.style.display = "none";
	playingBoard.style.display = "block";
	winLoosePara.innerHTML = "";
	moneyLeft.innerHTML = "";
	moneyLost.innerHTML = "";

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

	game = new poker(playerName, playerData.money);
	game.cleanPlayerHand();
	game.cleanComputerHand();
	game.buildHand();
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

// For debugging
	toString() {
		let returnString = "";
		for (let i = 0; i < this.hand.length; i++) {
			returnString += this.hand[i].rank + " of " + this.hand[i].suit + " ";
		}
		return returnString;
	}

// Returns an array of the current cards, used for Debugging / comparing values.
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
 			playerBottom.appendChild(cardImg);
 			let div = document.createElement('div');
 		}
 	}

 	addCardEvents() {
 		for (let i = 0; i < this.hand.length; i++) {
 			let cardImg = document.getElementById(i);
 			cardImg.addEventListener('click', selectCard);
 		}
 	}

 	removeCardEvents() {
 		for (let i = 0; i < this.hand.length; i++) {
 			let cardImg = document.getElementById(i);
 			cardImg.removeEventListener('click', selectCard);
 		}
 	}

// Show computer cards for reveal after the player is done betting / exchanging cards
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

// -------------------------------------------------------------------------------------Possible duplicate function-----------------------------------------------------------
 	displayHiddenComputerCards() {
  		for (let i = 0; i < this.hand.length; i++) {
 			let cardString = imageHeader + "red_back.png";
 			let cardImg = document.createElement('img');
 			cardImg.setAttribute('src', cardString);
 			computerTop.appendChild(cardImg);
 		}
 	}

// ----------------------------------Initial computer card images are all the backs of cards...Why are these two functions the same? Revisit and check----------------------------
 	
 	addComputerImage() {
 		let cardString = imageHeader + "red_back.png"
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

// Returns an array containing the values of each individual card
 	getValueOfHand(playerHand) {
 		let returnHand = [];
 		for (let i = 0; i < playerHand.length; i++) {
 			returnHand.push(this.getValueOfCard(playerHand[i]));
 		}
 		return returnHand;
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
		for (let i = 1; i < this.hand.length-1; i++) {
			if (this.hand[i].suit != correctSuit) {
				return false;
			}
		}

		return true;
	}

	straight() {
		let handArr = this.getValueOfHand(this.hand);
// Accounts for the potential presence of Aces in the hand (Aces can be valued at 14 or 1 to make a straight)
		if (handArr.includes(2) && handArr.includes(3) && handArr.includes(4) && handArr.includes(5) && handArr.includes(14)) {
			handArr[4] = 1;
		}
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

/*
// Simple helper function to calculate the number of equal card values. First loop
// starts at the beginning of the array of card values and iterates over the 
// rest of the array checking if there is a match. If there is the returnArr
// adds one to the ith value. At the end the ith index of returnArr will
// contain n which is the number of cards that the ith index shares values
// with. I feel like this could be made better than O(n^2) but that is something
// that I will visit later when I have more time.
*/

	findPairs() {
		let handArr = this.getValueOfHand(this.hand);
		let returnArr = [0,0,0,0,0];

		for (let i = 0; i < handArr.length; i++) {
			for (let j = 0; j < handArr.length; j++) {
				if (handArr[i] === handArr[j]) {
					returnArr[i]++;
				}
			}
		}
		return returnArr;
	}

	handScore() {
		let finalScore = 0;
		
		if(this.royalFlush()) {
			finalScore = 10;
		} else if (this.straightFlush()) {
			finalScore = 9;
		} else if(this.fourOfAKind()) {
			finalScore = 8;
		} else if (this.fullHouse()) {
			finalScore = 7;
		} else if (this.flush()) {
			finalScore = 6;
		} else if (this.straight()) {
			finalScore = 5;
		} else if (this.threeOfAKind()) {
			finalScore = 4;
		} else if (this.twoPair()) {
			finalScore = 3;
		} else if (this.onePair()) {
			finalScore = 2;
		} else {
			finalScore = 1;
		}
		return finalScore;
	}
}

class Card {
 	constructor(suit, rank) {
 		this.suit = suit;
 		this.rank = rank;
 	}
}

class poker {
 	constructor(name, money) {
 		this.player = new Hand();
 		this.computer = new Hand();
 		this.money = money;
 		this.bet = 0;
 		this.cardExchange = 0;
 		this.betTimes = 0;
 		this.playerName = name;
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
 			return false;
 		} else if (!bet) {
 			alert("You've gotta bet something, come on, I'm not going to sit around all day for ya.");
 			return false;
 		} else {
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
 		return true;
 	}

 	updateMoneyDisplay() {
 		dough.innerHTML = "Remaining Dough: " + this.money;
 	}

 	playerHandScore() {
 		return this.player.handScore();
	}

	computerHandScore() {
 		return this.computer.handScore();
	}

	compareHands() {
		let playerHand = this.player.returnCards();
		let computerHand = this.computer.returnCards();
		for (let i = playerHand.length-1; i >= 0; i--) {
			if (this.player.getValueOfCard(playerHand[i]) > this.computer.getValueOfCard(computerHand[i])) {
				return "Player"
			} else if (this.computer.getValueOfCard(computerHand[i]) > this.player.getValueOfCard(playerHand[i])) {
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

/* Assumption: the hand is sorted!
//
// Idea: check first for hand score. If 5 or more (exception being score of 8 (four
// of a kind) return the original hand (you need all five cards for straight, flush, 
// full house, straight flush, royal flush.
// If 3 (two pair) or 8 (four of a kind) simply switch the exception card and return 
// the resulting hand (checking to make sure that the final card isn't an ace 
// (you can't score a higher card value than an ace so why try?)
// If 4 (three of a kind), switch the two exceptions and return the resulting hand. 
// If 2 (one pair) switch the three exceptions and return the resulting hand. 
// If one switch the three lowest valued cards and return the resulting hand. 
// This could probably be done more elegantly but it's due tomorrow so I will 
// revisit at a later date. Also I need to think about checking the precentage 
// chance to getting a higher hand (based on the cards in the computers hand already) 
// and seeing if that influences the card switching.
*/

	switchComputerCards() {
		let sortedArrCards = this.computer.sortCards(this.computer.hand);
		console.log(this.computer.hand, "----> initial hand");
		let initialScore = this.handScore();
		console.log(initialScore);
		let index = 0;
		let numRemoved = 0;

// Check for the initial don't exchange any cards cases
		if (initialScore === 5 || initialScore === 6 || initialScore === 7 || initialScore === 8 || initialScore === 9 || initialScore === 10) {
			return;
// Chceck for three of a kind this can definitely be done better...
		} else if (initialScore === 4) {
			for (let i = 0; i < sortedArrCards.length-3; i++) {
				if (sortedArrCards[i] === sortedArrCards[i+1] && sortedArrCards[i] === sortedArrCards[i+2])
					index = i;
			}
			if (index === 0) {
				this.computer.removeCard(3);
				numRemoved++;
				this.computer.removeCard(4);
				numRemoved++;
			} else if (index === 1) {
				this.computer.removeCard(0);
				numRemoved++;
				this.computer.removeCard(4);
				numRemoved++;
			} else if (index === 2) {
				this.computer.removeCard(0);
				numRemoved++;
				this.computer.removeCard(1);
				numRemoved++;
			}

// Checking for both two pair and four of a kind. If there isn't an ace in the hand switch the card.
		} else if (initialScore === 8) {
			console.log("Two pair or Four of a kind");
			if (sortedArrCards.hand[0] === sortedArrCards.hand[1] && sortedArrCards.hand[1] === sortedArrCards.hand[2] && sortedArrCards.hand[2] === sortedArrCards.hand[3]) {
				if (sortedArrCards.getValueOfCard(sortedArrCards.hand[4]) != 14) {
					this.computer.removeCard(4);
					numRemoved++;
				}
			} else {
				if (sortedArrCards.getValueOfCard(sortedArrCards.hand[0]) != 14) {
					this.computer.removeCard(0);
					numRemoved++;
				}
			}
// Checking for two pair. Find the pairs and iterate through the array, taking out the one card
// that isn't in a pair.
		} else if (initialScore === 3) {
			let handArr = this.computer.getValueOfHand(this.computer.returnCards());
			let pairArr = this.computer.findPairs();
			for (let i = 0; i < pairArr.length-1; i++) {
				if (pairArr[i] === 1) {
					this.computer.removeCard(i);
					numRemoved++;
				}
			}
// Checking for one pair. Find the index of the first card in the pair, use that to find the second index,
// iterate through the hand array and take out every other card.
		} else if (initialScore === 2) {
			let handArr = this.computer.getValueOfHand(this.computer.returnCards());
			let pairArr = this.computer.findPairs();
			let index = pairArr.indexOf(2);
			let searchValue = handArr[index];
			handArr[index] = -1;
			let nextIndex = handArr.indexOf(searchValue);
			console.log(handArr, pairArr, "Arr's", index, searchValue, nextIndex, "index, searchValue, nextIndex 2 score");
			for (let i = 0; i < handArr.length - 1; i++) {
				if (i != index && i != nextIndex) {
					this.computer.removeCard(i);
					console.log(i, "iterations");
					numRemoved++;
				}
			}

			console.log(this.computer, "2 score final hand");
// Well, spent thirty minutes working on an efficient algorithm for finding the highest value cards
// ...and then I remembered that the cards are sorted...
		} else if (initialScore === 1) {
			for (let i = 0; i < 3; i++) {
				this.computer.removeCard(i);
				numRemoved++;
			}
		}
		winLoosePara.innerHTML = "Dealer exchanges " + numRemoved + " cards.";
		for (let i = 0; i < numRemoved; i++) {
			this.computer.addCard();
		}
		setTimeout(game.computer.cleanComputerBoard(), delay);
	}

	handScore() {
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
}

function playerBet() {
	bet = document.getElementById('betNumber').value;
	if (game.playerBet(bet)) {
		document.getElementById('betNumber').value = "";
		game.updateMoneyDisplay();
		document.getElementById('betContainer').style.display = 'none';
		
		if (game.betTimes === 0) {
			game.player.addCardEvents();
			game.betTimes++;
		} else {
			computerPlay();
		}
	}
}

function computerPlay() {
	game.sortComputerCards();

	game.computer.cleanComputerBoard();
	game.computer.displayComputerCards();

	setTimeout(game.switchComputerCards(), delay);
	setTimeout(game.computer.displayComputerCards(), delay);
	setTimeout(finishGame(), delay);
}

function finishGame() {
	setTimeout(endGame, delay);
}

function endGame() {
	game.computer.cleanComputerBoard();
	game.sortComputerCards();
	game.sortPlayerCards();

	console.log(game.player.hand, game.computer.hand);
	cleanUp();

	if (game.player.handScore() === game.computer.handScore()) {
		winString = game.compareHands();
		if (winString === "Player") {
			winLoosePara.innerHTML = "YOU'RE IN THE MONEY";
			moneyLost.innerHTML = "Guess the dealer got a bit excited...you won't see him around here again. Security!";
			game.money = game.money + (game.bet * 2);
		} else if (winString === "Computer") {
			winLoosePara.innerHTML = "You lost...heh heh heh. Chump.";	
			moneyLost.innerHTML = "Sorry, bud, you lost: $" + game.bet;
			game.money = game.money;	
		} else {
			winLoosePara.innerHTML = "You tied, lucky duck.";
			moneyLost.innerHTML = "Here's your money back, don't forget to spend it all here!";
			game.money = game.money + game.bet;
		}
	} else if (game.player.handScore() > game.computer.handScore()) {
		winLoose.innerHTML = "YOU'RE IN THE MONEY";
		moneyLost.innerHTML = "Guess the dealer got a bit excited...you won't see him around here again. Security!";
		game.money = game.money + (game.bet * 2);
	} else if (game.computer.handScore() > game.player.handScore()) {
		winLoosePara.innerHTML = "You loose! Sucker!";
		moneyLost.innerHTML = "Sorry, bud, you lost: $" + game.bet;
		game.money = game.money;	
	}
	if (game.money < 1) {
		playAgain.style.display = 'none';
		moneyLeft.innerHTML = "You'd better come back when you have a bit more dough...guards, get 'em outta here.";
	} else {
		playAgain.style.display = 'block';
		moneyLeft.innerHTML = "You've got some dough yet, here's how much you've got: $" + game.money;
	}

	let playerData = JSON.parse(localStorage.getItem(game.playerName));

	let data = {"name": playerData.name, "playerScore": playerData.score, "bestScore": playerData.score, "money": game.money, "password": playerData.password};
	localStorage.removeItem(playerData.name);
	localStorage.setItem(playerData.name, JSON.stringify(data));
}

function switchCards(event) {
	for (let i = 0; i < exchangeCards.length; i++) {
		game.player.removeCard(exchangeCards[i]);
		game.changeCards(exchangeCards[i]);
	}
	exchangeCards = [];
	game.cardExchange = 0;
	changeCardsButt.style.display = 'none';
	game.player.removeCardEvents();
	if (game.money === 0) {
		computerPlay();
	} else {
		document.getElementById('betContainer').style.display = 'block';
	}
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
		removeCard(exchangeCards, cardLoc);
		game.cardExchange--;
		if (game.cardExchange === 0) {
			changeCardsButt.style.display = 'none';
		}
	}
}

function removeCard(exchangeCards, cardLoc) {
	let indexOfCard = exchangeCards.indexOf(cardLoc);
	exchangeCards.splice(indexOfCard, 1);
}

function quit() {
	let playerData = JSON.parse(localStorage.getItem(game.playerName));

	let data = {"name": playerData.name, "playerScore": playerData.score, "bestScore": playerData.bestScore, "money": game.money, "password": playerData.password};
	localStorage.removeItem(playerData.name);
	localStorage.setItem(playerData.name, JSON.stringify(data));
	window.location.href = "index.html";
}

function play() {
	setUp();
}

play();