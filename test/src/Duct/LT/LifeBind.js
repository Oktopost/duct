const root 		= require('../../../index');
const Duct		= root.Duct;
const Plankton	= root.Plankton;

const assert	= require('chai').assert;

const func		= Plankton.func;
const LifeBind	= Duct.LT.LifeBind;


suite('LifeBind', () =>
{
	test('isAlive', () =>
	{
		var lb = new LifeBind();
		
		assert.equal(lb.isAlive(), true);
		lb.kill();
		assert.equal(lb.isAlive(), false);
	});
	
	test('isDead', () =>
	{
		var lb = new LifeBind();
		
		assert.equal(lb.isDead(), false);
		lb.kill();
		assert.equal(lb.isDead(), true);
	});
	
	
	suite('bindToLife', () => 
	{
		test('new callback returned', () =>
		{
			var isCalled = false;
			var lb = new LifeBind();
			
			var result = lb.bindToLife(() => { isCalled = true; });
			
			result();
			
			assert.equal(isCalled, true);
		});
		
		test('scope passed to original callback', () =>
		{
			var scope = null;
			var object = {};
			
			var lb = new LifeBind();
			var result = lb.bindToLife(function() { scope = this; });
			
			result.call(object);
			
			assert.strictEqual(scope, object);
		});
		
		test('params passed to original callback', () =>
		{
			var data	= null;
			var objectA = {};
			var paramB	= 5;
			
			var lb = new LifeBind();
			var result = lb.bindToLife(function(...a) { data = a; });
			
			result(objectA, paramB);
			
			assert.deepEqual(data, [ objectA, paramB ]);
		});
		
		test('on destroy invoked if object is dead', () =>
		{
			var isCalled = false;
			
			var lb = new LifeBind();
			lb.kill();
			
			lb.bindToLife(() => {}, () => { isCalled = true; });
			
			return (func.postponed(() => 
				{
					assert.equal(isCalled, true);
				}, 
				1))();
		});
	});
	
	suite('unbind', () => 
	{
		test('destroy invoked', () =>
		{
			var isCalledA = false;
			var original = () => {};
			var lb = new LifeBind();
			
			lb.bindToLife(original, () => { isCalledA = true; });
			
			lb.unbind(original);
			
			assert.equal(isCalledA, true);
		});
		
		test('destroy invoked only once', () =>
		{
			var calledCount = 0;
			var original = () => {};
			var lb = new LifeBind();
			
			lb.bindToLife(original, () => { calledCount++; });
			
			lb.unbind(original);
			lb.unbind(original);
			
			assert.equal(calledCount, 1);
		});
		
		test('original callback has number of bound callbacks, all callbacks all destroyed', () =>
		{
			var isCalledA = false;
			var isCalledB = false;
			var original = () => {};
			
			
			var lb = new LifeBind();
			
			lb.bindToLife(original, () => { isCalledA = true; });
			lb.bindToLife(original, () => { isCalledB = true; });
			
			lb.unbind(original);
			
			assert.equal(isCalledA, true);
			assert.equal(isCalledB, true);
		});
		
		test('only target callback is unbounded', () =>
		{
			var isCalled = false;
			var original = () => {};
			
			
			var lb = new LifeBind();
			
			lb.bindToLife(original);
			lb.bindToLife(() => {}, () => { isCalled = true; });
			
			lb.unbind(original);
			
			assert.equal(isCalled, false);
		});
		
		test('unbind using bounded callback', () =>
		{
			var isCalled = false;
			var lb = new LifeBind();
			
			var result = lb.bindToLife(() => {}, () => { isCalled = true; });
			
			lb.unbind(result);
			
			assert.equal(isCalled, true);
		});
	});
	
	suite('clear', () => 
	{
		test('on destroy invoked for callbacks', () =>
		{
			var isCalled = false;
			
			var lb = new LifeBind();
			
			lb.bindToLife(() => {}, () => { isCalled = true; });
			lb.clear();
			
			return (func.postponed(() => 
				{
					assert.equal(isCalled, true);
				}, 
				1))();
		});
		
		test('on destroy invoked for all callbacks', () =>
		{
			var isCalledA = false;
			var isCalledB = false;
			
			var lb = new LifeBind();
			
			lb.bindToLife(() => {}, () => { isCalledA = true; });
			lb.bindToLife(() => {}, () => { isCalledB = true; });
			
			lb.clear();
			
			return (func.postponed(() => 
				{
					assert.equal(isCalledA, true);
					assert.equal(isCalledB, true);
				}, 
				1))();
		});
		
		test('object still alive', () =>
		{
			var lb = new LifeBind();
			lb.clear();
			assert.equal(lb.isAlive(), true);
		});
	});
	
	suite('kill', () => 
	{
		test('callback not invoked if object is dead', () =>
		{
			var isCalled = false;
			var lb = new LifeBind();
			
			var result = lb.bindToLife(() => { isCalled = true; });
			lb.kill();
			
			result();
			
			assert.equal(isCalled, false);
		});
		
		test('on destroy invoked for callbacks', () =>
		{
			var isCalled = false;
			
			var lb = new LifeBind();
			
			lb.bindToLife(() => {}, () => { isCalled = true; });
			lb.kill();
			
			return (func.postponed(() => 
				{
					assert.equal(isCalled, true);
				}, 
				1))();
		});
		
		test('object not alive', () =>
		{
			var lb = new LifeBind();
			lb.kill();
			assert.equal(lb.isAlive(), false);
		});
		
		test('call twice', () =>
		{
			var lb = new LifeBind();
			lb.kill();
			lb.kill();
			assert.equal(lb.isAlive(), false);
		});
	});
	
	suite('callback response', () =>
	{
		test('return undefined, callback will still work', () =>
		{
			var isCalled = [];
			var lb = new LifeBind();
			
			var result = lb.bindToLife(() => { isCalled.push(true); });
			
			result();
			result();
			
			assert.deepEqual(isCalled, [ true, true ]);
		});
		
		test('return false, callback unbounded', () =>
		{
			var isCalled = [];
			var lb = new LifeBind();
			
			var result = lb.bindToLife(() => { isCalled.push(true); return false; });
			
			result();
			result();
			
			assert.deepEqual(isCalled, [ true ]);
		});
		
		test('return false, object still alive', () =>
		{
			var lb = new LifeBind();	
			var result = lb.bindToLife(() => { return false; });
			
			result();
			
			assert.equal(lb.isAlive(), true);
		});
		
		test('return null, lifetime object is killed', () =>
		{
			var isCalled = [];
			var lb = new LifeBind();
			
			var result = lb.bindToLife(() => { isCalled.push(true); return null; });
			
			result();
			result();
			
			assert.deepEqual(isCalled, [ true ]);
		});
		
		test('return null, object is dead', () =>
		{
			var lb = new LifeBind();	
			var result = lb.bindToLife(() => { return null; });
			
			result();
			
			assert.equal(lb.isAlive(), false);
		});
	});
	
	suite('complex', () => 
	{
		test('Unbind called from a callback that returns false', () => 
		{
			var calledCount = 0;
			var lb = new LifeBind();
			var original = () => { lb.unbind(original); return false; };
			
			var callback = lb.bindToLife(original, () => { calledCount++; });
			
			callback();
			
			assert.equal(calledCount, 1);
		});
		
		test('Add callback that returns false to already dead object', () => 
		{
			var calledCount = 0;
			var lb = new LifeBind();
			var original = () => { lb.unbind(original); return false; };
			
			lb.kill();
			
			var callback = lb.bindToLife(original, () => { calledCount++; });
			
			callback();
			
			return (func.postponed(() => assert.equal(calledCount, 1), 1))();
		});
		
		test('Call unbind from destroy', () => 
		{
			var calledCount = 0;
			var lb = new LifeBind();
			var original = () => {};
			var destroy = () => { lb.unbind(original); calledCount++; };
			
			
			lb.bindToLife(original, () => { calledCount++; });
			lb.unbind(original);
			
			assert.equal(calledCount, 1);
		});
	});
});