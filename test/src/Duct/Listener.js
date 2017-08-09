const root 		= require('../../index');
const Duct		= root.Duct;

const assert	= require('chai').assert;

const Listener	= Duct.Listener;


suite('Listener', () =>
{
	suite('add', () => 
	{
		test('Return self', () => 
		{
			var l = new Listener({ add: () => {} });
			assert.equal(l.add(() => {}), l);
		});
		
		test('Add callback, callback passed to event', () => 
		{
			var passed = null;
			var callback = () => {};
			
			var l = new Listener({
				add: (a) => { passed = a; }
			});
			
			l.add(callback);
			
			assert.strictEqual(passed, callback);
		});
		
		test('Pass life time target with callback, all passed to event', () => 
		{
			var passed = null;
			var callback = () => {};
			
			var l = new Listener({
				add: (a, b) => { passed = [a, b]; }
			});
			
			l.add(123, callback);
			
			assert.deepEqual(passed, [ 123, callback ]);
		});
	});
	
	suite('remove', () => 
	{
		test('Return self', () => 
		{
			var l = new Listener({ remove: () => {} });
			assert.equal(l.remove(() => {}), l);
		});
		
		test('Remove callback, callback passed to event', () => 
		{
			var passed = null;
			var callback = () => {};
			
			var l = new Listener({
				remove: (a) => { passed = a; }
			});
			
			l.remove(callback);
			
			assert.strictEqual(passed, callback);
		});
		
		test('Pass life time target with callback, all passed to event', () => 
		{
			var passed = null;
			var callback = () => {};
			
			var l = new Listener({
				remove: (a, b) => { passed = [a, b]; }
			});
			
			l.remove(123, callback);
			
			assert.deepEqual(passed, [ 123, callback ]);
		});
	});
});