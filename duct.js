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
(function() {
	var module = {};
	
	(function(module) {
		'use strict';


var DEFAULT_FILTER = /.*/;

/**
 * @param {Event} event
 * @param {Array} args
 */
var DEFAULT_LOGGER = function (event, args) { 
	console.groupCollapsed('Event %c' + event.name(), 'color: green');
	
	for (var i = 0; i < args.length; i++) {
		console.log(args[i]);
	}
	
	console.groupEnd();
};


/**
 * @param {RegExp=} filter
 * @constructor
 */
var EventDebug = function (filter) {
	/**
	 * @type {RegExp}
	 * @private
	 */
	this._filter = filter || DEFAULT_FILTER;

	/**
	 * @type {boolean}
	 * @private
	 */
	this._log = false;

	/**
	 * @private
	 */
	this._logger = DEFAULT_LOGGER;
};


EventDebug.prototype.log = function () {
	this._log = true;
};

/**
 * @param {RegExp} filter
 */
EventDebug.prototype.filter = function (filter) {
	this._filter = filter;
};

/**
 * @param {string} data
 */
EventDebug.prototype.filterStartsWith = function (data) {
	this._filter = new RegExp('^' + data + '.*$');
};

EventDebug.prototype.reset = function () {
	this._filter = DEFAULT_FILTER;
	this._log = false;
};

/**
 * @param {function} logger
 */
EventDebug.prototype.setLogger = function(logger) {
	this._logger = logger;
};

/**
 * @param {Event} event
 * @param {Array} args
 */
EventDebug.prototype.onTrigger = function(event, args) {
	if (!this._log || !this._filter.test(event.name())) {
		return;
	}
	
	this._logger(event, args)
};


module.exports = {debug: {EventDebug: EventDebug}};
	})(module);
	
	window.duct.mixin(module.exports);
})();
(function() {
	var module = {};
	
	(function(module) {
		"use strict";


var is	= plankton.is;


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


module.exports = {Classy: {classify: classify}};
	})(module);
	
	window.duct.mixin(module.exports);
})();
(function() {
	var module = {};
	
	(function(module) {
		'use strict';


var EventDebug = duct.debug.EventDebug;

var func	= plankton.func;
var array	= plankton.array;


/**
 * @template T
 * 
 * @constructor
 * @class {duct.Event}
 * 
 * @property {Array<T>} _callbacks
 * @property {string} _name
 * @property {function(err)} _errorHandler
 * 
 * @param {string} name
 * @param {EventDebug=} debug
 */
function Event(name, debug) {
	this._callbacks	= [];
	this._name		= name || '';
	this._debug		= debug || Event.DEFAULT_DEBUG;
	
	
	this._errorHandler = function(err) {
		console.error('Error when executing event ' + this._name, err);
	};
}


/**
 * @param {Function} callback
 * @param {Array} callbackArgs
 * @private
 */
Event.prototype._triggerCallback = function(callback, callbackArgs) {
	var wrappedCallback = func.safe(callback, this._errorHandler);
	wrappedCallback = func.async(wrappedCallback); 
	wrappedCallback.apply(null, callbackArgs);
};


/**
 * @returns {string}
 */
Event.prototype.name = function name() {
	return this._name;
};

/**
 * @param {function(err)} handler
 */
Event.prototype.setErrorHandler = function(handler) {
	this._errorHandler = handler;
};

Event.prototype.clear = function() {
	this._callbacks = [];
};

/**
 * @param {T} callback
 * @return {Event}
 */
Event.prototype.add = function(callback) {
	this._callbacks.push(callback);
	return this;
};

/**
 * @param {T} callback
 * @return {Event}
 */
Event.prototype.remove = function(callback) {
	var index = this._callbacks.indexOf(callback);
	
	if (index >= 0) {
		this._callbacks.splice(index, 1);
	}
	
	return this;
};

/**
 * @returns {Number}
 */
Event.prototype.count = function count() {
	return this._callbacks.length;
};

/**
 * @type T
 */
Event.prototype.trigger = function() {
	var callbackArgs = [].slice.apply(arguments);
	var self = this;
	
	this._debug.onTrigger(this, callbackArgs);
		
	setTimeout(
		function() {
			array.forEach(self._callbacks, function(callback) {
				self._triggerCallback(callback, callbackArgs);
			});
		}, 0);
};


Event.DEFAULT_DEBUG = new EventDebug();


module.exports = {Event: Event};
	})(module);
	
	window.duct.mixin(module.exports);
})();
(function() {
	var module = {};
	
	(function(module) {
		"use strict";


var classify = duct.Classy.classify;


/**
 * @template T
 * 
 * @constructor
 * @class {duct.Listener}
 * 
 * @param {Event<T>} event
 * 
 * @property {Event<T>} _event
 */
function Listener(event) {
	this._event = event;
	classify(this);
}


/**
 * @param {T} callback
 * @return {Listener<T>}
 */
Listener.prototype.add = function add(callback) {
	this._event.add(callback);
	return this;
};

/**
 * @param {T} callback
 * @return {Listener<T>}
 */
Listener.prototype.remove = function add(callback) {
	this._event.remove(callback);
	return this;
};


module.exports = {Listener: Listener};
	})(module);
	
	window.duct.mixin(module.exports);
})();
(function() {
	var module = {};
	
	(function(module) {
		"use strict";


var Event		= duct.Event;
var Listener	= duct.Listener;

var is = plankton.is;


/**
 * @class {duct.Creator}
 */
var Creator = {
	
	/**
	 * @static
	 * @param {Event} event
	 * @return {function()}
	 */
	emptyTrigger: function(event) {
		return function() {
			event.trigger();
		}
	},

	/**
	 * @template T
	 * @static
	 * 
	 * @param {Event<T>} event
	 * @param {T=} callback
	 * @return {Listener<T>}
	 */
	listener: function listener(event, callback) {
		if (is(callback)) {
			event.add(callback);
		}
		
		return new Listener(event);
	},
	
	/**
	 * @template <T>
	 * @static
	 * 
	 * @param {*} target
	 * @param {string} name
	 * @param {string=} moduleName
	 * @return {Event<T>}
	 */
	registerEmptyEvent: function event(target, name, moduleName) {
		var fullName = name;
		var eventName = name;
		var invokeName = 'trigger' + name.charAt(0).toUpperCase() + name.slice(1);
		var event;
		
		if (is(moduleName)) {
			fullName = moduleName + '.' + name;
		}
		
		event = new Event(fullName);
		
		target[eventName] = function(callback) { 
			return Creator.listener(event, callback); 
		};
		
		target[invokeName] = function() {
			var args = Array.prototype.slice.call(arguments);
			event.trigger.apply(event, args);
		};
		
		return event;
	}
};


module.exports = {Creator: Creator};
	})(module);
	
	window.duct.mixin(module.exports);
})();
(function() {
	var module = {};
	
	(function(module) {
		"use strict";


/**
 * @template T
 * 
 * @constructor
 * @class {CachedEventHandler}
 * @memberOf {duct.handlers}
 * 
 * @property {T} _value
 * @property {Event} _event 
 * 
 * @param {Event<function(T)>} event
 * @param {*=} defaultValue
 */
function CachedEventHandler(event, defaultValue) {
	this._event = event;
	this._value = defaultValue;
	this._isSubscirbed = true;
	
	event.add((function(val) {
		this._value = val;
	}).bind(this));
}


/**
 * @param {T} data
 * @private
 */
CachedEventHandler.prototype._handle = function(data) {
	this._value = data;
};


/**
 * @return {T}
 */
CachedEventHandler.prototype.get = function() {
	return this._value;
};

CachedEventHandler.prototype.subscribe = function() {
	if (!this._isSubscirbed) {
		this._event.add(this._handle);
		this._isSubscirbed = true;
	}
};

CachedEventHandler.prototype.unSubscribe = function() {
	if (this._isSubscirbed) {
		this._event.remove(this._handle);
		this._isSubscirbed = false;
	}
};


module.exports = {handlers: {CachedEventHandler: CachedEventHandler}};
	})(module);
	
	window.duct.mixin(module.exports);
})();