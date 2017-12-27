const root 		= require('../../../index');
const assert	= require('chai').assert;
const expect	= require('chai').expect;

const Duct		= root.Duct;
const Event		= Duct.Event;
const LifeTime	= Duct.LifeTime;

const OnReadyEvent	= Duct.Extensions.OnReadyEvent;


suite('OnReadyEvent', () =>
{
	test('return event', () => 
	{
		var eventName = Math.random().toString(36).substr(2, 5);
		var onReady = new OnReadyEvent(eventName);
		
		expect(onReady).to.be.instanceOf(Event);
		assert.equal(onReady.name(), eventName);
	});
	
	suite('trigger', () =>
	{
		test('notTriggered', () =>
		{
			var e = new OnReadyEvent('e');
			assert.equal(e.isTriggered(), false);
		});	
		
		test('wasTriggered', () =>
		{
			var e = new OnReadyEvent('e');
			e.trigger();
			assert.equal(e.isTriggered(), true);
		});
		
		test('triggerDestroyed', () => 
		{
			var result = false;
			
			
			var e = new OnReadyEvent('e');
			e.add(new LifeTime(), () => { result = true; });
			e.destroy();
			
			expect(e.trigger()).to.be.instanceOf(Event);
			assert.equal(false, result);
		});
	});

	suite('add', () =>
	{
		test('addListener', () =>
		{
			var e = new OnReadyEvent('e');
			e.add(new LifeTime(), () => {});
			
			assert.equal(1, e.count());
		});
		
		test('runImmediately', () =>
		{
			var isTriggered = false;
			var e = new OnReadyEvent('e');
			e.trigger();
						
			var promise = new Promise((resolve, reject) => {
				e.add(new LifeTime(), () => { isTriggered = true; });
				resolve();
			});
			
			return promise.then(function ()
			{
				assert.equal(0, e.count());
				assert.equal(true, e.isTriggered());
				assert.equal(true, isTriggered);
			});
		});
		
		test('addToDestroyed', () => 
		{
			var isTriggered = false;
			var e = new OnReadyEvent('e');
			e.destroy();
			
			expect(e.add(new LifeTime(), () => { isTriggered = true; })).to.be.instanceOf(Event);
			assert.equal(false, isTriggered);
		});
	});
});