//experience.js

"use strict"

var app = app || {};

app.experience = {

	//general initialization
	START: 0,
	PLAYING: 1,
	DRAWING: 2,
	gameState: undefined,
	WIDTH: 700,
	HEIGHT: 500,
	canvas: undefined,
	ctx: undefined,
	
	//for the game
	GRAVITY: 9.78,
	dt: 1/60.0,
	player: undefined,
	drawHandler: undefined,
	utils: undefined, 
	app: undefined,
	playerBullets: [],
	arc: 0,
	spaceDown: false,
	enemies: [],
	score: 0, 
	//audio
	audioCtx: undefined,
	music1: undefined,
	textJump: false,
	textShoot: false,
	
	//for drawing
	strokeStyle: undefined,
	dragging: false,
	leftImageData: undefined,
	middleImageData: undefined,
	rightImageData: undefined,
	leftConverterCanvas: undefined,
	leftConverterCtx: undefined,
	middleConverterCanvas: undefined,
	middleConverterCtx: undefined,
	rightConverterCanvas: undefined,
	rightConverterCtx: undefined,
		
	init: function(player){
	
		console.log("main loaded");
		//loads the canvas and sets the size and context
		this.canvas = document.querySelector("#mainCanvas");
		this.canvas.width = this.WIDTH;
		this.canvas.height = this.HEIGHT;
		this.ctx = this.canvas.getContext('2d');
		
		//these are for the images to be drawn by the user
		//the images are drawn in the main canvas then added 
		this.leftConverterCanvas = document.querySelector("#leftConverter");
		this.leftConverterCtx = this.leftConverterCanvas.getContext('2d');
		this.middleConverterCanvas = document.querySelector("#middleConverter");
		this.middleConverterCtx = this.middleConverterCanvas.getContext('2d');
		this.rightConverterCanvas = document.querySelector("#rightConverter");
		this.rightConverterCtx = this.rightConverterCanvas.getContext('2d');
		
		this.gameState = this.DRAWING;
		
		this.player = player;
		
		this.player.init();
		
		this.update();
		
		this.canvas.onmousedown = mouseDown;
		this.canvas.onmousemove = mouseMove;
		this.canvas.onmouseup = mouseUp;
		
		this.strokeStyle = "#99001C";
		
		document.querySelector('#colorRed').onclick = doRedColor;
		document.querySelector('#colorBlue').onclick = doBlueColor;
		document.querySelector('#colorGreen').onclick = doGreenColor;
		document.querySelector('#colorPurple').onclick = doPurpleColor;
		
		document.querySelector("#playButton").onclick = startGame;
		document.querySelector("#playButton").disabled = true;
		document.querySelector("#saveButton").onclick = saveImages;
		document.querySelector("#drawButton").onclick = reDraw;
		document.querySelector("#drawButton").disabled = true;
		
		
		this.audioCtx = new(window.AudioContext || window.webkitAudioContext)();
		this.music1 = new Audio('media/ActualSong.mp3');
	},
	
	update: function(){
		requestAnimationFrame(this.update.bind(this));
		switch(this.gameState){
			case this.START:
			break;
			case this.PLAYING:
				this.move();
				this.checkCollisions();
				this.draw();
				this.music1.addEventListener('ended', function() {
   					 this.currentTime = 0;
    				this.play();
				}, false);
				this.music1.play();
				
				if(this.player.lives <= 0){
					this.gameState = this.DRAWING;
					app.experience.music1.pause();
					for(var i = 0; i < this.enemies.length; i++){
					this.enemies[i].oscillator.noteOff(0);
					};
					this.drawHandler.clear(this.ctx,0,0,this.WIDTH,this.HEIGHT);
					document.querySelector("#colorSelector").style.visibility = "visible";
					document.querySelector("#playButton").disabled = true;
					this.player.lives = 5;
					this.score = 0;
				}
				
			break;
			case this.DRAWING:
				this.grid();
			break;
		}
	},
	
	draw: function(){
		this.drawHandler.clear(this.ctx,0,0,this.WIDTH,this.HEIGHT);
		this.drawHandler.backdrop(this.ctx);
		this.player.draw(this.ctx);
		
		for(var i = 0; i < this.playerBullets.length; i++){
			this.playerBullets[i].draw(this.ctx);
		}
		
		for(var i = 0; i < this.enemies.length; i++){
			this.enemies[i].draw(this.ctx);
		};
		
		this.ctx.font = "30px Verdana";
		
		if(!this.textShoot){
			this.ctx.fillText("Press and/or hold the spacebar to shoot.",50,150);
		}
		if(this.textShoot && !this.textJump){
			this.ctx.fillText("Press the up arrow '^' to jump.",100,150);	
		}
		
		this.ctx.fillText(Math.round(this.score),600,30);
		this.ctx.fillText("Lives: " + this.player.lives,550,60);
	},
	
	move: function(){
		
		if(this.app.keydown[this.app.KEYBOARD.KEY_UP] && this.player.velocity == 0){
			this.textJump = true;
			this.player.jump();
		}
		
		this.player.applyForce(this.GRAVITY);
		this.player.update(this.dt);
		
		var paddingY = this.player.sourceHeight/2;
		var max = this.HEIGHT-paddingY-100;
		this.player.y = this.utils.clamp(this.player.y,paddingY,max);
		
		if(this.player.y >= max)
		{
			this.player.velocity = 0;
		}
		if(app.keydown[app.KEYBOARD.KEY_SPACE]){
			this.textShoot = true;
			this.arc ++;
			this.spacedown = true;
		}
		else{
			if(this.spacedown == true){
				this.fire(this.player.x,this.player.y-5,this.arc);
				this.arc = 0;
				this.spacedown = false;
			}
		}	
		
		
		for(var i = 0; i < this.playerBullets.length; i++){
			this.playerBullets[i].applyForce(this.GRAVITY);
			this.playerBullets[i].update(this.dt);
			this.playerBullets = this.playerBullets.filter(function(bullet){
				return bullet.active;
			});
		}
		for(var i = 0; i < this.enemies.length; i++){
			this.enemies[i].applyForce(this.GRAVITY);
			this.enemies[i].update(this.dt);
			this.enemies[i].y = this.utils.clamp(this.enemies[i].y,
			this.enemies[i].height/2,max-this.enemies[i].green);
			if(this.enemies[i].y >= max-this.enemies[i].green){
				this.enemies[i].yVelocity = 0;
			}
			
	}
		this.enemies = this.enemies.filter(function(enemy){
			return enemy.active;
		});
		if(Math.random() < 1/120){
			var ran = Math.floor(Math.random()*3)+1;
			switch(ran){
				case 1:
					this.enemies.push(new app.enemy(this.leftConverterCanvas,this.leftImageData,50,50,ran,this.audioCtx));
				break;
				case 2:
					this.enemies.push(new app.enemy(this.middleConverterCanvas,this.middleImageData,50,50,ran,this.audioCtx));	
				break;
				case 3:
					this.enemies.push(new app.enemy(this.rightConverterCanvas,this.rightImageData,50,50,ran,this.audioCtx));
				break;
			}
		}
	},
	
	checkCollisions: function(){
		var that = this;
		this.playerBullets.forEach(function(bullet){
			that.enemies.forEach(function(enemy){
				if(that.collides(bullet,enemy)){
					enemy.active = false;
					that.score += (enemy.x - that.player.x)/5;
				}
			});
		});
		this.enemies.forEach(function(enemy){
			if(that.collides(enemy,that.player)){
				that.player.lives--;
				enemy.active = false;
			}
		});
	},
	
	collides: function(a,b){
		var ax = a.x - a.width/2;
		var bx = b.x - b.width/2;
		var ay = a.y - a.height/2;
		var by = b.y - b.height/2;
		
		return ax < bx + b.width 
				&& ax + a.width > bx 
				&& ay < by + b.height 
				&& ay + a.height > by;
	},
	
	fire: function(x,y,arc){
		console.log("shooting");
		this.playerBullets.push(new app.bullet(x,y,arc));
	},
	
	
	
	//Drawing section
	grid: function(){
		this.ctx.lineWidth = "1";
		this.ctx.font = "30px Verdana";
		this.ctx.fillText("Draw an enemy in each box then hit save.",25,100);
		this.ctx.strokeStyle = "#000000";
		this.ctx.strokeRect(30,200,200,200);
		this.ctx.strokeRect(250,200,200,200);
		this.ctx.strokeRect(470,200,200,200);
	},
	
};

function startGame(){
	app.experience.gameState = app.experience.PLAYING;
	document.querySelector("#playButton").disabled = true;
	document.querySelector("#drawButton").disabled = false;
	document.querySelector("#colorSelector").style.visibility = "hidden";
	
}

function saveImages(){

	document.querySelector("#playButton").disabled = false;
	app.experience.leftImageData = app.experience.ctx.getImageData(31,201,198,198);
	app.experience.leftConverterCtx.putImageData(app.experience.leftImageData,0,0);
	
	
	app.experience.middleImageData = app.experience.ctx.getImageData(251,201,198,198);
	app.experience.middleConverterCtx.putImageData(app.experience.middleImageData,0,0);
	
	app.experience.rightImageData = app.experience.ctx.getImageData(471,201,198,198);
	app.experience.rightConverterCtx.putImageData(app.experience.rightImageData,0,0);
}

function reDraw(){
	document.querySelector("#playButton").disabled = true;
	app.experience.drawHandler.clear(app.experience.ctx,0,0,app.experience.WIDTH,app.experience.HEIGHT);
	app.experience.gameState = app.experience.DRAWING;
	document.querySelector("#colorSelector").style.visibility = "visible";
	app.experience.music1.pause();
	for(var i = 0; i < app.experience.enemies.length; i++){
			app.experience.enemies[i].oscillator.noteOff(0);
	};
}

function doRedColor(){
		app.experience.strokeStyle = "#99001C";
		console.log(app.experience.strokeStyle);
}
function doBlueColor(){
		app.experience.strokeStyle = "#000080";
		console.log(app.experience.strokeStyle);
}
function doGreenColor(){
		app.experience.strokeStyle = "#038D49";
		console.log(app.experience.strokeStyle);
}
function doPurpleColor(){
		app.experience.strokeStyle = "#7C4691";
		console.log(app.experience.strokeStyle);
}

function mouseDown(e){
	app.experience.dragging = true;
	var mouse = getMouse(e);

	app.experience.ctx.beginPath();
	app.experience.ctx.moveTo(mouse.x,mouse.y);
}
		
function mouseMove(e){
	if(app.experience.dragging){
		var mouse = getMouse(e);
				
		app.experience.ctx.strokeStyle = app.experience.strokeStyle;
		app.experience.ctx.lineWidth = "10";
		app.experience.ctx.lineTo(mouse.x,mouse.y);
		app.experience.ctx.stroke();
	}
}
		
function mouseUp(e){
	app.experience.dragging = false;
	app.experience.ctx.closePath();			
}
	 
function getMouse(e){
	var mouse = {}
	mouse.x = e.pageX - e.target.offsetLeft;
	mouse.y = e.pageY - e.target.offsetTop;
	return mouse;
}
