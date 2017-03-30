"use strict";


/**
 * @template T
 * 
 * @constructor
 * @class {CachedEventHandler}
 * @memberOf {duct.handlers}
 * 
 * @property {T} _value
 * @property {Event} _event 
 * 
 * @param {Event<function(T)>} event
 * @param {*=} defaultValue
 */
function CachedEventHandler(event, defaultValue) {
	this._event = event;
	this._value = defaultValue;
	this._isSubscirbed = true;
	
	event.add((function(val) {
		this._value = val;
	}).bind(this));
}


/**
 * @param {T} data
 * @private
 */
CachedEventHandler.prototype._handle = function(data) {
	this._value = data;
};


/**
 * @return {T}
 */
CachedEventHandler.prototype.get = function() {
	return this._value;
};

CachedEventHandler.prototype.subscribe = function() {
	if (!this._isSubscirbed) {
		this._event.add(this._handle);
		this._isSubscirbed = true;
	}
};

CachedEventHandler.prototype.unSubscribe = function() {
	if (this._isSubscirbed) {
		this._event.remove(this._handle);
		this._isSubscirbed = false;
	}
};


module.exports = CachedEventHandler;