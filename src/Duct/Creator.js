namespace('Duct', function (root)
{
	var Event		= root.Duct.Event;
	var Listener	= root.Duct.Listener;
	
	var is = root.Plankton.is;
	
	
	/**
	 * @class Duct.Creator
	 */
	var Creator = {
		
		/**
		 * @static
		 * @param {Event} event
		 * @return {function()}
		 */
		emptyTrigger: function (event)
		{
			return function ()
			{
				event.trigger();
			};
		},
	
		/**
		 * @template T
		 * @static
		 * 
		 * @param {Event<T>} event
		 * @param {T=} callback
		 * @return {Listener<T>}
		 */
		listener: function listener (event, callback)
		{
			if (is(callback))
			{
				event.add(callback);
			}
			
			return new Listener(event);
		},
		
		/**
		 * @template <T>
		 * @static
		 * 
		 * @param {*} target
		 * @param {string} name
		 * @param {string=} moduleName
		 * @return {Event<T>}
		 */
		registerEmptyEvent: function event(target, name, moduleName)
		{
			var fullName = name;
			var eventName = name;
			var invokeName = 'trigger' + name.charAt(0).toUpperCase() + name.slice(1);
			var event;
			
			if (is(moduleName))
			{
				fullName = moduleName + '.' + name;
			}
			
			event = new Event(fullName);
			
			target[eventName] = function(callback)
			{ 
				return Creator.listener(event, callback); 
			};
			
			target[invokeName] = function()
			{
				var args = Array.prototype.slice.call(arguments);
				event.trigger.apply(event, args);
			};
			
			return event;
		}
	};
	
	
	this.Creator = Creator;
});