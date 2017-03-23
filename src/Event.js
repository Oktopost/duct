"use strict";


var func	= require('oktopost-plankton').func;
var array	= require('oktopost-plankton').array;

var classify = require('./Classy').classify;


/**
 * @param {string=} name
 * @return {Event}
 */
function Event(name) {
	
	/**
	 * @type {[Function]}
	 * @private
	 */
	var _callbacks = [];

	/**
	 * @type {string|null}
	 * @private
	 */
	var _name = name || null;

	/**
	 * @type {function(err)}
	 * @private
	 */
	var _errorHandler = _handleError;


	/**
	 * @param {*} err
	 * @private
	 */
	function _handleError(err) {
		console.error('Failed to execute callback for event ' + (_name || ''), err);
	}
	
	/**
	 * @param {Function} callback
	 * @param {Array} callbackArgs
	 * @private
	 */
	function _invokeCallback(callback, callbackArgs) {
		var wrappedCallback = func.safe(callback, _errorHandler);
		wrappedCallback = func.async(wrappedCallback); 
		wrappedCallback.apply(null, callbackArgs);
	}


	/**
	 * @name Event
	 * @alias OktopostJS.duct.Event
	 * @property {String} a
	 */
	function event() {
		var callbackArgs = [].slice.apply(arguments);
		
		setTimeout(function() {
			array.forEach(_callbacks, function (callback) {
				_invokeCallback(callback, callbackArgs);
			});
		}, 0);
	}
	

	/**
	 * @param {Function} callback
	 * @return {event}
	 */
	event.add = function add(callback) {
		_callbacks.push(callback);
		return event;
	};

	/**
	 * @param {Function} callback
	 * @return {event}
	 */
	event.rem = function rem(callback) {
		var index = _callbacks.indexOf(callback);
		
		if (index >= 0) {
			_callbacks.splice(index, 1);
		}
		
		return event;
	};

	/**
	 * @return {Number}
	 */
	event.count = function count() {
		return _callbacks.length;
	};

	/**
	 * @param {function(handler)} handler
	 * @return {event}
	 */
	event.setErrorHandler = function setErrorHandler(handler) {
		_handleError = handler;
		return event;
	};
	
	
	classify(event);
	return event;
}


module.exports = Event;