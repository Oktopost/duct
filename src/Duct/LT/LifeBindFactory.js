namespace('Duct.LT', function (root)
{
	var array	= root.Plankton.array;
	var foreach	= root.Plankton.foreach;
	
	var Singleton	= root.Classy.Singleton;
	var classify	= root.Classy.classify;
	
	var LifeBind	= root.Duct.LT.LifeBind;
	
	
	/**
	 * @class {Duct.LT.LifeBindFactory}
	 * @alias {LifeBindFactory}
	 * 
	 * @property {function(): LifeBindFactory} instance
	 * 
	 * @constructor
	 */
	function LifeBindFactory()
	{
		this._builders = [];
		
		classify(this);
	}
	
	
	LifeBindFactory.prototype.addBuilder = function (builder)
	{
		this._builders = this._builders.concat(array(builder));
	};
	
	LifeBindFactory.prototype.get = function (element)
	{
		if (element instanceof LifeBind)
			return element;
		
		var result = undefined;
		
		foreach (this._builders, function (builder) 
		{
			result = builder(element);
			
			if (result instanceof LifeBind)
				return false;
		});
		
		if (!(result instanceof LifeBind))
		{
			throw new Error('Could not convert object to LifeBind type');
		}
		
		return result;
	};
	
	
	this.LifeBindFactory = Singleton(LifeBindFactory);
});