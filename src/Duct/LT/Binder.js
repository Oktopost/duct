namespace('Duct.LT', function (root)
{
	var is			= root.Plankton.is;
	var foreach		= root.Plankton.foreach;
	var LifeBind	= root.Duct.LT.LifeBind;

	
	var Binder = {
		
		ATTACHMENT_KEY: '__LT__',
		
		/**
		 * @param {object} target
		 * @param {LifeBind} lt
		 * @param {RegExp=} filter
		 */
		attach: function (target, lt, filter)
		{
			filter = filter || /^_handle.+/;
			
			foreach.pair(target, function (name, value)
			{
				if (filter.test(name))
				{
					value[Binder.ATTACHMENT_KEY] = lt;
				}
			});
		},
		
		/** 
		 * @param {*} callback
		 * @return {boolean}
		 */
		isBinded: function (callback)
		{
			if (!is.function(callback) || !is(callback[Binder.ATTACHMENT_KEY]))
				return false;
			
			return (callback[Binder.ATTACHMENT_KEY] instanceof LifeBind);
		},
		
		/**
		 * @param {*} callback
		 * @return {LifeBind|null}
		 */
		get: function (callback)
		{
			return (Binder.isBinded(callback) ? 
				callback[Binder.ATTACHMENT_KEY] : 
				null);
		},
		
		/**
		 * @param {function} callback
		 * @return {function}
		 */
		getBinded: function (callback)
		{
			var lt = Binder.get(callback);
			return (is(lt) ? lt.bindToLife(callback) : callback);
		}
	};
	
	
	this.Binder = Binder;
});