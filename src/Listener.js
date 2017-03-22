"use strict";


var classify = require('./Classy').classify;


/**
 * @param {Event} event
 * @constructor
 */
function Listener(event) {
	var _event = event;
	
	
	this.add = function add(callback) {
		_event.add(callback);
		return this;
	};
	
	this.rem = function rem(callback) {
		_event.rem(callback);
		return this;
	};
	
	
	classify(this);
}


module.exports = Listener;