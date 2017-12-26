namespace('Duct', function (window)
{
	var is			= window.Plankton.is;
	var foreach		= window.Plankton.foreach;
	var classify	= window.Classy.classify;
	
	var Event			= window.Duct.Event;
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
		this._lt	= new LifeTime();
		
		this._parent	= null;
		this._children	= [];
		this._subject	= subject;
		
		this._onDestroy			= new Event();
		this._onChildDestroy	= new Event();
		this._onChildAttached	= new Event();
		this._onChildDetached	= new Event();
		this._onAttached		= new Event();
		this._onDetached		= new Event();
		
		classify(this);
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
	
	LifeTimeNode.prototype.subject = function ()
	{
		return this._subject;
	};
	
	LifeTimeNode.prototype.destroy = function ()
	{
		if (this.isDestroyed())
			return;
		
		this._lt.kill();
		this.detach();
		this._onDestroy.trigger(this);
	};
	
	LifeTimeNode.prototype.destroyTree = function ()
	{
		var root = this.root();
		
		root = root || this;
		root.destroy();
	};
	
	
	LifeTimeNode._detach = function (parent, child)
	{
		if (!is(parent))
			return;
		
		parent._onChildDetached(parent, child);
		child._onDetached(parent, child);
	};
	
	LifeTimeNode._attach = function (parent, child)
	{
		if (!is(parent) || LifeTimeNode.isAnyDestroyed(parent, child))
			return;
		
		parent._onChildAttached(parent, child);
	};
	
	/**
	 * @param {LifeTimeNode} child
	 */
	LifeTimeNode.prototype.attachChild = function (child)
	{
		LifeTimeNode._attach(this, child);
	};
	
	LifeTimeNode.prototype.detachChild = function (child)
	{
		LifeTimeNode._detach(this, child);
	};
	
	LifeTimeNode.prototype.attach = function (parent)
	{
		LifeTimeNode._attach(parent, this);
	};
	
	LifeTimeNode.prototype.detach = function ()
	{
		LifeTimeNode._detach(this._parent, this);
	};
	
	LifeTimeNode.prototype.createChild = function (subject)
	{
		var child = new LifeTimeNode(subject);
		
		if (this.isDestroyed())
		{
			child.destroy();
			return child;
		}
		
		this.attachChild(child);
	};
	
	
	LifeTimeNode.prototype.onDestroy = Event.createListener('_onDestroy');
	LifeTimeNode.prototype.onAttached = Event.createListener('_onAttached');
	LifeTimeNode.prototype.onDetached = Event.createListener('_onDetached');
	LifeTimeNode.prototype.onChildDestroy = Event.createListener('_onChildAttached');
	LifeTimeNode.prototype.onChildAttached = Event.createListener('_onChildAttached');
	LifeTimeNode.prototype.onChildDetached = Event.createListener('_onChildDetached');
	
	
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