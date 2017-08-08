namespace('Duct.LT', function (root)
{
	var is			= root.Plankton.is;
	var func		= root.Plankton.func;
	var foreach		= root.Plankton.foreach;
	var classify	= root.Classy.classify;
	
	
	function LifeBind()
	{
		this._original	= [];
		this._boundData	= [];
		this._isAlive	= true;
		
		classify(this);
	}
	
	
	LifeBind.prototype._invokeUnbind = function (callback, original, bound)
	{
		if (bound.__DUCT_ORIGINAL_CALLBACK__ !== original)
			return;
		
		delete bound.__DUCT_ORIGINAL_CALLBACK__;
		callback(original, bound);
	};
	
	LifeBind.prototype._invokeUnbinds = function (original, boundData)
	{
		foreach(boundData, function (item) 
			{
				this._invokeUnbind(item[0], original, item[1]);
			},
			this);
	};
	
	LifeBind.prototype._createCallback = function (callback)
	{
		var self = this;
		
		return function ()
		{
			if (!self._isAlive)
				return;
			
			var result = callback.call(this, arguments);
			
			if (result === false)
			{
				self.unbind(callback);
			}
			else if (result === null)
			{
				self.kill();
			}
		};
	};
	
	LifeBind.prototype._add = function (callback, original, bound)
	{
		var index = this._original.indexOf(callback);
		
		if (index === -1)
		{
			this._original.push(original);
			this._boundData.push([ [ callback, bound ] ]);
		}
		else
		{
			this._boundData[index].push([ callback, bound ]);
		}
	};
	
	
	LifeBind.prototype.bindToLife = function (callback, onDestroy)
	{
		if (!this._isAlive)
		{
			func.async.do(function () { onDestroy(callback); });
			return;
		}
		
		var self = this;
		var boundCallback = this._createCallback();
		
		boundCallback.__DUCT_ORIGINAL_CALLBACK__ = callback;
		
		if (!this._isAlive)
		{
			func.async.do(function ()
			{
				self._invokeUnbind(onDestroy, callback, boundCallback);
			});
		}
		else
		{
			this._add(onDestroy, callback, boundCallback);
		}
	};
	
	LifeBind.prototype.unbind = function (callback)
	{
		if (is.function(callback.__DUCT_ORIGINAL_CALLBACK__))
		{
			this.unbind(callback.__DUCT_ORIGINAL_CALLBACK__);
			return;
		}
		
		var boundData;
		var index = this._original.indexOf(callback);
		
		if (index === -1) return;
		
		boundData = this._boundData.splice(index, 1);
		this._original.splice(index, 1);
		this._invokeUnbinds(callback, boundData)
	};
	
	LifeBind.prototype.clear = function ()
	{
		var original	= this._original;
		var boundData 	= this._boundData;
		var count		= boundData.length;
		
		this._original	= [];
		this._boundData	= [];
		
		for (var i = 0; i < count; i++)
		{
			this._invokeUnbinds(original[i], boundData[i]);
		}
	};
	
	LifeBind.prototype.kill = function ()
	{
		if (!this._isAlive) return;
		
		this._isAlive = false;
		this.clear();
	};
	
	LifeBind.prototype.isAlive = function ()
	{
		return this._isAlive;
	};
	
	LifeBind.prototype.isDead = function ()
	{
		return !this._isAlive;
	};
	
	
	this.LifeBind = LifeBind;
});