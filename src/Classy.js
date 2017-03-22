"use strict";


var is	= require('oktopost-plankton').is;
var obj	= require('oktopost-plankton').obj;


/**
 * @param {Object} object
 * @param {function()=} init
 */
function classify(object, init) {
	obj.forEach.pair(object, function(name, item) {
		if (name[0] !== '_' && is.function(item)) {
			object[name] = item.bind(object);
		}
	});
	
	if (is(init)) {
		init.call(object)
	}
}


module.exports = {
	classify: classify
};