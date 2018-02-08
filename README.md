***Casey Harding / February, 01, 2018***
# Casino
## A collection of Card games (and Minesweeper) intended to titilate the user.
### Brief Description
This project includes the games:
1. Minesweeper
2. Blackjack
3. Poker

![wireframe](wireframe.png)

#### Technologies Used
1. Javascript
2. HTML
3. CSS

#### Approach taken
I started with minesweeper and when I had that up and running I created a deck class, a card class, and a game class. From these I was able to break blackjack and poker down into their base components and reuse a bit of code. I still want to refactor so that I can utilize prototyping and not have nearly identical methods in my classes.

#### How to Use
Start at the landing page. Enter your name and choose a password. If you are saved in the system your previous money will be loaded and you can choose either of the three games. If you are a new user you will need to start with Minesweeper to earn some money first before moving on to Poker and Blackjack.

#### Unsolved problems
1. Code needs to be refactored a bit. Could be more robust.
2. Certain edge cases (aka a 1000X1000 board in minesweeper shouldn't be possible)
3. Improve the AI of the poker game


#### Links and Resources
* [Fisher Yates Shuffle for shuffling the cards](https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle)
* [AI for poker 1](https://techcrunch.com/2017/01/31/carnegie-mellon-creates-a-poker-playing-ai-that-can-beat-the-pros/)
* [AI for poker 2](https://beta.vu.nl/nl/Images/werkstuk-schuijtvlot_tcm235-225501.pdf">)
* [CSS animation](https://robots.thoughtbot.com/css-animation-for-beginners)
* [Blackjack rules](https://wizardofodds.com/games/blackjack/basics/)
* [Poker rules](https://www.pokernews.com/poker-rules/)