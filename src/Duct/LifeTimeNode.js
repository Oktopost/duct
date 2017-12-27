namespace('Duct', function (root)
{
	var is			= root.Plankton.is;
	var foreach		= root.Plankton.foreach;
	var classify	= root.Classy.classify;
	
	var Event			= root.Duct.Event;
	var LifeTime		= root.Duct.LifeTime;
	var LifeBindFactory	= root.Duct.LT.LifeBindFactory;
	
	
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
	

	LifeTimeNode._detach = function (parent, child)
	{
		if (!is(parent) || !is(child))
			return;
		
		if (!is(parent._removeChild(child)))
			return;
		
		child._parent = null;

		parent._onChildDetached.trigger(parent, child);
		child._onDetached.trigger(parent, child);
	};

	LifeTimeNode._attach = function (parent, child)
	{
		if (!is(parent) || !is(child) || LifeTimeNode.isAnyDestroyed(parent, child))
			return;
		
		if (!is(parent._addChild(child)))
			return;
		
		child._parent = parent;

		parent._onChildAttached.trigger(parent, child);
		child._onAttached.trigger(parent, child);
	};
	
	LifeTimeNode._destroy = function (node)
	{
		if (node.isDestroyed())
			return;
		
		if (is(node.hasChildren()))
		{
			var children = node.children().slice();
			foreach(children, function (child)
			{
				child.destroy();
				node._onChildDestroy.trigger(node, child);
			});
		}
		
		node._lt.kill();
		node.detach();
		
		node._onDestroy.trigger(this);
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

	
	LifeTimeNode.prototype._removeChild = function (child)
	{
		var index = this._children.indexOf(child);
		
		if (index > -1)
		{
			this._children.splice(index, 1);
			return true;
		}
		
		return false;
	};
	
	LifeTimeNode.prototype._addChild = function (child)
	{
		var index = this._children.indexOf(child);

		if (index === -1)
		{
			this._children.push(child);
			return true;
		}
		
		return false;
	};
	
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
		LifeTimeNode._destroy(this);
	};
	
	LifeTimeNode.prototype.destroyTree = function ()
	{
		var root = this.root();
		
		root = root || this;
		root.destroy();
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
		
		return child;
	};
	
	
	LifeTimeNode.prototype.onDestroy = Event.createListener('_onDestroy');
	LifeTimeNode.prototype.onAttached = Event.createListener('_onAttached');
	LifeTimeNode.prototype.onDetached = Event.createListener('_onDetached');
	LifeTimeNode.prototype.onChildDestroy = Event.createListener('_onChildDestroy');
	LifeTimeNode.prototype.onChildAttached = Event.createListener('_onChildAttached');
	LifeTimeNode.prototype.onChildDetached = Event.createListener('_onChildDetached');
	
	
	LifeBindFactory.instance().addBuilder(function (item)
	{
		if (item instanceof LifeTimeNode)
			return item.LT();
	});
	
	
	this.LifeTimeNode = LifeTimeNode;
});