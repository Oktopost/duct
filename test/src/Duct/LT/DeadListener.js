const root 		= require('../../../index');
const Duct		= root.Duct;
const Plankton	= root.Plankton;

const assert	= require('chai').assert;

const func			= Plankton.func;
const DeadListener	= Duct.LT.DeadListener;


suite('DeadListener', () =>
{
	suite('add', () =>
	{
		test('return self', () => 
		{
			var dl = new DeadListener([]);
			assert.strictEqual(dl, dl.add(() => {}));
		});
		
		test('callback invoked', () => 
		{
			var isCalled = false;
			var dl = new DeadListener([]);
			
			dl.add(() => { isCalled = true; });
			
			return (func.postponed(() => 
			{
				assert.equal(isCalled, true);
			}, 1))();
		});
		
		test('all passed callbacks invoked', () => 
		{
			var isCalled1 = false;
			var isCalled2 = false;
			var dl = new DeadListener([]);
			
			dl.add(() => { isCalled1 = true; });
			dl.add(() => { isCalled2 = true; });
			
			return (func.postponed(() => 
			{
				assert.equal(isCalled1, true);
				assert.equal(isCalled2, true);
			}, 1))();
		});
		
		test('Passed callbacks invoked asynchronously', () => 
		{
			var isCalled1 = false;
			var dl = new DeadListener([]);
			
			dl.add(() => { isCalled1 = true; });
			
			assert.equal(isCalled1, false);
		});
		
		test('Callback passed in a callback not invoked immediately', () => 
		{
			var isCalled = false;
			var dl = new DeadListener([]);
			
			dl.add(() => { dl.add(() => { isCalled = true; }); });
			
			return func.async.do(() => 
			{
				assert.equal(isCalled, false);
			});
		});
		
		test('Callback passed in a callback will be invoked', () => 
		{
			var isCalled = false;
			var dl = new DeadListener([]);
			
			dl.add(() => { dl.add(() => { isCalled = true; }); });
			
			return func.async.do(() => 
			{
				return func.async.do(function () 
				{
					assert.equal(isCalled, true)
				});
			})
		});
		
		test('Params passed to callback', () => 
		{
			var calledWith = null;
			var dl = new DeadListener([1, 'a']);
			
			dl.add((...a) => { calledWith = a; });
			
			return func.async.do(() => 
			{
				assert.deepEqual(calledWith, [1, 'a']);
			})
		});
		
		test('No params passed, empty arguments list', () => 
		{
			var calledWith = null;
			var dl = new DeadListener();
			
			dl.add((...a) => { calledWith = a; });
			
			return func.async.do(() => 
			{
				assert.deepEqual(calledWith, []);
			})
		});
	});
	
	suite('rem', () =>
	{
		test('return self', () => 
		{
			var dl = new DeadListener([]);
			assert.strictEqual(dl, dl.remove(() => {}));
		});
		
		test('Removed callback not invoked', () => 
		{
			var isCalled = false;
			var dl = new DeadListener([]);
			var callback = () => { isCalled = true; }; 
			
			dl.add(callback);
			dl.remove(callback);
			
			return func.async.do(() => 
			{
				assert.equal(isCalled, false);
			});
		});
		
		test('Only the removed callback not invoked', () => 
		{
			var isCalled = false;
			var dl = new DeadListener([]);
			var callback = () => {}; 
			
			dl.add(callback);
			dl.add(() => { isCalled = true; });
			dl.remove(callback);
			
			return func.async.do(() => 
			{
				assert.equal(isCalled, true);
			});
		});
	});
});