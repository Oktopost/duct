window.duct = window.duct || {};
window.duct.handlers = {};
if (typeof window.duct.mixin === 'undefined') { 
	window.duct = {
		mixin: function(mixin) {
			for (var key in mixin) {
				//noinspection JSUnfilteredForInLoop
				window.duct[key] = mixin[key];
			}
		}
	}; 
}