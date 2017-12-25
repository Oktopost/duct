namespace('Duct', function (window)
{
	var is			= window.Plankton.is;
	var foreach		= window.Plankton.foreach;
	
	var LifeTime		= window.Duct.LifeTime;
	var LifeBindFactory	= window.Duct.LT.LifeBindFactory;
	
	
	/**
	 * @property {LifeTimeNode}		_parent
	 * @property {LifeTimeNode[]}	_children
	 * 
	 * @constructor
	 */
	function LifeTimeNode(subject)
	{
		this._lt		= new LifeTime();
		
		this._parent	= null;
		this._children	= [];
		this._subject	= subject;
	}
	
	
	/**
	 * @return {LifeTimeNode|null}
	 */
	LifeTimeNode.prototype.parent = function ()
	{
		return this._parent;
	};
	
	LifeTimeNode.prototype.hasParent = function ()
	{
		return this._parent !== null;
	};
	
	LifeTimeNode.prototype.root = function ()
	{
		return (this._parent ?
			this._parent.parent() || this._parent :
			null);
	};
	
	LifeTimeNode.prototype.children = function ()
	{
		return this._children;
	};
	
	LifeTimeNode.prototype.hasChildren = function ()
	{
		return is(this._children);
	};
	
	LifeTimeNode.prototype.LT = function ()
	{
		return this._lt;
	};
	
	LifeTimeNode.prototype.isAlive = function ()
	{
		return this._lt.isAlive();
	};
	
	LifeTimeNode.prototype.isDestroyed = function ()
	{
		return this._lt.isDead();
	};
	
	LifeTimeNode.prototype.destroy = function ()
	{
		if (this.isDestroyed())
			return;
		
		this._lt.kill();
		this._children = [];
		this.detach()
	};
	
	LifeTimeNode.prototype.destroyTree = function ()
	{
		var root = this.root();
		
		root = root || this;
		root.destroy();
	};
	
	LifeTimeNode.prototype.subject = function ()
	{
		return this._subject;
	};
	
	/**
	 * @param {LifeTimeNode} child
	 */
	LifeTimeNode.prototype.attachChild = function (child)
	{
		if (LifeTimeNode.isAnyDestroyed(child, this)) return;
		
		if (child.hasParent())
			child.detach();
		
		// TODO: Attach to here.
	};
	
	LifeTimeNode.prototype.detachChild = function (child)
	{
		if (LifeTimeNode.isAnyDestroyed(child, this)) return;
		
		var index = this._children.indexOf(child);
		
		if (index === -1)
			return;
		
		// TODO: Detach
	};
	
	LifeTimeNode.prototype.attach = function (parent)
	{
		if (LifeTimeNode.isAnyDestroyed(child, this)) return;
		
		if (is(this._parent))
			this._parent.detachChild(this);
		
		parent.attachChild(this);
	};
	
	LifeTimeNode.prototype.detach = function ()
	{
		if (LifeTimeNode.isAnyDestroyed(child, this)) return;
		
		if (is(this._parent))
			this._parent.detachChild(this);
	};
	
	/**
	 * 
	 * @return 
	 */
	LifeTimeNode.prototype.createChild = function (subject)
	{
		var child = new LifeTimeNode(subject);
		
		if (this.isDestroyed()) return child;
		
		this.attachChild(child);
	};
	
	
	LifeTimeNode.isAnyDestroyed = function ()
	{
		var res = false;
		
		foreach(arguments, function (node) 
		{
			if (node.isDestroyed())
			{
				res = true;
				return false;
			}
		});
		
		return res;
	};
	
	
	LifeBindFactory.instance().addBuilder(function (item)
	{
		if (item instanceof LifeTimeNode)
			return item.LT();
	});
	
	
	this.LifeTimeNode = LifeTimeNode;
});