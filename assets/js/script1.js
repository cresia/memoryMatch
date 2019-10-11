
$(document).ready(initialApp);

function initialApp() {

  createCards(shuffleCards());

  // $(".resetButton").on("click", () =>
  // createCards(shuffleCards()));

  $(".resetButton").click(function () {
    closeModal();
    buttons();
    createCards(shuffleCards());
  })

  $(".speaker").click(function () {
    buttons();
    gameAudio()
  })

  $(".mute").click(function () {
    buttons();
    stopAudio();
  })
}

var theFirstCardClicked = null;
var theSecondCardClicked = null;
var speaker = null;
var mute = null;
var match = 0;
// var max_matches = 9;
var max_matches = 9;
var addMatchedClass;
var attempts = 0;
var games_played = 0;
var timer = 100;
var startTimer = true;

function handleCardClick(event) {
  if ($(this).find(".back").hasClass("matched")) { // to check if both images has the same class "matched" then they both has been clicked and matched
    return;
  }

  if (theFirstCardClicked === null) { // if I haven't clicked on a firstCard yet
    theFirstCardClicked = $(this); // save clicked DOM element into theFirstCardClicked //reset the
    // theFirstCardClicked.find('.front').hide(); //hide the logo to flip the card to the answer
    theFirstCardClicked.addClass("flip"); //hide the logo to flip the card to the answer
    theFirstCardClicked.off();
    cardsAudio();
    console.log('first card');
    timeScores();
  }
  else {
    theSecondCardClicked = $(this);
    console.log('second card');
    if (theFirstCardClicked[0] === theSecondCardClicked[0]) { //check if both has the class of Dan if not go to the next to hide
      return;
    }

    // theSecondCardClicked.find('.front').hide();
    theSecondCardClicked.addClass("flip");

    theSecondCardClicked.off();
    $('.card').off();
    cardsAudio();


    // check to see if the two cards have the same url
    var firstImgSource = $(theFirstCardClicked).find('.back').css('background-image'); // back = the asnwer
    var secondImgSource = $(theSecondCardClicked).find('.back').css('background-image');
    // console.log(firstImgSource, secondImgSource);
    if (firstImgSource === secondImgSource) {
      match++;
      attempts++;

      firstImgSource = $(theFirstCardClicked).find('.back'); //finding the element in the index.html that has back class
      secondImgSource = $(theSecondCardClicked).find('.back'); // finding the second element

      addMatchedClass = $(firstImgSource).addClass("matched"); //adding a new class to determined if the cards has been clicked to the html
      addMatchedClass2 = $(secondImgSource).addClass("matched");


      $('.card').on('click', handleCardClick);
      //add matching sounds card
      matchCardAudio();

      //reset firstcard clicked and secondcard clicked
      theFirstCardClicked = null;
      theSecondCardClicked = null;

      //if the match == counter, you win show the modal
      // add the timer condition and make the cards nt be able to click which is $('.card').off();
      if (match === max_matches && timer > 0) {
        var modal = $(".modal-content").show();
        myStopFunction();
        $(".front").hide();
        $(".back").addClass("matched");

        games_played++;

        displayStats();
        winAudio();
      }

      displayStats();

      //-------------- if the cards match !== max_matches and timer < 0 then show another modal ----------------------
    }

    else { //not matching
      //both cards flips back (after 1.3 seconds) timeout(flipback, time_in_seconds)
      //how to identify which cards to flip back
      attempts++;


      setTimeout(function () {
        //first card
        // $(theFirstCardClicked).find(".front").show();
        $(theFirstCardClicked).removeClass("flip");
        theFirstCardClicked.on('click', handleCardClick);

        //second card
        // $(theSecondCardClicked).find(".front").show();
        $(theSecondCardClicked).removeClass("flip");
        theSecondCardClicked.on('click', handleCardClick);
        cardsAudio();

        //reset firstcard clicked and secondcard clicked
        theFirstCardClicked = null;

        //second card
        theSecondCardClicked = null;

        $('.card').on('click', handleCardClick);

      }, 1300);

      displayStats();
    }

  }
}

function closeModal() {
  $(".modal-content").hide();
  resetStats();
}

function calculateAccuracy() {
  var accuracyTotal = Math.ceil((match / attempts) * 100);

  if (match === 0 && attempts === 0) {
    accuracyTotal = " 0 ";
  }
  return accuracyTotal + " %";
}


var timeInterval;
function timeScores(){

  if(startTimer === true){
  timeInterval = setInterval(function () {
      if (timer > 0) {
        timer--;
        $(".timeResult").text(timer);
        // console.log("time is", timer);
        startTimer = false;
      }
      else {
        $('.card').off();
        stopAudio();
        // clearInterval(timeInterval);
      }
    }, 1000);
  }

}

function myStopFunction() {
   clearInterval(timeInterval);
  // clearTimeout(timeInterval);
}

function displayStats() {
  var result = calculateAccuracy();
  $(".resultAttempts").text(attempts);
  $(".resultGamePlayed").text(games_played);
  $(".resultAccuracy").text(result);
}

function resetStats() {
  match = 0;
  attempts = 0;
  displayStats();
  $(".back").removeClass("matched");
  $(".front").show();
}

function shuffleCards() {
  var cards = ["doryCard", "nemoCard", "starCard", "turtleCard", "fatFishCard", "sharkCard", "bigSharkCard", "octopusCard", "blueSharkCard", "doryCard", "nemoCard", "starCard", "turtleCard", "fatFishCard", "sharkCard", "bigSharkCard", "octopusCard", "blueSharkCard"];

  var currentIndex = cards.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = cards[currentIndex];
    cards[currentIndex] = cards[randomIndex];
    cards[randomIndex] = temporaryValue;
  }

  return cards;
}

function cardsAudio(){
  var clickSound = new Audio("./assets/audio/audio2.mp3");
  clickSound.play();
}

function matchCardAudio(){
  var matchCard = new Audio("./assets/audio/match.mp3");
  matchCard.play();
}

function winAudio(){
  var winModal = new Audio("./assets/audio/winAudio.mp3");
  winModal.play();
}

function playAgainAudio() {
  var winModal = new Audio("./assets/audio/audio1.mp3");
  winModal.play();
}

var gameMusic = new Audio("./assets/audio/heavenly.mp3");
function gameAudio(){
  //to handle so that the speaker can only click once
  // if ($(this).find(".speaker").hasClass("speakerHasBeenClicked")) {
  //   return;
  // }

  if (speaker === null) { // if I haven't clicked on the speaker button yet then play the music
    gameMusic.loop = true;
    gameMusic.load();
    gameMusic.play();
    console.log('speaker has been clicked')
  }
}

function stopAudio(){
  if (mute === null) { // this is for mute button
    gameMusic.loop = false;
    gameMusic.load();
    console.log('mute button has been clicked');
  }
}

function buttons() {
  var gameAudio = new Audio("./assets/audio/buttons.mp3");
  gameAudio.play();
}


function createCards(shuffledArray) {
  $(".mainCards").empty();
  var modalContent = $("<div>").addClass("modal-content");
  var winText = $("<p>").text("Congratulations! You Win!!").addClass("modalText");
  var closeButton = $("<button>").text("Play again").addClass("playAgain").click(function(){
    timer = 100;
    $(".timeResult").text(timer);
    startTimer = true;
    // timeScores();
    closeModal();
    playAgainAudio();
    createCards(shuffleCards());
  })

  var winImg = $("<img>").addClass("winImg");

  modalContent.append(winText, winImg, closeButton);
  $(".mainCards").append(modalContent);


//------  the beginning of the modal where the user need to enter their username ----
// --- add code for user Input later ---

  for (var i = 0; i < shuffledArray.length; i++) {
    var cardContainer = $('<div>').addClass('card');

    var backCard = $('<div>').addClass('back ' + shuffledArray[i]);
    var frontCard = $('<div>').addClass('front');

    var innerCardCombine = $(cardContainer).append(backCard, frontCard);

    $(cardContainer).append(innerCardCombine);

    $(".mainCards").append(cardContainer);

  }

  $(".card").on("click", handleCardClick);
}
