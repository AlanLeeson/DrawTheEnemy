//player.js

"use strict"

var app = app || {};

app.player = {
	color: "yellow",
	x: 100,
	y: 380,
	velocity: 0,
	acceleration: 0,
	width: 34,
	height: 42,
	speed: -350,
	//gravity: 200,
	drawHandler: undefined,
	sourceX: 28,
	sourceY: 2,
	sourceWidth: 17,
	sourceHeight: 42,
	lives: 5,
	
	init: function(){
		console.log("app.player.init() called");
	
	},
	
	draw: function(ctx){
		var halfW = this.width/2;
		var halfH = this.height/2;
		
		this.drawHandler.rect(ctx,this.x-halfW,this.y-halfH,
		this.width,this.height,this.color);
	
	},
	
	applyForce: function(force){
		this.acceleration += force;
	},
	
	update: function(dt){
		this.velocity += this.acceleration;
		this.y += this.velocity * dt;
		this.acceleration = 0;
	},
	
	jump: function(){
		this.applyForce(this.speed);
		console.log("jump");
	},
	
};
