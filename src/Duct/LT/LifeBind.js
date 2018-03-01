namespace('Duct.LT', function (root)
{
	var classify	= root.Classy.classify;
	
	var is			= root.Plankton.is;
	var func		= root.Plankton.func;
	var foreach		= root.Plankton.foreach;
	
	
	/**
	 * @class {Duct.LT.LifeBind}
	 * @alias {LifeBind}
	 * 
	 * @constructor
	 */
	function LifeBind()
	{
		this._original	= [];
		this._boundData	= [];
		this._isAlive	= true;
		
		classify(this);
	}
	
	
	LifeBind.prototype._invokeUnbind = function (onDestroy, original, bound)
	{
		delete bound.__DUCT_ORIGINAL_CALLBACK__;
		onDestroy(original, bound);
	};	
	
	LifeBind.prototype._invokeUnbinds = function (original, boundData)
	{
		foreach(boundData, this, function (item) 
		{
			this._invokeUnbind(item[0], original, item[1]);
		});
	};
	
	LifeBind.prototype._createCallback = function (callback)
	{
		var self = this;
		var selfUnbound = false;
		
		return function ()
		{
			if (!self._isAlive)
				return;
			else if (selfUnbound)
				return;
			
			var result = callback.apply(this, arguments);
			
			if (result === false)
			{
				selfUnbound = true;
				self.unbind(callback);
			}
			else if (result === null)
			{
				self.kill();
			}
		};
	};
	
	LifeBind.prototype._add = function (onDestroy, callback, bound)
	{
		var index = this._original.indexOf(callback);
		
		if (index === -1)
		{
			this._original.push(callback);
			this._boundData.push([ [ onDestroy, bound ] ]);
		}
		else
		{
			this._boundData[index].push([ onDestroy, bound ]);
		}
	};
	
	
	/**
	 * @param {function} callback
	 * @param {function(Function, Function)=} onDestroy
	 */
	LifeBind.prototype.bindToLife = function (callback, onDestroy)
	{
		onDestroy = onDestroy || function() {};
		
		var self = this;
		var boundCallback = this._createCallback(callback);
		
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
		
		return boundCallback;
	};

	/**
	 * @param {function} callback
	 */
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
		
		boundData = (this._boundData.splice(index, 1))[0];
		
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

	/**
	 * @return {boolean}
	 */
	LifeBind.prototype.isAlive = function ()
	{
		return this._isAlive;
	};

	/**
	 * @return {boolean}
	 */
	LifeBind.prototype.isDead = function ()
	{
		return !this._isAlive;
	};
	
	
	this.LifeBind = LifeBind;
});