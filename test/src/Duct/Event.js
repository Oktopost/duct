const root 		= require('../../index');
const Duct		= root.Duct;
const Plankton	= root.Plankton;

const assert	= require('chai').assert;

const func			= Plankton.func;
const Event			= Duct.Event;
const LifeTime		= Duct.LifeTime;


suite.only('Event', () =>
{
	test('name', () => 
	{
		var e = new Event('123');
		assert.equal(e.name(), '123');
	});
	
	
	test('count', () => 
	{
		var callback = () => {};
		var e = new Event();
		assert.equal(e.count(), 0);
		
		e.add(callback);
		e.add(() => {});
		
		assert.equal(e.count(), 2);
		
		// Not in the event.
		e.remove(() => {});
		
		assert.equal(e.count(), 2);
		
		e.remove(callback);
		
		assert.equal(e.count(), 1);
	});
	
	test('isDestroyed', () => 
	{
		var e = new Event();
		
		assert.equal(e.isDestroyed(), false);
		e.destroy();
		assert.equal(e.isDestroyed(), true);
		e.destroy();
		assert.equal(e.isDestroyed(), true);
	});
	
	test('clear', () =>
	{
		var isCalled = false;
		var e = new Event();
		
		e.add(() => { isCalled = true; });
		e.clear();
		e.trigger();
		
		assert.equal(e.count(), 0);
		assert.equal(isCalled, false);
	});
	
	
	suite('trigger', () => 
	{
		test('no callbacks', () => 
		{
			var e = new Event();
			e.trigger();
		});
		
		test('All callbacks invoked', () => 
		{
			var e = new Event();
			
			var isCalled1 = false;
			var isCalled2 = false;
			
			e.add(() => { isCalled1 = true; });
			e.add(() => { isCalled2 = true; });
			
			e.trigger();
			
			assert.equal(isCalled1, true);
			assert.equal(isCalled2, true);
		});
		
		test('Callbacks triggered only once', () => 
		{
			var e = new Event();
			
			var count = 0;
			
			e.add(() => { count++; });
			e.trigger();
			
			assert.equal(count, 1);
		});
		
		test('Params passed to callback', () => 
		{
			var e = new Event();
			var a = null;
			
			e.add((...b) => { a = b; });
			
			e.trigger(true, 1, 'a');
			
			assert.deepEqual(a, [true, 1, 'a']);
		});
	});
	
	suite('add', () => 
	{
		test('Return self', () =>
		{
			var e = new Event();
			assert.strictEqual(e.add(() => {}), e);
		});
		
		test('Event destroyed, return self.', () =>
		{
			var e = new Event();
			e.destroy();
			assert.strictEqual(e.add(() => {}), e);
		});
		
		test('Add with lifetime object, Return self', () =>
		{
			var e = new Event();
			assert.strictEqual(e.add(new LifeTime(), () => {}), e);
		});
		
		test('All callback to destroyed event, callback will NOT be invoked', () => 
		{
			var e = new Event();
			var isCalled = false;
			
			e.destroy();
			e.add(() => { isCalled = true; });
			e.trigger();
			
			assert.equal(isCalled, false);
		});
		
		test('All callback, callback will be invoked', () => 
		{
			var e = new Event();
			var isCalled = false;
			
			e.add(() => { isCalled = true; });
			e.trigger();
			
			assert.equal(isCalled, true);
		});
	});
	
	suite('remove', () => 
	{
		test('Return self', () =>
		{
			var e = new Event();
			assert.strictEqual(e.remove(() => {}), e);
		});
		
		test('Remove with lifetime object, Return self', () =>
		{
			var e = new Event();
			assert.strictEqual(e.remove(new LifeTime(), () => {}), e);
		});
		
		test('Destroyed event, Return self', () =>
		{
			var e = new Event();
			e.destroy();
			assert.strictEqual(e.remove(() => {}), e);
		});
		
		test('Remove callback, callback will not be invoked', () => 
		{
			var e = new Event();
			var isCalled = false;
			var callback = () => { isCalled = true; };
						 
			e.add(callback);
			e.remove(callback);
			e.trigger();
			
			assert.equal(isCalled, false);
		});
		
		test('Remove with lifetime object, target callback will not be called', () =>
		{
			var e = new Event();
			var isCalled = false;
			var callback = () => { isCalled = true; };
			var lifeTime = new LifeTime();
			
			e.add(lifeTime, callback);
			e.remove(lifeTime, callback);
			e.trigger();
			
			assert.equal(isCalled, false);
		});
	});
	
	suite('LifeTime object', () => 
	{
		test('LifeTime object destroyed, handler will not be invoked', () => 
		{
			var e = new Event();
			var isCalled = false;
			var callback = () => { isCalled = true; };
			var lifeTime = new LifeTime();
			
			e.add(lifeTime, callback);
			lifeTime.kill();
			e.trigger();
			
			assert.equal(isCalled, false);
		});
		
		test('Original callback will be invoked', () =>
		{
			var e = new Event();
			var isCalled = false;
			
			e.add(new LifeTime(), () => { isCalled = true; });
			e.trigger();
			
			assert.equal(isCalled, true);
		});
		
		test('Params passed to original callback', () =>
		{
			var e = new Event();
			var a = null;
			
			e.add(new LifeTime(), (...b) => { a = b; });
			e.trigger(1, 'a');
			
			assert.deepEqual(a, [1, 'a']);
		});
	});
});