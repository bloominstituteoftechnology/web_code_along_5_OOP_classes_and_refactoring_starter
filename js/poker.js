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

	handScore() {

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

	count pokerScore() {

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
	royalFlush() {

	}

	straightFlush() {

	}

	fourOfAKind() {

	}

	fullHouse() {

	}

	flush() {

	}

	straight() {

	}

	threeOfAKind() {

	}

	twoPair() {

	}

	onePair() {

	}

	highCard() {

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
  		this.computer.displayComputerCards();
 	}

 	buildHand() {
 		for (let i = 0; i < 5; i++) {
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
}

function quit() {

}

play();