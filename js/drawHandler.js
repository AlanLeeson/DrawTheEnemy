//drawHandler.js

"use strict"

var app = app || {};

app.drawHandler = {

	clear: function(ctx,x,y,w,h){
		ctx.clearRect(x,y,w,h);
	},

	rect: function(ctx,x,y,w,h,col){
		ctx.save();
		ctx.fillStyle = col;
		ctx.fillRect(x,y,w,h);
		ctx.restore();
	},
	
	backdrop: function(ctx){
		ctx.save();
		ctx.fillStyle = "red";
		ctx.fillRect(0,390,700,500);
		ctx.fillStyle = "gray";
		ctx.fillRect(0,0,50,390);
		ctx.restore();
	}
};