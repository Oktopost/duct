const root 		= require('../../index');
const Duct		= root.Duct;
const Plankton	= root.Plankton;

const assert	= require('chai').assert;

const Event			= Duct.Event;
const LifeTime		= Duct.LifeTime;
const Listener		= Duct.Listener;
const Binder		= Duct.LT.Binder;


suite('Event', () =>
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
	
	test('clear called after destroy', () =>
	{
		var isCalled = false;
		var e = new Event();
		
		e.destroy();
		e.clear();
	});
	
	test('Error handler', () => 
	{
		var passedErr = false;
		var thrownErr = new Error();
		var e = new Event();
		
		e.setErrorHandler(function (err) { passedErr = err; });
		
		e.add(function () {
			throw thrownErr;
		});
		
		e.trigger();
		
		assert.strictEqual(passedErr, thrownErr);
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
		
		test('Add callback with a LifeTime object field, binded callback added', () => 
		{
			var calls = 0;
			var func = function () { calls++; };
			var lt = new LifeTime();
			
			func[Binder.ATTACHMENT_KEY] = lt;
			
			var e = new Event();
			e.add(func);
			
			e.trigger();
			assert.equal(calls, 1);
			
			lt.kill();
			e.trigger();
			assert.equal(calls, 1);
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
	
	suite('listener', () =>
	{
		test('Listner returned', () =>
		{
			var e = new Event();
			
			assert.instanceOf(e.listener(), Listener);
		});
		
		test('Callback passed, callback add to event', () =>
		{
			var e = new Event();
			var isCalled = false;
			
			e.listener(() => { isCalled = true; });
			e.trigger();
			
			assert.isTrue(isCalled);
		});
		
		test('Lifetime object and callback passed, callback add to event with lifetime', () =>
		{
			var e = new Event();
			var calledCount = 0;
			var lifeTime = new LifeTime();
			
			e.listener(lifeTime, () => { calledCount++; });
			e.trigger();
			lifeTime.kill();
			e.trigger();
			
			assert.equal(calledCount, 1);
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