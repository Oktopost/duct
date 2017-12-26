namespace('Duct.Extensions', function (root)
{
	var Event		= root.Duct.Event;
	var classify	= root.Classy.classify;
	var is			= root.Plankton.is;
	var func		= root.Plankton.func;
	
	
	var OnReadyEvent = function (eventName)
	{
		classify(this);
		
		this._result	= false;
		this._event		= new Event(eventName);
	};
	
	
	OnReadyEvent.prototype.getEvent = function ()
	{
		return this._event;
	};
	
	OnReadyEvent.prototype.isTriggered = function ()
	{
		return this._result;
	};
	
	OnReadyEvent.prototype.add = function (lt, callback)
	{
		if (is.true(this._result))
		{
			(func.async(lt.bindToLife(callback)))();
			return;
		}
		
		this._event.add(lt, callback);
	};
	
	OnReadyEvent.prototype.trigger = function ()
	{
		this._result = true;
		this._event.trigger();
		this._event = null;
	};
	
	
	this.OnReadyEvent = OnReadyEvent;
});