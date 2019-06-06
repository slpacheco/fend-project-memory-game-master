/*
 * Create a list that holds all of your cards
 */


/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976

let matchCount = 0,
  movesCount = 0,
  cards = [],
  symbol = null,
  lastIndex = 0,
  cardsLocked = false,
  starCount,
  totalTime = 0,
  timer = null;

// Shuffles all deck cards using an array shuffle function
// and appends all suffled elements back to the deck
function suffleDeck() {
  const deck = document.querySelector('.deck');
  let deckContent = shuffle(Array.from(document.querySelectorAll('.card')));
  deck.innerHTML = "";
  deckContent.forEach(function(element, index){
    deck.appendChild(element.cloneNode(true));
  });
}

suffleDeck();

let list = document.querySelectorAll('.card'), star = document.querySelectorAll(".fa-star");

addListeners();

document.querySelector(".restart").addEventListener('click',restart);

const Card = function(index) {
   // Variables applied to each of our instances go here,
   // we've provided one for you to get started
   this.open = false;
   this.matched = false;
};

for (let i = 0; i < 16; i++) {
  cards[i] = new Card();
}

function restart() {
  matchCount = 0,
  movesCount = 0,
  symbol = null,
  lastIndex = 0,
  cardsLocked = false,
  totalTime = 0;
  document.querySelector(".time").innerHTML="Time: "+totalTime+" seconds";
  document.querySelector(".moves").innerHTML = 0;
  clearInterval(timer);
  suffleDeck();
  list = document.querySelectorAll('.card');
  addListeners();
  list.forEach(function(element, index){
   closeCard(index);
   unmatchCard(index);
  });
  star.forEach(function(element, index){
   star[index].style.color = "yellow";
  });
}

function openCard(cardIndex) {
  list[cardIndex].classList.add("open");
  list[cardIndex].classList.add("show");
}

function closeCard(cardIndex) {
  console.log(list, list[cardIndex], cardIndex);
  list[cardIndex].classList.remove("open");
  list[cardIndex].classList.remove("show");
  cards[cardIndex].open = false;
}

function matchCard(cardIndex) {
  list[cardIndex].classList.add("match");
  cards[cardIndex].matched = true;
}

function unmatchCard(cardIndex) {
  list[cardIndex].classList.remove("match");
  cards[cardIndex].matched = false;
}


// Updates the counter of movements and the stars rating
// based on the number of turns
function updateMovesCount() {
  document.querySelector(".moves").innerHTML = movesCount;

  if (movesCount > 48) {
    star[0].style.color = "black";
    starCount = 0
  }
  else if (movesCount > 32) {
    star[1].style.color = "black";
    starCount = 1;
  }
  else if (movesCount > 16) {
    star[2].style.color = "black";
    starCount = 2;
  }
}

function respondToTheClick(index) {
  if (cardsLocked || cards[index].open || cards[index].matched || matchCount>= 8) {
    return;
  }

  if (movesCount === 0) {
    if (timer) {
      clearInterval(timer);
    }
    timer = setInterval(function() {
      totalTime++;
      document.querySelector(".time").innerHTML = "Time: " + totalTime + " seconds";
    }, 1000);
  }

  movesCount++;
  updateMovesCount();
  openCard(index);
  let cardSymbol = list[index].querySelector('i').className;

  if (symbol === null) {
    symbol = cardSymbol;
    lastIndex = index;
    cards[index].open = true;
  } else {
    if (symbol === cardSymbol) {
      matchCard(index);
      matchCard(lastIndex);
      matchCount++;
    } else {
      cardsLocked = true;
      setTimeout(function() {
        closeCard(index);
        closeCard(lastIndex);
        cardsLocked = false;
      }, 2000);
    }
    symbol = null;
  }

  if (matchCount === 8) {
    setTimeout(function() {
      clearInterval(timer);
      const message = confirm("Congratulations, You win!\n star rating: "+starCount+"\n time: " + totalTime + " seconds" + "\n Do you wanna play again?");
      if (message) {
        restart();
      }
    }, 1000);
  }
}

function addListeners() {
  list.forEach(function(element, index) {
    list[index].addEventListener('click', function() {
      respondToTheClick(index);
    });
  });
}


function shuffle(collection) {
    let temporaryValue, randomIndex, currentIndex = collection.length;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = collection[currentIndex];
        collection[currentIndex] = collection[randomIndex];
        collection[randomIndex] = temporaryValue;
    }

    return collection;
}


/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
