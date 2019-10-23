
$(document).ready(initialApp);

function initialApp() {

  createCards(shuffleCards());

  // $(".resetButton").on("click", () =>
  // createCards(shuffleCards()));

  $(".resetButton").click(function () {
    theFirstCardClicked = null;
    theSecondCardClicked = null;
    resetStats()
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
var max_matches = 2;
var addMatchedClass;
var attempts = 0;
var games_played = 0;
var timer = 3;
// var timer = 300;
var startTimer = true;

// var username;
var accuracyTotal;
var timeInterval;

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
      // add the timer condition and make the cards not be able to click which is $('.card').off();
      if (match === max_matches && timer > 0) {
        var modal =$(".modal-content").show();
        myStopFunction();
        $(".front").hide();
        $(".back").addClass("matched");

        displayStats();
        winAudio();
      }

      displayStats();

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

      }, 900);
      displayStats();
    }
  }
}

function getHighScores(){
   const req = {
      method: 'GET',
      headers: {'Content-Type': 'application/json'},
      // body: JSON.stringify(scores)
    };
    fetch(`server/public/api/scores.php`, req)
      .then(res => res.json())
      // .then(res => console.log(res))
      .then(res =>{createRankPage(res)});
      // .then(res => console.log(createRankPage(res)))
}


function postUserStats(username, accuracyTotal, timer){
  fetch(`server/public/api/name.php`,{
    method: 'POST',
    headers:{'Content-Type': 'application/json'},
    body: JSON.stringify({"name": username, "accuracy": accuracyTotal, "time": timer})

  })
  .then(() => getHighScores());
}

function closeModal() {
  $(".modal-content").hide();
  // games_played++;
  // resetStats();
}

function calculateAccuracy() {
  accuracyTotal = Math.ceil((match / attempts) * 100);
  if (match === 0 && attempts === 0) {
    accuracyTotal = " 0 ";
  }
  return accuracyTotal + " %";
}

function timeScores(){
  if(startTimer === true){
    timeInterval = setInterval(function () {
        if (timer > 0) {
          timer--;
          $(".timeResult").text(timer);
          startTimer = false;
        }
        else {
          clearInterval(timeInterval);
          $('.card').off();
          createLoseModal();
          winAudio();
        }
      }, 1000);
  }
}

function myStopFunction() {
   clearInterval(timeInterval);
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

  timer = 30;
  $(".timeResult").text(timer);
  startTimer = true;
  myStopFunction();

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


function createRankPage(highScoreArray){
  // debugger;
  console.log(highScoreArray);

  var rankContainer = $('<div>').addClass('rankContainer');

  var title = $("<div>").text("Leader Board").addClass("rankPagetitle");

  var rankTable = $("<table>").addClass("table");

  var thRank = $('<th>').text("Rank").addClass("th");
  var thName = $("<th>").text("Name").addClass("th");
  var thTime = $("<th>").text("Score").addClass("th");
  var thAccuracy = $("<th>").text("Accuracy").addClass("th");
  var trTableTitle = $('<tr>').append(thRank,thName,thTime,thAccuracy);

  var numText = "";
  var trRows = ("<tr>");
  var tdRow = $("<td>").addClass("td");

  var currentRank = 1;
  rankTable.append(trTableTitle)
 //loop over each high score entry
  for(var i = 0; i < highScoreArray.length; i++){
  var rankTd = $("<td>").text(currentRank)
  var tdNameResult = $("<td>").text(highScoreArray[i].name).addClass("td");
  var tdTimeResult = $("<td>").text(highScoreArray[i].time).addClass("td");
  var tdAccuracyResult = $("<td>").text(highScoreArray[i].accuracy + " %").addClass("td");
  var trResult = $("<tr>").append(rankTd, tdNameResult, tdTimeResult, tdAccuracyResult);

  rankTable.append(trResult);
  currentRank++;
  }
  //end loop

  var closeButton = $("<button>").text("Play again").addClass("playAgain").click(function () {
    games_played++;
    theFirstCardClicked = null;
    theSecondCardClicked = null;

    resetStats();
    closeModal();
    playAgainAudio();
    createCards(shuffleCards());

  })

  rankContainer.append(title, rankTable, closeButton);

  $(".mainCards").append(rankContainer);
}


function createLoseModal(){
  var modalContent = $("<div>").addClass("loseModal");
  var loseText = $("<p>").text("Sorry, you ran out of the time!!").addClass("modalText");
  var closeButton = $("<button>").text("Try Again").addClass("tryAgain").click(function(){
    theFirstCardClicked = null;
    theSecondCardClicked = null;
    games_played++;
    resetStats();
    closeModal();
    playAgainAudio();
    createCards(shuffleCards());
  })

  var loseImg = $("<img>").addClass("winImg").attr("src", "https://media2.giphy.com/media/OXF91oNPj8NH2/giphy.gif");

  modalContent.append(loseText, loseImg, closeButton);
  $(".mainCards").append(modalContent);

}


function createCards(shuffledArray) {
  $(".mainCards").empty();
  var modalContent = $("<div>").addClass("modal-content");
  var winText = $("<p>").text("Congratulations! You Win!!").addClass("modalText");
  var username = $("<input>").text("").attr("placeholder", "enter your name").addClass("usernameBox");

  var closeButton = $("<button>").text("Submit").addClass("submit").click(function(){

    modalContent.hide();
    postUserStats(username.val(), accuracyTotal, timer);
  });

  var winImg = $("<img>").addClass("winImg").attr("src", "https://media2.giphy.com/media/OXF91oNPj8NH2/giphy.gif");
  // username = $("<input>").text("").attr("placeholder", "enter your name").addClass("usernameBox");

  modalContent.append(winText, winImg, username, closeButton);
  $(".mainCards").append(modalContent);

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

function cardsAudio() {
  var clickSound = new Audio("./assets/audio/audio2.mp3");
  clickSound.play();
}

function matchCardAudio() {
  var matchCard = new Audio("./assets/audio/match.mp3");
  matchCard.play();
}

function winAudio() {
  var winModal = new Audio("./assets/audio/winAudio.mp3");
  winModal.play();
}

// function loseAudio() {
//   var winModal = new Audio("./assets/audio/winAudio.mp3");
//   winModal.play();
// }

function playAgainAudio() {
  var winModal = new Audio("./assets/audio/audio1.mp3");
  winModal.play();
}

var gameMusic = new Audio("./assets/audio/heavenly.mp3");
function gameAudio() {
  if (speaker === null) { // if I haven't clicked on the speaker button yet then play the music
    gameMusic.loop = true;
    gameMusic.load();
    gameMusic.play();
    console.log('speaker has been clicked')
  }
}

function stopAudio() {
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
