//loader.js

"use strict"

var app = app || {};

app.KEYBOARD = {
	"KEY_SPACE": 32,
	"KEY_UP": 38
};

app.keydown = [];

window.onload = function(){
	console.log("loader loaded");
	app.player.drawHandler = app.drawHandler;
	app.experience.drawHandler = app.drawHandler;
	app.experience.utils = app.utils;
	app.experience.app = app;
	app.experience.init(app.player);
	
}

window.addEventListener("keydown",function(e){
	app.keydown[e.keyCode] = true;
});

window.addEventListener("keyup",function(e){
	app.keydown[e.keyCode] = false;
});