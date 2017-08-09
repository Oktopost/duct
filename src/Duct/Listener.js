namespace('Duct', function (root)
{
	var classify = root.Classy.classify;
	
	
	/**
	 * @template T
	 * 
	 * @constructor
	 * @class Duct.Listener
	 * 
	 * @param {Event<T>} event
	 * 
	 * @property {Event<T>} _event
	 */
	function Listener(event)
	{
		this._event = event;
		
		classify(this);
	}
	
	
	/**
	 * @template T
	 * @param {T|*} target
	 * @param {T=} callback
	 * @return {Listener<T>}
	 */
	Listener.prototype.add = function (target, callback)
	{
		this._event.add(target, callback);
		return this;
	};
	
	/**
	 * @template T
	 * @param {T|*} target
	 * @param {T=} callback
	 * @return {Listener<T>}
	 */
	Listener.prototype.remove = function (target, callback)
	{
		this._event.remove(target, callback);
		return this;
	};
	
	
	this.Listener = Listener;
});