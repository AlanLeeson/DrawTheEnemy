//enemy.js

"use strict"

var app = app || {};

app.enemy = function(){

	function enemy(canvas, imageData, width, height, ran, audioCtx){
		this.color = "blue";
		this.canvas = canvas;
		//audio
		this.audioCtx = audioCtx;
		this.oscillator = this.audioCtx.createOscillator();
		this.gain = this.audioCtx.createGain();
		this.initialFreq = 50;
		this.maxFreq = 1000;
		this.initialVol = 0.005;
		this.maxVol = 0.02;
		
		this.imageData = imageData;
		this.data = imageData.data;
		this.width = width;
		this.height = height;
		this.x = 700;
		this.y = 320;
		this.active = true;
		this.xVelocity = 0;
		this.yVelocity = 0;
		this.acceleration = 0;
		this.pulseVelocity = -300;
		this.type = ran;
		this.red = 0;
		this.blue = 0;
		this.green = 0;
		
		for(var i = 0; i < this.data.length; i++){
			//does the upwards force
			if(this.data[i] == 153){
				this.red ++;
			}
			//does the frequency of jumps
			if(this.data[i+2] == 73){
				this.green ++;
			}
			//does the speed of the object
			else if(this.data[i+2] == 128){
				this.blue ++;
			}
		}
		this.xVelocity = -(100 + (this.blue+1)/100);
		this.green = (1 + this.green)/50;
		this.y = this.y - this.green + this.height;
		
		this.oscillator.connect(this.gain);
		this.gain.connect(this.audioCtx.destination);
		
		this.oscillator.type = 'square';
		this.oscillator.frequency.value = this.initialFreq;
		this.oscillator.detune.value = 100;
		this.oscillator.start();
		this.gain.gain.value = this.initialVol; 
	};
	
	var e = enemy.prototype;
	
	e.draw = function(ctx){
		var halfW = this.width/2;
		var halfH = this.height/2;
		ctx.drawImage(this.canvas,this.x-halfW,this.y-halfH,50,50);
	};
	
	e.applyForce = function(force){
		this.acceleration += force;
	};
	
	e.update = function(dt){
		if(this.x < -50){
			this.active = false;
		}	
		if(this.active){
			if(Math.random() < 1/30 && this.yVelocity == 0){
				this.applyForce(-this.red/20);
				console.log(this.xVelocity + " " + this.green);
			}
		if(this.yVelocity != 0){
			this.oscillator.frequency.value = (500-this.y)/500 * this.maxFreq;
		}
		else{
			this.oscillator.frequency.value = 0;
		}
			this.yVelocity += this.acceleration;

			this.x += this.xVelocity * dt;
			this.y += this.yVelocity * dt;
			this.acceleration = 0;
		
			this.gain.gain.value = ((700-this.x)/700) * this.maxVol;
		}
			
		else{
			this.oscillator.stop();
		}
		
	};
	
	return enemy;
}();