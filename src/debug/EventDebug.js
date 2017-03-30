'use strict';


var DEFAULT_FILTER = /.*/;

/**
 * @param {Event} event
 * @param {Array} args
 */
var DEFAULT_LOGGER = function (event, args) { 
	console.groupCollapsed('Event %c' + event.name(), 'color: green');
	
	for (var i = 0; i < args.length; i++) {
		console.log(args[i]);
	}
	
	console.groupEnd();
};


/**
 * @param {RegExp=} filter
 * @constructor
 */
var EventDebug = function (filter) {
	/**
	 * @type {RegExp}
	 * @private
	 */
	this._filter = filter || DEFAULT_FILTER;

	/**
	 * @type {boolean}
	 * @private
	 */
	this._log = false;

	/**
	 * @private
	 */
	this._logger = DEFAULT_LOGGER;
};


EventDebug.prototype.log = function () {
	this._log = true;
};

/**
 * @param {RegExp} filter
 */
EventDebug.prototype.filter = function (filter) {
	this._filter = filter;
};

/**
 * @param {string} data
 */
EventDebug.prototype.filterStartsWith = function (data) {
	this._filter = new RegExp('^' + data + '.*$');
};

EventDebug.prototype.reset = function () {
	this._filter = DEFAULT_FILTER;
	this._log = false;
};

/**
 * @param {function} logger
 */
EventDebug.prototype.setLogger = function(logger) {
	this._logger = logger;
};

/**
 * @param {Event} event
 * @param {Array} args
 */
EventDebug.prototype.onTrigger = function(event, args) {
	if (!this._log || !this._filter.test(event.name())) {
		return;
	}
	
	this._logger(event, args)
};


module.exports = EventDebug;