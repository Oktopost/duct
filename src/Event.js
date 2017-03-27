"use strict";


var func	= require('oktopost-plankton').func;
var array	= require('oktopost-plankton').array;


/**
 * @template T
 * 
 * @constructor
 * @class {duct.Event}
 * 
 * @property {Array<T>} _callbacks
 * @property {string} _name
 * @property {function(err)} _errorHandler
 */
function Event(name) {
	this._callbacks	= [];
	this._name		= name || '';
	
	this._errorHandler = function(err) {
		console.error('Error when executing event ' + this._name, err);
	};
}


/**
 * @param {Function} callback
 * @param {Array} callbackArgs
 * @private
 */
Event.prototype._triggerCallback = function(callback, callbackArgs) {
	var wrappedCallback = func.safe(callback, this._errorHandler);
	wrappedCallback = func.async(wrappedCallback); 
	wrappedCallback.apply(null, callbackArgs);
};


/**
 * @returns {string}
 */
Event.prototype.name = function name() {
	return this._name;
};

/**
 * @param {function(err)} handler
 */
Event.prototype.setErrorHandler = function(handler) {
	this._errorHandler = handler;
};

Event.prototype.clear = function() {
	this._callbacks = [];
};

/**
 * @param {T} callback
 * @return {Event}
 */
Event.prototype.add = function(callback) {
	this._callbacks.push(callback);
	return this;
};

/**
 * @param {T} callback
 * @return {Event}
 */
Event.prototype.remove = function(callback) {
	var index = this._callbacks.indexOf(callback);
	
	if (index >= 0) {
		this._callbacks.splice(index, 1);
	}
	
	return this;
};

/**
 * @returns {Number}
 */
Event.prototype.count = function count() {
	return this._callbacks.length;
};

/**
 * @type T
 */
Event.prototype.trigger = function() {
	var callbackArgs = [].slice.apply(arguments);
	var self = this;
		
	setTimeout(
		function() {
			array.forEach(self._callbacks, function(callback) {
				self._triggerCallback(callback, callbackArgs);
			});
		}, 0);
};


module.exports = Event;