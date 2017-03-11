//utils.js

"use strict"

var app = app || {};

app.utils = function(){
	function clamp(val, min, max){
		return Math.max(min, Math.min(max, val));
	}
	
	return{
		clamp : clamp
	};
}();