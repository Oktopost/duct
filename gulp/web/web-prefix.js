if (typeof window.oktopostJS === 'undefined') { 
	window.oktopostJS = {
		mixin: function(lib, mixin) {
			for (var key in mixin) {
				window.oktopostJS[lib][key] = mixin[key];
			}
		}
	}; 
}
window.oktopostJS.duct = {};