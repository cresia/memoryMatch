
$(document).ready(initialApp);

function initialApp() {


  createCards(shuffleCards()); // this is for dynamic: if use dynamic: call this function and the one below
  $(".card").on("click", handleCardClick); // if use static: uncomment static on html

}

var theFirstCardClicked = null;
var theSecondCardClicked = null;
var match = 0;
var max_matches = 1;

var addMatchedClass;

var attempts = 0;
var games_played = 0;



function handleCardClick(event) {
  if ($(this).find(".back").hasClass("matched")) { // to check if both images has the same class "matched" then they both has been clicked and matched
    return;
  }

  if (theFirstCardClicked === null) { // if I haven't clicked on a firstCard yet
    theFirstCardClicked = $(this); // save clicked DOM element into theFirstCardClicked //reset the
    // theFirstCardClicked.find('.front').hide(); //hide the logo to flip the card to the answer
    theFirstCardClicked.addClass("flip"); //hide the logo to flip the card to the answer
    theFirstCardClicked.off();

    console.log('first card')
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

      //reset firstcard clicked and secondcard clicked
      theFirstCardClicked = null;
      theSecondCardClicked = null;

      //if the match == counter, you win show the modal
      if (match === max_matches) {
        var modal = $(".modal-content").show();

        $(".front").hide();
        $(".back").addClass("matched")

        $("button").click(closeModal);

        // games_played++;

        displayStats();

      }

      displayStats();
    }

    else { //not matching
      //both cards flips back (after 1.5 seconds) timeout(flipback, time_in_seconds)
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

        //reset firstcard clicked and secondcard clicked
        theFirstCardClicked = null;

        //second card
        theSecondCardClicked = null;
        //
        $('.card').on('click', handleCardClick);

      }, 1500);

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

function displayStats() {
  var result = calculateAccuracy();
  $(".resultAttempts").text(attempts);
  $(".resultGamePlayed").text(games_played);
  $(".resultAccuracy").text(result);

}


function resetStats() {
  match = 0;
  attempts = 0;
  games_played++;
  displayStats();
  $(".back").removeClass("matched");

  // $(".back").hide();
  $(".front").show();
  // $(".front").removeClass("flip");
}

function shuffleCards() {

  var cards = ["billCard", "brettCard", "codyCard", "danCard", "scottCard", "timdCard", "timhCard", "tjCard", "billCard", "brettCard", "codyCard", "danCard", "scottCard", "timdCard", "timhCard", "tjCard", "danCard", "danCard"];

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

function playAudio(){
  var horn = new Audio('car_horn.wav');
  horn.play();

  function play() {
    var audio = new Audio("assets/sounds/audiogoeshere");
    audio.play();
  }

}


function createCards(shuffledArray) {
  var modalContent = $("<div>").addClass("modal-content");
  var winText = $("<p>").text("Congratulations! You Win!!").addClass("modalText");
  var closeButton = $("<button>").text("Play again").addClass("playAgain");
  var winImg = $("<img>").addClass("winImg");

  modalContent.append(winText, winImg, closeButton);
  $(".mainCards").append(modalContent)

  for (var i = 0; i < shuffledArray.length; i++) {
    var cardContainer = $('<div>').addClass('card');

    var backCard = $('<div>').addClass('back ' + shuffledArray[i]);
    var frontCard = $('<div>').addClass('front');

    var innerCardCombine = $(cardContainer).append(backCard, frontCard);

    $(cardContainer).append(innerCardCombine);

    $(".mainCards").append(cardContainer);

  }

}
