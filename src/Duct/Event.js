namespace('Duct', function (root)
{
	var EventDebug = root.Duct.Debug.EventDebug;
	
	var func	= root.Plankton.func;
	var foreach	= root.Plankton.foreach;
	
	
	/**
	 * @template T
	 * 
	 * @constructor
	 * @class Duct.Event
	 * 
	 * @property {Array<T>} _callbacks
	 * @property {string} _name
	 * @property {function(err)} _errorHandler
	 * 
	 * @param {string} name
	 * @param {EventDebug=} debug
	 */
	function Event(name, debug)
	{
		this._callbacks	= [];
		this._name		= name || '';
		this._debug		= debug || Event.DEFAULT_DEBUG;
		
		
		this._errorHandler = function(err)
		{
			console.error('Error when executing event ' + this._name, err);
		};
	}
	
	
	/**
	 * @param {Function} callback
	 * @param {Array} callbackArgs
	 * @private
	 */
	Event.prototype._triggerCallback = function (callback, callbackArgs)
	{
		var wrappedCallback = func.safe(callback, this._errorHandler);
		wrappedCallback = func.async(wrappedCallback); 
		wrappedCallback.apply(null, callbackArgs);
	};
	
	
	/**
	 * @returns {string}
	 */
	Event.prototype.name = function ()
	{
		return this._name;
	};
	
	/**
	 * @param {function(err)} handler
	 */
	Event.prototype.setErrorHandler = function (handler)
	{
		this._errorHandler = handler;
	};
	
	Event.prototype.clear = function()
	{
		this._callbacks = [];
	};
	
	/**
	 * @template T
	 * @param {T} callback
	 * @return {Event}
	 */
	Event.prototype.add = function (callback)
	{
		this._callbacks.push(callback);
		return this;
	};
	
	/**
	 * @template T
	 * @param {T} callback
	 * @return {Event}
	 */
	Event.prototype.remove = function (callback)
	{
		var index = this._callbacks.indexOf(callback);
		
		if (index >= 0)
		{
			this._callbacks.splice(index, 1);
		}
		
		return this;
	};
	
	/**
	 * @returns {Number}
	 */
	Event.prototype.count = function count()
	{
		return this._callbacks.length;
	};
	
	/**
	 * @template T
	 * @type T
	 */
	Event.prototype.trigger = function()
	{
		var callbackArgs = [].slice.apply(arguments);
		var self = this;
		
		this._debug.onTrigger(this, callbackArgs);
		
		func.async.do(
			function() 
			{
				foreach(self._callbacks, function(callback)
				{
					self._triggerCallback(callback, callbackArgs);
				});
			});
	};
	
	
	Event.DEFAULT_DEBUG = new EventDebug();
	
	
	this.Event = Event;
});