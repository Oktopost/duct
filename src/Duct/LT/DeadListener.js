namespace('Duct.LT', function (root)
{
	var func = root.Plankton.func;
	var foreach = root.Plankton.foreach;
	var classify = root.Classy.classify;
	
	
	/**
	 * @class {Duct.LT.DeadListener}
	 * @alias {DeadListener}
	 * 
	 * @param {array=} params
	 * @constructor
	 */
	function DeadListener(params)
	{
		this._params	= params || [];
		this._callbacks = [];
		
		classify(this);
	}
	
	
	DeadListener.prototype._invoke = function ()
	{
		var callbacks = this._callbacks;
		var params = this._params;
		
		this._callbacks = [];
		
		foreach (callbacks, function (callback)
		{
			callback = func.silent(callback);
			callback.apply(null, params);
		});
	};
	
	DeadListener.prototype._invokeAsync = function () 
	{
		func.async.do(this._invoke);
	};
	
	DeadListener.prototype.add = function (callback)
	{
		this._callbacks.push(callback);
		this._invokeAsync();
		return this;
	};
	
	DeadListener.prototype.remove = function (callback)
	{
		var index = this._callbacks.indexOf(callback);
		
		if (index !== -1)
			this._callbacks.splice(index, 1);
			
		return this;
	};
	
	
	this.DeadListener = DeadListener;
});