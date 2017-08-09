const root 		= require('../../index');
const Duct		= root.Duct;
const Plankton	= root.Plankton;

const assert	= require('chai').assert;

const func			= Plankton.func;
const DeadListener	= Duct.LT.DeadListener;
const LifeTime		= Duct.LifeTime;
const Listener		= Duct.Listener;


suite('LifeTime', () =>
{
	suite('onKill', () =>
	{
		test('Listener returned', () =>
		{
			var lt = new LifeTime();
			assert.instanceOf(lt.onKill(), Listener);
		});
		
		test('Callback passed, Listener returned', () =>
		{
			var lt = new LifeTime();
			assert.instanceOf(lt.onKill(() => {}), Listener);
		});
		
		test('Object is Dead, DeadListener returned', () =>
		{
			var lt = new LifeTime();
			lt.kill();
			assert.instanceOf(lt.onKill(), DeadListener);
		});
		
		test('Callback passed to dead object, DeadListener returned', () =>
		{
			var lt = new LifeTime();
			lt.kill();
			assert.instanceOf(lt.onKill(() => {}), DeadListener);
		});
		
		test('Callback passed, callback invoked', () =>
		{
			var lt = new LifeTime();
			var isCalled = false;
			
			lt.onKill(() => { isCalled = true; });
			lt.kill();
			
			return func.async.do(() => { assert.equal(isCalled, true); });
		});
		
		test('Callback passed to dead object, callback invoked', () =>
		{
			var lt = new LifeTime();
			var isCalled = false;
			
			lt.kill();
			lt.onKill(() => { isCalled = true; });
			
			return func.async.do(() => { assert.equal(isCalled, true); });
		});
		
		test('LifeTime passed as first parameter', () =>
		{
			var lt = new LifeTime();
			var calledWith = null;
			
			lt.kill();
			lt.onKill((...a) => { calledWith = a; });
			
			return func.async.do(() => { assert.deepEqual(calledWith, [ lt ]); });
		});
	});
	
	suite('clear', () => 
	{
		test('Callbacks invoked', () =>
		{
			var lt = new LifeTime();
			var isCalled = false;
			
			lt.onKill(() => { isCalled = true; });
			lt.clear();
			
			return func.async.do(() => { assert.equal(isCalled, true); });
		});
		
		test('Callbacks invoked only on the first call', () =>
		{
			var lt = new LifeTime();
			var calledCount = 0;
			
			lt.onKill(() => { calledCount++; });
			lt.clear();
			
			return func.async.do(() => 
			{
				lt.clear();
				return func.async.do(() => { assert.equal(calledCount, 1); });
			});
		});
		
		test('Object is dead, callbacks are not invoked', () =>
		{
			var lt = new LifeTime();
			var calledCount = 0;
			
			lt.kill();
			lt.onKill(() => { calledCount++; });
			lt.clear();
			lt.clear();
			lt.clear();
			
			return func.async.do(() => 
			{
				assert.equal(calledCount, 1);
			});
		});
		
		test('Callbacks registered after clear not called.', () =>
		{
			var lt = new LifeTime();
			var calledCount = 0;
			
			lt.clear();
			lt.onKill(() => { calledCount++; });
			
			return func.async.do(() => 
			{
				assert.equal(calledCount, 0);
			});
		});
	});
	
	suite('kill', () => 
	{
		test('Callbacks invoked only on the first call', () =>
		{
			var lt = new LifeTime();
			var calledCount = 0;
			
			lt.onKill(() => { calledCount++; });
			lt.kill();
			
			return func.async.do(() => 
			{
				lt.kill();
				return func.async.do(() => { assert.equal(calledCount, 1); });
			});
		});
	});
});