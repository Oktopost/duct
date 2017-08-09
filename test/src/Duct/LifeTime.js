const root 		= require('../../index');
const Duct		= root.Duct;
const Plankton	= root.Plankton;

const assert	= require('chai').assert;

const func		= Plankton.func;
const LifeBind	= Duct.LT.LifeBind;
const LifeTime	= Duct.LifeTime;
const Listener	= Duct.Listener;


suite('LifeTime', () =>
{
	/*
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
	});
	*/
});