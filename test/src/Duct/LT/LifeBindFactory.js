const root 		= require('../../../index');
const Duct		= root.Duct;
const Classy	= root.Classy;
const Plankton	= root.Plankton;

const assert	= require('chai').assert;

const func				= Plankton.func;
const inherit			= Classy.inherit;
const LifeBind			= Duct.LT.LifeBind;
const LifeBindFactory	= Duct.LT.LifeBindFactory;


suite('LifeBindFactory', () =>
{
	function reset()
	{
		LifeBindFactory.__instance__ = null;
	}
	
	
	suite('get', () => 
	{
		test('No builder found, exception thrown', () => 
		{
			reset();
			assert.throws(() => { LifeBindFactory.instance().get('abc'); });
		});
		
		test('Object is a LifeBind object, same object returned', () => 
		{
			reset();
			
			var target = new LifeBind();
			
			assert.deepEqual(LifeBindFactory.instance().get(target), target);
		});
		
		test('Object is isntance of LifeBind , same object returned', () => 
		{
			reset();
			
			function tmp() {}
			
			inherit(tmp, LifeBind);
			
			var target = new tmp();
			
			assert.deepEqual(LifeBindFactory.instance().get(target), target);
		});
		
		test('Builder for object found, builders value returned', () => 
		{
			reset();
			
			var result = new LifeBind();
			
			LifeBindFactory.instance().addBuilder(() => { return result; });
			
			assert.strictEqual(LifeBindFactory.instance().get('a'), result);
		});
		
		test('Value of the first found builder is returned', () => 
		{
			reset();
			
			var result1 = new LifeBind();
			var result2 = new LifeBind();
			
			LifeBindFactory.instance().addBuilder(() => { return result1; });
			LifeBindFactory.instance().addBuilder(() => { return result2; });
			
			assert.strictEqual(LifeBindFactory.instance().get('a'), result1);
		});
		
		test('Value passed to builder', () => 
		{
			reset();
			
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
			reset();
			
			LifeBindFactory.instance().addBuilder(() => { return new LifeBind(); });
			
			assert.instanceOf(LifeBindFactory.instance().get('a'), LifeBind);
		});
		
		
		test('Add array of builders', () => 
		{
			reset();
			
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