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
		
		expect(onReady.getEvent()).to.be.instanceOf(Event);
		assert.equal(onReady.getEvent().name(), eventName);
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
	});

	suite('add', () =>
	{
		test('addListener', () =>
		{
			var e = new OnReadyEvent('e');
			e.add(new LifeTime(), () => {});
			
			assert.equal(e.getEvent().count(), 1);
		});
		
		test('runImmediately', () =>
		{
			var e = new OnReadyEvent('e');
			e.trigger();
			e.add(new LifeTime(), () => {});

			assert.equal(e.getEvent(), null);
		});
	});
});