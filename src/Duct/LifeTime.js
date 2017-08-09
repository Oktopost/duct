namespace('Duct', function (root)
{
	var inherit		= root.Classy.inherit;
	var classify	= root.Classy.classify;
	var func		= root.Plankton.func;
	
	var Event		= root.Duct.Event; 
	var Listener	= root.Duct.Listener;
	var LifeBind	= root.Duct.LT.LifeBind;
	
	
	function LifeTime(name)
	{
		this._name		= name || 'Lifetime';
		this._onKill 	= this._createEvent();
		
		classify(this);
	}
	
	
	inherit(LifeTime, LifeBind);
	
	
	LifeTime.prototype._createEvent = function ()
	{
		return new Event('Destroy ' + this._name + ' Event');
	};
	
	LifeTime.prototype._createTmpEvent = function ()
	{
		var self = this;
		var tmpEvent = this._createEvent();
		
		func.async.do(function () { tmpEvent.trigger(self); });
		
		return tmpEvent;
	};
	
	LifeTime.prototype._invokeOnKill = function ()
	{
		var event = this._onKill;
		
		this._onKill = this._createEvent();
		event.trigger(this);
	};
	

	/**
	 * @param {function(LifeTime)} callback
	 * @return {Duct.Listener}
	 */
	LifeTime.prototype.onKill = function (callback)
	{
		var listener;
		
		if (this.isDead())
		{
			listener = new Listener(this._createTmpEvent());
		}
		else	
		{
			listener = new Listener(this._onKill);
		}
		
		if (callback)
			listener.add(callback);
		
		return listener;
	};
	
	LifeTime.prototype.clear = function ()
	{
		this._invokeOnKill();
		LifeBind.clear.call(this);
	};
	
	LifeTime.prototype.kill = function ()
	{
		if (this.isDead()) return;
		
		this._invokeOnKill();
		
		LifeBind.kill.call(this);
	};
	
	
	this.LifeTime = LifeTime;
});