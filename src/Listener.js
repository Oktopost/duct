"use strict";


var classify = require('./Classy').classify;


/**
 * @template T
 * 
 * @constructor
 * @class {duct.Listener}
 * 
 * @param {Event<T>} event
 * 
 * @property {Event<T>} _event
 */
function Listener(event) {
	this._event = event;
	classify(this);
}


/**
 * @param {T} callback
 * @return {Listener<T>}
 */
Listener.prototype.add = function add(callback) {
	this._event.add(callback);
	return this;
};

/**
 * @param {T} callback
 * @return {Listener<T>}
 */
Listener.prototype.remove = function add(callback) {
	this._event.remove(callback);
	return this;
};


module.exports = Listener;