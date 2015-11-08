enchant();

window.onload = function() {
	
	
	
	//if (navigator.sayswho.indexOf("IE") != -1) {
	//	window.resizeTo(420,520);
	//}
	
	//Core object creation
	var game = new Core(640, 480);
	game.fps = 16;
	game.gameover = false;
	
	//asset loading
	game.preload('images/greenBg.png'
		, 'images/blackBg.png'
		, 'images/whiteBg.png'
		, 'images/cardSprites.png'
		, 'images/checkSign.png'
		, 'images/xSign.png'
		, 'images/cardLogo.png'
		, 'images/44FormulaLogo.png'
	);
	

	
	
		
	//Called when pre-loading is complete; root scene creation
	game.onload = function() {	  
		
		      
		//start out on title screen
		game.pushScene(game.makeSplashScene());       
		
		
	};
	    
	//splashscreen creation
	game.makeSplashScene = function() {
		var scene = new Scene();
		
		//Background creation
		var bg = makeBackground(game.assets['images/blackBg.png']);
		scene.addChild(bg);
		
		//add company name
		var mainTitleLabel = makeLabel("Aphorism44", 30, 50, "Comic Sans MS", 42, "Orange", 300, 50, "", "left");
		scene.addChild(mainTitleLabel);
		//add logos
		var formLogo = new Sprite(300, 200);
		formLogo.image = game.assets['images/44FormulaLogo.png'];
		formLogo.x = 0;
		formLogo.y = 125;
		scene.addChild(formLogo);
		
		
		//add title screen after a few seconds
		scene.addEventListener(Event.ENTER_FRAME, function() {
			if (scene.age > 25) {
				game.pushScene(game.makeTitleScene());
			}
		});
		
		scene.addEventListener(Event.TOUCH_START, function(e) {
        	window.open("http://www.aphorism44.com");
   		});
		
		return scene;
	};	    
	    
	//start scene creation
	game.makeTitleScene = function() {
		var scene = new Scene();
		
		
		//Background creation
		var bg = makeBackground(game.assets['images/greenBg.png']);
		scene.addChild(bg);
		    
		//title
		var mainTitleLabel = makeLabel("Poker Solitaire", 30, 75, "Times New Roman", 42, "White", 300, 50, "", "left");
		scene.addChild(mainTitleLabel);
		//graphic
		var cardGraphic = new Sprite(100, 120);
		cardGraphic.image = game.assets['images/cardLogo.png'];
		cardGraphic.x = 100;
		cardGraphic.y = 150;
		scene.addChild(cardGraphic);
		//homepage link
		var siteLink = makeLabel("an Aphorism44 game", 175, 120, "Comic Sans MS", 14, "Orange", 150, 12, "", "left");
		siteLink.addEventListener(Event.TOUCH_START, function(e) {
        	window.open("http://www.aphorism44.com/html5Games/pokersolitaire.html");
   		});
		scene.addChild(siteLink); 
		
		var startButton = makeLabel("Start Game", 80, 300, "monospace", 24, "White", 200, 50);
		startButton.addEventListener(Event.TOUCH_START, function(e) {
        	game.pushScene(game.makeGameScene());   
        	dealGame(game);
    	});
		scene.addChild(startButton); 
		var instButton = makeLabel("Instructions", 70, 350, "monospace", 24, "White", 200, 50);
		console.log("instrOut");
		instButton.addEventListener(Event.TOUCH_START, function(e) {
			console.log("instr");
        	game.pushScene(game.makeInstructionScreen());   
    	});
		scene.addChild(instButton); 
		
		
		
		return scene;
	};
	    
	//Game scene creation
	game.makeGameScene = function() {
		var scene = new Scene(); 
		
		//Background creation
		var bg = makeBackground(game.assets['images/greenBg.png']);
		scene.addChild(bg);   
		
		
		var cardSprites = new Sprite(40,40);
		cardSprites.image = game.assets['images/cardSprites.png'];
		//game goes here
		
		
		
		//game stops here
		
		var endGame = makeLabel("End Game", 200, 375, "monospace", 24, "White", 150, 20);
		endGame.addEventListener(Event.TOUCH_START, function(e) {
        	game.pushScene(game.makeQuitGameScene());  
    	});
		scene.addChild(endGame); 
		
		return scene;
	};
	
	//instruction scene creation
	game.makeInstructionScreen = function() {
		var scene = new Scene();
		
		//Background creation
		var bg = makeBackground(game.assets['images/greenBg.png']);
		scene.addChild(bg);
		    
		//title
		var mainTitleLabel = makeLabel("Instructions", 20, 75, "monospace", 28, "White", 300, 50, "", "left");
		scene.addChild(mainTitleLabel);
		
		var instText = "The goal of the game<br>"
					 + "is to form each row of<br>"
					 + "cards into a pat hand<br>"
					 + "(a 5-card winning Poker<br>"
					 + "hand). These hands are:<br>"
					 + "4-of-a-Kind, Full House,<br>"
					 + "Straight, and Flush.<br>"
					 + "Aces are high.<br>";
		
		var instructions = makeLabel(instText, 20, 120, "monospace", 18, "White", 300, 250, "", "left");
		scene.addChild(instructions); 
		
		var hintLabel = makeLabel("Hints", 100, 300, "monospace", 32, "White", 100, 100);
		hintLabel.addEventListener(Event.TOUCH_START, function(e) {
        	game.pushScene(game.makeHintScreen());  
    	});
		scene.addChild(hintLabel); 
		
		var endGame = makeLabel("Return", 100, 350, "monospace", 32, "White", 100, 100);
		endGame.addEventListener(Event.TOUCH_START, function(e) {
        	game.popScene();
    	});
		scene.addChild(endGame); 
		
		
		return scene;
	};
	    
	//hint scene creation
	game.makeHintScreen = function() {
		var scene = new Scene();
		
		//Background creation
		var bg = makeBackground(game.assets['images/greenBg.png']);
		scene.addChild(bg);
		    
		//title
		var mainTitleLabel = makeLabel("Hints", 50, 75, "monospace", 28, "White", 300, 50, "", "left");
		scene.addChild(mainTitleLabel);
		
		var instText = "BE PERSISTENT!<br>"
					 + "Although it may take<br>"
					 + "time, all game are<br>"
					 + "winnable. Be willing<br>"
					 + "to start over.<br>"
					 + "Often, you end up<br>"
					 + "creating 4 winning rows,<br>"
					 + "and are one or two<br>"
					 + "cards short of the<br>"
					 + "fifth. Be ready to<br>"
					 + "start a new pattern<br>"
					 + "at this point.";
		
		var instructions = makeLabel(instText, 20, 120, "monospace", 18, "White", 300, 250, "", "left");
		scene.addChild(instructions); 
		
		var endGame = makeLabel("Return", 100, 350, "monospace", 32, "White", 100, 100);
		endGame.addEventListener(Event.TOUCH_START, function(e) {
        	game.popScene();
    	});
		scene.addChild(endGame); 
		
		
		return scene;
	};    
	    
	
	//quit game screen creation
	game.makeQuitGameScene = function() {
		var scene = new Scene();
		
		//Background creation
		var bg = makeBackground(game.assets['images/greenBg.png']);
		scene.addChild(bg);
		//title
		var mainTitleLabel = makeLabel("Quit?", 100, 75, "Times New Roman", 48, "White", 300, 50, "", "left");
		scene.addChild(mainTitleLabel);
		var endGame = makeLabel("Yes", 100, 300, "monospace", 32, "White", 100, 100);
		endGame.addEventListener(Event.TOUCH_START, function(e) {
        	game.popScene();
        	game.popScene();
    	});
		scene.addChild(endGame); 
		var returnGame = makeLabel("No", 200, 300, "monospace", 32, "White", 100, 100);
		returnGame.addEventListener(Event.TOUCH_START, function(e) {
        	game.popScene();
    	});
		scene.addChild(returnGame); 
		
		return scene;
	};
	    
	//End game screen creation
	game.makeGameOverScene = function() {
		var scene = new Scene();
		
		//Background creation
		var bg = makeBackground(game.assets['images/greenBg.png']);
		scene.addChild(bg);
		//title
		var mainTitleLabel = makeLabel("You Win!", 60, 75, "Times New Roman", 48, "White", 300, 50, "", "left");
		scene.addChild(mainTitleLabel);
		var endGame = makeLabel("Return", 100, 350, "monospace", 32, "White", 100, 100);
		endGame.addEventListener(Event.TOUCH_START, function(e) {
        	game.popScene();
    	});
		scene.addChild(endGame); 
		
		return scene;
	};
    
    //Start game
    game.start();
};

//Background creation
function makeBackground(image) {
	var bg = new Sprite(320, 420);
	bg.image = image;
	return bg;
}

function makeLabel(text, x, y, fontType, fontSize, textColor, width, height, bgColor, alignment) {
	
	var label = new Label();
	label.text = text;
	label.width = width;
	label.height = height;
	label.x = x;
	label.y = y;
	label.backgroundColor = bgColor;
	label.color = textColor;
	label.font = fontSize + "px " + fontType;
	label.textAlign = alignment;


    return label;
}

navigator.sayswho= (function(){
    var ua= navigator.userAgent, tem, 
    M= ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*([\d\.]+)/i) || [];
    if(/trident/i.test(M[1])){
        tem=  /\brv[ :]+(\d+(\.\d+)?)/g.exec(ua) || [];
        return 'IE '+(tem[1] || '');
    }
    M= M[2]? [M[1], M[2]]:[navigator.appName, navigator.appVersion, '-?'];
    if((tem= ua.match(/version\/([\.\d]+)/i))!= null) M[2]= tem[1];
    return M.join(' ');
})();


function playSound(sound) {
	
}
