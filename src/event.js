"use strict";


var is		= require('oktopost-plankton').is;
var func	= require('oktopost-plankton').func;
var array	= require('oktopost-plankton').array;


/**
 * @param {string|undefined} name
 * @return {function(this:event)}
 * @constructor
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
	 * @typedef event
	 */
	function event() {
		var callbackArgs = [].slice.apply(arguments);
		
		array.forEach(_callbacks, function (callback) {
			_invokeCallback(callback, callbackArgs);
		});
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
	 * @param {function(err)} handler
	 * @return {event}
	 */
	event.setErrorHandler = function setErrorHandler(handler) {
		_handleError = handler;
		return event;
	};
	
	
	return event;
}


module.exports = Event;