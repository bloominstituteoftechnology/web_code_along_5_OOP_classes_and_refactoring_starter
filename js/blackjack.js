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
 
 const delay = 2000;
 
 document.getElementById('hitButt').addEventListener('click', hit);
 document.getElementById('stayButt').addEventListener('click', stay);
 document.getElementById('betButt').addEventListener('click', playerBet);
 document.getElementById('playButt').addEventListener('click', play);

 game = new blackJack("Casey");
 
 function setUp(money) {	
	 let playerData = { money };
 
	 if (playerData.money === 0) {
		 winLoose.innerHTML = "Come on, chump. We both know you ain't got enough money to play here. Either check out Minesweeper or scram! Guards!";
		 setTimeout(quit, delay);
	 }
 
	 playAgain.style.display = "none";
	 winLoose.innerHTML = "";
	 moneyLost.innerHTML = "";
	 moneyLeft.innerHTML = "";
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
 
	 document.getElementById('betContainer').style.display = 'block';
	 document.getElementById('hitOrStay').style.display = 'none';
 
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

 // =============== 👉 [Code-Along 5.1] - step 1 + 2 + 3
 
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
  // =============== 👉 [Code-Along 5.2] - step 2
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
			let rank = this.hand[1].rank;
			let suit = this.hand[1].suit;
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
		constructor(name, money) {
			this.player = new Hand();
			this.computer = new Hand();
			this.money = money;
			this.bet = 0;
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
			if ((typeof blackArr[0].rank === "string" && typeof blackArr[1].rank === "string") && (blackArr[0].rank === "Ace" || blackArr[1].rank === "Ace")) {
				if (this.player.countBlackJackScore() === 21) {
					return true;
				} else {
					return false;
				}
			} else {
				return false;
			}
		}
 
		computerHasBlackJack() {
			let blackArr = this.computer.returnCards();
			if ((typeof blackArr[0].rank === "string" && typeof blackArr[1].rank === "string") && (blackArr[0].rank === "Ace" || blackArr[1].rank === "Ace")) {
				if (this.computer.countBlackJackScore() === 21) {
					return true;
				} else {
					return false;
				}
			} else {
				return false;
			}
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
 // =============== 👉 [Code-Along 5.2] - step 1
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
				} else if (this.bet >= 50) {
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
 }
 
 function playerBet() {
	 bet = document.getElementById('betNumber').value;
	 if (bet){
		 document.getElementById('betNumber').value = "";
		 if (game.playerBet(bet)) {
			 game.updateMoneyDisplay();
			 document.getElementById('betContainer').style.display = 'none';
			 document.getElementById('hitOrStay').style.display = 'block';
		 }
	 }
 }
 
 function hit() {
	 if (game.computerHasBlackJack()) {
		 game.flipCards();
		 setTimeout(endGame, delay);
	 }
 
	 game.dealPlayer();
	 console.log("Player Hand -> ", game.printPlayerHand());
	 console.log("Player Score -> ", game.countPlayerScore());
	 if (game.countPlayerScore() > 21) {
		 setTimeout(endGame, delay);
	 }
 }
 
 function stay() {
	 computerPlay();
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
	 if (game.playerHasBlackJack()) {
		 winLoose.innerHTML = "YOU'RE IN THE MONEY";
		 moneyLost.innerHTML = "You weren't supposed to get blackjack...congratulations, I guess. You won: $" + (game.bet + (game.bet * 2))
		 game.money = game.money + game.bet + (game.bet * 2)
	 } else if (game.computerHasBlackJack()) {
		 winLoose.innerHTML = "Woah, baby, looks like you're fresh outta luck...";
		 moneyLost.innerHTML = "Sorry, bud, you lost: $" + game.bet;
		 game.money = game.money;
	 } else if (playerScore > 21) {
		 winLoose.innerHTML = "You busted...try not to be so greedy next time, eh?";
		 moneyLost.innerHTML = "Sorry, bud, you lost: $" + game.bet;
		 game.money = game.money;
	 } else if (computerScore > 21) {
		 winLoose.innerHTML = "Computer busted! You win!";
		 moneyLost.innerHTML = "Guess the dealer got a bit excited...you won't see him around here again. Security!";
		 game.money = game.money + (game.bet * 2);
	 } else if (playerScore === computerScore) {
		 winLoose.innerHTML = "A tie...you're lucky, chump.";
		 moneyLost.innerHTML = "Here's your money back, don't forget to spend it all here!";
		 game.money = game.money + game.bet;
	 } else {
		 winLoose.innerHTML = playerScore > computerScore ? "You win!" : "You lose!";
		 game.money = playerScore > computerScore ? game.money + (game.bet * 2) : game.money;
		 moneyLost.innerHTML = playerScore > computerScore? "We're watching you, card counter...you won: $" + (game.bet * 2) : "Sucker, there's a rube a minute in this business. You lost: $" + game.bet;
	 }
 
	 if (game.money < 1) {
		 playAgain.style.display = 'none';
		 moneyLeft.innerHTML = "You'd better come back when you have a bit more dough...guards, get 'em outta here.";
 
		 setTimeout(quit, delay);
	 } else {
		 playAgain.style.display = 'block';
		 moneyLeft.innerHTML = "You've got some dough left yet, here's how much you've got: $" + game.money;
	 }
 }
 
 function play() {
	 setUp(500);
 }
 
 play();
