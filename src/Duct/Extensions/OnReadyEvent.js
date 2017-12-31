namespace('Duct.Extensions', function (root)
{
	var Event			= root.Duct.Event;
	var LifeBindFactory	= root.Duct.LT.LifeBindFactory;
	
	var classify	= root.Classy.classify;
	var inherit		= root.Classy.inherit;
	var is			= root.Plankton.is;
	var func		= root.Plankton.func;
	
	
	var OnReadyEvent = function (name, debug)
	{
		Event.call(this, name, debug);
		
		classify(this);
		
		this._isTriggered = false;
	};
	
	inherit(OnReadyEvent, Event);
	
	
	OnReadyEvent.prototype.isTriggered = function ()
	{
		return this._isTriggered;
	};
	
	OnReadyEvent.prototype.add = function (item, callback)
	{
		if (this.isDestroyed()) return this;
					
		if (is.function(callback))
		{
			var lt = LifeBindFactory.instance().get(item);
			callback = lt.bindToLife(callback, this._onUnbindLT);
		}
		else
		{
			callback = item;
		}
		
		if (is.true(this._isTriggered))
		{
			(func.async(callback))();
		}
		else
		{
			this._callbacks.push(callback);
		}

		return this;
	};
	
	OnReadyEvent.prototype.trigger = function ()
	{
		if (this.isDestroyed()) return this;
		
		var callbackArgs = [].slice.apply(arguments);
		
		this._isTriggered = true;
		this._debug.onTrigger(this, callbackArgs);
		this._trigger(this._callbacks.concat(), callbackArgs);
		
		this.clear();
	};
	
	
	this.OnReadyEvent = OnReadyEvent;
});