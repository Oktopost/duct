const root 		= require('../../../index');

const LifeTime	= root.Duct.LifeTime;
const Binder	= root.Duct.LT.Binder;

const classify	= root.Classy.classify;


const assert	= require('chai').assert;


suite('Binder', () =>
{
	suite('isBinded', () => 
	{
		test('Callback not binded, return false', () =>  
		{
			assert.isFalse(Binder.isBinded(function() {}));
		});
		
		test('Callback is not a function, return false', () =>  
		{
			var a = {};
			a[Binder.ATTACHMENT_KEY] = new LifeTime();
			
			assert.isFalse(Binder.isBinded(a));
		});
		
		test('Callback is Binded, return true', () =>  
		{
			var a = function() {};
			a[Binder.ATTACHMENT_KEY] = new LifeTime();
			
			assert.isTrue(Binder.isBinded(a));
		});
	});
	
	suite('get', () => 
	{
		test('Callback not binded, return null', () =>  
		{
			assert.isNull(Binder.get(function() {}));
		});
		
		test('Callback is not valid, return null', () =>  
		{
			var a = {};
			a[Binder.ATTACHMENT_KEY] = new LifeTime();
			
			assert.isNull(Binder.get(a));
			
			
			var b = function() {};
			b[Binder.ATTACHMENT_KEY] = b;
			
			assert.isNull(Binder.get(b));
		});
		
		test('Callback binded, return lt', () =>  
		{
			var a = function() {};
			var lt = new LifeTime();
			
			a[Binder.ATTACHMENT_KEY] = lt;
			
			assert.strictEqual(Binder.get(a), lt);
		});
	});
	
	suite('attach', () => 
	{
		test('LT attached to matching function', () =>  
		{
			function Cls() { classify(this); }
			Cls.prototype._att_Function = function() {};
			
			var lt = new LifeTime();
			var inst = new Cls();
			
			Binder.attach(inst, lt, /^_att_.*/);
			
			assert.strictEqual(inst._att_Function[Binder.ATTACHMENT_KEY], lt);
		});
		
		test('LT not attached to not matching functions', () =>  
		{
			function Cls() { classify(this); }
			Cls.prototype._no_att_Function = function() {};
			
			var lt = new LifeTime();
			var inst = new Cls();
			
			Binder.attach(inst, lt, /^_att_.*/);
			
			assert.isUndefined(inst._no_att_Function[Binder.ATTACHMENT_KEY]);
		});
	});
	
	suite('getBinded', () => 
	{
		test('LT setup, new callback returned', () => 
		{
			function func() {}
			var lt = new LifeTime();
			
			func[Binder.ATTACHMENT_KEY] = lt;
			
			assert.notEqual(Binder.getBinded(func), lt);
		});
		
		test('LT setup, binded callback returned', () => 
		{
			var called = 0;
			
			function func() { called++; }
			
			var lt = new LifeTime();
			func[Binder.ATTACHMENT_KEY] = lt;
			
			var bindedFunc = Binder.getBinded(func);
			
			bindedFunc();
			assert.equal(called, 1);
			
			lt.kill();
			bindedFunc();
			assert.equal(called, 1);
		});
		
		test('LT not setup, same callback returned', () => 
		{
			function func() {}
			assert.equal(Binder.getBinded(func), func);
		});
	});
});