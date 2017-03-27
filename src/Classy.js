"use strict";


var is	= require('oktopost-plankton').is;


/**
 * @param {Object} object
 * @param {function()=} init
 */
function classify(object, init) {
	for (var key in object) {
		var item = object[key];
		
		if (is.function(item)) {
			object[key] = item.bind(object);
		}
	}
	
	if (is(init)) {
		init.call(object)
	}
}


module.exports = { classify: classify };