
/***  appendNewCard(parentElement)  <----- START HERE!

OVERVIEW:
This is the first function we're going to write in our project. The purpose of this function is to add a single new card element to the page (it won't have any pictures yet). We are going to "construct" this element and place it on the page using our knowledge of DOM Manipulation.

INPUT/OUTPUT: 
The appendNewCard function takes in a parent HTML element as a parameter named 'parentElement'. The parent element will look like this:

  <div id="card-container">
  </div>

After the function call the parentElement should look like this:

  <div id="card-container">
    <div class="card">
      <div class="card-down"></div>
      <div class="card-up"></div>
    </div>
  </div>

To accomplish this, the function is should create the new card element (i.e. .card), append it as a child to the parentElement (i.e. #card-container), and return the new card element.
*/

// var parentElement = document.getElementById("card-container");
// console.log(parentElement);
// appendNewCard(parentElement);
function appendNewCard(parentElement) {
  var card = document.createElement("div");
  card.classList.add("card");
  card.innerHTML = `<div class="card-down"></div>
                    <div class="card-up"></div>`  
  parentElement.appendChild(card);
  return card;

}
// appendNewCardTest();


/***  shuffleCardImageClasses()

OVERVIEW:
We've defined image classes in the CSS named 'image-1' through 'image-6' that, when applied to a card, will make it show that particular image when it's flipped. Since the matching game works with pairs of images, we want to generate a random array with two of each image class string (12 total).

INPUT/OUTPUT: 
Returns an array with 12 randomly ordered image classes (i.e. image-X, where X is a value between 1 and 6). There should be exactly 2 of each image class in the array.
*/
function shuffleCardImageClasses() {

  var check = [0,0,0,0,0,0];
  var arr = [];
  var n = 0;
  while(n != 12){
    var range = 6-1 + 1;  
    var random = Math.random() * range;
    var random = Math.floor(random) + 1;
    if(check[random-1] <= 1){
      arr.push(`image-${random}`);
      check[random-1]++;
      n++;
    }
  }
  return arr;

}
// shuffleCardImageClassesTest();


/***  createCards()

OVERVIEW:
For each of the 12 cards in the game, this function will create a card, assign it a random image class, and create an object to represent that card in our program.

INPUT/OUTPUT:  
The 'parentElement' parameter is the DOM element where the cards should be appended as children (i.e. #card-container). 

The 'shuffledImageClasses' parameter is an array of 12 image class strings (e.g. "image-1", "image-5", "image-3"...) randomly ordered and with 2 strings from each image class.

Returns an array of card objects to track all the cards for the rest of our program.
*/
function createCards(parentElement, shuffledImageClasses) {

  var cards = [];
  var cnt = 0;
  shuffledImageClasses.forEach(image=>{
    var obj = appendNewCard(parentElement);
    obj.classList.add(`${image}`);
    obj.index = ++cnt;
    obj.element = document.createElement("div");
    obj.imageClass = `${image}`;
    cards.push(obj);
  })
  return cards;
}
// createCardsTest();


/***  doCardsMatch

OVERVIEW:
Given two card objects, this will check if the card objects show the same image when flipped.

INPUT/OUTPUT:  
The 'cardObject1' parameter is the first card object in the comparison.

The 'cardObject2' parameter is the second card object in the comparison.

The function should return 'true' when both cards have the same imageClass property and 'false' otherwise.
*/
function doCardsMatch(cardObject1, cardObject2) {

  if(cardObject1.imageClass !== cardObject2.imageClass){
    return false;
  }
  else{
    return true;
  }

}
// doCardsMatchTest();


/* An object used below as a dictionary to store counter names and their respective values.  Do you remember using objects as dictionaries? If not, go back to that lecture to review. */
let counters = {
};


/***  incrementCounter 

OVERVIEW:
Adds one to a counter being displayed on the webpage (meant for counting flips and matches).

INPUT/OUPUT
The 'counterName' parameter is the string representing the name of the counter to increment (e.g. "flip").

The 'parentElement' parameter is the DOM element that shows the counter (e.g. <span id="flip-count"> in the HTML). The 'innerHTML' of this element determines what value is displayed for the counter.

This function should use the global 'counters' object above to store counter names and their respective values and update the DOM to show the new counter value when changed.
*/
function incrementCounter(counterName, parentElement) {
  
  if(!counters[counterName]){
    counters[counterName] = 1;
    parentElement.innerHTML = counters[counterName];
  }
  else{
    counters[counterName]++;
    parentElement.innerHTML = counters[counterName];
  }
}
// incrementCounterTest();


/* Variables storing an audio objects to make the various sounds.  See how it's used for the 'click' sound in the provided function below.  */
let clickAudio = new Audio('audio/click.wav');
let matchAudio = new Audio('audio/match.wav');
let winAudio = new Audio('audio/win.wav')


/***  flipCardWhenClicked
[The implementation of this function has been provided for you but you will still need to understand and call it.]

OVERVIEW:
Attaches a mouseclick listener to a card (i.e. onclick), flips the card when clicked, and calls the function 'onCardFlipped' after the flip is complete.

INPUT/OUPUT
The 'cardObject' parameter is a custom card object we created in the 'createCards' function.

This function will make the card element associated with 'cardObject' clickable and call onCardFlipped with that cardObject after the flip is complete.
*/

function flipCardWhenClicked(cardObject) {
  // Adds an "onclick" attribute/listener to the element that will call the function below.
  cardObject.onclick = function() {
    // THE CODE BELOW RUNS IN RESPONSE TO A CLICK.

    // Card is already flipped, return.
    if (cardObject.classList.contains("flipped")) {
      return;
    }
  
    // Play the "click" sound.
    clickAudio.play();

    // Add the flipped class immediately after a card is clicked.
    cardObject.classList.add("flipped");

    // Wait 500 milliseconds (1/2 of a second) for the flip transition to complete and then call onCardFlipped.
    setTimeout(function() {
      // THE CODE BELOW RUNS AFTER a 500ms delay.
      onCardFlipped(cardObject);
    }, 500);
  };
}

/* The 'onCardFlipped' function below will be called each time the user flips a card.  This variable is used to remember the first card flipped while we wait for the user to flip another card. It should be reset to 'null' each time a second card is flipped. */
let lastCardFlipped = null;


/***  flipCardWhenClicked
OVERVIEW:
This is called each time the user flips a card and should handle and track the game mechanics like: "Is this the first or second card flipped in a sequence?", "Do the cards match", and "Is the game over?"

INPUT/OUPUT
The 'newlyFlippedCard' parameter is a custom card object that has just been flipped.
*/
function onCardFlipped(newlyFlippedCard) {

  var flips = document.querySelector('#flip-count');
  var matches = document.querySelector("#match-count");

  if(lastCardFlipped == null){
    incrementCounter('flips', flips);
    lastCardFlipped = newlyFlippedCard;
    return;
  }
  else{
    if(!doCardsMatch(lastCardFlipped, newlyFlippedCard)){
      incrementCounter("flips", flips);
      lastCardFlipped.classList.remove('flipped');
      newlyFlippedCard.classList.remove('flipped');
      lastCardFlipped = null;

    }
    else{
      incrementCounter("flips", flips);
      incrementCounter("matches", matches);
      if(counters.matches == 6){
        winAudio.play();
      }
      else{
        matchAudio.play();
      }
      lastCardFlipped = null;
    }
  }
}

// Set up the game.
let cardObjects = 
  createCards(document.getElementById("card-container"), shuffleCardImageClasses());

if (cardObjects != null) {
  for (let i = 0; i < cardObjects.length; i++) {
    flipCardWhenClicked(cardObjects[i]);
  }
}

runAllTests()