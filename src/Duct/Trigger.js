namespace('Duct', function (root)
{
	var func		= root.Plankton.func;
	var foreach		= root.Plankton.foreach;
	
	
	/**
	 * @name {Duct.Trigger}
	 * @alias {Trigger}
	 */
	var Trigger = {
		
		asyncHandle: function (callbacks, args, next)
		{
			foreach(callbacks, function(callback)
			{
				func.async.do(function() 
				{
					next([callback], args);
				});
			});
		},
		
		asyncTrigger: function (callbacks, args, next)
		{
			func.async.do(function() 
			{
				next(callbacks, args);
			});
		},
		
	};
	
	
	this.Trigger = Trigger;
});