/*
Magical dice gambling script lovingly coded by James Brenton
www.jamesbrenton.co.uk
@sternJobname
*/

var playerDice=[0,0,0,0,0];		//Array to hold all the player's dice
var playerScore;				//Tally of player score
var computerDice=[0,0,0,0,0];	//Array to hold all the computer's dice
var computerScore;				//Tally of computer score
var rollLabel = [];				//Array to hold all the rollLabel IDs
var currentBet=0;				//The starting bet
var currentBalance=100;			//The starting bank balance
var currentDie;					//The die the player is selecting to re-roll (0-5)
var minimumStand = 3; 			//The highest number the computer will stand on 


//Give them dice a roll
function rollDice() {
	for (i=0; i<5; i++){
	     playerDice[i] = Math.floor( 1 + Math.random() * 6 );
	     computerDice[i] = Math.floor( 1 + Math.random() * 6 );
	}

};

//When we need to re-roll, we find out which button the user has clicked on by looking at the rollLabel ID. This is then passed to the function as currentDie.
function reRollDice(currentDie) {
	     playerDice[currentDie] = Math.floor( 1 + Math.random() * 6 );	//Re-roll for clicked die
	     $("#pDie"+currentDie).removeClass();	//Remove the class (and image)...
	     $("#pDie"+currentDie).addClass("die dieFace"+playerDice[currentDie]); //...and add the new class
	     $("#rollLabel"+currentDie).css('display','none');	//Hide the button now - only one re-roll allowed
};
function reRollComputerDice(currentDie) {
	     computerDice[currentDie] = Math.floor( 1 + Math.random() * 6 );
	     $("#cDie"+currentDie).removeClass();
	     $("#cDie"+currentDie).addClass("die dieFace"+computerDice[currentDie]);
};

//This adds the appropriate class for the die faces
function outputClasses(){
	for (i=0; i<5; i++) {
		$("#pDie"+[i]).removeClass().addClass("die dieFace"+playerDice[i]);
		$("#cDie"+[i]).removeClass().addClass("die dieFace"+computerDice[i]); 
		}
};

//Replace the text in the currentBetLabel with the currentBet
function updateBet(){
	$('#currentBetLabel').text(currentBet);
	$('#currentBalanceLabel').text(currentBalance);
};

//Update the scores
function updateScores(){
	playerScore=0;
	computerScore=0;
	for (i=0; i<5; i++) {
		playerScore=playerScore+playerDice[i];
		computerScore=computerScore+computerDice[i];
	}
	$("#playerScore").text(playerScore);
	$("#computerScore").text(computerScore);
};

//When the player clicks 'Play', we'll hide and reveal some of the page elements.
function gameMode() {
	console.log("Game mode entered");
	$('#increaseBet, #decreaseBet').css('display','none');
	for (i=0; i<5; i++) {
		$('#rollLabel'+[i]).css('display','block');
	}
};

//Enter computer play mode
function computerPlay(){
	console.log("Computer play mode entered");
	$("#doneLabel").css('display', 'none');
	for (currentDie=0; currentDie<5; currentDie++) {
		if (playerScore >= computerScore) {			//Check to make sure it's worth playing each time
			if (computerDice[currentDie]<minimumStand) {
				console.log("Computer is re-rolling die " + currentDie);
				console.log("Die " + currentDie + " was scored at " + computerDice[currentDie]);
				reRollComputerDice(currentDie);	
				console.log("Die " + currentDie + " is now scored at " + computerDice[currentDie]);
				updateScores();
			}
		}
	else {
		console.log("Player already losing - no point playing");
	}
	};
};

function fadeResult(){
	$('#resultWrap').fadeIn('slow').delay(2000).fadeOut('slow');
};

//Find out who the winner is and announce
function findWinner() {
	if (playerScore>computerScore) {
		console.log("Player wins");
		$('#resultWrap').addClass('win');
		$('.result p').text('YOU WIN!');
		fadeResult();
		currentBalance=currentBalance+currentBet;	//Add the winnings
		setTimeout("betMode()", 3200);				//And restart the process after waiting for animation to complete
	}
	else if (playerScore==computerScore) {
		console.log("It be a draw");
		$('.result p').text('DRAW');
		fadeResult();
		setTimeout("betMode()", 3200);
	}
	else {
		console.log("Player loses");
		$('#resultWrap').addClass('lose');
		$('.result p').text('YOU LOSE!');
		fadeResult();
		currentBalance=currentBalance-currentBet;		
		if (currentBalance <= 0){
			setTimeout("bankrupt()", 3200);
		}			
		setTimeout("betMode()", 3200);

	}
};

function bankrupt() {
	console.log("Bankrupt!");
	/* $('#playAgain').fadeIn('slow'); */
	var answer = confirm ("Bankrupt! Play again?");
	if (answer) {
		console.log("User plays again");
		currentBalance=100;		//Set the game up for restart
		currentBet=0;
		}
		
	else {
		console.log("User doesn't want to play again");
		$(window).remove;
		window.location="http://www.jamesbrenton.co.uk/";
		}
};

function betMode() {
	$('#resultWrap').removeClass('win lose draw');	//Reset the result label for next game
	if (currentBet > currentBalance) {				//Check to make sure the player has enough money left to re-bet the same as previous round
		currentBet=currentBalance;
	}
	updateBet();
	rollDice();
	outputClasses();
	updateScores();
	$('#increaseBet, #decreaseBet, #playLabel').css('display','inline-block');
	for (i=0; i<5; i++) {
		$('#rollLabel'+[i]).css('display','none');
	};

};

// This will happen when the + or - buttons are clicked on
$("#increaseBet").click(function() {
	if (currentBalance > currentBet) {
		currentBet=currentBet+10;
		/* currentBalance=currentBalance-10; */
		updateBet();
	};
});
$("#decreaseBet").click(function() {
	if (currentBet > 10) {
		currentBet=currentBet-10;
		/* currentBalance=currentBalance+10; */
		updateBet();
	};
});

// When the 'Play' button is clicked:
$("#playLabel").click(function() {
	$("#playLabel").css('display', 'none');
	$("#doneLabel").css('display', 'block');
	gameMode();
});

// When the 'Done' button is clicked:
$("#doneLabel").click(function() {
	$("#doneLabel").css('display', 'none');
	computerPlay();
	findWinner();
});

//When any of the re-roll buttons are clicked on
$(".rollLabel").click(function() {
	console.log("a reroll button was clicked on");
	currentDie = (this.id).replace(/rollLabel/, '');  //Look at the ID of the clicked element and nab the number out of it
	console.log(currentDie);
	reRollDice(currentDie);	//Re-roll for the chosen die
	updateScores();
});

//If the 'About' button is clicked
$(".slideButton").click(function(){
		$(".dropDown").slideToggle("slow");
});

betMode();