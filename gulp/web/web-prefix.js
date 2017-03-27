window.duct = window.duct || {};
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