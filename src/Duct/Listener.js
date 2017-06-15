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
	 * @param {T} callback
	 * @return {Listener<T>}
	 */
	Listener.prototype.add = function (callback)
	{
		this._event.add(callback);
		return this;
	};
	
	/**
	 * @template T
	 * @param {T} callback
	 * @return {Listener<T>}
	 */
	Listener.prototype.remove = function (callback)
	{
		this._event.remove(callback);
		return this;
	};
	
	
	this.Listener = Listener;
});