//bullet.js

"use strict"

var app = app || {};

app.bullet = function(){
	function bullet(x,y,vel){
		this.x = x;
		this.y = y;
		this.height = 3;
		this.width = 3;
		this.active =true;
		this.xVelocity = 5;
		this.yVelocity = 0;
		this.initialYVelocity = -vel * 10;
		this.acceleration = 0;
		this.born = true;
	}
	
	var b = bullet.prototype;
	
	b.applyForce = function(force){
		this.acceleration += force;
	};
	
	b.update = function(dt){
		if(this.born){
			this.applyForce(this.initialYVelocity);
			this.born = false;
		}
		this.x += this.xVelocity;
		this.yVelocity += this.acceleration;
		this.y += this.yVelocity * dt;
		this.acceleration = 0;
		this.active = this.active && dead(this.y);
	};
	
	b.draw = function(ctx){
		ctx.fillStyle = "black";
		ctx.fillRect(this.x,this.y,this.width,this.height);	
	};
	
	function dead(y){
		return y <= 510;
	};
	
	return bullet;
}();