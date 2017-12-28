const root 		= require('../../../index');
const Duct		= root.Duct;
const Classy	= root.Classy;
const Plankton	= root.Plankton;

const assert	= require('chai').assert;

const func				= Plankton.func;
const inherit			= Classy.inherit;
const LifeBind			= Duct.LT.LifeBind;
const LifeBindFactory	= Duct.LT.LifeBindFactory;


var originalTest = test;


suite('LifeBindFactory', () =>
{
	var test = function (message, callback)
	{
		originalTest(message, () => {
			var lastInstance = LifeBindFactory.__instance__;
			LifeBindFactory.__instance__ = null;
			
			try 
			{
				callback();
			}
			finally 
			{
				LifeBindFactory.__instance__ = lastInstance;
			}
		});
	};
	
	test.only = originalTest.only;
	
	
	suite('get', () => 
	{
		test('No builder found, exception thrown', () => 
		{
			assert.throws(() => { LifeBindFactory.instance().get('abc'); });
		});
		
		test('Object is a LifeBind object, same object returned', () => 
		{
			var target = new LifeBind();
			
			assert.deepEqual(LifeBindFactory.instance().get(target), target);
		});
		
		test('Object is isntance of LifeBind , same object returned', () => 
		{
			function tmp() {}
			
			inherit(tmp, LifeBind);
			
			var target = new tmp();
			
			assert.deepEqual(LifeBindFactory.instance().get(target), target);
		});
		
		test('Builder for object found, builders value returned', () => 
		{
			var result = new LifeBind();
			
			LifeBindFactory.instance().addBuilder(() => { return result; });
			
			assert.strictEqual(LifeBindFactory.instance().get('a'), result);
		});
		
		test('Value of the first found builder is returned', () => 
		{
			var result1 = new LifeBind();
			var result2 = new LifeBind();
			
			LifeBindFactory.instance().addBuilder(() => { return result1; });
			LifeBindFactory.instance().addBuilder(() => { return result2; });
			
			assert.strictEqual(LifeBindFactory.instance().get('a'), result1);
		});
		
		test('Value passed to builder', () => 
		{
			var calledWith = null;
			
			LifeBindFactory.instance().addBuilder((a) => { calledWith = a; return new LifeBind(); });
			LifeBindFactory.instance().get('a');
			
			assert.equal(calledWith, 'a');
		});
	});
	
	suite('addBuilder', () => 
	{
		test('Add single builder', () => 
		{
			LifeBindFactory.instance().addBuilder(() => { return new LifeBind(); });
			
			assert.instanceOf(LifeBindFactory.instance().get('a'), LifeBind);
		});
		
		
		test('Add array of builders', () => 
		{
			var isCalled1 = false;
			var isCalled2 = false;
			
			var result = new LifeBind();
			
			LifeBindFactory.instance().addBuilder([
				() => { isCalled1 = true; },
				() => { isCalled2 = true; },
				() => { return new LifeBind(); }
			]);
			
			assert.instanceOf(LifeBindFactory.instance().get('a'), LifeBind);
			assert.equal(isCalled1, true);
			assert.equal(isCalled2, true);
		});
	});
});