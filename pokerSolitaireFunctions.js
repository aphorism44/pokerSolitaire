

var cardsChosen = 0;
var firstChosenCard;
var firstChosenCardX;
var firstChosenCardY;

var suitData = new Array();
var valueData = new Array();
var cardData = new Array();

var allDealValues = new Array();
var allDealSuits = new Array();

var firstChosenRow;
var firstChosenCol;
var secondChosenRow;
var secondChosenCol;

function dealGame(game) {
	
	
	
	var rows = 5;
	var columns = 5;
	var spriteIndex;
	
	//clear all global data
	clearGlobalData();
	
	//create card data
	for (var i = 0; i < 52; i++) {
		cardData.push(i);
	}
	//console.log(cardData);
	shuffle(cardData);
	//console.log(cardData);
	
	var cardIndex = 0;
	initializeCardData(rows, columns, suitData, valueData);  
	for (var c = 0; c < columns; c++) {
		for (var r = 0; r < rows; r++) {
			var card = new Sprite(40,40);
			spriteIndex = cardData[cardIndex];
			card.image = game.assets["images/cardSprites.png"];
			card.frame = spriteIndex;
			card.x = 50 * c + 10;
			card.y = 60 * r + 75;
			card.currentRow = r;
			card.currentCol = c;
			card.value = getCardValue(spriteIndex);
			card.suit = getCardSuit(spriteIndex);
			allDealValues.push(card.value);
			allDealSuits.push(card.suit);
			//store data
			insertTableauData(r, c, card, suitData, valueData);
			suitData.push(card.suit);
			valueData.push(card.value);
			card.addEventListener(Event.TOUCH_START, function(e) {
        		handleOnTouch(e, game);
    		});
			game.currentScene.addChild(card);
			cardIndex++;
		}
	}
	
	//check to see if this is a viable hand
	allDealValues.sort(sortNumber);
	allDealSuits.sort(sortNumber);
	//console.log(allDealValues);
	//console.log(allDealSuits);
	
	var spades = 0, hearts = 0, clubs = 0, diamonds = 0, flushes = 0;
	
	for (var s = 0; s < 25; s++) {
		switch(allDealSuits[s]) {
			case 0:
				spades++;
				break;
			case 1:
				hearts++;
				break;
			case 2:
				clubs++;
				break;
			case 3:
				diamonds++;
				break;
		}
	}
	flushes += Math.floor(spades / 5);
	flushes += Math.floor(hearts / 5);
	flushes += Math.floor(clubs / 5);
	flushes += Math.floor(diamonds / 5);
	//console.log("flushes: " + flushes);
	
	lastValue = -1, triples = 0, pairs = 0, checkCount = 1, fullH = 0, missingCards = 0;
	for (var p = 0; p < 25; p++) {
		if (allDealValues[p] == lastValue) {
			checkCount++;
		} else {
			if ( (allDealValues[p] - 1) != lastValue) {
				missingCards++;
			}
			lastValue = allDealValues[p];
			if (checkCount > 2) {
				triples++;
			}
			if (checkCount == 2) {
				pairs++;
			}
			checkCount = 1;
		}
	}
	
	fullH = Math.min(triples, pairs);
	//console.log("possible full houses: " + fullH);
	//console.log("missingCards: " + missingCards);
	
	if (flushes < 3 || fullH < 3 || missingCards > 0) {
		//console.log("this hand may not be viable");
		clearGlobalData();
		game.popScene();
		game.pushScene(game.makeGameScene());   
        dealGame(game);
	}
	
	updateRowCompletion(game);
	
}

function updateRowCompletion(game) {
	var completedRows = 0;
	var valuesInRow = new Array(5);
	var suitsInRow = new Array(5);
	for (var row = 0; row < 5; row++) {
		for (var col = 0; col < 5; col++) {
			valuesInRow.push(valueData[row][col]);
			suitsInRow.push(suitData[row][col]);
		}
		var completedRow = 0;
		
		
		valuesInRow.sort(sortNumber);
		suitsInRow.sort(sortNumber);
		
		//console.log(valuesInRow);
		//console.log(suitsInRow);
		
		
		//check for flush
		if (suitsInRow[0] == suitsInRow[4]) {
			completedRow = 1;
			completedRows++;
		//check for 4-of-a-kind
		} else if (valuesInRow[0] == valuesInRow[3] || valuesInRow[1] == valuesInRow[4]) {
			completedRow = 1;
			completedRows++;
		//check for full house
		}  else if ( (valuesInRow[0] == valuesInRow[2] && valuesInRow[3] == valuesInRow[4])
					|| (valuesInRow[0] == valuesInRow[1] && valuesInRow[2] == valuesInRow[4])   ) {
			completedRow = 1;
			completedRows++;
		//check for straight
		} else if ( (valuesInRow[0] + 1 == valuesInRow[1])
				&& (valuesInRow[1] + 1 == valuesInRow[2])
				&& (valuesInRow[2] + 1 == valuesInRow[3])
				&& (valuesInRow[3] + 1 == valuesInRow[4]) ) {
			completedRow = 1;
			completedRows++;
		}
		
		//update the graphic at end of row
		var checkMark = new Sprite(40,40);
		var xMark = new Sprite(40,40);
		checkMark.image = game.assets["images/checkSign.png"];
		xMark.image = game.assets["images/xSign.png"];
					
		if (completedRow == 1) {
			checkMark.x = 275;
			checkMark.y = 60 * row + 75;
			game.currentScene.addChild(checkMark);
		} else {
			xMark.x = 275;
			xMark.y = 60 * row + 75;
			game.currentScene.addChild(xMark);
		}
		
		//check for game over
		if (completedRows == 5) {
			( new Clay.Achievement( { id: 2863 } ) ).award();
			game.replaceScene(game.makeGameOverScene());
		} 
		
		valuesInRow = [];
		suitsInRow = [];
		
	}
}

//0 = spade, 1 = heart, 2 = club, 3 = diamond
//0 = 2, 1 = 3...8 = 10, 9 = J, 10 = Q, 11 = K, 12 = A
function handleOnTouch(event, game) {
	var touchedCard = event.target;
	//alert("row: " + touchedCard.currentRow);
	//alert("col: " + touchedCard.currentCol);
	//alert("value: " + touchedCard.value);
	//alert("suit: " + touchedCard.suit); 
	//switch around the cards
	if(!!firstChosenCard === false) {
		firstChosenCard = touchedCard;
		firstChosenCardX = firstChosenCard.x;
		firstChosenCardY = firstChosenCard.y;
		//mark the first touched card
		//add the card marker
		game.markLabel = new Label("O");
		game.markLabel.color = "Chartreuse";
		game.markLabel.size = 48;
		game.markLabel.x = firstChosenCardX + 10;
		game.markLabel.y = firstChosenCardY + 10;
		game.currentScene.addChild(game.markLabel);
	} else {
		//unmark the first touched card
		game.currentScene.removeChild(game.markLabel);
		//switch data in card object and array
		firstChosenRow = firstChosenCard.currentRow;
		firstChosenCol = firstChosenCard.currentCol;
		secondChosenRow = touchedCard.currentRow;
		secondChosenCol = touchedCard.currentCol;
		firstChosenCard.currentRow = secondChosenRow;
		firstChosenCard.currentCol = secondChosenCol;
		touchedCard.currentRow = firstChosenRow;
		touchedCard.currentCol = firstChosenCol;
		
		valueData[firstChosenRow][firstChosenCol] = touchedCard.value;
		suitData[firstChosenRow][firstChosenCol] = touchedCard.suit;
		valueData[secondChosenRow][secondChosenCol] = firstChosenCard.value;
		suitData[secondChosenRow][secondChosenCol] = firstChosenCard.suit;
		//switch card graphics
		firstChosenCard.x = touchedCard.x;
		firstChosenCard.y = touchedCard.y;
		touchedCard.x = firstChosenCardX;
		touchedCard.y = firstChosenCardY;
		//clear all data
		firstChosenCard = null;
		firstChosenCardX = null;
		firstChosenCardY = null;
		firstChosenRow = null;
		firstChosenCol = null;
		secondChosenRow = null;
		secondChosenCol = null;
		//recheck all the rows
		updateRowCompletion(game);
	
	} 
}


function getCardValue(spriteIndex) {
	var valueNum;
	valueNum = spriteIndex %= 13;
	return valueNum;
}


function getCardSuit(spriteIndex) {
	var suitNum;
	if (spriteIndex < 13) {
		suitNum = 0;
	} else if (spriteIndex < 26) {
		suitNum = 1;
	} else if (spriteIndex < 39) {
		suitNum = 2;
	} else {
		suitNum = 3;
	} 
	return suitNum;
}


function insertTableauData(r, c, card, suitData, valueData) {
	suitData[r][c] = card.suit;
	valueData[r][c] = card.value;
}

//storing data on cards
function initializeCardData(rows, columns, suitData, valueData) {
	for (var r = 0; r < rows; r++) {
		suitData[r] = new Array(columns);
		valueData[r] = new Array(columns);
	}
}


function shuffle(array) {
    var tmp, current, top = array.length;

    if(top) while(--top) {
    	current = Math.floor(Math.random() * (top + 1));
    	tmp = array[current];
    	array[current] = array[top];
    	array[top] = tmp;
    }

    return array;
}

function randomNumber(n){
    var randNum = Math.floor(Math.random() * n);
    return randNum;
}

//for JS, you need this function to sort ints
function sortNumber(a,b) {
  return a - b;
}

function clearGlobalData() {
	cardsChosen = 0;
	firstChosenCard = null;
	firstChosenCardX = null;
	firstChosenCardY = null;
	suitData = [];
	valueData = [];
	cardData = [];
	allDealValues = [];
	allDealSuits = [];
	firstChosenRow = null;
	firstChosenCol = null;
	secondChosenRow = null;
	secondChosenCol = null;
	spades = null;
	hearts = null;
	clubs = null;
	diamonds = null;
	flushes = null;
	lastValue = null;
	triples = null;
	pairs = null;
	checkCount = null;
	missingCards = null;
}
