const root 		= require('../../index');
const assert	= require('chai').assert;

const Duct				= root.Duct;
const LifeTime			= Duct.LifeTime;
const LifeTimeNode		= Duct.LifeTimeNode;



suite('LifeTimeNode', () =>
{
	suite('parent', () =>
	{
		test('No parent, got null', () =>
		{
			var ltNode = new LifeTimeNode('test');
			assert.isNull(ltNode.parent());
		});
		
		test('Has parent, got parent', () => 
		{
			var childNode = new LifeTimeNode('child');
			var parentNode = new LifeTimeNode('parent');
			
			childNode.attach(parentNode);
			assert.instanceOf(childNode.parent(), LifeTimeNode);
		});
	});
	
	suite('hasParent', () =>
	{
		test('No parent, got false', () =>
		{
			var node = new LifeTimeNode('node');
			assert.isFalse(node.hasParent());
		});
		
		test('Has parent, got true', () => 
		{
			var childNode = new LifeTimeNode('child');
			var parentNode = new LifeTimeNode('parent');
			
			childNode.attach(parentNode);
			assert.isTrue(childNode.hasParent());
		});
	});
	
	suite('root', () =>
	{
		test('No parent, got null', () => 
		{
			var node = new LifeTimeNode('node');
			assert.isNull(node.root());
		});
		
		test('One level tree, got self parent', () => 
		{
			var childNode = new LifeTimeNode('child');
			var parentNode = new LifeTimeNode('parent');
			
			childNode.attach(parentNode);
			
			assert.instanceOf(childNode.root(), LifeTimeNode);
			assert.equal(childNode.root(), parentNode);
		});
		
		test('Multiple level tree, got top parent', () =>
		{
			var childNode = new LifeTimeNode('child');
			var parentNode = new LifeTimeNode('parent');
			var rootNode = new LifeTimeNode('root');
			
			childNode.attach(parentNode);
			parentNode.attach(rootNode);
			
			assert.instanceOf(childNode.root(), LifeTimeNode);
			assert.equal(childNode.root(), rootNode);
		})
	});
	
	suite('children', () => 
	{
		test('No children, got empty array', () => 
		{
			var node = new LifeTimeNode('node');
			assert.equal(0, node.children().length);
		});
		
		test('Has children, got array with children', () => 
		{
			var childNode1 = new LifeTimeNode('child1');
			var childNode2 = new LifeTimeNode('child2');
			
			var parentNode = new LifeTimeNode('parent');
			
			childNode1.attach(parentNode);
			childNode2.attach(parentNode);
			
			assert(2, parentNode.children());
			assert.notEqual(-1, parentNode.children().indexOf(childNode1));
			assert.notEqual(-1, parentNode.children().indexOf(childNode2));
		});
	});
	
	suite('hasChildren', () => 
	{
		test('No children, got false', () => 
		{
			var node = new LifeTimeNode('node');
			assert.isFalse(node.hasChildren());
		});
		
		test('Has children, got true', () => 
		{
			var childNode = new LifeTimeNode('child');
			var parentNode = new LifeTimeNode('parent');
			
			childNode.attach(parentNode);
			
			assert.isTrue(parentNode.hasChildren());
		});
	});
	
	suite('LT', () => 
	{
		test('Get instance of LifeTime', () => 
		{
			var node = new LifeTimeNode('node');
			assert.instanceOf(node.LT(), LifeTime);
		});
	});
	
	suite('isAlive', () => 
	{
		test('Node is alive, got true', () => 
		{
			var node = new LifeTimeNode('node');
			assert.isTrue(node.isAlive());
		});
		
		test('Node is destroyed, got false', () => 
		{
			var node = new LifeTimeNode('node');
			node.destroy();
			
			assert.isFalse(node.isAlive());
		});
	});
	
	suite('isDestroyed', () => 
	{
		test('Node is not destroyed, got false', () => 
		{
			var node = new LifeTimeNode('node');
			assert.isFalse(node.isDestroyed());
		});
		
		test('Node is destroyed, got true', () => 
		{
			var node = new LifeTimeNode('node');
			node.destroy();
			
			assert.isTrue(node.isDestroyed());
		});
	});
	
	suite('subject', () => 
	{
		test('Got subject passed to constructor', () => 
		{
			var node = new LifeTimeNode('node');
			assert.equal('node', node.subject());
		});
	});
	
	suite('attach', () =>
	{
		test('Attach child, child attached, events fired', () => 
		{
			var childNode = new LifeTimeNode('childNode');
			var parentNode = new LifeTimeNode('parent');
			
			var isTriggered = false;
			var isChildTriggered = false;
			
			parentNode.onChildAttached(function ()
			{
				isChildTriggered = true;
			});
			
			childNode.onAttached(function ()
			{
				isTriggered = true;
			});
			
			childNode.attach(parentNode);
			
			assert.isTrue(parentNode.hasChildren());
			assert.equal(parentNode, childNode.parent());
			
			assert.equal(childNode, parentNode.children().pop());
			assert.isTrue(isChildTriggered);
			assert.isTrue(isTriggered);
		});
		
		test('Attach already existing child, no child is attached', () =>
		{
			var childNode = new LifeTimeNode('childNode');
			var parentNode = new LifeTimeNode('parent');
			
			var triggeredCount = 0;
			var childTriggeredCount = 0;
			
			parentNode.onChildAttached(function ()
			{
				childTriggeredCount++;
			});
			
			childNode.onAttached(function ()
			{
				triggeredCount++;
			});
			
			childNode.attach(parentNode);
			childNode.attach(parentNode);
			
			assert.isTrue(parentNode.hasChildren());
			assert.equal(parentNode, childNode.parent());
			assert.equal(1, parentNode.children().length);
			assert.equal(1, childTriggeredCount);
			assert.equal(1, triggeredCount);
		});
		
		test('Attach multiple child to same parent, children attached', () => 
		{
			var triggeredCount = 0;
			var childTriggeredCount = 0;
			
			var parentNode = new LifeTimeNode('parent');
			
			var childNode1 = new LifeTimeNode('childNode1');
			var childNode2 = new LifeTimeNode('childNode2');
			
			parentNode.onChildAttached(function ()
			{
				childTriggeredCount++;
			});
			
			childNode1.onAttached(function ()
			{
				triggeredCount++;
			});
			
			childNode2.onAttached(function ()
			{
				triggeredCount++;
			});
			
			childNode1.attach(parentNode);
			childNode2.attach(parentNode);

			assert.equal(parentNode, childNode1.parent());
			assert.equal(parentNode, childNode2.parent());
			assert.equal(2, parentNode.children().length);
			assert.equal(2, triggeredCount);
			assert.equal(2, childTriggeredCount);
		});
		
		test('Attach one root to another, chain is connected and correct', () => 
		{
			var child1 = new LifeTimeNode('child1');
			var parent1 = new LifeTimeNode('parent1');
			
			child1.attach(parent1);
			
			var child2 = new LifeTimeNode('child2');
			var parent2 = new LifeTimeNode('parent2');
			
			child2.attach(parent2);
			
			parent2.attach(parent1);
			
			assert.equal(parent1, child2.root());
			
			assert.equal(parent1, child1.parent());
			assert.equal(parent1, parent2.parent());
			assert.equal(parent2, child2.parent());
		});
		
		test('Attach to destroyed parent, not attached', () => 
		{
			var childNode = new LifeTimeNode('childNode');
			var parentNode = new LifeTimeNode('parent');
			
			var isTriggered = false;
			var isChildTriggered = false;
			
			parentNode.onChildAttached(function ()
			{
				isChildTriggered = true;
			});
			
			childNode.onAttached(function ()
			{
				isTriggered = true;
			});
			
			parentNode.destroy();
			
			childNode.attach(parentNode);
			
			assert.isFalse(parentNode.hasChildren());
			assert.isNull(childNode.parent());
			
			assert.equal(0, parentNode.children().length);
			assert.isFalse(isChildTriggered);
			assert.isFalse(isTriggered);
		});
		
		test('Attach destroyed child, not attached', () => 
		{
			var childNode = new LifeTimeNode('childNode');
			var parentNode = new LifeTimeNode('parent');
			
			var isTriggered = false;
			var isChildTriggered = false;
			
			parentNode.onChildAttached(function ()
			{
				isChildTriggered = true;
			});
			
			childNode.onAttached(function ()
			{
				isTriggered = true;
			});
			
			childNode.destroy();
			
			childNode.attach(parentNode);
			
			assert.isFalse(parentNode.hasChildren());
			assert.isNull(childNode.parent());
			
			assert.equal(0, parentNode.children().length);
			assert.isFalse(isChildTriggered);
			assert.isFalse(isTriggered);
		});
	});
	
	suite('destroy', () => 
	{
		test('Destroy without children, node is destroyed', () => 
		{	
			var hasTriggered = false;
			var hasChildTriggered = false;
			
			var node = new LifeTimeNode('node');
			
			node.onDestroy(function ()
			{
				hasTriggered = true;
			});
			
			node.onChildDestroy(function ()
			{
				hasChildTriggered = true;
			});
			
			node.destroy();
			
			assert.isTrue(node.isDestroyed());
			assert.isFalse(node.isAlive());
			assert.isTrue(hasTriggered);
			assert.isFalse(hasChildTriggered);
		});
		
		test('Destroy with parent, node is destroyed, parent detached', () => 
		{	
			var childNode = new LifeTimeNode('childNode');
			var parentNode = new LifeTimeNode('parent');
			
			childNode.attach(parentNode);
			childNode.destroy();
			
			assert.isTrue(childNode.isDestroyed());
			assert.isTrue(parentNode.isAlive());
			
			assert.isNull(childNode.parent());
			assert.isFalse(parentNode.hasChildren());
		});
		
		test('Destroy with children, children destroyed', () => 
		{
			var parentNode = new LifeTimeNode('parent');
			var childNode1 = new LifeTimeNode('childNode1');
			var childNode2 = new LifeTimeNode('childNode2');
			
			childNode1.attach(parentNode);
			childNode2.attach(parentNode);
						
			var hasTriggered = false;
			var childTriggeredCount = 0;
			var childOneDestroyTriggered = false;
			var childTwoDestroyTriggered = false;
			
			parentNode.onDestroy(function ()
			{
				hasTriggered = true;
			});
			
			childNode1.onDestroy(function ()
			{
				childOneDestroyTriggered = true;
			});
			
			childNode2.onDestroy(function ()
			{
				childTwoDestroyTriggered = true;
			});
			
			parentNode.onChildDestroy(function ()
			{
				childTriggeredCount++;
			});
			
			parentNode.destroy();
						
			assert.isTrue(parentNode.isDestroyed());
			assert.isTrue(childNode1.isDestroyed());
			assert.isTrue(childNode2.isDestroyed());
			assert.isTrue(hasTriggered);
			assert.isTrue(childOneDestroyTriggered);
			assert.isTrue(childTwoDestroyTriggered);
			assert.equal(2, childTriggeredCount);
		});
		
		test('Destroy with two level children, children destroyed', () => 
		{
			var parentNode = new LifeTimeNode('parent');
			var childNode = new LifeTimeNode('childNode');
			var subChildNode = new LifeTimeNode('subChildNode');
			
			subChildNode.attach(childNode);
			childNode.attach(parentNode);
			
			parentNode.destroy();
			
			assert.isTrue(parentNode.isDestroyed());
			assert.isTrue(childNode.isDestroyed());
			assert.isTrue(subChildNode.isDestroyed());
		});
		
		test('Destroy already destroyed, event not fired', () => 
		{
			var triggerCount = 0;
			
			var node = new LifeTimeNode('node');
			node.onDestroy(function ()
			{
				triggerCount++;
			});
			
			node.destroy();
			node.destroy();
			
			assert.equal(1, triggerCount);
		});
		
		test('Destroy called in the middle of chain', () => 
		{
			var parentNode = new LifeTimeNode('parent');
			var childNode = new LifeTimeNode('childNode');
			var subChildNode = new LifeTimeNode('subChildNode');
			var subSubChildNode = new LifeTimeNode('subSubChildNode');
			
			subSubChildNode.attach(subChildNode);
			subChildNode.attach(childNode);
			childNode.attach(parentNode);
			
			subChildNode.destroy();
			
			assert.isFalse(parentNode.isDestroyed());
			assert.isFalse(childNode.isDestroyed());
			assert.isFalse(childNode.hasChildren());
			assert.isTrue(subChildNode.isDestroyed());
			assert.isTrue(subSubChildNode.isDestroyed());
		});
	});
	
	suite('detach', () =>
	{
		test('Detach without parent, nothing fired', () => 
		{
			var hasTriggered = false;
			
			var childNode = new LifeTimeNode('childNode');
			
			childNode.onDetached(function ()
			{
				hasTriggered = true;
			});
			
			childNode.detach();
			
			assert.isFalse(hasTriggered);
		});
		
		test('Detach unexisting child, nothing fired', () => 
		{
			var hasTriggered = false;
			
			var parentNode = new LifeTimeNode('parentNode');
			var childNode = new LifeTimeNode('childNode');
			
			childNode.attach(parentNode);
			parentNode.children().pop();
			
			childNode.onDetached(function ()
			{
				hasTriggered = true;
			});
			
			childNode.detach();
			
			assert.isFalse(hasTriggered);
		});
		
		test('Detach with parent, parent detached', () => 
		{
			var hasTriggered = false;
			var hasChildTriggered = false;
			
			var childNode = new LifeTimeNode('childNode');
			var detachedNode = new LifeTimeNode('detachedNode');
			var parentNode = new LifeTimeNode('childNode');
			
			childNode.attach(parentNode);
			detachedNode.attach(parentNode);
			
			parentNode.onChildDetached(function ()
			{
				hasChildTriggered = true;
			});
			
			detachedNode.onDetached(function ()
			{
				hasTriggered = true;
			});
			
			detachedNode.detach();
			
			assert.isTrue(hasTriggered);
			assert.isTrue(hasChildTriggered);
			assert.isNull(detachedNode.parent());
			assert.equal(1, parentNode.children().length);
			assert.equal(childNode, parentNode.children().pop());
		});
	});
	
	suite('destroyTree', () => 
	{
		test('For one element tree', () => 
		{
			var node = new LifeTimeNode('node');
			node.destroyTree();
			
			assert.isTrue(node.isDestroyed());
		});
		
		test('Large tree from top', () => 
		{
			var root = new LifeTimeNode('rootNode');
			var leftParent = new LifeTimeNode('leftParent');
			var leftChild = new LifeTimeNode('leftChild');
			
			var rightParent = new LifeTimeNode('rightParent');
			var rightChild = new LifeTimeNode('rightChild');
			
			rightChild.attach(rightParent);
			leftChild.attach(leftParent);
			
			rightParent.attach(root);
			leftParent.attach(root);
			
			root.destroyTree();
			
			assert.isTrue(root.isDestroyed());
			assert.isTrue(leftParent.isDestroyed());
			assert.isTrue(rightParent.isDestroyed());
			assert.isTrue(rightChild.isDestroyed());
			assert.isTrue(leftChild.isDestroyed());
		});
		
		test('Large tree from middle', () => 
		{
			var root = new LifeTimeNode('rootNode');
			var leftParent = new LifeTimeNode('leftParent');
			var leftChild = new LifeTimeNode('leftChild');
			
			var rightParent = new LifeTimeNode('rightParent');
			var rightChild = new LifeTimeNode('rightChild');
			
			rightChild.attach(rightParent);
			leftChild.attach(leftParent);
			
			rightParent.attach(root);
			leftParent.attach(root);
			
			rightParent.destroyTree();
			
			assert.isTrue(root.isDestroyed());
			assert.isTrue(leftParent.isDestroyed());
			assert.isTrue(rightParent.isDestroyed());
			assert.isTrue(rightChild.isDestroyed());
			assert.isTrue(leftChild.isDestroyed());
		});
	});
	
	suite('attachChild', () => 
	{
		test('Try to attach null, nothing fired', () => 
		{
			var isTriggered = false;
			var parentNode = new LifeTimeNode('parentNode');
			
			parentNode.onChildAttached(function ()
			{
				isTriggered = true;	
			});
			
			parentNode.attachChild(null);
			
			assert.isFalse(isTriggered);
		});
		
		test('Try to attach node, node attached', () => 
		{
			var isTriggered = false;
			var isChildTriggered = false;
			var parentNode = new LifeTimeNode('parentNode');
			var childNode = new LifeTimeNode('childNode');
			
			parentNode.onChildAttached(function ()
			{
				isTriggered = true;	
			});
			
			childNode.onAttached(function ()
			{
				isChildTriggered = true;
			});
			
			parentNode.attachChild(childNode);
			
			assert.equal(parentNode, childNode.parent());
			assert.equal(childNode, parentNode.children().pop());
			assert.isTrue(isTriggered);
			assert.isTrue(isChildTriggered);
		});
	});
	
	suite('detachChild', () => 
	{
		test('Try to detach null, nothing fired', () => 
		{
			var isTriggered = false;
			var parentNode = new LifeTimeNode('parentNode');
			
			parentNode.onChildDetached(function ()
			{
				isTriggered = true;	
			});
			
			parentNode.detachChild(null);
			
			assert.isFalse(isTriggered);
		});
		
		test('Try to detach node, node detached', () => 
		{
			var isTriggered = false;
			var isChildTriggered = false;
			var parentNode = new LifeTimeNode('parentNode');
			var childNode = new LifeTimeNode('childNode');
			
			parentNode.onChildDetached(function ()
			{
				isTriggered = true;	
			});
			
			childNode.onDetached(function ()
			{
				isChildTriggered = true;
			});
			
			parentNode.attachChild(childNode);
			parentNode.detachChild(childNode);
			
			assert.isNull(childNode.parent());
			assert.equal(0, parentNode.children().length);
			assert.isTrue(isTriggered);
			assert.isTrue(isChildTriggered);
		});
	});
	
	suite('createChild', function ()
	{
		test('Parent is not destroyed, child created', () => 
		{
			var parentNode = new LifeTimeNode('parentNode');
			var child = parentNode.createChild('childNode');
			
			assert.instanceOf(child, LifeTimeNode);
			assert.equal('childNode', child.subject());
			assert.equal(parentNode, child.parent());
			assert.equal(child, parentNode.children().pop());
			assert.isTrue(child.isAlive());
			
		});
		test('Parent is destroyed, child created and destroyed', () => 
		{
			var parentNode = new LifeTimeNode('parentNode');
			parentNode.destroy();
			
			var child = parentNode.createChild('childNode');
			
			assert.instanceOf(child, LifeTimeNode);
			assert.equal('childNode', child.subject());
			assert.isNull(child.parent());
			assert.equal(0, parentNode.children().length);
			assert.isFalse(child.isAlive());
		});
	});
});