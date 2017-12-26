namespace('Duct', function (root)
{
	var Trigger			= root.Duct.Trigger;
	var Listener		= root.Duct.Listener;
	var EventDebug		= root.Duct.Debug.EventDebug;
	var LifeBindFactory	= root.Duct.LT.LifeBindFactory;
	
	var is			= root.Plankton.is;
	var func		= root.Plankton.func;
	var foreach		= root.Plankton.foreach;
	
	var classify	= root.Classy.classify;
	
	
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
	 * @param {string=} name
	 * @param {EventDebug=} debug
	 */
	function Event(name, debug)
	{
		classify(this);
		
		this._callbacks	= [];
		this._name		= name || '';
		this._debug		= debug || Event.DEFAULT_DEBUG;
		this._trigger	= this._defaultTrigger;
		this._listener	= new Listener(this);
		
		this._errorHandler = function(err)
		{
			console.error('Error when executing event ' + this._name, err);
		};
	}
	
	
	/**
	 * 
	 * @param {array} callbacks
	 * @param {array} callbackArgs
	 * @private
	 */
	Event.prototype._defaultTrigger = function (callbacks, callbackArgs)
	{
		foreach(callbacks, this, function(callback)
		{
			this._triggerCallback(callback, callbackArgs);
		});
	};
	
	/**
	 * @param {Function} callback
	 * @param {Array} callbackArgs
	 * @private
	 */
	Event.prototype._triggerCallback = function (callback, callbackArgs)
	{
		if (this._callbacks === null) return;
		
		var wrappedCallback = func.safe(callback, this._errorHandler); 
		wrappedCallback.apply(null, callbackArgs);
	};
	
	/**
	 * @param {callback} original
	 * @param {callback} bound
	 * @private
	 */
	Event.prototype._onUnbindLT = function (original, bound)
	{
		this.remove(bound);
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
	
	Event.prototype.clear = function ()
	{
		if (this._callbacks !== null)
			this._callbacks = [];
	};
	
	/**
	 * @template T
	 * @param {T|*} item
	 * @param {T=undefined} callback
	 * @return {Event}
	 */
	Event.prototype.add = function (item, callback)
	{
		if (this._callbacks === null) return this;
		
		if (is.function(callback))
		{
			var lt = LifeBindFactory.instance().get(item);
			var bound = lt.bindToLife(callback, this._onUnbindLT);
			this._callbacks.push(bound);
		}
		else 
		{
			this._callbacks.push(item);
		}
		
		return this;
	};
	
	/**
	 * @template T
	 * @param {T|*} item
	 * @param {T=undefined} callback
	 * @return {Event}
	 */
	Event.prototype.remove = function (item, callback)
	{
		if (this._callbacks === null) return this;
		
		if (is.function(callback))
		{
			LifeBindFactory.instance().get(item).unbind(callback);
			return this;
		}
		
		var index = this._callbacks.indexOf(item);
		
		if (index >= 0)
		{
			this._callbacks.splice(index, 1);
		}
		
		return this;
	};
	
	/**
	 * @returns {Number}
	 */
	Event.prototype.count = function ()
	{
		return this._callbacks.length;
	};
	
	/**
	 * @template T
	 * @type T
	 */
	Event.prototype.trigger = function()
	{
		if (this._callbacks === null) return this;
		
		var callbackArgs = [].slice.apply(arguments);
		
		this._debug.onTrigger(this, callbackArgs);
		this._trigger(this._callbacks.concat(), callbackArgs);
	};
	
	/**
	 * @param {Function} triggerCallback
	 */
	Event.prototype.addTrigger = function (triggerCallback)
	{
		var next = this._trigger;
		this._trigger = function (callbacks, args) { triggerCallback(callbacks, args, next); };
	};
	
	/**
	 * @param {boolean=false} triggerOnly If true, only the trigger called asynchonisuly, but all of the handlers,
	 * called one after another.
	 */
	Event.prototype.async = function (triggerOnly)
	{
		if (triggerOnly === true)
			this.addTrigger(Trigger.asyncTrigger);
		else
			this.addTrigger(Trigger.asyncHandle);
	};
	
	/**
	 * @return {boolean}
	 */
	Event.prototype.isDestroyed = function ()
	{
		return this._callbacks === null;
	};
	
	Event.prototype.destroy = function ()
	{
		this._callbacks = null;
	};
	
	/**
	 * @template T
	 * @param {T|*=} item
	 * @param {T=undefined} callback
	 * @return {Listener}
	 */
	Event.prototype.listener = function(item, callback)
	{
		if (is(item))
			this._listener.add(item, callback);
		
		return this._listener;
	};
	
	
	/**
	 * @param eventName
	 * @return {function(*, *=undefined): Listener}
	 */
	Event.createListener = function (eventName)
	{
		return function (item, callback)
		{
			return this[eventName].listener(item, callback);
		};
	};
	
	
	Event.DEFAULT_DEBUG = new EventDebug();
	
	
	this.Event = Event;
});