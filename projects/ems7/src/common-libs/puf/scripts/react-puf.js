(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Puf = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

(function () {
  try {
    cachedSetTimeout = setTimeout;
  } catch (e) {
    cachedSetTimeout = function () {
      throw new Error('setTimeout is not defined');
    }
  }
  try {
    cachedClearTimeout = clearTimeout;
  } catch (e) {
    cachedClearTimeout = function () {
      throw new Error('clearTimeout is not defined');
    }
  }
} ())
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = cachedSetTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    cachedClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        cachedSetTimeout(drainQueue, 0);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],2:[function(require,module,exports){
/*!
  Copyright (c) 2016 Jed Watson.
  Licensed under the MIT License (MIT), see
  http://jedwatson.github.io/classnames
*/
/* global define */

(function () {
	'use strict';

	var hasOwn = {}.hasOwnProperty;

	function classNames () {
		var classes = [];

		for (var i = 0; i < arguments.length; i++) {
			var arg = arguments[i];
			if (!arg) continue;

			var argType = typeof arg;

			if (argType === 'string' || argType === 'number') {
				classes.push(arg);
			} else if (Array.isArray(arg)) {
				classes.push(classNames.apply(null, arg));
			} else if (argType === 'object') {
				for (var key in arg) {
					if (hasOwn.call(arg, key) && arg[key]) {
						classes.push(key);
					}
				}
			}
		}

		return classes.join(' ');
	}

	if (typeof module !== 'undefined' && module.exports) {
		module.exports = classNames;
	} else if (typeof define === 'function' && typeof define.amd === 'object' && define.amd) {
		// register as 'classnames', consistent with npm package name
		define('classnames', [], function () {
			return classNames;
		});
	} else {
		window.classNames = classNames;
	}
}());

},{}],3:[function(require,module,exports){
'use strict';
/* eslint-disable no-unused-vars */
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
	if (val === null || val === undefined) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

function shouldUseNative() {
	try {
		if (!Object.assign) {
			return false;
		}

		// Detect buggy property enumeration order in older V8 versions.

		// https://bugs.chromium.org/p/v8/issues/detail?id=4118
		var test1 = new String('abc');  // eslint-disable-line
		test1[5] = 'de';
		if (Object.getOwnPropertyNames(test1)[0] === '5') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test2 = {};
		for (var i = 0; i < 10; i++) {
			test2['_' + String.fromCharCode(i)] = i;
		}
		var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
			return test2[n];
		});
		if (order2.join('') !== '0123456789') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test3 = {};
		'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
			test3[letter] = letter;
		});
		if (Object.keys(Object.assign({}, test3)).join('') !==
				'abcdefghijklmnopqrst') {
			return false;
		}

		return true;
	} catch (e) {
		// We don't expect any of the above to throw, but better to be safe.
		return false;
	}
}

module.exports = shouldUseNative() ? Object.assign : function (target, source) {
	var from;
	var to = toObject(target);
	var symbols;

	for (var s = 1; s < arguments.length; s++) {
		from = Object(arguments[s]);

		for (var key in from) {
			if (hasOwnProperty.call(from, key)) {
				to[key] = from[key];
			}
		}

		if (Object.getOwnPropertySymbols) {
			symbols = Object.getOwnPropertySymbols(from);
			for (var i = 0; i < symbols.length; i++) {
				if (propIsEnumerable.call(from, symbols[i])) {
					to[symbols[i]] = from[symbols[i]];
				}
			}
		}
	}

	return to;
};

},{}],4:[function(require,module,exports){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule KeyEscapeUtils
 * 
 */

'use strict';

/**
 * Escape and wrap key so it is safe to use as a reactid
 *
 * @param {string} key to be escaped.
 * @return {string} the escaped key.
 */

function escape(key) {
  var escapeRegex = /[=:]/g;
  var escaperLookup = {
    '=': '=0',
    ':': '=2'
  };
  var escapedString = ('' + key).replace(escapeRegex, function (match) {
    return escaperLookup[match];
  });

  return '$' + escapedString;
}

/**
 * Unescape and unwrap key for human-readable display
 *
 * @param {string} key to unescape.
 * @return {string} the unescaped key.
 */
function unescape(key) {
  var unescapeRegex = /(=0|=2)/g;
  var unescaperLookup = {
    '=0': '=',
    '=2': ':'
  };
  var keySubstring = key[0] === '.' && key[1] === '$' ? key.substring(2) : key.substring(1);

  return ('' + keySubstring).replace(unescapeRegex, function (match) {
    return unescaperLookup[match];
  });
}

var KeyEscapeUtils = {
  escape: escape,
  unescape: unescape
};

module.exports = KeyEscapeUtils;
},{}],5:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule PooledClass
 */

'use strict';

var _prodInvariant = require('./reactProdInvariant');

var invariant = require('fbjs/lib/invariant');

/**
 * Static poolers. Several custom versions for each potential number of
 * arguments. A completely generic pooler is easy to implement, but would
 * require accessing the `arguments` object. In each of these, `this` refers to
 * the Class itself, not an instance. If any others are needed, simply add them
 * here, or in their own files.
 */
var oneArgumentPooler = function (copyFieldsFrom) {
  var Klass = this;
  if (Klass.instancePool.length) {
    var instance = Klass.instancePool.pop();
    Klass.call(instance, copyFieldsFrom);
    return instance;
  } else {
    return new Klass(copyFieldsFrom);
  }
};

var twoArgumentPooler = function (a1, a2) {
  var Klass = this;
  if (Klass.instancePool.length) {
    var instance = Klass.instancePool.pop();
    Klass.call(instance, a1, a2);
    return instance;
  } else {
    return new Klass(a1, a2);
  }
};

var threeArgumentPooler = function (a1, a2, a3) {
  var Klass = this;
  if (Klass.instancePool.length) {
    var instance = Klass.instancePool.pop();
    Klass.call(instance, a1, a2, a3);
    return instance;
  } else {
    return new Klass(a1, a2, a3);
  }
};

var fourArgumentPooler = function (a1, a2, a3, a4) {
  var Klass = this;
  if (Klass.instancePool.length) {
    var instance = Klass.instancePool.pop();
    Klass.call(instance, a1, a2, a3, a4);
    return instance;
  } else {
    return new Klass(a1, a2, a3, a4);
  }
};

var fiveArgumentPooler = function (a1, a2, a3, a4, a5) {
  var Klass = this;
  if (Klass.instancePool.length) {
    var instance = Klass.instancePool.pop();
    Klass.call(instance, a1, a2, a3, a4, a5);
    return instance;
  } else {
    return new Klass(a1, a2, a3, a4, a5);
  }
};

var standardReleaser = function (instance) {
  var Klass = this;
  !(instance instanceof Klass) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Trying to release an instance into a pool of a different type.') : _prodInvariant('25') : void 0;
  instance.destructor();
  if (Klass.instancePool.length < Klass.poolSize) {
    Klass.instancePool.push(instance);
  }
};

var DEFAULT_POOL_SIZE = 10;
var DEFAULT_POOLER = oneArgumentPooler;

/**
 * Augments `CopyConstructor` to be a poolable class, augmenting only the class
 * itself (statically) not adding any prototypical fields. Any CopyConstructor
 * you give this may have a `poolSize` property, and will look for a
 * prototypical `destructor` on instances.
 *
 * @param {Function} CopyConstructor Constructor that can be used to reset.
 * @param {Function} pooler Customizable pooler.
 */
var addPoolingTo = function (CopyConstructor, pooler) {
  var NewKlass = CopyConstructor;
  NewKlass.instancePool = [];
  NewKlass.getPooled = pooler || DEFAULT_POOLER;
  if (!NewKlass.poolSize) {
    NewKlass.poolSize = DEFAULT_POOL_SIZE;
  }
  NewKlass.release = standardReleaser;
  return NewKlass;
};

var PooledClass = {
  addPoolingTo: addPoolingTo,
  oneArgumentPooler: oneArgumentPooler,
  twoArgumentPooler: twoArgumentPooler,
  threeArgumentPooler: threeArgumentPooler,
  fourArgumentPooler: fourArgumentPooler,
  fiveArgumentPooler: fiveArgumentPooler
};

module.exports = PooledClass;
}).call(this,require('_process'))

},{"./reactProdInvariant":26,"_process":1,"fbjs/lib/invariant":30}],6:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule React
 */

'use strict';

var _assign = require('object-assign');

var ReactChildren = require('./ReactChildren');
var ReactComponent = require('./ReactComponent');
var ReactPureComponent = require('./ReactPureComponent');
var ReactClass = require('./ReactClass');
var ReactDOMFactories = require('./ReactDOMFactories');
var ReactElement = require('./ReactElement');
var ReactPropTypes = require('./ReactPropTypes');
var ReactVersion = require('./ReactVersion');

var onlyChild = require('./onlyChild');
var warning = require('fbjs/lib/warning');

var createElement = ReactElement.createElement;
var createFactory = ReactElement.createFactory;
var cloneElement = ReactElement.cloneElement;

if (process.env.NODE_ENV !== 'production') {
  var ReactElementValidator = require('./ReactElementValidator');
  createElement = ReactElementValidator.createElement;
  createFactory = ReactElementValidator.createFactory;
  cloneElement = ReactElementValidator.cloneElement;
}

var __spread = _assign;

if (process.env.NODE_ENV !== 'production') {
  var warned = false;
  __spread = function () {
    process.env.NODE_ENV !== 'production' ? warning(warned, 'React.__spread is deprecated and should not be used. Use ' + 'Object.assign directly or another helper function with similar ' + 'semantics. You may be seeing this warning due to your compiler. ' + 'See https://fb.me/react-spread-deprecation for more details.') : void 0;
    warned = true;
    return _assign.apply(null, arguments);
  };
}

var React = {

  // Modern

  Children: {
    map: ReactChildren.map,
    forEach: ReactChildren.forEach,
    count: ReactChildren.count,
    toArray: ReactChildren.toArray,
    only: onlyChild
  },

  Component: ReactComponent,
  PureComponent: ReactPureComponent,

  createElement: createElement,
  cloneElement: cloneElement,
  isValidElement: ReactElement.isValidElement,

  // Classic

  PropTypes: ReactPropTypes,
  createClass: ReactClass.createClass,
  createFactory: createFactory,
  createMixin: function (mixin) {
    // Currently a noop. Will be used to validate and trace mixins.
    return mixin;
  },

  // This looks DOM specific but these are actually isomorphic helpers
  // since they are just generating DOM strings.
  DOM: ReactDOMFactories,

  version: ReactVersion,

  // Deprecated hook for JSX spread, don't use this for anything.
  __spread: __spread
};

module.exports = React;
}).call(this,require('_process'))

},{"./ReactChildren":7,"./ReactClass":8,"./ReactComponent":9,"./ReactDOMFactories":12,"./ReactElement":13,"./ReactElementValidator":14,"./ReactPropTypes":18,"./ReactPureComponent":20,"./ReactVersion":21,"./onlyChild":25,"_process":1,"fbjs/lib/warning":33,"object-assign":3}],7:[function(require,module,exports){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactChildren
 */

'use strict';

var PooledClass = require('./PooledClass');
var ReactElement = require('./ReactElement');

var emptyFunction = require('fbjs/lib/emptyFunction');
var traverseAllChildren = require('./traverseAllChildren');

var twoArgumentPooler = PooledClass.twoArgumentPooler;
var fourArgumentPooler = PooledClass.fourArgumentPooler;

var userProvidedKeyEscapeRegex = /\/+/g;
function escapeUserProvidedKey(text) {
  return ('' + text).replace(userProvidedKeyEscapeRegex, '$&/');
}

/**
 * PooledClass representing the bookkeeping associated with performing a child
 * traversal. Allows avoiding binding callbacks.
 *
 * @constructor ForEachBookKeeping
 * @param {!function} forEachFunction Function to perform traversal with.
 * @param {?*} forEachContext Context to perform context with.
 */
function ForEachBookKeeping(forEachFunction, forEachContext) {
  this.func = forEachFunction;
  this.context = forEachContext;
  this.count = 0;
}
ForEachBookKeeping.prototype.destructor = function () {
  this.func = null;
  this.context = null;
  this.count = 0;
};
PooledClass.addPoolingTo(ForEachBookKeeping, twoArgumentPooler);

function forEachSingleChild(bookKeeping, child, name) {
  var func = bookKeeping.func;
  var context = bookKeeping.context;

  func.call(context, child, bookKeeping.count++);
}

/**
 * Iterates through children that are typically specified as `props.children`.
 *
 * See https://facebook.github.io/react/docs/top-level-api.html#react.children.foreach
 *
 * The provided forEachFunc(child, index) will be called for each
 * leaf child.
 *
 * @param {?*} children Children tree container.
 * @param {function(*, int)} forEachFunc
 * @param {*} forEachContext Context for forEachContext.
 */
function forEachChildren(children, forEachFunc, forEachContext) {
  if (children == null) {
    return children;
  }
  var traverseContext = ForEachBookKeeping.getPooled(forEachFunc, forEachContext);
  traverseAllChildren(children, forEachSingleChild, traverseContext);
  ForEachBookKeeping.release(traverseContext);
}

/**
 * PooledClass representing the bookkeeping associated with performing a child
 * mapping. Allows avoiding binding callbacks.
 *
 * @constructor MapBookKeeping
 * @param {!*} mapResult Object containing the ordered map of results.
 * @param {!function} mapFunction Function to perform mapping with.
 * @param {?*} mapContext Context to perform mapping with.
 */
function MapBookKeeping(mapResult, keyPrefix, mapFunction, mapContext) {
  this.result = mapResult;
  this.keyPrefix = keyPrefix;
  this.func = mapFunction;
  this.context = mapContext;
  this.count = 0;
}
MapBookKeeping.prototype.destructor = function () {
  this.result = null;
  this.keyPrefix = null;
  this.func = null;
  this.context = null;
  this.count = 0;
};
PooledClass.addPoolingTo(MapBookKeeping, fourArgumentPooler);

function mapSingleChildIntoContext(bookKeeping, child, childKey) {
  var result = bookKeeping.result;
  var keyPrefix = bookKeeping.keyPrefix;
  var func = bookKeeping.func;
  var context = bookKeeping.context;


  var mappedChild = func.call(context, child, bookKeeping.count++);
  if (Array.isArray(mappedChild)) {
    mapIntoWithKeyPrefixInternal(mappedChild, result, childKey, emptyFunction.thatReturnsArgument);
  } else if (mappedChild != null) {
    if (ReactElement.isValidElement(mappedChild)) {
      mappedChild = ReactElement.cloneAndReplaceKey(mappedChild,
      // Keep both the (mapped) and old keys if they differ, just as
      // traverseAllChildren used to do for objects as children
      keyPrefix + (mappedChild.key && (!child || child.key !== mappedChild.key) ? escapeUserProvidedKey(mappedChild.key) + '/' : '') + childKey);
    }
    result.push(mappedChild);
  }
}

function mapIntoWithKeyPrefixInternal(children, array, prefix, func, context) {
  var escapedPrefix = '';
  if (prefix != null) {
    escapedPrefix = escapeUserProvidedKey(prefix) + '/';
  }
  var traverseContext = MapBookKeeping.getPooled(array, escapedPrefix, func, context);
  traverseAllChildren(children, mapSingleChildIntoContext, traverseContext);
  MapBookKeeping.release(traverseContext);
}

/**
 * Maps children that are typically specified as `props.children`.
 *
 * See https://facebook.github.io/react/docs/top-level-api.html#react.children.map
 *
 * The provided mapFunction(child, key, index) will be called for each
 * leaf child.
 *
 * @param {?*} children Children tree container.
 * @param {function(*, int)} func The map function.
 * @param {*} context Context for mapFunction.
 * @return {object} Object containing the ordered map of results.
 */
function mapChildren(children, func, context) {
  if (children == null) {
    return children;
  }
  var result = [];
  mapIntoWithKeyPrefixInternal(children, result, null, func, context);
  return result;
}

function forEachSingleChildDummy(traverseContext, child, name) {
  return null;
}

/**
 * Count the number of children that are typically specified as
 * `props.children`.
 *
 * See https://facebook.github.io/react/docs/top-level-api.html#react.children.count
 *
 * @param {?*} children Children tree container.
 * @return {number} The number of children.
 */
function countChildren(children, context) {
  return traverseAllChildren(children, forEachSingleChildDummy, null);
}

/**
 * Flatten a children object (typically specified as `props.children`) and
 * return an array with appropriately re-keyed children.
 *
 * See https://facebook.github.io/react/docs/top-level-api.html#react.children.toarray
 */
function toArray(children) {
  var result = [];
  mapIntoWithKeyPrefixInternal(children, result, null, emptyFunction.thatReturnsArgument);
  return result;
}

var ReactChildren = {
  forEach: forEachChildren,
  map: mapChildren,
  mapIntoWithKeyPrefixInternal: mapIntoWithKeyPrefixInternal,
  count: countChildren,
  toArray: toArray
};

module.exports = ReactChildren;
},{"./PooledClass":5,"./ReactElement":13,"./traverseAllChildren":27,"fbjs/lib/emptyFunction":28}],8:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactClass
 */

'use strict';

var _prodInvariant = require('./reactProdInvariant'),
    _assign = require('object-assign');

var ReactComponent = require('./ReactComponent');
var ReactElement = require('./ReactElement');
var ReactPropTypeLocations = require('./ReactPropTypeLocations');
var ReactPropTypeLocationNames = require('./ReactPropTypeLocationNames');
var ReactNoopUpdateQueue = require('./ReactNoopUpdateQueue');

var emptyObject = require('fbjs/lib/emptyObject');
var invariant = require('fbjs/lib/invariant');
var keyMirror = require('fbjs/lib/keyMirror');
var keyOf = require('fbjs/lib/keyOf');
var warning = require('fbjs/lib/warning');

var MIXINS_KEY = keyOf({ mixins: null });

/**
 * Policies that describe methods in `ReactClassInterface`.
 */
var SpecPolicy = keyMirror({
  /**
   * These methods may be defined only once by the class specification or mixin.
   */
  DEFINE_ONCE: null,
  /**
   * These methods may be defined by both the class specification and mixins.
   * Subsequent definitions will be chained. These methods must return void.
   */
  DEFINE_MANY: null,
  /**
   * These methods are overriding the base class.
   */
  OVERRIDE_BASE: null,
  /**
   * These methods are similar to DEFINE_MANY, except we assume they return
   * objects. We try to merge the keys of the return values of all the mixed in
   * functions. If there is a key conflict we throw.
   */
  DEFINE_MANY_MERGED: null
});

var injectedMixins = [];

/**
 * Composite components are higher-level components that compose other composite
 * or host components.
 *
 * To create a new type of `ReactClass`, pass a specification of
 * your new class to `React.createClass`. The only requirement of your class
 * specification is that you implement a `render` method.
 *
 *   var MyComponent = React.createClass({
 *     render: function() {
 *       return <div>Hello World</div>;
 *     }
 *   });
 *
 * The class specification supports a specific protocol of methods that have
 * special meaning (e.g. `render`). See `ReactClassInterface` for
 * more the comprehensive protocol. Any other properties and methods in the
 * class specification will be available on the prototype.
 *
 * @interface ReactClassInterface
 * @internal
 */
var ReactClassInterface = {

  /**
   * An array of Mixin objects to include when defining your component.
   *
   * @type {array}
   * @optional
   */
  mixins: SpecPolicy.DEFINE_MANY,

  /**
   * An object containing properties and methods that should be defined on
   * the component's constructor instead of its prototype (static methods).
   *
   * @type {object}
   * @optional
   */
  statics: SpecPolicy.DEFINE_MANY,

  /**
   * Definition of prop types for this component.
   *
   * @type {object}
   * @optional
   */
  propTypes: SpecPolicy.DEFINE_MANY,

  /**
   * Definition of context types for this component.
   *
   * @type {object}
   * @optional
   */
  contextTypes: SpecPolicy.DEFINE_MANY,

  /**
   * Definition of context types this component sets for its children.
   *
   * @type {object}
   * @optional
   */
  childContextTypes: SpecPolicy.DEFINE_MANY,

  // ==== Definition methods ====

  /**
   * Invoked when the component is mounted. Values in the mapping will be set on
   * `this.props` if that prop is not specified (i.e. using an `in` check).
   *
   * This method is invoked before `getInitialState` and therefore cannot rely
   * on `this.state` or use `this.setState`.
   *
   * @return {object}
   * @optional
   */
  getDefaultProps: SpecPolicy.DEFINE_MANY_MERGED,

  /**
   * Invoked once before the component is mounted. The return value will be used
   * as the initial value of `this.state`.
   *
   *   getInitialState: function() {
   *     return {
   *       isOn: false,
   *       fooBaz: new BazFoo()
   *     }
   *   }
   *
   * @return {object}
   * @optional
   */
  getInitialState: SpecPolicy.DEFINE_MANY_MERGED,

  /**
   * @return {object}
   * @optional
   */
  getChildContext: SpecPolicy.DEFINE_MANY_MERGED,

  /**
   * Uses props from `this.props` and state from `this.state` to render the
   * structure of the component.
   *
   * No guarantees are made about when or how often this method is invoked, so
   * it must not have side effects.
   *
   *   render: function() {
   *     var name = this.props.name;
   *     return <div>Hello, {name}!</div>;
   *   }
   *
   * @return {ReactComponent}
   * @nosideeffects
   * @required
   */
  render: SpecPolicy.DEFINE_ONCE,

  // ==== Delegate methods ====

  /**
   * Invoked when the component is initially created and about to be mounted.
   * This may have side effects, but any external subscriptions or data created
   * by this method must be cleaned up in `componentWillUnmount`.
   *
   * @optional
   */
  componentWillMount: SpecPolicy.DEFINE_MANY,

  /**
   * Invoked when the component has been mounted and has a DOM representation.
   * However, there is no guarantee that the DOM node is in the document.
   *
   * Use this as an opportunity to operate on the DOM when the component has
   * been mounted (initialized and rendered) for the first time.
   *
   * @param {DOMElement} rootNode DOM element representing the component.
   * @optional
   */
  componentDidMount: SpecPolicy.DEFINE_MANY,

  /**
   * Invoked before the component receives new props.
   *
   * Use this as an opportunity to react to a prop transition by updating the
   * state using `this.setState`. Current props are accessed via `this.props`.
   *
   *   componentWillReceiveProps: function(nextProps, nextContext) {
   *     this.setState({
   *       likesIncreasing: nextProps.likeCount > this.props.likeCount
   *     });
   *   }
   *
   * NOTE: There is no equivalent `componentWillReceiveState`. An incoming prop
   * transition may cause a state change, but the opposite is not true. If you
   * need it, you are probably looking for `componentWillUpdate`.
   *
   * @param {object} nextProps
   * @optional
   */
  componentWillReceiveProps: SpecPolicy.DEFINE_MANY,

  /**
   * Invoked while deciding if the component should be updated as a result of
   * receiving new props, state and/or context.
   *
   * Use this as an opportunity to `return false` when you're certain that the
   * transition to the new props/state/context will not require a component
   * update.
   *
   *   shouldComponentUpdate: function(nextProps, nextState, nextContext) {
   *     return !equal(nextProps, this.props) ||
   *       !equal(nextState, this.state) ||
   *       !equal(nextContext, this.context);
   *   }
   *
   * @param {object} nextProps
   * @param {?object} nextState
   * @param {?object} nextContext
   * @return {boolean} True if the component should update.
   * @optional
   */
  shouldComponentUpdate: SpecPolicy.DEFINE_ONCE,

  /**
   * Invoked when the component is about to update due to a transition from
   * `this.props`, `this.state` and `this.context` to `nextProps`, `nextState`
   * and `nextContext`.
   *
   * Use this as an opportunity to perform preparation before an update occurs.
   *
   * NOTE: You **cannot** use `this.setState()` in this method.
   *
   * @param {object} nextProps
   * @param {?object} nextState
   * @param {?object} nextContext
   * @param {ReactReconcileTransaction} transaction
   * @optional
   */
  componentWillUpdate: SpecPolicy.DEFINE_MANY,

  /**
   * Invoked when the component's DOM representation has been updated.
   *
   * Use this as an opportunity to operate on the DOM when the component has
   * been updated.
   *
   * @param {object} prevProps
   * @param {?object} prevState
   * @param {?object} prevContext
   * @param {DOMElement} rootNode DOM element representing the component.
   * @optional
   */
  componentDidUpdate: SpecPolicy.DEFINE_MANY,

  /**
   * Invoked when the component is about to be removed from its parent and have
   * its DOM representation destroyed.
   *
   * Use this as an opportunity to deallocate any external resources.
   *
   * NOTE: There is no `componentDidUnmount` since your component will have been
   * destroyed by that point.
   *
   * @optional
   */
  componentWillUnmount: SpecPolicy.DEFINE_MANY,

  // ==== Advanced methods ====

  /**
   * Updates the component's currently mounted DOM representation.
   *
   * By default, this implements React's rendering and reconciliation algorithm.
   * Sophisticated clients may wish to override this.
   *
   * @param {ReactReconcileTransaction} transaction
   * @internal
   * @overridable
   */
  updateComponent: SpecPolicy.OVERRIDE_BASE

};

/**
 * Mapping from class specification keys to special processing functions.
 *
 * Although these are declared like instance properties in the specification
 * when defining classes using `React.createClass`, they are actually static
 * and are accessible on the constructor instead of the prototype. Despite
 * being static, they must be defined outside of the "statics" key under
 * which all other static methods are defined.
 */
var RESERVED_SPEC_KEYS = {
  displayName: function (Constructor, displayName) {
    Constructor.displayName = displayName;
  },
  mixins: function (Constructor, mixins) {
    if (mixins) {
      for (var i = 0; i < mixins.length; i++) {
        mixSpecIntoComponent(Constructor, mixins[i]);
      }
    }
  },
  childContextTypes: function (Constructor, childContextTypes) {
    if (process.env.NODE_ENV !== 'production') {
      validateTypeDef(Constructor, childContextTypes, ReactPropTypeLocations.childContext);
    }
    Constructor.childContextTypes = _assign({}, Constructor.childContextTypes, childContextTypes);
  },
  contextTypes: function (Constructor, contextTypes) {
    if (process.env.NODE_ENV !== 'production') {
      validateTypeDef(Constructor, contextTypes, ReactPropTypeLocations.context);
    }
    Constructor.contextTypes = _assign({}, Constructor.contextTypes, contextTypes);
  },
  /**
   * Special case getDefaultProps which should move into statics but requires
   * automatic merging.
   */
  getDefaultProps: function (Constructor, getDefaultProps) {
    if (Constructor.getDefaultProps) {
      Constructor.getDefaultProps = createMergedResultFunction(Constructor.getDefaultProps, getDefaultProps);
    } else {
      Constructor.getDefaultProps = getDefaultProps;
    }
  },
  propTypes: function (Constructor, propTypes) {
    if (process.env.NODE_ENV !== 'production') {
      validateTypeDef(Constructor, propTypes, ReactPropTypeLocations.prop);
    }
    Constructor.propTypes = _assign({}, Constructor.propTypes, propTypes);
  },
  statics: function (Constructor, statics) {
    mixStaticSpecIntoComponent(Constructor, statics);
  },
  autobind: function () {} };

// noop
function validateTypeDef(Constructor, typeDef, location) {
  for (var propName in typeDef) {
    if (typeDef.hasOwnProperty(propName)) {
      // use a warning instead of an invariant so components
      // don't show up in prod but only in __DEV__
      process.env.NODE_ENV !== 'production' ? warning(typeof typeDef[propName] === 'function', '%s: %s type `%s` is invalid; it must be a function, usually from ' + 'React.PropTypes.', Constructor.displayName || 'ReactClass', ReactPropTypeLocationNames[location], propName) : void 0;
    }
  }
}

function validateMethodOverride(isAlreadyDefined, name) {
  var specPolicy = ReactClassInterface.hasOwnProperty(name) ? ReactClassInterface[name] : null;

  // Disallow overriding of base class methods unless explicitly allowed.
  if (ReactClassMixin.hasOwnProperty(name)) {
    !(specPolicy === SpecPolicy.OVERRIDE_BASE) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'ReactClassInterface: You are attempting to override `%s` from your class specification. Ensure that your method names do not overlap with React methods.', name) : _prodInvariant('73', name) : void 0;
  }

  // Disallow defining methods more than once unless explicitly allowed.
  if (isAlreadyDefined) {
    !(specPolicy === SpecPolicy.DEFINE_MANY || specPolicy === SpecPolicy.DEFINE_MANY_MERGED) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'ReactClassInterface: You are attempting to define `%s` on your component more than once. This conflict may be due to a mixin.', name) : _prodInvariant('74', name) : void 0;
  }
}

/**
 * Mixin helper which handles policy validation and reserved
 * specification keys when building React classes.
 */
function mixSpecIntoComponent(Constructor, spec) {
  if (!spec) {
    if (process.env.NODE_ENV !== 'production') {
      var typeofSpec = typeof spec;
      var isMixinValid = typeofSpec === 'object' && spec !== null;

      process.env.NODE_ENV !== 'production' ? warning(isMixinValid, '%s: You\'re attempting to include a mixin that is either null ' + 'or not an object. Check the mixins included by the component, ' + 'as well as any mixins they include themselves. ' + 'Expected object but got %s.', Constructor.displayName || 'ReactClass', spec === null ? null : typeofSpec) : void 0;
    }

    return;
  }

  !(typeof spec !== 'function') ? process.env.NODE_ENV !== 'production' ? invariant(false, 'ReactClass: You\'re attempting to use a component class or function as a mixin. Instead, just use a regular object.') : _prodInvariant('75') : void 0;
  !!ReactElement.isValidElement(spec) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'ReactClass: You\'re attempting to use a component as a mixin. Instead, just use a regular object.') : _prodInvariant('76') : void 0;

  var proto = Constructor.prototype;
  var autoBindPairs = proto.__reactAutoBindPairs;

  // By handling mixins before any other properties, we ensure the same
  // chaining order is applied to methods with DEFINE_MANY policy, whether
  // mixins are listed before or after these methods in the spec.
  if (spec.hasOwnProperty(MIXINS_KEY)) {
    RESERVED_SPEC_KEYS.mixins(Constructor, spec.mixins);
  }

  for (var name in spec) {
    if (!spec.hasOwnProperty(name)) {
      continue;
    }

    if (name === MIXINS_KEY) {
      // We have already handled mixins in a special case above.
      continue;
    }

    var property = spec[name];
    var isAlreadyDefined = proto.hasOwnProperty(name);
    validateMethodOverride(isAlreadyDefined, name);

    if (RESERVED_SPEC_KEYS.hasOwnProperty(name)) {
      RESERVED_SPEC_KEYS[name](Constructor, property);
    } else {
      // Setup methods on prototype:
      // The following member methods should not be automatically bound:
      // 1. Expected ReactClass methods (in the "interface").
      // 2. Overridden methods (that were mixed in).
      var isReactClassMethod = ReactClassInterface.hasOwnProperty(name);
      var isFunction = typeof property === 'function';
      var shouldAutoBind = isFunction && !isReactClassMethod && !isAlreadyDefined && spec.autobind !== false;

      if (shouldAutoBind) {
        autoBindPairs.push(name, property);
        proto[name] = property;
      } else {
        if (isAlreadyDefined) {
          var specPolicy = ReactClassInterface[name];

          // These cases should already be caught by validateMethodOverride.
          !(isReactClassMethod && (specPolicy === SpecPolicy.DEFINE_MANY_MERGED || specPolicy === SpecPolicy.DEFINE_MANY)) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'ReactClass: Unexpected spec policy %s for key %s when mixing in component specs.', specPolicy, name) : _prodInvariant('77', specPolicy, name) : void 0;

          // For methods which are defined more than once, call the existing
          // methods before calling the new property, merging if appropriate.
          if (specPolicy === SpecPolicy.DEFINE_MANY_MERGED) {
            proto[name] = createMergedResultFunction(proto[name], property);
          } else if (specPolicy === SpecPolicy.DEFINE_MANY) {
            proto[name] = createChainedFunction(proto[name], property);
          }
        } else {
          proto[name] = property;
          if (process.env.NODE_ENV !== 'production') {
            // Add verbose displayName to the function, which helps when looking
            // at profiling tools.
            if (typeof property === 'function' && spec.displayName) {
              proto[name].displayName = spec.displayName + '_' + name;
            }
          }
        }
      }
    }
  }
}

function mixStaticSpecIntoComponent(Constructor, statics) {
  if (!statics) {
    return;
  }
  for (var name in statics) {
    var property = statics[name];
    if (!statics.hasOwnProperty(name)) {
      continue;
    }

    var isReserved = name in RESERVED_SPEC_KEYS;
    !!isReserved ? process.env.NODE_ENV !== 'production' ? invariant(false, 'ReactClass: You are attempting to define a reserved property, `%s`, that shouldn\'t be on the "statics" key. Define it as an instance property instead; it will still be accessible on the constructor.', name) : _prodInvariant('78', name) : void 0;

    var isInherited = name in Constructor;
    !!isInherited ? process.env.NODE_ENV !== 'production' ? invariant(false, 'ReactClass: You are attempting to define `%s` on your component more than once. This conflict may be due to a mixin.', name) : _prodInvariant('79', name) : void 0;
    Constructor[name] = property;
  }
}

/**
 * Merge two objects, but throw if both contain the same key.
 *
 * @param {object} one The first object, which is mutated.
 * @param {object} two The second object
 * @return {object} one after it has been mutated to contain everything in two.
 */
function mergeIntoWithNoDuplicateKeys(one, two) {
  !(one && two && typeof one === 'object' && typeof two === 'object') ? process.env.NODE_ENV !== 'production' ? invariant(false, 'mergeIntoWithNoDuplicateKeys(): Cannot merge non-objects.') : _prodInvariant('80') : void 0;

  for (var key in two) {
    if (two.hasOwnProperty(key)) {
      !(one[key] === undefined) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'mergeIntoWithNoDuplicateKeys(): Tried to merge two objects with the same key: `%s`. This conflict may be due to a mixin; in particular, this may be caused by two getInitialState() or getDefaultProps() methods returning objects with clashing keys.', key) : _prodInvariant('81', key) : void 0;
      one[key] = two[key];
    }
  }
  return one;
}

/**
 * Creates a function that invokes two functions and merges their return values.
 *
 * @param {function} one Function to invoke first.
 * @param {function} two Function to invoke second.
 * @return {function} Function that invokes the two argument functions.
 * @private
 */
function createMergedResultFunction(one, two) {
  return function mergedResult() {
    var a = one.apply(this, arguments);
    var b = two.apply(this, arguments);
    if (a == null) {
      return b;
    } else if (b == null) {
      return a;
    }
    var c = {};
    mergeIntoWithNoDuplicateKeys(c, a);
    mergeIntoWithNoDuplicateKeys(c, b);
    return c;
  };
}

/**
 * Creates a function that invokes two functions and ignores their return vales.
 *
 * @param {function} one Function to invoke first.
 * @param {function} two Function to invoke second.
 * @return {function} Function that invokes the two argument functions.
 * @private
 */
function createChainedFunction(one, two) {
  return function chainedFunction() {
    one.apply(this, arguments);
    two.apply(this, arguments);
  };
}

/**
 * Binds a method to the component.
 *
 * @param {object} component Component whose method is going to be bound.
 * @param {function} method Method to be bound.
 * @return {function} The bound method.
 */
function bindAutoBindMethod(component, method) {
  var boundMethod = method.bind(component);
  if (process.env.NODE_ENV !== 'production') {
    boundMethod.__reactBoundContext = component;
    boundMethod.__reactBoundMethod = method;
    boundMethod.__reactBoundArguments = null;
    var componentName = component.constructor.displayName;
    var _bind = boundMethod.bind;
    boundMethod.bind = function (newThis) {
      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      // User is trying to bind() an autobound method; we effectively will
      // ignore the value of "this" that the user is trying to use, so
      // let's warn.
      if (newThis !== component && newThis !== null) {
        process.env.NODE_ENV !== 'production' ? warning(false, 'bind(): React component methods may only be bound to the ' + 'component instance. See %s', componentName) : void 0;
      } else if (!args.length) {
        process.env.NODE_ENV !== 'production' ? warning(false, 'bind(): You are binding a component method to the component. ' + 'React does this for you automatically in a high-performance ' + 'way, so you can safely remove this call. See %s', componentName) : void 0;
        return boundMethod;
      }
      var reboundMethod = _bind.apply(boundMethod, arguments);
      reboundMethod.__reactBoundContext = component;
      reboundMethod.__reactBoundMethod = method;
      reboundMethod.__reactBoundArguments = args;
      return reboundMethod;
    };
  }
  return boundMethod;
}

/**
 * Binds all auto-bound methods in a component.
 *
 * @param {object} component Component whose method is going to be bound.
 */
function bindAutoBindMethods(component) {
  var pairs = component.__reactAutoBindPairs;
  for (var i = 0; i < pairs.length; i += 2) {
    var autoBindKey = pairs[i];
    var method = pairs[i + 1];
    component[autoBindKey] = bindAutoBindMethod(component, method);
  }
}

/**
 * Add more to the ReactClass base class. These are all legacy features and
 * therefore not already part of the modern ReactComponent.
 */
var ReactClassMixin = {

  /**
   * TODO: This will be deprecated because state should always keep a consistent
   * type signature and the only use case for this, is to avoid that.
   */
  replaceState: function (newState, callback) {
    this.updater.enqueueReplaceState(this, newState);
    if (callback) {
      this.updater.enqueueCallback(this, callback, 'replaceState');
    }
  },

  /**
   * Checks whether or not this composite component is mounted.
   * @return {boolean} True if mounted, false otherwise.
   * @protected
   * @final
   */
  isMounted: function () {
    return this.updater.isMounted(this);
  }
};

var ReactClassComponent = function () {};
_assign(ReactClassComponent.prototype, ReactComponent.prototype, ReactClassMixin);

/**
 * Module for creating composite components.
 *
 * @class ReactClass
 */
var ReactClass = {

  /**
   * Creates a composite component class given a class specification.
   * See https://facebook.github.io/react/docs/top-level-api.html#react.createclass
   *
   * @param {object} spec Class specification (which must define `render`).
   * @return {function} Component constructor function.
   * @public
   */
  createClass: function (spec) {
    var Constructor = function (props, context, updater) {
      // This constructor gets overridden by mocks. The argument is used
      // by mocks to assert on what gets mounted.

      if (process.env.NODE_ENV !== 'production') {
        process.env.NODE_ENV !== 'production' ? warning(this instanceof Constructor, 'Something is calling a React component directly. Use a factory or ' + 'JSX instead. See: https://fb.me/react-legacyfactory') : void 0;
      }

      // Wire up auto-binding
      if (this.__reactAutoBindPairs.length) {
        bindAutoBindMethods(this);
      }

      this.props = props;
      this.context = context;
      this.refs = emptyObject;
      this.updater = updater || ReactNoopUpdateQueue;

      this.state = null;

      // ReactClasses doesn't have constructors. Instead, they use the
      // getInitialState and componentWillMount methods for initialization.

      var initialState = this.getInitialState ? this.getInitialState() : null;
      if (process.env.NODE_ENV !== 'production') {
        // We allow auto-mocks to proceed as if they're returning null.
        if (initialState === undefined && this.getInitialState._isMockFunction) {
          // This is probably bad practice. Consider warning here and
          // deprecating this convenience.
          initialState = null;
        }
      }
      !(typeof initialState === 'object' && !Array.isArray(initialState)) ? process.env.NODE_ENV !== 'production' ? invariant(false, '%s.getInitialState(): must return an object or null', Constructor.displayName || 'ReactCompositeComponent') : _prodInvariant('82', Constructor.displayName || 'ReactCompositeComponent') : void 0;

      this.state = initialState;
    };
    Constructor.prototype = new ReactClassComponent();
    Constructor.prototype.constructor = Constructor;
    Constructor.prototype.__reactAutoBindPairs = [];

    injectedMixins.forEach(mixSpecIntoComponent.bind(null, Constructor));

    mixSpecIntoComponent(Constructor, spec);

    // Initialize the defaultProps property after all mixins have been merged.
    if (Constructor.getDefaultProps) {
      Constructor.defaultProps = Constructor.getDefaultProps();
    }

    if (process.env.NODE_ENV !== 'production') {
      // This is a tag to indicate that the use of these method names is ok,
      // since it's used with createClass. If it's not, then it's likely a
      // mistake so we'll warn you to use the static property, property
      // initializer or constructor respectively.
      if (Constructor.getDefaultProps) {
        Constructor.getDefaultProps.isReactClassApproved = {};
      }
      if (Constructor.prototype.getInitialState) {
        Constructor.prototype.getInitialState.isReactClassApproved = {};
      }
    }

    !Constructor.prototype.render ? process.env.NODE_ENV !== 'production' ? invariant(false, 'createClass(...): Class specification must implement a `render` method.') : _prodInvariant('83') : void 0;

    if (process.env.NODE_ENV !== 'production') {
      process.env.NODE_ENV !== 'production' ? warning(!Constructor.prototype.componentShouldUpdate, '%s has a method called ' + 'componentShouldUpdate(). Did you mean shouldComponentUpdate()? ' + 'The name is phrased as a question because the function is ' + 'expected to return a value.', spec.displayName || 'A component') : void 0;
      process.env.NODE_ENV !== 'production' ? warning(!Constructor.prototype.componentWillRecieveProps, '%s has a method called ' + 'componentWillRecieveProps(). Did you mean componentWillReceiveProps()?', spec.displayName || 'A component') : void 0;
    }

    // Reduce time spent doing lookups by setting these on the prototype.
    for (var methodName in ReactClassInterface) {
      if (!Constructor.prototype[methodName]) {
        Constructor.prototype[methodName] = null;
      }
    }

    return Constructor;
  },

  injection: {
    injectMixin: function (mixin) {
      injectedMixins.push(mixin);
    }
  }

};

module.exports = ReactClass;
}).call(this,require('_process'))

},{"./ReactComponent":9,"./ReactElement":13,"./ReactNoopUpdateQueue":15,"./ReactPropTypeLocationNames":16,"./ReactPropTypeLocations":17,"./reactProdInvariant":26,"_process":1,"fbjs/lib/emptyObject":29,"fbjs/lib/invariant":30,"fbjs/lib/keyMirror":31,"fbjs/lib/keyOf":32,"fbjs/lib/warning":33,"object-assign":3}],9:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactComponent
 */

'use strict';

var _prodInvariant = require('./reactProdInvariant');

var ReactNoopUpdateQueue = require('./ReactNoopUpdateQueue');

var canDefineProperty = require('./canDefineProperty');
var emptyObject = require('fbjs/lib/emptyObject');
var invariant = require('fbjs/lib/invariant');
var warning = require('fbjs/lib/warning');

/**
 * Base class helpers for the updating state of a component.
 */
function ReactComponent(props, context, updater) {
  this.props = props;
  this.context = context;
  this.refs = emptyObject;
  // We initialize the default updater but the real one gets injected by the
  // renderer.
  this.updater = updater || ReactNoopUpdateQueue;
}

ReactComponent.prototype.isReactComponent = {};

/**
 * Sets a subset of the state. Always use this to mutate
 * state. You should treat `this.state` as immutable.
 *
 * There is no guarantee that `this.state` will be immediately updated, so
 * accessing `this.state` after calling this method may return the old value.
 *
 * There is no guarantee that calls to `setState` will run synchronously,
 * as they may eventually be batched together.  You can provide an optional
 * callback that will be executed when the call to setState is actually
 * completed.
 *
 * When a function is provided to setState, it will be called at some point in
 * the future (not synchronously). It will be called with the up to date
 * component arguments (state, props, context). These values can be different
 * from this.* because your function may be called after receiveProps but before
 * shouldComponentUpdate, and this new state, props, and context will not yet be
 * assigned to this.
 *
 * @param {object|function} partialState Next partial state or function to
 *        produce next partial state to be merged with current state.
 * @param {?function} callback Called after state is updated.
 * @final
 * @protected
 */
ReactComponent.prototype.setState = function (partialState, callback) {
  !(typeof partialState === 'object' || typeof partialState === 'function' || partialState == null) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'setState(...): takes an object of state variables to update or a function which returns an object of state variables.') : _prodInvariant('85') : void 0;
  this.updater.enqueueSetState(this, partialState);
  if (callback) {
    this.updater.enqueueCallback(this, callback, 'setState');
  }
};

/**
 * Forces an update. This should only be invoked when it is known with
 * certainty that we are **not** in a DOM transaction.
 *
 * You may want to call this when you know that some deeper aspect of the
 * component's state has changed but `setState` was not called.
 *
 * This will not invoke `shouldComponentUpdate`, but it will invoke
 * `componentWillUpdate` and `componentDidUpdate`.
 *
 * @param {?function} callback Called after update is complete.
 * @final
 * @protected
 */
ReactComponent.prototype.forceUpdate = function (callback) {
  this.updater.enqueueForceUpdate(this);
  if (callback) {
    this.updater.enqueueCallback(this, callback, 'forceUpdate');
  }
};

/**
 * Deprecated APIs. These APIs used to exist on classic React classes but since
 * we would like to deprecate them, we're not going to move them over to this
 * modern base class. Instead, we define a getter that warns if it's accessed.
 */
if (process.env.NODE_ENV !== 'production') {
  var deprecatedAPIs = {
    isMounted: ['isMounted', 'Instead, make sure to clean up subscriptions and pending requests in ' + 'componentWillUnmount to prevent memory leaks.'],
    replaceState: ['replaceState', 'Refactor your code to use setState instead (see ' + 'https://github.com/facebook/react/issues/3236).']
  };
  var defineDeprecationWarning = function (methodName, info) {
    if (canDefineProperty) {
      Object.defineProperty(ReactComponent.prototype, methodName, {
        get: function () {
          process.env.NODE_ENV !== 'production' ? warning(false, '%s(...) is deprecated in plain JavaScript React classes. %s', info[0], info[1]) : void 0;
          return undefined;
        }
      });
    }
  };
  for (var fnName in deprecatedAPIs) {
    if (deprecatedAPIs.hasOwnProperty(fnName)) {
      defineDeprecationWarning(fnName, deprecatedAPIs[fnName]);
    }
  }
}

module.exports = ReactComponent;
}).call(this,require('_process'))

},{"./ReactNoopUpdateQueue":15,"./canDefineProperty":22,"./reactProdInvariant":26,"_process":1,"fbjs/lib/emptyObject":29,"fbjs/lib/invariant":30,"fbjs/lib/warning":33}],10:[function(require,module,exports){
(function (process){
/**
 * Copyright 2016-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactComponentTreeHook
 */

'use strict';

var _prodInvariant = require('./reactProdInvariant');

var ReactCurrentOwner = require('./ReactCurrentOwner');

var invariant = require('fbjs/lib/invariant');
var warning = require('fbjs/lib/warning');

function isNative(fn) {
  // Based on isNative() from Lodash
  var funcToString = Function.prototype.toString;
  var hasOwnProperty = Object.prototype.hasOwnProperty;
  var reIsNative = RegExp('^' + funcToString
  // Take an example native function source for comparison
  .call(hasOwnProperty)
  // Strip regex characters so we can use it for regex
  .replace(/[\\^$.*+?()[\]{}|]/g, '\\$&')
  // Remove hasOwnProperty from the template to make it generic
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$');
  try {
    var source = funcToString.call(fn);
    return reIsNative.test(source);
  } catch (err) {
    return false;
  }
}

var canUseCollections =
// Array.from
typeof Array.from === 'function' &&
// Map
typeof Map === 'function' && isNative(Map) &&
// Map.prototype.keys
Map.prototype != null && typeof Map.prototype.keys === 'function' && isNative(Map.prototype.keys) &&
// Set
typeof Set === 'function' && isNative(Set) &&
// Set.prototype.keys
Set.prototype != null && typeof Set.prototype.keys === 'function' && isNative(Set.prototype.keys);

var itemMap;
var rootIDSet;

var itemByKey;
var rootByKey;

if (canUseCollections) {
  itemMap = new Map();
  rootIDSet = new Set();
} else {
  itemByKey = {};
  rootByKey = {};
}

var unmountedIDs = [];

// Use non-numeric keys to prevent V8 performance issues:
// https://github.com/facebook/react/pull/7232
function getKeyFromID(id) {
  return '.' + id;
}
function getIDFromKey(key) {
  return parseInt(key.substr(1), 10);
}

function get(id) {
  if (canUseCollections) {
    return itemMap.get(id);
  } else {
    var key = getKeyFromID(id);
    return itemByKey[key];
  }
}

function remove(id) {
  if (canUseCollections) {
    itemMap['delete'](id);
  } else {
    var key = getKeyFromID(id);
    delete itemByKey[key];
  }
}

function create(id, element, parentID) {
  var item = {
    element: element,
    parentID: parentID,
    text: null,
    childIDs: [],
    isMounted: false,
    updateCount: 0
  };

  if (canUseCollections) {
    itemMap.set(id, item);
  } else {
    var key = getKeyFromID(id);
    itemByKey[key] = item;
  }
}

function addRoot(id) {
  if (canUseCollections) {
    rootIDSet.add(id);
  } else {
    var key = getKeyFromID(id);
    rootByKey[key] = true;
  }
}

function removeRoot(id) {
  if (canUseCollections) {
    rootIDSet['delete'](id);
  } else {
    var key = getKeyFromID(id);
    delete rootByKey[key];
  }
}

function getRegisteredIDs() {
  if (canUseCollections) {
    return Array.from(itemMap.keys());
  } else {
    return Object.keys(itemByKey).map(getIDFromKey);
  }
}

function getRootIDs() {
  if (canUseCollections) {
    return Array.from(rootIDSet.keys());
  } else {
    return Object.keys(rootByKey).map(getIDFromKey);
  }
}

function purgeDeep(id) {
  var item = get(id);
  if (item) {
    var childIDs = item.childIDs;

    remove(id);
    childIDs.forEach(purgeDeep);
  }
}

function describeComponentFrame(name, source, ownerName) {
  return '\n    in ' + name + (source ? ' (at ' + source.fileName.replace(/^.*[\\\/]/, '') + ':' + source.lineNumber + ')' : ownerName ? ' (created by ' + ownerName + ')' : '');
}

function getDisplayName(element) {
  if (element == null) {
    return '#empty';
  } else if (typeof element === 'string' || typeof element === 'number') {
    return '#text';
  } else if (typeof element.type === 'string') {
    return element.type;
  } else {
    return element.type.displayName || element.type.name || 'Unknown';
  }
}

function describeID(id) {
  var name = ReactComponentTreeHook.getDisplayName(id);
  var element = ReactComponentTreeHook.getElement(id);
  var ownerID = ReactComponentTreeHook.getOwnerID(id);
  var ownerName;
  if (ownerID) {
    ownerName = ReactComponentTreeHook.getDisplayName(ownerID);
  }
  process.env.NODE_ENV !== 'production' ? warning(element, 'ReactComponentTreeHook: Missing React element for debugID %s when ' + 'building stack', id) : void 0;
  return describeComponentFrame(name, element && element._source, ownerName);
}

var ReactComponentTreeHook = {
  onSetChildren: function (id, nextChildIDs) {
    var item = get(id);
    item.childIDs = nextChildIDs;

    for (var i = 0; i < nextChildIDs.length; i++) {
      var nextChildID = nextChildIDs[i];
      var nextChild = get(nextChildID);
      !nextChild ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Expected hook events to fire for the child before its parent includes it in onSetChildren().') : _prodInvariant('140') : void 0;
      !(nextChild.childIDs != null || typeof nextChild.element !== 'object' || nextChild.element == null) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Expected onSetChildren() to fire for a container child before its parent includes it in onSetChildren().') : _prodInvariant('141') : void 0;
      !nextChild.isMounted ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Expected onMountComponent() to fire for the child before its parent includes it in onSetChildren().') : _prodInvariant('71') : void 0;
      if (nextChild.parentID == null) {
        nextChild.parentID = id;
        // TODO: This shouldn't be necessary but mounting a new root during in
        // componentWillMount currently causes not-yet-mounted components to
        // be purged from our tree data so their parent ID is missing.
      }
      !(nextChild.parentID === id) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Expected onBeforeMountComponent() parent and onSetChildren() to be consistent (%s has parents %s and %s).', nextChildID, nextChild.parentID, id) : _prodInvariant('142', nextChildID, nextChild.parentID, id) : void 0;
    }
  },
  onBeforeMountComponent: function (id, element, parentID) {
    create(id, element, parentID);
  },
  onBeforeUpdateComponent: function (id, element) {
    var item = get(id);
    if (!item || !item.isMounted) {
      // We may end up here as a result of setState() in componentWillUnmount().
      // In this case, ignore the element.
      return;
    }
    item.element = element;
  },
  onMountComponent: function (id) {
    var item = get(id);
    item.isMounted = true;
    var isRoot = item.parentID === 0;
    if (isRoot) {
      addRoot(id);
    }
  },
  onUpdateComponent: function (id) {
    var item = get(id);
    if (!item || !item.isMounted) {
      // We may end up here as a result of setState() in componentWillUnmount().
      // In this case, ignore the element.
      return;
    }
    item.updateCount++;
  },
  onUnmountComponent: function (id) {
    var item = get(id);
    if (item) {
      // We need to check if it exists.
      // `item` might not exist if it is inside an error boundary, and a sibling
      // error boundary child threw while mounting. Then this instance never
      // got a chance to mount, but it still gets an unmounting event during
      // the error boundary cleanup.
      item.isMounted = false;
      var isRoot = item.parentID === 0;
      if (isRoot) {
        removeRoot(id);
      }
    }
    unmountedIDs.push(id);
  },
  purgeUnmountedComponents: function () {
    if (ReactComponentTreeHook._preventPurging) {
      // Should only be used for testing.
      return;
    }

    for (var i = 0; i < unmountedIDs.length; i++) {
      var id = unmountedIDs[i];
      purgeDeep(id);
    }
    unmountedIDs.length = 0;
  },
  isMounted: function (id) {
    var item = get(id);
    return item ? item.isMounted : false;
  },
  getCurrentStackAddendum: function (topElement) {
    var info = '';
    if (topElement) {
      var type = topElement.type;
      var name = typeof type === 'function' ? type.displayName || type.name : type;
      var owner = topElement._owner;
      info += describeComponentFrame(name || 'Unknown', topElement._source, owner && owner.getName());
    }

    var currentOwner = ReactCurrentOwner.current;
    var id = currentOwner && currentOwner._debugID;

    info += ReactComponentTreeHook.getStackAddendumByID(id);
    return info;
  },
  getStackAddendumByID: function (id) {
    var info = '';
    while (id) {
      info += describeID(id);
      id = ReactComponentTreeHook.getParentID(id);
    }
    return info;
  },
  getChildIDs: function (id) {
    var item = get(id);
    return item ? item.childIDs : [];
  },
  getDisplayName: function (id) {
    var element = ReactComponentTreeHook.getElement(id);
    if (!element) {
      return null;
    }
    return getDisplayName(element);
  },
  getElement: function (id) {
    var item = get(id);
    return item ? item.element : null;
  },
  getOwnerID: function (id) {
    var element = ReactComponentTreeHook.getElement(id);
    if (!element || !element._owner) {
      return null;
    }
    return element._owner._debugID;
  },
  getParentID: function (id) {
    var item = get(id);
    return item ? item.parentID : null;
  },
  getSource: function (id) {
    var item = get(id);
    var element = item ? item.element : null;
    var source = element != null ? element._source : null;
    return source;
  },
  getText: function (id) {
    var element = ReactComponentTreeHook.getElement(id);
    if (typeof element === 'string') {
      return element;
    } else if (typeof element === 'number') {
      return '' + element;
    } else {
      return null;
    }
  },
  getUpdateCount: function (id) {
    var item = get(id);
    return item ? item.updateCount : 0;
  },


  getRegisteredIDs: getRegisteredIDs,

  getRootIDs: getRootIDs
};

module.exports = ReactComponentTreeHook;
}).call(this,require('_process'))

},{"./ReactCurrentOwner":11,"./reactProdInvariant":26,"_process":1,"fbjs/lib/invariant":30,"fbjs/lib/warning":33}],11:[function(require,module,exports){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactCurrentOwner
 */

'use strict';

/**
 * Keeps track of the current owner.
 *
 * The current owner is the component who should own any components that are
 * currently being constructed.
 */

var ReactCurrentOwner = {

  /**
   * @internal
   * @type {ReactComponent}
   */
  current: null

};

module.exports = ReactCurrentOwner;
},{}],12:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactDOMFactories
 */

'use strict';

var ReactElement = require('./ReactElement');

/**
 * Create a factory that creates HTML tag elements.
 *
 * @private
 */
var createDOMFactory = ReactElement.createFactory;
if (process.env.NODE_ENV !== 'production') {
  var ReactElementValidator = require('./ReactElementValidator');
  createDOMFactory = ReactElementValidator.createFactory;
}

/**
 * Creates a mapping from supported HTML tags to `ReactDOMComponent` classes.
 * This is also accessible via `React.DOM`.
 *
 * @public
 */
var ReactDOMFactories = {
  a: createDOMFactory('a'),
  abbr: createDOMFactory('abbr'),
  address: createDOMFactory('address'),
  area: createDOMFactory('area'),
  article: createDOMFactory('article'),
  aside: createDOMFactory('aside'),
  audio: createDOMFactory('audio'),
  b: createDOMFactory('b'),
  base: createDOMFactory('base'),
  bdi: createDOMFactory('bdi'),
  bdo: createDOMFactory('bdo'),
  big: createDOMFactory('big'),
  blockquote: createDOMFactory('blockquote'),
  body: createDOMFactory('body'),
  br: createDOMFactory('br'),
  button: createDOMFactory('button'),
  canvas: createDOMFactory('canvas'),
  caption: createDOMFactory('caption'),
  cite: createDOMFactory('cite'),
  code: createDOMFactory('code'),
  col: createDOMFactory('col'),
  colgroup: createDOMFactory('colgroup'),
  data: createDOMFactory('data'),
  datalist: createDOMFactory('datalist'),
  dd: createDOMFactory('dd'),
  del: createDOMFactory('del'),
  details: createDOMFactory('details'),
  dfn: createDOMFactory('dfn'),
  dialog: createDOMFactory('dialog'),
  div: createDOMFactory('div'),
  dl: createDOMFactory('dl'),
  dt: createDOMFactory('dt'),
  em: createDOMFactory('em'),
  embed: createDOMFactory('embed'),
  fieldset: createDOMFactory('fieldset'),
  figcaption: createDOMFactory('figcaption'),
  figure: createDOMFactory('figure'),
  footer: createDOMFactory('footer'),
  form: createDOMFactory('form'),
  h1: createDOMFactory('h1'),
  h2: createDOMFactory('h2'),
  h3: createDOMFactory('h3'),
  h4: createDOMFactory('h4'),
  h5: createDOMFactory('h5'),
  h6: createDOMFactory('h6'),
  head: createDOMFactory('head'),
  header: createDOMFactory('header'),
  hgroup: createDOMFactory('hgroup'),
  hr: createDOMFactory('hr'),
  html: createDOMFactory('html'),
  i: createDOMFactory('i'),
  iframe: createDOMFactory('iframe'),
  img: createDOMFactory('img'),
  input: createDOMFactory('input'),
  ins: createDOMFactory('ins'),
  kbd: createDOMFactory('kbd'),
  keygen: createDOMFactory('keygen'),
  label: createDOMFactory('label'),
  legend: createDOMFactory('legend'),
  li: createDOMFactory('li'),
  link: createDOMFactory('link'),
  main: createDOMFactory('main'),
  map: createDOMFactory('map'),
  mark: createDOMFactory('mark'),
  menu: createDOMFactory('menu'),
  menuitem: createDOMFactory('menuitem'),
  meta: createDOMFactory('meta'),
  meter: createDOMFactory('meter'),
  nav: createDOMFactory('nav'),
  noscript: createDOMFactory('noscript'),
  object: createDOMFactory('object'),
  ol: createDOMFactory('ol'),
  optgroup: createDOMFactory('optgroup'),
  option: createDOMFactory('option'),
  output: createDOMFactory('output'),
  p: createDOMFactory('p'),
  param: createDOMFactory('param'),
  picture: createDOMFactory('picture'),
  pre: createDOMFactory('pre'),
  progress: createDOMFactory('progress'),
  q: createDOMFactory('q'),
  rp: createDOMFactory('rp'),
  rt: createDOMFactory('rt'),
  ruby: createDOMFactory('ruby'),
  s: createDOMFactory('s'),
  samp: createDOMFactory('samp'),
  script: createDOMFactory('script'),
  section: createDOMFactory('section'),
  select: createDOMFactory('select'),
  small: createDOMFactory('small'),
  source: createDOMFactory('source'),
  span: createDOMFactory('span'),
  strong: createDOMFactory('strong'),
  style: createDOMFactory('style'),
  sub: createDOMFactory('sub'),
  summary: createDOMFactory('summary'),
  sup: createDOMFactory('sup'),
  table: createDOMFactory('table'),
  tbody: createDOMFactory('tbody'),
  td: createDOMFactory('td'),
  textarea: createDOMFactory('textarea'),
  tfoot: createDOMFactory('tfoot'),
  th: createDOMFactory('th'),
  thead: createDOMFactory('thead'),
  time: createDOMFactory('time'),
  title: createDOMFactory('title'),
  tr: createDOMFactory('tr'),
  track: createDOMFactory('track'),
  u: createDOMFactory('u'),
  ul: createDOMFactory('ul'),
  'var': createDOMFactory('var'),
  video: createDOMFactory('video'),
  wbr: createDOMFactory('wbr'),

  // SVG
  circle: createDOMFactory('circle'),
  clipPath: createDOMFactory('clipPath'),
  defs: createDOMFactory('defs'),
  ellipse: createDOMFactory('ellipse'),
  g: createDOMFactory('g'),
  image: createDOMFactory('image'),
  line: createDOMFactory('line'),
  linearGradient: createDOMFactory('linearGradient'),
  mask: createDOMFactory('mask'),
  path: createDOMFactory('path'),
  pattern: createDOMFactory('pattern'),
  polygon: createDOMFactory('polygon'),
  polyline: createDOMFactory('polyline'),
  radialGradient: createDOMFactory('radialGradient'),
  rect: createDOMFactory('rect'),
  stop: createDOMFactory('stop'),
  svg: createDOMFactory('svg'),
  text: createDOMFactory('text'),
  tspan: createDOMFactory('tspan')
};

module.exports = ReactDOMFactories;
}).call(this,require('_process'))

},{"./ReactElement":13,"./ReactElementValidator":14,"_process":1}],13:[function(require,module,exports){
(function (process){
/**
 * Copyright 2014-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactElement
 */

'use strict';

var _assign = require('object-assign');

var ReactCurrentOwner = require('./ReactCurrentOwner');

var warning = require('fbjs/lib/warning');
var canDefineProperty = require('./canDefineProperty');
var hasOwnProperty = Object.prototype.hasOwnProperty;

// The Symbol used to tag the ReactElement type. If there is no native Symbol
// nor polyfill, then a plain number is used for performance.
var REACT_ELEMENT_TYPE = typeof Symbol === 'function' && Symbol['for'] && Symbol['for']('react.element') || 0xeac7;

var RESERVED_PROPS = {
  key: true,
  ref: true,
  __self: true,
  __source: true
};

var specialPropKeyWarningShown, specialPropRefWarningShown;

function hasValidRef(config) {
  if (process.env.NODE_ENV !== 'production') {
    if (hasOwnProperty.call(config, 'ref')) {
      var getter = Object.getOwnPropertyDescriptor(config, 'ref').get;
      if (getter && getter.isReactWarning) {
        return false;
      }
    }
  }
  return config.ref !== undefined;
}

function hasValidKey(config) {
  if (process.env.NODE_ENV !== 'production') {
    if (hasOwnProperty.call(config, 'key')) {
      var getter = Object.getOwnPropertyDescriptor(config, 'key').get;
      if (getter && getter.isReactWarning) {
        return false;
      }
    }
  }
  return config.key !== undefined;
}

function defineKeyPropWarningGetter(props, displayName) {
  var warnAboutAccessingKey = function () {
    if (!specialPropKeyWarningShown) {
      specialPropKeyWarningShown = true;
      process.env.NODE_ENV !== 'production' ? warning(false, '%s: `key` is not a prop. Trying to access it will result ' + 'in `undefined` being returned. If you need to access the same ' + 'value within the child component, you should pass it as a different ' + 'prop. (https://fb.me/react-special-props)', displayName) : void 0;
    }
  };
  warnAboutAccessingKey.isReactWarning = true;
  Object.defineProperty(props, 'key', {
    get: warnAboutAccessingKey,
    configurable: true
  });
}

function defineRefPropWarningGetter(props, displayName) {
  var warnAboutAccessingRef = function () {
    if (!specialPropRefWarningShown) {
      specialPropRefWarningShown = true;
      process.env.NODE_ENV !== 'production' ? warning(false, '%s: `ref` is not a prop. Trying to access it will result ' + 'in `undefined` being returned. If you need to access the same ' + 'value within the child component, you should pass it as a different ' + 'prop. (https://fb.me/react-special-props)', displayName) : void 0;
    }
  };
  warnAboutAccessingRef.isReactWarning = true;
  Object.defineProperty(props, 'ref', {
    get: warnAboutAccessingRef,
    configurable: true
  });
}

/**
 * Factory method to create a new React element. This no longer adheres to
 * the class pattern, so do not use new to call it. Also, no instanceof check
 * will work. Instead test $$typeof field against Symbol.for('react.element') to check
 * if something is a React Element.
 *
 * @param {*} type
 * @param {*} key
 * @param {string|object} ref
 * @param {*} self A *temporary* helper to detect places where `this` is
 * different from the `owner` when React.createElement is called, so that we
 * can warn. We want to get rid of owner and replace string `ref`s with arrow
 * functions, and as long as `this` and owner are the same, there will be no
 * change in behavior.
 * @param {*} source An annotation object (added by a transpiler or otherwise)
 * indicating filename, line number, and/or other information.
 * @param {*} owner
 * @param {*} props
 * @internal
 */
var ReactElement = function (type, key, ref, self, source, owner, props) {
  var element = {
    // This tag allow us to uniquely identify this as a React Element
    $$typeof: REACT_ELEMENT_TYPE,

    // Built-in properties that belong on the element
    type: type,
    key: key,
    ref: ref,
    props: props,

    // Record the component responsible for creating this element.
    _owner: owner
  };

  if (process.env.NODE_ENV !== 'production') {
    // The validation flag is currently mutative. We put it on
    // an external backing store so that we can freeze the whole object.
    // This can be replaced with a WeakMap once they are implemented in
    // commonly used development environments.
    element._store = {};
    var shadowChildren = Array.isArray(props.children) ? props.children.slice(0) : props.children;

    // To make comparing ReactElements easier for testing purposes, we make
    // the validation flag non-enumerable (where possible, which should
    // include every environment we run tests in), so the test framework
    // ignores it.
    if (canDefineProperty) {
      Object.defineProperty(element._store, 'validated', {
        configurable: false,
        enumerable: false,
        writable: true,
        value: false
      });
      // self and source are DEV only properties.
      Object.defineProperty(element, '_self', {
        configurable: false,
        enumerable: false,
        writable: false,
        value: self
      });
      Object.defineProperty(element, '_shadowChildren', {
        configurable: false,
        enumerable: false,
        writable: false,
        value: shadowChildren
      });
      // Two elements created in two different places should be considered
      // equal for testing purposes and therefore we hide it from enumeration.
      Object.defineProperty(element, '_source', {
        configurable: false,
        enumerable: false,
        writable: false,
        value: source
      });
    } else {
      element._store.validated = false;
      element._self = self;
      element._shadowChildren = shadowChildren;
      element._source = source;
    }
    if (Object.freeze) {
      Object.freeze(element.props);
      Object.freeze(element);
    }
  }

  return element;
};

/**
 * Create and return a new ReactElement of the given type.
 * See https://facebook.github.io/react/docs/top-level-api.html#react.createelement
 */
ReactElement.createElement = function (type, config, children) {
  var propName;

  // Reserved names are extracted
  var props = {};

  var key = null;
  var ref = null;
  var self = null;
  var source = null;

  if (config != null) {
    if (process.env.NODE_ENV !== 'production') {
      process.env.NODE_ENV !== 'production' ? warning(
      /* eslint-disable no-proto */
      config.__proto__ == null || config.__proto__ === Object.prototype,
      /* eslint-enable no-proto */
      'React.createElement(...): Expected props argument to be a plain object. ' + 'Properties defined in its prototype chain will be ignored.') : void 0;
    }

    if (hasValidRef(config)) {
      ref = config.ref;
    }
    if (hasValidKey(config)) {
      key = '' + config.key;
    }

    self = config.__self === undefined ? null : config.__self;
    source = config.__source === undefined ? null : config.__source;
    // Remaining properties are added to a new props object
    for (propName in config) {
      if (hasOwnProperty.call(config, propName) && !RESERVED_PROPS.hasOwnProperty(propName)) {
        props[propName] = config[propName];
      }
    }
  }

  // Children can be more than one argument, and those are transferred onto
  // the newly allocated props object.
  var childrenLength = arguments.length - 2;
  if (childrenLength === 1) {
    props.children = children;
  } else if (childrenLength > 1) {
    var childArray = Array(childrenLength);
    for (var i = 0; i < childrenLength; i++) {
      childArray[i] = arguments[i + 2];
    }
    props.children = childArray;
  }

  // Resolve default props
  if (type && type.defaultProps) {
    var defaultProps = type.defaultProps;
    for (propName in defaultProps) {
      if (props[propName] === undefined) {
        props[propName] = defaultProps[propName];
      }
    }
  }
  if (process.env.NODE_ENV !== 'production') {
    if (key || ref) {
      if (typeof props.$$typeof === 'undefined' || props.$$typeof !== REACT_ELEMENT_TYPE) {
        var displayName = typeof type === 'function' ? type.displayName || type.name || 'Unknown' : type;
        if (key) {
          defineKeyPropWarningGetter(props, displayName);
        }
        if (ref) {
          defineRefPropWarningGetter(props, displayName);
        }
      }
    }
  }
  return ReactElement(type, key, ref, self, source, ReactCurrentOwner.current, props);
};

/**
 * Return a function that produces ReactElements of a given type.
 * See https://facebook.github.io/react/docs/top-level-api.html#react.createfactory
 */
ReactElement.createFactory = function (type) {
  var factory = ReactElement.createElement.bind(null, type);
  // Expose the type on the factory and the prototype so that it can be
  // easily accessed on elements. E.g. `<Foo />.type === Foo`.
  // This should not be named `constructor` since this may not be the function
  // that created the element, and it may not even be a constructor.
  // Legacy hook TODO: Warn if this is accessed
  factory.type = type;
  return factory;
};

ReactElement.cloneAndReplaceKey = function (oldElement, newKey) {
  var newElement = ReactElement(oldElement.type, newKey, oldElement.ref, oldElement._self, oldElement._source, oldElement._owner, oldElement.props);

  return newElement;
};

/**
 * Clone and return a new ReactElement using element as the starting point.
 * See https://facebook.github.io/react/docs/top-level-api.html#react.cloneelement
 */
ReactElement.cloneElement = function (element, config, children) {
  var propName;

  // Original props are copied
  var props = _assign({}, element.props);

  // Reserved names are extracted
  var key = element.key;
  var ref = element.ref;
  // Self is preserved since the owner is preserved.
  var self = element._self;
  // Source is preserved since cloneElement is unlikely to be targeted by a
  // transpiler, and the original source is probably a better indicator of the
  // true owner.
  var source = element._source;

  // Owner will be preserved, unless ref is overridden
  var owner = element._owner;

  if (config != null) {
    if (process.env.NODE_ENV !== 'production') {
      process.env.NODE_ENV !== 'production' ? warning(
      /* eslint-disable no-proto */
      config.__proto__ == null || config.__proto__ === Object.prototype,
      /* eslint-enable no-proto */
      'React.cloneElement(...): Expected props argument to be a plain object. ' + 'Properties defined in its prototype chain will be ignored.') : void 0;
    }

    if (hasValidRef(config)) {
      // Silently steal the ref from the parent.
      ref = config.ref;
      owner = ReactCurrentOwner.current;
    }
    if (hasValidKey(config)) {
      key = '' + config.key;
    }

    // Remaining properties override existing props
    var defaultProps;
    if (element.type && element.type.defaultProps) {
      defaultProps = element.type.defaultProps;
    }
    for (propName in config) {
      if (hasOwnProperty.call(config, propName) && !RESERVED_PROPS.hasOwnProperty(propName)) {
        if (config[propName] === undefined && defaultProps !== undefined) {
          // Resolve default props
          props[propName] = defaultProps[propName];
        } else {
          props[propName] = config[propName];
        }
      }
    }
  }

  // Children can be more than one argument, and those are transferred onto
  // the newly allocated props object.
  var childrenLength = arguments.length - 2;
  if (childrenLength === 1) {
    props.children = children;
  } else if (childrenLength > 1) {
    var childArray = Array(childrenLength);
    for (var i = 0; i < childrenLength; i++) {
      childArray[i] = arguments[i + 2];
    }
    props.children = childArray;
  }

  return ReactElement(element.type, key, ref, self, source, owner, props);
};

/**
 * Verifies the object is a ReactElement.
 * See https://facebook.github.io/react/docs/top-level-api.html#react.isvalidelement
 * @param {?object} object
 * @return {boolean} True if `object` is a valid component.
 * @final
 */
ReactElement.isValidElement = function (object) {
  return typeof object === 'object' && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
};

ReactElement.REACT_ELEMENT_TYPE = REACT_ELEMENT_TYPE;

module.exports = ReactElement;
}).call(this,require('_process'))

},{"./ReactCurrentOwner":11,"./canDefineProperty":22,"_process":1,"fbjs/lib/warning":33,"object-assign":3}],14:[function(require,module,exports){
(function (process){
/**
 * Copyright 2014-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactElementValidator
 */

/**
 * ReactElementValidator provides a wrapper around a element factory
 * which validates the props passed to the element. This is intended to be
 * used only in DEV and could be replaced by a static type checker for languages
 * that support it.
 */

'use strict';

var ReactCurrentOwner = require('./ReactCurrentOwner');
var ReactComponentTreeHook = require('./ReactComponentTreeHook');
var ReactElement = require('./ReactElement');
var ReactPropTypeLocations = require('./ReactPropTypeLocations');

var checkReactTypeSpec = require('./checkReactTypeSpec');

var canDefineProperty = require('./canDefineProperty');
var getIteratorFn = require('./getIteratorFn');
var warning = require('fbjs/lib/warning');

function getDeclarationErrorAddendum() {
  if (ReactCurrentOwner.current) {
    var name = ReactCurrentOwner.current.getName();
    if (name) {
      return ' Check the render method of `' + name + '`.';
    }
  }
  return '';
}

/**
 * Warn if there's no key explicitly set on dynamic arrays of children or
 * object keys are not valid. This allows us to keep track of children between
 * updates.
 */
var ownerHasKeyUseWarning = {};

function getCurrentComponentErrorInfo(parentType) {
  var info = getDeclarationErrorAddendum();

  if (!info) {
    var parentName = typeof parentType === 'string' ? parentType : parentType.displayName || parentType.name;
    if (parentName) {
      info = ' Check the top-level render call using <' + parentName + '>.';
    }
  }
  return info;
}

/**
 * Warn if the element doesn't have an explicit key assigned to it.
 * This element is in an array. The array could grow and shrink or be
 * reordered. All children that haven't already been validated are required to
 * have a "key" property assigned to it. Error statuses are cached so a warning
 * will only be shown once.
 *
 * @internal
 * @param {ReactElement} element Element that requires a key.
 * @param {*} parentType element's parent's type.
 */
function validateExplicitKey(element, parentType) {
  if (!element._store || element._store.validated || element.key != null) {
    return;
  }
  element._store.validated = true;

  var memoizer = ownerHasKeyUseWarning.uniqueKey || (ownerHasKeyUseWarning.uniqueKey = {});

  var currentComponentErrorInfo = getCurrentComponentErrorInfo(parentType);
  if (memoizer[currentComponentErrorInfo]) {
    return;
  }
  memoizer[currentComponentErrorInfo] = true;

  // Usually the current owner is the offender, but if it accepts children as a
  // property, it may be the creator of the child that's responsible for
  // assigning it a key.
  var childOwner = '';
  if (element && element._owner && element._owner !== ReactCurrentOwner.current) {
    // Give the component that originally created this child.
    childOwner = ' It was passed a child from ' + element._owner.getName() + '.';
  }

  process.env.NODE_ENV !== 'production' ? warning(false, 'Each child in an array or iterator should have a unique "key" prop.' + '%s%s See https://fb.me/react-warning-keys for more information.%s', currentComponentErrorInfo, childOwner, ReactComponentTreeHook.getCurrentStackAddendum(element)) : void 0;
}

/**
 * Ensure that every element either is passed in a static location, in an
 * array with an explicit keys property defined, or in an object literal
 * with valid key property.
 *
 * @internal
 * @param {ReactNode} node Statically passed child of any type.
 * @param {*} parentType node's parent's type.
 */
function validateChildKeys(node, parentType) {
  if (typeof node !== 'object') {
    return;
  }
  if (Array.isArray(node)) {
    for (var i = 0; i < node.length; i++) {
      var child = node[i];
      if (ReactElement.isValidElement(child)) {
        validateExplicitKey(child, parentType);
      }
    }
  } else if (ReactElement.isValidElement(node)) {
    // This element was passed in a valid location.
    if (node._store) {
      node._store.validated = true;
    }
  } else if (node) {
    var iteratorFn = getIteratorFn(node);
    // Entry iterators provide implicit keys.
    if (iteratorFn) {
      if (iteratorFn !== node.entries) {
        var iterator = iteratorFn.call(node);
        var step;
        while (!(step = iterator.next()).done) {
          if (ReactElement.isValidElement(step.value)) {
            validateExplicitKey(step.value, parentType);
          }
        }
      }
    }
  }
}

/**
 * Given an element, validate that its props follow the propTypes definition,
 * provided by the type.
 *
 * @param {ReactElement} element
 */
function validatePropTypes(element) {
  var componentClass = element.type;
  if (typeof componentClass !== 'function') {
    return;
  }
  var name = componentClass.displayName || componentClass.name;
  if (componentClass.propTypes) {
    checkReactTypeSpec(componentClass.propTypes, element.props, ReactPropTypeLocations.prop, name, element, null);
  }
  if (typeof componentClass.getDefaultProps === 'function') {
    process.env.NODE_ENV !== 'production' ? warning(componentClass.getDefaultProps.isReactClassApproved, 'getDefaultProps is only used on classic React.createClass ' + 'definitions. Use a static property named `defaultProps` instead.') : void 0;
  }
}

var ReactElementValidator = {

  createElement: function (type, props, children) {
    var validType = typeof type === 'string' || typeof type === 'function';
    // We warn in this case but don't throw. We expect the element creation to
    // succeed and there will likely be errors in render.
    if (!validType) {
      process.env.NODE_ENV !== 'production' ? warning(false, 'React.createElement: type should not be null, undefined, boolean, or ' + 'number. It should be a string (for DOM elements) or a ReactClass ' + '(for composite components).%s', getDeclarationErrorAddendum()) : void 0;
    }

    var element = ReactElement.createElement.apply(this, arguments);

    // The result can be nullish if a mock or a custom function is used.
    // TODO: Drop this when these are no longer allowed as the type argument.
    if (element == null) {
      return element;
    }

    // Skip key warning if the type isn't valid since our key validation logic
    // doesn't expect a non-string/function type and can throw confusing errors.
    // We don't want exception behavior to differ between dev and prod.
    // (Rendering will throw with a helpful message and as soon as the type is
    // fixed, the key warnings will appear.)
    if (validType) {
      for (var i = 2; i < arguments.length; i++) {
        validateChildKeys(arguments[i], type);
      }
    }

    validatePropTypes(element);

    return element;
  },

  createFactory: function (type) {
    var validatedFactory = ReactElementValidator.createElement.bind(null, type);
    // Legacy hook TODO: Warn if this is accessed
    validatedFactory.type = type;

    if (process.env.NODE_ENV !== 'production') {
      if (canDefineProperty) {
        Object.defineProperty(validatedFactory, 'type', {
          enumerable: false,
          get: function () {
            process.env.NODE_ENV !== 'production' ? warning(false, 'Factory.type is deprecated. Access the class directly ' + 'before passing it to createFactory.') : void 0;
            Object.defineProperty(this, 'type', {
              value: type
            });
            return type;
          }
        });
      }
    }

    return validatedFactory;
  },

  cloneElement: function (element, props, children) {
    var newElement = ReactElement.cloneElement.apply(this, arguments);
    for (var i = 2; i < arguments.length; i++) {
      validateChildKeys(arguments[i], newElement.type);
    }
    validatePropTypes(newElement);
    return newElement;
  }

};

module.exports = ReactElementValidator;
}).call(this,require('_process'))

},{"./ReactComponentTreeHook":10,"./ReactCurrentOwner":11,"./ReactElement":13,"./ReactPropTypeLocations":17,"./canDefineProperty":22,"./checkReactTypeSpec":23,"./getIteratorFn":24,"_process":1,"fbjs/lib/warning":33}],15:[function(require,module,exports){
(function (process){
/**
 * Copyright 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactNoopUpdateQueue
 */

'use strict';

var warning = require('fbjs/lib/warning');

function warnNoop(publicInstance, callerName) {
  if (process.env.NODE_ENV !== 'production') {
    var constructor = publicInstance.constructor;
    process.env.NODE_ENV !== 'production' ? warning(false, '%s(...): Can only update a mounted or mounting component. ' + 'This usually means you called %s() on an unmounted component. ' + 'This is a no-op. Please check the code for the %s component.', callerName, callerName, constructor && (constructor.displayName || constructor.name) || 'ReactClass') : void 0;
  }
}

/**
 * This is the abstract API for an update queue.
 */
var ReactNoopUpdateQueue = {

  /**
   * Checks whether or not this composite component is mounted.
   * @param {ReactClass} publicInstance The instance we want to test.
   * @return {boolean} True if mounted, false otherwise.
   * @protected
   * @final
   */
  isMounted: function (publicInstance) {
    return false;
  },

  /**
   * Enqueue a callback that will be executed after all the pending updates
   * have processed.
   *
   * @param {ReactClass} publicInstance The instance to use as `this` context.
   * @param {?function} callback Called after state is updated.
   * @internal
   */
  enqueueCallback: function (publicInstance, callback) {},

  /**
   * Forces an update. This should only be invoked when it is known with
   * certainty that we are **not** in a DOM transaction.
   *
   * You may want to call this when you know that some deeper aspect of the
   * component's state has changed but `setState` was not called.
   *
   * This will not invoke `shouldComponentUpdate`, but it will invoke
   * `componentWillUpdate` and `componentDidUpdate`.
   *
   * @param {ReactClass} publicInstance The instance that should rerender.
   * @internal
   */
  enqueueForceUpdate: function (publicInstance) {
    warnNoop(publicInstance, 'forceUpdate');
  },

  /**
   * Replaces all of the state. Always use this or `setState` to mutate state.
   * You should treat `this.state` as immutable.
   *
   * There is no guarantee that `this.state` will be immediately updated, so
   * accessing `this.state` after calling this method may return the old value.
   *
   * @param {ReactClass} publicInstance The instance that should rerender.
   * @param {object} completeState Next state.
   * @internal
   */
  enqueueReplaceState: function (publicInstance, completeState) {
    warnNoop(publicInstance, 'replaceState');
  },

  /**
   * Sets a subset of the state. This only exists because _pendingState is
   * internal. This provides a merging strategy that is not available to deep
   * properties which is confusing. TODO: Expose pendingState or don't use it
   * during the merge.
   *
   * @param {ReactClass} publicInstance The instance that should rerender.
   * @param {object} partialState Next partial state to be merged with state.
   * @internal
   */
  enqueueSetState: function (publicInstance, partialState) {
    warnNoop(publicInstance, 'setState');
  }
};

module.exports = ReactNoopUpdateQueue;
}).call(this,require('_process'))

},{"_process":1,"fbjs/lib/warning":33}],16:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactPropTypeLocationNames
 */

'use strict';

var ReactPropTypeLocationNames = {};

if (process.env.NODE_ENV !== 'production') {
  ReactPropTypeLocationNames = {
    prop: 'prop',
    context: 'context',
    childContext: 'child context'
  };
}

module.exports = ReactPropTypeLocationNames;
}).call(this,require('_process'))

},{"_process":1}],17:[function(require,module,exports){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactPropTypeLocations
 */

'use strict';

var keyMirror = require('fbjs/lib/keyMirror');

var ReactPropTypeLocations = keyMirror({
  prop: null,
  context: null,
  childContext: null
});

module.exports = ReactPropTypeLocations;
},{"fbjs/lib/keyMirror":31}],18:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactPropTypes
 */

'use strict';

var ReactElement = require('./ReactElement');
var ReactPropTypeLocationNames = require('./ReactPropTypeLocationNames');
var ReactPropTypesSecret = require('./ReactPropTypesSecret');

var emptyFunction = require('fbjs/lib/emptyFunction');
var getIteratorFn = require('./getIteratorFn');
var warning = require('fbjs/lib/warning');

/**
 * Collection of methods that allow declaration and validation of props that are
 * supplied to React components. Example usage:
 *
 *   var Props = require('ReactPropTypes');
 *   var MyArticle = React.createClass({
 *     propTypes: {
 *       // An optional string prop named "description".
 *       description: Props.string,
 *
 *       // A required enum prop named "category".
 *       category: Props.oneOf(['News','Photos']).isRequired,
 *
 *       // A prop named "dialog" that requires an instance of Dialog.
 *       dialog: Props.instanceOf(Dialog).isRequired
 *     },
 *     render: function() { ... }
 *   });
 *
 * A more formal specification of how these methods are used:
 *
 *   type := array|bool|func|object|number|string|oneOf([...])|instanceOf(...)
 *   decl := ReactPropTypes.{type}(.isRequired)?
 *
 * Each and every declaration produces a function with the same signature. This
 * allows the creation of custom validation functions. For example:
 *
 *  var MyLink = React.createClass({
 *    propTypes: {
 *      // An optional string or URI prop named "href".
 *      href: function(props, propName, componentName) {
 *        var propValue = props[propName];
 *        if (propValue != null && typeof propValue !== 'string' &&
 *            !(propValue instanceof URI)) {
 *          return new Error(
 *            'Expected a string or an URI for ' + propName + ' in ' +
 *            componentName
 *          );
 *        }
 *      }
 *    },
 *    render: function() {...}
 *  });
 *
 * @internal
 */

var ANONYMOUS = '<<anonymous>>';

var ReactPropTypes = {
  array: createPrimitiveTypeChecker('array'),
  bool: createPrimitiveTypeChecker('boolean'),
  func: createPrimitiveTypeChecker('function'),
  number: createPrimitiveTypeChecker('number'),
  object: createPrimitiveTypeChecker('object'),
  string: createPrimitiveTypeChecker('string'),
  symbol: createPrimitiveTypeChecker('symbol'),

  any: createAnyTypeChecker(),
  arrayOf: createArrayOfTypeChecker,
  element: createElementTypeChecker(),
  instanceOf: createInstanceTypeChecker,
  node: createNodeChecker(),
  objectOf: createObjectOfTypeChecker,
  oneOf: createEnumTypeChecker,
  oneOfType: createUnionTypeChecker,
  shape: createShapeTypeChecker
};

/**
 * inlined Object.is polyfill to avoid requiring consumers ship their own
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
 */
/*eslint-disable no-self-compare*/
function is(x, y) {
  // SameValue algorithm
  if (x === y) {
    // Steps 1-5, 7-10
    // Steps 6.b-6.e: +0 != -0
    return x !== 0 || 1 / x === 1 / y;
  } else {
    // Step 6.a: NaN == NaN
    return x !== x && y !== y;
  }
}
/*eslint-enable no-self-compare*/

/**
 * We use an Error-like object for backward compatibility as people may call
 * PropTypes directly and inspect their output. However we don't use real
 * Errors anymore. We don't inspect their stack anyway, and creating them
 * is prohibitively expensive if they are created too often, such as what
 * happens in oneOfType() for any type before the one that matched.
 */
function PropTypeError(message) {
  this.message = message;
  this.stack = '';
}
// Make `instanceof Error` still work for returned errors.
PropTypeError.prototype = Error.prototype;

function createChainableTypeChecker(validate) {
  if (process.env.NODE_ENV !== 'production') {
    var manualPropTypeCallCache = {};
  }
  function checkType(isRequired, props, propName, componentName, location, propFullName, secret) {
    componentName = componentName || ANONYMOUS;
    propFullName = propFullName || propName;
    if (process.env.NODE_ENV !== 'production') {
      if (secret !== ReactPropTypesSecret && typeof console !== 'undefined') {
        var cacheKey = componentName + ':' + propName;
        if (!manualPropTypeCallCache[cacheKey]) {
          process.env.NODE_ENV !== 'production' ? warning(false, 'You are manually calling a React.PropTypes validation ' + 'function for the `%s` prop on `%s`. This is deprecated ' + 'and will not work in the next major version. You may be ' + 'seeing this warning due to a third-party PropTypes library. ' + 'See https://fb.me/react-warning-dont-call-proptypes for details.', propFullName, componentName) : void 0;
          manualPropTypeCallCache[cacheKey] = true;
        }
      }
    }
    if (props[propName] == null) {
      var locationName = ReactPropTypeLocationNames[location];
      if (isRequired) {
        return new PropTypeError('Required ' + locationName + ' `' + propFullName + '` was not specified in ' + ('`' + componentName + '`.'));
      }
      return null;
    } else {
      return validate(props, propName, componentName, location, propFullName);
    }
  }

  var chainedCheckType = checkType.bind(null, false);
  chainedCheckType.isRequired = checkType.bind(null, true);

  return chainedCheckType;
}

function createPrimitiveTypeChecker(expectedType) {
  function validate(props, propName, componentName, location, propFullName, secret) {
    var propValue = props[propName];
    var propType = getPropType(propValue);
    if (propType !== expectedType) {
      var locationName = ReactPropTypeLocationNames[location];
      // `propValue` being instance of, say, date/regexp, pass the 'object'
      // check, but we can offer a more precise error message here rather than
      // 'of type `object`'.
      var preciseType = getPreciseType(propValue);

      return new PropTypeError('Invalid ' + locationName + ' `' + propFullName + '` of type ' + ('`' + preciseType + '` supplied to `' + componentName + '`, expected ') + ('`' + expectedType + '`.'));
    }
    return null;
  }
  return createChainableTypeChecker(validate);
}

function createAnyTypeChecker() {
  return createChainableTypeChecker(emptyFunction.thatReturns(null));
}

function createArrayOfTypeChecker(typeChecker) {
  function validate(props, propName, componentName, location, propFullName) {
    if (typeof typeChecker !== 'function') {
      return new PropTypeError('Property `' + propFullName + '` of component `' + componentName + '` has invalid PropType notation inside arrayOf.');
    }
    var propValue = props[propName];
    if (!Array.isArray(propValue)) {
      var locationName = ReactPropTypeLocationNames[location];
      var propType = getPropType(propValue);
      return new PropTypeError('Invalid ' + locationName + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an array.'));
    }
    for (var i = 0; i < propValue.length; i++) {
      var error = typeChecker(propValue, i, componentName, location, propFullName + '[' + i + ']', ReactPropTypesSecret);
      if (error instanceof Error) {
        return error;
      }
    }
    return null;
  }
  return createChainableTypeChecker(validate);
}

function createElementTypeChecker() {
  function validate(props, propName, componentName, location, propFullName) {
    var propValue = props[propName];
    if (!ReactElement.isValidElement(propValue)) {
      var locationName = ReactPropTypeLocationNames[location];
      var propType = getPropType(propValue);
      return new PropTypeError('Invalid ' + locationName + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected a single ReactElement.'));
    }
    return null;
  }
  return createChainableTypeChecker(validate);
}

function createInstanceTypeChecker(expectedClass) {
  function validate(props, propName, componentName, location, propFullName) {
    if (!(props[propName] instanceof expectedClass)) {
      var locationName = ReactPropTypeLocationNames[location];
      var expectedClassName = expectedClass.name || ANONYMOUS;
      var actualClassName = getClassName(props[propName]);
      return new PropTypeError('Invalid ' + locationName + ' `' + propFullName + '` of type ' + ('`' + actualClassName + '` supplied to `' + componentName + '`, expected ') + ('instance of `' + expectedClassName + '`.'));
    }
    return null;
  }
  return createChainableTypeChecker(validate);
}

function createEnumTypeChecker(expectedValues) {
  if (!Array.isArray(expectedValues)) {
    process.env.NODE_ENV !== 'production' ? warning(false, 'Invalid argument supplied to oneOf, expected an instance of array.') : void 0;
    return emptyFunction.thatReturnsNull;
  }

  function validate(props, propName, componentName, location, propFullName) {
    var propValue = props[propName];
    for (var i = 0; i < expectedValues.length; i++) {
      if (is(propValue, expectedValues[i])) {
        return null;
      }
    }

    var locationName = ReactPropTypeLocationNames[location];
    var valuesString = JSON.stringify(expectedValues);
    return new PropTypeError('Invalid ' + locationName + ' `' + propFullName + '` of value `' + propValue + '` ' + ('supplied to `' + componentName + '`, expected one of ' + valuesString + '.'));
  }
  return createChainableTypeChecker(validate);
}

function createObjectOfTypeChecker(typeChecker) {
  function validate(props, propName, componentName, location, propFullName) {
    if (typeof typeChecker !== 'function') {
      return new PropTypeError('Property `' + propFullName + '` of component `' + componentName + '` has invalid PropType notation inside objectOf.');
    }
    var propValue = props[propName];
    var propType = getPropType(propValue);
    if (propType !== 'object') {
      var locationName = ReactPropTypeLocationNames[location];
      return new PropTypeError('Invalid ' + locationName + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an object.'));
    }
    for (var key in propValue) {
      if (propValue.hasOwnProperty(key)) {
        var error = typeChecker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret);
        if (error instanceof Error) {
          return error;
        }
      }
    }
    return null;
  }
  return createChainableTypeChecker(validate);
}

function createUnionTypeChecker(arrayOfTypeCheckers) {
  if (!Array.isArray(arrayOfTypeCheckers)) {
    process.env.NODE_ENV !== 'production' ? warning(false, 'Invalid argument supplied to oneOfType, expected an instance of array.') : void 0;
    return emptyFunction.thatReturnsNull;
  }

  function validate(props, propName, componentName, location, propFullName) {
    for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
      var checker = arrayOfTypeCheckers[i];
      if (checker(props, propName, componentName, location, propFullName, ReactPropTypesSecret) == null) {
        return null;
      }
    }

    var locationName = ReactPropTypeLocationNames[location];
    return new PropTypeError('Invalid ' + locationName + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`.'));
  }
  return createChainableTypeChecker(validate);
}

function createNodeChecker() {
  function validate(props, propName, componentName, location, propFullName) {
    if (!isNode(props[propName])) {
      var locationName = ReactPropTypeLocationNames[location];
      return new PropTypeError('Invalid ' + locationName + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`, expected a ReactNode.'));
    }
    return null;
  }
  return createChainableTypeChecker(validate);
}

function createShapeTypeChecker(shapeTypes) {
  function validate(props, propName, componentName, location, propFullName) {
    var propValue = props[propName];
    var propType = getPropType(propValue);
    if (propType !== 'object') {
      var locationName = ReactPropTypeLocationNames[location];
      return new PropTypeError('Invalid ' + locationName + ' `' + propFullName + '` of type `' + propType + '` ' + ('supplied to `' + componentName + '`, expected `object`.'));
    }
    for (var key in shapeTypes) {
      var checker = shapeTypes[key];
      if (!checker) {
        continue;
      }
      var error = checker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret);
      if (error) {
        return error;
      }
    }
    return null;
  }
  return createChainableTypeChecker(validate);
}

function isNode(propValue) {
  switch (typeof propValue) {
    case 'number':
    case 'string':
    case 'undefined':
      return true;
    case 'boolean':
      return !propValue;
    case 'object':
      if (Array.isArray(propValue)) {
        return propValue.every(isNode);
      }
      if (propValue === null || ReactElement.isValidElement(propValue)) {
        return true;
      }

      var iteratorFn = getIteratorFn(propValue);
      if (iteratorFn) {
        var iterator = iteratorFn.call(propValue);
        var step;
        if (iteratorFn !== propValue.entries) {
          while (!(step = iterator.next()).done) {
            if (!isNode(step.value)) {
              return false;
            }
          }
        } else {
          // Iterator will provide entry [k,v] tuples rather than values.
          while (!(step = iterator.next()).done) {
            var entry = step.value;
            if (entry) {
              if (!isNode(entry[1])) {
                return false;
              }
            }
          }
        }
      } else {
        return false;
      }

      return true;
    default:
      return false;
  }
}

function isSymbol(propType, propValue) {
  // Native Symbol.
  if (propType === 'symbol') {
    return true;
  }

  // 19.4.3.5 Symbol.prototype[@@toStringTag] === 'Symbol'
  if (propValue['@@toStringTag'] === 'Symbol') {
    return true;
  }

  // Fallback for non-spec compliant Symbols which are polyfilled.
  if (typeof Symbol === 'function' && propValue instanceof Symbol) {
    return true;
  }

  return false;
}

// Equivalent of `typeof` but with special handling for array and regexp.
function getPropType(propValue) {
  var propType = typeof propValue;
  if (Array.isArray(propValue)) {
    return 'array';
  }
  if (propValue instanceof RegExp) {
    // Old webkits (at least until Android 4.0) return 'function' rather than
    // 'object' for typeof a RegExp. We'll normalize this here so that /bla/
    // passes PropTypes.object.
    return 'object';
  }
  if (isSymbol(propType, propValue)) {
    return 'symbol';
  }
  return propType;
}

// This handles more types than `getPropType`. Only used for error messages.
// See `createPrimitiveTypeChecker`.
function getPreciseType(propValue) {
  var propType = getPropType(propValue);
  if (propType === 'object') {
    if (propValue instanceof Date) {
      return 'date';
    } else if (propValue instanceof RegExp) {
      return 'regexp';
    }
  }
  return propType;
}

// Returns class name of the object, if any.
function getClassName(propValue) {
  if (!propValue.constructor || !propValue.constructor.name) {
    return ANONYMOUS;
  }
  return propValue.constructor.name;
}

module.exports = ReactPropTypes;
}).call(this,require('_process'))

},{"./ReactElement":13,"./ReactPropTypeLocationNames":16,"./ReactPropTypesSecret":19,"./getIteratorFn":24,"_process":1,"fbjs/lib/emptyFunction":28,"fbjs/lib/warning":33}],19:[function(require,module,exports){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactPropTypesSecret
 */

'use strict';

var ReactPropTypesSecret = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED';

module.exports = ReactPropTypesSecret;
},{}],20:[function(require,module,exports){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactPureComponent
 */

'use strict';

var _assign = require('object-assign');

var ReactComponent = require('./ReactComponent');
var ReactNoopUpdateQueue = require('./ReactNoopUpdateQueue');

var emptyObject = require('fbjs/lib/emptyObject');

/**
 * Base class helpers for the updating state of a component.
 */
function ReactPureComponent(props, context, updater) {
  // Duplicated from ReactComponent.
  this.props = props;
  this.context = context;
  this.refs = emptyObject;
  // We initialize the default updater but the real one gets injected by the
  // renderer.
  this.updater = updater || ReactNoopUpdateQueue;
}

function ComponentDummy() {}
ComponentDummy.prototype = ReactComponent.prototype;
ReactPureComponent.prototype = new ComponentDummy();
ReactPureComponent.prototype.constructor = ReactPureComponent;
// Avoid an extra prototype jump for these methods.
_assign(ReactPureComponent.prototype, ReactComponent.prototype);
ReactPureComponent.prototype.isPureReactComponent = true;

module.exports = ReactPureComponent;
},{"./ReactComponent":9,"./ReactNoopUpdateQueue":15,"fbjs/lib/emptyObject":29,"object-assign":3}],21:[function(require,module,exports){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactVersion
 */

'use strict';

module.exports = '15.3.1';
},{}],22:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule canDefineProperty
 */

'use strict';

var canDefineProperty = false;
if (process.env.NODE_ENV !== 'production') {
  try {
    Object.defineProperty({}, 'x', { get: function () {} });
    canDefineProperty = true;
  } catch (x) {
    // IE will fail on defineProperty
  }
}

module.exports = canDefineProperty;
}).call(this,require('_process'))

},{"_process":1}],23:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule checkReactTypeSpec
 */

'use strict';

var _prodInvariant = require('./reactProdInvariant');

var ReactPropTypeLocationNames = require('./ReactPropTypeLocationNames');
var ReactPropTypesSecret = require('./ReactPropTypesSecret');

var invariant = require('fbjs/lib/invariant');
var warning = require('fbjs/lib/warning');

var ReactComponentTreeHook;

if (typeof process !== 'undefined' && process.env && process.env.NODE_ENV === 'test') {
  // Temporary hack.
  // Inline requires don't work well with Jest:
  // https://github.com/facebook/react/issues/7240
  // Remove the inline requires when we don't need them anymore:
  // https://github.com/facebook/react/pull/7178
  ReactComponentTreeHook = require('./ReactComponentTreeHook');
}

var loggedTypeFailures = {};

/**
 * Assert that the values match with the type specs.
 * Error messages are memorized and will only be shown once.
 *
 * @param {object} typeSpecs Map of name to a ReactPropType
 * @param {object} values Runtime values that need to be type-checked
 * @param {string} location e.g. "prop", "context", "child context"
 * @param {string} componentName Name of the component for error messages.
 * @param {?object} element The React element that is being type-checked
 * @param {?number} debugID The React component instance that is being type-checked
 * @private
 */
function checkReactTypeSpec(typeSpecs, values, location, componentName, element, debugID) {
  for (var typeSpecName in typeSpecs) {
    if (typeSpecs.hasOwnProperty(typeSpecName)) {
      var error;
      // Prop type validation may throw. In case they do, we don't want to
      // fail the render phase where it didn't fail before. So we log it.
      // After these have been cleaned up, we'll let them throw.
      try {
        // This is intentionally an invariant that gets caught. It's the same
        // behavior as without this statement except with a better message.
        !(typeof typeSpecs[typeSpecName] === 'function') ? process.env.NODE_ENV !== 'production' ? invariant(false, '%s: %s type `%s` is invalid; it must be a function, usually from React.PropTypes.', componentName || 'React class', ReactPropTypeLocationNames[location], typeSpecName) : _prodInvariant('84', componentName || 'React class', ReactPropTypeLocationNames[location], typeSpecName) : void 0;
        error = typeSpecs[typeSpecName](values, typeSpecName, componentName, location, null, ReactPropTypesSecret);
      } catch (ex) {
        error = ex;
      }
      process.env.NODE_ENV !== 'production' ? warning(!error || error instanceof Error, '%s: type specification of %s `%s` is invalid; the type checker ' + 'function must return `null` or an `Error` but returned a %s. ' + 'You may have forgotten to pass an argument to the type checker ' + 'creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and ' + 'shape all require an argument).', componentName || 'React class', ReactPropTypeLocationNames[location], typeSpecName, typeof error) : void 0;
      if (error instanceof Error && !(error.message in loggedTypeFailures)) {
        // Only monitor this failure once because there tends to be a lot of the
        // same error.
        loggedTypeFailures[error.message] = true;

        var componentStackInfo = '';

        if (process.env.NODE_ENV !== 'production') {
          if (!ReactComponentTreeHook) {
            ReactComponentTreeHook = require('./ReactComponentTreeHook');
          }
          if (debugID !== null) {
            componentStackInfo = ReactComponentTreeHook.getStackAddendumByID(debugID);
          } else if (element !== null) {
            componentStackInfo = ReactComponentTreeHook.getCurrentStackAddendum(element);
          }
        }

        process.env.NODE_ENV !== 'production' ? warning(false, 'Failed %s type: %s%s', location, error.message, componentStackInfo) : void 0;
      }
    }
  }
}

module.exports = checkReactTypeSpec;
}).call(this,require('_process'))

},{"./ReactComponentTreeHook":10,"./ReactPropTypeLocationNames":16,"./ReactPropTypesSecret":19,"./reactProdInvariant":26,"_process":1,"fbjs/lib/invariant":30,"fbjs/lib/warning":33}],24:[function(require,module,exports){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule getIteratorFn
 * 
 */

'use strict';

/* global Symbol */

var ITERATOR_SYMBOL = typeof Symbol === 'function' && Symbol.iterator;
var FAUX_ITERATOR_SYMBOL = '@@iterator'; // Before Symbol spec.

/**
 * Returns the iterator method function contained on the iterable object.
 *
 * Be sure to invoke the function with the iterable as context:
 *
 *     var iteratorFn = getIteratorFn(myIterable);
 *     if (iteratorFn) {
 *       var iterator = iteratorFn.call(myIterable);
 *       ...
 *     }
 *
 * @param {?object} maybeIterable
 * @return {?function}
 */
function getIteratorFn(maybeIterable) {
  var iteratorFn = maybeIterable && (ITERATOR_SYMBOL && maybeIterable[ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL]);
  if (typeof iteratorFn === 'function') {
    return iteratorFn;
  }
}

module.exports = getIteratorFn;
},{}],25:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule onlyChild
 */
'use strict';

var _prodInvariant = require('./reactProdInvariant');

var ReactElement = require('./ReactElement');

var invariant = require('fbjs/lib/invariant');

/**
 * Returns the first child in a collection of children and verifies that there
 * is only one child in the collection.
 *
 * See https://facebook.github.io/react/docs/top-level-api.html#react.children.only
 *
 * The current implementation of this function assumes that a single child gets
 * passed without a wrapper, but the purpose of this helper function is to
 * abstract away the particular structure of children.
 *
 * @param {?object} children Child collection structure.
 * @return {ReactElement} The first and only `ReactElement` contained in the
 * structure.
 */
function onlyChild(children) {
  !ReactElement.isValidElement(children) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'React.Children.only expected to receive a single React element child.') : _prodInvariant('143') : void 0;
  return children;
}

module.exports = onlyChild;
}).call(this,require('_process'))

},{"./ReactElement":13,"./reactProdInvariant":26,"_process":1,"fbjs/lib/invariant":30}],26:[function(require,module,exports){
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule reactProdInvariant
 * 
 */
'use strict';

/**
 * WARNING: DO NOT manually require this module.
 * This is a replacement for `invariant(...)` used by the error code system
 * and will _only_ be required by the corresponding babel pass.
 * It always throws.
 */

function reactProdInvariant(code) {
  var argCount = arguments.length - 1;

  var message = 'Minified React error #' + code + '; visit ' + 'http://facebook.github.io/react/docs/error-decoder.html?invariant=' + code;

  for (var argIdx = 0; argIdx < argCount; argIdx++) {
    message += '&args[]=' + encodeURIComponent(arguments[argIdx + 1]);
  }

  message += ' for the full message or use the non-minified dev environment' + ' for full errors and additional helpful warnings.';

  var error = new Error(message);
  error.name = 'Invariant Violation';
  error.framesToPop = 1; // we don't care about reactProdInvariant's own frame

  throw error;
}

module.exports = reactProdInvariant;
},{}],27:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule traverseAllChildren
 */

'use strict';

var _prodInvariant = require('./reactProdInvariant');

var ReactCurrentOwner = require('./ReactCurrentOwner');
var ReactElement = require('./ReactElement');

var getIteratorFn = require('./getIteratorFn');
var invariant = require('fbjs/lib/invariant');
var KeyEscapeUtils = require('./KeyEscapeUtils');
var warning = require('fbjs/lib/warning');

var SEPARATOR = '.';
var SUBSEPARATOR = ':';

/**
 * TODO: Test that a single child and an array with one item have the same key
 * pattern.
 */

var didWarnAboutMaps = false;

/**
 * Generate a key string that identifies a component within a set.
 *
 * @param {*} component A component that could contain a manual key.
 * @param {number} index Index that is used if a manual key is not provided.
 * @return {string}
 */
function getComponentKey(component, index) {
  // Do some typechecking here since we call this blindly. We want to ensure
  // that we don't block potential future ES APIs.
  if (component && typeof component === 'object' && component.key != null) {
    // Explicit key
    return KeyEscapeUtils.escape(component.key);
  }
  // Implicit key determined by the index in the set
  return index.toString(36);
}

/**
 * @param {?*} children Children tree container.
 * @param {!string} nameSoFar Name of the key path so far.
 * @param {!function} callback Callback to invoke with each child found.
 * @param {?*} traverseContext Used to pass information throughout the traversal
 * process.
 * @return {!number} The number of children in this subtree.
 */
function traverseAllChildrenImpl(children, nameSoFar, callback, traverseContext) {
  var type = typeof children;

  if (type === 'undefined' || type === 'boolean') {
    // All of the above are perceived as null.
    children = null;
  }

  if (children === null || type === 'string' || type === 'number' || ReactElement.isValidElement(children)) {
    callback(traverseContext, children,
    // If it's the only child, treat the name as if it was wrapped in an array
    // so that it's consistent if the number of children grows.
    nameSoFar === '' ? SEPARATOR + getComponentKey(children, 0) : nameSoFar);
    return 1;
  }

  var child;
  var nextName;
  var subtreeCount = 0; // Count of children found in the current subtree.
  var nextNamePrefix = nameSoFar === '' ? SEPARATOR : nameSoFar + SUBSEPARATOR;

  if (Array.isArray(children)) {
    for (var i = 0; i < children.length; i++) {
      child = children[i];
      nextName = nextNamePrefix + getComponentKey(child, i);
      subtreeCount += traverseAllChildrenImpl(child, nextName, callback, traverseContext);
    }
  } else {
    var iteratorFn = getIteratorFn(children);
    if (iteratorFn) {
      var iterator = iteratorFn.call(children);
      var step;
      if (iteratorFn !== children.entries) {
        var ii = 0;
        while (!(step = iterator.next()).done) {
          child = step.value;
          nextName = nextNamePrefix + getComponentKey(child, ii++);
          subtreeCount += traverseAllChildrenImpl(child, nextName, callback, traverseContext);
        }
      } else {
        if (process.env.NODE_ENV !== 'production') {
          var mapsAsChildrenAddendum = '';
          if (ReactCurrentOwner.current) {
            var mapsAsChildrenOwnerName = ReactCurrentOwner.current.getName();
            if (mapsAsChildrenOwnerName) {
              mapsAsChildrenAddendum = ' Check the render method of `' + mapsAsChildrenOwnerName + '`.';
            }
          }
          process.env.NODE_ENV !== 'production' ? warning(didWarnAboutMaps, 'Using Maps as children is not yet fully supported. It is an ' + 'experimental feature that might be removed. Convert it to a ' + 'sequence / iterable of keyed ReactElements instead.%s', mapsAsChildrenAddendum) : void 0;
          didWarnAboutMaps = true;
        }
        // Iterator will provide entry [k,v] tuples rather than values.
        while (!(step = iterator.next()).done) {
          var entry = step.value;
          if (entry) {
            child = entry[1];
            nextName = nextNamePrefix + KeyEscapeUtils.escape(entry[0]) + SUBSEPARATOR + getComponentKey(child, 0);
            subtreeCount += traverseAllChildrenImpl(child, nextName, callback, traverseContext);
          }
        }
      }
    } else if (type === 'object') {
      var addendum = '';
      if (process.env.NODE_ENV !== 'production') {
        addendum = ' If you meant to render a collection of children, use an array ' + 'instead or wrap the object using createFragment(object) from the ' + 'React add-ons.';
        if (children._isReactElement) {
          addendum = ' It looks like you\'re using an element created by a different ' + 'version of React. Make sure to use only one copy of React.';
        }
        if (ReactCurrentOwner.current) {
          var name = ReactCurrentOwner.current.getName();
          if (name) {
            addendum += ' Check the render method of `' + name + '`.';
          }
        }
      }
      var childrenString = String(children);
      !false ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Objects are not valid as a React child (found: %s).%s', childrenString === '[object Object]' ? 'object with keys {' + Object.keys(children).join(', ') + '}' : childrenString, addendum) : _prodInvariant('31', childrenString === '[object Object]' ? 'object with keys {' + Object.keys(children).join(', ') + '}' : childrenString, addendum) : void 0;
    }
  }

  return subtreeCount;
}

/**
 * Traverses children that are typically specified as `props.children`, but
 * might also be specified through attributes:
 *
 * - `traverseAllChildren(this.props.children, ...)`
 * - `traverseAllChildren(this.props.leftPanelChildren, ...)`
 *
 * The `traverseContext` is an optional argument that is passed through the
 * entire traversal. It can be used to store accumulations or anything else that
 * the callback might find relevant.
 *
 * @param {?*} children Children tree object.
 * @param {!function} callback To invoke upon traversing each child.
 * @param {?*} traverseContext Context for traversal.
 * @return {!number} The number of children in this subtree.
 */
function traverseAllChildren(children, callback, traverseContext) {
  if (children == null) {
    return 0;
  }

  return traverseAllChildrenImpl(children, '', callback, traverseContext);
}

module.exports = traverseAllChildren;
}).call(this,require('_process'))

},{"./KeyEscapeUtils":4,"./ReactCurrentOwner":11,"./ReactElement":13,"./getIteratorFn":24,"./reactProdInvariant":26,"_process":1,"fbjs/lib/invariant":30,"fbjs/lib/warning":33}],28:[function(require,module,exports){
"use strict";

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * 
 */

function makeEmptyFunction(arg) {
  return function () {
    return arg;
  };
}

/**
 * This function accepts and discards inputs; it has no side effects. This is
 * primarily useful idiomatically for overridable function endpoints which
 * always need to be callable, since JS lacks a null-call idiom ala Cocoa.
 */
var emptyFunction = function emptyFunction() {};

emptyFunction.thatReturns = makeEmptyFunction;
emptyFunction.thatReturnsFalse = makeEmptyFunction(false);
emptyFunction.thatReturnsTrue = makeEmptyFunction(true);
emptyFunction.thatReturnsNull = makeEmptyFunction(null);
emptyFunction.thatReturnsThis = function () {
  return this;
};
emptyFunction.thatReturnsArgument = function (arg) {
  return arg;
};

module.exports = emptyFunction;
},{}],29:[function(require,module,exports){
(function (process){
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */

'use strict';

var emptyObject = {};

if (process.env.NODE_ENV !== 'production') {
  Object.freeze(emptyObject);
}

module.exports = emptyObject;
}).call(this,require('_process'))

},{"_process":1}],30:[function(require,module,exports){
(function (process){
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */

'use strict';

/**
 * Use invariant() to assert state which your program assumes to be true.
 *
 * Provide sprintf-style format (only %s is supported) and arguments
 * to provide information about what broke and what you were
 * expecting.
 *
 * The invariant message will be stripped in production, but the invariant
 * will remain to ensure logic does not differ in production.
 */

function invariant(condition, format, a, b, c, d, e, f) {
  if (process.env.NODE_ENV !== 'production') {
    if (format === undefined) {
      throw new Error('invariant requires an error message argument');
    }
  }

  if (!condition) {
    var error;
    if (format === undefined) {
      error = new Error('Minified exception occurred; use the non-minified dev environment ' + 'for the full error message and additional helpful warnings.');
    } else {
      var args = [a, b, c, d, e, f];
      var argIndex = 0;
      error = new Error(format.replace(/%s/g, function () {
        return args[argIndex++];
      }));
      error.name = 'Invariant Violation';
    }

    error.framesToPop = 1; // we don't care about invariant's own frame
    throw error;
  }
}

module.exports = invariant;
}).call(this,require('_process'))

},{"_process":1}],31:[function(require,module,exports){
(function (process){
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @typechecks static-only
 */

'use strict';

var invariant = require('./invariant');

/**
 * Constructs an enumeration with keys equal to their value.
 *
 * For example:
 *
 *   var COLORS = keyMirror({blue: null, red: null});
 *   var myColor = COLORS.blue;
 *   var isColorValid = !!COLORS[myColor];
 *
 * The last line could not be performed if the values of the generated enum were
 * not equal to their keys.
 *
 *   Input:  {key1: val1, key2: val2}
 *   Output: {key1: key1, key2: key2}
 *
 * @param {object} obj
 * @return {object}
 */
var keyMirror = function keyMirror(obj) {
  var ret = {};
  var key;
  !(obj instanceof Object && !Array.isArray(obj)) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'keyMirror(...): Argument must be an object.') : invariant(false) : void 0;
  for (key in obj) {
    if (!obj.hasOwnProperty(key)) {
      continue;
    }
    ret[key] = key;
  }
  return ret;
};

module.exports = keyMirror;
}).call(this,require('_process'))

},{"./invariant":30,"_process":1}],32:[function(require,module,exports){
"use strict";

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */

/**
 * Allows extraction of a minified key. Let's the build system minify keys
 * without losing the ability to dynamically use key strings as values
 * themselves. Pass in an object with a single key/val pair and it will return
 * you the string key of that single record. Suppose you want to grab the
 * value for a key 'className' inside of an object. Key/val minification may
 * have aliased that key to be 'xa12'. keyOf({className: null}) will return
 * 'xa12' in that case. Resolve keys you want to use once at startup time, then
 * reuse those resolutions.
 */
var keyOf = function keyOf(oneKeyObj) {
  var key;
  for (key in oneKeyObj) {
    if (!oneKeyObj.hasOwnProperty(key)) {
      continue;
    }
    return key;
  }
  return null;
};

module.exports = keyOf;
},{}],33:[function(require,module,exports){
(function (process){
/**
 * Copyright 2014-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */

'use strict';

var emptyFunction = require('./emptyFunction');

/**
 * Similar to invariant but only logs a warning if the condition is not met.
 * This can be used to log issues in development environments in critical
 * paths. Removing the logging code for production environments will keep the
 * same logic and follow the same code paths.
 */

var warning = emptyFunction;

if (process.env.NODE_ENV !== 'production') {
  (function () {
    var printWarning = function printWarning(format) {
      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      var argIndex = 0;
      var message = 'Warning: ' + format.replace(/%s/g, function () {
        return args[argIndex++];
      });
      if (typeof console !== 'undefined') {
        console.error(message);
      }
      try {
        // --- Welcome to debugging React ---
        // This error was thrown as a convenience so that you can use this stack
        // to find the callsite that caused this warning to fire.
        throw new Error(message);
      } catch (x) {}
    };

    warning = function warning(condition, format) {
      if (format === undefined) {
        throw new Error('`warning(condition, format, ...args)` requires a warning ' + 'message argument');
      }

      if (format.indexOf('Failed Composite propType: ') === 0) {
        return; // Ignore CompositeComponent proptype check.
      }

      if (!condition) {
        for (var _len2 = arguments.length, args = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
          args[_key2 - 2] = arguments[_key2];
        }

        printWarning.apply(undefined, [format].concat(args));
      }
    };
  })();
}

module.exports = warning;
}).call(this,require('_process'))

},{"./emptyFunction":28,"_process":1}],34:[function(require,module,exports){
'use strict';

module.exports = require('./lib/React');

},{"./lib/React":6}],35:[function(require,module,exports){
'use strict';

module.exports = require('./src/Puf');

},{"./src/Puf":36}],36:[function(require,module,exports){
/**
 * React Puf Bundle
 *
 * version <tt>$ Version: 1.0 $</tt> date:2016/03/08
 * author <a href="mailto:hrahn@nkia.co.kr">Ahn Hyung-Ro</a>
 *
 */
'use strict';

// components
// Elements

var Alert = require('./components/Alert');
var Modal = require('./components/Modal').Modal;
var ModalHeader = require('./components/Modal').ModalHeader;
var ModalBody = require('./components/Modal').ModalBody;
var ModalFooter = require('./components/Modal').ModalFooter;
var Panel = require('./components/Panel').Panel;
var PanelHeader = require('./components/Panel').PanelHeader;
var PanelBody = require('./components/Panel').PanelBody;
var PanelFooter = require('./components/Panel').PanelFooter;
var HiddenContent = require('./components/HiddenContent');
var MainFrameSplitter = require('./components/MainFrameSplitter');

// Form Elements
var Checkbox = require('./components/Checkbox').Checkbox;
var HCheckbox = require('./components/Checkbox').HCheckbox;
var RadioGroup = require('./components/radio/RadioGroup');
var Radio = require('./components/radio/Radio');
var Fieldset = require('./components/Fieldset');

// Etc Elements
var FineUploader = require('./components/FineUploader');
//var TabSet = require('./components/tabs/TabSet');
//var Tabs = require('./components/tabs/Tabs');
//var Tab = require('./components/tabs/Tab');
//var TabContents = require('./components/tabs/TabContents');
//var TabContent = require('./components/tabs/TabContent');

// Kendo
var TreeView = require('./kendo/TreeView');
var Grid = require('./kendo/Grid');
var DropDownList = require('./kendo/DropDownList');
var DatePicker = require('./kendo/DatePicker');
var DateRangePicker = require('./kendo/DateRangePicker');
var TabStrip = require('./kendo/tabstrip/TabStrip');
var Tabs = require('./kendo/tabstrip/Tabs');
var Tab = require('./kendo/tabstrip/Tab');
var TabContent = require('./kendo/tabstrip/TabContent');
var PanelBar = require('./kendo/PanelBar');
var MultiSelect = require('./kendo/MultiSelect');
var NumericTextBox = require('./kendo/NumericTextBox');
var ProgressBar = require('./kendo/ProgressBar');
var Window = require('./kendo/Window');
var AutoComplete = require('./kendo/AutoComplete');

// Services
var Util = require('./services/Util');
var DateUtil = require('./services/DateUtil');
var NumberUtil = require('./services/NumberUtil');
var RegExp = require('./services/RegExp');
var Resource = require('./services/Resource');

var Puf = {
    // Elements
    Alert: Alert,
    Modal: Modal,
    ModalHeader: ModalHeader,
    ModalBody: ModalBody,
    ModalFooter: ModalFooter,
    Panel: Panel,
    PanelHeader: PanelHeader,
    PanelBody: PanelBody,
    PanelFooter: PanelFooter,
    HiddenContent: HiddenContent,
    MainFrameSplitter: MainFrameSplitter,

    // Form Elements
    Checkbox: Checkbox,
    HCheckbox: HCheckbox,
    RadioGroup: RadioGroup,
    Radio: Radio,
    Fieldset: Fieldset,

    // Etc Elements
    FineUploader: FineUploader,
    //TabSet: TabSet,
    //Tabs: Tabs,
    //Tab: Tab,
    //TabContents: TabContents,
    //TabContent: TabContent,

    // Kendo
    TreeView: TreeView,
    Grid: Grid,
    DropDownList: DropDownList,
    DatePicker: DatePicker,
    DateRangePicker: DateRangePicker,
    TabStrip: TabStrip,
    Tabs: Tabs,
    Tab: Tab,
    TabContent: TabContent,
    PanelBar: PanelBar.PanelBar,
    PanelBarPane: PanelBar.PanelBarPane,
    MultiSelect: MultiSelect,
    NumericTextBox: NumericTextBox,
    ProgressBar: ProgressBar,
    Window: Window,
    AutoComplete: AutoComplete,

    // Services
    Util: Util,
    DateUtil: DateUtil,
    NumberUtil: NumberUtil,
    RegExp: RegExp,
    Resource: Resource
};

module.exports = Puf;

},{"./components/Alert":37,"./components/Checkbox":38,"./components/Fieldset":39,"./components/FineUploader":40,"./components/HiddenContent":41,"./components/MainFrameSplitter":42,"./components/Modal":43,"./components/Panel":44,"./components/radio/Radio":45,"./components/radio/RadioGroup":46,"./kendo/AutoComplete":47,"./kendo/DatePicker":48,"./kendo/DateRangePicker":49,"./kendo/DropDownList":50,"./kendo/Grid":51,"./kendo/MultiSelect":52,"./kendo/NumericTextBox":53,"./kendo/PanelBar":54,"./kendo/ProgressBar":55,"./kendo/TreeView":56,"./kendo/Window":57,"./kendo/tabstrip/Tab":58,"./kendo/tabstrip/TabContent":59,"./kendo/tabstrip/TabStrip":60,"./kendo/tabstrip/Tabs":61,"./services/DateUtil":62,"./services/NumberUtil":63,"./services/RegExp":64,"./services/Resource":65,"./services/Util":66}],37:[function(require,module,exports){
/**
 * Alert component
 *
 * version <tt>$ Version: 1.0 $</tt> date:2016/03/24
 * author <a href="mailto:hrahn@nkia.co.kr">Ahn Hyung-Ro</a>
 *
 * example:
 * <Pum.Alert ref="alert" title="타이틀" message="메시지" onOk={this.onOk} />
 * <Pum.Alert ref="confirm" type="confirm" title="타이틀" message="메시지" onOk={this.onConfirm} onCancel={this.onCancel}/>
 *
 * bootstrap component
 */
'use strict';

var React = require('react');
var PropTypes = require('react').PropTypes;
var classNames = require('classnames');

var Util = require('../services/Util');

var Alert = React.createClass({
    displayName: 'Alert',
    propTypes: {
        id: PropTypes.string,
        className: PropTypes.string,
        type: PropTypes.string, // null/confirm (default: null)
        title: PropTypes.string,
        titleIconClassName: PropTypes.string,
        message: PropTypes.string,
        okLabel: PropTypes.string,
        cancelLabel: PropTypes.string,
        okClassName: PropTypes.string,
        cancelClassName: PropTypes.string,
        onOk: PropTypes.func,
        onCancel: PropTypes.func,
        width: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    },
    id: '',
    show: function show(okFunc, cancelFunc) {
        var alert = $('#' + this.id);
        alert.modal('show');

        this.okFunc = okFunc;
        this.cancelFunc = cancelFunc;
    },
    hide: function hide() {
        var alert = $('#' + this.id);
        alert.modal('hide');
    },
    setMessage: function setMessage(message) {
        if (typeof message === 'string') {
            this.setState({ message: message });
        }
    },
    onOk: function onOk(event) {
        // custom event emit 에 대해서 연구 필요
        this.hide();

        // okFunc
        if (typeof this.okFunc === 'function') {
            this.okFunc();
        }

        // onOk
        if (typeof this.props.onOk === 'function') {
            this.props.onOk();
        }
    },
    onCancel: function onCancel(event) {
        // custom event emit 에 대해서 연구 필요
        this.hide();

        // cancelFunc
        if (typeof this.cancelFunc === 'function') {
            this.cancelFunc();
        }

        // onCancel
        if (typeof this.props.onCancel === 'function') {
            this.props.onCancel();
        }
    },
    getDefaultProps: function getDefaultProps() {
        return { title: 'Title', okLabel: $ps_locale.confirm, cancelLabel: $ps_locale.cancel };
    },
    getInitialState: function getInitialState() {
        // 컴포넌트가 마운트되기 전 (한번 호출) / 리턴값은 this.state의 초기값으로 사용
        var _props = this.props;
        var title = _props.title;
        var message = _props.message;

        return { title: title, message: message };
    },
    componentWillMount: function componentWillMount() {
        // 최초 렌더링이 일어나기 직전(한번 호출)
        var id = this.props.id;
        if (typeof id === 'undefined') {
            id = Util.getUUID();
        }

        this.id = id;
    },
    componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
        // 컴포넌트가 새로운 props를 받을 때 호출(최초 렌더링 시에는 호출되지 않음)
        this.setState({ title: nextProps.title, message: nextProps.message });
    },
    render: function render() {
        // 필수 항목
        var _props2 = this.props;
        var className = _props2.className;
        var type = _props2.type;
        var okLabel = _props2.okLabel;
        var cancelLabel = _props2.cancelLabel;
        var okClassName = _props2.okClassName;
        var cancelClassName = _props2.cancelClassName;
        var titleIconClassName = _props2.titleIconClassName;
        var width = _props2.width;


        var cancelButton;
        if (type === 'confirm') {
            cancelButton = React.createElement(
                'button',
                { type: 'button', className: classNames('btn', 'btn-cancel', cancelClassName), onClick: this.onCancel, 'data-dismiss': 'modal' },
                cancelLabel
            );
        }

        return React.createElement(
            'div',
            { id: this.id, className: classNames('modal', 'modal-alert', className), role: 'dialog', 'aria-labelledby': '', 'aria-hidden': 'true', 'data-backdrop': 'static', 'data-keyboard': 'false' },
            React.createElement(
                'div',
                { className: 'modal-dialog modal-sm', style: { width: width } },
                React.createElement(
                    'div',
                    { className: 'modal-content' },
                    React.createElement(
                        'div',
                        { className: 'modal-header' },
                        React.createElement('span', { className: classNames('title-icon', titleIconClassName) }),
                        React.createElement(
                            'span',
                            { className: 'modal-title' },
                            this.state.title
                        )
                    ),
                    React.createElement(
                        'div',
                        { className: 'modal-body' },
                        this.state.message
                    ),
                    React.createElement(
                        'div',
                        { className: 'modal-footer' },
                        React.createElement(
                            'button',
                            { type: 'button', className: classNames('btn', 'btn-ok', okClassName), onClick: this.onOk },
                            okLabel
                        ),
                        cancelButton
                    )
                )
            )
        );
    }
});

module.exports = Alert;

},{"../services/Util":66,"classnames":2,"react":34}],38:[function(require,module,exports){
/**
 * CheckBox component
 *
 * version <tt>$ Version: 1.0 $</tt> date:2016/03/14
 * author <a href="mailto:hrahn@nkia.co.kr">Ahn Hyung-Ro</a>
 *
 * example:
 * <Pum.CheckBox name="name1" value="value1" onChange={this.onChange} checked={true}> 체크박스</Pum.CheckBox>
 *
 */
'use strict';

var React = require('react');
var PropTypes = require('react').PropTypes;
var classNames = require('classnames');

var Util = require('../services/Util');

var Checkbox = React.createClass({
    displayName: 'Checkbox',
    propTypes: {
        id: PropTypes.string,
        className: PropTypes.string,
        name: PropTypes.string,
        value: PropTypes.string,
        checked: PropTypes.bool,
        direction: PropTypes.oneOf(['h', 'v']),
        onChange: PropTypes.func
    },
    onChange: function onChange(e) {
        //console.log(e);
        var checked = !this.state.checked;
        //console.log(checked);
        this.setState({ checked: checked });
        if (typeof this.props.onChange === 'function') {
            this.props.onChange(e, checked, this.$checkbox.val());
        }
    },
    setValue: function setValue() {
        var checked = this.state.checked; /*,
                                          $checkbox = $('input:checkbox[name="' + this.props.name + '"]');*/
        if (typeof this.props.value === 'undefined') {
            // true/false 설정
            this.$checkbox.val(checked);
        } else {
            if (checked === true) {
                this.$checkbox.val(this.props.value);
            } else {
                this.$checkbox.val(null);
            }
        }
    },
    setStateObject: function setStateObject(props) {
        //let value = props.value;
        //if(typeof value === 'undefined') {
        //    value = null;
        //}

        var checked = props.checked;
        if (typeof checked === 'undefined') {
            checked = false;
        }

        return {
            //value: value,
            checked: checked
        };
    },
    getDefaultProps: function getDefaultProps() {
        // 클래스가 생성될 때 한번 호출되고 캐시된다.
        // 부모 컴포넌트에서 prop이 넘어오지 않은 경우 (in 연산자로 확인) 매핑의 값이 this.props에 설정된다.
        return { direction: 'v' };
    },
    getInitialState: function getInitialState() {
        return this.setStateObject(this.props);
    },
    componentWillMount: function componentWillMount() {
        // 최초 렌더링이 일어나기 직전(한번 호출)
        var id = this.props.id;
        if (typeof id === 'undefined') {
            id = Util.getUUID();
        }

        this.id = id;
    },
    componentDidMount: function componentDidMount() {
        // 최초 렌더링이 일어난 다음(한번 호출)
        this.$checkbox = $('input:checkbox[name="' + this.props.name + '"]');

        if (this.props.direction === 'h') {
            var $div = $('#' + this.id),
                $label = $div.children();
            $label.addClass('checkbox-inline');
            $div.replaceWith($label);
        }

        this.setValue();
    },
    componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
        // 컴포넌트가 새로운 props를 받을 때 호출(최초 렌더링 시에는 호출되지 않음)
        this.setState(this.setStateObject(nextProps));
    },
    componentDidUpdate: function componentDidUpdate(prevProps, prevState) {
        // 컴포넌트의 업데이트가 DOM에 반영된 직후에 호출(최초 렌더링 시에는 호출되지 않음)
        //console.log(prevProps);
        //console.log(prevState);
        //console.log(this.state);
        this.setValue();
    },
    render: function render() {
        // 필수 항목
        var _props = this.props;
        var className = _props.className;
        var name = _props.name;
        var children = _props.children;

        return React.createElement(
            'div',
            { className: 'checkbox', id: this.id },
            React.createElement(
                'label',
                null,
                React.createElement('input', { type: 'checkbox', className: className, name: name, checked: this.state.checked,
                    onChange: this.onChange }),
                React.createElement(
                    'span',
                    { className: 'lbl' },
                    children
                )
            )
        );
    }
});

var HCheckbox = React.createClass({
    displayName: 'HCheckbox',
    propTypes: {
        id: PropTypes.string,
        className: PropTypes.string,
        name: PropTypes.string,
        value: PropTypes.string,
        checked: PropTypes.bool,
        onChange: PropTypes.func
    },
    onChange: function onChange(event) {
        //console.log(event);
        var checked = !this.state.checked;
        //console.log(checked);
        this.setState({ checked: checked });
        if (typeof this.props.onChange === 'function') {
            this.props.onChange(event, checked);
        }
    },
    setValue: function setValue() {
        var checked = this.state.checked,
            $checkbox = $('input:checkbox[name="' + this.props.name + '"]');
        if (typeof this.props.value === 'undefined') {
            // true/false 설정
            $checkbox.val(checked);
        } else {
            if (checked === true) {
                $checkbox.val(this.props.value);
            } else {
                $checkbox.val(null);
            }
        }
    },
    setStateObject: function setStateObject(props) {
        //let value = props.value;
        //if(typeof value === 'undefined') {
        //    value = null;
        //}

        var checked = props.checked;
        if (typeof checked === 'undefined') {
            checked = false;
        }

        return {
            //value: value,
            checked: checked
        };
    },
    getInitialState: function getInitialState() {
        return this.setStateObject(this.props);
    },
    componentDidMount: function componentDidMount() {
        // 최초 렌더링이 일어난 다음(한번 호출)
        this.setValue();
    },
    componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
        // 컴포넌트가 새로운 props를 받을 때 호출(최초 렌더링 시에는 호출되지 않음)
        this.setState(this.setStateObject(nextProps));
    },
    componentDidUpdate: function componentDidUpdate(prevProps, prevState) {
        // 컴포넌트의 업데이트가 DOM에 반영된 직후에 호출(최초 렌더링 시에는 호출되지 않음)
        //console.log(prevProps);
        //console.log(prevState);
        //console.log(this.state);
        this.setValue();
    },
    render: function render() {
        // 필수 항목
        var _props2 = this.props;
        var className = _props2.className;
        var name = _props2.name;
        var children = _props2.children;

        return React.createElement(
            'label',
            { className: 'checkbox-inline' },
            React.createElement('input', { type: 'checkbox', className: className, name: name, checked: this.state.checked,
                onChange: this.onChange }),
            React.createElement(
                'span',
                { className: 'lbl' },
                children
            )
        );
    }
});

module.exports = {
    Checkbox: Checkbox,
    HCheckbox: HCheckbox
};

},{"../services/Util":66,"classnames":2,"react":34}],39:[function(require,module,exports){
/**
 * Fieldset component
 *
 * version <tt>$ Version: 1.0 $</tt> date:2016/03/30
 * author <a href="mailto:hrahn@nkia.co.kr">Ahn Hyung-Ro</a>
 *
 * example:
 * <Pum.Fieldset />
 *
 */
'use strict';

var React = require('react');
var PropTypes = require('react').PropTypes;
var classNames = require('classnames');

var Util = require('../services/Util');

var Fieldset = React.createClass({
    displayName: 'Fieldset',
    propTypes: {
        id: PropTypes.string,
        className: PropTypes.string,
        legend: PropTypes.string,
        expand: PropTypes.bool,
        collapsible: PropTypes.bool,
        onToggle: PropTypes.func,
        onInit: PropTypes.func
    },
    id: '',
    toggle: function toggle(props) {
        if (this.props.collapsible === true) {
            if (typeof props.expand !== 'undefined') {
                this.setState({ expand: props.expand });
            } else {
                this.setState({ expand: true });
            }
        }
    },
    onToggle: function onToggle(event) {
        var expand = !this.state.expand;
        this.toggle({ expand: expand });

        if (typeof this.props.onToggle === 'function') {
            this.props.onToggle(expand);
        }
    },
    getDefaultProps: function getDefaultProps() {
        // 클래스가 생성될 때 한번 호출되고 캐시된다.
        // 부모 컴포넌트에서 prop이 넘어오지 않은 경우 (in 연산자로 확인) 매핑의 값이 this.props에 설정된다.
        return { legend: 'Title', collapsible: true, expand: true };
    },
    getInitialState: function getInitialState() {
        // 컴포넌트가 마운트되기 전 (한번 호출) / 리턴값은 this.state의 초기값으로 사용
        return { expand: this.props.expand };
    },
    componentWillMount: function componentWillMount() {
        // 최초 렌더링이 일어나기 직전(한번 호출)
        var id = this.props.id;
        if (typeof id === 'undefined') {
            id = Util.getUUID();
        }

        this.id = id;
    },
    componentDidMount: function componentDidMount() {
        // 최초 렌더링이 일어난 다음(한번 호출)
        if (typeof this.props.onInit === 'function') {
            var data = {};
            data.expand = this.state.expand;
            this.props.onInit(data);
        }
    },
    componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
        // 컴포넌트가 새로운 props를 받을 때 호출(최초 렌더링 시에는 호출되지 않음)
        this.toggle(nextProps);
    },
    render: function render() {
        // 필수 항목
        var _props = this.props;
        var className = _props.className;
        var legend = _props.legend;
        var collapsible = _props.collapsible;


        var display,
            collapsed = false;
        if (this.state.expand === true) {
            display = 'block';
        } else {
            display = 'none';
            if (collapsible === true) {
                collapsed = true;
            }
        }

        return React.createElement(
            'fieldset',
            { className: classNames('fieldset', className, { collapsible: collapsible, collapsed: collapsed }) },
            React.createElement(
                'legend',
                { onClick: this.onToggle, name: this.id },
                ' ',
                legend
            ),
            React.createElement(
                'div',
                { style: { display: display } },
                React.createElement(
                    'div',
                    { id: this.id },
                    this.props.children
                )
            )
        );
    }
});

module.exports = Fieldset;

},{"../services/Util":66,"classnames":2,"react":34}],40:[function(require,module,exports){
/**
 * FineUploader component
 *
 * version <tt>$ Version: 1.0 $</tt> date:2016/09/27
 * author <a href="mailto:jyt@nkia.co.kr">Jung Young-Tai</a>
 *
 * example:
 * <Puf.FineUploader options={options} />
 *
 * FineUploader 라이브러리에 종속적이다.
 */
'use strict';

var React = require('react');
var PropTypes = require('react').PropTypes;
var classNames = require('classnames');

var Util = require('../services/Util');

var FineUploader = React.createClass({
    displayName: 'FineUploader',
    propTypes: {
        id: PropTypes.string,
        host: PropTypes.string, // 서버 정보(Cross Browser Access)
        sessionUrl: PropTypes.string, // 업로드된 초기 파일 Get Url
        uploadUrl: PropTypes.string, // 파일 업로드 URL
        deleteUrl: PropTypes.string, // 파일 삭제 URL
        params: PropTypes.object, // 파일 업로드 파라미터
        sessionParams: PropTypes.object, // 업로드된 초기 파일 Session Parameter
        autoUpload: PropTypes.bool, // Auto Upload
        multiple: PropTypes.bool, // 첨부파일 여러개 등록(선택) 가능 여부
        uploadedFileList: PropTypes.array, // 업로드 파일 목록
        allowedExtensions: PropTypes.array, // 첨부파일 허용확장자
        itemLimit: PropTypes.number, // 첨부파일 수 제한
        sizeLimit: PropTypes.number, // 첨부파일 사이즈 제한
        emptyError: PropTypes.string,
        noFilesError: PropTypes.string,
        sizeError: PropTypes.string,
        tooManyItemsError: PropTypes.string,
        typeError: PropTypes.string,
        onDelete: PropTypes.func,
        onDeleteComplete: PropTypes.func,
        onComplete: PropTypes.func,
        onError: PropTypes.func,
        onSessionRequestComplete: PropTypes.func
    },
    id: '',
    $fineUploader: undefined,
    getDefaultProps: function getDefaultProps() {
        return { autoUpload: true, multiple: true, params: {}, uploadedFileList: [], allowedExtensions: [], itemLimit: 0, sizeLimit: 0, emptyError: "0kb의 잘못된 파일입니다.", noFilesError: "첨부된 파일이 없습니다.", sizeError: "{file} is too large, maximum file size is {sizeLimit}!!.", tooManyItemsError: "Too many items ({netItems}) would be uploaded. Item limit is {itemLimit}!!.", typeError: "{file} has an invalid extension. Valid extension(s): {extensions}.!!" };
    },
    componentWillMount: function componentWillMount() {
        // 최초 렌더링이 일어나기 직전(한번 호출)
        var id = this.props.id;
        if (typeof id === 'undefined') {
            id = Util.getUUID();
        }
        this.id = id;
    },
    getOptions: function getOptions(props) {
        var _this = this;
        var host = props.host;
        var sessionUrl = props.sessionUrl;
        var uploadUrl = props.uploadUrl;
        var deleteUrl = props.deleteUrl;
        var autoUpload = props.autoUpload;
        var multiple = props.multiple;
        var params = props.params;
        var sessionParams = props.sessionParams;
        var uploadedFileList = props.uploadedFileList;
        var allowedExtensions = props.allowedExtensions;
        var itemLimit = props.itemLimit;
        var sizeLimit = props.sizeLimit;
        var emptyError = props.emptyError;
        var noFilesError = props.noFilesError;
        var sizeError = props.sizeError;
        var tooManyItemsError = props.tooManyItemsError;
        var typeError = props.typeError;
        var _onDelete = props.onDelete;
        var _onDeleteComplete = props.onDeleteComplete;
        var _onComplete = props.onComplete;
        var _onError = props.onError;
        var _onSessionRequestComplete = props.onSessionRequestComplete;

        var options = {
            autoUpload: autoUpload,
            multiple: multiple,
            request: {
                endpoint: host && host !== null && host.length > 0 ? host + uploadUrl : uploadUrl,
                params: params
            },
            validation: {
                allowedExtensions: allowedExtensions,
                itemLimit: itemLimit,
                sizeLimit: sizeLimit,
                tooManyItemsError: tooManyItemsError,
                typeError: typeError
            },
            messages: {
                emptyError: emptyError,
                noFilesError: noFilesError,
                sizeError: sizeError
            },
            session: {
                endpoint: host && host !== null && host.length > 0 ? host + sessionUrl : sessionUrl,
                params: { "test": 1 },
                refreshOnRequest: true
            },
            deleteFile: {
                enabled: true,
                method: 'POST',
                endpoint: host && host !== null && host.length > 0 ? host + deleteUrl : deleteUrl
            },
            callbacks: {
                onDelete: function onDelete(id) {
                    if (typeof _onDelete === 'function') {
                        _onDelete(id);
                    }
                },
                // 삭제 버튼 클릭시 Event
                onSubmitDelete: function onSubmitDelete(id) {
                    _this.fineUploader.setDeleteFileParams({ filename: _this.fineUploader.getName(id) }, id);
                },
                // 삭제 완료시 Event
                onDeleteComplete: function onDeleteComplete(id, xhr, isError) {
                    if (xhr.responseText) {
                        (function () {
                            var response = JSON.parse(xhr.responseText);
                            if ("file_name" in response) {
                                uploadedFileList.some(function (fileName, idx) {
                                    if (fileName == response.file_name) {
                                        return uploadedFileList.splice(idx, 1);
                                    }
                                });
                            }
                        })();
                    }
                    if (typeof _onDeleteComplete === 'function') {
                        _onDeleteComplete(id, xhr, isError);
                    }
                },
                // 업로드 완료시 Event
                onComplete: function onComplete(id, name, response, xhr) {
                    if ("file_name" in response) {
                        _this.fineUploader.setUuid(id, response.file_name);
                        uploadedFileList.push(response.file_name);
                    }
                    if (typeof _onComplete === 'function') {
                        _onComplete(id, name, response, xhr);
                    }
                },
                // Error 발생 이벤트
                onError: function onError(id, name, errorReason, xhr) {
                    if (typeof _onError === 'function') {
                        _onError(id, name, errorReason, xhr);
                    }
                },
                // 초기 File 목록 요청 완료시
                onSessionRequestComplete: function onSessionRequestComplete(response, success, xhr) {
                    if (typeof _onSessionRequestComplete === 'function') {
                        _onSessionRequestComplete(response, success, xhr, this);
                    }
                }
            }
        };

        if (host && host !== null && host.length > 0) {
            $.extend(options, { cors: {
                    //all requests are expected to be cross-domain requests
                    expected: true
                    //if you want cookies to be sent along with the request
                    //sendCredentials: true
                } });
        }

        return options;
    },
    componentDidMount: function componentDidMount() {
        // 최초 렌더링이 일어난 다음(한번 호출)
        this.$fineUploader = $('#' + this.id)[0];
        var settings = {
            element: this.$fineUploader
        };
        $.extend(settings, this.getOptions(this.props));
        this.fineUploader = new qq.FineUploader(settings);
    },
    componentWillReceiveProps: function componentWillReceiveProps(nextProps) {},
    // 첨부파일 업로드 Function
    uploadFiles: function uploadFiles() {
        this.fineUploader.uploadStoredFiles();
    },
    // 첨부파일 초기화 및 데이터 로드
    refreshSession: function refreshSession(sessionParams) {
        this.fineUploader.clearStoredFiles();
        this.fineUploader._session = null;
        this.fineUploader._options.session.params = sessionParams;
        this.fineUploader.reset();
    },
    render: function render() {
        // 필수 항목
        return React.createElement(
            'div',
            null,
            React.createElement('div', { id: this.id })
        );
    }
});

module.exports = FineUploader;

},{"../services/Util":66,"classnames":2,"react":34}],41:[function(require,module,exports){
/**
 * HiddenContent component
 *
 * version <tt>$ Version: 1.0 $</tt> date:2016/03/10
 * author <a href="mailto:hrahn@nkia.co.kr">Ahn Hyung-Ro</a>
 *
 * example:
 * <Pum.HiddenContent id={id} />
 *
 */
'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//var React = require('react');
//var PropTypes = require('react').PropTypes;
var classNames = require('classnames');

var Util = require('../services/Util');

var HiddenContent = _react2.default.createClass({
    displayName: 'HiddenContent',
    propTypes: {
        id: _react.PropTypes.string,
        className: _react.PropTypes.string,
        expandLabel: _react.PropTypes.string,
        collapseLabel: _react.PropTypes.string,
        expandIcon: _react.PropTypes.string,
        collapseIcon: _react.PropTypes.string,
        isBottom: _react.PropTypes.bool
    },
    id: '',
    onExpandCollapse: function onExpandCollapse(event) {
        //var node = event.target,
        //    aTag = node.parentNode;
        var aTag = event.target;
        if ($(aTag).next().css('display') === 'none') {
            this.setState({ label: this.props.collapseLabel, icon: this.props.collapseIcon });
            $(aTag).next().css('display', 'block');
        } else {
            this.setState({ label: this.props.expandLabel, icon: this.props.expandIcon });
            $(aTag).next().css('display', 'none');
        }
    },
    onBottomCollapse: function onBottomCollapse(event) {
        var node = event.target,
            div = node.parentNode; //.parentNode;
        $(div).css('display', 'none');
        this.setState({ label: this.props.expandLabel, icon: this.props.expandIcon });
    },
    getInitialState: function getInitialState() {

        var label = this.props.expandLabel;
        if (typeof label === 'undefined') {
            label = 'Expand';
        }

        var icon = this.props.expandIcon;

        return { label: label, icon: icon };
    },
    componentWillMount: function componentWillMount() {
        // 최초 렌더링이 일어나기 직전(한번 호출)
        var id = this.props.id;
        if (typeof id === 'undefined') {
            id = Util.getUUID();
        }

        this.id = id;
    },
    render: function render() {
        // 필수 항목
        var Icon;
        if (typeof this.state.icon === 'string') {
            Icon = _react2.default.createElement(
                'i',
                { className: this.state.icon },
                ' '
            );
        }

        // 맨 아래 접기버튼 처리
        var BottomButton;
        if (this.props.isBottom === true) {
            var CollapseIcon = void 0;
            if (typeof this.props.collapseIcon === 'string') {
                CollapseIcon = _react2.default.createElement(
                    'i',
                    { className: this.props.collapseIcon },
                    ' '
                );
            }

            // # 와 react-router 충돌문제 해결해야 함
            BottomButton = _react2.default.createElement(
                'a',
                { href: '#' + this.id, onClick: this.onBottomCollapse },
                CollapseIcon,
                this.props.collapseLabel
            );
        }

        return _react2.default.createElement(
            'div',
            { className: classNames('hidden-content', this.props.className) },
            _react2.default.createElement(
                'a',
                { href: 'javascript:void(0)', onClick: this.onExpandCollapse, name: this.id },
                Icon,
                this.state.label
            ),
            _react2.default.createElement(
                'div',
                { style: { display: 'none' } },
                _react2.default.createElement(
                    'div',
                    { id: this.id },
                    this.props.children
                ),
                BottomButton
            )
        );
    }
});

module.exports = HiddenContent;

},{"../services/Util":66,"classnames":2,"react":34}],42:[function(require,module,exports){
/**
 * Splitter component
 *
 * version <tt>$ Version: 1.0 $</tt> date:2016/03/03
 * author <a href="mailto:hrahn@nkia.co.kr">Ahn Hyung-Ro</a>
 *
 * example:
 * <Puf.Splitter />
 *
 */
'use strict';

var React = require('react');
var PropTypes = require('react').PropTypes;
var classNames = require('classnames');

var Util = require('../services/Util');

var Splitter = React.createClass({
    displayName: 'Splitter',
    propTypes: {
        id: PropTypes.string,
        className: PropTypes.string,
        type: PropTypes.oneOf(['h', 'v']).isRequired,
        position: PropTypes.oneOf(['left', 'right', 'top', 'bottom']).isRequired,
        //leftPane: PropTypes.string,
        //rightPane: PropTypes.string,
        minLeft: PropTypes.number.isRequired,
        minRight: PropTypes.number.isRequired,
        maxLeft: PropTypes.number.isRequired,
        maxRight: PropTypes.number.isRequired,
        onResize: PropTypes.func
    },
    id: '',
    open: function open() {
        this.splitterOpen();
    },
    close: function close() {
        var _props = this.props;
        var type = _props.type;
        var position = _props.position;


        this.splitterClose();
        if (type === 'h') {

            if (position === 'left') {
                this.$splitter.next().offset({ left: 0 });
            } else if (position === 'right') {
                this.$splitter.prev().css('right', 0);
            }
        }
    },
    visible: function visible(b) {
        if (b === false) {
            this.$splitter.css('display', 'none');
        } else {
            this.$splitter.css('display', '');
        }
    },
    onResize: function onResize(e) {
        if (this.props.onResize) {
            this.props.onResize(e);
        }
    },
    //-----------------------------
    // private
    splitterActiveFlag: false,
    splitterObj: false,
    splitterMouseDown: function splitterMouseDown(e) {
        if (!this.splitterActiveFlag && this.state.expand === true) {
            // document.getElementById(this.id)
            if (this.$splitter[0].setCapture) {
                this.$splitter[0].setCapture();
            } else {
                document.addEventListener('mouseup', this.splitterMouseUp, true);
                document.addEventListener('mousemove', this.splitterMouseMove, true);
                e.preventDefault();
            }
            this.splitterActiveFlag = true;
            this.splitterObj = this.$splitter[0];

            //leftsidebarCollapseWidth = $('.leftsidebar-collapse').outerWidth(true);
            this.splitterWidth = this.$splitter.outerWidth(true);

            /*splitterParentObj = b.parentElement;
             console.log(splitterObj.offsetLeft);
             console.log(splitterObj.parentElement.offsetLeft);*/
        }
    },
    splitterMouseUp: function splitterMouseUp(e) {
        if (this.splitterActiveFlag) {
            //        var a = document.getElementById("toc");
            //        var c = document.getElementById("content");
            //        changeQSearchboxWidth();
            //        a.style.width = (splitterObj.offsetLeft - 20) + "px";
            //        c.style.left = (splitterObj.offsetLeft + 10) + "px";

            var _props2 = this.props;
            var type = _props2.type;
            var position = _props2.position;


            if (type === 'h') {
                if (position === 'left') {
                    this.$splitter.prev().outerWidth(this.splitterObj.offsetLeft);
                    this.$splitter.next().offset({ left: this.splitterObj.offsetLeft + this.splitterWidth });
                } else if (position === 'right') {
                    this.hRightSplitterOffsetRight = this.$splitter.parent().outerWidth(true) - this.splitterObj.offsetLeft;
                    this.$splitter.prev().css('right', this.hRightSplitterOffsetRight);
                    this.$splitter.next().outerWidth(this.hRightSplitterOffsetRight - this.splitterWidth);

                    //this.$splitter.prev().offset({ right: this.splitterObj.offsetRight });
                    //this.$splitter.next().outerWidth(this.splitterObj.offsetRight - this.splitterWidth);
                }
            }

            if (this.splitterObj.releaseCapture) {
                this.splitterObj.releaseCapture();
            } else {
                document.removeEventListener('mouseup', this.splitterMouseUp, true);
                document.removeEventListener('mousemove', this.splitterMouseMove, true);
                e.preventDefault();
            }
            this.splitterActiveFlag = false;
            this.saveSplitterPos();
            //this.onResize();
            this.$splitter.trigger('resize');
        }
    },
    splitterMouseMove: function splitterMouseMove(e) {
        var _props3 = this.props;
        var type = _props3.type;
        var position = _props3.position;
        var minLeft = _props3.minLeft;
        var minRight = _props3.minRight;
        var maxLeft = _props3.maxLeft;
        var maxRight = _props3.maxRight;


        if (this.splitterActiveFlag) {
            if (type === 'h') {
                if (position === 'left') {
                    if (e.clientX >= minLeft && e.clientX <= maxLeft) {
                        this.splitterObj.style.left = e.clientX + 'px';
                        if (!this.splitterObj.releaseCapture) {
                            e.preventDefault();
                        }
                    }
                } else if (position === 'right') {
                    if (e.clientX <= document.documentElement.clientWidth - minRight && e.clientX >= document.documentElement.clientWidth - maxRight) {
                        this.splitterObj.style.left = e.clientX + 'px';
                        if (!this.splitterObj.releaseCapture) {
                            e.preventDefault();
                        }
                    }
                }
            }
            /*
            if (e.clientX >= this.props.minLeft && e.clientX <= document.documentElement.clientWidth - this.props.minRight) {
                this.splitterObj.style.left = e.clientX + 'px';
                if(!this.splitterObj.releaseCapture) {
                    e.preventDefault();
                }
            }
            */
        }
    },
    splitterOpen: function splitterOpen() {
        var _props4 = this.props;
        var type = _props4.type;
        var position = _props4.position;


        if (type === 'h') {
            if (position === 'left') {
                this.$splitter.prev().offset({ left: 0 });
                this.$splitter.offset({ left: this.leftFrameWidth });
                this.$splitter.next().offset({ left: this.leftFrameWidth + this.splitterWidth });
            } else if (position === 'right') {
                this.$splitter.prev().css('right', this.rightFrameWidth + this.splitterWidth);
                this.$splitter.offset({ left: this.$splitter.parent().outerWidth(true) - this.rightFrameWidth - this.splitterWidth });
                this.$splitter.next().outerWidth(this.rightFrameWidth);
            }
        }

        this.$splitter.css('cursor', 'e-resize');

        /*
         this.$splitter.prev().on('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(e) {
            this.$splitter.css('display', 'block');
        });
        */
        this.setState({ expand: true });
        this.$splitter.trigger('resize');
    },
    splitterClose: function splitterClose() {
        var _props5 = this.props;
        var type = _props5.type;
        var position = _props5.position;


        if (type === 'h') {
            this.splitterWidth = this.$splitter.outerWidth(true);

            if (position === 'left') {
                this.leftFrameWidth = this.$splitter.prev().outerWidth(true);

                this.$splitter.prev().offset({ left: this.leftFrameWidth * -1 });
                this.$splitter.offset({ left: 0 });
                this.$splitter.next().offset({ left: this.splitterWidth });
            } else if (position === 'right') {
                this.rightFrameWidth = this.$splitter.next().outerWidth(true);

                this.$splitter.prev().css('right', this.splitterWidth);
                this.$splitter.offset({ left: this.$splitter.parent().outerWidth(true) - this.splitterWidth });
                this.$splitter.next().outerWidth(0);
            }
        }

        this.$splitter.css('cursor', 'default');
        //this.$splitter.prev().off('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend');
        this.setState({ expand: false });
        this.$splitter.trigger('resize');
    },
    expandCollapse: function expandCollapse(e) {
        if (this.state.expand === true) {
            this.splitterClose();
        } else {
            this.splitterOpen();
        }
    },
    saveSplitterPos: function saveSplitterPos() {
        var _props6 = this.props;
        var type = _props6.type;
        var position = _props6.position;

        var a = this.$splitter[0]; //document.getElementById(this.id);
        if (a) {
            if (type === 'h') {
                if (position === 'left') {
                    Util.setCookie('hsplitterLeftPosition', a.offsetLeft, 365);
                } else if (position === 'right') {
                    Util.setCookie('hsplitterRightPosition', this.hRightSplitterOffsetRight, 365);
                }
            }
        }
    },
    resizeSplitterPos: function resizeSplitterPos() {
        var _props7 = this.props;
        var type = _props7.type;
        var position = _props7.position;

        if (type === 'h') {
            if (position === 'right') {
                var rightFrameWidth = 0;
                if (this.state.expand === true) {
                    rightFrameWidth = this.$splitter.next().outerWidth(true);
                }
                this.$splitter.offset({ left: this.$splitter.parent().outerWidth(true) - rightFrameWidth - this.splitterWidth });
            }
        }
    },
    getDefaultProps: function getDefaultProps() {
        // 클래스가 생성될 때 한번 호출되고 캐시된다.
        // 부모 컴포넌트에서 prop이 넘어오지 않은 경우 (in 연산자로 확인) 매핑의 값이 this.props에 설정된다.
        return { type: 'h', position: 'left', minLeft: 50, minRight: 50, maxLeft: 500, maxRight: 500 };
    },
    getInitialState: function getInitialState() {
        // 컴포넌트가 마운트되기 전 (한번 호출) / 리턴값은 this.state의 초기값으로 사용
        return { expand: true };
    },
    componentWillMount: function componentWillMount() {
        // 최초 렌더링이 일어나기 직전(한번 호출)
        var id = this.props.id;
        if (typeof id === 'undefined') {
            id = Util.getUUID();
        }

        this.id = id;
    },
    componentDidMount: function componentDidMount() {
        // 최초 렌더링이 일어난 다음(한번 호출)
        this.$splitter = $('#' + this.id);

        // Events
        this.$splitter.on('resize', this.onResize);

        var _this = this;
        $(window).on('resize', function (e) {
            // splitter에서 발생시키는 resize 이벤트와 구별
            if (e.target === this) {
                //_this.resizeSplitterPos();
                // splitterOpen/splitterClose 함수 실행과 시간차를 두어야 적용됨
                setTimeout(_this.resizeSplitterPos, 1);
            }
        });
    },
    render: function render() {
        // 필수 항목
        var _props8 = this.props;
        var className = _props8.className;
        var type = _props8.type;
        var position = _props8.position;
        var visible = _props8.visible;


        var h = true;
        if (type !== 'h') {
            h = false;
        }

        var l = true;
        if (position !== 'left') {
            l = false;
        }

        var display = 'block';
        if (!this.state.expand) {
            display = 'none';
        }

        return React.createElement(
            'div',
            { id: this.id, className: classNames({ 'mainframe-splitter': true, 'h-splitter': h, 'v-splitter': !h, 'left-splitter': l, 'right-splitter': !l }, className),
                onMouseDown: this.splitterMouseDown, onMouseUp: this.splitterMouseUp, onMouseMove: this.splitterMouseMove },
            React.createElement('div', { className: classNames({ 'splitter-collapse': this.state.expand, 'splitter-expand': !this.state.expand }), onMouseUp: this.expandCollapse }),
            React.createElement('div', { className: 'splitter-resize-handle', style: { display: display } })
        );
    }
});

module.exports = Splitter;

},{"../services/Util":66,"classnames":2,"react":34}],43:[function(require,module,exports){
/**
 * Modal component
 *
 * version <tt>$ Version: 1.0 $</tt> date:2016/03/25
 * author <a href="mailto:hrahn@nkia.co.kr">Ahn Hyung-Ro</a>
 *
 * example:
 * <Pum.Modal ref="modal" width="700px">
 *   <Pum.ModalHeader>Modal Title</Pum.ModalHeader>
 *   <Pum.ModalBody>Modal Body</Pum.ModalBody>
 *   <Pum.ModalFooter>Modal Footer</Pum.ModalFooter>
 * </Pum.Modal>
 *
 * bootstrap component
 */
'use strict';

var React = require('react');
var PropTypes = require('react').PropTypes;
var classNames = require('classnames');

var Util = require('../services/Util');

var ModalHeader = React.createClass({
    displayName: 'ModalHeader',
    propTypes: {
        className: PropTypes.string
    },
    render: function render() {
        // 필수 항목
        return React.createElement(
            'div',
            { className: classNames('modal-header', this.props.className) },
            React.createElement(
                'button',
                { type: 'button', className: 'close', 'data-dismiss': 'modal' },
                React.createElement(
                    'span',
                    { 'aria-hidden': 'true' },
                    '×'
                ),
                React.createElement(
                    'span',
                    { className: 'sr-only' },
                    'Close'
                )
            ),
            React.createElement(
                'span',
                { className: 'modal-title' },
                this.props.children
            )
        );
    }
});

var ModalBody = React.createClass({
    displayName: 'ModalBody',
    propTypes: {
        className: PropTypes.string
    },
    render: function render() {
        // 필수 항목
        return React.createElement(
            'div',
            { className: classNames('modal-body', this.props.className) },
            this.props.children
        );
    }
});

var ModalFooter = React.createClass({
    displayName: 'ModalFooter',
    propTypes: {
        className: PropTypes.string
    },
    render: function render() {
        // 필수 항목
        return React.createElement(
            'div',
            { className: classNames('modal-footer', this.props.className) },
            this.props.children
        );
    }
});

var Modal = React.createClass({
    displayName: 'Modal',
    propTypes: {
        id: PropTypes.string,
        className: PropTypes.string,
        width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        backdrop: PropTypes.bool,
        onShow: PropTypes.func,
        onHide: PropTypes.func,
        init: PropTypes.func
    },
    id: '',
    show: function show() {
        var alert = $('#' + this.id);
        alert.modal('show');
        /*
        if(this.props.backdrop === true) {
            alert.modal('show');
        }else {
            alert.modal({
                backdrop: 'static',
                keyboard: false
            });
        }
        */
    },
    hide: function hide() {
        var alert = $('#' + this.id);
        alert.modal('hide');
    },
    onShow: function onShow(event) {
        if (typeof this.props.onShow === 'function') {
            this.props.onShow(event);
            //event.stopImmediatePropagation();
        }
    },
    onHide: function onHide(event) {
        if (typeof this.props.onHide === 'function') {
            this.props.onHide(event);
            //event.stopImmediatePropagation();
        }
    },
    getChildren: function getChildren() {
        var children = this.props.children;

        return React.Children.map(children, function (child) {
            if (child === null) {
                return null;
            }

            return React.cloneElement(child, {});
        });
    },
    getDefaultProps: function getDefaultProps() {
        return { backdrop: false };
    },
    componentWillMount: function componentWillMount() {
        // 최초 렌더링이 일어나기 직전(한번 호출)
        var id = this.props.id;
        if (typeof id === 'undefined') {
            id = Util.getUUID();
        }

        this.id = id;
    },
    componentDidMount: function componentDidMount() {
        // 최초 렌더링이 일어난 다음(한번 호출)
        var $modal = $('#' + this.id);
        if (this.props.backdrop === false) {
            $modal.attr('data-backdrop', 'static');
            $modal.attr('data-keyboard', false);
        }

        $modal.on('shown.bs.modal', this.onShow);
        $modal.on('hidden.bs.modal', this.onHide);

        if (typeof this.props.init === 'function') {
            var data = {};
            data.$modal = $modal;
            this.props.init(data);
        }
    },
    render: function render() {
        // 필수 항목
        var _props = this.props;
        var className = _props.className;
        var width = _props.width;


        return React.createElement(
            'div',
            { id: this.id, className: classNames('modal', 'fade', className), role: 'dialog', 'aria-labelledby': '', 'aria-hidden': 'true' },
            React.createElement(
                'div',
                { className: 'modal-dialog', style: { width: width } },
                React.createElement(
                    'div',
                    { className: 'modal-content' },
                    this.getChildren()
                )
            )
        );
    }
});

module.exports = {
    Modal: Modal,
    ModalHeader: ModalHeader,
    ModalBody: ModalBody,
    ModalFooter: ModalFooter
};

},{"../services/Util":66,"classnames":2,"react":34}],44:[function(require,module,exports){
/**
 * Panel component
 *
 * version <tt>$ Version: 1.0 $</tt> date:2016/03/30
 * author <a href="mailto:hrahn@nkia.co.kr">Ahn Hyung-Ro</a>
 *
 * example:
 * <Pum.Panel  />
 *
 * bootstrap component
 */
'use strict';

var React = require('react');
var PropTypes = require('react').PropTypes;
var classNames = require('classnames');

var Util = require('../services/Util');

var PanelHeader = React.createClass({
    displayName: 'PanelHeader',
    propTypes: {
        width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        height: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    },
    getInitialState: function getInitialState() {
        // 컴포넌트가 마운트되기 전 (한번 호출) / 리턴값은 this.state의 초기값으로 사용
        var _props = this.props;
        var width = _props.width;
        var height = _props.height;

        return { width: width, height: height };
    },
    componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
        // 컴포넌트가 새로운 props를 받을 때 호출(최초 렌더링 시에는 호출되지 않음)
        var width = nextProps.width;
        var height = nextProps.height;

        this.setState({ width: width, height: height });
    },
    render: function render() {
        // 필수 항목
        return React.createElement(
            'div',
            { className: 'panel-heading', style: { width: this.state.width, height: this.state.height } },
            React.createElement(
                'div',
                { className: 'panel-title' },
                this.props.children
            )
        );
    }
});

var PanelBody = React.createClass({
    displayName: 'PanelBody',
    propTypes: {
        width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        height: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    },
    getInitialState: function getInitialState() {
        // 컴포넌트가 마운트되기 전 (한번 호출) / 리턴값은 this.state의 초기값으로 사용
        var _props2 = this.props;
        var width = _props2.width;
        var height = _props2.height;

        return { width: width, height: height };
    },
    componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
        // 컴포넌트가 새로운 props를 받을 때 호출(최초 렌더링 시에는 호출되지 않음)
        var width = nextProps.width;
        var height = nextProps.height;

        this.setState({ width: width, height: height });
    },
    render: function render() {
        // 필수 항목
        return React.createElement(
            'div',
            { className: 'panel-body', style: { width: this.state.width, height: this.state.height } },
            this.props.children
        );
    }
});

var PanelFooter = React.createClass({
    displayName: 'PanelFooter',
    propTypes: {
        width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        height: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    },
    getInitialState: function getInitialState() {
        // 컴포넌트가 마운트되기 전 (한번 호출) / 리턴값은 this.state의 초기값으로 사용
        var _props3 = this.props;
        var width = _props3.width;
        var height = _props3.height;

        return { width: width, height: height };
    },
    componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
        // 컴포넌트가 새로운 props를 받을 때 호출(최초 렌더링 시에는 호출되지 않음)
        var width = nextProps.width;
        var height = nextProps.height;

        this.setState({ width: width, height: height });
    },
    render: function render() {
        // 필수 항목
        return React.createElement(
            'div',
            { className: 'panel-footer', style: { width: this.state.width, height: this.state.height } },
            this.props.children
        );
    }
});

var Panel = React.createClass({
    displayName: 'Panel',
    propTypes: {
        id: PropTypes.string,
        className: PropTypes.string
    },
    id: '',
    getChildren: function getChildren() {
        var children = this.props.children;

        return React.Children.map(children, function (child) {
            if (child === null) {
                return null;
            }

            return React.cloneElement(child, {});
        });
    },
    getDefaultProps: function getDefaultProps() {
        // 클래스가 생성될 때 한번 호출되고 캐시된다.
        // 부모 컴포넌트에서 prop이 넘어오지 않은 경우 (in 연산자로 확인) 매핑의 값이 this.props에 설정된다.
        return { className: 'panel-default' };
    },
    componentWillMount: function componentWillMount() {
        // 최초 렌더링이 일어나기 직전(한번 호출)
        var id = this.props.id;
        if (typeof id === 'undefined') {
            id = Util.getUUID();
        }

        this.id = id;
    },
    componentDidMount: function componentDidMount() {
        // 최초 렌더링이 일어난 다음(한번 호출)

    },
    render: function render() {
        // 필수 항목
        var className = this.props.className;


        return React.createElement(
            'div',
            { className: classNames('panel', className) },
            this.getChildren()
        );
    }
});

module.exports = {
    Panel: Panel,
    PanelHeader: PanelHeader,
    PanelBody: PanelBody,
    PanelFooter: PanelFooter
};

},{"../services/Util":66,"classnames":2,"react":34}],45:[function(require,module,exports){
/**
 * Radio component
 *
 * version <tt>$ Version: 1.0 $</tt> date:2016/03/17
 * author <a href="mailto:hrahn@nkia.co.kr">Ahn Hyung-Ro</a>
 *
 * example:
 * <Puf.Radio options="{options}" />
 *
 */
'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var classNames = require('classnames');

var Util = require('../../services/Util');

var Radio = _react2.default.createClass({
    displayName: 'Radio',
    propTypes: {
        id: _react.PropTypes.string,
        className: _react.PropTypes.string,
        name: _react.PropTypes.string,
        selectedValue: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.number, _react.PropTypes.bool]),
        direction: _react.PropTypes.oneOf(['h', 'v']),
        onChange: _react.PropTypes.func,
        value: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.number, _react.PropTypes.bool])
    },
    componentWillMount: function componentWillMount() {
        // 최초 렌더링이 일어나기 직전(한번 호출)
        var id = this.props.id;
        if (typeof id === 'undefined') {
            id = Util.getUUID();
        }

        this.id = id;
    },
    componentDidMount: function componentDidMount() {
        // 최초 렌더링이 일어난 다음(한번 호출)
        if (this.props.direction === 'h') {
            var $div = $('#' + this.id),
                $label = $div.children();
            $label.addClass('radio-inline');
            $div.replaceWith($label);
        }
    },
    render: function render() {
        // 필수 항목
        var _props = this.props;
        var className = _props.className;
        var name = _props.name;
        var selectedValue = _props.selectedValue;
        var onChange = _props.onChange;
        var value = _props.value;
        var children = _props.children;

        var optional = {};
        if (selectedValue !== undefined) {
            optional.checked = this.props.value === selectedValue;
        }
        /*
        if(typeof onChange === 'function') {
            optional.onChange = onChange.bind(null, this.props.value);
        }
        */
        optional.onChange = onChange.bind(null, this.props.value);

        return _react2.default.createElement(
            'div',
            { className: 'radio', id: this.id },
            _react2.default.createElement(
                'label',
                null,
                _react2.default.createElement('input', _extends({ type: 'radio', className: className, name: name, value: value
                }, optional)),
                _react2.default.createElement(
                    'span',
                    { className: 'lbl' },
                    children
                )
            )
        );
    }
});

module.exports = Radio;

},{"../../services/Util":66,"classnames":2,"react":34}],46:[function(require,module,exports){
/**
 * RadioGroup component
 *
 * version <tt>$ Version: 1.0 $</tt> date:2016/03/17
 * author <a href="mailto:hrahn@nkia.co.kr">Ahn Hyung-Ro</a>
 *
 * example:
 * <Puf.RadioGroup options="{options}" />
 *
 */
'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var classNames = require('classnames');

var RadioGroup = _react2.default.createClass({
    displayName: 'RadioGroup',
    propTypes: {
        className: _react.PropTypes.string,
        name: _react.PropTypes.string,
        selectedValue: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.number, _react.PropTypes.bool]),
        direction: _react.PropTypes.oneOf(['h', 'v']),
        onChange: _react.PropTypes.func
    },
    onChange: function onChange(value, event) {
        this.setState({ selectedValue: value });
        if (typeof this.props.onChange === 'function') {
            this.props.onChange(event, value);
        }
    },
    getChildren: function getChildren() {
        var _props = this.props;
        var className = _props.className;
        var name = _props.name;
        var direction = _props.direction;
        var children = _props.children;
        var selectedValue = this.state.selectedValue;
        var onChange = this.onChange;

        return _react2.default.Children.map(children, function (radio) {
            if (radio === null) {
                return null;
            }

            return _react2.default.cloneElement(radio, {
                className: className,
                name: name,
                selectedValue: selectedValue,
                direction: direction,
                onChange: onChange
            });
        });
    },
    setStateObject: function setStateObject(props) {
        var selectedValue = props.selectedValue;
        if (typeof selectedValue === 'undefined') {
            selectedValue = null;
        }

        return {
            selectedValue: selectedValue
        };
    },
    getDefaultProps: function getDefaultProps() {
        // 클래스가 생성될 때 한번 호출되고 캐시된다.
        // 부모 컴포넌트에서 prop이 넘어오지 않은 경우 (in 연산자로 확인) 매핑의 값이 this.props에 설정된다.
        return { direction: 'v' };
    },
    getInitialState: function getInitialState() {
        return this.setStateObject(this.props);
    },
    componentDidMount: function componentDidMount() {
        // 최초 렌더링이 일어난 다음(한번 호출)
        //console.log('componentDidMount');
    },
    componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
        // 컴포넌트가 새로운 props를 받을 때 호출(최초 렌더링 시에는 호출되지 않음)
        this.setState(this.setStateObject(nextProps));
    },
    render: function render() {
        // 필수 항목
        return _react2.default.createElement(
            'div',
            { className: 'radio-group' },
            this.getChildren()
        );
    }
});

module.exports = RadioGroup;

},{"classnames":2,"react":34}],47:[function(require,module,exports){
/**
 * AutoComplete component
 *
 * version <tt>$ Version: 1.0 $</tt> date:2016/09/09
 * author <a href="mailto:jyt@nkia.co.kr">Jung Young-Tai</a>
 *
 * example:
 * <Puf.AutoComplete options={options} />
 *
 * Kendo AutoComplete 라이브러리에 종속적이다.
 */
'use strict';

var React = require('react');
var PropTypes = require('react').PropTypes;
var classNames = require('classnames');

var Util = require('../services/Util');

var AutoComplete = React.createClass({
    displayName: 'AutoComplete',
    propTypes: {
        id: PropTypes.string,
        name: PropTypes.string,
        host: PropTypes.string, // 서버 정보(Cross Browser Access)
        url: PropTypes.string,
        method: PropTypes.string,
        data: PropTypes.object,
        placeholder: PropTypes.string,
        dataSource: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
        template: PropTypes.string,
        filter: PropTypes.string,
        separator: PropTypes.string,
        minLength: PropTypes.number,
        dataTextField: PropTypes.string,
        parameterMapField: PropTypes.object // Parameter Control 객체(필터처리)
    },
    id: '',
    $autoComplete: undefined,
    getDefaultProps: function getDefaultProps() {
        // 클래스가 생성될 때 한번 호출되고 캐시된다.
        // 부모 컴포넌트에서 prop이 넘어오지 않은 경우 (in 연산자로 확인) 매핑의 값이 this.props에 설정된다.
        return { method: 'POST', listField: 'resultValue.list', totalField: 'resultValue.totalCount', placeholder: $ps_locale.autoComplete, filter: "startswith", separator: ", ", template: null, dataTextField: null, minLength: 1 };
    },
    componentWillMount: function componentWillMount() {
        /// 최초 렌더링이 일어나기 직전(한번 호출)
        var id = this.props.id;
        if (typeof id === 'undefined') {
            id = Util.getUUID();
        }
        this.id = id;
    },
    getDataSource: function getDataSource(props) {
        var host = props.host;
        var url = props.url;
        var method = props.method;
        var data = props.data;
        var listField = props.listField;
        var totalField = props.totalField;
        var parameterMapField = props.parameterMapField;


        var dataSource = new kendo.data.DataSource({
            transport: {
                read: {
                    url: host && host !== null && host.length > 0 ? host + url : url,
                    type: method,
                    dataType: 'json',
                    data: data, // search (@RequestBody GridParam gridParam 로 받는다.)
                    contentType: 'application/json; charset=utf-8'
                },
                parameterMap: function parameterMap(data, type) {
                    if (type == "read" && parameterMapField !== null) {
                        // Filter Array => Json Object Copy
                        if (parameterMapField.filtersToJson && data.filter && data.filter.filters) {
                            var filters = data.filter.filters;
                            filters.map(function (filter) {
                                data[parameterMapField.searchField] = filter.value;
                            });
                        }
                    }
                    return JSON.stringify(data);
                }
            },
            schema: {
                // returned in the "listField" field of the response
                data: function data(response) {
                    var arr = [],
                        gridList = response;

                    if (listField && listField.length > 0 && listField != 'null') {
                        arr = listField.split('.');
                    }
                    for (var i in arr) {
                        //console.log(arr[i]);
                        if (!gridList) {
                            gridList = [];
                            break;
                        }
                        gridList = gridList[arr[i]];
                    }
                    return gridList;
                },
                // returned in the "totalField" field of the response
                total: function total(response) {
                    //console.log(response);
                    var arr = [],
                        total = response;
                    if (totalField && totalField.length > 0 && totalField != 'null') {
                        arr = totalField.split('.');
                    }
                    for (var i in arr) {
                        //console.log(arr[i]);
                        if (!total) {
                            total = 0;
                            break;
                        }
                        total = total[arr[i]];
                    }
                    return total;
                }
            },
            serverFiltering: true
        });
        return dataSource;
    },
    getOptions: function getOptions(props) {
        var placeholder = props.placeholder;
        var template = props.template;
        var dataTextField = props.dataTextField;
        var minLength = props.minLength;
        var separator = props.separator;

        var dataSource = this.getDataSource(props);

        var options = {
            placeholder: placeholder,
            template: template,
            dataSource: dataSource,
            dataTextField: dataTextField,
            minLength: minLength,
            separator: separator
        };
        return options;
    },
    componentDidMount: function componentDidMount() {
        // 최초 렌더링이 일어난 다음(한번 호출)
        this.$autoComplete = $('#' + this.id);
        //console.log(this.getOptions(this.props));
        this.autoComplete = this.$autoComplete.kendoAutoComplete(this.getOptions(this.props));
    },
    componentWillReceiveProps: function componentWillReceiveProps(nextProps) {},
    render: function render() {
        // 필수 항목
        var inputStyle = {
            width: "100%"
        };
        var _props = this.props;
        var name = _props.name;
        var className = _props.className;

        return React.createElement('input', { id: this.id, name: name, className: classNames(className), style: inputStyle });
    }
});

module.exports = AutoComplete;

},{"../services/Util":66,"classnames":2,"react":34}],48:[function(require,module,exports){
/**
 * DatePicker component
 *
 * version <tt>$ Version: 1.0 $</tt> date:2016/06/05
 * author <a href="mailto:hrahn@nkia.co.kr">Ahn Hyung-Ro</a>
 *
 * example:
 * <Puf.DatePicker options={options} />
 *
 * Kendo DatePicker 라이브러리에 종속적이다.
 */
'use strict';

var React = require('react');
var PropTypes = require('react').PropTypes;
var classNames = require('classnames');

var Util = require('../services/Util');
var DateUtil = require('../services/DateUtil');

var DatePicker = React.createClass({
    displayName: 'DatePicker',
    propTypes: {
        id: PropTypes.string,
        className: PropTypes.string,
        name: PropTypes.string,
        date: PropTypes.oneOfType([PropTypes.string, // YYYY-MM-DD HH:mm:ss format의 string
        PropTypes.object // Date
        ]),
        min: PropTypes.oneOfType([PropTypes.string, // YYYY-MM-DD HH:mm:ss format의 string
        PropTypes.object // Date
        ]),
        max: PropTypes.oneOfType([PropTypes.string, // YYYY-MM-DD HH:mm:ss format의 string
        PropTypes.object // Date
        ]),
        timePicker: PropTypes.bool,
        interval: PropTypes.number,
        width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        disabled: PropTypes.bool,
        onChange: PropTypes.func,
        onClose: PropTypes.func,
        onOpen: PropTypes.func,
        init: PropTypes.func
    },
    id: '',
    //-----------------------------
    // api
    open: function open() {
        this.datePicker.open();
    },
    close: function close() {
        this.datePicker.close();
    },
    readonly: function readonly() {
        this.datePicker.readonly();
    },
    getDate: function getDate() {
        var date = this.datePicker.value(); // Date 객체 리턴함
        //console.log(date);
        //console.log(typeof date);
        return DateUtil.getDateToString(date); // YYYY-MM-DD HH:mm:ss format의 string
    },
    setDate: function setDate(date) {
        /*
        if(typeof date === 'undefined') {
            this.datePicker.value(new Date());
        }else if(typeof date === 'string' || typeof date.getMonth === 'function') {
            // YYYY-MM-DD HH:mm:ss format의 string
            this.datePicker.value(date);
        }
        */
        // YYYY-MM-DD HH:mm:ss format의 string
        if (typeof date === 'string' || typeof date.getMonth === 'function') {
            this.datePicker.value(date);
        }
    },
    enable: function enable(b) {
        if (typeof b === 'undefined') {
            b = true;
        }
        this.datePicker.enable(b);
    },
    min: function min(date) {
        if (typeof date === 'string' || typeof date.getMonth === 'function') {
            this.datePicker.min(date);
        }
    },
    max: function max(date) {
        if (typeof date === 'string' || typeof date.getMonth === 'function') {
            this.datePicker.max(date);
        }
    },
    //-----------------------------
    // event
    onChange: function onChange(e) {
        //console.log('onChange');
        if (typeof this.props.onChange === 'function') {
            var date = this.getDate();
            this.props.onChange(date);

            //event.stopImmediatePropagation();
        }
    },
    onClose: function onClose(e) {
        //console.log('onClose');
        //e.preventDefault(); //prevent popup closing
        if (typeof this.props.onClose === 'function') {
            this.props.onClose(e);

            //event.stopImmediatePropagation();
        }
    },
    onOpen: function onOpen(e) {
        //console.log('onOpen');
        //e.preventDefault(); //prevent popup opening
        if (typeof this.props.onOpen === 'function') {
            this.props.onOpen(e);

            //event.stopImmediatePropagation();
        }
    },
    //-----------------------------
    /*
    setStateObject: function(props) {
         let disabled = props.disabled;
        if(typeof disabled === 'undefined') {
            disabled = false;
        }
         return {
            disabled: disabled
        };
    },
    */
    getTimeOptions: function getTimeOptions() {
        var interval = this.props.interval;


        var intervalValue;
        if (typeof interval === 'undefined') {
            intervalValue = 5;
        } else {
            intervalValue = interval;
        }

        return {
            timeFormat: 'HH:mm',
            interval: intervalValue
        };
    },
    getOptions: function getOptions() {
        var _props = this.props;
        var date = _props.date;
        var timePicker = _props.timePicker;
        var min = _props.min;
        var max = _props.max;


        var dateValue;
        if (typeof date === 'undefined') {
            dateValue = new Date();
        } else if (typeof date === 'string' || typeof date.getMonth === 'function') {
            dateValue = date;
        }

        var format = 'yyyy-MM-dd',
            timeOptions;
        if (timePicker === true) {
            format = 'yyyy-MM-dd HH:mm';
            timeOptions = this.getTimeOptions();
        }

        var options = {
            value: dateValue,
            format: format,
            culture: 'ko-KR', // http://docs.telerik.com/kendo-ui/framework/globalization/overview
            change: this.onChange,
            close: this.onClose,
            open: this.onOpen
        };

        $.extend(options, timeOptions);

        // min
        if (typeof min !== 'undefined') {
            $.extend(options, { min: min });
        }

        // max
        if (typeof max !== 'undefined') {
            $.extend(options, { max: max });
        }

        return options;
    },
    /*
    getInitialState: function() {
    // 컴포넌트가 마운트되기 전 (한번 호출) / 리턴값은 this.state의 초기값으로 사용
        return this.setStateObject(this.props);
    },
    */
    componentWillMount: function componentWillMount() {
        // 최초 렌더링이 일어나기 직전(한번 호출)
        var id = this.props.id;
        if (typeof id === 'undefined') {
            id = Util.getUUID();
        }

        this.id = id;
    },
    componentDidMount: function componentDidMount() {
        // 최초 렌더링이 일어난 다음(한번 호출)
        this.$datePicker = $('#' + this.id);

        if (this.props.timePicker === true) {
            this.datePicker = this.$datePicker.kendoDateTimePicker(this.getOptions()).data('kendoDateTimePicker');
        } else {
            this.datePicker = this.$datePicker.kendoDatePicker(this.getOptions()).data('kendoDatePicker');
        }

        if (this.props.disabled === true) {
            this.enable(false);
        }

        if (typeof this.props.init === 'function') {
            var data = {};
            data.$datePicker = this.$datePicker;
            data.datePicker = this.datePicker;
            this.props.init(data);
        }
    },
    componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
        // 컴포넌트가 새로운 props를 받을 때 호출(최초 렌더링 시에는 호출되지 않음)
        //this.setState(this.setStateObject(nextProps));
        this.setDate(nextProps.date);
        this.enable(!nextProps.disabled);
    },
    render: function render() {
        // 필수 항목
        var _props2 = this.props;
        var className = _props2.className;
        var name = _props2.name;
        var width = _props2.width;


        return React.createElement('input', { id: this.id, className: classNames(className), name: name, style: { width: width } });
    }
});

module.exports = DatePicker;

},{"../services/DateUtil":62,"../services/Util":66,"classnames":2,"react":34}],49:[function(require,module,exports){
/**
 * DateRangePicker component
 *
 * version <tt>$ Version: 1.0 $</tt> date:2016/06/05
 * author <a href="mailto:hrahn@nkia.co.kr">Ahn Hyung-Ro</a>
 *
 * example:
 * <Puf.DateRangePicker options={options} />
 *
 * Kendo DatePicker 라이브러리에 종속적이다.
 */
'use strict';

var React = require('react');
var PropTypes = require('react').PropTypes;
var classNames = require('classnames');

var Util = require('../services/Util');
var DateUtil = require('../services/DateUtil');

var DateRangePicker = React.createClass({
    displayName: 'DateRangePicker',
    propTypes: {
        id: PropTypes.string,
        className: PropTypes.string,
        startName: PropTypes.string,
        endName: PropTypes.string,
        startDate: PropTypes.oneOfType([PropTypes.string, // YYYY-MM-DD HH:mm:ss format의 string
        PropTypes.object // Date
        ]),
        endDate: PropTypes.oneOfType([PropTypes.string, // YYYY-MM-DD HH:mm:ss format의 string
        PropTypes.object // Date
        ]),
        disabled: PropTypes.bool,
        timePicker: PropTypes.bool,
        onChange: PropTypes.func,
        init: PropTypes.func
    },
    id: '',
    //-----------------------------
    // api
    getStartDate: function getStartDate() {
        var date = this.startPicker.value(); // Date 객체 리턴함
        //console.log(date);
        //console.log(typeof date);
        return DateUtil.getDateToString(date); // YYYY-MM-DD HH:mm:ss format의 string
    },
    getEndDate: function getEndDate() {
        var date = this.endPicker.value(); // Date 객체 리턴함
        return DateUtil.getDateToString(date); // YYYY-MM-DD HH:mm:ss format의 string
    },
    setStartDate: function setStartDate(date) {
        // YYYY-MM-DD HH:mm:ss format의 string
        if (typeof date === 'string' || typeof date.getMonth === 'function') {
            this.startPicker.value(date);
            this.onStartChange(date);
        }
    },
    setEndDate: function setEndDate(date) {
        // YYYY-MM-DD HH:mm:ss format의 string
        if (typeof date === 'string' || typeof date.getMonth === 'function') {
            this.endPicker.value(date);
            this.onEndChange(date);
        }
    },
    enable: function enable(b) {
        if (typeof b === 'undefined') {
            b = true;
        }
        this.startPicker.enable(b);
        this.endPicker.enable(b);
    },
    //-----------------------------
    onStartInit: function onStartInit(data) {
        this.startPicker = data.datePicker;
    },
    onEndInit: function onEndInit(data) {
        this.endPicker = data.datePicker;
    },
    onStartChange: function onStartChange(date) {
        this.endPicker.min(date);
        if (typeof this.props.onChange === 'function') {
            this.props.onChange(this.getStartDate(), this.getEndDate());
            //event.stopImmediatePropagation();
        }
        //var startDate = this.startPicker.value(),
        //    endDate = this.endPicker.value();
        //
        //if (startDate) {
        //    this.endPicker.min(startDate);
        //} else if (endDate) {
        //    this.startPicker.max(endDate);
        //} else {
        //    endDate = new Date();
        //    start.max(endDate);
        //    end.min(endDate);
        //}
    },
    onEndChange: function onEndChange(date) {
        this.startPicker.max(date);
        if (typeof this.props.onChange === 'function') {
            this.props.onChange(this.getStartDate(), this.getEndDate());
            //event.stopImmediatePropagation();
        }
    },
    setStateObject: function setStateObject(props) {
        // startDate 처리
        var startDate = props.startDate;

        // endDate 처리
        var endDate = props.endDate;

        // disabled 처리
        var disabled = props.disabled;
        if (typeof disabled === 'undefined') {
            disabled = false;
        }

        return {
            startDate: startDate,
            endDate: endDate,
            disabled: disabled
        };
    },
    getDefaultProps: function getDefaultProps() {
        // 클래스가 생성될 때 한번 호출되고 캐시된다.
        // 부모 컴포넌트에서 prop이 넘어오지 않은 경우 (in 연산자로 확인) 매핑의 값이 this.props에 설정된다.
        return { startName: 'startDate', endName: 'endDate' };
    },
    getInitialState: function getInitialState() {
        // 컴포넌트가 마운트되기 전 (한번 호출) / 리턴값은 this.state의 초기값으로 사용
        return this.setStateObject(this.props);
    },
    componentDidMount: function componentDidMount() {
        // 최초 렌더링이 일어난 다음(한번 호출)
        this.startPicker.max(this.endPicker.value());
        this.endPicker.min(this.startPicker.value());

        if (typeof this.props.init === 'function') {
            var data = {};
            data.startPicker = this.startPicker;
            data.endPicker = this.endPicker;
            this.props.init(data);
        }
    },
    componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
        // 컴포넌트가 새로운 props를 받을 때 호출(최초 렌더링 시에는 호출되지 않음)
        this.setState(this.setStateObject(nextProps));
    },
    render: function render() {
        // 필수 항목
        var _props = this.props;
        var className = _props.className;
        var startName = _props.startName;
        var endName = _props.endName;
        var timePicker = _props.timePicker;
        var _state = this.state;
        var startDate = _state.startDate;
        var endDate = _state.endDate;
        var disabled = _state.disabled;


        return React.createElement(
            'div',
            { className: 'datepicker-group' },
            React.createElement(Puf.DatePicker, { className: className, name: startName, date: startDate, init: this.onStartInit, onChange: this.onStartChange,
                timePicker: timePicker, disabled: disabled }),
            ' ',
            React.createElement(Puf.DatePicker, { className: className, name: endName, date: endDate, init: this.onEndInit, onChange: this.onEndChange,
                timePicker: timePicker, disabled: disabled })
        );
    }
});

module.exports = DateRangePicker;

},{"../services/DateUtil":62,"../services/Util":66,"classnames":2,"react":34}],50:[function(require,module,exports){
/**
 * DropDownList component
 *
 * version <tt>$ Version: 1.0 $</tt> date:2016/05/03
 * author <a href="mailto:hrahn@nkia.co.kr">Ahn Hyung-Ro</a>
 *
 * example:
 * <Puf.DropDownList options={options} />
 *
 * Kendo DropDownList 라이브러리에 종속적이다.
 */
'use strict';

var React = require('react');
var PropTypes = require('react').PropTypes;
var classNames = require('classnames');

var Util = require('../services/Util');

var DropDownList = React.createClass({
    displayName: 'DropDownList',
    propTypes: {
        id: PropTypes.string,
        className: PropTypes.string,
        name: PropTypes.string,
        url: PropTypes.string,
        method: PropTypes.string,
        width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        optionLabel: PropTypes.string,
        dataTextField: PropTypes.string,
        dataValueField: PropTypes.string,
        selectedItem: PropTypes.object,
        selectedValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        selectedIndex: PropTypes.number,
        items: PropTypes.array,
        headerTemplate: PropTypes.string,
        valueTemplate: PropTypes.string,
        template: PropTypes.string,
        disabled: PropTypes.bool,
        onSelect: PropTypes.func,
        onChange: PropTypes.func,
        onClose: PropTypes.func,
        onOpen: PropTypes.func,
        onFiltering: PropTypes.func,
        onDataBound: PropTypes.func
    },
    id: '',
    //-----------------------------
    // api
    open: function open() {
        this.dropdownlist.open();
    },
    close: function close() {
        this.dropdownlist.close();
    },
    select: function select(index) {
        // index: li jQuery | Number | Function
        // return The index of the selected item
        return this.dropdownlist.select(index);
    },
    value: function value(v) {
        if (arguments.length == 0) {
            return this.dropdownlist.value();
        } else {
            return this.dropdownlist.value(v);
        }
    },
    //-----------------------------
    // event
    onSelect: function onSelect(e) {
        //console.log('onSelect');
        //console.log(event);
        var dropdownlist = this.$dropDownList.data('kendoDropDownList'),
            dataItem = dropdownlist.dataItem(e.item);
        //console.log(dataItem);
        //console.log(dataItem[this.props.dataValueField]);
        //$('[name=' + this.props.name + ']').val(dataItem.value);
        //$('input[name=displayData]').val(dataItem[this.props.dataValueField]);
        //this.$dropDownList.val(dataItem[this.props.dataValueField]);

        if (typeof this.props.onSelect === 'function') {
            var selectedItem = dataItem,
                selectedValue = dataItem[this.props.dataValueField];
            this.props.onSelect(e, selectedItem, selectedValue);

            //e.stopImmediatePropagation();
        }
    },
    onChange: function onChange(e) {
        //console.log('onChange');
        //console.log(event);

        if (typeof this.props.onChange === 'function') {
            this.props.onChange(e);

            //event.stopImmediatePropagation();
        }
    },
    onClose: function onClose(e) {
        //console.log('onClose');
        //console.log(event);

        if (typeof this.props.onClose === 'function') {
            this.props.onClose(e);

            //event.stopImmediatePropagation();
        }
    },
    onOpen: function onOpen(e) {
        //console.log('onOpen');
        //console.log(event);

        if (typeof this.props.onOpen === 'function') {
            this.props.onOpen(e);

            //event.stopImmediatePropagation();
        }
    },
    onFiltering: function onFiltering(e) {

        if (typeof this.props.onFiltering !== 'undefined') {
            this.props.onFiltering(e);
        }
    },
    onDataBound: function onDataBound(event) {
        //console.log('onDataBound');
        //console.log(event);

        if (typeof this.props.onDataBound === 'function') {
            this.props.onDataBound(event);

            //event.stopImmediatePropagation();
        }
    },
    getOptions: function getOptions() {
        var _props = this.props;
        var url = _props.url;
        var method = _props.method;
        var items = _props.items;
        var selectedIndex = _props.selectedIndex;
        var selectedValue = _props.selectedValue;
        var dataTextField = _props.dataTextField;
        var dataValueField = _props.dataValueField;
        var headerTemplate = _props.headerTemplate;
        var valueTemplate = _props.valueTemplate;
        var template = _props.template;


        var options = {
            dataTextField: dataTextField,
            dataValueField: dataValueField,
            dataSource: []
        };

        // dataSource
        // url
        if (typeof url !== 'undefined') {
            $.extend(options, { dataSource: {
                    transport: {
                        read: {
                            url: url,
                            type: method,
                            dataType: 'json'
                        }
                    }
                } });
        } else if (typeof items !== 'undefined') {
            $.extend(options, { dataSource: items });
        }

        // selectedIndex
        if (typeof selectedIndex !== 'undefined') {
            $.extend(options, { index: selectedIndex });
        }

        // selectedValue
        if (typeof selectedValue !== 'undefined') {
            $.extend(options, { value: selectedValue });
        }

        // headerTemplate
        if (typeof headerTemplate !== 'undefined') {
            $.extend(options, { headerTemplate: headerTemplate });
        }

        // valueTemplate
        if (typeof valueTemplate !== 'undefined') {
            $.extend(options, { valueTemplate: valueTemplate });
        }

        // template
        if (typeof template !== 'undefined') {
            $.extend(options, { template: template });
        }

        return options;
    },
    getDefaultProps: function getDefaultProps() {
        // 클래스가 생성될 때 한번 호출되고 캐시된다.
        // 부모 컴포넌트에서 prop이 넘어오지 않은 경우 (in 연산자로 확인) 매핑의 값이 this.props에 설정된다.		
        return { width: '100%', dataTextField: 'text', dataValueField: 'value', selectedIndex: 0 };
    },
    componentWillMount: function componentWillMount() {
        // 최초 렌더링이 일어나기 직전(한번 호출)      
        var id = this.props.id;
        if (typeof id === 'undefined') {
            id = Util.getUUID();
        }

        this.id = id;
    },
    componentDidMount: function componentDidMount() {
        // 최초 렌더링이 일어난 다음(한번 호출)
        this.$dropDownList = $('#' + this.id);
        this.dropdownlist = this.$dropDownList.kendoDropDownList(this.getOptions()).data('kendoDropDownList');

        // Events
        this.dropdownlist.bind('select', this.onSelect);
        this.dropdownlist.bind('change', this.onChange);
        this.dropdownlist.bind('open', this.onOpen);
        this.dropdownlist.bind('close', this.onClose);
        this.dropdownlist.bind('filtering', this.onFiltering);
        this.dropdownlist.bind('dataBound', this.onDataBound);

        // dropdownlist 초기 선택 (getOptions() 에서 처리)
        /*
        if(typeof this.props.selectedValue !== 'undefined') {
            this.dropdownlist.value(this.props.selectedValue);
        }else {
            this.dropdownlist.select(0);
        }
        */

        /*
        if(typeof this.props.init === 'function') {
            var data = {};
            data.$dropDownList = this.$dropDownList;
            data.dropdownlist = this.dropdownlist;
            this.props.init(data);
        }
        */
    },
    componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
        // 컴포넌트가 새로운 props를 받을 때 호출(최초 렌더링 시에는 호출되지 않음)
        if (typeof nextProps.selectedValue !== 'undefined') {
            this.dropdownlist.value(nextProps.selectedValue);
        }
    },
    render: function render() {
        // 필수 항목       
        var _props2 = this.props;
        var className = _props2.className;
        var name = _props2.name;
        var width = _props2.width;


        return React.createElement('input', { id: this.id, name: name, style: { width: width } });
    }
});

module.exports = DropDownList;

},{"../services/Util":66,"classnames":2,"react":34}],51:[function(require,module,exports){
/**
 * Grid component
 *
 * version <tt>$ Version: 1.0 $</tt> date:2016/04/17
 * author <a href="mailto:hrahn@nkia.co.kr">Ahn Hyung-Ro</a>
 *
 * example:
 * <Puf.Grid options={options} />
 *
 * Kendo Grid 라이브러리에 종속적이다.
 */
'use strict';

var React = require('react');
var PropTypes = require('react').PropTypes;
var classNames = require('classnames');

var Util = require('../services/Util');

var Grid = React.createClass({
    displayName: 'Grid',
    propTypes: {
        id: PropTypes.string,
        className: PropTypes.string,
        host: PropTypes.string, // 서버 정보(Cross Browser Access)
        url: PropTypes.string,
        method: PropTypes.string,
        checkboxField: PropTypes.string,
        data: PropTypes.object,
        columns: PropTypes.array,
        selectedIds: PropTypes.array,
        listField: PropTypes.string,
        totalField: PropTypes.string,
        checkField: PropTypes.string,
        onSelectRow: PropTypes.func,
        onChange: PropTypes.func,
        resizable: PropTypes.bool,
        filterable: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
        sortable: PropTypes.bool,
        pageable: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
        pageSize: PropTypes.number,
        height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

        /*
          Grid selectable 설정값
          "row" - the user can select a single row.
          "cell" - the user can select a single cell.
          "multiple, row" - the user can select multiple rows.
          "multiple, cell" - the user can select multiple cells.
        */
        selectMode: PropTypes.oneOf(['row', 'cell']), // Grid Select Row 또는 Cell 선택
        multiple: PropTypes.bool, // 셀렉트 multiple 지원
        /*
          Grid parameterMapField 설정값
          skip: "start", - paging skip 변수 입력된 값(key)으로 복제
          take: "limit", - paging limit 변수 입력된 값(key)으로 복제
          convertSort: true, - sort parameter 복제 여부
          field:"property",  - sort field 변수 입력된 값(key)으로 복제
          dir: "direction",  - sort dir 변수 입력된 값(key)으로 복제
          filtersToJson: true,      - filter 정보를 json으로 변환해서 일반 파라미터 처럼 처리
          filterPrefix: "search_",  - filter json으로 변환시 prefix가 필요한 경우 prefix를 붙여서 반환
          filterFieldToLowerCase: true  - filter의 field를 lowerCase(소문자)로 반환
        */
        parameterMapField: PropTypes.object, // Parameter Control 객체(데이터 복사, 필터처리, Sorting 파리미터 정의 등)
        scrollable: PropTypes.bool // 좌우 스크롤 생성
    },
    id: '',
    $grid: undefined,
    checkedIds: {},
    checkedItems: {},
    /*
    * Grid Change Event(Select Event), dataSet으로 정의하여 받는다.
    * rowIndex
    * cellIndex
    * data
    * rows
    */
    onChange: function onChange() {
        var grid = this.grid;
        if (typeof this.props.onChange === 'function') {
            //var data = event.node;
            var dataSet = {};
            if (this.props.selectMode === "cell") {
                var row = $(grid.select()).closest("tr");
                var cell = grid.select();
                var cellText = $(cell).text();
                dataSet.rowIndex = $("tr", grid.tbody).index(row);
                dataSet.cellIndex = grid.cellIndex(cell);
                dataSet.data = $(cell).text();
            } else {
                var rows = grid.select();

                if (rows.length > 1) {
                    (function () {
                        var rowsData = [];
                        rows.each(function () {
                            rowsData.push(grid.dataItem($(this)));
                        });
                        dataSet.rows = rows;
                        dataSet.data = rowsData;
                    })();
                } else {
                    dataSet.rows = rows;
                    dataSet.data = grid.dataItem(rows);
                }
            }
            this.props.onChange(dataSet);
        }
    },

    setSelectedIds: function setSelectedIds(props) {
        var checkField = props.checkField;
        var selectedIds = props.selectedIds;


        if (selectedIds !== null && typeof selectedIds !== 'undefined' && selectedIds.length > 0) {
            var rows = this.grid.table.find('tr').find('td:first input').closest('tr'),
                _this = this;

            rows.each(function (index, row) {
                var $checkbox = $(row).find('input:checkbox.checkbox'),
                    dataItem = _this.grid.dataItem(row),
                    checked = false;

                for (var i = 0; i < selectedIds.length; i++) {

                    if (checkField !== null && typeof checkField !== 'undefined') {
                        if (dataItem[checkField] == selectedIds[i]) {
                            checked = true;
                            break;
                        }
                    } else {
                        if ($checkbox.val() == selectedIds[i]) {
                            checked = true;
                            break;
                        }
                    }
                }

                $checkbox.attr('checked', checked);
                _this.selectCheckbox($checkbox, checked, $(row));
            });
        }
    },
    onSelectRow: function onSelectRow(event) {

        if (typeof this.props.onSelectRow === 'function') {
            var ids = [],
                items = [];
            for (var key in this.checkedIds) {
                if (this.checkedIds[key]) {
                    ids.push(key);
                    items.push(this.checkedItems[key]);
                }
            }

            this.props.onSelectRow(event, ids, items);
        }
    },
    onCheckboxHeader: function onCheckboxHeader(event) {
        var checked = $(event.target).is(':checked');

        var rows = this.grid.table.find("tr").find("td:first input").closest("tr"),
            _this = this;

        rows.each(function (index, row) {
            var $checkbox = $(row).find('input:checkbox.checkbox');
            $checkbox.attr('checked', checked);

            _this.selectCheckbox($checkbox, checked, $(row));
        });

        this.onSelectRow(event);
    },
    onCheckboxRow: function onCheckboxRow(event) {
        var checked = event.target.checked,
            $row = $(event.target).closest('tr');

        this.selectCheckbox($(event.target), checked, $row);
        this.onSelectRow(event);
    },
    selectCheckbox: function selectCheckbox($checkbox, checked, $row) {

        var dataItem = this.grid.dataItem($row);

        if (this.props.checkField !== null && typeof this.props.checkField !== 'undefined') {
            this.checkedIds[dataItem[this.props.checkField]] = checked;
            this.checkedItems[dataItem[this.props.checkField]] = dataItem;
        } else {
            this.checkedIds[$checkbox.val()] = checked;
            this.checkedItems[$checkbox.val()] = dataItem;
        }

        if (checked) {
            //-select the row
            $row.addClass("k-state-selected");
        } else {
            //-remove selection
            $row.removeClass("k-state-selected");
        }
    },
    getCheckboxColumn: function getCheckboxColumn(checkboxField) {
        return {
            field: checkboxField,
            headerTemplate: '<input type="checkbox" class="checkbox" />',
            //headerTemplate: '<div class="checkbox"><label><input type="checkbox" /></label></div>',
            headerAttributes: {
                'class': 'table-header-cell',
                style: 'text-align: center'
            },
            template: '<input type="checkbox" class="checkbox" value="#=' + checkboxField + '#" />',
            attributes: {
                align: 'center'
            },
            width: 50,
            sortable: false
        };
    },
    onDataBound: function onDataBound(arg) {
        // selected check
        this.setSelectedIds(this.props);
    },
    getDataSource: function getDataSource(props) {
        var host = props.host;
        var url = props.url;
        var method = props.method;
        var data = props.data;
        var listField = props.listField;
        var totalField = props.totalField;
        var pageable = props.pageable;
        var pageSize = props.pageSize;
        var parameterMapField = props.parameterMapField;

        // pageSize

        var _pageSize = 0,
            _pageable = false;
        if (pageable) {
            _pageSize = pageSize;
            _pageable = true;
        }

        // http://itq.nl/kendo-ui-grid-with-server-paging-filtering-and-sorting-with-mvc3/
        // https://blog.longle.net/2012/04/13/teleriks-html5-kendo-ui-grid-with-server-side-paging-sorting-filtering-with-mvc3-ef4-dynamic-linq/
        var dataSource = new kendo.data.DataSource({
            transport: {
                /*
                read: function(options) {
                    $.ajax({
                        type: method,
                        url: url,
                        //contentType: "application/json; charset=utf-8", 이것 설정하면 data 전송 안됨
                        dataType: 'json',
                        data: data,//JSON.stringify({key: "value"}),
                        success: function(data) {
                            //console.log(data);
                             var arr = [], gridList = data;
                            if(listField && listField.length > 0 && listField != 'null') {
                                arr = listField.split('.');
                            }
                            for(var i in arr) {
                                //console.log(arr[i]);
                                gridList = gridList[arr[i]];
                            }
                            options.success(gridList);
                            //options.success(data.resultValue.list);
                        }
                    });
                }
                */
                read: {
                    url: host && host !== null && host.length > 0 ? host + url : url,
                    type: method,
                    dataType: 'json',
                    data: data, // search (@RequestBody GridParam gridParam 로 받는다.)
                    contentType: 'application/json; charset=utf-8'
                },
                parameterMap: function parameterMap(data, type) {
                    if (type == "read" && parameterMapField !== null) {
                        // 데이터 읽어올때 필요한 데이터(ex:페이지관련)가 있으면 data를 copy한다.
                        for (var copy in parameterMapField) {
                            if (typeof parameterMapField[copy] === "string" && copy in data) {
                                data[parameterMapField[copy]] = data[copy];
                            }
                        }
                        // Filter Array => Json Object Copy
                        if (parameterMapField.filtersToJson && data.filter && data.filter.filters) {
                            var filters = data.filter.filters;
                            filters.map(function (filter) {
                                var field = parameterMapField.filterPrefix ? parameterMapField.filterPrefix + filter.field : filter.field;
                                if (parameterMapField.filterFieldToLowerCase) {
                                    data[field.toLowerCase()] = filter.value;
                                } else {
                                    data[field] = filter.value;
                                }
                            });
                        }
                        // Sort Array => Field, Dir Convert
                        if (parameterMapField.convertSort && data.sort) {
                            data.sort.map(function (sortData) {
                                if ("field" in parameterMapField) {
                                    sortData[parameterMapField.field] = sortData.field;
                                }
                                if ("dir" in parameterMapField) {
                                    sortData[parameterMapField.dir] = sortData.dir;
                                }
                            });
                        }
                    }

                    //console.log(data);
                    // paging 처리시 서버로 보내지는 그리드 관련 데이터 {take: 20, skip: 0, page: 1, pageSize: 20}
                    // no paging 처리시에는 {} 을 서버로 보낸다.
                    // @RequestBody GridParam gridParam 로 받는다.
                    return JSON.stringify(data);
                }
            },
            schema: {
                // returned in the "listField" field of the response
                data: function data(response) {
                    //console.log(response);
                    var arr = [],
                        gridList = response;

                    if (listField && listField.length > 0 && listField != 'null') {
                        arr = listField.split('.');
                    }
                    for (var i in arr) {
                        //console.log(arr[i]);
                        if (!gridList) {
                            gridList = [];
                            break;
                        }
                        gridList = gridList[arr[i]];
                    }
                    return gridList;
                },
                // returned in the "totalField" field of the response
                total: function total(response) {
                    //console.log(response);
                    var arr = [],
                        total = response;
                    if (totalField && totalField.length > 0 && totalField != 'null') {
                        arr = totalField.split('.');
                    }
                    for (var i in arr) {
                        //console.log(arr[i]);
                        if (!total) {
                            total = 0;
                            break;
                        }
                        total = total[arr[i]];
                    }
                    return total;
                }
            },
            pageSize: _pageSize,
            serverPaging: _pageable,
            serverFiltering: _pageable,
            serverSorting: _pageable
        });

        return dataSource;
    },
    getOptions: function getOptions(props) {
        var resizable = props.resizable;
        var filterable = props.filterable;
        var sortable = props.sortable;
        var pageable = props.pageable;
        var height = props.height;
        var checkboxField = props.checkboxField;
        var selectMode = props.selectMode;
        var multiple = props.multiple;
        var scrollable = props.scrollable;


        var dataSource = this.getDataSource(props);

        var columns = props.columns;
        if (typeof checkboxField !== 'undefined') {
            var b = true;
            for (var i in columns) {
                if (checkboxField == columns[i].field) {
                    b = false;
                    break;
                }
            }
            if (b === true) {
                columns.unshift(this.getCheckboxColumn(checkboxField));
            }
        }

        var filter;
        if (typeof filterable === 'boolean' && filterable === true) {
            filter = {
                extra: false,
                operators: {
                    string: {
                        contains: 'contains'
                    },
                    number: {
                        eq: 'eq' /*,
                                 neq: "Diverso da",
                                 gte: "Maggiore o uguale a",
                                 gt: "Maggiore di",
                                 lte: "Minore o uguale a",
                                 lt: "Minore di"*/
                    },
                    date: {
                        eq: 'eq' /*,
                                 neq: "Diverso da",
                                 gte: "Successiva o uguale al",
                                 gt: "Successiva al",
                                 lte: "Precedente o uguale al",
                                 lt: "Precedente al"*/
                    },
                    enums: {
                        contains: 'contains'
                    }
                },
                ui: function ui(element) {
                    var $parent = element.parent();
                    while ($parent.children().length > 1) {
                        $($parent.children()[0]).remove();
                    }$parent.prepend('<input type="text" data-bind="value:filters[0].value" class="k-textbox">');
                    $parent.find('button:submit.k-button.k-primary').html('필터');
                    $parent.find('button:reset.k-button').html('초기화');
                }
            };
        } else {
            filter = filterable;
        }

        var _pageable;
        if (typeof pageable === 'boolean' && pageable === true) {
            _pageable = {
                buttonCount: 5,
                pageSizes: [10, 20, 30, 50, 100],
                messages: {
                    display: $ps_locale.grid.recordtext, //'{0}-{1}/{2}',
                    empty: '',
                    //of: '/{0}',
                    itemsPerPage: $ps_locale.grid.rowsPerPage
                }
            };
        } else {
            _pageable = pageable;
        }

        var options = {
            //dataSource: {
            //    transport: {
            //        read: {
            //            type: method,
            //            url: url,
            //            //data: data,
            //            dataType: 'json'
            //        }
            //    }//,
            //    //schema: {
            //    //    data: 'data'
            //    //},
            //    //pageSize: 20,
            //    //serverPaging: true,
            //    //serverFiltering: true,
            //    //serverSorting: true
            //},
            dataSource: dataSource,
            columns: columns,
            noRecords: {
                template: $ps_locale.grid.emptyrecords
            },
            height: height,
            dataBound: this.onDataBound,
            resizable: resizable,
            filterable: filter,
            sortable: sortable,
            scrollable: scrollable,
            pageable: _pageable,
            selectable: multiple ? "multiple ," + selectMode : selectMode
        };

        if (typeof height === 'number' || typeof height === 'string') {
            $.extend(options, { height: height });
        }

        /*
        if(typeof onChange === 'function'){
          $.extend(options, {change: this.onChangeRow});
        }
        */
        return options;
    },
    getDefaultProps: function getDefaultProps() {
        // 클래스가 생성될 때 한번 호출되고 캐시된다.
        // 부모 컴포넌트에서 prop이 넘어오지 않은 경우 (in 연산자로 확인) 매핑의 값이 this.props에 설정된다.
        return { method: 'POST', listField: 'resultValue.list', totalField: 'resultValue.totalCount', resizable: true, filterable: false, sortable: true, pageable: true, pageSize: 20, selectMode: null, multiple: false, parameterMapField: null, scrollable: true };
    },
    componentWillMount: function componentWillMount() {
        // 최초 렌더링이 일어나기 직전(한번 호출)
        var id = this.props.id;
        if (typeof id === 'undefined') {
            id = Util.getUUID();
        }

        this.id = id;
    },
    componentDidMount: function componentDidMount() {
        // 최초 렌더링이 일어난 다음(한번 호출)
        this.$grid = $('#' + this.id);

        //console.log(this.getOptions(this.props));
        this.grid = this.$grid.kendoGrid(this.getOptions(this.props)).data('kendoGrid');

        /*
        var _this = this;
        $(window).resize(function(){
            //_this.$grid.data("kendoGrid").resize();
            _this.autoResizeGrid();
        });
        */
        // bind click event to the checkbox
        //console.log(grid);
        // Events
        this.grid.bind('change', this.onChange);

        this.grid.table.on('click', '.checkbox', this.onCheckboxRow); // checkbox
        this.grid.thead.on('click', '.checkbox', this.onCheckboxHeader); // header checkbox

        if (typeof this.props.init === 'function') {
            var data = {};
            data.$grid = this.$grid;
            data.grid = this.grid;
            this.props.init(data);
        }
    },
    componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
        // 컴포넌트가 새로운 props를 받을 때 호출(최초 렌더링 시에는 호출되지 않음)
        /* dataSource 에 관련된 값이 바뀌어야 다시 데이터 로딩하는 방식은 일단 보류
        화면에서 refresh 가 안됨
        const {url, method, data, listField} = this.props;
         var b = false;
        for(var key in data) {
            if(nextProps.data[key] != data[key]) {
                b = true;
                break;
            }
        }
         if(nextProps.url != url || b == true) {
            //console.log('setDataSource');
            var grid = $('#'+this.id).data("kendoGrid");
            grid.setDataSource(this.getDataSource(nextProps));
        }
        */
        this.grid.setDataSource(this.getDataSource(nextProps));
        this.checkedIds = [];
        this.grid.thead.find('.checkbox').attr('checked', false);
        // setDataSource 가 일어나면 header checkbox click 이벤트 리스너가 사라져서 다시 설정
        this.grid.thead.on('click', '.checkbox', this.onCheckboxHeader); // header checkbox

        // selected check
        this.setSelectedIds(nextProps);
    },
    render: function render() {
        // 필수 항목
        var className = this.props.className;


        return React.createElement('div', { id: this.id, className: classNames(className) });
    }
});

module.exports = Grid;

},{"../services/Util":66,"classnames":2,"react":34}],52:[function(require,module,exports){
/**
 * MultiSelect component
 *
 * version <tt>$ Version: 1.0 $</tt> date:2016/08/23
 * author <a href="mailto:hrahn@nkia.co.kr">Ahn Hyung-Ro</a>
 *
 * example:
 * <Puf.MultiSelect options={options} />
 *
 * Kendo MultiSelect 라이브러리에 종속적이다.
 */
'use strict';

var React = require('react');
var PropTypes = require('react').PropTypes;
var classNames = require('classnames');

var Util = require('../services/Util');

var MultiSelect = React.createClass({
    displayName: 'MultiSelect',
    propTypes: {
        id: PropTypes.string,
        name: PropTypes.string,
        className: PropTypes.string,
        host: PropTypes.string, // 서버 정보(Cross Browser Access)
        url: PropTypes.string,
        method: PropTypes.string,
        data: PropTypes.object,
        items: PropTypes.array,
        selectedItems: PropTypes.array,
        placeholder: PropTypes.string,
        listField: PropTypes.string,
        dataTextField: PropTypes.string,
        dataValueField: PropTypes.string,
        multiple: PropTypes.bool, // 다중선택을 지원하며, 닫히지 않고 여러개를 선택할 수 있다.
        headerTemplate: PropTypes.string,
        itemTemplate: PropTypes.string,
        tagTemplate: PropTypes.string,
        height: PropTypes.number,
        onSelect: PropTypes.func,
        onDeselect: PropTypes.func,
        onChange: PropTypes.func,
        onOpen: PropTypes.func,
        onClose: PropTypes.func,
        onFiltering: PropTypes.func,
        onDataBound: PropTypes.func,
        minLength: PropTypes.number, // 검색시 필요한 최소 단어 길이
        maxSelectedItems: PropTypes.number, // 최대 선택 수
        parameterMapField: PropTypes.object, // Paging, FilterJson
        serverFiltering: PropTypes.bool, // 서버 Filtering(검색조건에 따른 리스트업)
        serverPaging: PropTypes.bool, // 서버 Paging(멀티셀렉트 리스트 제한)
        pageSize: PropTypes.number, // 서버사이드 Page Size
        filterFields: PropTypes.array // 필터 필드 정의(or로 다중 검색시 제공)
    },
    id: '',
    //-----------------------------
    // api
    value: function value(v) {
        if (arguments.length == 0) {
            return this.multiSelect.value();
        } else {
            return this.multiSelect.value(v);
        }
    },
    //-----------------------------
    // event
    onSelect: function onSelect(e) {
        var dataItem = this.multiSelect.dataSource.view()[e.item.index()];

        if (typeof this.props.onSelect !== 'undefined') {
            this.props.onSelect(e, dataItem);
        }
    },
    onDeselect: function onDeselect(e) {
        if (typeof this.props.onDeselect !== 'undefined') {
            this.props.onDeselect(e, e.dataItem);
        }
    },
    onChange: function onChange(e) {
        if (typeof this.props.onChange !== 'undefined') {
            this.props.onChange(e);
        }
    },
    onOpen: function onOpen(e) {
        if (typeof this.props.onOpen !== 'undefined') {
            this.props.onOpen(e);
        }
    },
    onClose: function onClose(e) {
        if (typeof this.props.onClose !== 'undefined') {
            this.props.onClose(e);
        }
    },
    onFiltering: function onFiltering(e) {
        if (typeof this.props.onFiltering !== 'undefined') {
            this.props.onFiltering(e);
        }
    },
    onDataBound: function onDataBound(e) {

        if (typeof this.props.onDataBound !== 'undefined') {
            this.props.onDataBound(e);
        }
    },
    getOptions: function getOptions() {
        var _props = this.props;
        var host = _props.host;
        var url = _props.url;
        var data = _props.data;
        var method = _props.method;
        var items = _props.items;
        var selectedItems = _props.selectedItems;
        var placeholder = _props.placeholder;
        var listField = _props.listField;
        var dataTextField = _props.dataTextField;
        var dataValueField = _props.dataValueField;
        var headerTemplate = _props.headerTemplate;
        var itemTemplate = _props.itemTemplate;
        var tagTemplate = _props.tagTemplate;
        var height = _props.height;
        var multiple = _props.multiple;
        var minLength = _props.minLength;
        var maxSelectedItems = _props.maxSelectedItems;
        var parameterMapField = _props.parameterMapField;
        var serverFiltering = _props.serverFiltering;
        var serverPaging = _props.serverPaging;
        var pageSize = _props.pageSize;
        var filterFields = _props.filterFields;


        var options = {
            placeholder: placeholder,
            dataTextField: dataTextField,
            dataValueField: dataValueField,
            dataSource: []
        };

        if (multiple) {
            $.extend(options, { autoClose: false });
        }

        if (minLength > 0) {
            $.extend(options, { minLength: minLength });
        }

        if (maxSelectedItems !== null) {
            $.extend(options, { maxSelectedItems: maxSelectedItems });
        }

        // dataSource
        // url
        if (typeof url !== 'undefined') {
            $.extend(options, { dataSource: {
                    transport: {
                        read: {
                            url: host && host !== null && host.length > 0 ? host + url : url,
                            type: method,
                            dataType: 'json',
                            data: data, // search (@RequestBody GridParam gridParam 로 받는다.)
                            contentType: 'application/json; charset=utf-8'
                        },
                        parameterMap: function parameterMap(data, type) {
                            if (type == "read" && parameterMapField !== null) {
                                // 데이터 읽어올때 필요한 데이터(ex:페이지관련)가 있으면 data를 copy한다.
                                for (var copy in parameterMapField) {
                                    if (typeof parameterMapField[copy] === "string" && copy in data) {
                                        data[parameterMapField[copy]] = data[copy];
                                    }
                                }

                                if (parameterMapField.filtersToJson && data.filter && data.filter.filters) {
                                    // Filter Array => Json Object Copy
                                    var filters = data.filter.filters;
                                    filters.map(function (filter) {
                                        var field = parameterMapField.filterPrefix ? parameterMapField.filterPrefix + filter.field : filter.field;
                                        if (parameterMapField.filterFieldToLowerCase) {
                                            data[field.toLowerCase()] = filter.value;
                                        } else {
                                            data[field] = filter.value;
                                        }
                                    });
                                }
                            }
                            return JSON.stringify(data);
                        }
                    },
                    schema: {
                        // returned in the "listField" field of the response
                        data: function data(response) {
                            var listFields = [],
                                dataList = response;
                            if (listField && listField.length > 0 && listField != 'null') {
                                listFields = listField.split('.');
                                listFields.map(function (field) {
                                    dataList = dataList[field];
                                });
                            }
                            return dataList;
                        }
                    },
                    serverFiltering: serverFiltering,
                    serverPaging: serverPaging,
                    pageSize: pageSize
                } });
        } else if (typeof items !== 'undefined') {
            $.extend(options, { dataSource: items });
        }

        // selectedItems
        if (typeof selectedItems !== 'undefined') {
            $.extend(options, { value: selectedItems });
        }

        // headerTemplate
        if (typeof headerTemplate !== 'undefined') {
            $.extend(options, { headerTemplate: headerTemplate });
        }

        // itemTemplate
        if (typeof itemTemplate !== 'undefined') {
            $.extend(options, { itemTemplate: itemTemplate });
        }

        // tagTemplate
        if (typeof tagTemplate !== 'undefined') {
            $.extend(options, { tagTemplate: tagTemplate });
        }

        // height
        if (typeof height !== 'undefined') {
            $.extend(options, { height: height });
        }
        if (filterFields !== null && Array.isArray(filterFields)) {
            $.extend(options, { filtering: function filtering(e) {
                    if (e.filter) {
                        var value;
                        var newFilter;

                        (function () {
                            var fields = filterFields;
                            value = e.filter.value;


                            var newFields = [];
                            fields.map(function (field) {
                                newFields.push({
                                    field: field,
                                    operator: "contains",
                                    value: value
                                });
                            });

                            newFilter = {
                                filters: newFields,
                                logic: "or"
                            };

                            e.sender.dataSource.filter(newFilter);
                            e.preventDefault();
                        })();
                    }
                    e.preventDefault();
                } });
        }
        return options;
    },
    getDefaultProps: function getDefaultProps() {
        // 클래스가 생성될 때 한번 호출되고 캐시된다.
        // 부모 컴포넌트에서 prop이 넘어오지 않은 경우 (in 연산자로 확인) 매핑의 값이 this.props에 설정된다.
        return { method: 'POST', listField: 'resultValue.list', placeholder: $ps_locale.select, dataTextField: 'text', dataValueField: 'value', multiple: false, minLength: 0, maxSelectedItems: null, serverFiltering: false, serverPaging: false, pageSize: 10, filterFields: null };
    },
    componentWillMount: function componentWillMount() {
        // 최초 렌더링이 일어나기 직전(한번 호출)
        var id = this.props.id;
        if (typeof id === 'undefined') {
            id = Util.getUUID();
        }
        this.id = id;
    },
    componentDidMount: function componentDidMount() {
        // 최초 렌더링이 일어난 다음(한번 호출)
        this.$multiSelect = $('#' + this.id);
        this.multiSelect = this.$multiSelect.kendoMultiSelect(this.getOptions()).data('kendoMultiSelect');

        // Events
        this.multiSelect.bind('select', this.onSelect);
        this.multiSelect.bind('deselect', this.onDeselect);
        this.multiSelect.bind('change', this.onChange);
        this.multiSelect.bind('open', this.onOpen);
        this.multiSelect.bind('close', this.onClose);
        this.multiSelect.bind('filtering', this.onFiltering);
        this.multiSelect.bind('dataBound', this.onDataBound);
    },
    render: function render() {
        // 필수 항목
        var _props2 = this.props;
        var className = _props2.className;
        var name = _props2.name;
        var multiple = _props2.multiple;


        return React.createElement('select', { id: this.id, name: name, multiple: multiple, className: classNames(className) });
    }
});

module.exports = MultiSelect;

},{"../services/Util":66,"classnames":2,"react":34}],53:[function(require,module,exports){
/**
 * NumericTextBox component
 *
 * version <tt>$ Version: 1.0 $</tt> date:2016/08/31
 * author <a href="mailto:hrahn@nkia.co.kr">Ahn Hyung-Ro</a>
 *
 * example:
 * <Puf.NumericTextBox options={options} />
 *
 * Kendo NumericTextBox 라이브러리에 종속적이다.
 */
'use strict';

var React = require('react');
var PropTypes = require('react').PropTypes;
var classNames = require('classnames');

var Util = require('../services/Util');

var NumericTextBox = React.createClass({
    displayName: 'NumericTextBox',
    propTypes: {
        id: PropTypes.string,
        className: PropTypes.string,
        name: PropTypes.string,
        width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        format: PropTypes.string,
        value: PropTypes.number,
        step: PropTypes.number,
        min: PropTypes.number,
        max: PropTypes.number,
        decimals: PropTypes.number,
        placeholder: PropTypes.string,
        downArrowText: PropTypes.string,
        upArrowText: PropTypes.string,
        onChange: PropTypes.func
    },
    id: '',
    //-----------------------------
    // api
    value: function value(v) {
        if (arguments.length == 0) {
            return this.numericTextBox.value();
        } else {
            return this.numericTextBox.value(v);
        }
    },
    //-----------------------------
    // event
    onChange: function onChange(e) {
        if (typeof this.props.onChange !== 'undefined') {
            this.props.onChange(e, this.value());
        }
    },
    getOptions: function getOptions() {
        var _props = this.props;
        var format = _props.format;
        var value = _props.value;
        var step = _props.step;
        var min = _props.min;
        var max = _props.max;
        var decimals = _props.decimals;
        var placeholder = _props.placeholder;
        var downArrowText = _props.downArrowText;
        var upArrowText = _props.upArrowText;


        var options = {
            format: format,
            value: value,
            downArrowText: downArrowText,
            upArrowText: upArrowText
        };

        // step
        if (typeof step !== 'undefined') {
            $.extend(options, { step: step });
        }

        // min
        if (typeof min !== 'undefined') {
            $.extend(options, { min: min });
        }

        // max
        if (typeof max !== 'undefined') {
            $.extend(options, { max: max });
        }

        // decimals
        if (typeof decimals !== 'undefined') {
            $.extend(options, { decimals: decimals });
        }

        // placeholder
        if (typeof placeholder !== 'undefined') {
            $.extend(options, { placeholder: placeholder });
        }

        return options;
    },
    getDefaultProps: function getDefaultProps() {
        // 클래스가 생성될 때 한번 호출되고 캐시된다.
        // 부모 컴포넌트에서 prop이 넘어오지 않은 경우 (in 연산자로 확인) 매핑의 값이 this.props에 설정된다.
        return { format: 'n0', value: 1, downArrowText: '', upArrowText: '' };
    },
    componentWillMount: function componentWillMount() {
        // 최초 렌더링이 일어나기 직전(한번 호출)
        var id = this.props.id;
        if (typeof id === 'undefined') {
            id = Util.getUUID();
        }

        this.id = id;
    },
    componentDidMount: function componentDidMount() {
        // 최초 렌더링이 일어난 다음(한번 호출)
        this.$numericTextBox = $('#' + this.id);
        this.numericTextBox = this.$numericTextBox.kendoNumericTextBox(this.getOptions()).data('kendoNumericTextBox');

        // Events
        this.numericTextBox.bind('change', this.onChange);
    },
    render: function render() {
        // 필수 항목
        var _props2 = this.props;
        var className = _props2.className;
        var name = _props2.name;
        var width = _props2.width;


        return React.createElement('input', { id: this.id, name: name, style: { width: width } });
    }
});

module.exports = NumericTextBox;

},{"../services/Util":66,"classnames":2,"react":34}],54:[function(require,module,exports){
/**
 * PanelBar component
 *
 * version <tt>$ Version: 1.0 $</tt> date:2016/08/18
 * author <a href="mailto:hrahn@nkia.co.kr">Ahn Hyung-Ro</a>
 *
 * example:
 * <Puf.PanelBar options={options} />
 *
 * Kendo PanelBar 라이브러리에 종속적이다.
 */
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var React = require('react');
var PropTypes = require('react').PropTypes;
var classNames = require('classnames');

var Util = require('../services/Util');

var PanelBar = React.createClass({
    displayName: 'PanelBar',
    propTypes: {
        id: PropTypes.string,
        className: PropTypes.string,
        contentUrls: PropTypes.array
    },
    id: '',
    expand: function expand($item) {
        this.panelBar.expand($item);
    },
    onSelect: function onSelect(e) {},
    getOptions: function getOptions() {
        return {};
    },
    getDefaultProps: function getDefaultProps() {
        // 클래스가 생성될 때 한번 호출되고 캐시된다.
        // 부모 컴포넌트에서 prop이 넘어오지 않은 경우 (in 연산자로 확인) 매핑의 값이 this.props에 설정된다.
        return { value: 'default value' };
    },
    getInitialState: function getInitialState() {
        // 컴포넌트가 마운트되기 전 (한번 호출) / 리턴값은 this.state의 초기값으로 사용
        return { data: [] };
    },
    componentWillMount: function componentWillMount() {
        // 최초 렌더링이 일어나기 직전(한번 호출)
        var id = this.props.id;
        if (typeof id === 'undefined') {
            id = Util.getUUID();
        }

        this.id = id;
    },
    componentDidMount: function componentDidMount() {
        // 최초 렌더링이 일어난 다음(한번 호출)
        this.$panelBar = $('#' + this.id);
        this.panelBar = this.$panelBar.kendoPanelBar(this.getOptions()).data('kendoPanelBar');

        // Events
        this.panelBar.bind('select', this.onSelect);
    },
    render: function render() {
        // 필수 항목
        var _props = this.props;
        var className = _props.className;
        var children = _props.children;


        return React.createElement(
            'ul',
            { id: this.id, className: classNames(className) },
            children
        );
    }
});

var PanelBarPane = React.createClass({
    displayName: 'PanelBarPane',
    propTypes: {
        id: PropTypes.string,
        title: PropTypes.string,
        items: PropTypes.array
    },
    getContent: function getContent() {
        var _props2 = this.props;
        var items = _props2.items;
        var children = _props2.children;
        var contentUrls = _props2.contentUrls;

        var content;

        if (items) {
            var _items = items.map(function (item) {
                if ((typeof item === 'undefined' ? 'undefined' : _typeof(item)) === 'object') {
                    var icon, text;
                    if (item.hasOwnProperty('spriteCssClass')) {
                        icon = React.createElement('span', { className: classNames(item.spriteCssClass) });
                    }
                    if (item.hasOwnProperty('imageUrl')) {
                        icon = React.createElement('img', { src: item.imageUrl });
                    }

                    if (item.hasOwnProperty('text')) {
                        text = item.text;
                    }

                    var data;
                    if (item.hasOwnProperty('data')) {
                        data = { data: JSON.stringify(item.data) };
                    }
                    //return (<li key={Util.uniqueID()}>{icon} {text}</li>);
                    return React.createElement(
                        'li',
                        data,
                        icon,
                        ' ',
                        text
                    );
                    //return <PanelBarPaneItem data={data}>{icon} {text}</PanelBarPaneItem>;
                } else {
                    //return (<li key={Util.uniqueID()}>{item}</li>);
                    return React.createElement(
                        'li',
                        null,
                        item
                    );
                }
            });
            content = React.createElement(
                'ul',
                null,
                _items
            );
        } else if (children) {
            content = children;
        } else {
            // contentUrls 이라고 판단
            content = React.createElement('div', null);
        }

        return content;
    },
    render: function render() {
        // 필수 항목
        var _props3 = this.props;
        var id = _props3.id;
        var title = _props3.title;


        var _id;
        if (id) {
            _id = { id: id };
        }
        return React.createElement(
            'li',
            _id,
            title,
            this.getContent()
        );
    }
});

var PanelBarPaneItem = React.createClass({
    displayName: 'PanelBarPaneItem',

    render: function render() {
        var data = this.props.data;

        return React.createElement(
            'li',
            data,
            this.props.children
        );
    }
});

module.exports = {
    PanelBar: PanelBar,
    PanelBarPane: PanelBarPane
};

},{"../services/Util":66,"classnames":2,"react":34}],55:[function(require,module,exports){
/**
 * ProgressBar component
 *
 * version <tt>$ Version: 1.0 $</tt> date:2016/09/06
 * author <a href="mailto:hrahn@nkia.co.kr">Ahn Hyung-Ro</a>
 *
 * example:
 * <Puf.ProgressBar options={options} />
 *
 * Kendo ProgressBar 라이브러리에 종속적이다.
 */
'use strict';

var React = require('react');
var PropTypes = require('react').PropTypes;
var classNames = require('classnames');

var Util = require('../services/Util');

var ProgressBar = React.createClass({
    displayName: 'ProgressBar',
    propTypes: {
        id: PropTypes.string,
        className: PropTypes.string,
        type: PropTypes.oneOf(['value', 'percent', 'chunk']),
        value: PropTypes.number,
        animation: PropTypes.oneOfType([PropTypes.number, PropTypes.bool, PropTypes.object]),
        min: PropTypes.number,
        max: PropTypes.number,
        enable: PropTypes.bool,
        orientation: PropTypes.oneOf(['horizontal', 'vertical']),
        onChange: PropTypes.func,
        onComplete: PropTypes.func
    },
    id: '',
    //-----------------------------
    // api
    value: function value(v) {
        if (arguments.length == 0) {
            return this.progressBar.value();
        } else {
            return this.progressBar.value(v);
        }
    },
    enable: function enable(b) {
        if (arguments.length == 0) {
            this.progressBar.enable();
        } else {
            this.progressBar.enable(b);
        }
    },
    //-----------------------------
    // event
    onChange: function onChange(e) {

        if (typeof this.props.onChange !== 'undefined') {
            this.props.onChange(e.value);
        }
    },
    onComplete: function onComplete(e) {

        if (typeof this.props.onComplete !== 'undefined') {
            this.props.onComplete(e.value);
        }
    },
    getOptions: function getOptions() {
        var _props = this.props;
        var type = _props.type;
        var value = _props.value;
        var animation = _props.animation;
        var enable = _props.enable;
        var orientation = _props.orientation;

        // animation

        var _animation;
        if (typeof animation === 'number') {
            _animation = { duration: animation };
        } else if (animation === true) {
            _animation = { duration: 600 };
        } else {
            _animation = animation;
        }

        var options = {
            type: type,
            value: value,
            animation: _animation,
            enable: enable,
            orientation: orientation
        };

        // min
        if (typeof min !== 'undefined') {
            $.extend(options, { min: min });
        }

        // max
        if (typeof max !== 'undefined') {
            $.extend(options, { max: max });
        }

        return options;
    },
    getDefaultProps: function getDefaultProps() {
        // 클래스가 생성될 때 한번 호출되고 캐시된다.
        // 부모 컴포넌트에서 prop이 넘어오지 않은 경우 (in 연산자로 확인) 매핑의 값이 this.props에 설정된다.
        return { type: 'value', value: 0, animation: { duration: 600 }, enable: true, orientation: 'horizontal' };
    },
    componentWillMount: function componentWillMount() {
        // 최초 렌더링이 일어나기 직전(한번 호출)
        var id = this.props.id;
        if (typeof id === 'undefined') {
            id = Util.getUUID();
        }

        this.id = id;
    },
    componentDidMount: function componentDidMount() {
        // 최초 렌더링이 일어난 다음(한번 호출)
        this.$progressBar = $('#' + this.id);
        this.progressBar = this.$progressBar.kendoProgressBar(this.getOptions()).data('kendoProgressBar');

        // Events
        this.progressBar.bind('change', this.onChange);
        this.progressBar.bind('complete', this.onComplete);
    },
    render: function render() {
        // 필수 항목
        var className = this.props.className;


        return React.createElement('div', { id: this.id, className: classNames(className) });
    }
});

module.exports = ProgressBar;

},{"../services/Util":66,"classnames":2,"react":34}],56:[function(require,module,exports){
/**
 * TreeView component
 *
 * version <tt>$ Version: 1.0 $</tt> date:2016/04/15
 * author <a href="mailto:hrahn@nkia.co.kr">Ahn Hyung-Ro</a>
 *
 * example:
 * <Puf.TreeView options={options} />
 *
 * Kendo TreeView 라이브러리에 종속적이다.
 */
'use strict';

var React = require('react');
var PropTypes = require('react').PropTypes;
var classNames = require('classnames');

var Util = require('../services/Util');

var TreeView = React.createClass({
    displayName: 'TreeView',
    propTypes: {
        id: PropTypes.string,
        className: PropTypes.string,
        options: PropTypes.object,
        host: PropTypes.string,
        url: PropTypes.string,
        method: PropTypes.string,
        items: PropTypes.array,
        data: PropTypes.object,
        onDemand: PropTypes.bool,
        dataTextField: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
        childrenField: PropTypes.string,
        checkboxes: PropTypes.bool,
        dragAndDrop: PropTypes.bool,
        template: PropTypes.string,
        onSelect: PropTypes.func,
        onChange: PropTypes.func,
        onClick: PropTypes.func,
        onDblclick: PropTypes.func,
        onCollapse: PropTypes.func,
        onExpand: PropTypes.func
    },
    id: '',
    //-----------------------------
    // api
    dataItem: function dataItem(node) {
        return this.treeView.dataItem(node);
    },
    parent: function parent(node) {
        return this.treeView.parent(node);
    },
    select: function select(node) {
        if (arguments.length === 0) {
            return this.treeView.select();
        } else {
            return this.treeView.select(node);
        }
    },
    append: function append(nodeData, parentNode, success) {
        return this.treeView.append(nodeData, parentNode, success);
    },
    remove: function remove(node) {
        this.treeView.remove(node);
    },
    expand: function expand(node) {
        this.treeView.expand(node);
    },
    expandAll: function expandAll() {
        this.treeView.expand('.k-item');
    },
    collapse: function collapse(node) {
        this.treeView.collapse(node);
    },
    collapseAll: function collapseAll() {
        this.treeView.collapse('.k-item');
    },
    enable: function enable(node) {
        this.treeView.enable(node);
    },
    disable: function disable(node) {
        this.treeView.enable(node, false);
    },
    enableAll: function enableAll() {
        this.treeView.enable('.k-item');
    },
    disableAll: function disableAll() {
        this.treeView.enable('.k-item', false);
    },
    filter: function filter(value) {
        if (value !== "") {
            this.treeView.dataSource.filter({
                field: this.props.dataTextField,
                operator: 'contains',
                value: value
            });
        } else {
            this.treeView.dataSource.filter({});
        }
    },
    sort: function sort(dir) {
        // dir은 'asc' or 'desc'
        this.treeView.dataSource.sort({
            field: this.props.dataTextField,
            dir: dir
        });
    },
    //-----------------------------
    // event
    onSelect: function onSelect(event) {
        // 같은 노드를 select 할 경우 이벤트 발생하도록 하기 위해
        // click 이벤트시 k-state-selected 제거하고
        // select 이벤트시 추가한다.
        //console.log('treeview select');


        //$(event.node).find('span.k-in').addClass('k-state-selected');
        var node, selectedItem;

        if (typeof event.node === 'undefined') {
            //console.log('dispatch click');
            node = event;
            //$(node).find('span.k-in').addClass('k-state-selected');
            $(node).children(':first').find('span.k-in').addClass('k-state-selected');
            this.onSelectCall = false;
        } else {
            //console.log('click');
            node = event.node;
            this.onSelectCall = true;
        }
        selectedItem = this.treeView.dataItem(node);
        //var selectedItem = this.treeView.dataItem(event.node);
        //console.log(selectedItem);

        if (typeof this.props.onSelect === 'function') {
            this.props.onSelect(event, selectedItem);

            //event.stopImmediatePropagation();
        }
    },
    onCheck: function onCheck(event) {
        //console.log("Checkbox changed: ");
        //console.log(event.node);
    },
    onChange: function onChange(event) {
        //console.log("Selection changed");
        //console.log(event);

        if (typeof this.props.onChange === 'function') {
            //var data = event.node;
            this.props.onChange(event);
            //event.stopImmediatePropagation();
        }
    },
    onCollapse: function onCollapse(event) {
        //console.log("Collapsing ");
        //console.log(event.node);
        var selectedItem = this.treeView.dataItem(event.node);
        //console.log(selectedItem);
        if (typeof this.props.onCollapse === 'function') {
            this.props.onCollapse(event, selectedItem);

            //event.stopImmediatePropagation();
        }
    },
    onExpand: function onExpand(event) {
        //console.log("Expanding ");
        //console.log(event.node);
        var selectedItem = this.treeView.dataItem(event.node);
        //console.log(selectedItem);
        if (typeof this.props.onExpand === 'function') {
            this.props.onExpand(event, selectedItem);

            //event.stopImmediatePropagation();
        }
    },
    onDragStart: function onDragStart(event) {
        //console.log("Started dragging ");
        //console.log(event.sourceNode);
        var selectedItem = this.treeView.dataItem(event.sourceNode);
        if (typeof this.props.onDragStart === 'function') {
            var item = selectedItem;
            this.props.onDragStart(event, item);

            //event.stopImmediatePropagation();
        }
    },
    onDrag: function onDrag(event) {
        //console.log("Dragging ");
        //console.log(event.sourceNode);
        var selectedItem = this.treeView.dataItem(event.sourceNode),
            parentNode = this.treeView.parent(event.dropTarget),
            parentItem = this.treeView.dataItem(parentNode);

        //console.log(parentItem);
        if (typeof this.props.onDrag === 'function') {
            this.props.onDrag(event, selectedItem, parentItem);

            //event.stopImmediatePropagation();
        }
    },
    onDrop: function onDrop(event) {
        //console.log("Dropped ");
        //console.log(event.valid);
        //console.log(event.sourceNode);
        //console.log(event.destinationNode);
        var selectedItem = this.treeView.dataItem(event.sourceNode),
            parentNode = this.treeView.parent(event.destinationNode),
            parentItem = this.treeView.dataItem(parentNode);

        //console.log(parentItem);
        if (typeof this.props.onDrop === 'function') {
            this.props.onDrop(event, selectedItem, parentItem);

            //event.stopImmediatePropagation();
        }
    },
    onDragEnd: function onDragEnd(event) {
        //console.log("Finished dragging ");
        //console.log(event.sourceNode);
        var selectedItem = this.treeView.dataItem(event.sourceNode),
            parentNode = this.treeView.parent(event.destinationNode),
            parentItem = this.treeView.dataItem(parentNode);

        if (typeof this.props.onDragEnd === 'function') {
            this.props.onDragEnd(event, selectedItem, parentItem);

            //event.stopImmediatePropagation();
        }
    },
    onNavigate: function onNavigate(event) {
        //console.log("Navigate ");
        //console.log(event.node);
    },
    onDataBound: function onDataBound(event) {
        console.log('onDataBound');
    },
    onClick: function onClick(event) {
        /*
        var node = $(event.target).closest(".k-item"),
            selectedItem = this.treeView.dataItem(node);
        console.log('treeview click');
        //console.log(selectedItem);
        if(typeof this.props.onClick === 'function') {
            this.props.onClick(event, selectedItem);
             //event.stopImmediatePropagation();
        }
        */
        // 같은 노드를 select 할 경우 이벤트 발생하도록 하기 위해
        // click 이벤트시 k-state-selected 제거하고
        // select 이벤트시 추가한다.
        //console.log($(event.target).hasClass('k-state-selected'));
        //console.log('treeview onclick');
        if (this.onSelectCall === false) {
            var node = $(event.target).closest(".k-item");
            $(event.target).removeClass('k-state-selected');
            this.treeView.trigger('select', node);
        }
        this.onSelectCall = false;
    },
    onDblclick: function onDblclick(event) {
        var node = $(event.target).closest(".k-item"),
            selectedItem = this.treeView.dataItem(node);
        //console.log('onDblclick');
        //console.log(selectedItem);

        if (typeof this.props.onDblclick === 'function') {
            this.props.onDblclick(event, selectedItem);

            //event.stopImmediatePropagation();
        }
    },
    getOptions: function getOptions() {
        var _props = this.props;
        var host = _props.host;
        var url = _props.url;
        var method = _props.method;
        var data = _props.data;
        var items = _props.items;
        var onDemand = _props.onDemand;
        var dataTextField = _props.dataTextField;
        var childrenField = _props.childrenField;
        var checkboxes = _props.checkboxes;
        var dragAndDrop = _props.dragAndDrop;
        var template = _props.template;


        var options = {
            checkboxes: checkboxes, // true or false
            dataTextField: dataTextField,
            dataSource: [],
            dragAndDrop: dragAndDrop // true or false
        };

        //JSON.parse(JSON.stringify(data.treeVO).split('"children":').join('"items":')).items

        // dataSource
        // url
        if (typeof url !== 'undefined' && childrenField != "children") {

            $.extend(options, { dataSource: new kendo.data.HierarchicalDataSource({
                    transport: {
                        read: {
                            url: host && host !== null && host.length > 0 ? host + url : url,
                            type: method,
                            dataType: 'json',
                            data: data,
                            contentType: 'application/json; charset=utf-8'
                        },
                        parameterMap: function parameterMap(data, type) {
                            return JSON.stringify(data);
                        }
                    },
                    schema: {
                        model: {
                            children: childrenField
                        }
                    }
                }) });
        } else if (typeof url !== 'undefined' && childrenField == "children") {
            $.extend(options, { dataSource: new kendo.data.HierarchicalDataSource({
                    transport: {
                        read: {
                            url: host && host !== null && host.length > 0 ? host + url : url,
                            type: method,
                            dataType: 'json',
                            data: data,
                            contentType: 'application/json; charset=utf-8'
                        },
                        parameterMap: function parameterMap(data, type) {
                            return JSON.stringify(data);
                        }
                    },
                    schema: {
                        model: {
                            children: "items"
                        },
                        data: function data(response) {
                            response.treeVO = JSON.parse(JSON.stringify(response.treeVO).split('"children":').join('"items":')).items;
                            return response.treeVO;
                        }
                    }
                }) });
        } else if (typeof items !== 'undefined') {
            $.extend(options, { dataSource: new kendo.data.HierarchicalDataSource({
                    data: items,
                    schema: {
                        model: {
                            children: childrenField
                        }
                    }
                }) });
        }

        // template
        if (typeof template !== 'undefined') {
            $.extend(options, { template: template });
        }

        return options;
    },
    getDefaultProps: function getDefaultProps() {
        // 클래스가 생성될 때 한번 호출되고 캐시된다.
        // 부모 컴포넌트에서 prop이 넘어오지 않은 경우 (in 연산자로 확인) 매핑의 값이 this.props에 설정된다.
        return { onDemand: false, method: 'POST', dataTextField: 'text', childrenField: 'items', dragAndDrop: false };
    },
    componentWillMount: function componentWillMount() {
        // 최초 렌더링이 일어나기 직전(한번 호출)
        var id = this.props.id;
        if (typeof id === 'undefined') {
            id = Util.getUUID();
        }

        this.id = id;
    },
    componentDidMount: function componentDidMount() {
        // 최초 렌더링이 일어난 다음(한번 호출)
        this.$treeView = $('#' + this.id);
        this.treeView = this.$treeView.kendoTreeView(this.getOptions()).data('kendoTreeView');

        // Events
        this.treeView.bind('select', this.onSelect);
        this.treeView.bind('check', this.onCheck);
        this.treeView.bind('change', this.onChange);
        this.treeView.bind('collapse', this.onCollapse);
        this.treeView.bind('expand', this.onExpand);

        /* drag & drop events */
        this.treeView.bind('dragstart', this.onDragStart);
        this.treeView.bind('drag', this.onDrag);
        this.treeView.bind('drop', this.onDrop);
        this.treeView.bind('dragend', this.onDragEnd);
        this.treeView.bind('navigate', this.onNavigate);

        //this.$treeView.find('.k-in').on('click', this.onClick);       // click이 select 보다 먼저 발생
        this.$treeView.on('click', '.k-in', this.onClick); // click이 select 보다 나중에 발생
        this.$treeView.find('.k-in').on('dblclick', this.onDblclick);
    },
    render: function render() {
        // 필수 항목
        var className = this.props.className;


        return React.createElement('div', { id: this.id, className: classNames(className) });
    }
});

module.exports = TreeView;

},{"../services/Util":66,"classnames":2,"react":34}],57:[function(require,module,exports){
/**
 * Window component
 *
 * version <tt>$ Version: 1.0 $</tt> date:2016/09/06
 * author <a href="mailto:hrahn@nkia.co.kr">Ahn Hyung-Ro</a>
 *
 * example:
 * <Puf.Window options={options} />
 *
 * Kendo Window 라이브러리에 종속적이다.
 */
'use strict';

var React = require('react');
var PropTypes = require('react').PropTypes;
var classNames = require('classnames');

var Util = require('../services/Util');

var Window = React.createClass({
    displayName: 'Window',
    propTypes: {
        id: PropTypes.string,
        className: PropTypes.string,
        title: PropTypes.string,
        visible: PropTypes.bool,
        actions: PropTypes.array, // ['Pin', 'Refresh', 'Minimize', 'Maximize', 'Close']
        modal: PropTypes.bool,
        resizable: PropTypes.bool,
        width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        minWidth: PropTypes.number,
        minHeight: PropTypes.number,
        onOpen: PropTypes.func,
        onClose: PropTypes.func,
        onResize: PropTypes.func,
        onDragStart: PropTypes.func,
        onDragEnd: PropTypes.func,
        onRefresh: PropTypes.func,
        onActivate: PropTypes.func,
        onDeactivate: PropTypes.func
    },
    id: '',
    //-----------------------------
    // api
    open: function open() {
        return this.window.open();
    },
    close: function close() {
        return this.window.close();
    },
    center: function center() {
        return this.window.center();
    },
    pos: function pos(x, y) {
        this.$window.offset({ left: x, top: y });
    },
    //-----------------------------
    // event
    onOpen: function onOpen(e) {

        if (typeof this.props.onOpen !== 'undefined') {
            this.props.onOpen(e);
        }
    },
    onClose: function onClose(e) {

        if (typeof this.props.onClose !== 'undefined') {
            this.props.onClose(e);
        }
    },
    onResize: function onResize(e) {

        if (typeof this.props.onResize !== 'undefined') {
            this.props.onResize(e);
        }
    },
    onDragStart: function onDragStart(e) {

        if (typeof this.props.onDragStart !== 'undefined') {
            this.props.onDragStart(e);
        }
    },
    onDragEnd: function onDragEnd(e) {

        if (typeof this.props.onDragEnd !== 'undefined') {
            this.props.onDragEnd(e);
        }
    },
    onRefresh: function onRefresh(e) {

        if (typeof this.props.onRefresh !== 'undefined') {
            this.props.onRefresh(e);
        }
    },
    onActivate: function onActivate(e) {

        if (typeof this.props.onActivate !== 'undefined') {
            this.props.onActivate(e);
        }
    },
    onDeactivate: function onDeactivate(e) {

        if (typeof this.props.onDeactivate !== 'undefined') {
            this.props.onDeactivate(e);
        }
    },
    getOptions: function getOptions() {
        var _props = this.props;
        var title = _props.title;
        var visible = _props.visible;
        var actions = _props.actions;
        var modal = _props.modal;
        var resizable = _props.resizable;
        var width = _props.width;
        var height = _props.height;
        var minWidth = _props.minWidth;
        var minHeight = _props.minHeight;


        var options = {
            title: title,
            visible: visible,
            actions: actions,
            modal: modal,
            resizable: resizable,
            minWidth: minWidth,
            minHeight: minHeight
        };

        // width
        if (typeof width !== 'undefined') {
            $.extend(options, { width: width });
        }

        // height
        if (typeof height !== 'undefined') {
            $.extend(options, { height: height });
        }

        return options;
    },
    getDefaultProps: function getDefaultProps() {
        // 클래스가 생성될 때 한번 호출되고 캐시된다.
        // 부모 컴포넌트에서 prop이 넘어오지 않은 경우 (in 연산자로 확인) 매핑의 값이 this.props에 설정된다.
        return { title: 'Title', visible: true, actions: ['Pin', 'Minimize', 'Maximize', 'Close'], modal: false, resizable: true, minWidth: 150, minHeight: 100 };
    },
    componentWillMount: function componentWillMount() {
        // 최초 렌더링이 일어나기 직전(한번 호출)
        var id = this.props.id;
        if (typeof id === 'undefined') {
            id = Util.getUUID();
        }

        this.id = id;
    },
    componentDidMount: function componentDidMount() {
        // 최초 렌더링이 일어난 다음(한번 호출)
        this.$window = $('#' + this.id);
        this.window = this.$window.kendoWindow(this.getOptions()).data('kendoWindow');

        // Events
        this.window.bind('open', this.onOpen);
        this.window.bind('close', this.onClose);
        this.window.bind('resize', this.onResize);
        this.window.bind('dragstart', this.onDragStart);
        this.window.bind('dragend', this.onDragEnd);
        this.window.bind('refresh', this.onRefresh);
        this.window.bind('activate', this.onActivate);
        this.window.bind('deactivate', this.onDeactivate);

        // render의 div는 k-window-content 에 해당되는 dom이다.
        // 부모인 k-window 에 addClass 해준다.
        if (typeof this.props.className !== 'undefined') {
            this.$window.parent().addClass(this.props.className);
        }
    },
    render: function render() {
        // 필수 항목
        var _props2 = this.props;
        var className = _props2.className;
        var children = _props2.children;


        return React.createElement(
            'div',
            { id: this.id },
            children
        );
    }
});

module.exports = Window;

},{"../services/Util":66,"classnames":2,"react":34}],58:[function(require,module,exports){
/**
 * Tab component
 *
 * version <tt>$ Version: 1.0 $</tt> date:2016/08/06
 * author <a href="mailto:hrahn@nkia.co.kr">Ahn Hyung-Ro</a>
 *
 * example:
 * <Puf.Tab />
 *
 * Kendo TabStrip 라이브러리에 종속적이다.
 */
'use strict';

var React = require('react');

var Tab = React.createClass({
    displayName: 'Tab',
    render: function render() {
        // 필수 항목
        return React.createElement(
            'li',
            null,
            this.props.children
        );
    }
});

module.exports = Tab;

},{"react":34}],59:[function(require,module,exports){
/**
 * TabContent component
 *
 * version <tt>$ Version: 1.0 $</tt> date:2016/08/06
 * author <a href="mailto:hrahn@nkia.co.kr">Ahn Hyung-Ro</a>
 *
 * example:
 * <Puf.TabContent />
 *
 * Kendo TabStrip ���̺귯���� �������̴�.
 */
'use strict';

var React = require('react');

var TabContent = React.createClass({
    displayName: 'TabContent',
    render: function render() {
        // �ʼ� �׸�
        return React.createElement(
            'div',
            null,
            this.props.children
        );
    }
});

module.exports = TabContent;

},{"react":34}],60:[function(require,module,exports){
/**
 * TabStrip component
 *
 * version <tt>$ Version: 1.0 $</tt> date:2016/08/06
 * author <a href="mailto:hrahn@nkia.co.kr">Ahn Hyung-Ro</a>
 *
 * example:
 * <Puf.TabStrip className={className} selectedIndex={0} onSelect={func} />
 *
 * Kendo TabStrip 라이브러리에 종속적이다.
 */
'use strict';

var React = require('react');
var PropTypes = require('react').PropTypes;

var Util = require('../../services/Util');

var TabStrip = React.createClass({
    displayName: 'TabStrip',
    propTypes: {
        className: PropTypes.string,
        selectedIndex: PropTypes.number,
        contentUrls: PropTypes.array,
        animation: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
        tabPosition: PropTypes.oneOf(['left', 'right', 'bottom']),
        onSelect: PropTypes.func,
        onActivate: PropTypes.func,
        onShow: PropTypes.func,
        onContentLoad: PropTypes.func,
        onError: PropTypes.func
    },
    id: '',
    select: function select(index) {
        this.tabstrip.select(index);
    },
    onSelect: function onSelect(e) {
        //console.log('onSelect');
        //console.log(e);
        if (typeof this.props.onSelect === 'function') {
            this.props.onSelect(e); // e.item, index 알아내서 넘기자
        }
    },
    onActivate: function onActivate(e) {
        //console.log('onActivate');
        //console.log(e);
        if (typeof this.props.onActivate === 'function') {
            this.props.onActivate(e);
        }
    },
    onShow: function onShow(e) {
        //console.log('onShow');
        //console.log(e);
        if (typeof this.props.onShow === 'function') {
            this.props.onShow(e);
        }
    },
    onContentLoad: function onContentLoad(e) {
        //console.log('onContentLoad');
        //console.log(e);
        if (typeof this.props.onContentLoad === 'function') {
            this.props.onContentLoad(e);
        }
    },
    onError: function onError(e) {
        //console.log('onError');
        //console.log(e);
        if (typeof this.props.onError === 'function') {
            this.props.onError(e);
        }
    },
    getChildren: function getChildren() {
        var children = this.props.children,
            count = 0;

        return React.Children.map(children, function (child) {
            if (child === null) {
                return null;
            }
            var result;

            // Tabs
            if (count++ === 0) {
                result = React.cloneElement(child, {
                    children: React.Children.map(child.props.children, function (tab) {
                        if (tab === null) {
                            return null;
                        }

                        return React.cloneElement(tab);
                    })
                });
            } else {
                // TabContent
                result = React.cloneElement(child);
            }
            return result;
        });
    },
    getOptions: function getOptions() {
        var _props = this.props;
        var animation = _props.animation;
        var contentUrls = _props.contentUrls;
        var tabPosition = _props.tabPosition;

        // animation (false|object) true는 유효하지 않음

        var _animation;
        if (typeof animation === 'boolean' && animation === true) {
            _animation = {
                open: {
                    effects: 'fadeIn'
                }
            };
        } else {
            _animation = animation;
        }

        var options = {
            animation: _animation
        };

        // tabPosition
        if (tabPosition) {
            $.extend(options, { tabPosition: tabPosition });
        }

        // contentUrls
        if (contentUrls) {
            $.extend(options, { contentUrls: contentUrls });
        }

        return options;
    },
    getDefaultProps: function getDefaultProps() {
        // 클래스가 생성될 때 한번 호출되고 캐시된다.
        // 부모 컴포넌트에서 prop이 넘어오지 않은 경우 (in 연산자로 확인) 매핑의 값이 this.props에 설정된다.
        return { selectedIndex: 0, animation: false };
    },
    getInitialState: function getInitialState() {

        return {};
    },
    componentWillMount: function componentWillMount() {
        // 최초 렌더링이 일어나기 직전(한번 호출)
        var id = this.props.id;
        if (typeof id === 'undefined') {
            id = Util.getUUID();
        }

        this.id = id;
    },
    componentDidMount: function componentDidMount() {
        // 최초 렌더링이 일어난 다음(한번 호출)
        this.$tabstrip = $('#' + this.id);
        this.tabstrip = this.$tabstrip.kendoTabStrip(this.getOptions()).data('kendoTabStrip');

        // Events
        this.tabstrip.bind('select', this.onSelect);
        this.tabstrip.bind('activate', this.onActivate);
        this.tabstrip.bind('show', this.onShow);
        this.tabstrip.bind('contentLoad', this.onContentLoad);
        this.tabstrip.bind('error', this.onError);

        this.select(this.props.selectedIndex);
    },
    render: function render() {
        // 필수 항목
        return React.createElement(
            'div',
            { id: this.id, className: this.props.className },
            this.getChildren()
        );
    }
});

module.exports = TabStrip;

},{"../../services/Util":66,"react":34}],61:[function(require,module,exports){
/**
 * Tabs component
 *
 * version <tt>$ Version: 1.0 $</tt> date:2016/08/06
 * author <a href="mailto:hrahn@nkia.co.kr">Ahn Hyung-Ro</a>
 *
 * example:
 * <Puf.Tabs />
 *
 * Kendo TabStrip ���̺귯���� �������̴�.
 */
'use strict';

var React = require('react');

var Tabs = React.createClass({
    displayName: 'Tabs',
    render: function render() {
        // �ʼ� �׸�
        return React.createElement(
            'ul',
            null,
            this.props.children
        );
    }
});

module.exports = Tabs;

},{"react":34}],62:[function(require,module,exports){
/**
 * ps-util services
 * 
 * version <tt>$ Version: 1.0 $</tt> date:2016/03/01
 * author <a href="mailto:hrahn@nkia.co.kr">Ahn Hyung-Ro</a>
 * 
 * example:
 * app.controller('Ctrl', ['$scope', 'psUtil', function($scope, psUtil) {
 * 	   var rootPath = psUtil.getRootPath();
 * }]);
 * 
 */
'use strict';

function getDateToString(date) {
	var year = date.getFullYear(),
	    month = zerofill(date.getMonth() + 1, 2),
	    day = zerofill(date.getDate(), 2),
	    hours = date.getHours() < 0 ? '00' : zerofill(date.getHours(), 2),
	    // daterangepicker hours 9시간 오버표시되는 버그로 인해 빼준다.
	minutes = zerofill(date.getMinutes(), 2),
	    seconds = zerofill(date.getSeconds(), 2),
	    dateString = year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds;

	return dateString;
}

function zerofill(n, digits) {
	var zero = '';
	n = n.toString();

	if (n.length < digits) {
		for (var i = 0; i < digits - n.length; i++) {
			zero += '0';
		}
	}

	return zero + n;
}

module.exports = {
	getDateToString: getDateToString
};

},{}],63:[function(require,module,exports){
/**
 * NumberUtil services
 * 
 * version <tt>$ Version: 1.0 $</tt> date:2016/05/19
 * author <a href="mailto:hrahn@nkia.co.kr">Ahn Hyung-Ro</a>
 * 
 * example:
 * var NumberUtil = require('../services/NumberUtil');
 * NumberUtil.digit();
 *
 * Puf.NumberUtil.digit();
 */
'use strict';

function digit(i) {
  var displayText;
  if (i < 10) {
    displayText = '0' + i;
  } else {
    displayText = i.toString();
  }
  return displayText;
}

module.exports = {
  digit: digit
};

},{}],64:[function(require,module,exports){
/**
 * RegExp services
 * 
 * version <tt>$ Version: 1.0 $</tt> date:2016/05/20
 * author <a href="mailto:hrahn@nkia.co.kr">Ahn Hyung-Ro</a>
 * 
 * example:
 * var RegExp = require('../services/RegExp');
 * RegExp.checkEmail(strValue);
 *
 * Puf.RegExp.checkEmail(strValue);
 */
'use strict';

var regExp_EMAIL = /[0-9a-zA-Z][_0-9a-zA-Z-]*@[_0-9a-zA-Z-]+(\.[_0-9a-zA-Z-]+){1,2}$/;

function checkEmail(strValue) {
  if (!strValue.match(regExp_EMAIL)) {
    return false;
  }
  return true;
}

module.exports = {
  checkEmail: checkEmail
};

},{}],65:[function(require,module,exports){
/**
 * Resource services
 * 
 * version <tt>$ Version: 1.0 $</tt> date:2016/06/03
 * author <a href="mailto:hrahn@nkia.co.kr">Ahn Hyung-Ro</a>
 * 
 * example:
 * Puf.Resource.loadResource();
 * Puf.Resource.i18n(key);
 *
 * 다국어 처리
 */
'use strict';

// load properties

var loadResource = function loadResource(name, path, mode, language, callback) {

	$.i18n.properties({
		name: name,
		path: path,
		mode: mode,
		language: language,
		callback: callback
		/*
  function() {
  	// Accessing a simple value through the map
  	jQuery.i18n.prop('msg_hello');
  	// Accessing a value with placeholders through the map
  	jQuery.i18n.prop('msg_complex', 'John');
  			// Accessing a simple value through a JS variable
  	alert(msg_hello +' '+ msg_world);
  	// Accessing a value with placeholders through a JS function
  	alert(msg_complex('John'));
  	alert(msg_hello);
     }
     */
	});
};

var i18n = function i18n(key) {
	//var args = '\'' + key + '\'';
	//for (var i=1; i<arguments.length; i++) {
	//   args += ', \'' + arguments[i] + '\'';
	//}
	//return eval('$.i18n.prop(' + args + ')');
	return $.i18n.prop.apply(this, arguments);
};

var i18nByKey = function i18nByKey(key) {
	//var args = '\'' + key + '\'';
	//for (var i=1; i<arguments.length; i++) {
	//	args += ', \'' + $.i18n.prop(arguments[i]) + '\'';
	//}
	//return eval('$.i18n.prop(' + args + ')');
	var args = [key];
	for (var i = 1; i < arguments.length; i++) {
		args.push($.i18n.prop(arguments[i]));
	}
	return $.i18n.prop.apply(this, args);
};

module.exports = {
	loadResource: loadResource,
	i18n: i18n,
	i18nByKey: i18nByKey
};

},{}],66:[function(require,module,exports){
/**
 * Util services
 * 
 * version <tt>$ Version: 1.0 $</tt> date:2016/03/01
 * author <a href="mailto:hrahn@nkia.co.kr">Ahn Hyung-Ro</a>
 * 
 * example:
 * var Util = require('../services/Util');
 * Util.getUUID();
 *
 */
'use strict';

function getUUID() {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
		var r = Math.random() * 16 | 0,
		    v = c == 'x' ? r : r & 0x3 | 0x8;
		return v.toString(16);
	});
}

function uniqueID() {
	return 'id-' + Math.random().toString(36).substr(2, 9);
}

function sleep(milliseconds) {
	var start = new Date().getTime();
	for (var i = 0; i < 1e7; i++) {
		if (new Date().getTime() - start > milliseconds) {
			break;
		}
	}
}

// 시작페이지로 설정
function setStartPage(obj, url) {
	obj.style.behavior = 'url(#default#homepage)';
	//obj.setHomePage('http://internet.scourt.go.kr/');
	obj.setHomePage(url);
}

// 쿠키 설정
/*
function setCookie(name, value, expires) {
	// alert(name + ", " + value + ", " + expires);
	document.cookie = name + "=" + escape(value) + "; path=/; expires=" + expires.toGMTString();
}
*/
function setCookie(cname, cvalue, exdays, cdomain) {
	var d = new Date();
	d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
	var expires = 'expires=' + d.toUTCString();
	var domain;
	if (cdomain) {
		domain = '; domain=' + cdomain;
	}
	document.cookie = cname + '=' + escape(cvalue) + '; path=/; ' + expires + domain;
}

// 쿠키 가져오기
/*
function getCookie(Name) {
	var search = Name + "="
	if (document.cookie.length > 0) { // 쿠키가 설정되어 있다면
		offset = document.cookie.indexOf(search)
		if (offset != -1) { // 쿠키가 존재하면
			offset += search.length
			// set index of beginning of value
			end = document.cookie.indexOf(";", offset)
			// 쿠키 값의 마지막 위치 인덱스 번호 설정
			if (end == -1)
				end = document.cookie.length
			return unescape(document.cookie.substring(offset, end))
		}
	}
	return "";
}
*/
function getCookie(cname) {
	var name = cname + '=';
	var ca = document.cookie.split(';');
	for (var i = 0; i < ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ') {
			c = c.substring(1);
		}
		if (c.indexOf(name) == 0) {
			return unescape(c.substring(name.length, c.length));
		}
	}
	return '';
}

module.exports = {
	getUUID: getUUID,
	uniqueID: uniqueID,
	sleep: sleep,
	setCookie: setCookie,
	getCookie: getCookie
};

//angular.module('ps.services.util', [])
//.factory('psUtil', ['$window', '$location', function($window, $location) {
//	var factory = {};
//	factory.show = function(msg) {
//        $window.alert(msg);
//    };
//
//    factory.reverse = function(name) {
//		return name.split("").reverse().join("");
//	};
//
//	// root path
//	factory.getRootPath = function() {
//		// js에서 ContextPath 를 얻을 수 없음 - Root Path를 얻어서 응용하자.
//		/*var offset=location.href.indexOf(location.host)+location.host.length;
//	    var ctxPath=location.href.substring(offset,location.href.indexOf('/',offset+1));
//	    return ctxPath;*/
//
//	    var offset = $window.location.href.indexOf($window.location.host) + $window.location.host.length;
//	    var ctxPath = $window.location.href.substring(offset, $window.location.href.indexOf('/', offset + 1));
//	    return ctxPath;
//	};
//
//	// uuid
//	factory.getUUID = function() {
//		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
//			var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
//			return v.toString(16);
//		});
//	};
//
//	// tooltip
//	factory.tooltip = function(selector) {
//
//		if(typeof selector === 'undefined') {
//			selector = '[data-toggle="tooltip"]';
//		}
////		$(selector).bsTooltip();
//		$(selector).tooltip();
//	};
//
//    return factory;
//}]);

},{}]},{},[35])(35)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvcHJvY2Vzcy9icm93c2VyLmpzIiwibm9kZV9tb2R1bGVzL2NsYXNzbmFtZXMvaW5kZXguanMiLCJub2RlX21vZHVsZXMvb2JqZWN0LWFzc2lnbi9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9yZWFjdC9saWIvS2V5RXNjYXBlVXRpbHMuanMiLCJub2RlX21vZHVsZXMvcmVhY3QvbGliL1Bvb2xlZENsYXNzLmpzIiwibm9kZV9tb2R1bGVzL3JlYWN0L2xpYi9SZWFjdC5qcyIsIm5vZGVfbW9kdWxlcy9yZWFjdC9saWIvUmVhY3RDaGlsZHJlbi5qcyIsIm5vZGVfbW9kdWxlcy9yZWFjdC9saWIvUmVhY3RDbGFzcy5qcyIsIm5vZGVfbW9kdWxlcy9yZWFjdC9saWIvUmVhY3RDb21wb25lbnQuanMiLCJub2RlX21vZHVsZXMvcmVhY3QvbGliL1JlYWN0Q29tcG9uZW50VHJlZUhvb2suanMiLCJub2RlX21vZHVsZXMvcmVhY3QvbGliL1JlYWN0Q3VycmVudE93bmVyLmpzIiwibm9kZV9tb2R1bGVzL3JlYWN0L2xpYi9SZWFjdERPTUZhY3Rvcmllcy5qcyIsIm5vZGVfbW9kdWxlcy9yZWFjdC9saWIvUmVhY3RFbGVtZW50LmpzIiwibm9kZV9tb2R1bGVzL3JlYWN0L2xpYi9SZWFjdEVsZW1lbnRWYWxpZGF0b3IuanMiLCJub2RlX21vZHVsZXMvcmVhY3QvbGliL1JlYWN0Tm9vcFVwZGF0ZVF1ZXVlLmpzIiwibm9kZV9tb2R1bGVzL3JlYWN0L2xpYi9SZWFjdFByb3BUeXBlTG9jYXRpb25OYW1lcy5qcyIsIm5vZGVfbW9kdWxlcy9yZWFjdC9saWIvUmVhY3RQcm9wVHlwZUxvY2F0aW9ucy5qcyIsIm5vZGVfbW9kdWxlcy9yZWFjdC9saWIvUmVhY3RQcm9wVHlwZXMuanMiLCJub2RlX21vZHVsZXMvcmVhY3QvbGliL1JlYWN0UHJvcFR5cGVzU2VjcmV0LmpzIiwibm9kZV9tb2R1bGVzL3JlYWN0L2xpYi9SZWFjdFB1cmVDb21wb25lbnQuanMiLCJub2RlX21vZHVsZXMvcmVhY3QvbGliL1JlYWN0VmVyc2lvbi5qcyIsIm5vZGVfbW9kdWxlcy9yZWFjdC9saWIvY2FuRGVmaW5lUHJvcGVydHkuanMiLCJub2RlX21vZHVsZXMvcmVhY3QvbGliL2NoZWNrUmVhY3RUeXBlU3BlYy5qcyIsIm5vZGVfbW9kdWxlcy9yZWFjdC9saWIvZ2V0SXRlcmF0b3JGbi5qcyIsIm5vZGVfbW9kdWxlcy9yZWFjdC9saWIvb25seUNoaWxkLmpzIiwibm9kZV9tb2R1bGVzL3JlYWN0L2xpYi9yZWFjdFByb2RJbnZhcmlhbnQuanMiLCJub2RlX21vZHVsZXMvcmVhY3QvbGliL3RyYXZlcnNlQWxsQ2hpbGRyZW4uanMiLCJub2RlX21vZHVsZXMvcmVhY3Qvbm9kZV9tb2R1bGVzL2ZianMvbGliL2VtcHR5RnVuY3Rpb24uanMiLCJub2RlX21vZHVsZXMvcmVhY3Qvbm9kZV9tb2R1bGVzL2ZianMvbGliL2VtcHR5T2JqZWN0LmpzIiwibm9kZV9tb2R1bGVzL3JlYWN0L25vZGVfbW9kdWxlcy9mYmpzL2xpYi9pbnZhcmlhbnQuanMiLCJub2RlX21vZHVsZXMvcmVhY3Qvbm9kZV9tb2R1bGVzL2ZianMvbGliL2tleU1pcnJvci5qcyIsIm5vZGVfbW9kdWxlcy9yZWFjdC9ub2RlX21vZHVsZXMvZmJqcy9saWIva2V5T2YuanMiLCJub2RlX21vZHVsZXMvcmVhY3Qvbm9kZV9tb2R1bGVzL2ZianMvbGliL3dhcm5pbmcuanMiLCJub2RlX21vZHVsZXMvcmVhY3QvcmVhY3QuanMiLCJyZWFjdC1wdWYuanMiLCJzcmNcXFB1Zi5qcyIsInNyY1xcY29tcG9uZW50c1xcQWxlcnQuanMiLCJzcmNcXGNvbXBvbmVudHNcXENoZWNrYm94LmpzIiwic3JjXFxjb21wb25lbnRzXFxGaWVsZHNldC5qcyIsInNyY1xcY29tcG9uZW50c1xcRmluZVVwbG9hZGVyLmpzIiwic3JjXFxjb21wb25lbnRzXFxIaWRkZW5Db250ZW50LmpzIiwic3JjXFxjb21wb25lbnRzXFxNYWluRnJhbWVTcGxpdHRlci5qcyIsInNyY1xcY29tcG9uZW50c1xcTW9kYWwuanMiLCJzcmNcXGNvbXBvbmVudHNcXFBhbmVsLmpzIiwic3JjXFxjb21wb25lbnRzXFxyYWRpb1xcUmFkaW8uanMiLCJzcmNcXGNvbXBvbmVudHNcXHJhZGlvXFxSYWRpb0dyb3VwLmpzIiwic3JjXFxrZW5kb1xcQXV0b0NvbXBsZXRlLmpzIiwic3JjXFxrZW5kb1xcRGF0ZVBpY2tlci5qcyIsInNyY1xca2VuZG9cXERhdGVSYW5nZVBpY2tlci5qcyIsInNyY1xca2VuZG9cXERyb3BEb3duTGlzdC5qcyIsInNyY1xca2VuZG9cXEdyaWQuanMiLCJzcmNcXGtlbmRvXFxNdWx0aVNlbGVjdC5qcyIsInNyY1xca2VuZG9cXE51bWVyaWNUZXh0Qm94LmpzIiwic3JjXFxrZW5kb1xcUGFuZWxCYXIuanMiLCJzcmNcXGtlbmRvXFxQcm9ncmVzc0Jhci5qcyIsInNyY1xca2VuZG9cXFRyZWVWaWV3LmpzIiwic3JjXFxrZW5kb1xcV2luZG93LmpzIiwic3JjXFxrZW5kb1xcdGFic3RyaXBcXFRhYi5qcyIsInNyY1xca2VuZG9cXHRhYnN0cmlwXFxUYWJDb250ZW50LmpzIiwic3JjXFxrZW5kb1xcdGFic3RyaXBcXFRhYlN0cmlwLmpzIiwic3JjXFxrZW5kb1xcdGFic3RyaXBcXFRhYnMuanMiLCJzcmNcXHNlcnZpY2VzXFxEYXRlVXRpbC5qcyIsInNyY1xcc2VydmljZXNcXE51bWJlclV0aWwuanMiLCJzcmNcXHNlcnZpY2VzXFxSZWdFeHAuanMiLCJzcmNcXHNlcnZpY2VzXFxSZXNvdXJjZS5qcyIsInNyY1xcc2VydmljZXNcXFV0aWwuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQzFEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7QUN4SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ3hGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUM5TEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OztBQzN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O0FDckhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ3JWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O0FDektBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OztBQzNXQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O0FDbk9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7QUMvRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQzlhQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDdEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ3hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDckNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDdENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUN0S0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDckNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7QUNoREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQzlDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDakNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FB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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLy8gc2hpbSBmb3IgdXNpbmcgcHJvY2VzcyBpbiBicm93c2VyXG5cbnZhciBwcm9jZXNzID0gbW9kdWxlLmV4cG9ydHMgPSB7fTtcblxuLy8gY2FjaGVkIGZyb20gd2hhdGV2ZXIgZ2xvYmFsIGlzIHByZXNlbnQgc28gdGhhdCB0ZXN0IHJ1bm5lcnMgdGhhdCBzdHViIGl0XG4vLyBkb24ndCBicmVhayB0aGluZ3MuICBCdXQgd2UgbmVlZCB0byB3cmFwIGl0IGluIGEgdHJ5IGNhdGNoIGluIGNhc2UgaXQgaXNcbi8vIHdyYXBwZWQgaW4gc3RyaWN0IG1vZGUgY29kZSB3aGljaCBkb2Vzbid0IGRlZmluZSBhbnkgZ2xvYmFscy4gIEl0J3MgaW5zaWRlIGFcbi8vIGZ1bmN0aW9uIGJlY2F1c2UgdHJ5L2NhdGNoZXMgZGVvcHRpbWl6ZSBpbiBjZXJ0YWluIGVuZ2luZXMuXG5cbnZhciBjYWNoZWRTZXRUaW1lb3V0O1xudmFyIGNhY2hlZENsZWFyVGltZW91dDtcblxuKGZ1bmN0aW9uICgpIHtcbiAgdHJ5IHtcbiAgICBjYWNoZWRTZXRUaW1lb3V0ID0gc2V0VGltZW91dDtcbiAgfSBjYXRjaCAoZSkge1xuICAgIGNhY2hlZFNldFRpbWVvdXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ3NldFRpbWVvdXQgaXMgbm90IGRlZmluZWQnKTtcbiAgICB9XG4gIH1cbiAgdHJ5IHtcbiAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBjbGVhclRpbWVvdXQ7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2NsZWFyVGltZW91dCBpcyBub3QgZGVmaW5lZCcpO1xuICAgIH1cbiAgfVxufSAoKSlcbnZhciBxdWV1ZSA9IFtdO1xudmFyIGRyYWluaW5nID0gZmFsc2U7XG52YXIgY3VycmVudFF1ZXVlO1xudmFyIHF1ZXVlSW5kZXggPSAtMTtcblxuZnVuY3Rpb24gY2xlYW5VcE5leHRUaWNrKCkge1xuICAgIGlmICghZHJhaW5pbmcgfHwgIWN1cnJlbnRRdWV1ZSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGRyYWluaW5nID0gZmFsc2U7XG4gICAgaWYgKGN1cnJlbnRRdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgcXVldWUgPSBjdXJyZW50UXVldWUuY29uY2F0KHF1ZXVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgfVxuICAgIGlmIChxdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgZHJhaW5RdWV1ZSgpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gZHJhaW5RdWV1ZSgpIHtcbiAgICBpZiAoZHJhaW5pbmcpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB2YXIgdGltZW91dCA9IGNhY2hlZFNldFRpbWVvdXQoY2xlYW5VcE5leHRUaWNrKTtcbiAgICBkcmFpbmluZyA9IHRydWU7XG5cbiAgICB2YXIgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIHdoaWxlKGxlbikge1xuICAgICAgICBjdXJyZW50UXVldWUgPSBxdWV1ZTtcbiAgICAgICAgcXVldWUgPSBbXTtcbiAgICAgICAgd2hpbGUgKCsrcXVldWVJbmRleCA8IGxlbikge1xuICAgICAgICAgICAgaWYgKGN1cnJlbnRRdWV1ZSkge1xuICAgICAgICAgICAgICAgIGN1cnJlbnRRdWV1ZVtxdWV1ZUluZGV4XS5ydW4oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgICAgIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB9XG4gICAgY3VycmVudFF1ZXVlID0gbnVsbDtcbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIGNhY2hlZENsZWFyVGltZW91dCh0aW1lb3V0KTtcbn1cblxucHJvY2Vzcy5uZXh0VGljayA9IGZ1bmN0aW9uIChmdW4pIHtcbiAgICB2YXIgYXJncyA9IG5ldyBBcnJheShhcmd1bWVudHMubGVuZ3RoIC0gMSk7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBhcmdzW2kgLSAxXSA9IGFyZ3VtZW50c1tpXTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBxdWV1ZS5wdXNoKG5ldyBJdGVtKGZ1biwgYXJncykpO1xuICAgIGlmIChxdWV1ZS5sZW5ndGggPT09IDEgJiYgIWRyYWluaW5nKSB7XG4gICAgICAgIGNhY2hlZFNldFRpbWVvdXQoZHJhaW5RdWV1ZSwgMCk7XG4gICAgfVxufTtcblxuLy8gdjggbGlrZXMgcHJlZGljdGlibGUgb2JqZWN0c1xuZnVuY3Rpb24gSXRlbShmdW4sIGFycmF5KSB7XG4gICAgdGhpcy5mdW4gPSBmdW47XG4gICAgdGhpcy5hcnJheSA9IGFycmF5O1xufVxuSXRlbS5wcm90b3R5cGUucnVuID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuZnVuLmFwcGx5KG51bGwsIHRoaXMuYXJyYXkpO1xufTtcbnByb2Nlc3MudGl0bGUgPSAnYnJvd3Nlcic7XG5wcm9jZXNzLmJyb3dzZXIgPSB0cnVlO1xucHJvY2Vzcy5lbnYgPSB7fTtcbnByb2Nlc3MuYXJndiA9IFtdO1xucHJvY2Vzcy52ZXJzaW9uID0gJyc7IC8vIGVtcHR5IHN0cmluZyB0byBhdm9pZCByZWdleHAgaXNzdWVzXG5wcm9jZXNzLnZlcnNpb25zID0ge307XG5cbmZ1bmN0aW9uIG5vb3AoKSB7fVxuXG5wcm9jZXNzLm9uID0gbm9vcDtcbnByb2Nlc3MuYWRkTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5vbmNlID0gbm9vcDtcbnByb2Nlc3Mub2ZmID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBub29wO1xucHJvY2Vzcy5lbWl0ID0gbm9vcDtcblxucHJvY2Vzcy5iaW5kaW5nID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuYmluZGluZyBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xuXG5wcm9jZXNzLmN3ZCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuICcvJyB9O1xucHJvY2Vzcy5jaGRpciA9IGZ1bmN0aW9uIChkaXIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuY2hkaXIgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcbnByb2Nlc3MudW1hc2sgPSBmdW5jdGlvbigpIHsgcmV0dXJuIDA7IH07XG4iLCIvKiFcbiAgQ29weXJpZ2h0IChjKSAyMDE2IEplZCBXYXRzb24uXG4gIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZSAoTUlUKSwgc2VlXG4gIGh0dHA6Ly9qZWR3YXRzb24uZ2l0aHViLmlvL2NsYXNzbmFtZXNcbiovXG4vKiBnbG9iYWwgZGVmaW5lICovXG5cbihmdW5jdGlvbiAoKSB7XG5cdCd1c2Ugc3RyaWN0JztcblxuXHR2YXIgaGFzT3duID0ge30uaGFzT3duUHJvcGVydHk7XG5cblx0ZnVuY3Rpb24gY2xhc3NOYW1lcyAoKSB7XG5cdFx0dmFyIGNsYXNzZXMgPSBbXTtcblxuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHR2YXIgYXJnID0gYXJndW1lbnRzW2ldO1xuXHRcdFx0aWYgKCFhcmcpIGNvbnRpbnVlO1xuXG5cdFx0XHR2YXIgYXJnVHlwZSA9IHR5cGVvZiBhcmc7XG5cblx0XHRcdGlmIChhcmdUeXBlID09PSAnc3RyaW5nJyB8fCBhcmdUeXBlID09PSAnbnVtYmVyJykge1xuXHRcdFx0XHRjbGFzc2VzLnB1c2goYXJnKTtcblx0XHRcdH0gZWxzZSBpZiAoQXJyYXkuaXNBcnJheShhcmcpKSB7XG5cdFx0XHRcdGNsYXNzZXMucHVzaChjbGFzc05hbWVzLmFwcGx5KG51bGwsIGFyZykpO1xuXHRcdFx0fSBlbHNlIGlmIChhcmdUeXBlID09PSAnb2JqZWN0Jykge1xuXHRcdFx0XHRmb3IgKHZhciBrZXkgaW4gYXJnKSB7XG5cdFx0XHRcdFx0aWYgKGhhc093bi5jYWxsKGFyZywga2V5KSAmJiBhcmdba2V5XSkge1xuXHRcdFx0XHRcdFx0Y2xhc3Nlcy5wdXNoKGtleSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGNsYXNzZXMuam9pbignICcpO1xuXHR9XG5cblx0aWYgKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnICYmIG1vZHVsZS5leHBvcnRzKSB7XG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBjbGFzc05hbWVzO1xuXHR9IGVsc2UgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgdHlwZW9mIGRlZmluZS5hbWQgPT09ICdvYmplY3QnICYmIGRlZmluZS5hbWQpIHtcblx0XHQvLyByZWdpc3RlciBhcyAnY2xhc3NuYW1lcycsIGNvbnNpc3RlbnQgd2l0aCBucG0gcGFja2FnZSBuYW1lXG5cdFx0ZGVmaW5lKCdjbGFzc25hbWVzJywgW10sIGZ1bmN0aW9uICgpIHtcblx0XHRcdHJldHVybiBjbGFzc05hbWVzO1xuXHRcdH0pO1xuXHR9IGVsc2Uge1xuXHRcdHdpbmRvdy5jbGFzc05hbWVzID0gY2xhc3NOYW1lcztcblx0fVxufSgpKTtcbiIsIid1c2Ugc3RyaWN0Jztcbi8qIGVzbGludC1kaXNhYmxlIG5vLXVudXNlZC12YXJzICovXG52YXIgaGFzT3duUHJvcGVydHkgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xudmFyIHByb3BJc0VudW1lcmFibGUgPSBPYmplY3QucHJvdG90eXBlLnByb3BlcnR5SXNFbnVtZXJhYmxlO1xuXG5mdW5jdGlvbiB0b09iamVjdCh2YWwpIHtcblx0aWYgKHZhbCA9PT0gbnVsbCB8fCB2YWwgPT09IHVuZGVmaW5lZCkge1xuXHRcdHRocm93IG5ldyBUeXBlRXJyb3IoJ09iamVjdC5hc3NpZ24gY2Fubm90IGJlIGNhbGxlZCB3aXRoIG51bGwgb3IgdW5kZWZpbmVkJyk7XG5cdH1cblxuXHRyZXR1cm4gT2JqZWN0KHZhbCk7XG59XG5cbmZ1bmN0aW9uIHNob3VsZFVzZU5hdGl2ZSgpIHtcblx0dHJ5IHtcblx0XHRpZiAoIU9iamVjdC5hc3NpZ24pIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHQvLyBEZXRlY3QgYnVnZ3kgcHJvcGVydHkgZW51bWVyYXRpb24gb3JkZXIgaW4gb2xkZXIgVjggdmVyc2lvbnMuXG5cblx0XHQvLyBodHRwczovL2J1Z3MuY2hyb21pdW0ub3JnL3AvdjgvaXNzdWVzL2RldGFpbD9pZD00MTE4XG5cdFx0dmFyIHRlc3QxID0gbmV3IFN0cmluZygnYWJjJyk7ICAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXG5cdFx0dGVzdDFbNV0gPSAnZGUnO1xuXHRcdGlmIChPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyh0ZXN0MSlbMF0gPT09ICc1Jykge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdC8vIGh0dHBzOi8vYnVncy5jaHJvbWl1bS5vcmcvcC92OC9pc3N1ZXMvZGV0YWlsP2lkPTMwNTZcblx0XHR2YXIgdGVzdDIgPSB7fTtcblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IDEwOyBpKyspIHtcblx0XHRcdHRlc3QyWydfJyArIFN0cmluZy5mcm9tQ2hhckNvZGUoaSldID0gaTtcblx0XHR9XG5cdFx0dmFyIG9yZGVyMiA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHRlc3QyKS5tYXAoZnVuY3Rpb24gKG4pIHtcblx0XHRcdHJldHVybiB0ZXN0MltuXTtcblx0XHR9KTtcblx0XHRpZiAob3JkZXIyLmpvaW4oJycpICE9PSAnMDEyMzQ1Njc4OScpIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHQvLyBodHRwczovL2J1Z3MuY2hyb21pdW0ub3JnL3AvdjgvaXNzdWVzL2RldGFpbD9pZD0zMDU2XG5cdFx0dmFyIHRlc3QzID0ge307XG5cdFx0J2FiY2RlZmdoaWprbG1ub3BxcnN0Jy5zcGxpdCgnJykuZm9yRWFjaChmdW5jdGlvbiAobGV0dGVyKSB7XG5cdFx0XHR0ZXN0M1tsZXR0ZXJdID0gbGV0dGVyO1xuXHRcdH0pO1xuXHRcdGlmIChPYmplY3Qua2V5cyhPYmplY3QuYXNzaWduKHt9LCB0ZXN0MykpLmpvaW4oJycpICE9PVxuXHRcdFx0XHQnYWJjZGVmZ2hpamtsbW5vcHFyc3QnKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRydWU7XG5cdH0gY2F0Y2ggKGUpIHtcblx0XHQvLyBXZSBkb24ndCBleHBlY3QgYW55IG9mIHRoZSBhYm92ZSB0byB0aHJvdywgYnV0IGJldHRlciB0byBiZSBzYWZlLlxuXHRcdHJldHVybiBmYWxzZTtcblx0fVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHNob3VsZFVzZU5hdGl2ZSgpID8gT2JqZWN0LmFzc2lnbiA6IGZ1bmN0aW9uICh0YXJnZXQsIHNvdXJjZSkge1xuXHR2YXIgZnJvbTtcblx0dmFyIHRvID0gdG9PYmplY3QodGFyZ2V0KTtcblx0dmFyIHN5bWJvbHM7XG5cblx0Zm9yICh2YXIgcyA9IDE7IHMgPCBhcmd1bWVudHMubGVuZ3RoOyBzKyspIHtcblx0XHRmcm9tID0gT2JqZWN0KGFyZ3VtZW50c1tzXSk7XG5cblx0XHRmb3IgKHZhciBrZXkgaW4gZnJvbSkge1xuXHRcdFx0aWYgKGhhc093blByb3BlcnR5LmNhbGwoZnJvbSwga2V5KSkge1xuXHRcdFx0XHR0b1trZXldID0gZnJvbVtrZXldO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGlmIChPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKSB7XG5cdFx0XHRzeW1ib2xzID0gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyhmcm9tKTtcblx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgc3ltYm9scy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRpZiAocHJvcElzRW51bWVyYWJsZS5jYWxsKGZyb20sIHN5bWJvbHNbaV0pKSB7XG5cdFx0XHRcdFx0dG9bc3ltYm9sc1tpXV0gPSBmcm9tW3N5bWJvbHNbaV1dO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIHRvO1xufTtcbiIsIi8qKlxuICogQ29weXJpZ2h0IDIwMTMtcHJlc2VudCwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgQlNELXN0eWxlIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuIEFuIGFkZGl0aW9uYWwgZ3JhbnRcbiAqIG9mIHBhdGVudCByaWdodHMgY2FuIGJlIGZvdW5kIGluIHRoZSBQQVRFTlRTIGZpbGUgaW4gdGhlIHNhbWUgZGlyZWN0b3J5LlxuICpcbiAqIEBwcm92aWRlc01vZHVsZSBLZXlFc2NhcGVVdGlsc1xuICogXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIEVzY2FwZSBhbmQgd3JhcCBrZXkgc28gaXQgaXMgc2FmZSB0byB1c2UgYXMgYSByZWFjdGlkXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IGtleSB0byBiZSBlc2NhcGVkLlxuICogQHJldHVybiB7c3RyaW5nfSB0aGUgZXNjYXBlZCBrZXkuXG4gKi9cblxuZnVuY3Rpb24gZXNjYXBlKGtleSkge1xuICB2YXIgZXNjYXBlUmVnZXggPSAvWz06XS9nO1xuICB2YXIgZXNjYXBlckxvb2t1cCA9IHtcbiAgICAnPSc6ICc9MCcsXG4gICAgJzonOiAnPTInXG4gIH07XG4gIHZhciBlc2NhcGVkU3RyaW5nID0gKCcnICsga2V5KS5yZXBsYWNlKGVzY2FwZVJlZ2V4LCBmdW5jdGlvbiAobWF0Y2gpIHtcbiAgICByZXR1cm4gZXNjYXBlckxvb2t1cFttYXRjaF07XG4gIH0pO1xuXG4gIHJldHVybiAnJCcgKyBlc2NhcGVkU3RyaW5nO1xufVxuXG4vKipcbiAqIFVuZXNjYXBlIGFuZCB1bndyYXAga2V5IGZvciBodW1hbi1yZWFkYWJsZSBkaXNwbGF5XG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IGtleSB0byB1bmVzY2FwZS5cbiAqIEByZXR1cm4ge3N0cmluZ30gdGhlIHVuZXNjYXBlZCBrZXkuXG4gKi9cbmZ1bmN0aW9uIHVuZXNjYXBlKGtleSkge1xuICB2YXIgdW5lc2NhcGVSZWdleCA9IC8oPTB8PTIpL2c7XG4gIHZhciB1bmVzY2FwZXJMb29rdXAgPSB7XG4gICAgJz0wJzogJz0nLFxuICAgICc9Mic6ICc6J1xuICB9O1xuICB2YXIga2V5U3Vic3RyaW5nID0ga2V5WzBdID09PSAnLicgJiYga2V5WzFdID09PSAnJCcgPyBrZXkuc3Vic3RyaW5nKDIpIDoga2V5LnN1YnN0cmluZygxKTtcblxuICByZXR1cm4gKCcnICsga2V5U3Vic3RyaW5nKS5yZXBsYWNlKHVuZXNjYXBlUmVnZXgsIGZ1bmN0aW9uIChtYXRjaCkge1xuICAgIHJldHVybiB1bmVzY2FwZXJMb29rdXBbbWF0Y2hdO1xuICB9KTtcbn1cblxudmFyIEtleUVzY2FwZVV0aWxzID0ge1xuICBlc2NhcGU6IGVzY2FwZSxcbiAgdW5lc2NhcGU6IHVuZXNjYXBlXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEtleUVzY2FwZVV0aWxzOyIsIi8qKlxuICogQ29weXJpZ2h0IDIwMTMtcHJlc2VudCwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgQlNELXN0eWxlIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuIEFuIGFkZGl0aW9uYWwgZ3JhbnRcbiAqIG9mIHBhdGVudCByaWdodHMgY2FuIGJlIGZvdW5kIGluIHRoZSBQQVRFTlRTIGZpbGUgaW4gdGhlIHNhbWUgZGlyZWN0b3J5LlxuICpcbiAqIEBwcm92aWRlc01vZHVsZSBQb29sZWRDbGFzc1xuICovXG5cbid1c2Ugc3RyaWN0JztcblxudmFyIF9wcm9kSW52YXJpYW50ID0gcmVxdWlyZSgnLi9yZWFjdFByb2RJbnZhcmlhbnQnKTtcblxudmFyIGludmFyaWFudCA9IHJlcXVpcmUoJ2ZianMvbGliL2ludmFyaWFudCcpO1xuXG4vKipcbiAqIFN0YXRpYyBwb29sZXJzLiBTZXZlcmFsIGN1c3RvbSB2ZXJzaW9ucyBmb3IgZWFjaCBwb3RlbnRpYWwgbnVtYmVyIG9mXG4gKiBhcmd1bWVudHMuIEEgY29tcGxldGVseSBnZW5lcmljIHBvb2xlciBpcyBlYXN5IHRvIGltcGxlbWVudCwgYnV0IHdvdWxkXG4gKiByZXF1aXJlIGFjY2Vzc2luZyB0aGUgYGFyZ3VtZW50c2Agb2JqZWN0LiBJbiBlYWNoIG9mIHRoZXNlLCBgdGhpc2AgcmVmZXJzIHRvXG4gKiB0aGUgQ2xhc3MgaXRzZWxmLCBub3QgYW4gaW5zdGFuY2UuIElmIGFueSBvdGhlcnMgYXJlIG5lZWRlZCwgc2ltcGx5IGFkZCB0aGVtXG4gKiBoZXJlLCBvciBpbiB0aGVpciBvd24gZmlsZXMuXG4gKi9cbnZhciBvbmVBcmd1bWVudFBvb2xlciA9IGZ1bmN0aW9uIChjb3B5RmllbGRzRnJvbSkge1xuICB2YXIgS2xhc3MgPSB0aGlzO1xuICBpZiAoS2xhc3MuaW5zdGFuY2VQb29sLmxlbmd0aCkge1xuICAgIHZhciBpbnN0YW5jZSA9IEtsYXNzLmluc3RhbmNlUG9vbC5wb3AoKTtcbiAgICBLbGFzcy5jYWxsKGluc3RhbmNlLCBjb3B5RmllbGRzRnJvbSk7XG4gICAgcmV0dXJuIGluc3RhbmNlO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBuZXcgS2xhc3MoY29weUZpZWxkc0Zyb20pO1xuICB9XG59O1xuXG52YXIgdHdvQXJndW1lbnRQb29sZXIgPSBmdW5jdGlvbiAoYTEsIGEyKSB7XG4gIHZhciBLbGFzcyA9IHRoaXM7XG4gIGlmIChLbGFzcy5pbnN0YW5jZVBvb2wubGVuZ3RoKSB7XG4gICAgdmFyIGluc3RhbmNlID0gS2xhc3MuaW5zdGFuY2VQb29sLnBvcCgpO1xuICAgIEtsYXNzLmNhbGwoaW5zdGFuY2UsIGExLCBhMik7XG4gICAgcmV0dXJuIGluc3RhbmNlO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBuZXcgS2xhc3MoYTEsIGEyKTtcbiAgfVxufTtcblxudmFyIHRocmVlQXJndW1lbnRQb29sZXIgPSBmdW5jdGlvbiAoYTEsIGEyLCBhMykge1xuICB2YXIgS2xhc3MgPSB0aGlzO1xuICBpZiAoS2xhc3MuaW5zdGFuY2VQb29sLmxlbmd0aCkge1xuICAgIHZhciBpbnN0YW5jZSA9IEtsYXNzLmluc3RhbmNlUG9vbC5wb3AoKTtcbiAgICBLbGFzcy5jYWxsKGluc3RhbmNlLCBhMSwgYTIsIGEzKTtcbiAgICByZXR1cm4gaW5zdGFuY2U7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIG5ldyBLbGFzcyhhMSwgYTIsIGEzKTtcbiAgfVxufTtcblxudmFyIGZvdXJBcmd1bWVudFBvb2xlciA9IGZ1bmN0aW9uIChhMSwgYTIsIGEzLCBhNCkge1xuICB2YXIgS2xhc3MgPSB0aGlzO1xuICBpZiAoS2xhc3MuaW5zdGFuY2VQb29sLmxlbmd0aCkge1xuICAgIHZhciBpbnN0YW5jZSA9IEtsYXNzLmluc3RhbmNlUG9vbC5wb3AoKTtcbiAgICBLbGFzcy5jYWxsKGluc3RhbmNlLCBhMSwgYTIsIGEzLCBhNCk7XG4gICAgcmV0dXJuIGluc3RhbmNlO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBuZXcgS2xhc3MoYTEsIGEyLCBhMywgYTQpO1xuICB9XG59O1xuXG52YXIgZml2ZUFyZ3VtZW50UG9vbGVyID0gZnVuY3Rpb24gKGExLCBhMiwgYTMsIGE0LCBhNSkge1xuICB2YXIgS2xhc3MgPSB0aGlzO1xuICBpZiAoS2xhc3MuaW5zdGFuY2VQb29sLmxlbmd0aCkge1xuICAgIHZhciBpbnN0YW5jZSA9IEtsYXNzLmluc3RhbmNlUG9vbC5wb3AoKTtcbiAgICBLbGFzcy5jYWxsKGluc3RhbmNlLCBhMSwgYTIsIGEzLCBhNCwgYTUpO1xuICAgIHJldHVybiBpbnN0YW5jZTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gbmV3IEtsYXNzKGExLCBhMiwgYTMsIGE0LCBhNSk7XG4gIH1cbn07XG5cbnZhciBzdGFuZGFyZFJlbGVhc2VyID0gZnVuY3Rpb24gKGluc3RhbmNlKSB7XG4gIHZhciBLbGFzcyA9IHRoaXM7XG4gICEoaW5zdGFuY2UgaW5zdGFuY2VvZiBLbGFzcykgPyBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nID8gaW52YXJpYW50KGZhbHNlLCAnVHJ5aW5nIHRvIHJlbGVhc2UgYW4gaW5zdGFuY2UgaW50byBhIHBvb2wgb2YgYSBkaWZmZXJlbnQgdHlwZS4nKSA6IF9wcm9kSW52YXJpYW50KCcyNScpIDogdm9pZCAwO1xuICBpbnN0YW5jZS5kZXN0cnVjdG9yKCk7XG4gIGlmIChLbGFzcy5pbnN0YW5jZVBvb2wubGVuZ3RoIDwgS2xhc3MucG9vbFNpemUpIHtcbiAgICBLbGFzcy5pbnN0YW5jZVBvb2wucHVzaChpbnN0YW5jZSk7XG4gIH1cbn07XG5cbnZhciBERUZBVUxUX1BPT0xfU0laRSA9IDEwO1xudmFyIERFRkFVTFRfUE9PTEVSID0gb25lQXJndW1lbnRQb29sZXI7XG5cbi8qKlxuICogQXVnbWVudHMgYENvcHlDb25zdHJ1Y3RvcmAgdG8gYmUgYSBwb29sYWJsZSBjbGFzcywgYXVnbWVudGluZyBvbmx5IHRoZSBjbGFzc1xuICogaXRzZWxmIChzdGF0aWNhbGx5KSBub3QgYWRkaW5nIGFueSBwcm90b3R5cGljYWwgZmllbGRzLiBBbnkgQ29weUNvbnN0cnVjdG9yXG4gKiB5b3UgZ2l2ZSB0aGlzIG1heSBoYXZlIGEgYHBvb2xTaXplYCBwcm9wZXJ0eSwgYW5kIHdpbGwgbG9vayBmb3IgYVxuICogcHJvdG90eXBpY2FsIGBkZXN0cnVjdG9yYCBvbiBpbnN0YW5jZXMuXG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbn0gQ29weUNvbnN0cnVjdG9yIENvbnN0cnVjdG9yIHRoYXQgY2FuIGJlIHVzZWQgdG8gcmVzZXQuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBwb29sZXIgQ3VzdG9taXphYmxlIHBvb2xlci5cbiAqL1xudmFyIGFkZFBvb2xpbmdUbyA9IGZ1bmN0aW9uIChDb3B5Q29uc3RydWN0b3IsIHBvb2xlcikge1xuICB2YXIgTmV3S2xhc3MgPSBDb3B5Q29uc3RydWN0b3I7XG4gIE5ld0tsYXNzLmluc3RhbmNlUG9vbCA9IFtdO1xuICBOZXdLbGFzcy5nZXRQb29sZWQgPSBwb29sZXIgfHwgREVGQVVMVF9QT09MRVI7XG4gIGlmICghTmV3S2xhc3MucG9vbFNpemUpIHtcbiAgICBOZXdLbGFzcy5wb29sU2l6ZSA9IERFRkFVTFRfUE9PTF9TSVpFO1xuICB9XG4gIE5ld0tsYXNzLnJlbGVhc2UgPSBzdGFuZGFyZFJlbGVhc2VyO1xuICByZXR1cm4gTmV3S2xhc3M7XG59O1xuXG52YXIgUG9vbGVkQ2xhc3MgPSB7XG4gIGFkZFBvb2xpbmdUbzogYWRkUG9vbGluZ1RvLFxuICBvbmVBcmd1bWVudFBvb2xlcjogb25lQXJndW1lbnRQb29sZXIsXG4gIHR3b0FyZ3VtZW50UG9vbGVyOiB0d29Bcmd1bWVudFBvb2xlcixcbiAgdGhyZWVBcmd1bWVudFBvb2xlcjogdGhyZWVBcmd1bWVudFBvb2xlcixcbiAgZm91ckFyZ3VtZW50UG9vbGVyOiBmb3VyQXJndW1lbnRQb29sZXIsXG4gIGZpdmVBcmd1bWVudFBvb2xlcjogZml2ZUFyZ3VtZW50UG9vbGVyXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFBvb2xlZENsYXNzOyIsIi8qKlxuICogQ29weXJpZ2h0IDIwMTMtcHJlc2VudCwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgQlNELXN0eWxlIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuIEFuIGFkZGl0aW9uYWwgZ3JhbnRcbiAqIG9mIHBhdGVudCByaWdodHMgY2FuIGJlIGZvdW5kIGluIHRoZSBQQVRFTlRTIGZpbGUgaW4gdGhlIHNhbWUgZGlyZWN0b3J5LlxuICpcbiAqIEBwcm92aWRlc01vZHVsZSBSZWFjdFxuICovXG5cbid1c2Ugc3RyaWN0JztcblxudmFyIF9hc3NpZ24gPSByZXF1aXJlKCdvYmplY3QtYXNzaWduJyk7XG5cbnZhciBSZWFjdENoaWxkcmVuID0gcmVxdWlyZSgnLi9SZWFjdENoaWxkcmVuJyk7XG52YXIgUmVhY3RDb21wb25lbnQgPSByZXF1aXJlKCcuL1JlYWN0Q29tcG9uZW50Jyk7XG52YXIgUmVhY3RQdXJlQ29tcG9uZW50ID0gcmVxdWlyZSgnLi9SZWFjdFB1cmVDb21wb25lbnQnKTtcbnZhciBSZWFjdENsYXNzID0gcmVxdWlyZSgnLi9SZWFjdENsYXNzJyk7XG52YXIgUmVhY3RET01GYWN0b3JpZXMgPSByZXF1aXJlKCcuL1JlYWN0RE9NRmFjdG9yaWVzJyk7XG52YXIgUmVhY3RFbGVtZW50ID0gcmVxdWlyZSgnLi9SZWFjdEVsZW1lbnQnKTtcbnZhciBSZWFjdFByb3BUeXBlcyA9IHJlcXVpcmUoJy4vUmVhY3RQcm9wVHlwZXMnKTtcbnZhciBSZWFjdFZlcnNpb24gPSByZXF1aXJlKCcuL1JlYWN0VmVyc2lvbicpO1xuXG52YXIgb25seUNoaWxkID0gcmVxdWlyZSgnLi9vbmx5Q2hpbGQnKTtcbnZhciB3YXJuaW5nID0gcmVxdWlyZSgnZmJqcy9saWIvd2FybmluZycpO1xuXG52YXIgY3JlYXRlRWxlbWVudCA9IFJlYWN0RWxlbWVudC5jcmVhdGVFbGVtZW50O1xudmFyIGNyZWF0ZUZhY3RvcnkgPSBSZWFjdEVsZW1lbnQuY3JlYXRlRmFjdG9yeTtcbnZhciBjbG9uZUVsZW1lbnQgPSBSZWFjdEVsZW1lbnQuY2xvbmVFbGVtZW50O1xuXG5pZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICB2YXIgUmVhY3RFbGVtZW50VmFsaWRhdG9yID0gcmVxdWlyZSgnLi9SZWFjdEVsZW1lbnRWYWxpZGF0b3InKTtcbiAgY3JlYXRlRWxlbWVudCA9IFJlYWN0RWxlbWVudFZhbGlkYXRvci5jcmVhdGVFbGVtZW50O1xuICBjcmVhdGVGYWN0b3J5ID0gUmVhY3RFbGVtZW50VmFsaWRhdG9yLmNyZWF0ZUZhY3Rvcnk7XG4gIGNsb25lRWxlbWVudCA9IFJlYWN0RWxlbWVudFZhbGlkYXRvci5jbG9uZUVsZW1lbnQ7XG59XG5cbnZhciBfX3NwcmVhZCA9IF9hc3NpZ247XG5cbmlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gIHZhciB3YXJuZWQgPSBmYWxzZTtcbiAgX19zcHJlYWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyA/IHdhcm5pbmcod2FybmVkLCAnUmVhY3QuX19zcHJlYWQgaXMgZGVwcmVjYXRlZCBhbmQgc2hvdWxkIG5vdCBiZSB1c2VkLiBVc2UgJyArICdPYmplY3QuYXNzaWduIGRpcmVjdGx5IG9yIGFub3RoZXIgaGVscGVyIGZ1bmN0aW9uIHdpdGggc2ltaWxhciAnICsgJ3NlbWFudGljcy4gWW91IG1heSBiZSBzZWVpbmcgdGhpcyB3YXJuaW5nIGR1ZSB0byB5b3VyIGNvbXBpbGVyLiAnICsgJ1NlZSBodHRwczovL2ZiLm1lL3JlYWN0LXNwcmVhZC1kZXByZWNhdGlvbiBmb3IgbW9yZSBkZXRhaWxzLicpIDogdm9pZCAwO1xuICAgIHdhcm5lZCA9IHRydWU7XG4gICAgcmV0dXJuIF9hc3NpZ24uYXBwbHkobnVsbCwgYXJndW1lbnRzKTtcbiAgfTtcbn1cblxudmFyIFJlYWN0ID0ge1xuXG4gIC8vIE1vZGVyblxuXG4gIENoaWxkcmVuOiB7XG4gICAgbWFwOiBSZWFjdENoaWxkcmVuLm1hcCxcbiAgICBmb3JFYWNoOiBSZWFjdENoaWxkcmVuLmZvckVhY2gsXG4gICAgY291bnQ6IFJlYWN0Q2hpbGRyZW4uY291bnQsXG4gICAgdG9BcnJheTogUmVhY3RDaGlsZHJlbi50b0FycmF5LFxuICAgIG9ubHk6IG9ubHlDaGlsZFxuICB9LFxuXG4gIENvbXBvbmVudDogUmVhY3RDb21wb25lbnQsXG4gIFB1cmVDb21wb25lbnQ6IFJlYWN0UHVyZUNvbXBvbmVudCxcblxuICBjcmVhdGVFbGVtZW50OiBjcmVhdGVFbGVtZW50LFxuICBjbG9uZUVsZW1lbnQ6IGNsb25lRWxlbWVudCxcbiAgaXNWYWxpZEVsZW1lbnQ6IFJlYWN0RWxlbWVudC5pc1ZhbGlkRWxlbWVudCxcblxuICAvLyBDbGFzc2ljXG5cbiAgUHJvcFR5cGVzOiBSZWFjdFByb3BUeXBlcyxcbiAgY3JlYXRlQ2xhc3M6IFJlYWN0Q2xhc3MuY3JlYXRlQ2xhc3MsXG4gIGNyZWF0ZUZhY3Rvcnk6IGNyZWF0ZUZhY3RvcnksXG4gIGNyZWF0ZU1peGluOiBmdW5jdGlvbiAobWl4aW4pIHtcbiAgICAvLyBDdXJyZW50bHkgYSBub29wLiBXaWxsIGJlIHVzZWQgdG8gdmFsaWRhdGUgYW5kIHRyYWNlIG1peGlucy5cbiAgICByZXR1cm4gbWl4aW47XG4gIH0sXG5cbiAgLy8gVGhpcyBsb29rcyBET00gc3BlY2lmaWMgYnV0IHRoZXNlIGFyZSBhY3R1YWxseSBpc29tb3JwaGljIGhlbHBlcnNcbiAgLy8gc2luY2UgdGhleSBhcmUganVzdCBnZW5lcmF0aW5nIERPTSBzdHJpbmdzLlxuICBET006IFJlYWN0RE9NRmFjdG9yaWVzLFxuXG4gIHZlcnNpb246IFJlYWN0VmVyc2lvbixcblxuICAvLyBEZXByZWNhdGVkIGhvb2sgZm9yIEpTWCBzcHJlYWQsIGRvbid0IHVzZSB0aGlzIGZvciBhbnl0aGluZy5cbiAgX19zcHJlYWQ6IF9fc3ByZWFkXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFJlYWN0OyIsIi8qKlxuICogQ29weXJpZ2h0IDIwMTMtcHJlc2VudCwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgQlNELXN0eWxlIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuIEFuIGFkZGl0aW9uYWwgZ3JhbnRcbiAqIG9mIHBhdGVudCByaWdodHMgY2FuIGJlIGZvdW5kIGluIHRoZSBQQVRFTlRTIGZpbGUgaW4gdGhlIHNhbWUgZGlyZWN0b3J5LlxuICpcbiAqIEBwcm92aWRlc01vZHVsZSBSZWFjdENoaWxkcmVuXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgUG9vbGVkQ2xhc3MgPSByZXF1aXJlKCcuL1Bvb2xlZENsYXNzJyk7XG52YXIgUmVhY3RFbGVtZW50ID0gcmVxdWlyZSgnLi9SZWFjdEVsZW1lbnQnKTtcblxudmFyIGVtcHR5RnVuY3Rpb24gPSByZXF1aXJlKCdmYmpzL2xpYi9lbXB0eUZ1bmN0aW9uJyk7XG52YXIgdHJhdmVyc2VBbGxDaGlsZHJlbiA9IHJlcXVpcmUoJy4vdHJhdmVyc2VBbGxDaGlsZHJlbicpO1xuXG52YXIgdHdvQXJndW1lbnRQb29sZXIgPSBQb29sZWRDbGFzcy50d29Bcmd1bWVudFBvb2xlcjtcbnZhciBmb3VyQXJndW1lbnRQb29sZXIgPSBQb29sZWRDbGFzcy5mb3VyQXJndW1lbnRQb29sZXI7XG5cbnZhciB1c2VyUHJvdmlkZWRLZXlFc2NhcGVSZWdleCA9IC9cXC8rL2c7XG5mdW5jdGlvbiBlc2NhcGVVc2VyUHJvdmlkZWRLZXkodGV4dCkge1xuICByZXR1cm4gKCcnICsgdGV4dCkucmVwbGFjZSh1c2VyUHJvdmlkZWRLZXlFc2NhcGVSZWdleCwgJyQmLycpO1xufVxuXG4vKipcbiAqIFBvb2xlZENsYXNzIHJlcHJlc2VudGluZyB0aGUgYm9va2tlZXBpbmcgYXNzb2NpYXRlZCB3aXRoIHBlcmZvcm1pbmcgYSBjaGlsZFxuICogdHJhdmVyc2FsLiBBbGxvd3MgYXZvaWRpbmcgYmluZGluZyBjYWxsYmFja3MuXG4gKlxuICogQGNvbnN0cnVjdG9yIEZvckVhY2hCb29rS2VlcGluZ1xuICogQHBhcmFtIHshZnVuY3Rpb259IGZvckVhY2hGdW5jdGlvbiBGdW5jdGlvbiB0byBwZXJmb3JtIHRyYXZlcnNhbCB3aXRoLlxuICogQHBhcmFtIHs/Kn0gZm9yRWFjaENvbnRleHQgQ29udGV4dCB0byBwZXJmb3JtIGNvbnRleHQgd2l0aC5cbiAqL1xuZnVuY3Rpb24gRm9yRWFjaEJvb2tLZWVwaW5nKGZvckVhY2hGdW5jdGlvbiwgZm9yRWFjaENvbnRleHQpIHtcbiAgdGhpcy5mdW5jID0gZm9yRWFjaEZ1bmN0aW9uO1xuICB0aGlzLmNvbnRleHQgPSBmb3JFYWNoQ29udGV4dDtcbiAgdGhpcy5jb3VudCA9IDA7XG59XG5Gb3JFYWNoQm9va0tlZXBpbmcucHJvdG90eXBlLmRlc3RydWN0b3IgPSBmdW5jdGlvbiAoKSB7XG4gIHRoaXMuZnVuYyA9IG51bGw7XG4gIHRoaXMuY29udGV4dCA9IG51bGw7XG4gIHRoaXMuY291bnQgPSAwO1xufTtcblBvb2xlZENsYXNzLmFkZFBvb2xpbmdUbyhGb3JFYWNoQm9va0tlZXBpbmcsIHR3b0FyZ3VtZW50UG9vbGVyKTtcblxuZnVuY3Rpb24gZm9yRWFjaFNpbmdsZUNoaWxkKGJvb2tLZWVwaW5nLCBjaGlsZCwgbmFtZSkge1xuICB2YXIgZnVuYyA9IGJvb2tLZWVwaW5nLmZ1bmM7XG4gIHZhciBjb250ZXh0ID0gYm9va0tlZXBpbmcuY29udGV4dDtcblxuICBmdW5jLmNhbGwoY29udGV4dCwgY2hpbGQsIGJvb2tLZWVwaW5nLmNvdW50KyspO1xufVxuXG4vKipcbiAqIEl0ZXJhdGVzIHRocm91Z2ggY2hpbGRyZW4gdGhhdCBhcmUgdHlwaWNhbGx5IHNwZWNpZmllZCBhcyBgcHJvcHMuY2hpbGRyZW5gLlxuICpcbiAqIFNlZSBodHRwczovL2ZhY2Vib29rLmdpdGh1Yi5pby9yZWFjdC9kb2NzL3RvcC1sZXZlbC1hcGkuaHRtbCNyZWFjdC5jaGlsZHJlbi5mb3JlYWNoXG4gKlxuICogVGhlIHByb3ZpZGVkIGZvckVhY2hGdW5jKGNoaWxkLCBpbmRleCkgd2lsbCBiZSBjYWxsZWQgZm9yIGVhY2hcbiAqIGxlYWYgY2hpbGQuXG4gKlxuICogQHBhcmFtIHs/Kn0gY2hpbGRyZW4gQ2hpbGRyZW4gdHJlZSBjb250YWluZXIuXG4gKiBAcGFyYW0ge2Z1bmN0aW9uKCosIGludCl9IGZvckVhY2hGdW5jXG4gKiBAcGFyYW0geyp9IGZvckVhY2hDb250ZXh0IENvbnRleHQgZm9yIGZvckVhY2hDb250ZXh0LlxuICovXG5mdW5jdGlvbiBmb3JFYWNoQ2hpbGRyZW4oY2hpbGRyZW4sIGZvckVhY2hGdW5jLCBmb3JFYWNoQ29udGV4dCkge1xuICBpZiAoY2hpbGRyZW4gPT0gbnVsbCkge1xuICAgIHJldHVybiBjaGlsZHJlbjtcbiAgfVxuICB2YXIgdHJhdmVyc2VDb250ZXh0ID0gRm9yRWFjaEJvb2tLZWVwaW5nLmdldFBvb2xlZChmb3JFYWNoRnVuYywgZm9yRWFjaENvbnRleHQpO1xuICB0cmF2ZXJzZUFsbENoaWxkcmVuKGNoaWxkcmVuLCBmb3JFYWNoU2luZ2xlQ2hpbGQsIHRyYXZlcnNlQ29udGV4dCk7XG4gIEZvckVhY2hCb29rS2VlcGluZy5yZWxlYXNlKHRyYXZlcnNlQ29udGV4dCk7XG59XG5cbi8qKlxuICogUG9vbGVkQ2xhc3MgcmVwcmVzZW50aW5nIHRoZSBib29ra2VlcGluZyBhc3NvY2lhdGVkIHdpdGggcGVyZm9ybWluZyBhIGNoaWxkXG4gKiBtYXBwaW5nLiBBbGxvd3MgYXZvaWRpbmcgYmluZGluZyBjYWxsYmFja3MuXG4gKlxuICogQGNvbnN0cnVjdG9yIE1hcEJvb2tLZWVwaW5nXG4gKiBAcGFyYW0geyEqfSBtYXBSZXN1bHQgT2JqZWN0IGNvbnRhaW5pbmcgdGhlIG9yZGVyZWQgbWFwIG9mIHJlc3VsdHMuXG4gKiBAcGFyYW0geyFmdW5jdGlvbn0gbWFwRnVuY3Rpb24gRnVuY3Rpb24gdG8gcGVyZm9ybSBtYXBwaW5nIHdpdGguXG4gKiBAcGFyYW0gez8qfSBtYXBDb250ZXh0IENvbnRleHQgdG8gcGVyZm9ybSBtYXBwaW5nIHdpdGguXG4gKi9cbmZ1bmN0aW9uIE1hcEJvb2tLZWVwaW5nKG1hcFJlc3VsdCwga2V5UHJlZml4LCBtYXBGdW5jdGlvbiwgbWFwQ29udGV4dCkge1xuICB0aGlzLnJlc3VsdCA9IG1hcFJlc3VsdDtcbiAgdGhpcy5rZXlQcmVmaXggPSBrZXlQcmVmaXg7XG4gIHRoaXMuZnVuYyA9IG1hcEZ1bmN0aW9uO1xuICB0aGlzLmNvbnRleHQgPSBtYXBDb250ZXh0O1xuICB0aGlzLmNvdW50ID0gMDtcbn1cbk1hcEJvb2tLZWVwaW5nLnByb3RvdHlwZS5kZXN0cnVjdG9yID0gZnVuY3Rpb24gKCkge1xuICB0aGlzLnJlc3VsdCA9IG51bGw7XG4gIHRoaXMua2V5UHJlZml4ID0gbnVsbDtcbiAgdGhpcy5mdW5jID0gbnVsbDtcbiAgdGhpcy5jb250ZXh0ID0gbnVsbDtcbiAgdGhpcy5jb3VudCA9IDA7XG59O1xuUG9vbGVkQ2xhc3MuYWRkUG9vbGluZ1RvKE1hcEJvb2tLZWVwaW5nLCBmb3VyQXJndW1lbnRQb29sZXIpO1xuXG5mdW5jdGlvbiBtYXBTaW5nbGVDaGlsZEludG9Db250ZXh0KGJvb2tLZWVwaW5nLCBjaGlsZCwgY2hpbGRLZXkpIHtcbiAgdmFyIHJlc3VsdCA9IGJvb2tLZWVwaW5nLnJlc3VsdDtcbiAgdmFyIGtleVByZWZpeCA9IGJvb2tLZWVwaW5nLmtleVByZWZpeDtcbiAgdmFyIGZ1bmMgPSBib29rS2VlcGluZy5mdW5jO1xuICB2YXIgY29udGV4dCA9IGJvb2tLZWVwaW5nLmNvbnRleHQ7XG5cblxuICB2YXIgbWFwcGVkQ2hpbGQgPSBmdW5jLmNhbGwoY29udGV4dCwgY2hpbGQsIGJvb2tLZWVwaW5nLmNvdW50KyspO1xuICBpZiAoQXJyYXkuaXNBcnJheShtYXBwZWRDaGlsZCkpIHtcbiAgICBtYXBJbnRvV2l0aEtleVByZWZpeEludGVybmFsKG1hcHBlZENoaWxkLCByZXN1bHQsIGNoaWxkS2V5LCBlbXB0eUZ1bmN0aW9uLnRoYXRSZXR1cm5zQXJndW1lbnQpO1xuICB9IGVsc2UgaWYgKG1hcHBlZENoaWxkICE9IG51bGwpIHtcbiAgICBpZiAoUmVhY3RFbGVtZW50LmlzVmFsaWRFbGVtZW50KG1hcHBlZENoaWxkKSkge1xuICAgICAgbWFwcGVkQ2hpbGQgPSBSZWFjdEVsZW1lbnQuY2xvbmVBbmRSZXBsYWNlS2V5KG1hcHBlZENoaWxkLFxuICAgICAgLy8gS2VlcCBib3RoIHRoZSAobWFwcGVkKSBhbmQgb2xkIGtleXMgaWYgdGhleSBkaWZmZXIsIGp1c3QgYXNcbiAgICAgIC8vIHRyYXZlcnNlQWxsQ2hpbGRyZW4gdXNlZCB0byBkbyBmb3Igb2JqZWN0cyBhcyBjaGlsZHJlblxuICAgICAga2V5UHJlZml4ICsgKG1hcHBlZENoaWxkLmtleSAmJiAoIWNoaWxkIHx8IGNoaWxkLmtleSAhPT0gbWFwcGVkQ2hpbGQua2V5KSA/IGVzY2FwZVVzZXJQcm92aWRlZEtleShtYXBwZWRDaGlsZC5rZXkpICsgJy8nIDogJycpICsgY2hpbGRLZXkpO1xuICAgIH1cbiAgICByZXN1bHQucHVzaChtYXBwZWRDaGlsZCk7XG4gIH1cbn1cblxuZnVuY3Rpb24gbWFwSW50b1dpdGhLZXlQcmVmaXhJbnRlcm5hbChjaGlsZHJlbiwgYXJyYXksIHByZWZpeCwgZnVuYywgY29udGV4dCkge1xuICB2YXIgZXNjYXBlZFByZWZpeCA9ICcnO1xuICBpZiAocHJlZml4ICE9IG51bGwpIHtcbiAgICBlc2NhcGVkUHJlZml4ID0gZXNjYXBlVXNlclByb3ZpZGVkS2V5KHByZWZpeCkgKyAnLyc7XG4gIH1cbiAgdmFyIHRyYXZlcnNlQ29udGV4dCA9IE1hcEJvb2tLZWVwaW5nLmdldFBvb2xlZChhcnJheSwgZXNjYXBlZFByZWZpeCwgZnVuYywgY29udGV4dCk7XG4gIHRyYXZlcnNlQWxsQ2hpbGRyZW4oY2hpbGRyZW4sIG1hcFNpbmdsZUNoaWxkSW50b0NvbnRleHQsIHRyYXZlcnNlQ29udGV4dCk7XG4gIE1hcEJvb2tLZWVwaW5nLnJlbGVhc2UodHJhdmVyc2VDb250ZXh0KTtcbn1cblxuLyoqXG4gKiBNYXBzIGNoaWxkcmVuIHRoYXQgYXJlIHR5cGljYWxseSBzcGVjaWZpZWQgYXMgYHByb3BzLmNoaWxkcmVuYC5cbiAqXG4gKiBTZWUgaHR0cHM6Ly9mYWNlYm9vay5naXRodWIuaW8vcmVhY3QvZG9jcy90b3AtbGV2ZWwtYXBpLmh0bWwjcmVhY3QuY2hpbGRyZW4ubWFwXG4gKlxuICogVGhlIHByb3ZpZGVkIG1hcEZ1bmN0aW9uKGNoaWxkLCBrZXksIGluZGV4KSB3aWxsIGJlIGNhbGxlZCBmb3IgZWFjaFxuICogbGVhZiBjaGlsZC5cbiAqXG4gKiBAcGFyYW0gez8qfSBjaGlsZHJlbiBDaGlsZHJlbiB0cmVlIGNvbnRhaW5lci5cbiAqIEBwYXJhbSB7ZnVuY3Rpb24oKiwgaW50KX0gZnVuYyBUaGUgbWFwIGZ1bmN0aW9uLlxuICogQHBhcmFtIHsqfSBjb250ZXh0IENvbnRleHQgZm9yIG1hcEZ1bmN0aW9uLlxuICogQHJldHVybiB7b2JqZWN0fSBPYmplY3QgY29udGFpbmluZyB0aGUgb3JkZXJlZCBtYXAgb2YgcmVzdWx0cy5cbiAqL1xuZnVuY3Rpb24gbWFwQ2hpbGRyZW4oY2hpbGRyZW4sIGZ1bmMsIGNvbnRleHQpIHtcbiAgaWYgKGNoaWxkcmVuID09IG51bGwpIHtcbiAgICByZXR1cm4gY2hpbGRyZW47XG4gIH1cbiAgdmFyIHJlc3VsdCA9IFtdO1xuICBtYXBJbnRvV2l0aEtleVByZWZpeEludGVybmFsKGNoaWxkcmVuLCByZXN1bHQsIG51bGwsIGZ1bmMsIGNvbnRleHQpO1xuICByZXR1cm4gcmVzdWx0O1xufVxuXG5mdW5jdGlvbiBmb3JFYWNoU2luZ2xlQ2hpbGREdW1teSh0cmF2ZXJzZUNvbnRleHQsIGNoaWxkLCBuYW1lKSB7XG4gIHJldHVybiBudWxsO1xufVxuXG4vKipcbiAqIENvdW50IHRoZSBudW1iZXIgb2YgY2hpbGRyZW4gdGhhdCBhcmUgdHlwaWNhbGx5IHNwZWNpZmllZCBhc1xuICogYHByb3BzLmNoaWxkcmVuYC5cbiAqXG4gKiBTZWUgaHR0cHM6Ly9mYWNlYm9vay5naXRodWIuaW8vcmVhY3QvZG9jcy90b3AtbGV2ZWwtYXBpLmh0bWwjcmVhY3QuY2hpbGRyZW4uY291bnRcbiAqXG4gKiBAcGFyYW0gez8qfSBjaGlsZHJlbiBDaGlsZHJlbiB0cmVlIGNvbnRhaW5lci5cbiAqIEByZXR1cm4ge251bWJlcn0gVGhlIG51bWJlciBvZiBjaGlsZHJlbi5cbiAqL1xuZnVuY3Rpb24gY291bnRDaGlsZHJlbihjaGlsZHJlbiwgY29udGV4dCkge1xuICByZXR1cm4gdHJhdmVyc2VBbGxDaGlsZHJlbihjaGlsZHJlbiwgZm9yRWFjaFNpbmdsZUNoaWxkRHVtbXksIG51bGwpO1xufVxuXG4vKipcbiAqIEZsYXR0ZW4gYSBjaGlsZHJlbiBvYmplY3QgKHR5cGljYWxseSBzcGVjaWZpZWQgYXMgYHByb3BzLmNoaWxkcmVuYCkgYW5kXG4gKiByZXR1cm4gYW4gYXJyYXkgd2l0aCBhcHByb3ByaWF0ZWx5IHJlLWtleWVkIGNoaWxkcmVuLlxuICpcbiAqIFNlZSBodHRwczovL2ZhY2Vib29rLmdpdGh1Yi5pby9yZWFjdC9kb2NzL3RvcC1sZXZlbC1hcGkuaHRtbCNyZWFjdC5jaGlsZHJlbi50b2FycmF5XG4gKi9cbmZ1bmN0aW9uIHRvQXJyYXkoY2hpbGRyZW4pIHtcbiAgdmFyIHJlc3VsdCA9IFtdO1xuICBtYXBJbnRvV2l0aEtleVByZWZpeEludGVybmFsKGNoaWxkcmVuLCByZXN1bHQsIG51bGwsIGVtcHR5RnVuY3Rpb24udGhhdFJldHVybnNBcmd1bWVudCk7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbnZhciBSZWFjdENoaWxkcmVuID0ge1xuICBmb3JFYWNoOiBmb3JFYWNoQ2hpbGRyZW4sXG4gIG1hcDogbWFwQ2hpbGRyZW4sXG4gIG1hcEludG9XaXRoS2V5UHJlZml4SW50ZXJuYWw6IG1hcEludG9XaXRoS2V5UHJlZml4SW50ZXJuYWwsXG4gIGNvdW50OiBjb3VudENoaWxkcmVuLFxuICB0b0FycmF5OiB0b0FycmF5XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFJlYWN0Q2hpbGRyZW47IiwiLyoqXG4gKiBDb3B5cmlnaHQgMjAxMy1wcmVzZW50LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBCU0Qtc3R5bGUgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS4gQW4gYWRkaXRpb25hbCBncmFudFxuICogb2YgcGF0ZW50IHJpZ2h0cyBjYW4gYmUgZm91bmQgaW4gdGhlIFBBVEVOVFMgZmlsZSBpbiB0aGUgc2FtZSBkaXJlY3RvcnkuXG4gKlxuICogQHByb3ZpZGVzTW9kdWxlIFJlYWN0Q2xhc3NcbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbnZhciBfcHJvZEludmFyaWFudCA9IHJlcXVpcmUoJy4vcmVhY3RQcm9kSW52YXJpYW50JyksXG4gICAgX2Fzc2lnbiA9IHJlcXVpcmUoJ29iamVjdC1hc3NpZ24nKTtcblxudmFyIFJlYWN0Q29tcG9uZW50ID0gcmVxdWlyZSgnLi9SZWFjdENvbXBvbmVudCcpO1xudmFyIFJlYWN0RWxlbWVudCA9IHJlcXVpcmUoJy4vUmVhY3RFbGVtZW50Jyk7XG52YXIgUmVhY3RQcm9wVHlwZUxvY2F0aW9ucyA9IHJlcXVpcmUoJy4vUmVhY3RQcm9wVHlwZUxvY2F0aW9ucycpO1xudmFyIFJlYWN0UHJvcFR5cGVMb2NhdGlvbk5hbWVzID0gcmVxdWlyZSgnLi9SZWFjdFByb3BUeXBlTG9jYXRpb25OYW1lcycpO1xudmFyIFJlYWN0Tm9vcFVwZGF0ZVF1ZXVlID0gcmVxdWlyZSgnLi9SZWFjdE5vb3BVcGRhdGVRdWV1ZScpO1xuXG52YXIgZW1wdHlPYmplY3QgPSByZXF1aXJlKCdmYmpzL2xpYi9lbXB0eU9iamVjdCcpO1xudmFyIGludmFyaWFudCA9IHJlcXVpcmUoJ2ZianMvbGliL2ludmFyaWFudCcpO1xudmFyIGtleU1pcnJvciA9IHJlcXVpcmUoJ2ZianMvbGliL2tleU1pcnJvcicpO1xudmFyIGtleU9mID0gcmVxdWlyZSgnZmJqcy9saWIva2V5T2YnKTtcbnZhciB3YXJuaW5nID0gcmVxdWlyZSgnZmJqcy9saWIvd2FybmluZycpO1xuXG52YXIgTUlYSU5TX0tFWSA9IGtleU9mKHsgbWl4aW5zOiBudWxsIH0pO1xuXG4vKipcbiAqIFBvbGljaWVzIHRoYXQgZGVzY3JpYmUgbWV0aG9kcyBpbiBgUmVhY3RDbGFzc0ludGVyZmFjZWAuXG4gKi9cbnZhciBTcGVjUG9saWN5ID0ga2V5TWlycm9yKHtcbiAgLyoqXG4gICAqIFRoZXNlIG1ldGhvZHMgbWF5IGJlIGRlZmluZWQgb25seSBvbmNlIGJ5IHRoZSBjbGFzcyBzcGVjaWZpY2F0aW9uIG9yIG1peGluLlxuICAgKi9cbiAgREVGSU5FX09OQ0U6IG51bGwsXG4gIC8qKlxuICAgKiBUaGVzZSBtZXRob2RzIG1heSBiZSBkZWZpbmVkIGJ5IGJvdGggdGhlIGNsYXNzIHNwZWNpZmljYXRpb24gYW5kIG1peGlucy5cbiAgICogU3Vic2VxdWVudCBkZWZpbml0aW9ucyB3aWxsIGJlIGNoYWluZWQuIFRoZXNlIG1ldGhvZHMgbXVzdCByZXR1cm4gdm9pZC5cbiAgICovXG4gIERFRklORV9NQU5ZOiBudWxsLFxuICAvKipcbiAgICogVGhlc2UgbWV0aG9kcyBhcmUgb3ZlcnJpZGluZyB0aGUgYmFzZSBjbGFzcy5cbiAgICovXG4gIE9WRVJSSURFX0JBU0U6IG51bGwsXG4gIC8qKlxuICAgKiBUaGVzZSBtZXRob2RzIGFyZSBzaW1pbGFyIHRvIERFRklORV9NQU5ZLCBleGNlcHQgd2UgYXNzdW1lIHRoZXkgcmV0dXJuXG4gICAqIG9iamVjdHMuIFdlIHRyeSB0byBtZXJnZSB0aGUga2V5cyBvZiB0aGUgcmV0dXJuIHZhbHVlcyBvZiBhbGwgdGhlIG1peGVkIGluXG4gICAqIGZ1bmN0aW9ucy4gSWYgdGhlcmUgaXMgYSBrZXkgY29uZmxpY3Qgd2UgdGhyb3cuXG4gICAqL1xuICBERUZJTkVfTUFOWV9NRVJHRUQ6IG51bGxcbn0pO1xuXG52YXIgaW5qZWN0ZWRNaXhpbnMgPSBbXTtcblxuLyoqXG4gKiBDb21wb3NpdGUgY29tcG9uZW50cyBhcmUgaGlnaGVyLWxldmVsIGNvbXBvbmVudHMgdGhhdCBjb21wb3NlIG90aGVyIGNvbXBvc2l0ZVxuICogb3IgaG9zdCBjb21wb25lbnRzLlxuICpcbiAqIFRvIGNyZWF0ZSBhIG5ldyB0eXBlIG9mIGBSZWFjdENsYXNzYCwgcGFzcyBhIHNwZWNpZmljYXRpb24gb2ZcbiAqIHlvdXIgbmV3IGNsYXNzIHRvIGBSZWFjdC5jcmVhdGVDbGFzc2AuIFRoZSBvbmx5IHJlcXVpcmVtZW50IG9mIHlvdXIgY2xhc3NcbiAqIHNwZWNpZmljYXRpb24gaXMgdGhhdCB5b3UgaW1wbGVtZW50IGEgYHJlbmRlcmAgbWV0aG9kLlxuICpcbiAqICAgdmFyIE15Q29tcG9uZW50ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICogICAgIHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gKiAgICAgICByZXR1cm4gPGRpdj5IZWxsbyBXb3JsZDwvZGl2PjtcbiAqICAgICB9XG4gKiAgIH0pO1xuICpcbiAqIFRoZSBjbGFzcyBzcGVjaWZpY2F0aW9uIHN1cHBvcnRzIGEgc3BlY2lmaWMgcHJvdG9jb2wgb2YgbWV0aG9kcyB0aGF0IGhhdmVcbiAqIHNwZWNpYWwgbWVhbmluZyAoZS5nLiBgcmVuZGVyYCkuIFNlZSBgUmVhY3RDbGFzc0ludGVyZmFjZWAgZm9yXG4gKiBtb3JlIHRoZSBjb21wcmVoZW5zaXZlIHByb3RvY29sLiBBbnkgb3RoZXIgcHJvcGVydGllcyBhbmQgbWV0aG9kcyBpbiB0aGVcbiAqIGNsYXNzIHNwZWNpZmljYXRpb24gd2lsbCBiZSBhdmFpbGFibGUgb24gdGhlIHByb3RvdHlwZS5cbiAqXG4gKiBAaW50ZXJmYWNlIFJlYWN0Q2xhc3NJbnRlcmZhY2VcbiAqIEBpbnRlcm5hbFxuICovXG52YXIgUmVhY3RDbGFzc0ludGVyZmFjZSA9IHtcblxuICAvKipcbiAgICogQW4gYXJyYXkgb2YgTWl4aW4gb2JqZWN0cyB0byBpbmNsdWRlIHdoZW4gZGVmaW5pbmcgeW91ciBjb21wb25lbnQuXG4gICAqXG4gICAqIEB0eXBlIHthcnJheX1cbiAgICogQG9wdGlvbmFsXG4gICAqL1xuICBtaXhpbnM6IFNwZWNQb2xpY3kuREVGSU5FX01BTlksXG5cbiAgLyoqXG4gICAqIEFuIG9iamVjdCBjb250YWluaW5nIHByb3BlcnRpZXMgYW5kIG1ldGhvZHMgdGhhdCBzaG91bGQgYmUgZGVmaW5lZCBvblxuICAgKiB0aGUgY29tcG9uZW50J3MgY29uc3RydWN0b3IgaW5zdGVhZCBvZiBpdHMgcHJvdG90eXBlIChzdGF0aWMgbWV0aG9kcykuXG4gICAqXG4gICAqIEB0eXBlIHtvYmplY3R9XG4gICAqIEBvcHRpb25hbFxuICAgKi9cbiAgc3RhdGljczogU3BlY1BvbGljeS5ERUZJTkVfTUFOWSxcblxuICAvKipcbiAgICogRGVmaW5pdGlvbiBvZiBwcm9wIHR5cGVzIGZvciB0aGlzIGNvbXBvbmVudC5cbiAgICpcbiAgICogQHR5cGUge29iamVjdH1cbiAgICogQG9wdGlvbmFsXG4gICAqL1xuICBwcm9wVHlwZXM6IFNwZWNQb2xpY3kuREVGSU5FX01BTlksXG5cbiAgLyoqXG4gICAqIERlZmluaXRpb24gb2YgY29udGV4dCB0eXBlcyBmb3IgdGhpcyBjb21wb25lbnQuXG4gICAqXG4gICAqIEB0eXBlIHtvYmplY3R9XG4gICAqIEBvcHRpb25hbFxuICAgKi9cbiAgY29udGV4dFR5cGVzOiBTcGVjUG9saWN5LkRFRklORV9NQU5ZLFxuXG4gIC8qKlxuICAgKiBEZWZpbml0aW9uIG9mIGNvbnRleHQgdHlwZXMgdGhpcyBjb21wb25lbnQgc2V0cyBmb3IgaXRzIGNoaWxkcmVuLlxuICAgKlxuICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgKiBAb3B0aW9uYWxcbiAgICovXG4gIGNoaWxkQ29udGV4dFR5cGVzOiBTcGVjUG9saWN5LkRFRklORV9NQU5ZLFxuXG4gIC8vID09PT0gRGVmaW5pdGlvbiBtZXRob2RzID09PT1cblxuICAvKipcbiAgICogSW52b2tlZCB3aGVuIHRoZSBjb21wb25lbnQgaXMgbW91bnRlZC4gVmFsdWVzIGluIHRoZSBtYXBwaW5nIHdpbGwgYmUgc2V0IG9uXG4gICAqIGB0aGlzLnByb3BzYCBpZiB0aGF0IHByb3AgaXMgbm90IHNwZWNpZmllZCAoaS5lLiB1c2luZyBhbiBgaW5gIGNoZWNrKS5cbiAgICpcbiAgICogVGhpcyBtZXRob2QgaXMgaW52b2tlZCBiZWZvcmUgYGdldEluaXRpYWxTdGF0ZWAgYW5kIHRoZXJlZm9yZSBjYW5ub3QgcmVseVxuICAgKiBvbiBgdGhpcy5zdGF0ZWAgb3IgdXNlIGB0aGlzLnNldFN0YXRlYC5cbiAgICpcbiAgICogQHJldHVybiB7b2JqZWN0fVxuICAgKiBAb3B0aW9uYWxcbiAgICovXG4gIGdldERlZmF1bHRQcm9wczogU3BlY1BvbGljeS5ERUZJTkVfTUFOWV9NRVJHRUQsXG5cbiAgLyoqXG4gICAqIEludm9rZWQgb25jZSBiZWZvcmUgdGhlIGNvbXBvbmVudCBpcyBtb3VudGVkLiBUaGUgcmV0dXJuIHZhbHVlIHdpbGwgYmUgdXNlZFxuICAgKiBhcyB0aGUgaW5pdGlhbCB2YWx1ZSBvZiBgdGhpcy5zdGF0ZWAuXG4gICAqXG4gICAqICAgZ2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbigpIHtcbiAgICogICAgIHJldHVybiB7XG4gICAqICAgICAgIGlzT246IGZhbHNlLFxuICAgKiAgICAgICBmb29CYXo6IG5ldyBCYXpGb28oKVxuICAgKiAgICAgfVxuICAgKiAgIH1cbiAgICpcbiAgICogQHJldHVybiB7b2JqZWN0fVxuICAgKiBAb3B0aW9uYWxcbiAgICovXG4gIGdldEluaXRpYWxTdGF0ZTogU3BlY1BvbGljeS5ERUZJTkVfTUFOWV9NRVJHRUQsXG5cbiAgLyoqXG4gICAqIEByZXR1cm4ge29iamVjdH1cbiAgICogQG9wdGlvbmFsXG4gICAqL1xuICBnZXRDaGlsZENvbnRleHQ6IFNwZWNQb2xpY3kuREVGSU5FX01BTllfTUVSR0VELFxuXG4gIC8qKlxuICAgKiBVc2VzIHByb3BzIGZyb20gYHRoaXMucHJvcHNgIGFuZCBzdGF0ZSBmcm9tIGB0aGlzLnN0YXRlYCB0byByZW5kZXIgdGhlXG4gICAqIHN0cnVjdHVyZSBvZiB0aGUgY29tcG9uZW50LlxuICAgKlxuICAgKiBObyBndWFyYW50ZWVzIGFyZSBtYWRlIGFib3V0IHdoZW4gb3IgaG93IG9mdGVuIHRoaXMgbWV0aG9kIGlzIGludm9rZWQsIHNvXG4gICAqIGl0IG11c3Qgbm90IGhhdmUgc2lkZSBlZmZlY3RzLlxuICAgKlxuICAgKiAgIHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAqICAgICB2YXIgbmFtZSA9IHRoaXMucHJvcHMubmFtZTtcbiAgICogICAgIHJldHVybiA8ZGl2PkhlbGxvLCB7bmFtZX0hPC9kaXY+O1xuICAgKiAgIH1cbiAgICpcbiAgICogQHJldHVybiB7UmVhY3RDb21wb25lbnR9XG4gICAqIEBub3NpZGVlZmZlY3RzXG4gICAqIEByZXF1aXJlZFxuICAgKi9cbiAgcmVuZGVyOiBTcGVjUG9saWN5LkRFRklORV9PTkNFLFxuXG4gIC8vID09PT0gRGVsZWdhdGUgbWV0aG9kcyA9PT09XG5cbiAgLyoqXG4gICAqIEludm9rZWQgd2hlbiB0aGUgY29tcG9uZW50IGlzIGluaXRpYWxseSBjcmVhdGVkIGFuZCBhYm91dCB0byBiZSBtb3VudGVkLlxuICAgKiBUaGlzIG1heSBoYXZlIHNpZGUgZWZmZWN0cywgYnV0IGFueSBleHRlcm5hbCBzdWJzY3JpcHRpb25zIG9yIGRhdGEgY3JlYXRlZFxuICAgKiBieSB0aGlzIG1ldGhvZCBtdXN0IGJlIGNsZWFuZWQgdXAgaW4gYGNvbXBvbmVudFdpbGxVbm1vdW50YC5cbiAgICpcbiAgICogQG9wdGlvbmFsXG4gICAqL1xuICBjb21wb25lbnRXaWxsTW91bnQ6IFNwZWNQb2xpY3kuREVGSU5FX01BTlksXG5cbiAgLyoqXG4gICAqIEludm9rZWQgd2hlbiB0aGUgY29tcG9uZW50IGhhcyBiZWVuIG1vdW50ZWQgYW5kIGhhcyBhIERPTSByZXByZXNlbnRhdGlvbi5cbiAgICogSG93ZXZlciwgdGhlcmUgaXMgbm8gZ3VhcmFudGVlIHRoYXQgdGhlIERPTSBub2RlIGlzIGluIHRoZSBkb2N1bWVudC5cbiAgICpcbiAgICogVXNlIHRoaXMgYXMgYW4gb3Bwb3J0dW5pdHkgdG8gb3BlcmF0ZSBvbiB0aGUgRE9NIHdoZW4gdGhlIGNvbXBvbmVudCBoYXNcbiAgICogYmVlbiBtb3VudGVkIChpbml0aWFsaXplZCBhbmQgcmVuZGVyZWQpIGZvciB0aGUgZmlyc3QgdGltZS5cbiAgICpcbiAgICogQHBhcmFtIHtET01FbGVtZW50fSByb290Tm9kZSBET00gZWxlbWVudCByZXByZXNlbnRpbmcgdGhlIGNvbXBvbmVudC5cbiAgICogQG9wdGlvbmFsXG4gICAqL1xuICBjb21wb25lbnREaWRNb3VudDogU3BlY1BvbGljeS5ERUZJTkVfTUFOWSxcblxuICAvKipcbiAgICogSW52b2tlZCBiZWZvcmUgdGhlIGNvbXBvbmVudCByZWNlaXZlcyBuZXcgcHJvcHMuXG4gICAqXG4gICAqIFVzZSB0aGlzIGFzIGFuIG9wcG9ydHVuaXR5IHRvIHJlYWN0IHRvIGEgcHJvcCB0cmFuc2l0aW9uIGJ5IHVwZGF0aW5nIHRoZVxuICAgKiBzdGF0ZSB1c2luZyBgdGhpcy5zZXRTdGF0ZWAuIEN1cnJlbnQgcHJvcHMgYXJlIGFjY2Vzc2VkIHZpYSBgdGhpcy5wcm9wc2AuXG4gICAqXG4gICAqICAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wczogZnVuY3Rpb24obmV4dFByb3BzLCBuZXh0Q29udGV4dCkge1xuICAgKiAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAqICAgICAgIGxpa2VzSW5jcmVhc2luZzogbmV4dFByb3BzLmxpa2VDb3VudCA+IHRoaXMucHJvcHMubGlrZUNvdW50XG4gICAqICAgICB9KTtcbiAgICogICB9XG4gICAqXG4gICAqIE5PVEU6IFRoZXJlIGlzIG5vIGVxdWl2YWxlbnQgYGNvbXBvbmVudFdpbGxSZWNlaXZlU3RhdGVgLiBBbiBpbmNvbWluZyBwcm9wXG4gICAqIHRyYW5zaXRpb24gbWF5IGNhdXNlIGEgc3RhdGUgY2hhbmdlLCBidXQgdGhlIG9wcG9zaXRlIGlzIG5vdCB0cnVlLiBJZiB5b3VcbiAgICogbmVlZCBpdCwgeW91IGFyZSBwcm9iYWJseSBsb29raW5nIGZvciBgY29tcG9uZW50V2lsbFVwZGF0ZWAuXG4gICAqXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBuZXh0UHJvcHNcbiAgICogQG9wdGlvbmFsXG4gICAqL1xuICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzOiBTcGVjUG9saWN5LkRFRklORV9NQU5ZLFxuXG4gIC8qKlxuICAgKiBJbnZva2VkIHdoaWxlIGRlY2lkaW5nIGlmIHRoZSBjb21wb25lbnQgc2hvdWxkIGJlIHVwZGF0ZWQgYXMgYSByZXN1bHQgb2ZcbiAgICogcmVjZWl2aW5nIG5ldyBwcm9wcywgc3RhdGUgYW5kL29yIGNvbnRleHQuXG4gICAqXG4gICAqIFVzZSB0aGlzIGFzIGFuIG9wcG9ydHVuaXR5IHRvIGByZXR1cm4gZmFsc2VgIHdoZW4geW91J3JlIGNlcnRhaW4gdGhhdCB0aGVcbiAgICogdHJhbnNpdGlvbiB0byB0aGUgbmV3IHByb3BzL3N0YXRlL2NvbnRleHQgd2lsbCBub3QgcmVxdWlyZSBhIGNvbXBvbmVudFxuICAgKiB1cGRhdGUuXG4gICAqXG4gICAqICAgc2hvdWxkQ29tcG9uZW50VXBkYXRlOiBmdW5jdGlvbihuZXh0UHJvcHMsIG5leHRTdGF0ZSwgbmV4dENvbnRleHQpIHtcbiAgICogICAgIHJldHVybiAhZXF1YWwobmV4dFByb3BzLCB0aGlzLnByb3BzKSB8fFxuICAgKiAgICAgICAhZXF1YWwobmV4dFN0YXRlLCB0aGlzLnN0YXRlKSB8fFxuICAgKiAgICAgICAhZXF1YWwobmV4dENvbnRleHQsIHRoaXMuY29udGV4dCk7XG4gICAqICAgfVxuICAgKlxuICAgKiBAcGFyYW0ge29iamVjdH0gbmV4dFByb3BzXG4gICAqIEBwYXJhbSB7P29iamVjdH0gbmV4dFN0YXRlXG4gICAqIEBwYXJhbSB7P29iamVjdH0gbmV4dENvbnRleHRcbiAgICogQHJldHVybiB7Ym9vbGVhbn0gVHJ1ZSBpZiB0aGUgY29tcG9uZW50IHNob3VsZCB1cGRhdGUuXG4gICAqIEBvcHRpb25hbFxuICAgKi9cbiAgc2hvdWxkQ29tcG9uZW50VXBkYXRlOiBTcGVjUG9saWN5LkRFRklORV9PTkNFLFxuXG4gIC8qKlxuICAgKiBJbnZva2VkIHdoZW4gdGhlIGNvbXBvbmVudCBpcyBhYm91dCB0byB1cGRhdGUgZHVlIHRvIGEgdHJhbnNpdGlvbiBmcm9tXG4gICAqIGB0aGlzLnByb3BzYCwgYHRoaXMuc3RhdGVgIGFuZCBgdGhpcy5jb250ZXh0YCB0byBgbmV4dFByb3BzYCwgYG5leHRTdGF0ZWBcbiAgICogYW5kIGBuZXh0Q29udGV4dGAuXG4gICAqXG4gICAqIFVzZSB0aGlzIGFzIGFuIG9wcG9ydHVuaXR5IHRvIHBlcmZvcm0gcHJlcGFyYXRpb24gYmVmb3JlIGFuIHVwZGF0ZSBvY2N1cnMuXG4gICAqXG4gICAqIE5PVEU6IFlvdSAqKmNhbm5vdCoqIHVzZSBgdGhpcy5zZXRTdGF0ZSgpYCBpbiB0aGlzIG1ldGhvZC5cbiAgICpcbiAgICogQHBhcmFtIHtvYmplY3R9IG5leHRQcm9wc1xuICAgKiBAcGFyYW0gez9vYmplY3R9IG5leHRTdGF0ZVxuICAgKiBAcGFyYW0gez9vYmplY3R9IG5leHRDb250ZXh0XG4gICAqIEBwYXJhbSB7UmVhY3RSZWNvbmNpbGVUcmFuc2FjdGlvbn0gdHJhbnNhY3Rpb25cbiAgICogQG9wdGlvbmFsXG4gICAqL1xuICBjb21wb25lbnRXaWxsVXBkYXRlOiBTcGVjUG9saWN5LkRFRklORV9NQU5ZLFxuXG4gIC8qKlxuICAgKiBJbnZva2VkIHdoZW4gdGhlIGNvbXBvbmVudCdzIERPTSByZXByZXNlbnRhdGlvbiBoYXMgYmVlbiB1cGRhdGVkLlxuICAgKlxuICAgKiBVc2UgdGhpcyBhcyBhbiBvcHBvcnR1bml0eSB0byBvcGVyYXRlIG9uIHRoZSBET00gd2hlbiB0aGUgY29tcG9uZW50IGhhc1xuICAgKiBiZWVuIHVwZGF0ZWQuXG4gICAqXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBwcmV2UHJvcHNcbiAgICogQHBhcmFtIHs/b2JqZWN0fSBwcmV2U3RhdGVcbiAgICogQHBhcmFtIHs/b2JqZWN0fSBwcmV2Q29udGV4dFxuICAgKiBAcGFyYW0ge0RPTUVsZW1lbnR9IHJvb3ROb2RlIERPTSBlbGVtZW50IHJlcHJlc2VudGluZyB0aGUgY29tcG9uZW50LlxuICAgKiBAb3B0aW9uYWxcbiAgICovXG4gIGNvbXBvbmVudERpZFVwZGF0ZTogU3BlY1BvbGljeS5ERUZJTkVfTUFOWSxcblxuICAvKipcbiAgICogSW52b2tlZCB3aGVuIHRoZSBjb21wb25lbnQgaXMgYWJvdXQgdG8gYmUgcmVtb3ZlZCBmcm9tIGl0cyBwYXJlbnQgYW5kIGhhdmVcbiAgICogaXRzIERPTSByZXByZXNlbnRhdGlvbiBkZXN0cm95ZWQuXG4gICAqXG4gICAqIFVzZSB0aGlzIGFzIGFuIG9wcG9ydHVuaXR5IHRvIGRlYWxsb2NhdGUgYW55IGV4dGVybmFsIHJlc291cmNlcy5cbiAgICpcbiAgICogTk9URTogVGhlcmUgaXMgbm8gYGNvbXBvbmVudERpZFVubW91bnRgIHNpbmNlIHlvdXIgY29tcG9uZW50IHdpbGwgaGF2ZSBiZWVuXG4gICAqIGRlc3Ryb3llZCBieSB0aGF0IHBvaW50LlxuICAgKlxuICAgKiBAb3B0aW9uYWxcbiAgICovXG4gIGNvbXBvbmVudFdpbGxVbm1vdW50OiBTcGVjUG9saWN5LkRFRklORV9NQU5ZLFxuXG4gIC8vID09PT0gQWR2YW5jZWQgbWV0aG9kcyA9PT09XG5cbiAgLyoqXG4gICAqIFVwZGF0ZXMgdGhlIGNvbXBvbmVudCdzIGN1cnJlbnRseSBtb3VudGVkIERPTSByZXByZXNlbnRhdGlvbi5cbiAgICpcbiAgICogQnkgZGVmYXVsdCwgdGhpcyBpbXBsZW1lbnRzIFJlYWN0J3MgcmVuZGVyaW5nIGFuZCByZWNvbmNpbGlhdGlvbiBhbGdvcml0aG0uXG4gICAqIFNvcGhpc3RpY2F0ZWQgY2xpZW50cyBtYXkgd2lzaCB0byBvdmVycmlkZSB0aGlzLlxuICAgKlxuICAgKiBAcGFyYW0ge1JlYWN0UmVjb25jaWxlVHJhbnNhY3Rpb259IHRyYW5zYWN0aW9uXG4gICAqIEBpbnRlcm5hbFxuICAgKiBAb3ZlcnJpZGFibGVcbiAgICovXG4gIHVwZGF0ZUNvbXBvbmVudDogU3BlY1BvbGljeS5PVkVSUklERV9CQVNFXG5cbn07XG5cbi8qKlxuICogTWFwcGluZyBmcm9tIGNsYXNzIHNwZWNpZmljYXRpb24ga2V5cyB0byBzcGVjaWFsIHByb2Nlc3NpbmcgZnVuY3Rpb25zLlxuICpcbiAqIEFsdGhvdWdoIHRoZXNlIGFyZSBkZWNsYXJlZCBsaWtlIGluc3RhbmNlIHByb3BlcnRpZXMgaW4gdGhlIHNwZWNpZmljYXRpb25cbiAqIHdoZW4gZGVmaW5pbmcgY2xhc3NlcyB1c2luZyBgUmVhY3QuY3JlYXRlQ2xhc3NgLCB0aGV5IGFyZSBhY3R1YWxseSBzdGF0aWNcbiAqIGFuZCBhcmUgYWNjZXNzaWJsZSBvbiB0aGUgY29uc3RydWN0b3IgaW5zdGVhZCBvZiB0aGUgcHJvdG90eXBlLiBEZXNwaXRlXG4gKiBiZWluZyBzdGF0aWMsIHRoZXkgbXVzdCBiZSBkZWZpbmVkIG91dHNpZGUgb2YgdGhlIFwic3RhdGljc1wiIGtleSB1bmRlclxuICogd2hpY2ggYWxsIG90aGVyIHN0YXRpYyBtZXRob2RzIGFyZSBkZWZpbmVkLlxuICovXG52YXIgUkVTRVJWRURfU1BFQ19LRVlTID0ge1xuICBkaXNwbGF5TmFtZTogZnVuY3Rpb24gKENvbnN0cnVjdG9yLCBkaXNwbGF5TmFtZSkge1xuICAgIENvbnN0cnVjdG9yLmRpc3BsYXlOYW1lID0gZGlzcGxheU5hbWU7XG4gIH0sXG4gIG1peGluczogZnVuY3Rpb24gKENvbnN0cnVjdG9yLCBtaXhpbnMpIHtcbiAgICBpZiAobWl4aW5zKSB7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG1peGlucy5sZW5ndGg7IGkrKykge1xuICAgICAgICBtaXhTcGVjSW50b0NvbXBvbmVudChDb25zdHJ1Y3RvciwgbWl4aW5zW2ldKTtcbiAgICAgIH1cbiAgICB9XG4gIH0sXG4gIGNoaWxkQ29udGV4dFR5cGVzOiBmdW5jdGlvbiAoQ29uc3RydWN0b3IsIGNoaWxkQ29udGV4dFR5cGVzKSB7XG4gICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICAgIHZhbGlkYXRlVHlwZURlZihDb25zdHJ1Y3RvciwgY2hpbGRDb250ZXh0VHlwZXMsIFJlYWN0UHJvcFR5cGVMb2NhdGlvbnMuY2hpbGRDb250ZXh0KTtcbiAgICB9XG4gICAgQ29uc3RydWN0b3IuY2hpbGRDb250ZXh0VHlwZXMgPSBfYXNzaWduKHt9LCBDb25zdHJ1Y3Rvci5jaGlsZENvbnRleHRUeXBlcywgY2hpbGRDb250ZXh0VHlwZXMpO1xuICB9LFxuICBjb250ZXh0VHlwZXM6IGZ1bmN0aW9uIChDb25zdHJ1Y3RvciwgY29udGV4dFR5cGVzKSB7XG4gICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICAgIHZhbGlkYXRlVHlwZURlZihDb25zdHJ1Y3RvciwgY29udGV4dFR5cGVzLCBSZWFjdFByb3BUeXBlTG9jYXRpb25zLmNvbnRleHQpO1xuICAgIH1cbiAgICBDb25zdHJ1Y3Rvci5jb250ZXh0VHlwZXMgPSBfYXNzaWduKHt9LCBDb25zdHJ1Y3Rvci5jb250ZXh0VHlwZXMsIGNvbnRleHRUeXBlcyk7XG4gIH0sXG4gIC8qKlxuICAgKiBTcGVjaWFsIGNhc2UgZ2V0RGVmYXVsdFByb3BzIHdoaWNoIHNob3VsZCBtb3ZlIGludG8gc3RhdGljcyBidXQgcmVxdWlyZXNcbiAgICogYXV0b21hdGljIG1lcmdpbmcuXG4gICAqL1xuICBnZXREZWZhdWx0UHJvcHM6IGZ1bmN0aW9uIChDb25zdHJ1Y3RvciwgZ2V0RGVmYXVsdFByb3BzKSB7XG4gICAgaWYgKENvbnN0cnVjdG9yLmdldERlZmF1bHRQcm9wcykge1xuICAgICAgQ29uc3RydWN0b3IuZ2V0RGVmYXVsdFByb3BzID0gY3JlYXRlTWVyZ2VkUmVzdWx0RnVuY3Rpb24oQ29uc3RydWN0b3IuZ2V0RGVmYXVsdFByb3BzLCBnZXREZWZhdWx0UHJvcHMpO1xuICAgIH0gZWxzZSB7XG4gICAgICBDb25zdHJ1Y3Rvci5nZXREZWZhdWx0UHJvcHMgPSBnZXREZWZhdWx0UHJvcHM7XG4gICAgfVxuICB9LFxuICBwcm9wVHlwZXM6IGZ1bmN0aW9uIChDb25zdHJ1Y3RvciwgcHJvcFR5cGVzKSB7XG4gICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICAgIHZhbGlkYXRlVHlwZURlZihDb25zdHJ1Y3RvciwgcHJvcFR5cGVzLCBSZWFjdFByb3BUeXBlTG9jYXRpb25zLnByb3ApO1xuICAgIH1cbiAgICBDb25zdHJ1Y3Rvci5wcm9wVHlwZXMgPSBfYXNzaWduKHt9LCBDb25zdHJ1Y3Rvci5wcm9wVHlwZXMsIHByb3BUeXBlcyk7XG4gIH0sXG4gIHN0YXRpY3M6IGZ1bmN0aW9uIChDb25zdHJ1Y3Rvciwgc3RhdGljcykge1xuICAgIG1peFN0YXRpY1NwZWNJbnRvQ29tcG9uZW50KENvbnN0cnVjdG9yLCBzdGF0aWNzKTtcbiAgfSxcbiAgYXV0b2JpbmQ6IGZ1bmN0aW9uICgpIHt9IH07XG5cbi8vIG5vb3BcbmZ1bmN0aW9uIHZhbGlkYXRlVHlwZURlZihDb25zdHJ1Y3RvciwgdHlwZURlZiwgbG9jYXRpb24pIHtcbiAgZm9yICh2YXIgcHJvcE5hbWUgaW4gdHlwZURlZikge1xuICAgIGlmICh0eXBlRGVmLmhhc093blByb3BlcnR5KHByb3BOYW1lKSkge1xuICAgICAgLy8gdXNlIGEgd2FybmluZyBpbnN0ZWFkIG9mIGFuIGludmFyaWFudCBzbyBjb21wb25lbnRzXG4gICAgICAvLyBkb24ndCBzaG93IHVwIGluIHByb2QgYnV0IG9ubHkgaW4gX19ERVZfX1xuICAgICAgcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyA/IHdhcm5pbmcodHlwZW9mIHR5cGVEZWZbcHJvcE5hbWVdID09PSAnZnVuY3Rpb24nLCAnJXM6ICVzIHR5cGUgYCVzYCBpcyBpbnZhbGlkOyBpdCBtdXN0IGJlIGEgZnVuY3Rpb24sIHVzdWFsbHkgZnJvbSAnICsgJ1JlYWN0LlByb3BUeXBlcy4nLCBDb25zdHJ1Y3Rvci5kaXNwbGF5TmFtZSB8fCAnUmVhY3RDbGFzcycsIFJlYWN0UHJvcFR5cGVMb2NhdGlvbk5hbWVzW2xvY2F0aW9uXSwgcHJvcE5hbWUpIDogdm9pZCAwO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiB2YWxpZGF0ZU1ldGhvZE92ZXJyaWRlKGlzQWxyZWFkeURlZmluZWQsIG5hbWUpIHtcbiAgdmFyIHNwZWNQb2xpY3kgPSBSZWFjdENsYXNzSW50ZXJmYWNlLmhhc093blByb3BlcnR5KG5hbWUpID8gUmVhY3RDbGFzc0ludGVyZmFjZVtuYW1lXSA6IG51bGw7XG5cbiAgLy8gRGlzYWxsb3cgb3ZlcnJpZGluZyBvZiBiYXNlIGNsYXNzIG1ldGhvZHMgdW5sZXNzIGV4cGxpY2l0bHkgYWxsb3dlZC5cbiAgaWYgKFJlYWN0Q2xhc3NNaXhpbi5oYXNPd25Qcm9wZXJ0eShuYW1lKSkge1xuICAgICEoc3BlY1BvbGljeSA9PT0gU3BlY1BvbGljeS5PVkVSUklERV9CQVNFKSA/IHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgPyBpbnZhcmlhbnQoZmFsc2UsICdSZWFjdENsYXNzSW50ZXJmYWNlOiBZb3UgYXJlIGF0dGVtcHRpbmcgdG8gb3ZlcnJpZGUgYCVzYCBmcm9tIHlvdXIgY2xhc3Mgc3BlY2lmaWNhdGlvbi4gRW5zdXJlIHRoYXQgeW91ciBtZXRob2QgbmFtZXMgZG8gbm90IG92ZXJsYXAgd2l0aCBSZWFjdCBtZXRob2RzLicsIG5hbWUpIDogX3Byb2RJbnZhcmlhbnQoJzczJywgbmFtZSkgOiB2b2lkIDA7XG4gIH1cblxuICAvLyBEaXNhbGxvdyBkZWZpbmluZyBtZXRob2RzIG1vcmUgdGhhbiBvbmNlIHVubGVzcyBleHBsaWNpdGx5IGFsbG93ZWQuXG4gIGlmIChpc0FscmVhZHlEZWZpbmVkKSB7XG4gICAgIShzcGVjUG9saWN5ID09PSBTcGVjUG9saWN5LkRFRklORV9NQU5ZIHx8IHNwZWNQb2xpY3kgPT09IFNwZWNQb2xpY3kuREVGSU5FX01BTllfTUVSR0VEKSA/IHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgPyBpbnZhcmlhbnQoZmFsc2UsICdSZWFjdENsYXNzSW50ZXJmYWNlOiBZb3UgYXJlIGF0dGVtcHRpbmcgdG8gZGVmaW5lIGAlc2Agb24geW91ciBjb21wb25lbnQgbW9yZSB0aGFuIG9uY2UuIFRoaXMgY29uZmxpY3QgbWF5IGJlIGR1ZSB0byBhIG1peGluLicsIG5hbWUpIDogX3Byb2RJbnZhcmlhbnQoJzc0JywgbmFtZSkgOiB2b2lkIDA7XG4gIH1cbn1cblxuLyoqXG4gKiBNaXhpbiBoZWxwZXIgd2hpY2ggaGFuZGxlcyBwb2xpY3kgdmFsaWRhdGlvbiBhbmQgcmVzZXJ2ZWRcbiAqIHNwZWNpZmljYXRpb24ga2V5cyB3aGVuIGJ1aWxkaW5nIFJlYWN0IGNsYXNzZXMuXG4gKi9cbmZ1bmN0aW9uIG1peFNwZWNJbnRvQ29tcG9uZW50KENvbnN0cnVjdG9yLCBzcGVjKSB7XG4gIGlmICghc3BlYykge1xuICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgICB2YXIgdHlwZW9mU3BlYyA9IHR5cGVvZiBzcGVjO1xuICAgICAgdmFyIGlzTWl4aW5WYWxpZCA9IHR5cGVvZlNwZWMgPT09ICdvYmplY3QnICYmIHNwZWMgIT09IG51bGw7XG5cbiAgICAgIHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgPyB3YXJuaW5nKGlzTWl4aW5WYWxpZCwgJyVzOiBZb3VcXCdyZSBhdHRlbXB0aW5nIHRvIGluY2x1ZGUgYSBtaXhpbiB0aGF0IGlzIGVpdGhlciBudWxsICcgKyAnb3Igbm90IGFuIG9iamVjdC4gQ2hlY2sgdGhlIG1peGlucyBpbmNsdWRlZCBieSB0aGUgY29tcG9uZW50LCAnICsgJ2FzIHdlbGwgYXMgYW55IG1peGlucyB0aGV5IGluY2x1ZGUgdGhlbXNlbHZlcy4gJyArICdFeHBlY3RlZCBvYmplY3QgYnV0IGdvdCAlcy4nLCBDb25zdHJ1Y3Rvci5kaXNwbGF5TmFtZSB8fCAnUmVhY3RDbGFzcycsIHNwZWMgPT09IG51bGwgPyBudWxsIDogdHlwZW9mU3BlYykgOiB2b2lkIDA7XG4gICAgfVxuXG4gICAgcmV0dXJuO1xuICB9XG5cbiAgISh0eXBlb2Ygc3BlYyAhPT0gJ2Z1bmN0aW9uJykgPyBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nID8gaW52YXJpYW50KGZhbHNlLCAnUmVhY3RDbGFzczogWW91XFwncmUgYXR0ZW1wdGluZyB0byB1c2UgYSBjb21wb25lbnQgY2xhc3Mgb3IgZnVuY3Rpb24gYXMgYSBtaXhpbi4gSW5zdGVhZCwganVzdCB1c2UgYSByZWd1bGFyIG9iamVjdC4nKSA6IF9wcm9kSW52YXJpYW50KCc3NScpIDogdm9pZCAwO1xuICAhIVJlYWN0RWxlbWVudC5pc1ZhbGlkRWxlbWVudChzcGVjKSA/IHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgPyBpbnZhcmlhbnQoZmFsc2UsICdSZWFjdENsYXNzOiBZb3VcXCdyZSBhdHRlbXB0aW5nIHRvIHVzZSBhIGNvbXBvbmVudCBhcyBhIG1peGluLiBJbnN0ZWFkLCBqdXN0IHVzZSBhIHJlZ3VsYXIgb2JqZWN0LicpIDogX3Byb2RJbnZhcmlhbnQoJzc2JykgOiB2b2lkIDA7XG5cbiAgdmFyIHByb3RvID0gQ29uc3RydWN0b3IucHJvdG90eXBlO1xuICB2YXIgYXV0b0JpbmRQYWlycyA9IHByb3RvLl9fcmVhY3RBdXRvQmluZFBhaXJzO1xuXG4gIC8vIEJ5IGhhbmRsaW5nIG1peGlucyBiZWZvcmUgYW55IG90aGVyIHByb3BlcnRpZXMsIHdlIGVuc3VyZSB0aGUgc2FtZVxuICAvLyBjaGFpbmluZyBvcmRlciBpcyBhcHBsaWVkIHRvIG1ldGhvZHMgd2l0aCBERUZJTkVfTUFOWSBwb2xpY3ksIHdoZXRoZXJcbiAgLy8gbWl4aW5zIGFyZSBsaXN0ZWQgYmVmb3JlIG9yIGFmdGVyIHRoZXNlIG1ldGhvZHMgaW4gdGhlIHNwZWMuXG4gIGlmIChzcGVjLmhhc093blByb3BlcnR5KE1JWElOU19LRVkpKSB7XG4gICAgUkVTRVJWRURfU1BFQ19LRVlTLm1peGlucyhDb25zdHJ1Y3Rvciwgc3BlYy5taXhpbnMpO1xuICB9XG5cbiAgZm9yICh2YXIgbmFtZSBpbiBzcGVjKSB7XG4gICAgaWYgKCFzcGVjLmhhc093blByb3BlcnR5KG5hbWUpKSB7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICBpZiAobmFtZSA9PT0gTUlYSU5TX0tFWSkge1xuICAgICAgLy8gV2UgaGF2ZSBhbHJlYWR5IGhhbmRsZWQgbWl4aW5zIGluIGEgc3BlY2lhbCBjYXNlIGFib3ZlLlxuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgdmFyIHByb3BlcnR5ID0gc3BlY1tuYW1lXTtcbiAgICB2YXIgaXNBbHJlYWR5RGVmaW5lZCA9IHByb3RvLmhhc093blByb3BlcnR5KG5hbWUpO1xuICAgIHZhbGlkYXRlTWV0aG9kT3ZlcnJpZGUoaXNBbHJlYWR5RGVmaW5lZCwgbmFtZSk7XG5cbiAgICBpZiAoUkVTRVJWRURfU1BFQ19LRVlTLmhhc093blByb3BlcnR5KG5hbWUpKSB7XG4gICAgICBSRVNFUlZFRF9TUEVDX0tFWVNbbmFtZV0oQ29uc3RydWN0b3IsIHByb3BlcnR5KTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gU2V0dXAgbWV0aG9kcyBvbiBwcm90b3R5cGU6XG4gICAgICAvLyBUaGUgZm9sbG93aW5nIG1lbWJlciBtZXRob2RzIHNob3VsZCBub3QgYmUgYXV0b21hdGljYWxseSBib3VuZDpcbiAgICAgIC8vIDEuIEV4cGVjdGVkIFJlYWN0Q2xhc3MgbWV0aG9kcyAoaW4gdGhlIFwiaW50ZXJmYWNlXCIpLlxuICAgICAgLy8gMi4gT3ZlcnJpZGRlbiBtZXRob2RzICh0aGF0IHdlcmUgbWl4ZWQgaW4pLlxuICAgICAgdmFyIGlzUmVhY3RDbGFzc01ldGhvZCA9IFJlYWN0Q2xhc3NJbnRlcmZhY2UuaGFzT3duUHJvcGVydHkobmFtZSk7XG4gICAgICB2YXIgaXNGdW5jdGlvbiA9IHR5cGVvZiBwcm9wZXJ0eSA9PT0gJ2Z1bmN0aW9uJztcbiAgICAgIHZhciBzaG91bGRBdXRvQmluZCA9IGlzRnVuY3Rpb24gJiYgIWlzUmVhY3RDbGFzc01ldGhvZCAmJiAhaXNBbHJlYWR5RGVmaW5lZCAmJiBzcGVjLmF1dG9iaW5kICE9PSBmYWxzZTtcblxuICAgICAgaWYgKHNob3VsZEF1dG9CaW5kKSB7XG4gICAgICAgIGF1dG9CaW5kUGFpcnMucHVzaChuYW1lLCBwcm9wZXJ0eSk7XG4gICAgICAgIHByb3RvW25hbWVdID0gcHJvcGVydHk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoaXNBbHJlYWR5RGVmaW5lZCkge1xuICAgICAgICAgIHZhciBzcGVjUG9saWN5ID0gUmVhY3RDbGFzc0ludGVyZmFjZVtuYW1lXTtcblxuICAgICAgICAgIC8vIFRoZXNlIGNhc2VzIHNob3VsZCBhbHJlYWR5IGJlIGNhdWdodCBieSB2YWxpZGF0ZU1ldGhvZE92ZXJyaWRlLlxuICAgICAgICAgICEoaXNSZWFjdENsYXNzTWV0aG9kICYmIChzcGVjUG9saWN5ID09PSBTcGVjUG9saWN5LkRFRklORV9NQU5ZX01FUkdFRCB8fCBzcGVjUG9saWN5ID09PSBTcGVjUG9saWN5LkRFRklORV9NQU5ZKSkgPyBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nID8gaW52YXJpYW50KGZhbHNlLCAnUmVhY3RDbGFzczogVW5leHBlY3RlZCBzcGVjIHBvbGljeSAlcyBmb3Iga2V5ICVzIHdoZW4gbWl4aW5nIGluIGNvbXBvbmVudCBzcGVjcy4nLCBzcGVjUG9saWN5LCBuYW1lKSA6IF9wcm9kSW52YXJpYW50KCc3NycsIHNwZWNQb2xpY3ksIG5hbWUpIDogdm9pZCAwO1xuXG4gICAgICAgICAgLy8gRm9yIG1ldGhvZHMgd2hpY2ggYXJlIGRlZmluZWQgbW9yZSB0aGFuIG9uY2UsIGNhbGwgdGhlIGV4aXN0aW5nXG4gICAgICAgICAgLy8gbWV0aG9kcyBiZWZvcmUgY2FsbGluZyB0aGUgbmV3IHByb3BlcnR5LCBtZXJnaW5nIGlmIGFwcHJvcHJpYXRlLlxuICAgICAgICAgIGlmIChzcGVjUG9saWN5ID09PSBTcGVjUG9saWN5LkRFRklORV9NQU5ZX01FUkdFRCkge1xuICAgICAgICAgICAgcHJvdG9bbmFtZV0gPSBjcmVhdGVNZXJnZWRSZXN1bHRGdW5jdGlvbihwcm90b1tuYW1lXSwgcHJvcGVydHkpO1xuICAgICAgICAgIH0gZWxzZSBpZiAoc3BlY1BvbGljeSA9PT0gU3BlY1BvbGljeS5ERUZJTkVfTUFOWSkge1xuICAgICAgICAgICAgcHJvdG9bbmFtZV0gPSBjcmVhdGVDaGFpbmVkRnVuY3Rpb24ocHJvdG9bbmFtZV0sIHByb3BlcnR5KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcHJvdG9bbmFtZV0gPSBwcm9wZXJ0eTtcbiAgICAgICAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgICAgICAgICAgLy8gQWRkIHZlcmJvc2UgZGlzcGxheU5hbWUgdG8gdGhlIGZ1bmN0aW9uLCB3aGljaCBoZWxwcyB3aGVuIGxvb2tpbmdcbiAgICAgICAgICAgIC8vIGF0IHByb2ZpbGluZyB0b29scy5cbiAgICAgICAgICAgIGlmICh0eXBlb2YgcHJvcGVydHkgPT09ICdmdW5jdGlvbicgJiYgc3BlYy5kaXNwbGF5TmFtZSkge1xuICAgICAgICAgICAgICBwcm90b1tuYW1lXS5kaXNwbGF5TmFtZSA9IHNwZWMuZGlzcGxheU5hbWUgKyAnXycgKyBuYW1lO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBtaXhTdGF0aWNTcGVjSW50b0NvbXBvbmVudChDb25zdHJ1Y3Rvciwgc3RhdGljcykge1xuICBpZiAoIXN0YXRpY3MpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgZm9yICh2YXIgbmFtZSBpbiBzdGF0aWNzKSB7XG4gICAgdmFyIHByb3BlcnR5ID0gc3RhdGljc1tuYW1lXTtcbiAgICBpZiAoIXN0YXRpY3MuaGFzT3duUHJvcGVydHkobmFtZSkpIHtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIHZhciBpc1Jlc2VydmVkID0gbmFtZSBpbiBSRVNFUlZFRF9TUEVDX0tFWVM7XG4gICAgISFpc1Jlc2VydmVkID8gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyA/IGludmFyaWFudChmYWxzZSwgJ1JlYWN0Q2xhc3M6IFlvdSBhcmUgYXR0ZW1wdGluZyB0byBkZWZpbmUgYSByZXNlcnZlZCBwcm9wZXJ0eSwgYCVzYCwgdGhhdCBzaG91bGRuXFwndCBiZSBvbiB0aGUgXCJzdGF0aWNzXCIga2V5LiBEZWZpbmUgaXQgYXMgYW4gaW5zdGFuY2UgcHJvcGVydHkgaW5zdGVhZDsgaXQgd2lsbCBzdGlsbCBiZSBhY2Nlc3NpYmxlIG9uIHRoZSBjb25zdHJ1Y3Rvci4nLCBuYW1lKSA6IF9wcm9kSW52YXJpYW50KCc3OCcsIG5hbWUpIDogdm9pZCAwO1xuXG4gICAgdmFyIGlzSW5oZXJpdGVkID0gbmFtZSBpbiBDb25zdHJ1Y3RvcjtcbiAgICAhIWlzSW5oZXJpdGVkID8gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyA/IGludmFyaWFudChmYWxzZSwgJ1JlYWN0Q2xhc3M6IFlvdSBhcmUgYXR0ZW1wdGluZyB0byBkZWZpbmUgYCVzYCBvbiB5b3VyIGNvbXBvbmVudCBtb3JlIHRoYW4gb25jZS4gVGhpcyBjb25mbGljdCBtYXkgYmUgZHVlIHRvIGEgbWl4aW4uJywgbmFtZSkgOiBfcHJvZEludmFyaWFudCgnNzknLCBuYW1lKSA6IHZvaWQgMDtcbiAgICBDb25zdHJ1Y3RvcltuYW1lXSA9IHByb3BlcnR5O1xuICB9XG59XG5cbi8qKlxuICogTWVyZ2UgdHdvIG9iamVjdHMsIGJ1dCB0aHJvdyBpZiBib3RoIGNvbnRhaW4gdGhlIHNhbWUga2V5LlxuICpcbiAqIEBwYXJhbSB7b2JqZWN0fSBvbmUgVGhlIGZpcnN0IG9iamVjdCwgd2hpY2ggaXMgbXV0YXRlZC5cbiAqIEBwYXJhbSB7b2JqZWN0fSB0d28gVGhlIHNlY29uZCBvYmplY3RcbiAqIEByZXR1cm4ge29iamVjdH0gb25lIGFmdGVyIGl0IGhhcyBiZWVuIG11dGF0ZWQgdG8gY29udGFpbiBldmVyeXRoaW5nIGluIHR3by5cbiAqL1xuZnVuY3Rpb24gbWVyZ2VJbnRvV2l0aE5vRHVwbGljYXRlS2V5cyhvbmUsIHR3bykge1xuICAhKG9uZSAmJiB0d28gJiYgdHlwZW9mIG9uZSA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIHR3byA9PT0gJ29iamVjdCcpID8gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyA/IGludmFyaWFudChmYWxzZSwgJ21lcmdlSW50b1dpdGhOb0R1cGxpY2F0ZUtleXMoKTogQ2Fubm90IG1lcmdlIG5vbi1vYmplY3RzLicpIDogX3Byb2RJbnZhcmlhbnQoJzgwJykgOiB2b2lkIDA7XG5cbiAgZm9yICh2YXIga2V5IGluIHR3bykge1xuICAgIGlmICh0d28uaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgIShvbmVba2V5XSA9PT0gdW5kZWZpbmVkKSA/IHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgPyBpbnZhcmlhbnQoZmFsc2UsICdtZXJnZUludG9XaXRoTm9EdXBsaWNhdGVLZXlzKCk6IFRyaWVkIHRvIG1lcmdlIHR3byBvYmplY3RzIHdpdGggdGhlIHNhbWUga2V5OiBgJXNgLiBUaGlzIGNvbmZsaWN0IG1heSBiZSBkdWUgdG8gYSBtaXhpbjsgaW4gcGFydGljdWxhciwgdGhpcyBtYXkgYmUgY2F1c2VkIGJ5IHR3byBnZXRJbml0aWFsU3RhdGUoKSBvciBnZXREZWZhdWx0UHJvcHMoKSBtZXRob2RzIHJldHVybmluZyBvYmplY3RzIHdpdGggY2xhc2hpbmcga2V5cy4nLCBrZXkpIDogX3Byb2RJbnZhcmlhbnQoJzgxJywga2V5KSA6IHZvaWQgMDtcbiAgICAgIG9uZVtrZXldID0gdHdvW2tleV07XG4gICAgfVxuICB9XG4gIHJldHVybiBvbmU7XG59XG5cbi8qKlxuICogQ3JlYXRlcyBhIGZ1bmN0aW9uIHRoYXQgaW52b2tlcyB0d28gZnVuY3Rpb25zIGFuZCBtZXJnZXMgdGhlaXIgcmV0dXJuIHZhbHVlcy5cbiAqXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBvbmUgRnVuY3Rpb24gdG8gaW52b2tlIGZpcnN0LlxuICogQHBhcmFtIHtmdW5jdGlvbn0gdHdvIEZ1bmN0aW9uIHRvIGludm9rZSBzZWNvbmQuXG4gKiBAcmV0dXJuIHtmdW5jdGlvbn0gRnVuY3Rpb24gdGhhdCBpbnZva2VzIHRoZSB0d28gYXJndW1lbnQgZnVuY3Rpb25zLlxuICogQHByaXZhdGVcbiAqL1xuZnVuY3Rpb24gY3JlYXRlTWVyZ2VkUmVzdWx0RnVuY3Rpb24ob25lLCB0d28pIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIG1lcmdlZFJlc3VsdCgpIHtcbiAgICB2YXIgYSA9IG9uZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIHZhciBiID0gdHdvLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgaWYgKGEgPT0gbnVsbCkge1xuICAgICAgcmV0dXJuIGI7XG4gICAgfSBlbHNlIGlmIChiID09IG51bGwpIHtcbiAgICAgIHJldHVybiBhO1xuICAgIH1cbiAgICB2YXIgYyA9IHt9O1xuICAgIG1lcmdlSW50b1dpdGhOb0R1cGxpY2F0ZUtleXMoYywgYSk7XG4gICAgbWVyZ2VJbnRvV2l0aE5vRHVwbGljYXRlS2V5cyhjLCBiKTtcbiAgICByZXR1cm4gYztcbiAgfTtcbn1cblxuLyoqXG4gKiBDcmVhdGVzIGEgZnVuY3Rpb24gdGhhdCBpbnZva2VzIHR3byBmdW5jdGlvbnMgYW5kIGlnbm9yZXMgdGhlaXIgcmV0dXJuIHZhbGVzLlxuICpcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IG9uZSBGdW5jdGlvbiB0byBpbnZva2UgZmlyc3QuXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSB0d28gRnVuY3Rpb24gdG8gaW52b2tlIHNlY29uZC5cbiAqIEByZXR1cm4ge2Z1bmN0aW9ufSBGdW5jdGlvbiB0aGF0IGludm9rZXMgdGhlIHR3byBhcmd1bWVudCBmdW5jdGlvbnMuXG4gKiBAcHJpdmF0ZVxuICovXG5mdW5jdGlvbiBjcmVhdGVDaGFpbmVkRnVuY3Rpb24ob25lLCB0d28pIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIGNoYWluZWRGdW5jdGlvbigpIHtcbiAgICBvbmUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB0d28uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfTtcbn1cblxuLyoqXG4gKiBCaW5kcyBhIG1ldGhvZCB0byB0aGUgY29tcG9uZW50LlxuICpcbiAqIEBwYXJhbSB7b2JqZWN0fSBjb21wb25lbnQgQ29tcG9uZW50IHdob3NlIG1ldGhvZCBpcyBnb2luZyB0byBiZSBib3VuZC5cbiAqIEBwYXJhbSB7ZnVuY3Rpb259IG1ldGhvZCBNZXRob2QgdG8gYmUgYm91bmQuXG4gKiBAcmV0dXJuIHtmdW5jdGlvbn0gVGhlIGJvdW5kIG1ldGhvZC5cbiAqL1xuZnVuY3Rpb24gYmluZEF1dG9CaW5kTWV0aG9kKGNvbXBvbmVudCwgbWV0aG9kKSB7XG4gIHZhciBib3VuZE1ldGhvZCA9IG1ldGhvZC5iaW5kKGNvbXBvbmVudCk7XG4gIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgYm91bmRNZXRob2QuX19yZWFjdEJvdW5kQ29udGV4dCA9IGNvbXBvbmVudDtcbiAgICBib3VuZE1ldGhvZC5fX3JlYWN0Qm91bmRNZXRob2QgPSBtZXRob2Q7XG4gICAgYm91bmRNZXRob2QuX19yZWFjdEJvdW5kQXJndW1lbnRzID0gbnVsbDtcbiAgICB2YXIgY29tcG9uZW50TmFtZSA9IGNvbXBvbmVudC5jb25zdHJ1Y3Rvci5kaXNwbGF5TmFtZTtcbiAgICB2YXIgX2JpbmQgPSBib3VuZE1ldGhvZC5iaW5kO1xuICAgIGJvdW5kTWV0aG9kLmJpbmQgPSBmdW5jdGlvbiAobmV3VGhpcykge1xuICAgICAgZm9yICh2YXIgX2xlbiA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBBcnJheShfbGVuID4gMSA/IF9sZW4gLSAxIDogMCksIF9rZXkgPSAxOyBfa2V5IDwgX2xlbjsgX2tleSsrKSB7XG4gICAgICAgIGFyZ3NbX2tleSAtIDFdID0gYXJndW1lbnRzW19rZXldO1xuICAgICAgfVxuXG4gICAgICAvLyBVc2VyIGlzIHRyeWluZyB0byBiaW5kKCkgYW4gYXV0b2JvdW5kIG1ldGhvZDsgd2UgZWZmZWN0aXZlbHkgd2lsbFxuICAgICAgLy8gaWdub3JlIHRoZSB2YWx1ZSBvZiBcInRoaXNcIiB0aGF0IHRoZSB1c2VyIGlzIHRyeWluZyB0byB1c2UsIHNvXG4gICAgICAvLyBsZXQncyB3YXJuLlxuICAgICAgaWYgKG5ld1RoaXMgIT09IGNvbXBvbmVudCAmJiBuZXdUaGlzICE9PSBudWxsKSB7XG4gICAgICAgIHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgPyB3YXJuaW5nKGZhbHNlLCAnYmluZCgpOiBSZWFjdCBjb21wb25lbnQgbWV0aG9kcyBtYXkgb25seSBiZSBib3VuZCB0byB0aGUgJyArICdjb21wb25lbnQgaW5zdGFuY2UuIFNlZSAlcycsIGNvbXBvbmVudE5hbWUpIDogdm9pZCAwO1xuICAgICAgfSBlbHNlIGlmICghYXJncy5sZW5ndGgpIHtcbiAgICAgICAgcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyA/IHdhcm5pbmcoZmFsc2UsICdiaW5kKCk6IFlvdSBhcmUgYmluZGluZyBhIGNvbXBvbmVudCBtZXRob2QgdG8gdGhlIGNvbXBvbmVudC4gJyArICdSZWFjdCBkb2VzIHRoaXMgZm9yIHlvdSBhdXRvbWF0aWNhbGx5IGluIGEgaGlnaC1wZXJmb3JtYW5jZSAnICsgJ3dheSwgc28geW91IGNhbiBzYWZlbHkgcmVtb3ZlIHRoaXMgY2FsbC4gU2VlICVzJywgY29tcG9uZW50TmFtZSkgOiB2b2lkIDA7XG4gICAgICAgIHJldHVybiBib3VuZE1ldGhvZDtcbiAgICAgIH1cbiAgICAgIHZhciByZWJvdW5kTWV0aG9kID0gX2JpbmQuYXBwbHkoYm91bmRNZXRob2QsIGFyZ3VtZW50cyk7XG4gICAgICByZWJvdW5kTWV0aG9kLl9fcmVhY3RCb3VuZENvbnRleHQgPSBjb21wb25lbnQ7XG4gICAgICByZWJvdW5kTWV0aG9kLl9fcmVhY3RCb3VuZE1ldGhvZCA9IG1ldGhvZDtcbiAgICAgIHJlYm91bmRNZXRob2QuX19yZWFjdEJvdW5kQXJndW1lbnRzID0gYXJncztcbiAgICAgIHJldHVybiByZWJvdW5kTWV0aG9kO1xuICAgIH07XG4gIH1cbiAgcmV0dXJuIGJvdW5kTWV0aG9kO1xufVxuXG4vKipcbiAqIEJpbmRzIGFsbCBhdXRvLWJvdW5kIG1ldGhvZHMgaW4gYSBjb21wb25lbnQuXG4gKlxuICogQHBhcmFtIHtvYmplY3R9IGNvbXBvbmVudCBDb21wb25lbnQgd2hvc2UgbWV0aG9kIGlzIGdvaW5nIHRvIGJlIGJvdW5kLlxuICovXG5mdW5jdGlvbiBiaW5kQXV0b0JpbmRNZXRob2RzKGNvbXBvbmVudCkge1xuICB2YXIgcGFpcnMgPSBjb21wb25lbnQuX19yZWFjdEF1dG9CaW5kUGFpcnM7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgcGFpcnMubGVuZ3RoOyBpICs9IDIpIHtcbiAgICB2YXIgYXV0b0JpbmRLZXkgPSBwYWlyc1tpXTtcbiAgICB2YXIgbWV0aG9kID0gcGFpcnNbaSArIDFdO1xuICAgIGNvbXBvbmVudFthdXRvQmluZEtleV0gPSBiaW5kQXV0b0JpbmRNZXRob2QoY29tcG9uZW50LCBtZXRob2QpO1xuICB9XG59XG5cbi8qKlxuICogQWRkIG1vcmUgdG8gdGhlIFJlYWN0Q2xhc3MgYmFzZSBjbGFzcy4gVGhlc2UgYXJlIGFsbCBsZWdhY3kgZmVhdHVyZXMgYW5kXG4gKiB0aGVyZWZvcmUgbm90IGFscmVhZHkgcGFydCBvZiB0aGUgbW9kZXJuIFJlYWN0Q29tcG9uZW50LlxuICovXG52YXIgUmVhY3RDbGFzc01peGluID0ge1xuXG4gIC8qKlxuICAgKiBUT0RPOiBUaGlzIHdpbGwgYmUgZGVwcmVjYXRlZCBiZWNhdXNlIHN0YXRlIHNob3VsZCBhbHdheXMga2VlcCBhIGNvbnNpc3RlbnRcbiAgICogdHlwZSBzaWduYXR1cmUgYW5kIHRoZSBvbmx5IHVzZSBjYXNlIGZvciB0aGlzLCBpcyB0byBhdm9pZCB0aGF0LlxuICAgKi9cbiAgcmVwbGFjZVN0YXRlOiBmdW5jdGlvbiAobmV3U3RhdGUsIGNhbGxiYWNrKSB7XG4gICAgdGhpcy51cGRhdGVyLmVucXVldWVSZXBsYWNlU3RhdGUodGhpcywgbmV3U3RhdGUpO1xuICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgdGhpcy51cGRhdGVyLmVucXVldWVDYWxsYmFjayh0aGlzLCBjYWxsYmFjaywgJ3JlcGxhY2VTdGF0ZScpO1xuICAgIH1cbiAgfSxcblxuICAvKipcbiAgICogQ2hlY2tzIHdoZXRoZXIgb3Igbm90IHRoaXMgY29tcG9zaXRlIGNvbXBvbmVudCBpcyBtb3VudGVkLlxuICAgKiBAcmV0dXJuIHtib29sZWFufSBUcnVlIGlmIG1vdW50ZWQsIGZhbHNlIG90aGVyd2lzZS5cbiAgICogQHByb3RlY3RlZFxuICAgKiBAZmluYWxcbiAgICovXG4gIGlzTW91bnRlZDogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLnVwZGF0ZXIuaXNNb3VudGVkKHRoaXMpO1xuICB9XG59O1xuXG52YXIgUmVhY3RDbGFzc0NvbXBvbmVudCA9IGZ1bmN0aW9uICgpIHt9O1xuX2Fzc2lnbihSZWFjdENsYXNzQ29tcG9uZW50LnByb3RvdHlwZSwgUmVhY3RDb21wb25lbnQucHJvdG90eXBlLCBSZWFjdENsYXNzTWl4aW4pO1xuXG4vKipcbiAqIE1vZHVsZSBmb3IgY3JlYXRpbmcgY29tcG9zaXRlIGNvbXBvbmVudHMuXG4gKlxuICogQGNsYXNzIFJlYWN0Q2xhc3NcbiAqL1xudmFyIFJlYWN0Q2xhc3MgPSB7XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBjb21wb3NpdGUgY29tcG9uZW50IGNsYXNzIGdpdmVuIGEgY2xhc3Mgc3BlY2lmaWNhdGlvbi5cbiAgICogU2VlIGh0dHBzOi8vZmFjZWJvb2suZ2l0aHViLmlvL3JlYWN0L2RvY3MvdG9wLWxldmVsLWFwaS5odG1sI3JlYWN0LmNyZWF0ZWNsYXNzXG4gICAqXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBzcGVjIENsYXNzIHNwZWNpZmljYXRpb24gKHdoaWNoIG11c3QgZGVmaW5lIGByZW5kZXJgKS5cbiAgICogQHJldHVybiB7ZnVuY3Rpb259IENvbXBvbmVudCBjb25zdHJ1Y3RvciBmdW5jdGlvbi5cbiAgICogQHB1YmxpY1xuICAgKi9cbiAgY3JlYXRlQ2xhc3M6IGZ1bmN0aW9uIChzcGVjKSB7XG4gICAgdmFyIENvbnN0cnVjdG9yID0gZnVuY3Rpb24gKHByb3BzLCBjb250ZXh0LCB1cGRhdGVyKSB7XG4gICAgICAvLyBUaGlzIGNvbnN0cnVjdG9yIGdldHMgb3ZlcnJpZGRlbiBieSBtb2Nrcy4gVGhlIGFyZ3VtZW50IGlzIHVzZWRcbiAgICAgIC8vIGJ5IG1vY2tzIHRvIGFzc2VydCBvbiB3aGF0IGdldHMgbW91bnRlZC5cblxuICAgICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICAgICAgcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyA/IHdhcm5pbmcodGhpcyBpbnN0YW5jZW9mIENvbnN0cnVjdG9yLCAnU29tZXRoaW5nIGlzIGNhbGxpbmcgYSBSZWFjdCBjb21wb25lbnQgZGlyZWN0bHkuIFVzZSBhIGZhY3Rvcnkgb3IgJyArICdKU1ggaW5zdGVhZC4gU2VlOiBodHRwczovL2ZiLm1lL3JlYWN0LWxlZ2FjeWZhY3RvcnknKSA6IHZvaWQgMDtcbiAgICAgIH1cblxuICAgICAgLy8gV2lyZSB1cCBhdXRvLWJpbmRpbmdcbiAgICAgIGlmICh0aGlzLl9fcmVhY3RBdXRvQmluZFBhaXJzLmxlbmd0aCkge1xuICAgICAgICBiaW5kQXV0b0JpbmRNZXRob2RzKHRoaXMpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLnByb3BzID0gcHJvcHM7XG4gICAgICB0aGlzLmNvbnRleHQgPSBjb250ZXh0O1xuICAgICAgdGhpcy5yZWZzID0gZW1wdHlPYmplY3Q7XG4gICAgICB0aGlzLnVwZGF0ZXIgPSB1cGRhdGVyIHx8IFJlYWN0Tm9vcFVwZGF0ZVF1ZXVlO1xuXG4gICAgICB0aGlzLnN0YXRlID0gbnVsbDtcblxuICAgICAgLy8gUmVhY3RDbGFzc2VzIGRvZXNuJ3QgaGF2ZSBjb25zdHJ1Y3RvcnMuIEluc3RlYWQsIHRoZXkgdXNlIHRoZVxuICAgICAgLy8gZ2V0SW5pdGlhbFN0YXRlIGFuZCBjb21wb25lbnRXaWxsTW91bnQgbWV0aG9kcyBmb3IgaW5pdGlhbGl6YXRpb24uXG5cbiAgICAgIHZhciBpbml0aWFsU3RhdGUgPSB0aGlzLmdldEluaXRpYWxTdGF0ZSA/IHRoaXMuZ2V0SW5pdGlhbFN0YXRlKCkgOiBudWxsO1xuICAgICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICAgICAgLy8gV2UgYWxsb3cgYXV0by1tb2NrcyB0byBwcm9jZWVkIGFzIGlmIHRoZXkncmUgcmV0dXJuaW5nIG51bGwuXG4gICAgICAgIGlmIChpbml0aWFsU3RhdGUgPT09IHVuZGVmaW5lZCAmJiB0aGlzLmdldEluaXRpYWxTdGF0ZS5faXNNb2NrRnVuY3Rpb24pIHtcbiAgICAgICAgICAvLyBUaGlzIGlzIHByb2JhYmx5IGJhZCBwcmFjdGljZS4gQ29uc2lkZXIgd2FybmluZyBoZXJlIGFuZFxuICAgICAgICAgIC8vIGRlcHJlY2F0aW5nIHRoaXMgY29udmVuaWVuY2UuXG4gICAgICAgICAgaW5pdGlhbFN0YXRlID0gbnVsbDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgISh0eXBlb2YgaW5pdGlhbFN0YXRlID09PSAnb2JqZWN0JyAmJiAhQXJyYXkuaXNBcnJheShpbml0aWFsU3RhdGUpKSA/IHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgPyBpbnZhcmlhbnQoZmFsc2UsICclcy5nZXRJbml0aWFsU3RhdGUoKTogbXVzdCByZXR1cm4gYW4gb2JqZWN0IG9yIG51bGwnLCBDb25zdHJ1Y3Rvci5kaXNwbGF5TmFtZSB8fCAnUmVhY3RDb21wb3NpdGVDb21wb25lbnQnKSA6IF9wcm9kSW52YXJpYW50KCc4MicsIENvbnN0cnVjdG9yLmRpc3BsYXlOYW1lIHx8ICdSZWFjdENvbXBvc2l0ZUNvbXBvbmVudCcpIDogdm9pZCAwO1xuXG4gICAgICB0aGlzLnN0YXRlID0gaW5pdGlhbFN0YXRlO1xuICAgIH07XG4gICAgQ29uc3RydWN0b3IucHJvdG90eXBlID0gbmV3IFJlYWN0Q2xhc3NDb21wb25lbnQoKTtcbiAgICBDb25zdHJ1Y3Rvci5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBDb25zdHJ1Y3RvcjtcbiAgICBDb25zdHJ1Y3Rvci5wcm90b3R5cGUuX19yZWFjdEF1dG9CaW5kUGFpcnMgPSBbXTtcblxuICAgIGluamVjdGVkTWl4aW5zLmZvckVhY2gobWl4U3BlY0ludG9Db21wb25lbnQuYmluZChudWxsLCBDb25zdHJ1Y3RvcikpO1xuXG4gICAgbWl4U3BlY0ludG9Db21wb25lbnQoQ29uc3RydWN0b3IsIHNwZWMpO1xuXG4gICAgLy8gSW5pdGlhbGl6ZSB0aGUgZGVmYXVsdFByb3BzIHByb3BlcnR5IGFmdGVyIGFsbCBtaXhpbnMgaGF2ZSBiZWVuIG1lcmdlZC5cbiAgICBpZiAoQ29uc3RydWN0b3IuZ2V0RGVmYXVsdFByb3BzKSB7XG4gICAgICBDb25zdHJ1Y3Rvci5kZWZhdWx0UHJvcHMgPSBDb25zdHJ1Y3Rvci5nZXREZWZhdWx0UHJvcHMoKTtcbiAgICB9XG5cbiAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgICAgLy8gVGhpcyBpcyBhIHRhZyB0byBpbmRpY2F0ZSB0aGF0IHRoZSB1c2Ugb2YgdGhlc2UgbWV0aG9kIG5hbWVzIGlzIG9rLFxuICAgICAgLy8gc2luY2UgaXQncyB1c2VkIHdpdGggY3JlYXRlQ2xhc3MuIElmIGl0J3Mgbm90LCB0aGVuIGl0J3MgbGlrZWx5IGFcbiAgICAgIC8vIG1pc3Rha2Ugc28gd2UnbGwgd2FybiB5b3UgdG8gdXNlIHRoZSBzdGF0aWMgcHJvcGVydHksIHByb3BlcnR5XG4gICAgICAvLyBpbml0aWFsaXplciBvciBjb25zdHJ1Y3RvciByZXNwZWN0aXZlbHkuXG4gICAgICBpZiAoQ29uc3RydWN0b3IuZ2V0RGVmYXVsdFByb3BzKSB7XG4gICAgICAgIENvbnN0cnVjdG9yLmdldERlZmF1bHRQcm9wcy5pc1JlYWN0Q2xhc3NBcHByb3ZlZCA9IHt9O1xuICAgICAgfVxuICAgICAgaWYgKENvbnN0cnVjdG9yLnByb3RvdHlwZS5nZXRJbml0aWFsU3RhdGUpIHtcbiAgICAgICAgQ29uc3RydWN0b3IucHJvdG90eXBlLmdldEluaXRpYWxTdGF0ZS5pc1JlYWN0Q2xhc3NBcHByb3ZlZCA9IHt9O1xuICAgICAgfVxuICAgIH1cblxuICAgICFDb25zdHJ1Y3Rvci5wcm90b3R5cGUucmVuZGVyID8gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyA/IGludmFyaWFudChmYWxzZSwgJ2NyZWF0ZUNsYXNzKC4uLik6IENsYXNzIHNwZWNpZmljYXRpb24gbXVzdCBpbXBsZW1lbnQgYSBgcmVuZGVyYCBtZXRob2QuJykgOiBfcHJvZEludmFyaWFudCgnODMnKSA6IHZvaWQgMDtcblxuICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgICBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nID8gd2FybmluZyghQ29uc3RydWN0b3IucHJvdG90eXBlLmNvbXBvbmVudFNob3VsZFVwZGF0ZSwgJyVzIGhhcyBhIG1ldGhvZCBjYWxsZWQgJyArICdjb21wb25lbnRTaG91bGRVcGRhdGUoKS4gRGlkIHlvdSBtZWFuIHNob3VsZENvbXBvbmVudFVwZGF0ZSgpPyAnICsgJ1RoZSBuYW1lIGlzIHBocmFzZWQgYXMgYSBxdWVzdGlvbiBiZWNhdXNlIHRoZSBmdW5jdGlvbiBpcyAnICsgJ2V4cGVjdGVkIHRvIHJldHVybiBhIHZhbHVlLicsIHNwZWMuZGlzcGxheU5hbWUgfHwgJ0EgY29tcG9uZW50JykgOiB2b2lkIDA7XG4gICAgICBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nID8gd2FybmluZyghQ29uc3RydWN0b3IucHJvdG90eXBlLmNvbXBvbmVudFdpbGxSZWNpZXZlUHJvcHMsICclcyBoYXMgYSBtZXRob2QgY2FsbGVkICcgKyAnY29tcG9uZW50V2lsbFJlY2lldmVQcm9wcygpLiBEaWQgeW91IG1lYW4gY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcygpPycsIHNwZWMuZGlzcGxheU5hbWUgfHwgJ0EgY29tcG9uZW50JykgOiB2b2lkIDA7XG4gICAgfVxuXG4gICAgLy8gUmVkdWNlIHRpbWUgc3BlbnQgZG9pbmcgbG9va3VwcyBieSBzZXR0aW5nIHRoZXNlIG9uIHRoZSBwcm90b3R5cGUuXG4gICAgZm9yICh2YXIgbWV0aG9kTmFtZSBpbiBSZWFjdENsYXNzSW50ZXJmYWNlKSB7XG4gICAgICBpZiAoIUNvbnN0cnVjdG9yLnByb3RvdHlwZVttZXRob2ROYW1lXSkge1xuICAgICAgICBDb25zdHJ1Y3Rvci5wcm90b3R5cGVbbWV0aG9kTmFtZV0gPSBudWxsO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBDb25zdHJ1Y3RvcjtcbiAgfSxcblxuICBpbmplY3Rpb246IHtcbiAgICBpbmplY3RNaXhpbjogZnVuY3Rpb24gKG1peGluKSB7XG4gICAgICBpbmplY3RlZE1peGlucy5wdXNoKG1peGluKTtcbiAgICB9XG4gIH1cblxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBSZWFjdENsYXNzOyIsIi8qKlxuICogQ29weXJpZ2h0IDIwMTMtcHJlc2VudCwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgQlNELXN0eWxlIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuIEFuIGFkZGl0aW9uYWwgZ3JhbnRcbiAqIG9mIHBhdGVudCByaWdodHMgY2FuIGJlIGZvdW5kIGluIHRoZSBQQVRFTlRTIGZpbGUgaW4gdGhlIHNhbWUgZGlyZWN0b3J5LlxuICpcbiAqIEBwcm92aWRlc01vZHVsZSBSZWFjdENvbXBvbmVudFxuICovXG5cbid1c2Ugc3RyaWN0JztcblxudmFyIF9wcm9kSW52YXJpYW50ID0gcmVxdWlyZSgnLi9yZWFjdFByb2RJbnZhcmlhbnQnKTtcblxudmFyIFJlYWN0Tm9vcFVwZGF0ZVF1ZXVlID0gcmVxdWlyZSgnLi9SZWFjdE5vb3BVcGRhdGVRdWV1ZScpO1xuXG52YXIgY2FuRGVmaW5lUHJvcGVydHkgPSByZXF1aXJlKCcuL2NhbkRlZmluZVByb3BlcnR5Jyk7XG52YXIgZW1wdHlPYmplY3QgPSByZXF1aXJlKCdmYmpzL2xpYi9lbXB0eU9iamVjdCcpO1xudmFyIGludmFyaWFudCA9IHJlcXVpcmUoJ2ZianMvbGliL2ludmFyaWFudCcpO1xudmFyIHdhcm5pbmcgPSByZXF1aXJlKCdmYmpzL2xpYi93YXJuaW5nJyk7XG5cbi8qKlxuICogQmFzZSBjbGFzcyBoZWxwZXJzIGZvciB0aGUgdXBkYXRpbmcgc3RhdGUgb2YgYSBjb21wb25lbnQuXG4gKi9cbmZ1bmN0aW9uIFJlYWN0Q29tcG9uZW50KHByb3BzLCBjb250ZXh0LCB1cGRhdGVyKSB7XG4gIHRoaXMucHJvcHMgPSBwcm9wcztcbiAgdGhpcy5jb250ZXh0ID0gY29udGV4dDtcbiAgdGhpcy5yZWZzID0gZW1wdHlPYmplY3Q7XG4gIC8vIFdlIGluaXRpYWxpemUgdGhlIGRlZmF1bHQgdXBkYXRlciBidXQgdGhlIHJlYWwgb25lIGdldHMgaW5qZWN0ZWQgYnkgdGhlXG4gIC8vIHJlbmRlcmVyLlxuICB0aGlzLnVwZGF0ZXIgPSB1cGRhdGVyIHx8IFJlYWN0Tm9vcFVwZGF0ZVF1ZXVlO1xufVxuXG5SZWFjdENvbXBvbmVudC5wcm90b3R5cGUuaXNSZWFjdENvbXBvbmVudCA9IHt9O1xuXG4vKipcbiAqIFNldHMgYSBzdWJzZXQgb2YgdGhlIHN0YXRlLiBBbHdheXMgdXNlIHRoaXMgdG8gbXV0YXRlXG4gKiBzdGF0ZS4gWW91IHNob3VsZCB0cmVhdCBgdGhpcy5zdGF0ZWAgYXMgaW1tdXRhYmxlLlxuICpcbiAqIFRoZXJlIGlzIG5vIGd1YXJhbnRlZSB0aGF0IGB0aGlzLnN0YXRlYCB3aWxsIGJlIGltbWVkaWF0ZWx5IHVwZGF0ZWQsIHNvXG4gKiBhY2Nlc3NpbmcgYHRoaXMuc3RhdGVgIGFmdGVyIGNhbGxpbmcgdGhpcyBtZXRob2QgbWF5IHJldHVybiB0aGUgb2xkIHZhbHVlLlxuICpcbiAqIFRoZXJlIGlzIG5vIGd1YXJhbnRlZSB0aGF0IGNhbGxzIHRvIGBzZXRTdGF0ZWAgd2lsbCBydW4gc3luY2hyb25vdXNseSxcbiAqIGFzIHRoZXkgbWF5IGV2ZW50dWFsbHkgYmUgYmF0Y2hlZCB0b2dldGhlci4gIFlvdSBjYW4gcHJvdmlkZSBhbiBvcHRpb25hbFxuICogY2FsbGJhY2sgdGhhdCB3aWxsIGJlIGV4ZWN1dGVkIHdoZW4gdGhlIGNhbGwgdG8gc2V0U3RhdGUgaXMgYWN0dWFsbHlcbiAqIGNvbXBsZXRlZC5cbiAqXG4gKiBXaGVuIGEgZnVuY3Rpb24gaXMgcHJvdmlkZWQgdG8gc2V0U3RhdGUsIGl0IHdpbGwgYmUgY2FsbGVkIGF0IHNvbWUgcG9pbnQgaW5cbiAqIHRoZSBmdXR1cmUgKG5vdCBzeW5jaHJvbm91c2x5KS4gSXQgd2lsbCBiZSBjYWxsZWQgd2l0aCB0aGUgdXAgdG8gZGF0ZVxuICogY29tcG9uZW50IGFyZ3VtZW50cyAoc3RhdGUsIHByb3BzLCBjb250ZXh0KS4gVGhlc2UgdmFsdWVzIGNhbiBiZSBkaWZmZXJlbnRcbiAqIGZyb20gdGhpcy4qIGJlY2F1c2UgeW91ciBmdW5jdGlvbiBtYXkgYmUgY2FsbGVkIGFmdGVyIHJlY2VpdmVQcm9wcyBidXQgYmVmb3JlXG4gKiBzaG91bGRDb21wb25lbnRVcGRhdGUsIGFuZCB0aGlzIG5ldyBzdGF0ZSwgcHJvcHMsIGFuZCBjb250ZXh0IHdpbGwgbm90IHlldCBiZVxuICogYXNzaWduZWQgdG8gdGhpcy5cbiAqXG4gKiBAcGFyYW0ge29iamVjdHxmdW5jdGlvbn0gcGFydGlhbFN0YXRlIE5leHQgcGFydGlhbCBzdGF0ZSBvciBmdW5jdGlvbiB0b1xuICogICAgICAgIHByb2R1Y2UgbmV4dCBwYXJ0aWFsIHN0YXRlIHRvIGJlIG1lcmdlZCB3aXRoIGN1cnJlbnQgc3RhdGUuXG4gKiBAcGFyYW0gez9mdW5jdGlvbn0gY2FsbGJhY2sgQ2FsbGVkIGFmdGVyIHN0YXRlIGlzIHVwZGF0ZWQuXG4gKiBAZmluYWxcbiAqIEBwcm90ZWN0ZWRcbiAqL1xuUmVhY3RDb21wb25lbnQucHJvdG90eXBlLnNldFN0YXRlID0gZnVuY3Rpb24gKHBhcnRpYWxTdGF0ZSwgY2FsbGJhY2spIHtcbiAgISh0eXBlb2YgcGFydGlhbFN0YXRlID09PSAnb2JqZWN0JyB8fCB0eXBlb2YgcGFydGlhbFN0YXRlID09PSAnZnVuY3Rpb24nIHx8IHBhcnRpYWxTdGF0ZSA9PSBudWxsKSA/IHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgPyBpbnZhcmlhbnQoZmFsc2UsICdzZXRTdGF0ZSguLi4pOiB0YWtlcyBhbiBvYmplY3Qgb2Ygc3RhdGUgdmFyaWFibGVzIHRvIHVwZGF0ZSBvciBhIGZ1bmN0aW9uIHdoaWNoIHJldHVybnMgYW4gb2JqZWN0IG9mIHN0YXRlIHZhcmlhYmxlcy4nKSA6IF9wcm9kSW52YXJpYW50KCc4NScpIDogdm9pZCAwO1xuICB0aGlzLnVwZGF0ZXIuZW5xdWV1ZVNldFN0YXRlKHRoaXMsIHBhcnRpYWxTdGF0ZSk7XG4gIGlmIChjYWxsYmFjaykge1xuICAgIHRoaXMudXBkYXRlci5lbnF1ZXVlQ2FsbGJhY2sodGhpcywgY2FsbGJhY2ssICdzZXRTdGF0ZScpO1xuICB9XG59O1xuXG4vKipcbiAqIEZvcmNlcyBhbiB1cGRhdGUuIFRoaXMgc2hvdWxkIG9ubHkgYmUgaW52b2tlZCB3aGVuIGl0IGlzIGtub3duIHdpdGhcbiAqIGNlcnRhaW50eSB0aGF0IHdlIGFyZSAqKm5vdCoqIGluIGEgRE9NIHRyYW5zYWN0aW9uLlxuICpcbiAqIFlvdSBtYXkgd2FudCB0byBjYWxsIHRoaXMgd2hlbiB5b3Uga25vdyB0aGF0IHNvbWUgZGVlcGVyIGFzcGVjdCBvZiB0aGVcbiAqIGNvbXBvbmVudCdzIHN0YXRlIGhhcyBjaGFuZ2VkIGJ1dCBgc2V0U3RhdGVgIHdhcyBub3QgY2FsbGVkLlxuICpcbiAqIFRoaXMgd2lsbCBub3QgaW52b2tlIGBzaG91bGRDb21wb25lbnRVcGRhdGVgLCBidXQgaXQgd2lsbCBpbnZva2VcbiAqIGBjb21wb25lbnRXaWxsVXBkYXRlYCBhbmQgYGNvbXBvbmVudERpZFVwZGF0ZWAuXG4gKlxuICogQHBhcmFtIHs/ZnVuY3Rpb259IGNhbGxiYWNrIENhbGxlZCBhZnRlciB1cGRhdGUgaXMgY29tcGxldGUuXG4gKiBAZmluYWxcbiAqIEBwcm90ZWN0ZWRcbiAqL1xuUmVhY3RDb21wb25lbnQucHJvdG90eXBlLmZvcmNlVXBkYXRlID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG4gIHRoaXMudXBkYXRlci5lbnF1ZXVlRm9yY2VVcGRhdGUodGhpcyk7XG4gIGlmIChjYWxsYmFjaykge1xuICAgIHRoaXMudXBkYXRlci5lbnF1ZXVlQ2FsbGJhY2sodGhpcywgY2FsbGJhY2ssICdmb3JjZVVwZGF0ZScpO1xuICB9XG59O1xuXG4vKipcbiAqIERlcHJlY2F0ZWQgQVBJcy4gVGhlc2UgQVBJcyB1c2VkIHRvIGV4aXN0IG9uIGNsYXNzaWMgUmVhY3QgY2xhc3NlcyBidXQgc2luY2VcbiAqIHdlIHdvdWxkIGxpa2UgdG8gZGVwcmVjYXRlIHRoZW0sIHdlJ3JlIG5vdCBnb2luZyB0byBtb3ZlIHRoZW0gb3ZlciB0byB0aGlzXG4gKiBtb2Rlcm4gYmFzZSBjbGFzcy4gSW5zdGVhZCwgd2UgZGVmaW5lIGEgZ2V0dGVyIHRoYXQgd2FybnMgaWYgaXQncyBhY2Nlc3NlZC5cbiAqL1xuaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgdmFyIGRlcHJlY2F0ZWRBUElzID0ge1xuICAgIGlzTW91bnRlZDogWydpc01vdW50ZWQnLCAnSW5zdGVhZCwgbWFrZSBzdXJlIHRvIGNsZWFuIHVwIHN1YnNjcmlwdGlvbnMgYW5kIHBlbmRpbmcgcmVxdWVzdHMgaW4gJyArICdjb21wb25lbnRXaWxsVW5tb3VudCB0byBwcmV2ZW50IG1lbW9yeSBsZWFrcy4nXSxcbiAgICByZXBsYWNlU3RhdGU6IFsncmVwbGFjZVN0YXRlJywgJ1JlZmFjdG9yIHlvdXIgY29kZSB0byB1c2Ugc2V0U3RhdGUgaW5zdGVhZCAoc2VlICcgKyAnaHR0cHM6Ly9naXRodWIuY29tL2ZhY2Vib29rL3JlYWN0L2lzc3Vlcy8zMjM2KS4nXVxuICB9O1xuICB2YXIgZGVmaW5lRGVwcmVjYXRpb25XYXJuaW5nID0gZnVuY3Rpb24gKG1ldGhvZE5hbWUsIGluZm8pIHtcbiAgICBpZiAoY2FuRGVmaW5lUHJvcGVydHkpIHtcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShSZWFjdENvbXBvbmVudC5wcm90b3R5cGUsIG1ldGhvZE5hbWUsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyA/IHdhcm5pbmcoZmFsc2UsICclcyguLi4pIGlzIGRlcHJlY2F0ZWQgaW4gcGxhaW4gSmF2YVNjcmlwdCBSZWFjdCBjbGFzc2VzLiAlcycsIGluZm9bMF0sIGluZm9bMV0pIDogdm9pZCAwO1xuICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfTtcbiAgZm9yICh2YXIgZm5OYW1lIGluIGRlcHJlY2F0ZWRBUElzKSB7XG4gICAgaWYgKGRlcHJlY2F0ZWRBUElzLmhhc093blByb3BlcnR5KGZuTmFtZSkpIHtcbiAgICAgIGRlZmluZURlcHJlY2F0aW9uV2FybmluZyhmbk5hbWUsIGRlcHJlY2F0ZWRBUElzW2ZuTmFtZV0pO1xuICAgIH1cbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFJlYWN0Q29tcG9uZW50OyIsIi8qKlxuICogQ29weXJpZ2h0IDIwMTYtcHJlc2VudCwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgQlNELXN0eWxlIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuIEFuIGFkZGl0aW9uYWwgZ3JhbnRcbiAqIG9mIHBhdGVudCByaWdodHMgY2FuIGJlIGZvdW5kIGluIHRoZSBQQVRFTlRTIGZpbGUgaW4gdGhlIHNhbWUgZGlyZWN0b3J5LlxuICpcbiAqIEBwcm92aWRlc01vZHVsZSBSZWFjdENvbXBvbmVudFRyZWVIb29rXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgX3Byb2RJbnZhcmlhbnQgPSByZXF1aXJlKCcuL3JlYWN0UHJvZEludmFyaWFudCcpO1xuXG52YXIgUmVhY3RDdXJyZW50T3duZXIgPSByZXF1aXJlKCcuL1JlYWN0Q3VycmVudE93bmVyJyk7XG5cbnZhciBpbnZhcmlhbnQgPSByZXF1aXJlKCdmYmpzL2xpYi9pbnZhcmlhbnQnKTtcbnZhciB3YXJuaW5nID0gcmVxdWlyZSgnZmJqcy9saWIvd2FybmluZycpO1xuXG5mdW5jdGlvbiBpc05hdGl2ZShmbikge1xuICAvLyBCYXNlZCBvbiBpc05hdGl2ZSgpIGZyb20gTG9kYXNoXG4gIHZhciBmdW5jVG9TdHJpbmcgPSBGdW5jdGlvbi5wcm90b3R5cGUudG9TdHJpbmc7XG4gIHZhciBoYXNPd25Qcm9wZXJ0eSA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG4gIHZhciByZUlzTmF0aXZlID0gUmVnRXhwKCdeJyArIGZ1bmNUb1N0cmluZ1xuICAvLyBUYWtlIGFuIGV4YW1wbGUgbmF0aXZlIGZ1bmN0aW9uIHNvdXJjZSBmb3IgY29tcGFyaXNvblxuICAuY2FsbChoYXNPd25Qcm9wZXJ0eSlcbiAgLy8gU3RyaXAgcmVnZXggY2hhcmFjdGVycyBzbyB3ZSBjYW4gdXNlIGl0IGZvciByZWdleFxuICAucmVwbGFjZSgvW1xcXFxeJC4qKz8oKVtcXF17fXxdL2csICdcXFxcJCYnKVxuICAvLyBSZW1vdmUgaGFzT3duUHJvcGVydHkgZnJvbSB0aGUgdGVtcGxhdGUgdG8gbWFrZSBpdCBnZW5lcmljXG4gIC5yZXBsYWNlKC9oYXNPd25Qcm9wZXJ0eXwoZnVuY3Rpb24pLio/KD89XFxcXFxcKCl8IGZvciAuKz8oPz1cXFxcXFxdKS9nLCAnJDEuKj8nKSArICckJyk7XG4gIHRyeSB7XG4gICAgdmFyIHNvdXJjZSA9IGZ1bmNUb1N0cmluZy5jYWxsKGZuKTtcbiAgICByZXR1cm4gcmVJc05hdGl2ZS50ZXN0KHNvdXJjZSk7XG4gIH0gY2F0Y2ggKGVycikge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxufVxuXG52YXIgY2FuVXNlQ29sbGVjdGlvbnMgPVxuLy8gQXJyYXkuZnJvbVxudHlwZW9mIEFycmF5LmZyb20gPT09ICdmdW5jdGlvbicgJiZcbi8vIE1hcFxudHlwZW9mIE1hcCA9PT0gJ2Z1bmN0aW9uJyAmJiBpc05hdGl2ZShNYXApICYmXG4vLyBNYXAucHJvdG90eXBlLmtleXNcbk1hcC5wcm90b3R5cGUgIT0gbnVsbCAmJiB0eXBlb2YgTWFwLnByb3RvdHlwZS5rZXlzID09PSAnZnVuY3Rpb24nICYmIGlzTmF0aXZlKE1hcC5wcm90b3R5cGUua2V5cykgJiZcbi8vIFNldFxudHlwZW9mIFNldCA9PT0gJ2Z1bmN0aW9uJyAmJiBpc05hdGl2ZShTZXQpICYmXG4vLyBTZXQucHJvdG90eXBlLmtleXNcblNldC5wcm90b3R5cGUgIT0gbnVsbCAmJiB0eXBlb2YgU2V0LnByb3RvdHlwZS5rZXlzID09PSAnZnVuY3Rpb24nICYmIGlzTmF0aXZlKFNldC5wcm90b3R5cGUua2V5cyk7XG5cbnZhciBpdGVtTWFwO1xudmFyIHJvb3RJRFNldDtcblxudmFyIGl0ZW1CeUtleTtcbnZhciByb290QnlLZXk7XG5cbmlmIChjYW5Vc2VDb2xsZWN0aW9ucykge1xuICBpdGVtTWFwID0gbmV3IE1hcCgpO1xuICByb290SURTZXQgPSBuZXcgU2V0KCk7XG59IGVsc2Uge1xuICBpdGVtQnlLZXkgPSB7fTtcbiAgcm9vdEJ5S2V5ID0ge307XG59XG5cbnZhciB1bm1vdW50ZWRJRHMgPSBbXTtcblxuLy8gVXNlIG5vbi1udW1lcmljIGtleXMgdG8gcHJldmVudCBWOCBwZXJmb3JtYW5jZSBpc3N1ZXM6XG4vLyBodHRwczovL2dpdGh1Yi5jb20vZmFjZWJvb2svcmVhY3QvcHVsbC83MjMyXG5mdW5jdGlvbiBnZXRLZXlGcm9tSUQoaWQpIHtcbiAgcmV0dXJuICcuJyArIGlkO1xufVxuZnVuY3Rpb24gZ2V0SURGcm9tS2V5KGtleSkge1xuICByZXR1cm4gcGFyc2VJbnQoa2V5LnN1YnN0cigxKSwgMTApO1xufVxuXG5mdW5jdGlvbiBnZXQoaWQpIHtcbiAgaWYgKGNhblVzZUNvbGxlY3Rpb25zKSB7XG4gICAgcmV0dXJuIGl0ZW1NYXAuZ2V0KGlkKTtcbiAgfSBlbHNlIHtcbiAgICB2YXIga2V5ID0gZ2V0S2V5RnJvbUlEKGlkKTtcbiAgICByZXR1cm4gaXRlbUJ5S2V5W2tleV07XG4gIH1cbn1cblxuZnVuY3Rpb24gcmVtb3ZlKGlkKSB7XG4gIGlmIChjYW5Vc2VDb2xsZWN0aW9ucykge1xuICAgIGl0ZW1NYXBbJ2RlbGV0ZSddKGlkKTtcbiAgfSBlbHNlIHtcbiAgICB2YXIga2V5ID0gZ2V0S2V5RnJvbUlEKGlkKTtcbiAgICBkZWxldGUgaXRlbUJ5S2V5W2tleV07XG4gIH1cbn1cblxuZnVuY3Rpb24gY3JlYXRlKGlkLCBlbGVtZW50LCBwYXJlbnRJRCkge1xuICB2YXIgaXRlbSA9IHtcbiAgICBlbGVtZW50OiBlbGVtZW50LFxuICAgIHBhcmVudElEOiBwYXJlbnRJRCxcbiAgICB0ZXh0OiBudWxsLFxuICAgIGNoaWxkSURzOiBbXSxcbiAgICBpc01vdW50ZWQ6IGZhbHNlLFxuICAgIHVwZGF0ZUNvdW50OiAwXG4gIH07XG5cbiAgaWYgKGNhblVzZUNvbGxlY3Rpb25zKSB7XG4gICAgaXRlbU1hcC5zZXQoaWQsIGl0ZW0pO1xuICB9IGVsc2Uge1xuICAgIHZhciBrZXkgPSBnZXRLZXlGcm9tSUQoaWQpO1xuICAgIGl0ZW1CeUtleVtrZXldID0gaXRlbTtcbiAgfVxufVxuXG5mdW5jdGlvbiBhZGRSb290KGlkKSB7XG4gIGlmIChjYW5Vc2VDb2xsZWN0aW9ucykge1xuICAgIHJvb3RJRFNldC5hZGQoaWQpO1xuICB9IGVsc2Uge1xuICAgIHZhciBrZXkgPSBnZXRLZXlGcm9tSUQoaWQpO1xuICAgIHJvb3RCeUtleVtrZXldID0gdHJ1ZTtcbiAgfVxufVxuXG5mdW5jdGlvbiByZW1vdmVSb290KGlkKSB7XG4gIGlmIChjYW5Vc2VDb2xsZWN0aW9ucykge1xuICAgIHJvb3RJRFNldFsnZGVsZXRlJ10oaWQpO1xuICB9IGVsc2Uge1xuICAgIHZhciBrZXkgPSBnZXRLZXlGcm9tSUQoaWQpO1xuICAgIGRlbGV0ZSByb290QnlLZXlba2V5XTtcbiAgfVxufVxuXG5mdW5jdGlvbiBnZXRSZWdpc3RlcmVkSURzKCkge1xuICBpZiAoY2FuVXNlQ29sbGVjdGlvbnMpIHtcbiAgICByZXR1cm4gQXJyYXkuZnJvbShpdGVtTWFwLmtleXMoKSk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIE9iamVjdC5rZXlzKGl0ZW1CeUtleSkubWFwKGdldElERnJvbUtleSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gZ2V0Um9vdElEcygpIHtcbiAgaWYgKGNhblVzZUNvbGxlY3Rpb25zKSB7XG4gICAgcmV0dXJuIEFycmF5LmZyb20ocm9vdElEU2V0LmtleXMoKSk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIE9iamVjdC5rZXlzKHJvb3RCeUtleSkubWFwKGdldElERnJvbUtleSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gcHVyZ2VEZWVwKGlkKSB7XG4gIHZhciBpdGVtID0gZ2V0KGlkKTtcbiAgaWYgKGl0ZW0pIHtcbiAgICB2YXIgY2hpbGRJRHMgPSBpdGVtLmNoaWxkSURzO1xuXG4gICAgcmVtb3ZlKGlkKTtcbiAgICBjaGlsZElEcy5mb3JFYWNoKHB1cmdlRGVlcCk7XG4gIH1cbn1cblxuZnVuY3Rpb24gZGVzY3JpYmVDb21wb25lbnRGcmFtZShuYW1lLCBzb3VyY2UsIG93bmVyTmFtZSkge1xuICByZXR1cm4gJ1xcbiAgICBpbiAnICsgbmFtZSArIChzb3VyY2UgPyAnIChhdCAnICsgc291cmNlLmZpbGVOYW1lLnJlcGxhY2UoL14uKltcXFxcXFwvXS8sICcnKSArICc6JyArIHNvdXJjZS5saW5lTnVtYmVyICsgJyknIDogb3duZXJOYW1lID8gJyAoY3JlYXRlZCBieSAnICsgb3duZXJOYW1lICsgJyknIDogJycpO1xufVxuXG5mdW5jdGlvbiBnZXREaXNwbGF5TmFtZShlbGVtZW50KSB7XG4gIGlmIChlbGVtZW50ID09IG51bGwpIHtcbiAgICByZXR1cm4gJyNlbXB0eSc7XG4gIH0gZWxzZSBpZiAodHlwZW9mIGVsZW1lbnQgPT09ICdzdHJpbmcnIHx8IHR5cGVvZiBlbGVtZW50ID09PSAnbnVtYmVyJykge1xuICAgIHJldHVybiAnI3RleHQnO1xuICB9IGVsc2UgaWYgKHR5cGVvZiBlbGVtZW50LnR5cGUgPT09ICdzdHJpbmcnKSB7XG4gICAgcmV0dXJuIGVsZW1lbnQudHlwZTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gZWxlbWVudC50eXBlLmRpc3BsYXlOYW1lIHx8IGVsZW1lbnQudHlwZS5uYW1lIHx8ICdVbmtub3duJztcbiAgfVxufVxuXG5mdW5jdGlvbiBkZXNjcmliZUlEKGlkKSB7XG4gIHZhciBuYW1lID0gUmVhY3RDb21wb25lbnRUcmVlSG9vay5nZXREaXNwbGF5TmFtZShpZCk7XG4gIHZhciBlbGVtZW50ID0gUmVhY3RDb21wb25lbnRUcmVlSG9vay5nZXRFbGVtZW50KGlkKTtcbiAgdmFyIG93bmVySUQgPSBSZWFjdENvbXBvbmVudFRyZWVIb29rLmdldE93bmVySUQoaWQpO1xuICB2YXIgb3duZXJOYW1lO1xuICBpZiAob3duZXJJRCkge1xuICAgIG93bmVyTmFtZSA9IFJlYWN0Q29tcG9uZW50VHJlZUhvb2suZ2V0RGlzcGxheU5hbWUob3duZXJJRCk7XG4gIH1cbiAgcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyA/IHdhcm5pbmcoZWxlbWVudCwgJ1JlYWN0Q29tcG9uZW50VHJlZUhvb2s6IE1pc3NpbmcgUmVhY3QgZWxlbWVudCBmb3IgZGVidWdJRCAlcyB3aGVuICcgKyAnYnVpbGRpbmcgc3RhY2snLCBpZCkgOiB2b2lkIDA7XG4gIHJldHVybiBkZXNjcmliZUNvbXBvbmVudEZyYW1lKG5hbWUsIGVsZW1lbnQgJiYgZWxlbWVudC5fc291cmNlLCBvd25lck5hbWUpO1xufVxuXG52YXIgUmVhY3RDb21wb25lbnRUcmVlSG9vayA9IHtcbiAgb25TZXRDaGlsZHJlbjogZnVuY3Rpb24gKGlkLCBuZXh0Q2hpbGRJRHMpIHtcbiAgICB2YXIgaXRlbSA9IGdldChpZCk7XG4gICAgaXRlbS5jaGlsZElEcyA9IG5leHRDaGlsZElEcztcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbmV4dENoaWxkSURzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgbmV4dENoaWxkSUQgPSBuZXh0Q2hpbGRJRHNbaV07XG4gICAgICB2YXIgbmV4dENoaWxkID0gZ2V0KG5leHRDaGlsZElEKTtcbiAgICAgICFuZXh0Q2hpbGQgPyBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nID8gaW52YXJpYW50KGZhbHNlLCAnRXhwZWN0ZWQgaG9vayBldmVudHMgdG8gZmlyZSBmb3IgdGhlIGNoaWxkIGJlZm9yZSBpdHMgcGFyZW50IGluY2x1ZGVzIGl0IGluIG9uU2V0Q2hpbGRyZW4oKS4nKSA6IF9wcm9kSW52YXJpYW50KCcxNDAnKSA6IHZvaWQgMDtcbiAgICAgICEobmV4dENoaWxkLmNoaWxkSURzICE9IG51bGwgfHwgdHlwZW9mIG5leHRDaGlsZC5lbGVtZW50ICE9PSAnb2JqZWN0JyB8fCBuZXh0Q2hpbGQuZWxlbWVudCA9PSBudWxsKSA/IHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgPyBpbnZhcmlhbnQoZmFsc2UsICdFeHBlY3RlZCBvblNldENoaWxkcmVuKCkgdG8gZmlyZSBmb3IgYSBjb250YWluZXIgY2hpbGQgYmVmb3JlIGl0cyBwYXJlbnQgaW5jbHVkZXMgaXQgaW4gb25TZXRDaGlsZHJlbigpLicpIDogX3Byb2RJbnZhcmlhbnQoJzE0MScpIDogdm9pZCAwO1xuICAgICAgIW5leHRDaGlsZC5pc01vdW50ZWQgPyBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nID8gaW52YXJpYW50KGZhbHNlLCAnRXhwZWN0ZWQgb25Nb3VudENvbXBvbmVudCgpIHRvIGZpcmUgZm9yIHRoZSBjaGlsZCBiZWZvcmUgaXRzIHBhcmVudCBpbmNsdWRlcyBpdCBpbiBvblNldENoaWxkcmVuKCkuJykgOiBfcHJvZEludmFyaWFudCgnNzEnKSA6IHZvaWQgMDtcbiAgICAgIGlmIChuZXh0Q2hpbGQucGFyZW50SUQgPT0gbnVsbCkge1xuICAgICAgICBuZXh0Q2hpbGQucGFyZW50SUQgPSBpZDtcbiAgICAgICAgLy8gVE9ETzogVGhpcyBzaG91bGRuJ3QgYmUgbmVjZXNzYXJ5IGJ1dCBtb3VudGluZyBhIG5ldyByb290IGR1cmluZyBpblxuICAgICAgICAvLyBjb21wb25lbnRXaWxsTW91bnQgY3VycmVudGx5IGNhdXNlcyBub3QteWV0LW1vdW50ZWQgY29tcG9uZW50cyB0b1xuICAgICAgICAvLyBiZSBwdXJnZWQgZnJvbSBvdXIgdHJlZSBkYXRhIHNvIHRoZWlyIHBhcmVudCBJRCBpcyBtaXNzaW5nLlxuICAgICAgfVxuICAgICAgIShuZXh0Q2hpbGQucGFyZW50SUQgPT09IGlkKSA/IHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgPyBpbnZhcmlhbnQoZmFsc2UsICdFeHBlY3RlZCBvbkJlZm9yZU1vdW50Q29tcG9uZW50KCkgcGFyZW50IGFuZCBvblNldENoaWxkcmVuKCkgdG8gYmUgY29uc2lzdGVudCAoJXMgaGFzIHBhcmVudHMgJXMgYW5kICVzKS4nLCBuZXh0Q2hpbGRJRCwgbmV4dENoaWxkLnBhcmVudElELCBpZCkgOiBfcHJvZEludmFyaWFudCgnMTQyJywgbmV4dENoaWxkSUQsIG5leHRDaGlsZC5wYXJlbnRJRCwgaWQpIDogdm9pZCAwO1xuICAgIH1cbiAgfSxcbiAgb25CZWZvcmVNb3VudENvbXBvbmVudDogZnVuY3Rpb24gKGlkLCBlbGVtZW50LCBwYXJlbnRJRCkge1xuICAgIGNyZWF0ZShpZCwgZWxlbWVudCwgcGFyZW50SUQpO1xuICB9LFxuICBvbkJlZm9yZVVwZGF0ZUNvbXBvbmVudDogZnVuY3Rpb24gKGlkLCBlbGVtZW50KSB7XG4gICAgdmFyIGl0ZW0gPSBnZXQoaWQpO1xuICAgIGlmICghaXRlbSB8fCAhaXRlbS5pc01vdW50ZWQpIHtcbiAgICAgIC8vIFdlIG1heSBlbmQgdXAgaGVyZSBhcyBhIHJlc3VsdCBvZiBzZXRTdGF0ZSgpIGluIGNvbXBvbmVudFdpbGxVbm1vdW50KCkuXG4gICAgICAvLyBJbiB0aGlzIGNhc2UsIGlnbm9yZSB0aGUgZWxlbWVudC5cbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaXRlbS5lbGVtZW50ID0gZWxlbWVudDtcbiAgfSxcbiAgb25Nb3VudENvbXBvbmVudDogZnVuY3Rpb24gKGlkKSB7XG4gICAgdmFyIGl0ZW0gPSBnZXQoaWQpO1xuICAgIGl0ZW0uaXNNb3VudGVkID0gdHJ1ZTtcbiAgICB2YXIgaXNSb290ID0gaXRlbS5wYXJlbnRJRCA9PT0gMDtcbiAgICBpZiAoaXNSb290KSB7XG4gICAgICBhZGRSb290KGlkKTtcbiAgICB9XG4gIH0sXG4gIG9uVXBkYXRlQ29tcG9uZW50OiBmdW5jdGlvbiAoaWQpIHtcbiAgICB2YXIgaXRlbSA9IGdldChpZCk7XG4gICAgaWYgKCFpdGVtIHx8ICFpdGVtLmlzTW91bnRlZCkge1xuICAgICAgLy8gV2UgbWF5IGVuZCB1cCBoZXJlIGFzIGEgcmVzdWx0IG9mIHNldFN0YXRlKCkgaW4gY29tcG9uZW50V2lsbFVubW91bnQoKS5cbiAgICAgIC8vIEluIHRoaXMgY2FzZSwgaWdub3JlIHRoZSBlbGVtZW50LlxuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpdGVtLnVwZGF0ZUNvdW50Kys7XG4gIH0sXG4gIG9uVW5tb3VudENvbXBvbmVudDogZnVuY3Rpb24gKGlkKSB7XG4gICAgdmFyIGl0ZW0gPSBnZXQoaWQpO1xuICAgIGlmIChpdGVtKSB7XG4gICAgICAvLyBXZSBuZWVkIHRvIGNoZWNrIGlmIGl0IGV4aXN0cy5cbiAgICAgIC8vIGBpdGVtYCBtaWdodCBub3QgZXhpc3QgaWYgaXQgaXMgaW5zaWRlIGFuIGVycm9yIGJvdW5kYXJ5LCBhbmQgYSBzaWJsaW5nXG4gICAgICAvLyBlcnJvciBib3VuZGFyeSBjaGlsZCB0aHJldyB3aGlsZSBtb3VudGluZy4gVGhlbiB0aGlzIGluc3RhbmNlIG5ldmVyXG4gICAgICAvLyBnb3QgYSBjaGFuY2UgdG8gbW91bnQsIGJ1dCBpdCBzdGlsbCBnZXRzIGFuIHVubW91bnRpbmcgZXZlbnQgZHVyaW5nXG4gICAgICAvLyB0aGUgZXJyb3IgYm91bmRhcnkgY2xlYW51cC5cbiAgICAgIGl0ZW0uaXNNb3VudGVkID0gZmFsc2U7XG4gICAgICB2YXIgaXNSb290ID0gaXRlbS5wYXJlbnRJRCA9PT0gMDtcbiAgICAgIGlmIChpc1Jvb3QpIHtcbiAgICAgICAgcmVtb3ZlUm9vdChpZCk7XG4gICAgICB9XG4gICAgfVxuICAgIHVubW91bnRlZElEcy5wdXNoKGlkKTtcbiAgfSxcbiAgcHVyZ2VVbm1vdW50ZWRDb21wb25lbnRzOiBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKFJlYWN0Q29tcG9uZW50VHJlZUhvb2suX3ByZXZlbnRQdXJnaW5nKSB7XG4gICAgICAvLyBTaG91bGQgb25seSBiZSB1c2VkIGZvciB0ZXN0aW5nLlxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdW5tb3VudGVkSURzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgaWQgPSB1bm1vdW50ZWRJRHNbaV07XG4gICAgICBwdXJnZURlZXAoaWQpO1xuICAgIH1cbiAgICB1bm1vdW50ZWRJRHMubGVuZ3RoID0gMDtcbiAgfSxcbiAgaXNNb3VudGVkOiBmdW5jdGlvbiAoaWQpIHtcbiAgICB2YXIgaXRlbSA9IGdldChpZCk7XG4gICAgcmV0dXJuIGl0ZW0gPyBpdGVtLmlzTW91bnRlZCA6IGZhbHNlO1xuICB9LFxuICBnZXRDdXJyZW50U3RhY2tBZGRlbmR1bTogZnVuY3Rpb24gKHRvcEVsZW1lbnQpIHtcbiAgICB2YXIgaW5mbyA9ICcnO1xuICAgIGlmICh0b3BFbGVtZW50KSB7XG4gICAgICB2YXIgdHlwZSA9IHRvcEVsZW1lbnQudHlwZTtcbiAgICAgIHZhciBuYW1lID0gdHlwZW9mIHR5cGUgPT09ICdmdW5jdGlvbicgPyB0eXBlLmRpc3BsYXlOYW1lIHx8IHR5cGUubmFtZSA6IHR5cGU7XG4gICAgICB2YXIgb3duZXIgPSB0b3BFbGVtZW50Ll9vd25lcjtcbiAgICAgIGluZm8gKz0gZGVzY3JpYmVDb21wb25lbnRGcmFtZShuYW1lIHx8ICdVbmtub3duJywgdG9wRWxlbWVudC5fc291cmNlLCBvd25lciAmJiBvd25lci5nZXROYW1lKCkpO1xuICAgIH1cblxuICAgIHZhciBjdXJyZW50T3duZXIgPSBSZWFjdEN1cnJlbnRPd25lci5jdXJyZW50O1xuICAgIHZhciBpZCA9IGN1cnJlbnRPd25lciAmJiBjdXJyZW50T3duZXIuX2RlYnVnSUQ7XG5cbiAgICBpbmZvICs9IFJlYWN0Q29tcG9uZW50VHJlZUhvb2suZ2V0U3RhY2tBZGRlbmR1bUJ5SUQoaWQpO1xuICAgIHJldHVybiBpbmZvO1xuICB9LFxuICBnZXRTdGFja0FkZGVuZHVtQnlJRDogZnVuY3Rpb24gKGlkKSB7XG4gICAgdmFyIGluZm8gPSAnJztcbiAgICB3aGlsZSAoaWQpIHtcbiAgICAgIGluZm8gKz0gZGVzY3JpYmVJRChpZCk7XG4gICAgICBpZCA9IFJlYWN0Q29tcG9uZW50VHJlZUhvb2suZ2V0UGFyZW50SUQoaWQpO1xuICAgIH1cbiAgICByZXR1cm4gaW5mbztcbiAgfSxcbiAgZ2V0Q2hpbGRJRHM6IGZ1bmN0aW9uIChpZCkge1xuICAgIHZhciBpdGVtID0gZ2V0KGlkKTtcbiAgICByZXR1cm4gaXRlbSA/IGl0ZW0uY2hpbGRJRHMgOiBbXTtcbiAgfSxcbiAgZ2V0RGlzcGxheU5hbWU6IGZ1bmN0aW9uIChpZCkge1xuICAgIHZhciBlbGVtZW50ID0gUmVhY3RDb21wb25lbnRUcmVlSG9vay5nZXRFbGVtZW50KGlkKTtcbiAgICBpZiAoIWVsZW1lbnQpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gZ2V0RGlzcGxheU5hbWUoZWxlbWVudCk7XG4gIH0sXG4gIGdldEVsZW1lbnQ6IGZ1bmN0aW9uIChpZCkge1xuICAgIHZhciBpdGVtID0gZ2V0KGlkKTtcbiAgICByZXR1cm4gaXRlbSA/IGl0ZW0uZWxlbWVudCA6IG51bGw7XG4gIH0sXG4gIGdldE93bmVySUQ6IGZ1bmN0aW9uIChpZCkge1xuICAgIHZhciBlbGVtZW50ID0gUmVhY3RDb21wb25lbnRUcmVlSG9vay5nZXRFbGVtZW50KGlkKTtcbiAgICBpZiAoIWVsZW1lbnQgfHwgIWVsZW1lbnQuX293bmVyKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIGVsZW1lbnQuX293bmVyLl9kZWJ1Z0lEO1xuICB9LFxuICBnZXRQYXJlbnRJRDogZnVuY3Rpb24gKGlkKSB7XG4gICAgdmFyIGl0ZW0gPSBnZXQoaWQpO1xuICAgIHJldHVybiBpdGVtID8gaXRlbS5wYXJlbnRJRCA6IG51bGw7XG4gIH0sXG4gIGdldFNvdXJjZTogZnVuY3Rpb24gKGlkKSB7XG4gICAgdmFyIGl0ZW0gPSBnZXQoaWQpO1xuICAgIHZhciBlbGVtZW50ID0gaXRlbSA/IGl0ZW0uZWxlbWVudCA6IG51bGw7XG4gICAgdmFyIHNvdXJjZSA9IGVsZW1lbnQgIT0gbnVsbCA/IGVsZW1lbnQuX3NvdXJjZSA6IG51bGw7XG4gICAgcmV0dXJuIHNvdXJjZTtcbiAgfSxcbiAgZ2V0VGV4dDogZnVuY3Rpb24gKGlkKSB7XG4gICAgdmFyIGVsZW1lbnQgPSBSZWFjdENvbXBvbmVudFRyZWVIb29rLmdldEVsZW1lbnQoaWQpO1xuICAgIGlmICh0eXBlb2YgZWxlbWVudCA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHJldHVybiBlbGVtZW50O1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIGVsZW1lbnQgPT09ICdudW1iZXInKSB7XG4gICAgICByZXR1cm4gJycgKyBlbGVtZW50O1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gIH0sXG4gIGdldFVwZGF0ZUNvdW50OiBmdW5jdGlvbiAoaWQpIHtcbiAgICB2YXIgaXRlbSA9IGdldChpZCk7XG4gICAgcmV0dXJuIGl0ZW0gPyBpdGVtLnVwZGF0ZUNvdW50IDogMDtcbiAgfSxcblxuXG4gIGdldFJlZ2lzdGVyZWRJRHM6IGdldFJlZ2lzdGVyZWRJRHMsXG5cbiAgZ2V0Um9vdElEczogZ2V0Um9vdElEc1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBSZWFjdENvbXBvbmVudFRyZWVIb29rOyIsIi8qKlxuICogQ29weXJpZ2h0IDIwMTMtcHJlc2VudCwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgQlNELXN0eWxlIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuIEFuIGFkZGl0aW9uYWwgZ3JhbnRcbiAqIG9mIHBhdGVudCByaWdodHMgY2FuIGJlIGZvdW5kIGluIHRoZSBQQVRFTlRTIGZpbGUgaW4gdGhlIHNhbWUgZGlyZWN0b3J5LlxuICpcbiAqIEBwcm92aWRlc01vZHVsZSBSZWFjdEN1cnJlbnRPd25lclxuICovXG5cbid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBLZWVwcyB0cmFjayBvZiB0aGUgY3VycmVudCBvd25lci5cbiAqXG4gKiBUaGUgY3VycmVudCBvd25lciBpcyB0aGUgY29tcG9uZW50IHdobyBzaG91bGQgb3duIGFueSBjb21wb25lbnRzIHRoYXQgYXJlXG4gKiBjdXJyZW50bHkgYmVpbmcgY29uc3RydWN0ZWQuXG4gKi9cblxudmFyIFJlYWN0Q3VycmVudE93bmVyID0ge1xuXG4gIC8qKlxuICAgKiBAaW50ZXJuYWxcbiAgICogQHR5cGUge1JlYWN0Q29tcG9uZW50fVxuICAgKi9cbiAgY3VycmVudDogbnVsbFxuXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFJlYWN0Q3VycmVudE93bmVyOyIsIi8qKlxuICogQ29weXJpZ2h0IDIwMTMtcHJlc2VudCwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgQlNELXN0eWxlIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuIEFuIGFkZGl0aW9uYWwgZ3JhbnRcbiAqIG9mIHBhdGVudCByaWdodHMgY2FuIGJlIGZvdW5kIGluIHRoZSBQQVRFTlRTIGZpbGUgaW4gdGhlIHNhbWUgZGlyZWN0b3J5LlxuICpcbiAqIEBwcm92aWRlc01vZHVsZSBSZWFjdERPTUZhY3Rvcmllc1xuICovXG5cbid1c2Ugc3RyaWN0JztcblxudmFyIFJlYWN0RWxlbWVudCA9IHJlcXVpcmUoJy4vUmVhY3RFbGVtZW50Jyk7XG5cbi8qKlxuICogQ3JlYXRlIGEgZmFjdG9yeSB0aGF0IGNyZWF0ZXMgSFRNTCB0YWcgZWxlbWVudHMuXG4gKlxuICogQHByaXZhdGVcbiAqL1xudmFyIGNyZWF0ZURPTUZhY3RvcnkgPSBSZWFjdEVsZW1lbnQuY3JlYXRlRmFjdG9yeTtcbmlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gIHZhciBSZWFjdEVsZW1lbnRWYWxpZGF0b3IgPSByZXF1aXJlKCcuL1JlYWN0RWxlbWVudFZhbGlkYXRvcicpO1xuICBjcmVhdGVET01GYWN0b3J5ID0gUmVhY3RFbGVtZW50VmFsaWRhdG9yLmNyZWF0ZUZhY3Rvcnk7XG59XG5cbi8qKlxuICogQ3JlYXRlcyBhIG1hcHBpbmcgZnJvbSBzdXBwb3J0ZWQgSFRNTCB0YWdzIHRvIGBSZWFjdERPTUNvbXBvbmVudGAgY2xhc3Nlcy5cbiAqIFRoaXMgaXMgYWxzbyBhY2Nlc3NpYmxlIHZpYSBgUmVhY3QuRE9NYC5cbiAqXG4gKiBAcHVibGljXG4gKi9cbnZhciBSZWFjdERPTUZhY3RvcmllcyA9IHtcbiAgYTogY3JlYXRlRE9NRmFjdG9yeSgnYScpLFxuICBhYmJyOiBjcmVhdGVET01GYWN0b3J5KCdhYmJyJyksXG4gIGFkZHJlc3M6IGNyZWF0ZURPTUZhY3RvcnkoJ2FkZHJlc3MnKSxcbiAgYXJlYTogY3JlYXRlRE9NRmFjdG9yeSgnYXJlYScpLFxuICBhcnRpY2xlOiBjcmVhdGVET01GYWN0b3J5KCdhcnRpY2xlJyksXG4gIGFzaWRlOiBjcmVhdGVET01GYWN0b3J5KCdhc2lkZScpLFxuICBhdWRpbzogY3JlYXRlRE9NRmFjdG9yeSgnYXVkaW8nKSxcbiAgYjogY3JlYXRlRE9NRmFjdG9yeSgnYicpLFxuICBiYXNlOiBjcmVhdGVET01GYWN0b3J5KCdiYXNlJyksXG4gIGJkaTogY3JlYXRlRE9NRmFjdG9yeSgnYmRpJyksXG4gIGJkbzogY3JlYXRlRE9NRmFjdG9yeSgnYmRvJyksXG4gIGJpZzogY3JlYXRlRE9NRmFjdG9yeSgnYmlnJyksXG4gIGJsb2NrcXVvdGU6IGNyZWF0ZURPTUZhY3RvcnkoJ2Jsb2NrcXVvdGUnKSxcbiAgYm9keTogY3JlYXRlRE9NRmFjdG9yeSgnYm9keScpLFxuICBicjogY3JlYXRlRE9NRmFjdG9yeSgnYnInKSxcbiAgYnV0dG9uOiBjcmVhdGVET01GYWN0b3J5KCdidXR0b24nKSxcbiAgY2FudmFzOiBjcmVhdGVET01GYWN0b3J5KCdjYW52YXMnKSxcbiAgY2FwdGlvbjogY3JlYXRlRE9NRmFjdG9yeSgnY2FwdGlvbicpLFxuICBjaXRlOiBjcmVhdGVET01GYWN0b3J5KCdjaXRlJyksXG4gIGNvZGU6IGNyZWF0ZURPTUZhY3RvcnkoJ2NvZGUnKSxcbiAgY29sOiBjcmVhdGVET01GYWN0b3J5KCdjb2wnKSxcbiAgY29sZ3JvdXA6IGNyZWF0ZURPTUZhY3RvcnkoJ2NvbGdyb3VwJyksXG4gIGRhdGE6IGNyZWF0ZURPTUZhY3RvcnkoJ2RhdGEnKSxcbiAgZGF0YWxpc3Q6IGNyZWF0ZURPTUZhY3RvcnkoJ2RhdGFsaXN0JyksXG4gIGRkOiBjcmVhdGVET01GYWN0b3J5KCdkZCcpLFxuICBkZWw6IGNyZWF0ZURPTUZhY3RvcnkoJ2RlbCcpLFxuICBkZXRhaWxzOiBjcmVhdGVET01GYWN0b3J5KCdkZXRhaWxzJyksXG4gIGRmbjogY3JlYXRlRE9NRmFjdG9yeSgnZGZuJyksXG4gIGRpYWxvZzogY3JlYXRlRE9NRmFjdG9yeSgnZGlhbG9nJyksXG4gIGRpdjogY3JlYXRlRE9NRmFjdG9yeSgnZGl2JyksXG4gIGRsOiBjcmVhdGVET01GYWN0b3J5KCdkbCcpLFxuICBkdDogY3JlYXRlRE9NRmFjdG9yeSgnZHQnKSxcbiAgZW06IGNyZWF0ZURPTUZhY3RvcnkoJ2VtJyksXG4gIGVtYmVkOiBjcmVhdGVET01GYWN0b3J5KCdlbWJlZCcpLFxuICBmaWVsZHNldDogY3JlYXRlRE9NRmFjdG9yeSgnZmllbGRzZXQnKSxcbiAgZmlnY2FwdGlvbjogY3JlYXRlRE9NRmFjdG9yeSgnZmlnY2FwdGlvbicpLFxuICBmaWd1cmU6IGNyZWF0ZURPTUZhY3RvcnkoJ2ZpZ3VyZScpLFxuICBmb290ZXI6IGNyZWF0ZURPTUZhY3RvcnkoJ2Zvb3RlcicpLFxuICBmb3JtOiBjcmVhdGVET01GYWN0b3J5KCdmb3JtJyksXG4gIGgxOiBjcmVhdGVET01GYWN0b3J5KCdoMScpLFxuICBoMjogY3JlYXRlRE9NRmFjdG9yeSgnaDInKSxcbiAgaDM6IGNyZWF0ZURPTUZhY3RvcnkoJ2gzJyksXG4gIGg0OiBjcmVhdGVET01GYWN0b3J5KCdoNCcpLFxuICBoNTogY3JlYXRlRE9NRmFjdG9yeSgnaDUnKSxcbiAgaDY6IGNyZWF0ZURPTUZhY3RvcnkoJ2g2JyksXG4gIGhlYWQ6IGNyZWF0ZURPTUZhY3RvcnkoJ2hlYWQnKSxcbiAgaGVhZGVyOiBjcmVhdGVET01GYWN0b3J5KCdoZWFkZXInKSxcbiAgaGdyb3VwOiBjcmVhdGVET01GYWN0b3J5KCdoZ3JvdXAnKSxcbiAgaHI6IGNyZWF0ZURPTUZhY3RvcnkoJ2hyJyksXG4gIGh0bWw6IGNyZWF0ZURPTUZhY3RvcnkoJ2h0bWwnKSxcbiAgaTogY3JlYXRlRE9NRmFjdG9yeSgnaScpLFxuICBpZnJhbWU6IGNyZWF0ZURPTUZhY3RvcnkoJ2lmcmFtZScpLFxuICBpbWc6IGNyZWF0ZURPTUZhY3RvcnkoJ2ltZycpLFxuICBpbnB1dDogY3JlYXRlRE9NRmFjdG9yeSgnaW5wdXQnKSxcbiAgaW5zOiBjcmVhdGVET01GYWN0b3J5KCdpbnMnKSxcbiAga2JkOiBjcmVhdGVET01GYWN0b3J5KCdrYmQnKSxcbiAga2V5Z2VuOiBjcmVhdGVET01GYWN0b3J5KCdrZXlnZW4nKSxcbiAgbGFiZWw6IGNyZWF0ZURPTUZhY3RvcnkoJ2xhYmVsJyksXG4gIGxlZ2VuZDogY3JlYXRlRE9NRmFjdG9yeSgnbGVnZW5kJyksXG4gIGxpOiBjcmVhdGVET01GYWN0b3J5KCdsaScpLFxuICBsaW5rOiBjcmVhdGVET01GYWN0b3J5KCdsaW5rJyksXG4gIG1haW46IGNyZWF0ZURPTUZhY3RvcnkoJ21haW4nKSxcbiAgbWFwOiBjcmVhdGVET01GYWN0b3J5KCdtYXAnKSxcbiAgbWFyazogY3JlYXRlRE9NRmFjdG9yeSgnbWFyaycpLFxuICBtZW51OiBjcmVhdGVET01GYWN0b3J5KCdtZW51JyksXG4gIG1lbnVpdGVtOiBjcmVhdGVET01GYWN0b3J5KCdtZW51aXRlbScpLFxuICBtZXRhOiBjcmVhdGVET01GYWN0b3J5KCdtZXRhJyksXG4gIG1ldGVyOiBjcmVhdGVET01GYWN0b3J5KCdtZXRlcicpLFxuICBuYXY6IGNyZWF0ZURPTUZhY3RvcnkoJ25hdicpLFxuICBub3NjcmlwdDogY3JlYXRlRE9NRmFjdG9yeSgnbm9zY3JpcHQnKSxcbiAgb2JqZWN0OiBjcmVhdGVET01GYWN0b3J5KCdvYmplY3QnKSxcbiAgb2w6IGNyZWF0ZURPTUZhY3RvcnkoJ29sJyksXG4gIG9wdGdyb3VwOiBjcmVhdGVET01GYWN0b3J5KCdvcHRncm91cCcpLFxuICBvcHRpb246IGNyZWF0ZURPTUZhY3RvcnkoJ29wdGlvbicpLFxuICBvdXRwdXQ6IGNyZWF0ZURPTUZhY3RvcnkoJ291dHB1dCcpLFxuICBwOiBjcmVhdGVET01GYWN0b3J5KCdwJyksXG4gIHBhcmFtOiBjcmVhdGVET01GYWN0b3J5KCdwYXJhbScpLFxuICBwaWN0dXJlOiBjcmVhdGVET01GYWN0b3J5KCdwaWN0dXJlJyksXG4gIHByZTogY3JlYXRlRE9NRmFjdG9yeSgncHJlJyksXG4gIHByb2dyZXNzOiBjcmVhdGVET01GYWN0b3J5KCdwcm9ncmVzcycpLFxuICBxOiBjcmVhdGVET01GYWN0b3J5KCdxJyksXG4gIHJwOiBjcmVhdGVET01GYWN0b3J5KCdycCcpLFxuICBydDogY3JlYXRlRE9NRmFjdG9yeSgncnQnKSxcbiAgcnVieTogY3JlYXRlRE9NRmFjdG9yeSgncnVieScpLFxuICBzOiBjcmVhdGVET01GYWN0b3J5KCdzJyksXG4gIHNhbXA6IGNyZWF0ZURPTUZhY3RvcnkoJ3NhbXAnKSxcbiAgc2NyaXB0OiBjcmVhdGVET01GYWN0b3J5KCdzY3JpcHQnKSxcbiAgc2VjdGlvbjogY3JlYXRlRE9NRmFjdG9yeSgnc2VjdGlvbicpLFxuICBzZWxlY3Q6IGNyZWF0ZURPTUZhY3RvcnkoJ3NlbGVjdCcpLFxuICBzbWFsbDogY3JlYXRlRE9NRmFjdG9yeSgnc21hbGwnKSxcbiAgc291cmNlOiBjcmVhdGVET01GYWN0b3J5KCdzb3VyY2UnKSxcbiAgc3BhbjogY3JlYXRlRE9NRmFjdG9yeSgnc3BhbicpLFxuICBzdHJvbmc6IGNyZWF0ZURPTUZhY3RvcnkoJ3N0cm9uZycpLFxuICBzdHlsZTogY3JlYXRlRE9NRmFjdG9yeSgnc3R5bGUnKSxcbiAgc3ViOiBjcmVhdGVET01GYWN0b3J5KCdzdWInKSxcbiAgc3VtbWFyeTogY3JlYXRlRE9NRmFjdG9yeSgnc3VtbWFyeScpLFxuICBzdXA6IGNyZWF0ZURPTUZhY3RvcnkoJ3N1cCcpLFxuICB0YWJsZTogY3JlYXRlRE9NRmFjdG9yeSgndGFibGUnKSxcbiAgdGJvZHk6IGNyZWF0ZURPTUZhY3RvcnkoJ3Rib2R5JyksXG4gIHRkOiBjcmVhdGVET01GYWN0b3J5KCd0ZCcpLFxuICB0ZXh0YXJlYTogY3JlYXRlRE9NRmFjdG9yeSgndGV4dGFyZWEnKSxcbiAgdGZvb3Q6IGNyZWF0ZURPTUZhY3RvcnkoJ3Rmb290JyksXG4gIHRoOiBjcmVhdGVET01GYWN0b3J5KCd0aCcpLFxuICB0aGVhZDogY3JlYXRlRE9NRmFjdG9yeSgndGhlYWQnKSxcbiAgdGltZTogY3JlYXRlRE9NRmFjdG9yeSgndGltZScpLFxuICB0aXRsZTogY3JlYXRlRE9NRmFjdG9yeSgndGl0bGUnKSxcbiAgdHI6IGNyZWF0ZURPTUZhY3RvcnkoJ3RyJyksXG4gIHRyYWNrOiBjcmVhdGVET01GYWN0b3J5KCd0cmFjaycpLFxuICB1OiBjcmVhdGVET01GYWN0b3J5KCd1JyksXG4gIHVsOiBjcmVhdGVET01GYWN0b3J5KCd1bCcpLFxuICAndmFyJzogY3JlYXRlRE9NRmFjdG9yeSgndmFyJyksXG4gIHZpZGVvOiBjcmVhdGVET01GYWN0b3J5KCd2aWRlbycpLFxuICB3YnI6IGNyZWF0ZURPTUZhY3RvcnkoJ3dicicpLFxuXG4gIC8vIFNWR1xuICBjaXJjbGU6IGNyZWF0ZURPTUZhY3RvcnkoJ2NpcmNsZScpLFxuICBjbGlwUGF0aDogY3JlYXRlRE9NRmFjdG9yeSgnY2xpcFBhdGgnKSxcbiAgZGVmczogY3JlYXRlRE9NRmFjdG9yeSgnZGVmcycpLFxuICBlbGxpcHNlOiBjcmVhdGVET01GYWN0b3J5KCdlbGxpcHNlJyksXG4gIGc6IGNyZWF0ZURPTUZhY3RvcnkoJ2cnKSxcbiAgaW1hZ2U6IGNyZWF0ZURPTUZhY3RvcnkoJ2ltYWdlJyksXG4gIGxpbmU6IGNyZWF0ZURPTUZhY3RvcnkoJ2xpbmUnKSxcbiAgbGluZWFyR3JhZGllbnQ6IGNyZWF0ZURPTUZhY3RvcnkoJ2xpbmVhckdyYWRpZW50JyksXG4gIG1hc2s6IGNyZWF0ZURPTUZhY3RvcnkoJ21hc2snKSxcbiAgcGF0aDogY3JlYXRlRE9NRmFjdG9yeSgncGF0aCcpLFxuICBwYXR0ZXJuOiBjcmVhdGVET01GYWN0b3J5KCdwYXR0ZXJuJyksXG4gIHBvbHlnb246IGNyZWF0ZURPTUZhY3RvcnkoJ3BvbHlnb24nKSxcbiAgcG9seWxpbmU6IGNyZWF0ZURPTUZhY3RvcnkoJ3BvbHlsaW5lJyksXG4gIHJhZGlhbEdyYWRpZW50OiBjcmVhdGVET01GYWN0b3J5KCdyYWRpYWxHcmFkaWVudCcpLFxuICByZWN0OiBjcmVhdGVET01GYWN0b3J5KCdyZWN0JyksXG4gIHN0b3A6IGNyZWF0ZURPTUZhY3RvcnkoJ3N0b3AnKSxcbiAgc3ZnOiBjcmVhdGVET01GYWN0b3J5KCdzdmcnKSxcbiAgdGV4dDogY3JlYXRlRE9NRmFjdG9yeSgndGV4dCcpLFxuICB0c3BhbjogY3JlYXRlRE9NRmFjdG9yeSgndHNwYW4nKVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBSZWFjdERPTUZhY3RvcmllczsiLCIvKipcbiAqIENvcHlyaWdodCAyMDE0LXByZXNlbnQsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIEJTRC1zdHlsZSBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLiBBbiBhZGRpdGlvbmFsIGdyYW50XG4gKiBvZiBwYXRlbnQgcmlnaHRzIGNhbiBiZSBmb3VuZCBpbiB0aGUgUEFURU5UUyBmaWxlIGluIHRoZSBzYW1lIGRpcmVjdG9yeS5cbiAqXG4gKiBAcHJvdmlkZXNNb2R1bGUgUmVhY3RFbGVtZW50XG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgX2Fzc2lnbiA9IHJlcXVpcmUoJ29iamVjdC1hc3NpZ24nKTtcblxudmFyIFJlYWN0Q3VycmVudE93bmVyID0gcmVxdWlyZSgnLi9SZWFjdEN1cnJlbnRPd25lcicpO1xuXG52YXIgd2FybmluZyA9IHJlcXVpcmUoJ2ZianMvbGliL3dhcm5pbmcnKTtcbnZhciBjYW5EZWZpbmVQcm9wZXJ0eSA9IHJlcXVpcmUoJy4vY2FuRGVmaW5lUHJvcGVydHknKTtcbnZhciBoYXNPd25Qcm9wZXJ0eSA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG5cbi8vIFRoZSBTeW1ib2wgdXNlZCB0byB0YWcgdGhlIFJlYWN0RWxlbWVudCB0eXBlLiBJZiB0aGVyZSBpcyBubyBuYXRpdmUgU3ltYm9sXG4vLyBub3IgcG9seWZpbGwsIHRoZW4gYSBwbGFpbiBudW1iZXIgaXMgdXNlZCBmb3IgcGVyZm9ybWFuY2UuXG52YXIgUkVBQ1RfRUxFTUVOVF9UWVBFID0gdHlwZW9mIFN5bWJvbCA9PT0gJ2Z1bmN0aW9uJyAmJiBTeW1ib2xbJ2ZvciddICYmIFN5bWJvbFsnZm9yJ10oJ3JlYWN0LmVsZW1lbnQnKSB8fCAweGVhYzc7XG5cbnZhciBSRVNFUlZFRF9QUk9QUyA9IHtcbiAga2V5OiB0cnVlLFxuICByZWY6IHRydWUsXG4gIF9fc2VsZjogdHJ1ZSxcbiAgX19zb3VyY2U6IHRydWVcbn07XG5cbnZhciBzcGVjaWFsUHJvcEtleVdhcm5pbmdTaG93biwgc3BlY2lhbFByb3BSZWZXYXJuaW5nU2hvd247XG5cbmZ1bmN0aW9uIGhhc1ZhbGlkUmVmKGNvbmZpZykge1xuICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgIGlmIChoYXNPd25Qcm9wZXJ0eS5jYWxsKGNvbmZpZywgJ3JlZicpKSB7XG4gICAgICB2YXIgZ2V0dGVyID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihjb25maWcsICdyZWYnKS5nZXQ7XG4gICAgICBpZiAoZ2V0dGVyICYmIGdldHRlci5pc1JlYWN0V2FybmluZykge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiBjb25maWcucmVmICE9PSB1bmRlZmluZWQ7XG59XG5cbmZ1bmN0aW9uIGhhc1ZhbGlkS2V5KGNvbmZpZykge1xuICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgIGlmIChoYXNPd25Qcm9wZXJ0eS5jYWxsKGNvbmZpZywgJ2tleScpKSB7XG4gICAgICB2YXIgZ2V0dGVyID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihjb25maWcsICdrZXknKS5nZXQ7XG4gICAgICBpZiAoZ2V0dGVyICYmIGdldHRlci5pc1JlYWN0V2FybmluZykge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiBjb25maWcua2V5ICE9PSB1bmRlZmluZWQ7XG59XG5cbmZ1bmN0aW9uIGRlZmluZUtleVByb3BXYXJuaW5nR2V0dGVyKHByb3BzLCBkaXNwbGF5TmFtZSkge1xuICB2YXIgd2FybkFib3V0QWNjZXNzaW5nS2V5ID0gZnVuY3Rpb24gKCkge1xuICAgIGlmICghc3BlY2lhbFByb3BLZXlXYXJuaW5nU2hvd24pIHtcbiAgICAgIHNwZWNpYWxQcm9wS2V5V2FybmluZ1Nob3duID0gdHJ1ZTtcbiAgICAgIHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgPyB3YXJuaW5nKGZhbHNlLCAnJXM6IGBrZXlgIGlzIG5vdCBhIHByb3AuIFRyeWluZyB0byBhY2Nlc3MgaXQgd2lsbCByZXN1bHQgJyArICdpbiBgdW5kZWZpbmVkYCBiZWluZyByZXR1cm5lZC4gSWYgeW91IG5lZWQgdG8gYWNjZXNzIHRoZSBzYW1lICcgKyAndmFsdWUgd2l0aGluIHRoZSBjaGlsZCBjb21wb25lbnQsIHlvdSBzaG91bGQgcGFzcyBpdCBhcyBhIGRpZmZlcmVudCAnICsgJ3Byb3AuIChodHRwczovL2ZiLm1lL3JlYWN0LXNwZWNpYWwtcHJvcHMpJywgZGlzcGxheU5hbWUpIDogdm9pZCAwO1xuICAgIH1cbiAgfTtcbiAgd2FybkFib3V0QWNjZXNzaW5nS2V5LmlzUmVhY3RXYXJuaW5nID0gdHJ1ZTtcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHByb3BzLCAna2V5Jywge1xuICAgIGdldDogd2FybkFib3V0QWNjZXNzaW5nS2V5LFxuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICB9KTtcbn1cblxuZnVuY3Rpb24gZGVmaW5lUmVmUHJvcFdhcm5pbmdHZXR0ZXIocHJvcHMsIGRpc3BsYXlOYW1lKSB7XG4gIHZhciB3YXJuQWJvdXRBY2Nlc3NpbmdSZWYgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKCFzcGVjaWFsUHJvcFJlZldhcm5pbmdTaG93bikge1xuICAgICAgc3BlY2lhbFByb3BSZWZXYXJuaW5nU2hvd24gPSB0cnVlO1xuICAgICAgcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyA/IHdhcm5pbmcoZmFsc2UsICclczogYHJlZmAgaXMgbm90IGEgcHJvcC4gVHJ5aW5nIHRvIGFjY2VzcyBpdCB3aWxsIHJlc3VsdCAnICsgJ2luIGB1bmRlZmluZWRgIGJlaW5nIHJldHVybmVkLiBJZiB5b3UgbmVlZCB0byBhY2Nlc3MgdGhlIHNhbWUgJyArICd2YWx1ZSB3aXRoaW4gdGhlIGNoaWxkIGNvbXBvbmVudCwgeW91IHNob3VsZCBwYXNzIGl0IGFzIGEgZGlmZmVyZW50ICcgKyAncHJvcC4gKGh0dHBzOi8vZmIubWUvcmVhY3Qtc3BlY2lhbC1wcm9wcyknLCBkaXNwbGF5TmFtZSkgOiB2b2lkIDA7XG4gICAgfVxuICB9O1xuICB3YXJuQWJvdXRBY2Nlc3NpbmdSZWYuaXNSZWFjdFdhcm5pbmcgPSB0cnVlO1xuICBPYmplY3QuZGVmaW5lUHJvcGVydHkocHJvcHMsICdyZWYnLCB7XG4gICAgZ2V0OiB3YXJuQWJvdXRBY2Nlc3NpbmdSZWYsXG4gICAgY29uZmlndXJhYmxlOiB0cnVlXG4gIH0pO1xufVxuXG4vKipcbiAqIEZhY3RvcnkgbWV0aG9kIHRvIGNyZWF0ZSBhIG5ldyBSZWFjdCBlbGVtZW50LiBUaGlzIG5vIGxvbmdlciBhZGhlcmVzIHRvXG4gKiB0aGUgY2xhc3MgcGF0dGVybiwgc28gZG8gbm90IHVzZSBuZXcgdG8gY2FsbCBpdC4gQWxzbywgbm8gaW5zdGFuY2VvZiBjaGVja1xuICogd2lsbCB3b3JrLiBJbnN0ZWFkIHRlc3QgJCR0eXBlb2YgZmllbGQgYWdhaW5zdCBTeW1ib2wuZm9yKCdyZWFjdC5lbGVtZW50JykgdG8gY2hlY2tcbiAqIGlmIHNvbWV0aGluZyBpcyBhIFJlYWN0IEVsZW1lbnQuXG4gKlxuICogQHBhcmFtIHsqfSB0eXBlXG4gKiBAcGFyYW0geyp9IGtleVxuICogQHBhcmFtIHtzdHJpbmd8b2JqZWN0fSByZWZcbiAqIEBwYXJhbSB7Kn0gc2VsZiBBICp0ZW1wb3JhcnkqIGhlbHBlciB0byBkZXRlY3QgcGxhY2VzIHdoZXJlIGB0aGlzYCBpc1xuICogZGlmZmVyZW50IGZyb20gdGhlIGBvd25lcmAgd2hlbiBSZWFjdC5jcmVhdGVFbGVtZW50IGlzIGNhbGxlZCwgc28gdGhhdCB3ZVxuICogY2FuIHdhcm4uIFdlIHdhbnQgdG8gZ2V0IHJpZCBvZiBvd25lciBhbmQgcmVwbGFjZSBzdHJpbmcgYHJlZmBzIHdpdGggYXJyb3dcbiAqIGZ1bmN0aW9ucywgYW5kIGFzIGxvbmcgYXMgYHRoaXNgIGFuZCBvd25lciBhcmUgdGhlIHNhbWUsIHRoZXJlIHdpbGwgYmUgbm9cbiAqIGNoYW5nZSBpbiBiZWhhdmlvci5cbiAqIEBwYXJhbSB7Kn0gc291cmNlIEFuIGFubm90YXRpb24gb2JqZWN0IChhZGRlZCBieSBhIHRyYW5zcGlsZXIgb3Igb3RoZXJ3aXNlKVxuICogaW5kaWNhdGluZyBmaWxlbmFtZSwgbGluZSBudW1iZXIsIGFuZC9vciBvdGhlciBpbmZvcm1hdGlvbi5cbiAqIEBwYXJhbSB7Kn0gb3duZXJcbiAqIEBwYXJhbSB7Kn0gcHJvcHNcbiAqIEBpbnRlcm5hbFxuICovXG52YXIgUmVhY3RFbGVtZW50ID0gZnVuY3Rpb24gKHR5cGUsIGtleSwgcmVmLCBzZWxmLCBzb3VyY2UsIG93bmVyLCBwcm9wcykge1xuICB2YXIgZWxlbWVudCA9IHtcbiAgICAvLyBUaGlzIHRhZyBhbGxvdyB1cyB0byB1bmlxdWVseSBpZGVudGlmeSB0aGlzIGFzIGEgUmVhY3QgRWxlbWVudFxuICAgICQkdHlwZW9mOiBSRUFDVF9FTEVNRU5UX1RZUEUsXG5cbiAgICAvLyBCdWlsdC1pbiBwcm9wZXJ0aWVzIHRoYXQgYmVsb25nIG9uIHRoZSBlbGVtZW50XG4gICAgdHlwZTogdHlwZSxcbiAgICBrZXk6IGtleSxcbiAgICByZWY6IHJlZixcbiAgICBwcm9wczogcHJvcHMsXG5cbiAgICAvLyBSZWNvcmQgdGhlIGNvbXBvbmVudCByZXNwb25zaWJsZSBmb3IgY3JlYXRpbmcgdGhpcyBlbGVtZW50LlxuICAgIF9vd25lcjogb3duZXJcbiAgfTtcblxuICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgIC8vIFRoZSB2YWxpZGF0aW9uIGZsYWcgaXMgY3VycmVudGx5IG11dGF0aXZlLiBXZSBwdXQgaXQgb25cbiAgICAvLyBhbiBleHRlcm5hbCBiYWNraW5nIHN0b3JlIHNvIHRoYXQgd2UgY2FuIGZyZWV6ZSB0aGUgd2hvbGUgb2JqZWN0LlxuICAgIC8vIFRoaXMgY2FuIGJlIHJlcGxhY2VkIHdpdGggYSBXZWFrTWFwIG9uY2UgdGhleSBhcmUgaW1wbGVtZW50ZWQgaW5cbiAgICAvLyBjb21tb25seSB1c2VkIGRldmVsb3BtZW50IGVudmlyb25tZW50cy5cbiAgICBlbGVtZW50Ll9zdG9yZSA9IHt9O1xuICAgIHZhciBzaGFkb3dDaGlsZHJlbiA9IEFycmF5LmlzQXJyYXkocHJvcHMuY2hpbGRyZW4pID8gcHJvcHMuY2hpbGRyZW4uc2xpY2UoMCkgOiBwcm9wcy5jaGlsZHJlbjtcblxuICAgIC8vIFRvIG1ha2UgY29tcGFyaW5nIFJlYWN0RWxlbWVudHMgZWFzaWVyIGZvciB0ZXN0aW5nIHB1cnBvc2VzLCB3ZSBtYWtlXG4gICAgLy8gdGhlIHZhbGlkYXRpb24gZmxhZyBub24tZW51bWVyYWJsZSAod2hlcmUgcG9zc2libGUsIHdoaWNoIHNob3VsZFxuICAgIC8vIGluY2x1ZGUgZXZlcnkgZW52aXJvbm1lbnQgd2UgcnVuIHRlc3RzIGluKSwgc28gdGhlIHRlc3QgZnJhbWV3b3JrXG4gICAgLy8gaWdub3JlcyBpdC5cbiAgICBpZiAoY2FuRGVmaW5lUHJvcGVydHkpIHtcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlbGVtZW50Ll9zdG9yZSwgJ3ZhbGlkYXRlZCcsIHtcbiAgICAgICAgY29uZmlndXJhYmxlOiBmYWxzZSxcbiAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgICAgICB2YWx1ZTogZmFsc2VcbiAgICAgIH0pO1xuICAgICAgLy8gc2VsZiBhbmQgc291cmNlIGFyZSBERVYgb25seSBwcm9wZXJ0aWVzLlxuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGVsZW1lbnQsICdfc2VsZicsIHtcbiAgICAgICAgY29uZmlndXJhYmxlOiBmYWxzZSxcbiAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICAgIHdyaXRhYmxlOiBmYWxzZSxcbiAgICAgICAgdmFsdWU6IHNlbGZcbiAgICAgIH0pO1xuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGVsZW1lbnQsICdfc2hhZG93Q2hpbGRyZW4nLCB7XG4gICAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICB3cml0YWJsZTogZmFsc2UsXG4gICAgICAgIHZhbHVlOiBzaGFkb3dDaGlsZHJlblxuICAgICAgfSk7XG4gICAgICAvLyBUd28gZWxlbWVudHMgY3JlYXRlZCBpbiB0d28gZGlmZmVyZW50IHBsYWNlcyBzaG91bGQgYmUgY29uc2lkZXJlZFxuICAgICAgLy8gZXF1YWwgZm9yIHRlc3RpbmcgcHVycG9zZXMgYW5kIHRoZXJlZm9yZSB3ZSBoaWRlIGl0IGZyb20gZW51bWVyYXRpb24uXG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoZWxlbWVudCwgJ19zb3VyY2UnLCB7XG4gICAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICB3cml0YWJsZTogZmFsc2UsXG4gICAgICAgIHZhbHVlOiBzb3VyY2VcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBlbGVtZW50Ll9zdG9yZS52YWxpZGF0ZWQgPSBmYWxzZTtcbiAgICAgIGVsZW1lbnQuX3NlbGYgPSBzZWxmO1xuICAgICAgZWxlbWVudC5fc2hhZG93Q2hpbGRyZW4gPSBzaGFkb3dDaGlsZHJlbjtcbiAgICAgIGVsZW1lbnQuX3NvdXJjZSA9IHNvdXJjZTtcbiAgICB9XG4gICAgaWYgKE9iamVjdC5mcmVlemUpIHtcbiAgICAgIE9iamVjdC5mcmVlemUoZWxlbWVudC5wcm9wcyk7XG4gICAgICBPYmplY3QuZnJlZXplKGVsZW1lbnQpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBlbGVtZW50O1xufTtcblxuLyoqXG4gKiBDcmVhdGUgYW5kIHJldHVybiBhIG5ldyBSZWFjdEVsZW1lbnQgb2YgdGhlIGdpdmVuIHR5cGUuXG4gKiBTZWUgaHR0cHM6Ly9mYWNlYm9vay5naXRodWIuaW8vcmVhY3QvZG9jcy90b3AtbGV2ZWwtYXBpLmh0bWwjcmVhY3QuY3JlYXRlZWxlbWVudFxuICovXG5SZWFjdEVsZW1lbnQuY3JlYXRlRWxlbWVudCA9IGZ1bmN0aW9uICh0eXBlLCBjb25maWcsIGNoaWxkcmVuKSB7XG4gIHZhciBwcm9wTmFtZTtcblxuICAvLyBSZXNlcnZlZCBuYW1lcyBhcmUgZXh0cmFjdGVkXG4gIHZhciBwcm9wcyA9IHt9O1xuXG4gIHZhciBrZXkgPSBudWxsO1xuICB2YXIgcmVmID0gbnVsbDtcbiAgdmFyIHNlbGYgPSBudWxsO1xuICB2YXIgc291cmNlID0gbnVsbDtcblxuICBpZiAoY29uZmlnICE9IG51bGwpIHtcbiAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgICAgcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyA/IHdhcm5pbmcoXG4gICAgICAvKiBlc2xpbnQtZGlzYWJsZSBuby1wcm90byAqL1xuICAgICAgY29uZmlnLl9fcHJvdG9fXyA9PSBudWxsIHx8IGNvbmZpZy5fX3Byb3RvX18gPT09IE9iamVjdC5wcm90b3R5cGUsXG4gICAgICAvKiBlc2xpbnQtZW5hYmxlIG5vLXByb3RvICovXG4gICAgICAnUmVhY3QuY3JlYXRlRWxlbWVudCguLi4pOiBFeHBlY3RlZCBwcm9wcyBhcmd1bWVudCB0byBiZSBhIHBsYWluIG9iamVjdC4gJyArICdQcm9wZXJ0aWVzIGRlZmluZWQgaW4gaXRzIHByb3RvdHlwZSBjaGFpbiB3aWxsIGJlIGlnbm9yZWQuJykgOiB2b2lkIDA7XG4gICAgfVxuXG4gICAgaWYgKGhhc1ZhbGlkUmVmKGNvbmZpZykpIHtcbiAgICAgIHJlZiA9IGNvbmZpZy5yZWY7XG4gICAgfVxuICAgIGlmIChoYXNWYWxpZEtleShjb25maWcpKSB7XG4gICAgICBrZXkgPSAnJyArIGNvbmZpZy5rZXk7XG4gICAgfVxuXG4gICAgc2VsZiA9IGNvbmZpZy5fX3NlbGYgPT09IHVuZGVmaW5lZCA/IG51bGwgOiBjb25maWcuX19zZWxmO1xuICAgIHNvdXJjZSA9IGNvbmZpZy5fX3NvdXJjZSA9PT0gdW5kZWZpbmVkID8gbnVsbCA6IGNvbmZpZy5fX3NvdXJjZTtcbiAgICAvLyBSZW1haW5pbmcgcHJvcGVydGllcyBhcmUgYWRkZWQgdG8gYSBuZXcgcHJvcHMgb2JqZWN0XG4gICAgZm9yIChwcm9wTmFtZSBpbiBjb25maWcpIHtcbiAgICAgIGlmIChoYXNPd25Qcm9wZXJ0eS5jYWxsKGNvbmZpZywgcHJvcE5hbWUpICYmICFSRVNFUlZFRF9QUk9QUy5oYXNPd25Qcm9wZXJ0eShwcm9wTmFtZSkpIHtcbiAgICAgICAgcHJvcHNbcHJvcE5hbWVdID0gY29uZmlnW3Byb3BOYW1lXTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyBDaGlsZHJlbiBjYW4gYmUgbW9yZSB0aGFuIG9uZSBhcmd1bWVudCwgYW5kIHRob3NlIGFyZSB0cmFuc2ZlcnJlZCBvbnRvXG4gIC8vIHRoZSBuZXdseSBhbGxvY2F0ZWQgcHJvcHMgb2JqZWN0LlxuICB2YXIgY2hpbGRyZW5MZW5ndGggPSBhcmd1bWVudHMubGVuZ3RoIC0gMjtcbiAgaWYgKGNoaWxkcmVuTGVuZ3RoID09PSAxKSB7XG4gICAgcHJvcHMuY2hpbGRyZW4gPSBjaGlsZHJlbjtcbiAgfSBlbHNlIGlmIChjaGlsZHJlbkxlbmd0aCA+IDEpIHtcbiAgICB2YXIgY2hpbGRBcnJheSA9IEFycmF5KGNoaWxkcmVuTGVuZ3RoKTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNoaWxkcmVuTGVuZ3RoOyBpKyspIHtcbiAgICAgIGNoaWxkQXJyYXlbaV0gPSBhcmd1bWVudHNbaSArIDJdO1xuICAgIH1cbiAgICBwcm9wcy5jaGlsZHJlbiA9IGNoaWxkQXJyYXk7XG4gIH1cblxuICAvLyBSZXNvbHZlIGRlZmF1bHQgcHJvcHNcbiAgaWYgKHR5cGUgJiYgdHlwZS5kZWZhdWx0UHJvcHMpIHtcbiAgICB2YXIgZGVmYXVsdFByb3BzID0gdHlwZS5kZWZhdWx0UHJvcHM7XG4gICAgZm9yIChwcm9wTmFtZSBpbiBkZWZhdWx0UHJvcHMpIHtcbiAgICAgIGlmIChwcm9wc1twcm9wTmFtZV0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICBwcm9wc1twcm9wTmFtZV0gPSBkZWZhdWx0UHJvcHNbcHJvcE5hbWVdO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgIGlmIChrZXkgfHwgcmVmKSB7XG4gICAgICBpZiAodHlwZW9mIHByb3BzLiQkdHlwZW9mID09PSAndW5kZWZpbmVkJyB8fCBwcm9wcy4kJHR5cGVvZiAhPT0gUkVBQ1RfRUxFTUVOVF9UWVBFKSB7XG4gICAgICAgIHZhciBkaXNwbGF5TmFtZSA9IHR5cGVvZiB0eXBlID09PSAnZnVuY3Rpb24nID8gdHlwZS5kaXNwbGF5TmFtZSB8fCB0eXBlLm5hbWUgfHwgJ1Vua25vd24nIDogdHlwZTtcbiAgICAgICAgaWYgKGtleSkge1xuICAgICAgICAgIGRlZmluZUtleVByb3BXYXJuaW5nR2V0dGVyKHByb3BzLCBkaXNwbGF5TmFtZSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHJlZikge1xuICAgICAgICAgIGRlZmluZVJlZlByb3BXYXJuaW5nR2V0dGVyKHByb3BzLCBkaXNwbGF5TmFtZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIFJlYWN0RWxlbWVudCh0eXBlLCBrZXksIHJlZiwgc2VsZiwgc291cmNlLCBSZWFjdEN1cnJlbnRPd25lci5jdXJyZW50LCBwcm9wcyk7XG59O1xuXG4vKipcbiAqIFJldHVybiBhIGZ1bmN0aW9uIHRoYXQgcHJvZHVjZXMgUmVhY3RFbGVtZW50cyBvZiBhIGdpdmVuIHR5cGUuXG4gKiBTZWUgaHR0cHM6Ly9mYWNlYm9vay5naXRodWIuaW8vcmVhY3QvZG9jcy90b3AtbGV2ZWwtYXBpLmh0bWwjcmVhY3QuY3JlYXRlZmFjdG9yeVxuICovXG5SZWFjdEVsZW1lbnQuY3JlYXRlRmFjdG9yeSA9IGZ1bmN0aW9uICh0eXBlKSB7XG4gIHZhciBmYWN0b3J5ID0gUmVhY3RFbGVtZW50LmNyZWF0ZUVsZW1lbnQuYmluZChudWxsLCB0eXBlKTtcbiAgLy8gRXhwb3NlIHRoZSB0eXBlIG9uIHRoZSBmYWN0b3J5IGFuZCB0aGUgcHJvdG90eXBlIHNvIHRoYXQgaXQgY2FuIGJlXG4gIC8vIGVhc2lseSBhY2Nlc3NlZCBvbiBlbGVtZW50cy4gRS5nLiBgPEZvbyAvPi50eXBlID09PSBGb29gLlxuICAvLyBUaGlzIHNob3VsZCBub3QgYmUgbmFtZWQgYGNvbnN0cnVjdG9yYCBzaW5jZSB0aGlzIG1heSBub3QgYmUgdGhlIGZ1bmN0aW9uXG4gIC8vIHRoYXQgY3JlYXRlZCB0aGUgZWxlbWVudCwgYW5kIGl0IG1heSBub3QgZXZlbiBiZSBhIGNvbnN0cnVjdG9yLlxuICAvLyBMZWdhY3kgaG9vayBUT0RPOiBXYXJuIGlmIHRoaXMgaXMgYWNjZXNzZWRcbiAgZmFjdG9yeS50eXBlID0gdHlwZTtcbiAgcmV0dXJuIGZhY3Rvcnk7XG59O1xuXG5SZWFjdEVsZW1lbnQuY2xvbmVBbmRSZXBsYWNlS2V5ID0gZnVuY3Rpb24gKG9sZEVsZW1lbnQsIG5ld0tleSkge1xuICB2YXIgbmV3RWxlbWVudCA9IFJlYWN0RWxlbWVudChvbGRFbGVtZW50LnR5cGUsIG5ld0tleSwgb2xkRWxlbWVudC5yZWYsIG9sZEVsZW1lbnQuX3NlbGYsIG9sZEVsZW1lbnQuX3NvdXJjZSwgb2xkRWxlbWVudC5fb3duZXIsIG9sZEVsZW1lbnQucHJvcHMpO1xuXG4gIHJldHVybiBuZXdFbGVtZW50O1xufTtcblxuLyoqXG4gKiBDbG9uZSBhbmQgcmV0dXJuIGEgbmV3IFJlYWN0RWxlbWVudCB1c2luZyBlbGVtZW50IGFzIHRoZSBzdGFydGluZyBwb2ludC5cbiAqIFNlZSBodHRwczovL2ZhY2Vib29rLmdpdGh1Yi5pby9yZWFjdC9kb2NzL3RvcC1sZXZlbC1hcGkuaHRtbCNyZWFjdC5jbG9uZWVsZW1lbnRcbiAqL1xuUmVhY3RFbGVtZW50LmNsb25lRWxlbWVudCA9IGZ1bmN0aW9uIChlbGVtZW50LCBjb25maWcsIGNoaWxkcmVuKSB7XG4gIHZhciBwcm9wTmFtZTtcblxuICAvLyBPcmlnaW5hbCBwcm9wcyBhcmUgY29waWVkXG4gIHZhciBwcm9wcyA9IF9hc3NpZ24oe30sIGVsZW1lbnQucHJvcHMpO1xuXG4gIC8vIFJlc2VydmVkIG5hbWVzIGFyZSBleHRyYWN0ZWRcbiAgdmFyIGtleSA9IGVsZW1lbnQua2V5O1xuICB2YXIgcmVmID0gZWxlbWVudC5yZWY7XG4gIC8vIFNlbGYgaXMgcHJlc2VydmVkIHNpbmNlIHRoZSBvd25lciBpcyBwcmVzZXJ2ZWQuXG4gIHZhciBzZWxmID0gZWxlbWVudC5fc2VsZjtcbiAgLy8gU291cmNlIGlzIHByZXNlcnZlZCBzaW5jZSBjbG9uZUVsZW1lbnQgaXMgdW5saWtlbHkgdG8gYmUgdGFyZ2V0ZWQgYnkgYVxuICAvLyB0cmFuc3BpbGVyLCBhbmQgdGhlIG9yaWdpbmFsIHNvdXJjZSBpcyBwcm9iYWJseSBhIGJldHRlciBpbmRpY2F0b3Igb2YgdGhlXG4gIC8vIHRydWUgb3duZXIuXG4gIHZhciBzb3VyY2UgPSBlbGVtZW50Ll9zb3VyY2U7XG5cbiAgLy8gT3duZXIgd2lsbCBiZSBwcmVzZXJ2ZWQsIHVubGVzcyByZWYgaXMgb3ZlcnJpZGRlblxuICB2YXIgb3duZXIgPSBlbGVtZW50Ll9vd25lcjtcblxuICBpZiAoY29uZmlnICE9IG51bGwpIHtcbiAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgICAgcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyA/IHdhcm5pbmcoXG4gICAgICAvKiBlc2xpbnQtZGlzYWJsZSBuby1wcm90byAqL1xuICAgICAgY29uZmlnLl9fcHJvdG9fXyA9PSBudWxsIHx8IGNvbmZpZy5fX3Byb3RvX18gPT09IE9iamVjdC5wcm90b3R5cGUsXG4gICAgICAvKiBlc2xpbnQtZW5hYmxlIG5vLXByb3RvICovXG4gICAgICAnUmVhY3QuY2xvbmVFbGVtZW50KC4uLik6IEV4cGVjdGVkIHByb3BzIGFyZ3VtZW50IHRvIGJlIGEgcGxhaW4gb2JqZWN0LiAnICsgJ1Byb3BlcnRpZXMgZGVmaW5lZCBpbiBpdHMgcHJvdG90eXBlIGNoYWluIHdpbGwgYmUgaWdub3JlZC4nKSA6IHZvaWQgMDtcbiAgICB9XG5cbiAgICBpZiAoaGFzVmFsaWRSZWYoY29uZmlnKSkge1xuICAgICAgLy8gU2lsZW50bHkgc3RlYWwgdGhlIHJlZiBmcm9tIHRoZSBwYXJlbnQuXG4gICAgICByZWYgPSBjb25maWcucmVmO1xuICAgICAgb3duZXIgPSBSZWFjdEN1cnJlbnRPd25lci5jdXJyZW50O1xuICAgIH1cbiAgICBpZiAoaGFzVmFsaWRLZXkoY29uZmlnKSkge1xuICAgICAga2V5ID0gJycgKyBjb25maWcua2V5O1xuICAgIH1cblxuICAgIC8vIFJlbWFpbmluZyBwcm9wZXJ0aWVzIG92ZXJyaWRlIGV4aXN0aW5nIHByb3BzXG4gICAgdmFyIGRlZmF1bHRQcm9wcztcbiAgICBpZiAoZWxlbWVudC50eXBlICYmIGVsZW1lbnQudHlwZS5kZWZhdWx0UHJvcHMpIHtcbiAgICAgIGRlZmF1bHRQcm9wcyA9IGVsZW1lbnQudHlwZS5kZWZhdWx0UHJvcHM7XG4gICAgfVxuICAgIGZvciAocHJvcE5hbWUgaW4gY29uZmlnKSB7XG4gICAgICBpZiAoaGFzT3duUHJvcGVydHkuY2FsbChjb25maWcsIHByb3BOYW1lKSAmJiAhUkVTRVJWRURfUFJPUFMuaGFzT3duUHJvcGVydHkocHJvcE5hbWUpKSB7XG4gICAgICAgIGlmIChjb25maWdbcHJvcE5hbWVdID09PSB1bmRlZmluZWQgJiYgZGVmYXVsdFByb3BzICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAvLyBSZXNvbHZlIGRlZmF1bHQgcHJvcHNcbiAgICAgICAgICBwcm9wc1twcm9wTmFtZV0gPSBkZWZhdWx0UHJvcHNbcHJvcE5hbWVdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHByb3BzW3Byb3BOYW1lXSA9IGNvbmZpZ1twcm9wTmFtZV07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyBDaGlsZHJlbiBjYW4gYmUgbW9yZSB0aGFuIG9uZSBhcmd1bWVudCwgYW5kIHRob3NlIGFyZSB0cmFuc2ZlcnJlZCBvbnRvXG4gIC8vIHRoZSBuZXdseSBhbGxvY2F0ZWQgcHJvcHMgb2JqZWN0LlxuICB2YXIgY2hpbGRyZW5MZW5ndGggPSBhcmd1bWVudHMubGVuZ3RoIC0gMjtcbiAgaWYgKGNoaWxkcmVuTGVuZ3RoID09PSAxKSB7XG4gICAgcHJvcHMuY2hpbGRyZW4gPSBjaGlsZHJlbjtcbiAgfSBlbHNlIGlmIChjaGlsZHJlbkxlbmd0aCA+IDEpIHtcbiAgICB2YXIgY2hpbGRBcnJheSA9IEFycmF5KGNoaWxkcmVuTGVuZ3RoKTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNoaWxkcmVuTGVuZ3RoOyBpKyspIHtcbiAgICAgIGNoaWxkQXJyYXlbaV0gPSBhcmd1bWVudHNbaSArIDJdO1xuICAgIH1cbiAgICBwcm9wcy5jaGlsZHJlbiA9IGNoaWxkQXJyYXk7XG4gIH1cblxuICByZXR1cm4gUmVhY3RFbGVtZW50KGVsZW1lbnQudHlwZSwga2V5LCByZWYsIHNlbGYsIHNvdXJjZSwgb3duZXIsIHByb3BzKTtcbn07XG5cbi8qKlxuICogVmVyaWZpZXMgdGhlIG9iamVjdCBpcyBhIFJlYWN0RWxlbWVudC5cbiAqIFNlZSBodHRwczovL2ZhY2Vib29rLmdpdGh1Yi5pby9yZWFjdC9kb2NzL3RvcC1sZXZlbC1hcGkuaHRtbCNyZWFjdC5pc3ZhbGlkZWxlbWVudFxuICogQHBhcmFtIHs/b2JqZWN0fSBvYmplY3RcbiAqIEByZXR1cm4ge2Jvb2xlYW59IFRydWUgaWYgYG9iamVjdGAgaXMgYSB2YWxpZCBjb21wb25lbnQuXG4gKiBAZmluYWxcbiAqL1xuUmVhY3RFbGVtZW50LmlzVmFsaWRFbGVtZW50ID0gZnVuY3Rpb24gKG9iamVjdCkge1xuICByZXR1cm4gdHlwZW9mIG9iamVjdCA9PT0gJ29iamVjdCcgJiYgb2JqZWN0ICE9PSBudWxsICYmIG9iamVjdC4kJHR5cGVvZiA9PT0gUkVBQ1RfRUxFTUVOVF9UWVBFO1xufTtcblxuUmVhY3RFbGVtZW50LlJFQUNUX0VMRU1FTlRfVFlQRSA9IFJFQUNUX0VMRU1FTlRfVFlQRTtcblxubW9kdWxlLmV4cG9ydHMgPSBSZWFjdEVsZW1lbnQ7IiwiLyoqXG4gKiBDb3B5cmlnaHQgMjAxNC1wcmVzZW50LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBCU0Qtc3R5bGUgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS4gQW4gYWRkaXRpb25hbCBncmFudFxuICogb2YgcGF0ZW50IHJpZ2h0cyBjYW4gYmUgZm91bmQgaW4gdGhlIFBBVEVOVFMgZmlsZSBpbiB0aGUgc2FtZSBkaXJlY3RvcnkuXG4gKlxuICogQHByb3ZpZGVzTW9kdWxlIFJlYWN0RWxlbWVudFZhbGlkYXRvclxuICovXG5cbi8qKlxuICogUmVhY3RFbGVtZW50VmFsaWRhdG9yIHByb3ZpZGVzIGEgd3JhcHBlciBhcm91bmQgYSBlbGVtZW50IGZhY3RvcnlcbiAqIHdoaWNoIHZhbGlkYXRlcyB0aGUgcHJvcHMgcGFzc2VkIHRvIHRoZSBlbGVtZW50LiBUaGlzIGlzIGludGVuZGVkIHRvIGJlXG4gKiB1c2VkIG9ubHkgaW4gREVWIGFuZCBjb3VsZCBiZSByZXBsYWNlZCBieSBhIHN0YXRpYyB0eXBlIGNoZWNrZXIgZm9yIGxhbmd1YWdlc1xuICogdGhhdCBzdXBwb3J0IGl0LlxuICovXG5cbid1c2Ugc3RyaWN0JztcblxudmFyIFJlYWN0Q3VycmVudE93bmVyID0gcmVxdWlyZSgnLi9SZWFjdEN1cnJlbnRPd25lcicpO1xudmFyIFJlYWN0Q29tcG9uZW50VHJlZUhvb2sgPSByZXF1aXJlKCcuL1JlYWN0Q29tcG9uZW50VHJlZUhvb2snKTtcbnZhciBSZWFjdEVsZW1lbnQgPSByZXF1aXJlKCcuL1JlYWN0RWxlbWVudCcpO1xudmFyIFJlYWN0UHJvcFR5cGVMb2NhdGlvbnMgPSByZXF1aXJlKCcuL1JlYWN0UHJvcFR5cGVMb2NhdGlvbnMnKTtcblxudmFyIGNoZWNrUmVhY3RUeXBlU3BlYyA9IHJlcXVpcmUoJy4vY2hlY2tSZWFjdFR5cGVTcGVjJyk7XG5cbnZhciBjYW5EZWZpbmVQcm9wZXJ0eSA9IHJlcXVpcmUoJy4vY2FuRGVmaW5lUHJvcGVydHknKTtcbnZhciBnZXRJdGVyYXRvckZuID0gcmVxdWlyZSgnLi9nZXRJdGVyYXRvckZuJyk7XG52YXIgd2FybmluZyA9IHJlcXVpcmUoJ2ZianMvbGliL3dhcm5pbmcnKTtcblxuZnVuY3Rpb24gZ2V0RGVjbGFyYXRpb25FcnJvckFkZGVuZHVtKCkge1xuICBpZiAoUmVhY3RDdXJyZW50T3duZXIuY3VycmVudCkge1xuICAgIHZhciBuYW1lID0gUmVhY3RDdXJyZW50T3duZXIuY3VycmVudC5nZXROYW1lKCk7XG4gICAgaWYgKG5hbWUpIHtcbiAgICAgIHJldHVybiAnIENoZWNrIHRoZSByZW5kZXIgbWV0aG9kIG9mIGAnICsgbmFtZSArICdgLic7XG4gICAgfVxuICB9XG4gIHJldHVybiAnJztcbn1cblxuLyoqXG4gKiBXYXJuIGlmIHRoZXJlJ3Mgbm8ga2V5IGV4cGxpY2l0bHkgc2V0IG9uIGR5bmFtaWMgYXJyYXlzIG9mIGNoaWxkcmVuIG9yXG4gKiBvYmplY3Qga2V5cyBhcmUgbm90IHZhbGlkLiBUaGlzIGFsbG93cyB1cyB0byBrZWVwIHRyYWNrIG9mIGNoaWxkcmVuIGJldHdlZW5cbiAqIHVwZGF0ZXMuXG4gKi9cbnZhciBvd25lckhhc0tleVVzZVdhcm5pbmcgPSB7fTtcblxuZnVuY3Rpb24gZ2V0Q3VycmVudENvbXBvbmVudEVycm9ySW5mbyhwYXJlbnRUeXBlKSB7XG4gIHZhciBpbmZvID0gZ2V0RGVjbGFyYXRpb25FcnJvckFkZGVuZHVtKCk7XG5cbiAgaWYgKCFpbmZvKSB7XG4gICAgdmFyIHBhcmVudE5hbWUgPSB0eXBlb2YgcGFyZW50VHlwZSA9PT0gJ3N0cmluZycgPyBwYXJlbnRUeXBlIDogcGFyZW50VHlwZS5kaXNwbGF5TmFtZSB8fCBwYXJlbnRUeXBlLm5hbWU7XG4gICAgaWYgKHBhcmVudE5hbWUpIHtcbiAgICAgIGluZm8gPSAnIENoZWNrIHRoZSB0b3AtbGV2ZWwgcmVuZGVyIGNhbGwgdXNpbmcgPCcgKyBwYXJlbnROYW1lICsgJz4uJztcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGluZm87XG59XG5cbi8qKlxuICogV2FybiBpZiB0aGUgZWxlbWVudCBkb2Vzbid0IGhhdmUgYW4gZXhwbGljaXQga2V5IGFzc2lnbmVkIHRvIGl0LlxuICogVGhpcyBlbGVtZW50IGlzIGluIGFuIGFycmF5LiBUaGUgYXJyYXkgY291bGQgZ3JvdyBhbmQgc2hyaW5rIG9yIGJlXG4gKiByZW9yZGVyZWQuIEFsbCBjaGlsZHJlbiB0aGF0IGhhdmVuJ3QgYWxyZWFkeSBiZWVuIHZhbGlkYXRlZCBhcmUgcmVxdWlyZWQgdG9cbiAqIGhhdmUgYSBcImtleVwiIHByb3BlcnR5IGFzc2lnbmVkIHRvIGl0LiBFcnJvciBzdGF0dXNlcyBhcmUgY2FjaGVkIHNvIGEgd2FybmluZ1xuICogd2lsbCBvbmx5IGJlIHNob3duIG9uY2UuXG4gKlxuICogQGludGVybmFsXG4gKiBAcGFyYW0ge1JlYWN0RWxlbWVudH0gZWxlbWVudCBFbGVtZW50IHRoYXQgcmVxdWlyZXMgYSBrZXkuXG4gKiBAcGFyYW0geyp9IHBhcmVudFR5cGUgZWxlbWVudCdzIHBhcmVudCdzIHR5cGUuXG4gKi9cbmZ1bmN0aW9uIHZhbGlkYXRlRXhwbGljaXRLZXkoZWxlbWVudCwgcGFyZW50VHlwZSkge1xuICBpZiAoIWVsZW1lbnQuX3N0b3JlIHx8IGVsZW1lbnQuX3N0b3JlLnZhbGlkYXRlZCB8fCBlbGVtZW50LmtleSAhPSBudWxsKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGVsZW1lbnQuX3N0b3JlLnZhbGlkYXRlZCA9IHRydWU7XG5cbiAgdmFyIG1lbW9pemVyID0gb3duZXJIYXNLZXlVc2VXYXJuaW5nLnVuaXF1ZUtleSB8fCAob3duZXJIYXNLZXlVc2VXYXJuaW5nLnVuaXF1ZUtleSA9IHt9KTtcblxuICB2YXIgY3VycmVudENvbXBvbmVudEVycm9ySW5mbyA9IGdldEN1cnJlbnRDb21wb25lbnRFcnJvckluZm8ocGFyZW50VHlwZSk7XG4gIGlmIChtZW1vaXplcltjdXJyZW50Q29tcG9uZW50RXJyb3JJbmZvXSkge1xuICAgIHJldHVybjtcbiAgfVxuICBtZW1vaXplcltjdXJyZW50Q29tcG9uZW50RXJyb3JJbmZvXSA9IHRydWU7XG5cbiAgLy8gVXN1YWxseSB0aGUgY3VycmVudCBvd25lciBpcyB0aGUgb2ZmZW5kZXIsIGJ1dCBpZiBpdCBhY2NlcHRzIGNoaWxkcmVuIGFzIGFcbiAgLy8gcHJvcGVydHksIGl0IG1heSBiZSB0aGUgY3JlYXRvciBvZiB0aGUgY2hpbGQgdGhhdCdzIHJlc3BvbnNpYmxlIGZvclxuICAvLyBhc3NpZ25pbmcgaXQgYSBrZXkuXG4gIHZhciBjaGlsZE93bmVyID0gJyc7XG4gIGlmIChlbGVtZW50ICYmIGVsZW1lbnQuX293bmVyICYmIGVsZW1lbnQuX293bmVyICE9PSBSZWFjdEN1cnJlbnRPd25lci5jdXJyZW50KSB7XG4gICAgLy8gR2l2ZSB0aGUgY29tcG9uZW50IHRoYXQgb3JpZ2luYWxseSBjcmVhdGVkIHRoaXMgY2hpbGQuXG4gICAgY2hpbGRPd25lciA9ICcgSXQgd2FzIHBhc3NlZCBhIGNoaWxkIGZyb20gJyArIGVsZW1lbnQuX293bmVyLmdldE5hbWUoKSArICcuJztcbiAgfVxuXG4gIHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgPyB3YXJuaW5nKGZhbHNlLCAnRWFjaCBjaGlsZCBpbiBhbiBhcnJheSBvciBpdGVyYXRvciBzaG91bGQgaGF2ZSBhIHVuaXF1ZSBcImtleVwiIHByb3AuJyArICclcyVzIFNlZSBodHRwczovL2ZiLm1lL3JlYWN0LXdhcm5pbmcta2V5cyBmb3IgbW9yZSBpbmZvcm1hdGlvbi4lcycsIGN1cnJlbnRDb21wb25lbnRFcnJvckluZm8sIGNoaWxkT3duZXIsIFJlYWN0Q29tcG9uZW50VHJlZUhvb2suZ2V0Q3VycmVudFN0YWNrQWRkZW5kdW0oZWxlbWVudCkpIDogdm9pZCAwO1xufVxuXG4vKipcbiAqIEVuc3VyZSB0aGF0IGV2ZXJ5IGVsZW1lbnQgZWl0aGVyIGlzIHBhc3NlZCBpbiBhIHN0YXRpYyBsb2NhdGlvbiwgaW4gYW5cbiAqIGFycmF5IHdpdGggYW4gZXhwbGljaXQga2V5cyBwcm9wZXJ0eSBkZWZpbmVkLCBvciBpbiBhbiBvYmplY3QgbGl0ZXJhbFxuICogd2l0aCB2YWxpZCBrZXkgcHJvcGVydHkuXG4gKlxuICogQGludGVybmFsXG4gKiBAcGFyYW0ge1JlYWN0Tm9kZX0gbm9kZSBTdGF0aWNhbGx5IHBhc3NlZCBjaGlsZCBvZiBhbnkgdHlwZS5cbiAqIEBwYXJhbSB7Kn0gcGFyZW50VHlwZSBub2RlJ3MgcGFyZW50J3MgdHlwZS5cbiAqL1xuZnVuY3Rpb24gdmFsaWRhdGVDaGlsZEtleXMobm9kZSwgcGFyZW50VHlwZSkge1xuICBpZiAodHlwZW9mIG5vZGUgIT09ICdvYmplY3QnKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGlmIChBcnJheS5pc0FycmF5KG5vZGUpKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBub2RlLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgY2hpbGQgPSBub2RlW2ldO1xuICAgICAgaWYgKFJlYWN0RWxlbWVudC5pc1ZhbGlkRWxlbWVudChjaGlsZCkpIHtcbiAgICAgICAgdmFsaWRhdGVFeHBsaWNpdEtleShjaGlsZCwgcGFyZW50VHlwZSk7XG4gICAgICB9XG4gICAgfVxuICB9IGVsc2UgaWYgKFJlYWN0RWxlbWVudC5pc1ZhbGlkRWxlbWVudChub2RlKSkge1xuICAgIC8vIFRoaXMgZWxlbWVudCB3YXMgcGFzc2VkIGluIGEgdmFsaWQgbG9jYXRpb24uXG4gICAgaWYgKG5vZGUuX3N0b3JlKSB7XG4gICAgICBub2RlLl9zdG9yZS52YWxpZGF0ZWQgPSB0cnVlO1xuICAgIH1cbiAgfSBlbHNlIGlmIChub2RlKSB7XG4gICAgdmFyIGl0ZXJhdG9yRm4gPSBnZXRJdGVyYXRvckZuKG5vZGUpO1xuICAgIC8vIEVudHJ5IGl0ZXJhdG9ycyBwcm92aWRlIGltcGxpY2l0IGtleXMuXG4gICAgaWYgKGl0ZXJhdG9yRm4pIHtcbiAgICAgIGlmIChpdGVyYXRvckZuICE9PSBub2RlLmVudHJpZXMpIHtcbiAgICAgICAgdmFyIGl0ZXJhdG9yID0gaXRlcmF0b3JGbi5jYWxsKG5vZGUpO1xuICAgICAgICB2YXIgc3RlcDtcbiAgICAgICAgd2hpbGUgKCEoc3RlcCA9IGl0ZXJhdG9yLm5leHQoKSkuZG9uZSkge1xuICAgICAgICAgIGlmIChSZWFjdEVsZW1lbnQuaXNWYWxpZEVsZW1lbnQoc3RlcC52YWx1ZSkpIHtcbiAgICAgICAgICAgIHZhbGlkYXRlRXhwbGljaXRLZXkoc3RlcC52YWx1ZSwgcGFyZW50VHlwZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogR2l2ZW4gYW4gZWxlbWVudCwgdmFsaWRhdGUgdGhhdCBpdHMgcHJvcHMgZm9sbG93IHRoZSBwcm9wVHlwZXMgZGVmaW5pdGlvbixcbiAqIHByb3ZpZGVkIGJ5IHRoZSB0eXBlLlxuICpcbiAqIEBwYXJhbSB7UmVhY3RFbGVtZW50fSBlbGVtZW50XG4gKi9cbmZ1bmN0aW9uIHZhbGlkYXRlUHJvcFR5cGVzKGVsZW1lbnQpIHtcbiAgdmFyIGNvbXBvbmVudENsYXNzID0gZWxlbWVudC50eXBlO1xuICBpZiAodHlwZW9mIGNvbXBvbmVudENsYXNzICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIHZhciBuYW1lID0gY29tcG9uZW50Q2xhc3MuZGlzcGxheU5hbWUgfHwgY29tcG9uZW50Q2xhc3MubmFtZTtcbiAgaWYgKGNvbXBvbmVudENsYXNzLnByb3BUeXBlcykge1xuICAgIGNoZWNrUmVhY3RUeXBlU3BlYyhjb21wb25lbnRDbGFzcy5wcm9wVHlwZXMsIGVsZW1lbnQucHJvcHMsIFJlYWN0UHJvcFR5cGVMb2NhdGlvbnMucHJvcCwgbmFtZSwgZWxlbWVudCwgbnVsbCk7XG4gIH1cbiAgaWYgKHR5cGVvZiBjb21wb25lbnRDbGFzcy5nZXREZWZhdWx0UHJvcHMgPT09ICdmdW5jdGlvbicpIHtcbiAgICBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nID8gd2FybmluZyhjb21wb25lbnRDbGFzcy5nZXREZWZhdWx0UHJvcHMuaXNSZWFjdENsYXNzQXBwcm92ZWQsICdnZXREZWZhdWx0UHJvcHMgaXMgb25seSB1c2VkIG9uIGNsYXNzaWMgUmVhY3QuY3JlYXRlQ2xhc3MgJyArICdkZWZpbml0aW9ucy4gVXNlIGEgc3RhdGljIHByb3BlcnR5IG5hbWVkIGBkZWZhdWx0UHJvcHNgIGluc3RlYWQuJykgOiB2b2lkIDA7XG4gIH1cbn1cblxudmFyIFJlYWN0RWxlbWVudFZhbGlkYXRvciA9IHtcblxuICBjcmVhdGVFbGVtZW50OiBmdW5jdGlvbiAodHlwZSwgcHJvcHMsIGNoaWxkcmVuKSB7XG4gICAgdmFyIHZhbGlkVHlwZSA9IHR5cGVvZiB0eXBlID09PSAnc3RyaW5nJyB8fCB0eXBlb2YgdHlwZSA9PT0gJ2Z1bmN0aW9uJztcbiAgICAvLyBXZSB3YXJuIGluIHRoaXMgY2FzZSBidXQgZG9uJ3QgdGhyb3cuIFdlIGV4cGVjdCB0aGUgZWxlbWVudCBjcmVhdGlvbiB0b1xuICAgIC8vIHN1Y2NlZWQgYW5kIHRoZXJlIHdpbGwgbGlrZWx5IGJlIGVycm9ycyBpbiByZW5kZXIuXG4gICAgaWYgKCF2YWxpZFR5cGUpIHtcbiAgICAgIHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgPyB3YXJuaW5nKGZhbHNlLCAnUmVhY3QuY3JlYXRlRWxlbWVudDogdHlwZSBzaG91bGQgbm90IGJlIG51bGwsIHVuZGVmaW5lZCwgYm9vbGVhbiwgb3IgJyArICdudW1iZXIuIEl0IHNob3VsZCBiZSBhIHN0cmluZyAoZm9yIERPTSBlbGVtZW50cykgb3IgYSBSZWFjdENsYXNzICcgKyAnKGZvciBjb21wb3NpdGUgY29tcG9uZW50cykuJXMnLCBnZXREZWNsYXJhdGlvbkVycm9yQWRkZW5kdW0oKSkgOiB2b2lkIDA7XG4gICAgfVxuXG4gICAgdmFyIGVsZW1lbnQgPSBSZWFjdEVsZW1lbnQuY3JlYXRlRWxlbWVudC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuXG4gICAgLy8gVGhlIHJlc3VsdCBjYW4gYmUgbnVsbGlzaCBpZiBhIG1vY2sgb3IgYSBjdXN0b20gZnVuY3Rpb24gaXMgdXNlZC5cbiAgICAvLyBUT0RPOiBEcm9wIHRoaXMgd2hlbiB0aGVzZSBhcmUgbm8gbG9uZ2VyIGFsbG93ZWQgYXMgdGhlIHR5cGUgYXJndW1lbnQuXG4gICAgaWYgKGVsZW1lbnQgPT0gbnVsbCkge1xuICAgICAgcmV0dXJuIGVsZW1lbnQ7XG4gICAgfVxuXG4gICAgLy8gU2tpcCBrZXkgd2FybmluZyBpZiB0aGUgdHlwZSBpc24ndCB2YWxpZCBzaW5jZSBvdXIga2V5IHZhbGlkYXRpb24gbG9naWNcbiAgICAvLyBkb2Vzbid0IGV4cGVjdCBhIG5vbi1zdHJpbmcvZnVuY3Rpb24gdHlwZSBhbmQgY2FuIHRocm93IGNvbmZ1c2luZyBlcnJvcnMuXG4gICAgLy8gV2UgZG9uJ3Qgd2FudCBleGNlcHRpb24gYmVoYXZpb3IgdG8gZGlmZmVyIGJldHdlZW4gZGV2IGFuZCBwcm9kLlxuICAgIC8vIChSZW5kZXJpbmcgd2lsbCB0aHJvdyB3aXRoIGEgaGVscGZ1bCBtZXNzYWdlIGFuZCBhcyBzb29uIGFzIHRoZSB0eXBlIGlzXG4gICAgLy8gZml4ZWQsIHRoZSBrZXkgd2FybmluZ3Mgd2lsbCBhcHBlYXIuKVxuICAgIGlmICh2YWxpZFR5cGUpIHtcbiAgICAgIGZvciAodmFyIGkgPSAyOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhbGlkYXRlQ2hpbGRLZXlzKGFyZ3VtZW50c1tpXSwgdHlwZSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdmFsaWRhdGVQcm9wVHlwZXMoZWxlbWVudCk7XG5cbiAgICByZXR1cm4gZWxlbWVudDtcbiAgfSxcblxuICBjcmVhdGVGYWN0b3J5OiBmdW5jdGlvbiAodHlwZSkge1xuICAgIHZhciB2YWxpZGF0ZWRGYWN0b3J5ID0gUmVhY3RFbGVtZW50VmFsaWRhdG9yLmNyZWF0ZUVsZW1lbnQuYmluZChudWxsLCB0eXBlKTtcbiAgICAvLyBMZWdhY3kgaG9vayBUT0RPOiBXYXJuIGlmIHRoaXMgaXMgYWNjZXNzZWRcbiAgICB2YWxpZGF0ZWRGYWN0b3J5LnR5cGUgPSB0eXBlO1xuXG4gICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICAgIGlmIChjYW5EZWZpbmVQcm9wZXJ0eSkge1xuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodmFsaWRhdGVkRmFjdG9yeSwgJ3R5cGUnLCB7XG4gICAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nID8gd2FybmluZyhmYWxzZSwgJ0ZhY3RvcnkudHlwZSBpcyBkZXByZWNhdGVkLiBBY2Nlc3MgdGhlIGNsYXNzIGRpcmVjdGx5ICcgKyAnYmVmb3JlIHBhc3NpbmcgaXQgdG8gY3JlYXRlRmFjdG9yeS4nKSA6IHZvaWQgMDtcbiAgICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCAndHlwZScsIHtcbiAgICAgICAgICAgICAgdmFsdWU6IHR5cGVcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIHR5cGU7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdmFsaWRhdGVkRmFjdG9yeTtcbiAgfSxcblxuICBjbG9uZUVsZW1lbnQ6IGZ1bmN0aW9uIChlbGVtZW50LCBwcm9wcywgY2hpbGRyZW4pIHtcbiAgICB2YXIgbmV3RWxlbWVudCA9IFJlYWN0RWxlbWVudC5jbG9uZUVsZW1lbnQuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICBmb3IgKHZhciBpID0gMjsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFsaWRhdGVDaGlsZEtleXMoYXJndW1lbnRzW2ldLCBuZXdFbGVtZW50LnR5cGUpO1xuICAgIH1cbiAgICB2YWxpZGF0ZVByb3BUeXBlcyhuZXdFbGVtZW50KTtcbiAgICByZXR1cm4gbmV3RWxlbWVudDtcbiAgfVxuXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFJlYWN0RWxlbWVudFZhbGlkYXRvcjsiLCIvKipcbiAqIENvcHlyaWdodCAyMDE1LXByZXNlbnQsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIEJTRC1zdHlsZSBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLiBBbiBhZGRpdGlvbmFsIGdyYW50XG4gKiBvZiBwYXRlbnQgcmlnaHRzIGNhbiBiZSBmb3VuZCBpbiB0aGUgUEFURU5UUyBmaWxlIGluIHRoZSBzYW1lIGRpcmVjdG9yeS5cbiAqXG4gKiBAcHJvdmlkZXNNb2R1bGUgUmVhY3ROb29wVXBkYXRlUXVldWVcbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbnZhciB3YXJuaW5nID0gcmVxdWlyZSgnZmJqcy9saWIvd2FybmluZycpO1xuXG5mdW5jdGlvbiB3YXJuTm9vcChwdWJsaWNJbnN0YW5jZSwgY2FsbGVyTmFtZSkge1xuICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgIHZhciBjb25zdHJ1Y3RvciA9IHB1YmxpY0luc3RhbmNlLmNvbnN0cnVjdG9yO1xuICAgIHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgPyB3YXJuaW5nKGZhbHNlLCAnJXMoLi4uKTogQ2FuIG9ubHkgdXBkYXRlIGEgbW91bnRlZCBvciBtb3VudGluZyBjb21wb25lbnQuICcgKyAnVGhpcyB1c3VhbGx5IG1lYW5zIHlvdSBjYWxsZWQgJXMoKSBvbiBhbiB1bm1vdW50ZWQgY29tcG9uZW50LiAnICsgJ1RoaXMgaXMgYSBuby1vcC4gUGxlYXNlIGNoZWNrIHRoZSBjb2RlIGZvciB0aGUgJXMgY29tcG9uZW50LicsIGNhbGxlck5hbWUsIGNhbGxlck5hbWUsIGNvbnN0cnVjdG9yICYmIChjb25zdHJ1Y3Rvci5kaXNwbGF5TmFtZSB8fCBjb25zdHJ1Y3Rvci5uYW1lKSB8fCAnUmVhY3RDbGFzcycpIDogdm9pZCAwO1xuICB9XG59XG5cbi8qKlxuICogVGhpcyBpcyB0aGUgYWJzdHJhY3QgQVBJIGZvciBhbiB1cGRhdGUgcXVldWUuXG4gKi9cbnZhciBSZWFjdE5vb3BVcGRhdGVRdWV1ZSA9IHtcblxuICAvKipcbiAgICogQ2hlY2tzIHdoZXRoZXIgb3Igbm90IHRoaXMgY29tcG9zaXRlIGNvbXBvbmVudCBpcyBtb3VudGVkLlxuICAgKiBAcGFyYW0ge1JlYWN0Q2xhc3N9IHB1YmxpY0luc3RhbmNlIFRoZSBpbnN0YW5jZSB3ZSB3YW50IHRvIHRlc3QuXG4gICAqIEByZXR1cm4ge2Jvb2xlYW59IFRydWUgaWYgbW91bnRlZCwgZmFsc2Ugb3RoZXJ3aXNlLlxuICAgKiBAcHJvdGVjdGVkXG4gICAqIEBmaW5hbFxuICAgKi9cbiAgaXNNb3VudGVkOiBmdW5jdGlvbiAocHVibGljSW5zdGFuY2UpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH0sXG5cbiAgLyoqXG4gICAqIEVucXVldWUgYSBjYWxsYmFjayB0aGF0IHdpbGwgYmUgZXhlY3V0ZWQgYWZ0ZXIgYWxsIHRoZSBwZW5kaW5nIHVwZGF0ZXNcbiAgICogaGF2ZSBwcm9jZXNzZWQuXG4gICAqXG4gICAqIEBwYXJhbSB7UmVhY3RDbGFzc30gcHVibGljSW5zdGFuY2UgVGhlIGluc3RhbmNlIHRvIHVzZSBhcyBgdGhpc2AgY29udGV4dC5cbiAgICogQHBhcmFtIHs/ZnVuY3Rpb259IGNhbGxiYWNrIENhbGxlZCBhZnRlciBzdGF0ZSBpcyB1cGRhdGVkLlxuICAgKiBAaW50ZXJuYWxcbiAgICovXG4gIGVucXVldWVDYWxsYmFjazogZnVuY3Rpb24gKHB1YmxpY0luc3RhbmNlLCBjYWxsYmFjaykge30sXG5cbiAgLyoqXG4gICAqIEZvcmNlcyBhbiB1cGRhdGUuIFRoaXMgc2hvdWxkIG9ubHkgYmUgaW52b2tlZCB3aGVuIGl0IGlzIGtub3duIHdpdGhcbiAgICogY2VydGFpbnR5IHRoYXQgd2UgYXJlICoqbm90KiogaW4gYSBET00gdHJhbnNhY3Rpb24uXG4gICAqXG4gICAqIFlvdSBtYXkgd2FudCB0byBjYWxsIHRoaXMgd2hlbiB5b3Uga25vdyB0aGF0IHNvbWUgZGVlcGVyIGFzcGVjdCBvZiB0aGVcbiAgICogY29tcG9uZW50J3Mgc3RhdGUgaGFzIGNoYW5nZWQgYnV0IGBzZXRTdGF0ZWAgd2FzIG5vdCBjYWxsZWQuXG4gICAqXG4gICAqIFRoaXMgd2lsbCBub3QgaW52b2tlIGBzaG91bGRDb21wb25lbnRVcGRhdGVgLCBidXQgaXQgd2lsbCBpbnZva2VcbiAgICogYGNvbXBvbmVudFdpbGxVcGRhdGVgIGFuZCBgY29tcG9uZW50RGlkVXBkYXRlYC5cbiAgICpcbiAgICogQHBhcmFtIHtSZWFjdENsYXNzfSBwdWJsaWNJbnN0YW5jZSBUaGUgaW5zdGFuY2UgdGhhdCBzaG91bGQgcmVyZW5kZXIuXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgZW5xdWV1ZUZvcmNlVXBkYXRlOiBmdW5jdGlvbiAocHVibGljSW5zdGFuY2UpIHtcbiAgICB3YXJuTm9vcChwdWJsaWNJbnN0YW5jZSwgJ2ZvcmNlVXBkYXRlJyk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIFJlcGxhY2VzIGFsbCBvZiB0aGUgc3RhdGUuIEFsd2F5cyB1c2UgdGhpcyBvciBgc2V0U3RhdGVgIHRvIG11dGF0ZSBzdGF0ZS5cbiAgICogWW91IHNob3VsZCB0cmVhdCBgdGhpcy5zdGF0ZWAgYXMgaW1tdXRhYmxlLlxuICAgKlxuICAgKiBUaGVyZSBpcyBubyBndWFyYW50ZWUgdGhhdCBgdGhpcy5zdGF0ZWAgd2lsbCBiZSBpbW1lZGlhdGVseSB1cGRhdGVkLCBzb1xuICAgKiBhY2Nlc3NpbmcgYHRoaXMuc3RhdGVgIGFmdGVyIGNhbGxpbmcgdGhpcyBtZXRob2QgbWF5IHJldHVybiB0aGUgb2xkIHZhbHVlLlxuICAgKlxuICAgKiBAcGFyYW0ge1JlYWN0Q2xhc3N9IHB1YmxpY0luc3RhbmNlIFRoZSBpbnN0YW5jZSB0aGF0IHNob3VsZCByZXJlbmRlci5cbiAgICogQHBhcmFtIHtvYmplY3R9IGNvbXBsZXRlU3RhdGUgTmV4dCBzdGF0ZS5cbiAgICogQGludGVybmFsXG4gICAqL1xuICBlbnF1ZXVlUmVwbGFjZVN0YXRlOiBmdW5jdGlvbiAocHVibGljSW5zdGFuY2UsIGNvbXBsZXRlU3RhdGUpIHtcbiAgICB3YXJuTm9vcChwdWJsaWNJbnN0YW5jZSwgJ3JlcGxhY2VTdGF0ZScpO1xuICB9LFxuXG4gIC8qKlxuICAgKiBTZXRzIGEgc3Vic2V0IG9mIHRoZSBzdGF0ZS4gVGhpcyBvbmx5IGV4aXN0cyBiZWNhdXNlIF9wZW5kaW5nU3RhdGUgaXNcbiAgICogaW50ZXJuYWwuIFRoaXMgcHJvdmlkZXMgYSBtZXJnaW5nIHN0cmF0ZWd5IHRoYXQgaXMgbm90IGF2YWlsYWJsZSB0byBkZWVwXG4gICAqIHByb3BlcnRpZXMgd2hpY2ggaXMgY29uZnVzaW5nLiBUT0RPOiBFeHBvc2UgcGVuZGluZ1N0YXRlIG9yIGRvbid0IHVzZSBpdFxuICAgKiBkdXJpbmcgdGhlIG1lcmdlLlxuICAgKlxuICAgKiBAcGFyYW0ge1JlYWN0Q2xhc3N9IHB1YmxpY0luc3RhbmNlIFRoZSBpbnN0YW5jZSB0aGF0IHNob3VsZCByZXJlbmRlci5cbiAgICogQHBhcmFtIHtvYmplY3R9IHBhcnRpYWxTdGF0ZSBOZXh0IHBhcnRpYWwgc3RhdGUgdG8gYmUgbWVyZ2VkIHdpdGggc3RhdGUuXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgZW5xdWV1ZVNldFN0YXRlOiBmdW5jdGlvbiAocHVibGljSW5zdGFuY2UsIHBhcnRpYWxTdGF0ZSkge1xuICAgIHdhcm5Ob29wKHB1YmxpY0luc3RhbmNlLCAnc2V0U3RhdGUnKTtcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBSZWFjdE5vb3BVcGRhdGVRdWV1ZTsiLCIvKipcbiAqIENvcHlyaWdodCAyMDEzLXByZXNlbnQsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIEJTRC1zdHlsZSBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLiBBbiBhZGRpdGlvbmFsIGdyYW50XG4gKiBvZiBwYXRlbnQgcmlnaHRzIGNhbiBiZSBmb3VuZCBpbiB0aGUgUEFURU5UUyBmaWxlIGluIHRoZSBzYW1lIGRpcmVjdG9yeS5cbiAqXG4gKiBAcHJvdmlkZXNNb2R1bGUgUmVhY3RQcm9wVHlwZUxvY2F0aW9uTmFtZXNcbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbnZhciBSZWFjdFByb3BUeXBlTG9jYXRpb25OYW1lcyA9IHt9O1xuXG5pZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICBSZWFjdFByb3BUeXBlTG9jYXRpb25OYW1lcyA9IHtcbiAgICBwcm9wOiAncHJvcCcsXG4gICAgY29udGV4dDogJ2NvbnRleHQnLFxuICAgIGNoaWxkQ29udGV4dDogJ2NoaWxkIGNvbnRleHQnXG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gUmVhY3RQcm9wVHlwZUxvY2F0aW9uTmFtZXM7IiwiLyoqXG4gKiBDb3B5cmlnaHQgMjAxMy1wcmVzZW50LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBCU0Qtc3R5bGUgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS4gQW4gYWRkaXRpb25hbCBncmFudFxuICogb2YgcGF0ZW50IHJpZ2h0cyBjYW4gYmUgZm91bmQgaW4gdGhlIFBBVEVOVFMgZmlsZSBpbiB0aGUgc2FtZSBkaXJlY3RvcnkuXG4gKlxuICogQHByb3ZpZGVzTW9kdWxlIFJlYWN0UHJvcFR5cGVMb2NhdGlvbnNcbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbnZhciBrZXlNaXJyb3IgPSByZXF1aXJlKCdmYmpzL2xpYi9rZXlNaXJyb3InKTtcblxudmFyIFJlYWN0UHJvcFR5cGVMb2NhdGlvbnMgPSBrZXlNaXJyb3Ioe1xuICBwcm9wOiBudWxsLFxuICBjb250ZXh0OiBudWxsLFxuICBjaGlsZENvbnRleHQ6IG51bGxcbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFJlYWN0UHJvcFR5cGVMb2NhdGlvbnM7IiwiLyoqXG4gKiBDb3B5cmlnaHQgMjAxMy1wcmVzZW50LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBCU0Qtc3R5bGUgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS4gQW4gYWRkaXRpb25hbCBncmFudFxuICogb2YgcGF0ZW50IHJpZ2h0cyBjYW4gYmUgZm91bmQgaW4gdGhlIFBBVEVOVFMgZmlsZSBpbiB0aGUgc2FtZSBkaXJlY3RvcnkuXG4gKlxuICogQHByb3ZpZGVzTW9kdWxlIFJlYWN0UHJvcFR5cGVzXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgUmVhY3RFbGVtZW50ID0gcmVxdWlyZSgnLi9SZWFjdEVsZW1lbnQnKTtcbnZhciBSZWFjdFByb3BUeXBlTG9jYXRpb25OYW1lcyA9IHJlcXVpcmUoJy4vUmVhY3RQcm9wVHlwZUxvY2F0aW9uTmFtZXMnKTtcbnZhciBSZWFjdFByb3BUeXBlc1NlY3JldCA9IHJlcXVpcmUoJy4vUmVhY3RQcm9wVHlwZXNTZWNyZXQnKTtcblxudmFyIGVtcHR5RnVuY3Rpb24gPSByZXF1aXJlKCdmYmpzL2xpYi9lbXB0eUZ1bmN0aW9uJyk7XG52YXIgZ2V0SXRlcmF0b3JGbiA9IHJlcXVpcmUoJy4vZ2V0SXRlcmF0b3JGbicpO1xudmFyIHdhcm5pbmcgPSByZXF1aXJlKCdmYmpzL2xpYi93YXJuaW5nJyk7XG5cbi8qKlxuICogQ29sbGVjdGlvbiBvZiBtZXRob2RzIHRoYXQgYWxsb3cgZGVjbGFyYXRpb24gYW5kIHZhbGlkYXRpb24gb2YgcHJvcHMgdGhhdCBhcmVcbiAqIHN1cHBsaWVkIHRvIFJlYWN0IGNvbXBvbmVudHMuIEV4YW1wbGUgdXNhZ2U6XG4gKlxuICogICB2YXIgUHJvcHMgPSByZXF1aXJlKCdSZWFjdFByb3BUeXBlcycpO1xuICogICB2YXIgTXlBcnRpY2xlID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICogICAgIHByb3BUeXBlczoge1xuICogICAgICAgLy8gQW4gb3B0aW9uYWwgc3RyaW5nIHByb3AgbmFtZWQgXCJkZXNjcmlwdGlvblwiLlxuICogICAgICAgZGVzY3JpcHRpb246IFByb3BzLnN0cmluZyxcbiAqXG4gKiAgICAgICAvLyBBIHJlcXVpcmVkIGVudW0gcHJvcCBuYW1lZCBcImNhdGVnb3J5XCIuXG4gKiAgICAgICBjYXRlZ29yeTogUHJvcHMub25lT2YoWydOZXdzJywnUGhvdG9zJ10pLmlzUmVxdWlyZWQsXG4gKlxuICogICAgICAgLy8gQSBwcm9wIG5hbWVkIFwiZGlhbG9nXCIgdGhhdCByZXF1aXJlcyBhbiBpbnN0YW5jZSBvZiBEaWFsb2cuXG4gKiAgICAgICBkaWFsb2c6IFByb3BzLmluc3RhbmNlT2YoRGlhbG9nKS5pc1JlcXVpcmVkXG4gKiAgICAgfSxcbiAqICAgICByZW5kZXI6IGZ1bmN0aW9uKCkgeyAuLi4gfVxuICogICB9KTtcbiAqXG4gKiBBIG1vcmUgZm9ybWFsIHNwZWNpZmljYXRpb24gb2YgaG93IHRoZXNlIG1ldGhvZHMgYXJlIHVzZWQ6XG4gKlxuICogICB0eXBlIDo9IGFycmF5fGJvb2x8ZnVuY3xvYmplY3R8bnVtYmVyfHN0cmluZ3xvbmVPZihbLi4uXSl8aW5zdGFuY2VPZiguLi4pXG4gKiAgIGRlY2wgOj0gUmVhY3RQcm9wVHlwZXMue3R5cGV9KC5pc1JlcXVpcmVkKT9cbiAqXG4gKiBFYWNoIGFuZCBldmVyeSBkZWNsYXJhdGlvbiBwcm9kdWNlcyBhIGZ1bmN0aW9uIHdpdGggdGhlIHNhbWUgc2lnbmF0dXJlLiBUaGlzXG4gKiBhbGxvd3MgdGhlIGNyZWF0aW9uIG9mIGN1c3RvbSB2YWxpZGF0aW9uIGZ1bmN0aW9ucy4gRm9yIGV4YW1wbGU6XG4gKlxuICogIHZhciBNeUxpbmsgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gKiAgICBwcm9wVHlwZXM6IHtcbiAqICAgICAgLy8gQW4gb3B0aW9uYWwgc3RyaW5nIG9yIFVSSSBwcm9wIG5hbWVkIFwiaHJlZlwiLlxuICogICAgICBocmVmOiBmdW5jdGlvbihwcm9wcywgcHJvcE5hbWUsIGNvbXBvbmVudE5hbWUpIHtcbiAqICAgICAgICB2YXIgcHJvcFZhbHVlID0gcHJvcHNbcHJvcE5hbWVdO1xuICogICAgICAgIGlmIChwcm9wVmFsdWUgIT0gbnVsbCAmJiB0eXBlb2YgcHJvcFZhbHVlICE9PSAnc3RyaW5nJyAmJlxuICogICAgICAgICAgICAhKHByb3BWYWx1ZSBpbnN0YW5jZW9mIFVSSSkpIHtcbiAqICAgICAgICAgIHJldHVybiBuZXcgRXJyb3IoXG4gKiAgICAgICAgICAgICdFeHBlY3RlZCBhIHN0cmluZyBvciBhbiBVUkkgZm9yICcgKyBwcm9wTmFtZSArICcgaW4gJyArXG4gKiAgICAgICAgICAgIGNvbXBvbmVudE5hbWVcbiAqICAgICAgICAgICk7XG4gKiAgICAgICAgfVxuICogICAgICB9XG4gKiAgICB9LFxuICogICAgcmVuZGVyOiBmdW5jdGlvbigpIHsuLi59XG4gKiAgfSk7XG4gKlxuICogQGludGVybmFsXG4gKi9cblxudmFyIEFOT05ZTU9VUyA9ICc8PGFub255bW91cz4+JztcblxudmFyIFJlYWN0UHJvcFR5cGVzID0ge1xuICBhcnJheTogY3JlYXRlUHJpbWl0aXZlVHlwZUNoZWNrZXIoJ2FycmF5JyksXG4gIGJvb2w6IGNyZWF0ZVByaW1pdGl2ZVR5cGVDaGVja2VyKCdib29sZWFuJyksXG4gIGZ1bmM6IGNyZWF0ZVByaW1pdGl2ZVR5cGVDaGVja2VyKCdmdW5jdGlvbicpLFxuICBudW1iZXI6IGNyZWF0ZVByaW1pdGl2ZVR5cGVDaGVja2VyKCdudW1iZXInKSxcbiAgb2JqZWN0OiBjcmVhdGVQcmltaXRpdmVUeXBlQ2hlY2tlcignb2JqZWN0JyksXG4gIHN0cmluZzogY3JlYXRlUHJpbWl0aXZlVHlwZUNoZWNrZXIoJ3N0cmluZycpLFxuICBzeW1ib2w6IGNyZWF0ZVByaW1pdGl2ZVR5cGVDaGVja2VyKCdzeW1ib2wnKSxcblxuICBhbnk6IGNyZWF0ZUFueVR5cGVDaGVja2VyKCksXG4gIGFycmF5T2Y6IGNyZWF0ZUFycmF5T2ZUeXBlQ2hlY2tlcixcbiAgZWxlbWVudDogY3JlYXRlRWxlbWVudFR5cGVDaGVja2VyKCksXG4gIGluc3RhbmNlT2Y6IGNyZWF0ZUluc3RhbmNlVHlwZUNoZWNrZXIsXG4gIG5vZGU6IGNyZWF0ZU5vZGVDaGVja2VyKCksXG4gIG9iamVjdE9mOiBjcmVhdGVPYmplY3RPZlR5cGVDaGVja2VyLFxuICBvbmVPZjogY3JlYXRlRW51bVR5cGVDaGVja2VyLFxuICBvbmVPZlR5cGU6IGNyZWF0ZVVuaW9uVHlwZUNoZWNrZXIsXG4gIHNoYXBlOiBjcmVhdGVTaGFwZVR5cGVDaGVja2VyXG59O1xuXG4vKipcbiAqIGlubGluZWQgT2JqZWN0LmlzIHBvbHlmaWxsIHRvIGF2b2lkIHJlcXVpcmluZyBjb25zdW1lcnMgc2hpcCB0aGVpciBvd25cbiAqIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL09iamVjdC9pc1xuICovXG4vKmVzbGludC1kaXNhYmxlIG5vLXNlbGYtY29tcGFyZSovXG5mdW5jdGlvbiBpcyh4LCB5KSB7XG4gIC8vIFNhbWVWYWx1ZSBhbGdvcml0aG1cbiAgaWYgKHggPT09IHkpIHtcbiAgICAvLyBTdGVwcyAxLTUsIDctMTBcbiAgICAvLyBTdGVwcyA2LmItNi5lOiArMCAhPSAtMFxuICAgIHJldHVybiB4ICE9PSAwIHx8IDEgLyB4ID09PSAxIC8geTtcbiAgfSBlbHNlIHtcbiAgICAvLyBTdGVwIDYuYTogTmFOID09IE5hTlxuICAgIHJldHVybiB4ICE9PSB4ICYmIHkgIT09IHk7XG4gIH1cbn1cbi8qZXNsaW50LWVuYWJsZSBuby1zZWxmLWNvbXBhcmUqL1xuXG4vKipcbiAqIFdlIHVzZSBhbiBFcnJvci1saWtlIG9iamVjdCBmb3IgYmFja3dhcmQgY29tcGF0aWJpbGl0eSBhcyBwZW9wbGUgbWF5IGNhbGxcbiAqIFByb3BUeXBlcyBkaXJlY3RseSBhbmQgaW5zcGVjdCB0aGVpciBvdXRwdXQuIEhvd2V2ZXIgd2UgZG9uJ3QgdXNlIHJlYWxcbiAqIEVycm9ycyBhbnltb3JlLiBXZSBkb24ndCBpbnNwZWN0IHRoZWlyIHN0YWNrIGFueXdheSwgYW5kIGNyZWF0aW5nIHRoZW1cbiAqIGlzIHByb2hpYml0aXZlbHkgZXhwZW5zaXZlIGlmIHRoZXkgYXJlIGNyZWF0ZWQgdG9vIG9mdGVuLCBzdWNoIGFzIHdoYXRcbiAqIGhhcHBlbnMgaW4gb25lT2ZUeXBlKCkgZm9yIGFueSB0eXBlIGJlZm9yZSB0aGUgb25lIHRoYXQgbWF0Y2hlZC5cbiAqL1xuZnVuY3Rpb24gUHJvcFR5cGVFcnJvcihtZXNzYWdlKSB7XG4gIHRoaXMubWVzc2FnZSA9IG1lc3NhZ2U7XG4gIHRoaXMuc3RhY2sgPSAnJztcbn1cbi8vIE1ha2UgYGluc3RhbmNlb2YgRXJyb3JgIHN0aWxsIHdvcmsgZm9yIHJldHVybmVkIGVycm9ycy5cblByb3BUeXBlRXJyb3IucHJvdG90eXBlID0gRXJyb3IucHJvdG90eXBlO1xuXG5mdW5jdGlvbiBjcmVhdGVDaGFpbmFibGVUeXBlQ2hlY2tlcih2YWxpZGF0ZSkge1xuICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgIHZhciBtYW51YWxQcm9wVHlwZUNhbGxDYWNoZSA9IHt9O1xuICB9XG4gIGZ1bmN0aW9uIGNoZWNrVHlwZShpc1JlcXVpcmVkLCBwcm9wcywgcHJvcE5hbWUsIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUsIHNlY3JldCkge1xuICAgIGNvbXBvbmVudE5hbWUgPSBjb21wb25lbnROYW1lIHx8IEFOT05ZTU9VUztcbiAgICBwcm9wRnVsbE5hbWUgPSBwcm9wRnVsbE5hbWUgfHwgcHJvcE5hbWU7XG4gICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICAgIGlmIChzZWNyZXQgIT09IFJlYWN0UHJvcFR5cGVzU2VjcmV0ICYmIHR5cGVvZiBjb25zb2xlICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICB2YXIgY2FjaGVLZXkgPSBjb21wb25lbnROYW1lICsgJzonICsgcHJvcE5hbWU7XG4gICAgICAgIGlmICghbWFudWFsUHJvcFR5cGVDYWxsQ2FjaGVbY2FjaGVLZXldKSB7XG4gICAgICAgICAgcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyA/IHdhcm5pbmcoZmFsc2UsICdZb3UgYXJlIG1hbnVhbGx5IGNhbGxpbmcgYSBSZWFjdC5Qcm9wVHlwZXMgdmFsaWRhdGlvbiAnICsgJ2Z1bmN0aW9uIGZvciB0aGUgYCVzYCBwcm9wIG9uIGAlc2AuIFRoaXMgaXMgZGVwcmVjYXRlZCAnICsgJ2FuZCB3aWxsIG5vdCB3b3JrIGluIHRoZSBuZXh0IG1ham9yIHZlcnNpb24uIFlvdSBtYXkgYmUgJyArICdzZWVpbmcgdGhpcyB3YXJuaW5nIGR1ZSB0byBhIHRoaXJkLXBhcnR5IFByb3BUeXBlcyBsaWJyYXJ5LiAnICsgJ1NlZSBodHRwczovL2ZiLm1lL3JlYWN0LXdhcm5pbmctZG9udC1jYWxsLXByb3B0eXBlcyBmb3IgZGV0YWlscy4nLCBwcm9wRnVsbE5hbWUsIGNvbXBvbmVudE5hbWUpIDogdm9pZCAwO1xuICAgICAgICAgIG1hbnVhbFByb3BUeXBlQ2FsbENhY2hlW2NhY2hlS2V5XSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHByb3BzW3Byb3BOYW1lXSA9PSBudWxsKSB7XG4gICAgICB2YXIgbG9jYXRpb25OYW1lID0gUmVhY3RQcm9wVHlwZUxvY2F0aW9uTmFtZXNbbG9jYXRpb25dO1xuICAgICAgaWYgKGlzUmVxdWlyZWQpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9wVHlwZUVycm9yKCdSZXF1aXJlZCAnICsgbG9jYXRpb25OYW1lICsgJyBgJyArIHByb3BGdWxsTmFtZSArICdgIHdhcyBub3Qgc3BlY2lmaWVkIGluICcgKyAoJ2AnICsgY29tcG9uZW50TmFtZSArICdgLicpKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdmFsaWRhdGUocHJvcHMsIHByb3BOYW1lLCBjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgcHJvcEZ1bGxOYW1lKTtcbiAgICB9XG4gIH1cblxuICB2YXIgY2hhaW5lZENoZWNrVHlwZSA9IGNoZWNrVHlwZS5iaW5kKG51bGwsIGZhbHNlKTtcbiAgY2hhaW5lZENoZWNrVHlwZS5pc1JlcXVpcmVkID0gY2hlY2tUeXBlLmJpbmQobnVsbCwgdHJ1ZSk7XG5cbiAgcmV0dXJuIGNoYWluZWRDaGVja1R5cGU7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZVByaW1pdGl2ZVR5cGVDaGVja2VyKGV4cGVjdGVkVHlwZSkge1xuICBmdW5jdGlvbiB2YWxpZGF0ZShwcm9wcywgcHJvcE5hbWUsIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUsIHNlY3JldCkge1xuICAgIHZhciBwcm9wVmFsdWUgPSBwcm9wc1twcm9wTmFtZV07XG4gICAgdmFyIHByb3BUeXBlID0gZ2V0UHJvcFR5cGUocHJvcFZhbHVlKTtcbiAgICBpZiAocHJvcFR5cGUgIT09IGV4cGVjdGVkVHlwZSkge1xuICAgICAgdmFyIGxvY2F0aW9uTmFtZSA9IFJlYWN0UHJvcFR5cGVMb2NhdGlvbk5hbWVzW2xvY2F0aW9uXTtcbiAgICAgIC8vIGBwcm9wVmFsdWVgIGJlaW5nIGluc3RhbmNlIG9mLCBzYXksIGRhdGUvcmVnZXhwLCBwYXNzIHRoZSAnb2JqZWN0J1xuICAgICAgLy8gY2hlY2ssIGJ1dCB3ZSBjYW4gb2ZmZXIgYSBtb3JlIHByZWNpc2UgZXJyb3IgbWVzc2FnZSBoZXJlIHJhdGhlciB0aGFuXG4gICAgICAvLyAnb2YgdHlwZSBgb2JqZWN0YCcuXG4gICAgICB2YXIgcHJlY2lzZVR5cGUgPSBnZXRQcmVjaXNlVHlwZShwcm9wVmFsdWUpO1xuXG4gICAgICByZXR1cm4gbmV3IFByb3BUeXBlRXJyb3IoJ0ludmFsaWQgJyArIGxvY2F0aW9uTmFtZSArICcgYCcgKyBwcm9wRnVsbE5hbWUgKyAnYCBvZiB0eXBlICcgKyAoJ2AnICsgcHJlY2lzZVR5cGUgKyAnYCBzdXBwbGllZCB0byBgJyArIGNvbXBvbmVudE5hbWUgKyAnYCwgZXhwZWN0ZWQgJykgKyAoJ2AnICsgZXhwZWN0ZWRUeXBlICsgJ2AuJykpO1xuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICByZXR1cm4gY3JlYXRlQ2hhaW5hYmxlVHlwZUNoZWNrZXIodmFsaWRhdGUpO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVBbnlUeXBlQ2hlY2tlcigpIHtcbiAgcmV0dXJuIGNyZWF0ZUNoYWluYWJsZVR5cGVDaGVja2VyKGVtcHR5RnVuY3Rpb24udGhhdFJldHVybnMobnVsbCkpO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVBcnJheU9mVHlwZUNoZWNrZXIodHlwZUNoZWNrZXIpIHtcbiAgZnVuY3Rpb24gdmFsaWRhdGUocHJvcHMsIHByb3BOYW1lLCBjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgcHJvcEZ1bGxOYW1lKSB7XG4gICAgaWYgKHR5cGVvZiB0eXBlQ2hlY2tlciAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgcmV0dXJuIG5ldyBQcm9wVHlwZUVycm9yKCdQcm9wZXJ0eSBgJyArIHByb3BGdWxsTmFtZSArICdgIG9mIGNvbXBvbmVudCBgJyArIGNvbXBvbmVudE5hbWUgKyAnYCBoYXMgaW52YWxpZCBQcm9wVHlwZSBub3RhdGlvbiBpbnNpZGUgYXJyYXlPZi4nKTtcbiAgICB9XG4gICAgdmFyIHByb3BWYWx1ZSA9IHByb3BzW3Byb3BOYW1lXTtcbiAgICBpZiAoIUFycmF5LmlzQXJyYXkocHJvcFZhbHVlKSkge1xuICAgICAgdmFyIGxvY2F0aW9uTmFtZSA9IFJlYWN0UHJvcFR5cGVMb2NhdGlvbk5hbWVzW2xvY2F0aW9uXTtcbiAgICAgIHZhciBwcm9wVHlwZSA9IGdldFByb3BUeXBlKHByb3BWYWx1ZSk7XG4gICAgICByZXR1cm4gbmV3IFByb3BUeXBlRXJyb3IoJ0ludmFsaWQgJyArIGxvY2F0aW9uTmFtZSArICcgYCcgKyBwcm9wRnVsbE5hbWUgKyAnYCBvZiB0eXBlICcgKyAoJ2AnICsgcHJvcFR5cGUgKyAnYCBzdXBwbGllZCB0byBgJyArIGNvbXBvbmVudE5hbWUgKyAnYCwgZXhwZWN0ZWQgYW4gYXJyYXkuJykpO1xuICAgIH1cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BWYWx1ZS5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGVycm9yID0gdHlwZUNoZWNrZXIocHJvcFZhbHVlLCBpLCBjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgcHJvcEZ1bGxOYW1lICsgJ1snICsgaSArICddJywgUmVhY3RQcm9wVHlwZXNTZWNyZXQpO1xuICAgICAgaWYgKGVycm9yIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgICAgcmV0dXJuIGVycm9yO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICByZXR1cm4gY3JlYXRlQ2hhaW5hYmxlVHlwZUNoZWNrZXIodmFsaWRhdGUpO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVFbGVtZW50VHlwZUNoZWNrZXIoKSB7XG4gIGZ1bmN0aW9uIHZhbGlkYXRlKHByb3BzLCBwcm9wTmFtZSwgY29tcG9uZW50TmFtZSwgbG9jYXRpb24sIHByb3BGdWxsTmFtZSkge1xuICAgIHZhciBwcm9wVmFsdWUgPSBwcm9wc1twcm9wTmFtZV07XG4gICAgaWYgKCFSZWFjdEVsZW1lbnQuaXNWYWxpZEVsZW1lbnQocHJvcFZhbHVlKSkge1xuICAgICAgdmFyIGxvY2F0aW9uTmFtZSA9IFJlYWN0UHJvcFR5cGVMb2NhdGlvbk5hbWVzW2xvY2F0aW9uXTtcbiAgICAgIHZhciBwcm9wVHlwZSA9IGdldFByb3BUeXBlKHByb3BWYWx1ZSk7XG4gICAgICByZXR1cm4gbmV3IFByb3BUeXBlRXJyb3IoJ0ludmFsaWQgJyArIGxvY2F0aW9uTmFtZSArICcgYCcgKyBwcm9wRnVsbE5hbWUgKyAnYCBvZiB0eXBlICcgKyAoJ2AnICsgcHJvcFR5cGUgKyAnYCBzdXBwbGllZCB0byBgJyArIGNvbXBvbmVudE5hbWUgKyAnYCwgZXhwZWN0ZWQgYSBzaW5nbGUgUmVhY3RFbGVtZW50LicpKTtcbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgcmV0dXJuIGNyZWF0ZUNoYWluYWJsZVR5cGVDaGVja2VyKHZhbGlkYXRlKTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlSW5zdGFuY2VUeXBlQ2hlY2tlcihleHBlY3RlZENsYXNzKSB7XG4gIGZ1bmN0aW9uIHZhbGlkYXRlKHByb3BzLCBwcm9wTmFtZSwgY29tcG9uZW50TmFtZSwgbG9jYXRpb24sIHByb3BGdWxsTmFtZSkge1xuICAgIGlmICghKHByb3BzW3Byb3BOYW1lXSBpbnN0YW5jZW9mIGV4cGVjdGVkQ2xhc3MpKSB7XG4gICAgICB2YXIgbG9jYXRpb25OYW1lID0gUmVhY3RQcm9wVHlwZUxvY2F0aW9uTmFtZXNbbG9jYXRpb25dO1xuICAgICAgdmFyIGV4cGVjdGVkQ2xhc3NOYW1lID0gZXhwZWN0ZWRDbGFzcy5uYW1lIHx8IEFOT05ZTU9VUztcbiAgICAgIHZhciBhY3R1YWxDbGFzc05hbWUgPSBnZXRDbGFzc05hbWUocHJvcHNbcHJvcE5hbWVdKTtcbiAgICAgIHJldHVybiBuZXcgUHJvcFR5cGVFcnJvcignSW52YWxpZCAnICsgbG9jYXRpb25OYW1lICsgJyBgJyArIHByb3BGdWxsTmFtZSArICdgIG9mIHR5cGUgJyArICgnYCcgKyBhY3R1YWxDbGFzc05hbWUgKyAnYCBzdXBwbGllZCB0byBgJyArIGNvbXBvbmVudE5hbWUgKyAnYCwgZXhwZWN0ZWQgJykgKyAoJ2luc3RhbmNlIG9mIGAnICsgZXhwZWN0ZWRDbGFzc05hbWUgKyAnYC4nKSk7XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9XG4gIHJldHVybiBjcmVhdGVDaGFpbmFibGVUeXBlQ2hlY2tlcih2YWxpZGF0ZSk7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUVudW1UeXBlQ2hlY2tlcihleHBlY3RlZFZhbHVlcykge1xuICBpZiAoIUFycmF5LmlzQXJyYXkoZXhwZWN0ZWRWYWx1ZXMpKSB7XG4gICAgcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyA/IHdhcm5pbmcoZmFsc2UsICdJbnZhbGlkIGFyZ3VtZW50IHN1cHBsaWVkIHRvIG9uZU9mLCBleHBlY3RlZCBhbiBpbnN0YW5jZSBvZiBhcnJheS4nKSA6IHZvaWQgMDtcbiAgICByZXR1cm4gZW1wdHlGdW5jdGlvbi50aGF0UmV0dXJuc051bGw7XG4gIH1cblxuICBmdW5jdGlvbiB2YWxpZGF0ZShwcm9wcywgcHJvcE5hbWUsIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUpIHtcbiAgICB2YXIgcHJvcFZhbHVlID0gcHJvcHNbcHJvcE5hbWVdO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZXhwZWN0ZWRWYWx1ZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChpcyhwcm9wVmFsdWUsIGV4cGVjdGVkVmFsdWVzW2ldKSkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgbG9jYXRpb25OYW1lID0gUmVhY3RQcm9wVHlwZUxvY2F0aW9uTmFtZXNbbG9jYXRpb25dO1xuICAgIHZhciB2YWx1ZXNTdHJpbmcgPSBKU09OLnN0cmluZ2lmeShleHBlY3RlZFZhbHVlcyk7XG4gICAgcmV0dXJuIG5ldyBQcm9wVHlwZUVycm9yKCdJbnZhbGlkICcgKyBsb2NhdGlvbk5hbWUgKyAnIGAnICsgcHJvcEZ1bGxOYW1lICsgJ2Agb2YgdmFsdWUgYCcgKyBwcm9wVmFsdWUgKyAnYCAnICsgKCdzdXBwbGllZCB0byBgJyArIGNvbXBvbmVudE5hbWUgKyAnYCwgZXhwZWN0ZWQgb25lIG9mICcgKyB2YWx1ZXNTdHJpbmcgKyAnLicpKTtcbiAgfVxuICByZXR1cm4gY3JlYXRlQ2hhaW5hYmxlVHlwZUNoZWNrZXIodmFsaWRhdGUpO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVPYmplY3RPZlR5cGVDaGVja2VyKHR5cGVDaGVja2VyKSB7XG4gIGZ1bmN0aW9uIHZhbGlkYXRlKHByb3BzLCBwcm9wTmFtZSwgY29tcG9uZW50TmFtZSwgbG9jYXRpb24sIHByb3BGdWxsTmFtZSkge1xuICAgIGlmICh0eXBlb2YgdHlwZUNoZWNrZXIgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHJldHVybiBuZXcgUHJvcFR5cGVFcnJvcignUHJvcGVydHkgYCcgKyBwcm9wRnVsbE5hbWUgKyAnYCBvZiBjb21wb25lbnQgYCcgKyBjb21wb25lbnROYW1lICsgJ2AgaGFzIGludmFsaWQgUHJvcFR5cGUgbm90YXRpb24gaW5zaWRlIG9iamVjdE9mLicpO1xuICAgIH1cbiAgICB2YXIgcHJvcFZhbHVlID0gcHJvcHNbcHJvcE5hbWVdO1xuICAgIHZhciBwcm9wVHlwZSA9IGdldFByb3BUeXBlKHByb3BWYWx1ZSk7XG4gICAgaWYgKHByb3BUeXBlICE9PSAnb2JqZWN0Jykge1xuICAgICAgdmFyIGxvY2F0aW9uTmFtZSA9IFJlYWN0UHJvcFR5cGVMb2NhdGlvbk5hbWVzW2xvY2F0aW9uXTtcbiAgICAgIHJldHVybiBuZXcgUHJvcFR5cGVFcnJvcignSW52YWxpZCAnICsgbG9jYXRpb25OYW1lICsgJyBgJyArIHByb3BGdWxsTmFtZSArICdgIG9mIHR5cGUgJyArICgnYCcgKyBwcm9wVHlwZSArICdgIHN1cHBsaWVkIHRvIGAnICsgY29tcG9uZW50TmFtZSArICdgLCBleHBlY3RlZCBhbiBvYmplY3QuJykpO1xuICAgIH1cbiAgICBmb3IgKHZhciBrZXkgaW4gcHJvcFZhbHVlKSB7XG4gICAgICBpZiAocHJvcFZhbHVlLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgdmFyIGVycm9yID0gdHlwZUNoZWNrZXIocHJvcFZhbHVlLCBrZXksIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUgKyAnLicgKyBrZXksIFJlYWN0UHJvcFR5cGVzU2VjcmV0KTtcbiAgICAgICAgaWYgKGVycm9yIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgICAgICByZXR1cm4gZXJyb3I7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgcmV0dXJuIGNyZWF0ZUNoYWluYWJsZVR5cGVDaGVja2VyKHZhbGlkYXRlKTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlVW5pb25UeXBlQ2hlY2tlcihhcnJheU9mVHlwZUNoZWNrZXJzKSB7XG4gIGlmICghQXJyYXkuaXNBcnJheShhcnJheU9mVHlwZUNoZWNrZXJzKSkge1xuICAgIHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgPyB3YXJuaW5nKGZhbHNlLCAnSW52YWxpZCBhcmd1bWVudCBzdXBwbGllZCB0byBvbmVPZlR5cGUsIGV4cGVjdGVkIGFuIGluc3RhbmNlIG9mIGFycmF5LicpIDogdm9pZCAwO1xuICAgIHJldHVybiBlbXB0eUZ1bmN0aW9uLnRoYXRSZXR1cm5zTnVsbDtcbiAgfVxuXG4gIGZ1bmN0aW9uIHZhbGlkYXRlKHByb3BzLCBwcm9wTmFtZSwgY29tcG9uZW50TmFtZSwgbG9jYXRpb24sIHByb3BGdWxsTmFtZSkge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJyYXlPZlR5cGVDaGVja2Vycy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGNoZWNrZXIgPSBhcnJheU9mVHlwZUNoZWNrZXJzW2ldO1xuICAgICAgaWYgKGNoZWNrZXIocHJvcHMsIHByb3BOYW1lLCBjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgcHJvcEZ1bGxOYW1lLCBSZWFjdFByb3BUeXBlc1NlY3JldCkgPT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgbG9jYXRpb25OYW1lID0gUmVhY3RQcm9wVHlwZUxvY2F0aW9uTmFtZXNbbG9jYXRpb25dO1xuICAgIHJldHVybiBuZXcgUHJvcFR5cGVFcnJvcignSW52YWxpZCAnICsgbG9jYXRpb25OYW1lICsgJyBgJyArIHByb3BGdWxsTmFtZSArICdgIHN1cHBsaWVkIHRvICcgKyAoJ2AnICsgY29tcG9uZW50TmFtZSArICdgLicpKTtcbiAgfVxuICByZXR1cm4gY3JlYXRlQ2hhaW5hYmxlVHlwZUNoZWNrZXIodmFsaWRhdGUpO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVOb2RlQ2hlY2tlcigpIHtcbiAgZnVuY3Rpb24gdmFsaWRhdGUocHJvcHMsIHByb3BOYW1lLCBjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgcHJvcEZ1bGxOYW1lKSB7XG4gICAgaWYgKCFpc05vZGUocHJvcHNbcHJvcE5hbWVdKSkge1xuICAgICAgdmFyIGxvY2F0aW9uTmFtZSA9IFJlYWN0UHJvcFR5cGVMb2NhdGlvbk5hbWVzW2xvY2F0aW9uXTtcbiAgICAgIHJldHVybiBuZXcgUHJvcFR5cGVFcnJvcignSW52YWxpZCAnICsgbG9jYXRpb25OYW1lICsgJyBgJyArIHByb3BGdWxsTmFtZSArICdgIHN1cHBsaWVkIHRvICcgKyAoJ2AnICsgY29tcG9uZW50TmFtZSArICdgLCBleHBlY3RlZCBhIFJlYWN0Tm9kZS4nKSk7XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9XG4gIHJldHVybiBjcmVhdGVDaGFpbmFibGVUeXBlQ2hlY2tlcih2YWxpZGF0ZSk7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZVNoYXBlVHlwZUNoZWNrZXIoc2hhcGVUeXBlcykge1xuICBmdW5jdGlvbiB2YWxpZGF0ZShwcm9wcywgcHJvcE5hbWUsIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUpIHtcbiAgICB2YXIgcHJvcFZhbHVlID0gcHJvcHNbcHJvcE5hbWVdO1xuICAgIHZhciBwcm9wVHlwZSA9IGdldFByb3BUeXBlKHByb3BWYWx1ZSk7XG4gICAgaWYgKHByb3BUeXBlICE9PSAnb2JqZWN0Jykge1xuICAgICAgdmFyIGxvY2F0aW9uTmFtZSA9IFJlYWN0UHJvcFR5cGVMb2NhdGlvbk5hbWVzW2xvY2F0aW9uXTtcbiAgICAgIHJldHVybiBuZXcgUHJvcFR5cGVFcnJvcignSW52YWxpZCAnICsgbG9jYXRpb25OYW1lICsgJyBgJyArIHByb3BGdWxsTmFtZSArICdgIG9mIHR5cGUgYCcgKyBwcm9wVHlwZSArICdgICcgKyAoJ3N1cHBsaWVkIHRvIGAnICsgY29tcG9uZW50TmFtZSArICdgLCBleHBlY3RlZCBgb2JqZWN0YC4nKSk7XG4gICAgfVxuICAgIGZvciAodmFyIGtleSBpbiBzaGFwZVR5cGVzKSB7XG4gICAgICB2YXIgY2hlY2tlciA9IHNoYXBlVHlwZXNba2V5XTtcbiAgICAgIGlmICghY2hlY2tlcikge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIHZhciBlcnJvciA9IGNoZWNrZXIocHJvcFZhbHVlLCBrZXksIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUgKyAnLicgKyBrZXksIFJlYWN0UHJvcFR5cGVzU2VjcmV0KTtcbiAgICAgIGlmIChlcnJvcikge1xuICAgICAgICByZXR1cm4gZXJyb3I7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9XG4gIHJldHVybiBjcmVhdGVDaGFpbmFibGVUeXBlQ2hlY2tlcih2YWxpZGF0ZSk7XG59XG5cbmZ1bmN0aW9uIGlzTm9kZShwcm9wVmFsdWUpIHtcbiAgc3dpdGNoICh0eXBlb2YgcHJvcFZhbHVlKSB7XG4gICAgY2FzZSAnbnVtYmVyJzpcbiAgICBjYXNlICdzdHJpbmcnOlxuICAgIGNhc2UgJ3VuZGVmaW5lZCc6XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICBjYXNlICdib29sZWFuJzpcbiAgICAgIHJldHVybiAhcHJvcFZhbHVlO1xuICAgIGNhc2UgJ29iamVjdCc6XG4gICAgICBpZiAoQXJyYXkuaXNBcnJheShwcm9wVmFsdWUpKSB7XG4gICAgICAgIHJldHVybiBwcm9wVmFsdWUuZXZlcnkoaXNOb2RlKTtcbiAgICAgIH1cbiAgICAgIGlmIChwcm9wVmFsdWUgPT09IG51bGwgfHwgUmVhY3RFbGVtZW50LmlzVmFsaWRFbGVtZW50KHByb3BWYWx1ZSkpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG5cbiAgICAgIHZhciBpdGVyYXRvckZuID0gZ2V0SXRlcmF0b3JGbihwcm9wVmFsdWUpO1xuICAgICAgaWYgKGl0ZXJhdG9yRm4pIHtcbiAgICAgICAgdmFyIGl0ZXJhdG9yID0gaXRlcmF0b3JGbi5jYWxsKHByb3BWYWx1ZSk7XG4gICAgICAgIHZhciBzdGVwO1xuICAgICAgICBpZiAoaXRlcmF0b3JGbiAhPT0gcHJvcFZhbHVlLmVudHJpZXMpIHtcbiAgICAgICAgICB3aGlsZSAoIShzdGVwID0gaXRlcmF0b3IubmV4dCgpKS5kb25lKSB7XG4gICAgICAgICAgICBpZiAoIWlzTm9kZShzdGVwLnZhbHVlKSkge1xuICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIEl0ZXJhdG9yIHdpbGwgcHJvdmlkZSBlbnRyeSBbayx2XSB0dXBsZXMgcmF0aGVyIHRoYW4gdmFsdWVzLlxuICAgICAgICAgIHdoaWxlICghKHN0ZXAgPSBpdGVyYXRvci5uZXh0KCkpLmRvbmUpIHtcbiAgICAgICAgICAgIHZhciBlbnRyeSA9IHN0ZXAudmFsdWU7XG4gICAgICAgICAgICBpZiAoZW50cnkpIHtcbiAgICAgICAgICAgICAgaWYgKCFpc05vZGUoZW50cnlbMV0pKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0cnVlO1xuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn1cblxuZnVuY3Rpb24gaXNTeW1ib2wocHJvcFR5cGUsIHByb3BWYWx1ZSkge1xuICAvLyBOYXRpdmUgU3ltYm9sLlxuICBpZiAocHJvcFR5cGUgPT09ICdzeW1ib2wnKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICAvLyAxOS40LjMuNSBTeW1ib2wucHJvdG90eXBlW0BAdG9TdHJpbmdUYWddID09PSAnU3ltYm9sJ1xuICBpZiAocHJvcFZhbHVlWydAQHRvU3RyaW5nVGFnJ10gPT09ICdTeW1ib2wnKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICAvLyBGYWxsYmFjayBmb3Igbm9uLXNwZWMgY29tcGxpYW50IFN5bWJvbHMgd2hpY2ggYXJlIHBvbHlmaWxsZWQuXG4gIGlmICh0eXBlb2YgU3ltYm9sID09PSAnZnVuY3Rpb24nICYmIHByb3BWYWx1ZSBpbnN0YW5jZW9mIFN5bWJvbCkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG4vLyBFcXVpdmFsZW50IG9mIGB0eXBlb2ZgIGJ1dCB3aXRoIHNwZWNpYWwgaGFuZGxpbmcgZm9yIGFycmF5IGFuZCByZWdleHAuXG5mdW5jdGlvbiBnZXRQcm9wVHlwZShwcm9wVmFsdWUpIHtcbiAgdmFyIHByb3BUeXBlID0gdHlwZW9mIHByb3BWYWx1ZTtcbiAgaWYgKEFycmF5LmlzQXJyYXkocHJvcFZhbHVlKSkge1xuICAgIHJldHVybiAnYXJyYXknO1xuICB9XG4gIGlmIChwcm9wVmFsdWUgaW5zdGFuY2VvZiBSZWdFeHApIHtcbiAgICAvLyBPbGQgd2Via2l0cyAoYXQgbGVhc3QgdW50aWwgQW5kcm9pZCA0LjApIHJldHVybiAnZnVuY3Rpb24nIHJhdGhlciB0aGFuXG4gICAgLy8gJ29iamVjdCcgZm9yIHR5cGVvZiBhIFJlZ0V4cC4gV2UnbGwgbm9ybWFsaXplIHRoaXMgaGVyZSBzbyB0aGF0IC9ibGEvXG4gICAgLy8gcGFzc2VzIFByb3BUeXBlcy5vYmplY3QuXG4gICAgcmV0dXJuICdvYmplY3QnO1xuICB9XG4gIGlmIChpc1N5bWJvbChwcm9wVHlwZSwgcHJvcFZhbHVlKSkge1xuICAgIHJldHVybiAnc3ltYm9sJztcbiAgfVxuICByZXR1cm4gcHJvcFR5cGU7XG59XG5cbi8vIFRoaXMgaGFuZGxlcyBtb3JlIHR5cGVzIHRoYW4gYGdldFByb3BUeXBlYC4gT25seSB1c2VkIGZvciBlcnJvciBtZXNzYWdlcy5cbi8vIFNlZSBgY3JlYXRlUHJpbWl0aXZlVHlwZUNoZWNrZXJgLlxuZnVuY3Rpb24gZ2V0UHJlY2lzZVR5cGUocHJvcFZhbHVlKSB7XG4gIHZhciBwcm9wVHlwZSA9IGdldFByb3BUeXBlKHByb3BWYWx1ZSk7XG4gIGlmIChwcm9wVHlwZSA9PT0gJ29iamVjdCcpIHtcbiAgICBpZiAocHJvcFZhbHVlIGluc3RhbmNlb2YgRGF0ZSkge1xuICAgICAgcmV0dXJuICdkYXRlJztcbiAgICB9IGVsc2UgaWYgKHByb3BWYWx1ZSBpbnN0YW5jZW9mIFJlZ0V4cCkge1xuICAgICAgcmV0dXJuICdyZWdleHAnO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcHJvcFR5cGU7XG59XG5cbi8vIFJldHVybnMgY2xhc3MgbmFtZSBvZiB0aGUgb2JqZWN0LCBpZiBhbnkuXG5mdW5jdGlvbiBnZXRDbGFzc05hbWUocHJvcFZhbHVlKSB7XG4gIGlmICghcHJvcFZhbHVlLmNvbnN0cnVjdG9yIHx8ICFwcm9wVmFsdWUuY29uc3RydWN0b3IubmFtZSkge1xuICAgIHJldHVybiBBTk9OWU1PVVM7XG4gIH1cbiAgcmV0dXJuIHByb3BWYWx1ZS5jb25zdHJ1Y3Rvci5uYW1lO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFJlYWN0UHJvcFR5cGVzOyIsIi8qKlxuICogQ29weXJpZ2h0IDIwMTMtcHJlc2VudCwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgQlNELXN0eWxlIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuIEFuIGFkZGl0aW9uYWwgZ3JhbnRcbiAqIG9mIHBhdGVudCByaWdodHMgY2FuIGJlIGZvdW5kIGluIHRoZSBQQVRFTlRTIGZpbGUgaW4gdGhlIHNhbWUgZGlyZWN0b3J5LlxuICpcbiAqIEBwcm92aWRlc01vZHVsZSBSZWFjdFByb3BUeXBlc1NlY3JldFxuICovXG5cbid1c2Ugc3RyaWN0JztcblxudmFyIFJlYWN0UHJvcFR5cGVzU2VjcmV0ID0gJ1NFQ1JFVF9ET19OT1RfUEFTU19USElTX09SX1lPVV9XSUxMX0JFX0ZJUkVEJztcblxubW9kdWxlLmV4cG9ydHMgPSBSZWFjdFByb3BUeXBlc1NlY3JldDsiLCIvKipcbiAqIENvcHlyaWdodCAyMDEzLXByZXNlbnQsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIEJTRC1zdHlsZSBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLiBBbiBhZGRpdGlvbmFsIGdyYW50XG4gKiBvZiBwYXRlbnQgcmlnaHRzIGNhbiBiZSBmb3VuZCBpbiB0aGUgUEFURU5UUyBmaWxlIGluIHRoZSBzYW1lIGRpcmVjdG9yeS5cbiAqXG4gKiBAcHJvdmlkZXNNb2R1bGUgUmVhY3RQdXJlQ29tcG9uZW50XG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgX2Fzc2lnbiA9IHJlcXVpcmUoJ29iamVjdC1hc3NpZ24nKTtcblxudmFyIFJlYWN0Q29tcG9uZW50ID0gcmVxdWlyZSgnLi9SZWFjdENvbXBvbmVudCcpO1xudmFyIFJlYWN0Tm9vcFVwZGF0ZVF1ZXVlID0gcmVxdWlyZSgnLi9SZWFjdE5vb3BVcGRhdGVRdWV1ZScpO1xuXG52YXIgZW1wdHlPYmplY3QgPSByZXF1aXJlKCdmYmpzL2xpYi9lbXB0eU9iamVjdCcpO1xuXG4vKipcbiAqIEJhc2UgY2xhc3MgaGVscGVycyBmb3IgdGhlIHVwZGF0aW5nIHN0YXRlIG9mIGEgY29tcG9uZW50LlxuICovXG5mdW5jdGlvbiBSZWFjdFB1cmVDb21wb25lbnQocHJvcHMsIGNvbnRleHQsIHVwZGF0ZXIpIHtcbiAgLy8gRHVwbGljYXRlZCBmcm9tIFJlYWN0Q29tcG9uZW50LlxuICB0aGlzLnByb3BzID0gcHJvcHM7XG4gIHRoaXMuY29udGV4dCA9IGNvbnRleHQ7XG4gIHRoaXMucmVmcyA9IGVtcHR5T2JqZWN0O1xuICAvLyBXZSBpbml0aWFsaXplIHRoZSBkZWZhdWx0IHVwZGF0ZXIgYnV0IHRoZSByZWFsIG9uZSBnZXRzIGluamVjdGVkIGJ5IHRoZVxuICAvLyByZW5kZXJlci5cbiAgdGhpcy51cGRhdGVyID0gdXBkYXRlciB8fCBSZWFjdE5vb3BVcGRhdGVRdWV1ZTtcbn1cblxuZnVuY3Rpb24gQ29tcG9uZW50RHVtbXkoKSB7fVxuQ29tcG9uZW50RHVtbXkucHJvdG90eXBlID0gUmVhY3RDb21wb25lbnQucHJvdG90eXBlO1xuUmVhY3RQdXJlQ29tcG9uZW50LnByb3RvdHlwZSA9IG5ldyBDb21wb25lbnREdW1teSgpO1xuUmVhY3RQdXJlQ29tcG9uZW50LnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IFJlYWN0UHVyZUNvbXBvbmVudDtcbi8vIEF2b2lkIGFuIGV4dHJhIHByb3RvdHlwZSBqdW1wIGZvciB0aGVzZSBtZXRob2RzLlxuX2Fzc2lnbihSZWFjdFB1cmVDb21wb25lbnQucHJvdG90eXBlLCBSZWFjdENvbXBvbmVudC5wcm90b3R5cGUpO1xuUmVhY3RQdXJlQ29tcG9uZW50LnByb3RvdHlwZS5pc1B1cmVSZWFjdENvbXBvbmVudCA9IHRydWU7XG5cbm1vZHVsZS5leHBvcnRzID0gUmVhY3RQdXJlQ29tcG9uZW50OyIsIi8qKlxuICogQ29weXJpZ2h0IDIwMTMtcHJlc2VudCwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgQlNELXN0eWxlIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuIEFuIGFkZGl0aW9uYWwgZ3JhbnRcbiAqIG9mIHBhdGVudCByaWdodHMgY2FuIGJlIGZvdW5kIGluIHRoZSBQQVRFTlRTIGZpbGUgaW4gdGhlIHNhbWUgZGlyZWN0b3J5LlxuICpcbiAqIEBwcm92aWRlc01vZHVsZSBSZWFjdFZlcnNpb25cbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gJzE1LjMuMSc7IiwiLyoqXG4gKiBDb3B5cmlnaHQgMjAxMy1wcmVzZW50LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBCU0Qtc3R5bGUgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS4gQW4gYWRkaXRpb25hbCBncmFudFxuICogb2YgcGF0ZW50IHJpZ2h0cyBjYW4gYmUgZm91bmQgaW4gdGhlIFBBVEVOVFMgZmlsZSBpbiB0aGUgc2FtZSBkaXJlY3RvcnkuXG4gKlxuICogQHByb3ZpZGVzTW9kdWxlIGNhbkRlZmluZVByb3BlcnR5XG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgY2FuRGVmaW5lUHJvcGVydHkgPSBmYWxzZTtcbmlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gIHRyeSB7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHt9LCAneCcsIHsgZ2V0OiBmdW5jdGlvbiAoKSB7fSB9KTtcbiAgICBjYW5EZWZpbmVQcm9wZXJ0eSA9IHRydWU7XG4gIH0gY2F0Y2ggKHgpIHtcbiAgICAvLyBJRSB3aWxsIGZhaWwgb24gZGVmaW5lUHJvcGVydHlcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNhbkRlZmluZVByb3BlcnR5OyIsIi8qKlxuICogQ29weXJpZ2h0IDIwMTMtcHJlc2VudCwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgQlNELXN0eWxlIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuIEFuIGFkZGl0aW9uYWwgZ3JhbnRcbiAqIG9mIHBhdGVudCByaWdodHMgY2FuIGJlIGZvdW5kIGluIHRoZSBQQVRFTlRTIGZpbGUgaW4gdGhlIHNhbWUgZGlyZWN0b3J5LlxuICpcbiAqIEBwcm92aWRlc01vZHVsZSBjaGVja1JlYWN0VHlwZVNwZWNcbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbnZhciBfcHJvZEludmFyaWFudCA9IHJlcXVpcmUoJy4vcmVhY3RQcm9kSW52YXJpYW50Jyk7XG5cbnZhciBSZWFjdFByb3BUeXBlTG9jYXRpb25OYW1lcyA9IHJlcXVpcmUoJy4vUmVhY3RQcm9wVHlwZUxvY2F0aW9uTmFtZXMnKTtcbnZhciBSZWFjdFByb3BUeXBlc1NlY3JldCA9IHJlcXVpcmUoJy4vUmVhY3RQcm9wVHlwZXNTZWNyZXQnKTtcblxudmFyIGludmFyaWFudCA9IHJlcXVpcmUoJ2ZianMvbGliL2ludmFyaWFudCcpO1xudmFyIHdhcm5pbmcgPSByZXF1aXJlKCdmYmpzL2xpYi93YXJuaW5nJyk7XG5cbnZhciBSZWFjdENvbXBvbmVudFRyZWVIb29rO1xuXG5pZiAodHlwZW9mIHByb2Nlc3MgIT09ICd1bmRlZmluZWQnICYmIHByb2Nlc3MuZW52ICYmIHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSAndGVzdCcpIHtcbiAgLy8gVGVtcG9yYXJ5IGhhY2suXG4gIC8vIElubGluZSByZXF1aXJlcyBkb24ndCB3b3JrIHdlbGwgd2l0aCBKZXN0OlxuICAvLyBodHRwczovL2dpdGh1Yi5jb20vZmFjZWJvb2svcmVhY3QvaXNzdWVzLzcyNDBcbiAgLy8gUmVtb3ZlIHRoZSBpbmxpbmUgcmVxdWlyZXMgd2hlbiB3ZSBkb24ndCBuZWVkIHRoZW0gYW55bW9yZTpcbiAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2ZhY2Vib29rL3JlYWN0L3B1bGwvNzE3OFxuICBSZWFjdENvbXBvbmVudFRyZWVIb29rID0gcmVxdWlyZSgnLi9SZWFjdENvbXBvbmVudFRyZWVIb29rJyk7XG59XG5cbnZhciBsb2dnZWRUeXBlRmFpbHVyZXMgPSB7fTtcblxuLyoqXG4gKiBBc3NlcnQgdGhhdCB0aGUgdmFsdWVzIG1hdGNoIHdpdGggdGhlIHR5cGUgc3BlY3MuXG4gKiBFcnJvciBtZXNzYWdlcyBhcmUgbWVtb3JpemVkIGFuZCB3aWxsIG9ubHkgYmUgc2hvd24gb25jZS5cbiAqXG4gKiBAcGFyYW0ge29iamVjdH0gdHlwZVNwZWNzIE1hcCBvZiBuYW1lIHRvIGEgUmVhY3RQcm9wVHlwZVxuICogQHBhcmFtIHtvYmplY3R9IHZhbHVlcyBSdW50aW1lIHZhbHVlcyB0aGF0IG5lZWQgdG8gYmUgdHlwZS1jaGVja2VkXG4gKiBAcGFyYW0ge3N0cmluZ30gbG9jYXRpb24gZS5nLiBcInByb3BcIiwgXCJjb250ZXh0XCIsIFwiY2hpbGQgY29udGV4dFwiXG4gKiBAcGFyYW0ge3N0cmluZ30gY29tcG9uZW50TmFtZSBOYW1lIG9mIHRoZSBjb21wb25lbnQgZm9yIGVycm9yIG1lc3NhZ2VzLlxuICogQHBhcmFtIHs/b2JqZWN0fSBlbGVtZW50IFRoZSBSZWFjdCBlbGVtZW50IHRoYXQgaXMgYmVpbmcgdHlwZS1jaGVja2VkXG4gKiBAcGFyYW0gez9udW1iZXJ9IGRlYnVnSUQgVGhlIFJlYWN0IGNvbXBvbmVudCBpbnN0YW5jZSB0aGF0IGlzIGJlaW5nIHR5cGUtY2hlY2tlZFxuICogQHByaXZhdGVcbiAqL1xuZnVuY3Rpb24gY2hlY2tSZWFjdFR5cGVTcGVjKHR5cGVTcGVjcywgdmFsdWVzLCBsb2NhdGlvbiwgY29tcG9uZW50TmFtZSwgZWxlbWVudCwgZGVidWdJRCkge1xuICBmb3IgKHZhciB0eXBlU3BlY05hbWUgaW4gdHlwZVNwZWNzKSB7XG4gICAgaWYgKHR5cGVTcGVjcy5oYXNPd25Qcm9wZXJ0eSh0eXBlU3BlY05hbWUpKSB7XG4gICAgICB2YXIgZXJyb3I7XG4gICAgICAvLyBQcm9wIHR5cGUgdmFsaWRhdGlvbiBtYXkgdGhyb3cuIEluIGNhc2UgdGhleSBkbywgd2UgZG9uJ3Qgd2FudCB0b1xuICAgICAgLy8gZmFpbCB0aGUgcmVuZGVyIHBoYXNlIHdoZXJlIGl0IGRpZG4ndCBmYWlsIGJlZm9yZS4gU28gd2UgbG9nIGl0LlxuICAgICAgLy8gQWZ0ZXIgdGhlc2UgaGF2ZSBiZWVuIGNsZWFuZWQgdXAsIHdlJ2xsIGxldCB0aGVtIHRocm93LlxuICAgICAgdHJ5IHtcbiAgICAgICAgLy8gVGhpcyBpcyBpbnRlbnRpb25hbGx5IGFuIGludmFyaWFudCB0aGF0IGdldHMgY2F1Z2h0LiBJdCdzIHRoZSBzYW1lXG4gICAgICAgIC8vIGJlaGF2aW9yIGFzIHdpdGhvdXQgdGhpcyBzdGF0ZW1lbnQgZXhjZXB0IHdpdGggYSBiZXR0ZXIgbWVzc2FnZS5cbiAgICAgICAgISh0eXBlb2YgdHlwZVNwZWNzW3R5cGVTcGVjTmFtZV0gPT09ICdmdW5jdGlvbicpID8gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyA/IGludmFyaWFudChmYWxzZSwgJyVzOiAlcyB0eXBlIGAlc2AgaXMgaW52YWxpZDsgaXQgbXVzdCBiZSBhIGZ1bmN0aW9uLCB1c3VhbGx5IGZyb20gUmVhY3QuUHJvcFR5cGVzLicsIGNvbXBvbmVudE5hbWUgfHwgJ1JlYWN0IGNsYXNzJywgUmVhY3RQcm9wVHlwZUxvY2F0aW9uTmFtZXNbbG9jYXRpb25dLCB0eXBlU3BlY05hbWUpIDogX3Byb2RJbnZhcmlhbnQoJzg0JywgY29tcG9uZW50TmFtZSB8fCAnUmVhY3QgY2xhc3MnLCBSZWFjdFByb3BUeXBlTG9jYXRpb25OYW1lc1tsb2NhdGlvbl0sIHR5cGVTcGVjTmFtZSkgOiB2b2lkIDA7XG4gICAgICAgIGVycm9yID0gdHlwZVNwZWNzW3R5cGVTcGVjTmFtZV0odmFsdWVzLCB0eXBlU3BlY05hbWUsIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBudWxsLCBSZWFjdFByb3BUeXBlc1NlY3JldCk7XG4gICAgICB9IGNhdGNoIChleCkge1xuICAgICAgICBlcnJvciA9IGV4O1xuICAgICAgfVxuICAgICAgcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyA/IHdhcm5pbmcoIWVycm9yIHx8IGVycm9yIGluc3RhbmNlb2YgRXJyb3IsICclczogdHlwZSBzcGVjaWZpY2F0aW9uIG9mICVzIGAlc2AgaXMgaW52YWxpZDsgdGhlIHR5cGUgY2hlY2tlciAnICsgJ2Z1bmN0aW9uIG11c3QgcmV0dXJuIGBudWxsYCBvciBhbiBgRXJyb3JgIGJ1dCByZXR1cm5lZCBhICVzLiAnICsgJ1lvdSBtYXkgaGF2ZSBmb3Jnb3R0ZW4gdG8gcGFzcyBhbiBhcmd1bWVudCB0byB0aGUgdHlwZSBjaGVja2VyICcgKyAnY3JlYXRvciAoYXJyYXlPZiwgaW5zdGFuY2VPZiwgb2JqZWN0T2YsIG9uZU9mLCBvbmVPZlR5cGUsIGFuZCAnICsgJ3NoYXBlIGFsbCByZXF1aXJlIGFuIGFyZ3VtZW50KS4nLCBjb21wb25lbnROYW1lIHx8ICdSZWFjdCBjbGFzcycsIFJlYWN0UHJvcFR5cGVMb2NhdGlvbk5hbWVzW2xvY2F0aW9uXSwgdHlwZVNwZWNOYW1lLCB0eXBlb2YgZXJyb3IpIDogdm9pZCAwO1xuICAgICAgaWYgKGVycm9yIGluc3RhbmNlb2YgRXJyb3IgJiYgIShlcnJvci5tZXNzYWdlIGluIGxvZ2dlZFR5cGVGYWlsdXJlcykpIHtcbiAgICAgICAgLy8gT25seSBtb25pdG9yIHRoaXMgZmFpbHVyZSBvbmNlIGJlY2F1c2UgdGhlcmUgdGVuZHMgdG8gYmUgYSBsb3Qgb2YgdGhlXG4gICAgICAgIC8vIHNhbWUgZXJyb3IuXG4gICAgICAgIGxvZ2dlZFR5cGVGYWlsdXJlc1tlcnJvci5tZXNzYWdlXSA9IHRydWU7XG5cbiAgICAgICAgdmFyIGNvbXBvbmVudFN0YWNrSW5mbyA9ICcnO1xuXG4gICAgICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgICAgICAgaWYgKCFSZWFjdENvbXBvbmVudFRyZWVIb29rKSB7XG4gICAgICAgICAgICBSZWFjdENvbXBvbmVudFRyZWVIb29rID0gcmVxdWlyZSgnLi9SZWFjdENvbXBvbmVudFRyZWVIb29rJyk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChkZWJ1Z0lEICE9PSBudWxsKSB7XG4gICAgICAgICAgICBjb21wb25lbnRTdGFja0luZm8gPSBSZWFjdENvbXBvbmVudFRyZWVIb29rLmdldFN0YWNrQWRkZW5kdW1CeUlEKGRlYnVnSUQpO1xuICAgICAgICAgIH0gZWxzZSBpZiAoZWxlbWVudCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgY29tcG9uZW50U3RhY2tJbmZvID0gUmVhY3RDb21wb25lbnRUcmVlSG9vay5nZXRDdXJyZW50U3RhY2tBZGRlbmR1bShlbGVtZW50KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nID8gd2FybmluZyhmYWxzZSwgJ0ZhaWxlZCAlcyB0eXBlOiAlcyVzJywgbG9jYXRpb24sIGVycm9yLm1lc3NhZ2UsIGNvbXBvbmVudFN0YWNrSW5mbykgOiB2b2lkIDA7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY2hlY2tSZWFjdFR5cGVTcGVjOyIsIi8qKlxuICogQ29weXJpZ2h0IDIwMTMtcHJlc2VudCwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgQlNELXN0eWxlIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuIEFuIGFkZGl0aW9uYWwgZ3JhbnRcbiAqIG9mIHBhdGVudCByaWdodHMgY2FuIGJlIGZvdW5kIGluIHRoZSBQQVRFTlRTIGZpbGUgaW4gdGhlIHNhbWUgZGlyZWN0b3J5LlxuICpcbiAqIEBwcm92aWRlc01vZHVsZSBnZXRJdGVyYXRvckZuXG4gKiBcbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbi8qIGdsb2JhbCBTeW1ib2wgKi9cblxudmFyIElURVJBVE9SX1NZTUJPTCA9IHR5cGVvZiBTeW1ib2wgPT09ICdmdW5jdGlvbicgJiYgU3ltYm9sLml0ZXJhdG9yO1xudmFyIEZBVVhfSVRFUkFUT1JfU1lNQk9MID0gJ0BAaXRlcmF0b3InOyAvLyBCZWZvcmUgU3ltYm9sIHNwZWMuXG5cbi8qKlxuICogUmV0dXJucyB0aGUgaXRlcmF0b3IgbWV0aG9kIGZ1bmN0aW9uIGNvbnRhaW5lZCBvbiB0aGUgaXRlcmFibGUgb2JqZWN0LlxuICpcbiAqIEJlIHN1cmUgdG8gaW52b2tlIHRoZSBmdW5jdGlvbiB3aXRoIHRoZSBpdGVyYWJsZSBhcyBjb250ZXh0OlxuICpcbiAqICAgICB2YXIgaXRlcmF0b3JGbiA9IGdldEl0ZXJhdG9yRm4obXlJdGVyYWJsZSk7XG4gKiAgICAgaWYgKGl0ZXJhdG9yRm4pIHtcbiAqICAgICAgIHZhciBpdGVyYXRvciA9IGl0ZXJhdG9yRm4uY2FsbChteUl0ZXJhYmxlKTtcbiAqICAgICAgIC4uLlxuICogICAgIH1cbiAqXG4gKiBAcGFyYW0gez9vYmplY3R9IG1heWJlSXRlcmFibGVcbiAqIEByZXR1cm4gez9mdW5jdGlvbn1cbiAqL1xuZnVuY3Rpb24gZ2V0SXRlcmF0b3JGbihtYXliZUl0ZXJhYmxlKSB7XG4gIHZhciBpdGVyYXRvckZuID0gbWF5YmVJdGVyYWJsZSAmJiAoSVRFUkFUT1JfU1lNQk9MICYmIG1heWJlSXRlcmFibGVbSVRFUkFUT1JfU1lNQk9MXSB8fCBtYXliZUl0ZXJhYmxlW0ZBVVhfSVRFUkFUT1JfU1lNQk9MXSk7XG4gIGlmICh0eXBlb2YgaXRlcmF0b3JGbiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHJldHVybiBpdGVyYXRvckZuO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZ2V0SXRlcmF0b3JGbjsiLCIvKipcbiAqIENvcHlyaWdodCAyMDEzLXByZXNlbnQsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIEJTRC1zdHlsZSBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLiBBbiBhZGRpdGlvbmFsIGdyYW50XG4gKiBvZiBwYXRlbnQgcmlnaHRzIGNhbiBiZSBmb3VuZCBpbiB0aGUgUEFURU5UUyBmaWxlIGluIHRoZSBzYW1lIGRpcmVjdG9yeS5cbiAqXG4gKiBAcHJvdmlkZXNNb2R1bGUgb25seUNoaWxkXG4gKi9cbid1c2Ugc3RyaWN0JztcblxudmFyIF9wcm9kSW52YXJpYW50ID0gcmVxdWlyZSgnLi9yZWFjdFByb2RJbnZhcmlhbnQnKTtcblxudmFyIFJlYWN0RWxlbWVudCA9IHJlcXVpcmUoJy4vUmVhY3RFbGVtZW50Jyk7XG5cbnZhciBpbnZhcmlhbnQgPSByZXF1aXJlKCdmYmpzL2xpYi9pbnZhcmlhbnQnKTtcblxuLyoqXG4gKiBSZXR1cm5zIHRoZSBmaXJzdCBjaGlsZCBpbiBhIGNvbGxlY3Rpb24gb2YgY2hpbGRyZW4gYW5kIHZlcmlmaWVzIHRoYXQgdGhlcmVcbiAqIGlzIG9ubHkgb25lIGNoaWxkIGluIHRoZSBjb2xsZWN0aW9uLlxuICpcbiAqIFNlZSBodHRwczovL2ZhY2Vib29rLmdpdGh1Yi5pby9yZWFjdC9kb2NzL3RvcC1sZXZlbC1hcGkuaHRtbCNyZWFjdC5jaGlsZHJlbi5vbmx5XG4gKlxuICogVGhlIGN1cnJlbnQgaW1wbGVtZW50YXRpb24gb2YgdGhpcyBmdW5jdGlvbiBhc3N1bWVzIHRoYXQgYSBzaW5nbGUgY2hpbGQgZ2V0c1xuICogcGFzc2VkIHdpdGhvdXQgYSB3cmFwcGVyLCBidXQgdGhlIHB1cnBvc2Ugb2YgdGhpcyBoZWxwZXIgZnVuY3Rpb24gaXMgdG9cbiAqIGFic3RyYWN0IGF3YXkgdGhlIHBhcnRpY3VsYXIgc3RydWN0dXJlIG9mIGNoaWxkcmVuLlxuICpcbiAqIEBwYXJhbSB7P29iamVjdH0gY2hpbGRyZW4gQ2hpbGQgY29sbGVjdGlvbiBzdHJ1Y3R1cmUuXG4gKiBAcmV0dXJuIHtSZWFjdEVsZW1lbnR9IFRoZSBmaXJzdCBhbmQgb25seSBgUmVhY3RFbGVtZW50YCBjb250YWluZWQgaW4gdGhlXG4gKiBzdHJ1Y3R1cmUuXG4gKi9cbmZ1bmN0aW9uIG9ubHlDaGlsZChjaGlsZHJlbikge1xuICAhUmVhY3RFbGVtZW50LmlzVmFsaWRFbGVtZW50KGNoaWxkcmVuKSA/IHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgPyBpbnZhcmlhbnQoZmFsc2UsICdSZWFjdC5DaGlsZHJlbi5vbmx5IGV4cGVjdGVkIHRvIHJlY2VpdmUgYSBzaW5nbGUgUmVhY3QgZWxlbWVudCBjaGlsZC4nKSA6IF9wcm9kSW52YXJpYW50KCcxNDMnKSA6IHZvaWQgMDtcbiAgcmV0dXJuIGNoaWxkcmVuO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG9ubHlDaGlsZDsiLCIvKipcbiAqIENvcHlyaWdodCAoYykgMjAxMy1wcmVzZW50LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBCU0Qtc3R5bGUgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS4gQW4gYWRkaXRpb25hbCBncmFudFxuICogb2YgcGF0ZW50IHJpZ2h0cyBjYW4gYmUgZm91bmQgaW4gdGhlIFBBVEVOVFMgZmlsZSBpbiB0aGUgc2FtZSBkaXJlY3RvcnkuXG4gKlxuICogQHByb3ZpZGVzTW9kdWxlIHJlYWN0UHJvZEludmFyaWFudFxuICogXG4gKi9cbid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBXQVJOSU5HOiBETyBOT1QgbWFudWFsbHkgcmVxdWlyZSB0aGlzIG1vZHVsZS5cbiAqIFRoaXMgaXMgYSByZXBsYWNlbWVudCBmb3IgYGludmFyaWFudCguLi4pYCB1c2VkIGJ5IHRoZSBlcnJvciBjb2RlIHN5c3RlbVxuICogYW5kIHdpbGwgX29ubHlfIGJlIHJlcXVpcmVkIGJ5IHRoZSBjb3JyZXNwb25kaW5nIGJhYmVsIHBhc3MuXG4gKiBJdCBhbHdheXMgdGhyb3dzLlxuICovXG5cbmZ1bmN0aW9uIHJlYWN0UHJvZEludmFyaWFudChjb2RlKSB7XG4gIHZhciBhcmdDb3VudCA9IGFyZ3VtZW50cy5sZW5ndGggLSAxO1xuXG4gIHZhciBtZXNzYWdlID0gJ01pbmlmaWVkIFJlYWN0IGVycm9yICMnICsgY29kZSArICc7IHZpc2l0ICcgKyAnaHR0cDovL2ZhY2Vib29rLmdpdGh1Yi5pby9yZWFjdC9kb2NzL2Vycm9yLWRlY29kZXIuaHRtbD9pbnZhcmlhbnQ9JyArIGNvZGU7XG5cbiAgZm9yICh2YXIgYXJnSWR4ID0gMDsgYXJnSWR4IDwgYXJnQ291bnQ7IGFyZ0lkeCsrKSB7XG4gICAgbWVzc2FnZSArPSAnJmFyZ3NbXT0nICsgZW5jb2RlVVJJQ29tcG9uZW50KGFyZ3VtZW50c1thcmdJZHggKyAxXSk7XG4gIH1cblxuICBtZXNzYWdlICs9ICcgZm9yIHRoZSBmdWxsIG1lc3NhZ2Ugb3IgdXNlIHRoZSBub24tbWluaWZpZWQgZGV2IGVudmlyb25tZW50JyArICcgZm9yIGZ1bGwgZXJyb3JzIGFuZCBhZGRpdGlvbmFsIGhlbHBmdWwgd2FybmluZ3MuJztcblxuICB2YXIgZXJyb3IgPSBuZXcgRXJyb3IobWVzc2FnZSk7XG4gIGVycm9yLm5hbWUgPSAnSW52YXJpYW50IFZpb2xhdGlvbic7XG4gIGVycm9yLmZyYW1lc1RvUG9wID0gMTsgLy8gd2UgZG9uJ3QgY2FyZSBhYm91dCByZWFjdFByb2RJbnZhcmlhbnQncyBvd24gZnJhbWVcblxuICB0aHJvdyBlcnJvcjtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSByZWFjdFByb2RJbnZhcmlhbnQ7IiwiLyoqXG4gKiBDb3B5cmlnaHQgMjAxMy1wcmVzZW50LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBCU0Qtc3R5bGUgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS4gQW4gYWRkaXRpb25hbCBncmFudFxuICogb2YgcGF0ZW50IHJpZ2h0cyBjYW4gYmUgZm91bmQgaW4gdGhlIFBBVEVOVFMgZmlsZSBpbiB0aGUgc2FtZSBkaXJlY3RvcnkuXG4gKlxuICogQHByb3ZpZGVzTW9kdWxlIHRyYXZlcnNlQWxsQ2hpbGRyZW5cbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbnZhciBfcHJvZEludmFyaWFudCA9IHJlcXVpcmUoJy4vcmVhY3RQcm9kSW52YXJpYW50Jyk7XG5cbnZhciBSZWFjdEN1cnJlbnRPd25lciA9IHJlcXVpcmUoJy4vUmVhY3RDdXJyZW50T3duZXInKTtcbnZhciBSZWFjdEVsZW1lbnQgPSByZXF1aXJlKCcuL1JlYWN0RWxlbWVudCcpO1xuXG52YXIgZ2V0SXRlcmF0b3JGbiA9IHJlcXVpcmUoJy4vZ2V0SXRlcmF0b3JGbicpO1xudmFyIGludmFyaWFudCA9IHJlcXVpcmUoJ2ZianMvbGliL2ludmFyaWFudCcpO1xudmFyIEtleUVzY2FwZVV0aWxzID0gcmVxdWlyZSgnLi9LZXlFc2NhcGVVdGlscycpO1xudmFyIHdhcm5pbmcgPSByZXF1aXJlKCdmYmpzL2xpYi93YXJuaW5nJyk7XG5cbnZhciBTRVBBUkFUT1IgPSAnLic7XG52YXIgU1VCU0VQQVJBVE9SID0gJzonO1xuXG4vKipcbiAqIFRPRE86IFRlc3QgdGhhdCBhIHNpbmdsZSBjaGlsZCBhbmQgYW4gYXJyYXkgd2l0aCBvbmUgaXRlbSBoYXZlIHRoZSBzYW1lIGtleVxuICogcGF0dGVybi5cbiAqL1xuXG52YXIgZGlkV2FybkFib3V0TWFwcyA9IGZhbHNlO1xuXG4vKipcbiAqIEdlbmVyYXRlIGEga2V5IHN0cmluZyB0aGF0IGlkZW50aWZpZXMgYSBjb21wb25lbnQgd2l0aGluIGEgc2V0LlxuICpcbiAqIEBwYXJhbSB7Kn0gY29tcG9uZW50IEEgY29tcG9uZW50IHRoYXQgY291bGQgY29udGFpbiBhIG1hbnVhbCBrZXkuXG4gKiBAcGFyYW0ge251bWJlcn0gaW5kZXggSW5kZXggdGhhdCBpcyB1c2VkIGlmIGEgbWFudWFsIGtleSBpcyBub3QgcHJvdmlkZWQuXG4gKiBAcmV0dXJuIHtzdHJpbmd9XG4gKi9cbmZ1bmN0aW9uIGdldENvbXBvbmVudEtleShjb21wb25lbnQsIGluZGV4KSB7XG4gIC8vIERvIHNvbWUgdHlwZWNoZWNraW5nIGhlcmUgc2luY2Ugd2UgY2FsbCB0aGlzIGJsaW5kbHkuIFdlIHdhbnQgdG8gZW5zdXJlXG4gIC8vIHRoYXQgd2UgZG9uJ3QgYmxvY2sgcG90ZW50aWFsIGZ1dHVyZSBFUyBBUElzLlxuICBpZiAoY29tcG9uZW50ICYmIHR5cGVvZiBjb21wb25lbnQgPT09ICdvYmplY3QnICYmIGNvbXBvbmVudC5rZXkgIT0gbnVsbCkge1xuICAgIC8vIEV4cGxpY2l0IGtleVxuICAgIHJldHVybiBLZXlFc2NhcGVVdGlscy5lc2NhcGUoY29tcG9uZW50LmtleSk7XG4gIH1cbiAgLy8gSW1wbGljaXQga2V5IGRldGVybWluZWQgYnkgdGhlIGluZGV4IGluIHRoZSBzZXRcbiAgcmV0dXJuIGluZGV4LnRvU3RyaW5nKDM2KTtcbn1cblxuLyoqXG4gKiBAcGFyYW0gez8qfSBjaGlsZHJlbiBDaGlsZHJlbiB0cmVlIGNvbnRhaW5lci5cbiAqIEBwYXJhbSB7IXN0cmluZ30gbmFtZVNvRmFyIE5hbWUgb2YgdGhlIGtleSBwYXRoIHNvIGZhci5cbiAqIEBwYXJhbSB7IWZ1bmN0aW9ufSBjYWxsYmFjayBDYWxsYmFjayB0byBpbnZva2Ugd2l0aCBlYWNoIGNoaWxkIGZvdW5kLlxuICogQHBhcmFtIHs/Kn0gdHJhdmVyc2VDb250ZXh0IFVzZWQgdG8gcGFzcyBpbmZvcm1hdGlvbiB0aHJvdWdob3V0IHRoZSB0cmF2ZXJzYWxcbiAqIHByb2Nlc3MuXG4gKiBAcmV0dXJuIHshbnVtYmVyfSBUaGUgbnVtYmVyIG9mIGNoaWxkcmVuIGluIHRoaXMgc3VidHJlZS5cbiAqL1xuZnVuY3Rpb24gdHJhdmVyc2VBbGxDaGlsZHJlbkltcGwoY2hpbGRyZW4sIG5hbWVTb0ZhciwgY2FsbGJhY2ssIHRyYXZlcnNlQ29udGV4dCkge1xuICB2YXIgdHlwZSA9IHR5cGVvZiBjaGlsZHJlbjtcblxuICBpZiAodHlwZSA9PT0gJ3VuZGVmaW5lZCcgfHwgdHlwZSA9PT0gJ2Jvb2xlYW4nKSB7XG4gICAgLy8gQWxsIG9mIHRoZSBhYm92ZSBhcmUgcGVyY2VpdmVkIGFzIG51bGwuXG4gICAgY2hpbGRyZW4gPSBudWxsO1xuICB9XG5cbiAgaWYgKGNoaWxkcmVuID09PSBudWxsIHx8IHR5cGUgPT09ICdzdHJpbmcnIHx8IHR5cGUgPT09ICdudW1iZXInIHx8IFJlYWN0RWxlbWVudC5pc1ZhbGlkRWxlbWVudChjaGlsZHJlbikpIHtcbiAgICBjYWxsYmFjayh0cmF2ZXJzZUNvbnRleHQsIGNoaWxkcmVuLFxuICAgIC8vIElmIGl0J3MgdGhlIG9ubHkgY2hpbGQsIHRyZWF0IHRoZSBuYW1lIGFzIGlmIGl0IHdhcyB3cmFwcGVkIGluIGFuIGFycmF5XG4gICAgLy8gc28gdGhhdCBpdCdzIGNvbnNpc3RlbnQgaWYgdGhlIG51bWJlciBvZiBjaGlsZHJlbiBncm93cy5cbiAgICBuYW1lU29GYXIgPT09ICcnID8gU0VQQVJBVE9SICsgZ2V0Q29tcG9uZW50S2V5KGNoaWxkcmVuLCAwKSA6IG5hbWVTb0Zhcik7XG4gICAgcmV0dXJuIDE7XG4gIH1cblxuICB2YXIgY2hpbGQ7XG4gIHZhciBuZXh0TmFtZTtcbiAgdmFyIHN1YnRyZWVDb3VudCA9IDA7IC8vIENvdW50IG9mIGNoaWxkcmVuIGZvdW5kIGluIHRoZSBjdXJyZW50IHN1YnRyZWUuXG4gIHZhciBuZXh0TmFtZVByZWZpeCA9IG5hbWVTb0ZhciA9PT0gJycgPyBTRVBBUkFUT1IgOiBuYW1lU29GYXIgKyBTVUJTRVBBUkFUT1I7XG5cbiAgaWYgKEFycmF5LmlzQXJyYXkoY2hpbGRyZW4pKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuICAgICAgY2hpbGQgPSBjaGlsZHJlbltpXTtcbiAgICAgIG5leHROYW1lID0gbmV4dE5hbWVQcmVmaXggKyBnZXRDb21wb25lbnRLZXkoY2hpbGQsIGkpO1xuICAgICAgc3VidHJlZUNvdW50ICs9IHRyYXZlcnNlQWxsQ2hpbGRyZW5JbXBsKGNoaWxkLCBuZXh0TmFtZSwgY2FsbGJhY2ssIHRyYXZlcnNlQ29udGV4dCk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHZhciBpdGVyYXRvckZuID0gZ2V0SXRlcmF0b3JGbihjaGlsZHJlbik7XG4gICAgaWYgKGl0ZXJhdG9yRm4pIHtcbiAgICAgIHZhciBpdGVyYXRvciA9IGl0ZXJhdG9yRm4uY2FsbChjaGlsZHJlbik7XG4gICAgICB2YXIgc3RlcDtcbiAgICAgIGlmIChpdGVyYXRvckZuICE9PSBjaGlsZHJlbi5lbnRyaWVzKSB7XG4gICAgICAgIHZhciBpaSA9IDA7XG4gICAgICAgIHdoaWxlICghKHN0ZXAgPSBpdGVyYXRvci5uZXh0KCkpLmRvbmUpIHtcbiAgICAgICAgICBjaGlsZCA9IHN0ZXAudmFsdWU7XG4gICAgICAgICAgbmV4dE5hbWUgPSBuZXh0TmFtZVByZWZpeCArIGdldENvbXBvbmVudEtleShjaGlsZCwgaWkrKyk7XG4gICAgICAgICAgc3VidHJlZUNvdW50ICs9IHRyYXZlcnNlQWxsQ2hpbGRyZW5JbXBsKGNoaWxkLCBuZXh0TmFtZSwgY2FsbGJhY2ssIHRyYXZlcnNlQ29udGV4dCk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgICAgICAgdmFyIG1hcHNBc0NoaWxkcmVuQWRkZW5kdW0gPSAnJztcbiAgICAgICAgICBpZiAoUmVhY3RDdXJyZW50T3duZXIuY3VycmVudCkge1xuICAgICAgICAgICAgdmFyIG1hcHNBc0NoaWxkcmVuT3duZXJOYW1lID0gUmVhY3RDdXJyZW50T3duZXIuY3VycmVudC5nZXROYW1lKCk7XG4gICAgICAgICAgICBpZiAobWFwc0FzQ2hpbGRyZW5Pd25lck5hbWUpIHtcbiAgICAgICAgICAgICAgbWFwc0FzQ2hpbGRyZW5BZGRlbmR1bSA9ICcgQ2hlY2sgdGhlIHJlbmRlciBtZXRob2Qgb2YgYCcgKyBtYXBzQXNDaGlsZHJlbk93bmVyTmFtZSArICdgLic7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgPyB3YXJuaW5nKGRpZFdhcm5BYm91dE1hcHMsICdVc2luZyBNYXBzIGFzIGNoaWxkcmVuIGlzIG5vdCB5ZXQgZnVsbHkgc3VwcG9ydGVkLiBJdCBpcyBhbiAnICsgJ2V4cGVyaW1lbnRhbCBmZWF0dXJlIHRoYXQgbWlnaHQgYmUgcmVtb3ZlZC4gQ29udmVydCBpdCB0byBhICcgKyAnc2VxdWVuY2UgLyBpdGVyYWJsZSBvZiBrZXllZCBSZWFjdEVsZW1lbnRzIGluc3RlYWQuJXMnLCBtYXBzQXNDaGlsZHJlbkFkZGVuZHVtKSA6IHZvaWQgMDtcbiAgICAgICAgICBkaWRXYXJuQWJvdXRNYXBzID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICAvLyBJdGVyYXRvciB3aWxsIHByb3ZpZGUgZW50cnkgW2ssdl0gdHVwbGVzIHJhdGhlciB0aGFuIHZhbHVlcy5cbiAgICAgICAgd2hpbGUgKCEoc3RlcCA9IGl0ZXJhdG9yLm5leHQoKSkuZG9uZSkge1xuICAgICAgICAgIHZhciBlbnRyeSA9IHN0ZXAudmFsdWU7XG4gICAgICAgICAgaWYgKGVudHJ5KSB7XG4gICAgICAgICAgICBjaGlsZCA9IGVudHJ5WzFdO1xuICAgICAgICAgICAgbmV4dE5hbWUgPSBuZXh0TmFtZVByZWZpeCArIEtleUVzY2FwZVV0aWxzLmVzY2FwZShlbnRyeVswXSkgKyBTVUJTRVBBUkFUT1IgKyBnZXRDb21wb25lbnRLZXkoY2hpbGQsIDApO1xuICAgICAgICAgICAgc3VidHJlZUNvdW50ICs9IHRyYXZlcnNlQWxsQ2hpbGRyZW5JbXBsKGNoaWxkLCBuZXh0TmFtZSwgY2FsbGJhY2ssIHRyYXZlcnNlQ29udGV4dCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIGlmICh0eXBlID09PSAnb2JqZWN0Jykge1xuICAgICAgdmFyIGFkZGVuZHVtID0gJyc7XG4gICAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgICAgICBhZGRlbmR1bSA9ICcgSWYgeW91IG1lYW50IHRvIHJlbmRlciBhIGNvbGxlY3Rpb24gb2YgY2hpbGRyZW4sIHVzZSBhbiBhcnJheSAnICsgJ2luc3RlYWQgb3Igd3JhcCB0aGUgb2JqZWN0IHVzaW5nIGNyZWF0ZUZyYWdtZW50KG9iamVjdCkgZnJvbSB0aGUgJyArICdSZWFjdCBhZGQtb25zLic7XG4gICAgICAgIGlmIChjaGlsZHJlbi5faXNSZWFjdEVsZW1lbnQpIHtcbiAgICAgICAgICBhZGRlbmR1bSA9ICcgSXQgbG9va3MgbGlrZSB5b3VcXCdyZSB1c2luZyBhbiBlbGVtZW50IGNyZWF0ZWQgYnkgYSBkaWZmZXJlbnQgJyArICd2ZXJzaW9uIG9mIFJlYWN0LiBNYWtlIHN1cmUgdG8gdXNlIG9ubHkgb25lIGNvcHkgb2YgUmVhY3QuJztcbiAgICAgICAgfVxuICAgICAgICBpZiAoUmVhY3RDdXJyZW50T3duZXIuY3VycmVudCkge1xuICAgICAgICAgIHZhciBuYW1lID0gUmVhY3RDdXJyZW50T3duZXIuY3VycmVudC5nZXROYW1lKCk7XG4gICAgICAgICAgaWYgKG5hbWUpIHtcbiAgICAgICAgICAgIGFkZGVuZHVtICs9ICcgQ2hlY2sgdGhlIHJlbmRlciBtZXRob2Qgb2YgYCcgKyBuYW1lICsgJ2AuJztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHZhciBjaGlsZHJlblN0cmluZyA9IFN0cmluZyhjaGlsZHJlbik7XG4gICAgICAhZmFsc2UgPyBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nID8gaW52YXJpYW50KGZhbHNlLCAnT2JqZWN0cyBhcmUgbm90IHZhbGlkIGFzIGEgUmVhY3QgY2hpbGQgKGZvdW5kOiAlcykuJXMnLCBjaGlsZHJlblN0cmluZyA9PT0gJ1tvYmplY3QgT2JqZWN0XScgPyAnb2JqZWN0IHdpdGgga2V5cyB7JyArIE9iamVjdC5rZXlzKGNoaWxkcmVuKS5qb2luKCcsICcpICsgJ30nIDogY2hpbGRyZW5TdHJpbmcsIGFkZGVuZHVtKSA6IF9wcm9kSW52YXJpYW50KCczMScsIGNoaWxkcmVuU3RyaW5nID09PSAnW29iamVjdCBPYmplY3RdJyA/ICdvYmplY3Qgd2l0aCBrZXlzIHsnICsgT2JqZWN0LmtleXMoY2hpbGRyZW4pLmpvaW4oJywgJykgKyAnfScgOiBjaGlsZHJlblN0cmluZywgYWRkZW5kdW0pIDogdm9pZCAwO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBzdWJ0cmVlQ291bnQ7XG59XG5cbi8qKlxuICogVHJhdmVyc2VzIGNoaWxkcmVuIHRoYXQgYXJlIHR5cGljYWxseSBzcGVjaWZpZWQgYXMgYHByb3BzLmNoaWxkcmVuYCwgYnV0XG4gKiBtaWdodCBhbHNvIGJlIHNwZWNpZmllZCB0aHJvdWdoIGF0dHJpYnV0ZXM6XG4gKlxuICogLSBgdHJhdmVyc2VBbGxDaGlsZHJlbih0aGlzLnByb3BzLmNoaWxkcmVuLCAuLi4pYFxuICogLSBgdHJhdmVyc2VBbGxDaGlsZHJlbih0aGlzLnByb3BzLmxlZnRQYW5lbENoaWxkcmVuLCAuLi4pYFxuICpcbiAqIFRoZSBgdHJhdmVyc2VDb250ZXh0YCBpcyBhbiBvcHRpb25hbCBhcmd1bWVudCB0aGF0IGlzIHBhc3NlZCB0aHJvdWdoIHRoZVxuICogZW50aXJlIHRyYXZlcnNhbC4gSXQgY2FuIGJlIHVzZWQgdG8gc3RvcmUgYWNjdW11bGF0aW9ucyBvciBhbnl0aGluZyBlbHNlIHRoYXRcbiAqIHRoZSBjYWxsYmFjayBtaWdodCBmaW5kIHJlbGV2YW50LlxuICpcbiAqIEBwYXJhbSB7Pyp9IGNoaWxkcmVuIENoaWxkcmVuIHRyZWUgb2JqZWN0LlxuICogQHBhcmFtIHshZnVuY3Rpb259IGNhbGxiYWNrIFRvIGludm9rZSB1cG9uIHRyYXZlcnNpbmcgZWFjaCBjaGlsZC5cbiAqIEBwYXJhbSB7Pyp9IHRyYXZlcnNlQ29udGV4dCBDb250ZXh0IGZvciB0cmF2ZXJzYWwuXG4gKiBAcmV0dXJuIHshbnVtYmVyfSBUaGUgbnVtYmVyIG9mIGNoaWxkcmVuIGluIHRoaXMgc3VidHJlZS5cbiAqL1xuZnVuY3Rpb24gdHJhdmVyc2VBbGxDaGlsZHJlbihjaGlsZHJlbiwgY2FsbGJhY2ssIHRyYXZlcnNlQ29udGV4dCkge1xuICBpZiAoY2hpbGRyZW4gPT0gbnVsbCkge1xuICAgIHJldHVybiAwO1xuICB9XG5cbiAgcmV0dXJuIHRyYXZlcnNlQWxsQ2hpbGRyZW5JbXBsKGNoaWxkcmVuLCAnJywgY2FsbGJhY2ssIHRyYXZlcnNlQ29udGV4dCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gdHJhdmVyc2VBbGxDaGlsZHJlbjsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyoqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTMtcHJlc2VudCwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgQlNELXN0eWxlIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuIEFuIGFkZGl0aW9uYWwgZ3JhbnRcbiAqIG9mIHBhdGVudCByaWdodHMgY2FuIGJlIGZvdW5kIGluIHRoZSBQQVRFTlRTIGZpbGUgaW4gdGhlIHNhbWUgZGlyZWN0b3J5LlxuICpcbiAqIFxuICovXG5cbmZ1bmN0aW9uIG1ha2VFbXB0eUZ1bmN0aW9uKGFyZykge1xuICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBhcmc7XG4gIH07XG59XG5cbi8qKlxuICogVGhpcyBmdW5jdGlvbiBhY2NlcHRzIGFuZCBkaXNjYXJkcyBpbnB1dHM7IGl0IGhhcyBubyBzaWRlIGVmZmVjdHMuIFRoaXMgaXNcbiAqIHByaW1hcmlseSB1c2VmdWwgaWRpb21hdGljYWxseSBmb3Igb3ZlcnJpZGFibGUgZnVuY3Rpb24gZW5kcG9pbnRzIHdoaWNoXG4gKiBhbHdheXMgbmVlZCB0byBiZSBjYWxsYWJsZSwgc2luY2UgSlMgbGFja3MgYSBudWxsLWNhbGwgaWRpb20gYWxhIENvY29hLlxuICovXG52YXIgZW1wdHlGdW5jdGlvbiA9IGZ1bmN0aW9uIGVtcHR5RnVuY3Rpb24oKSB7fTtcblxuZW1wdHlGdW5jdGlvbi50aGF0UmV0dXJucyA9IG1ha2VFbXB0eUZ1bmN0aW9uO1xuZW1wdHlGdW5jdGlvbi50aGF0UmV0dXJuc0ZhbHNlID0gbWFrZUVtcHR5RnVuY3Rpb24oZmFsc2UpO1xuZW1wdHlGdW5jdGlvbi50aGF0UmV0dXJuc1RydWUgPSBtYWtlRW1wdHlGdW5jdGlvbih0cnVlKTtcbmVtcHR5RnVuY3Rpb24udGhhdFJldHVybnNOdWxsID0gbWFrZUVtcHR5RnVuY3Rpb24obnVsbCk7XG5lbXB0eUZ1bmN0aW9uLnRoYXRSZXR1cm5zVGhpcyA9IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIHRoaXM7XG59O1xuZW1wdHlGdW5jdGlvbi50aGF0UmV0dXJuc0FyZ3VtZW50ID0gZnVuY3Rpb24gKGFyZykge1xuICByZXR1cm4gYXJnO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBlbXB0eUZ1bmN0aW9uOyIsIi8qKlxuICogQ29weXJpZ2h0IChjKSAyMDEzLXByZXNlbnQsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIEJTRC1zdHlsZSBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLiBBbiBhZGRpdGlvbmFsIGdyYW50XG4gKiBvZiBwYXRlbnQgcmlnaHRzIGNhbiBiZSBmb3VuZCBpbiB0aGUgUEFURU5UUyBmaWxlIGluIHRoZSBzYW1lIGRpcmVjdG9yeS5cbiAqXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgZW1wdHlPYmplY3QgPSB7fTtcblxuaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgT2JqZWN0LmZyZWV6ZShlbXB0eU9iamVjdCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZW1wdHlPYmplY3Q7IiwiLyoqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTMtcHJlc2VudCwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgQlNELXN0eWxlIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuIEFuIGFkZGl0aW9uYWwgZ3JhbnRcbiAqIG9mIHBhdGVudCByaWdodHMgY2FuIGJlIGZvdW5kIGluIHRoZSBQQVRFTlRTIGZpbGUgaW4gdGhlIHNhbWUgZGlyZWN0b3J5LlxuICpcbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbi8qKlxuICogVXNlIGludmFyaWFudCgpIHRvIGFzc2VydCBzdGF0ZSB3aGljaCB5b3VyIHByb2dyYW0gYXNzdW1lcyB0byBiZSB0cnVlLlxuICpcbiAqIFByb3ZpZGUgc3ByaW50Zi1zdHlsZSBmb3JtYXQgKG9ubHkgJXMgaXMgc3VwcG9ydGVkKSBhbmQgYXJndW1lbnRzXG4gKiB0byBwcm92aWRlIGluZm9ybWF0aW9uIGFib3V0IHdoYXQgYnJva2UgYW5kIHdoYXQgeW91IHdlcmVcbiAqIGV4cGVjdGluZy5cbiAqXG4gKiBUaGUgaW52YXJpYW50IG1lc3NhZ2Ugd2lsbCBiZSBzdHJpcHBlZCBpbiBwcm9kdWN0aW9uLCBidXQgdGhlIGludmFyaWFudFxuICogd2lsbCByZW1haW4gdG8gZW5zdXJlIGxvZ2ljIGRvZXMgbm90IGRpZmZlciBpbiBwcm9kdWN0aW9uLlxuICovXG5cbmZ1bmN0aW9uIGludmFyaWFudChjb25kaXRpb24sIGZvcm1hdCwgYSwgYiwgYywgZCwgZSwgZikge1xuICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgIGlmIChmb3JtYXQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdpbnZhcmlhbnQgcmVxdWlyZXMgYW4gZXJyb3IgbWVzc2FnZSBhcmd1bWVudCcpO1xuICAgIH1cbiAgfVxuXG4gIGlmICghY29uZGl0aW9uKSB7XG4gICAgdmFyIGVycm9yO1xuICAgIGlmIChmb3JtYXQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgZXJyb3IgPSBuZXcgRXJyb3IoJ01pbmlmaWVkIGV4Y2VwdGlvbiBvY2N1cnJlZDsgdXNlIHRoZSBub24tbWluaWZpZWQgZGV2IGVudmlyb25tZW50ICcgKyAnZm9yIHRoZSBmdWxsIGVycm9yIG1lc3NhZ2UgYW5kIGFkZGl0aW9uYWwgaGVscGZ1bCB3YXJuaW5ncy4nKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIGFyZ3MgPSBbYSwgYiwgYywgZCwgZSwgZl07XG4gICAgICB2YXIgYXJnSW5kZXggPSAwO1xuICAgICAgZXJyb3IgPSBuZXcgRXJyb3IoZm9ybWF0LnJlcGxhY2UoLyVzL2csIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIGFyZ3NbYXJnSW5kZXgrK107XG4gICAgICB9KSk7XG4gICAgICBlcnJvci5uYW1lID0gJ0ludmFyaWFudCBWaW9sYXRpb24nO1xuICAgIH1cblxuICAgIGVycm9yLmZyYW1lc1RvUG9wID0gMTsgLy8gd2UgZG9uJ3QgY2FyZSBhYm91dCBpbnZhcmlhbnQncyBvd24gZnJhbWVcbiAgICB0aHJvdyBlcnJvcjtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGludmFyaWFudDsiLCIvKipcbiAqIENvcHlyaWdodCAoYykgMjAxMy1wcmVzZW50LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBCU0Qtc3R5bGUgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS4gQW4gYWRkaXRpb25hbCBncmFudFxuICogb2YgcGF0ZW50IHJpZ2h0cyBjYW4gYmUgZm91bmQgaW4gdGhlIFBBVEVOVFMgZmlsZSBpbiB0aGUgc2FtZSBkaXJlY3RvcnkuXG4gKlxuICogQHR5cGVjaGVja3Mgc3RhdGljLW9ubHlcbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbnZhciBpbnZhcmlhbnQgPSByZXF1aXJlKCcuL2ludmFyaWFudCcpO1xuXG4vKipcbiAqIENvbnN0cnVjdHMgYW4gZW51bWVyYXRpb24gd2l0aCBrZXlzIGVxdWFsIHRvIHRoZWlyIHZhbHVlLlxuICpcbiAqIEZvciBleGFtcGxlOlxuICpcbiAqICAgdmFyIENPTE9SUyA9IGtleU1pcnJvcih7Ymx1ZTogbnVsbCwgcmVkOiBudWxsfSk7XG4gKiAgIHZhciBteUNvbG9yID0gQ09MT1JTLmJsdWU7XG4gKiAgIHZhciBpc0NvbG9yVmFsaWQgPSAhIUNPTE9SU1tteUNvbG9yXTtcbiAqXG4gKiBUaGUgbGFzdCBsaW5lIGNvdWxkIG5vdCBiZSBwZXJmb3JtZWQgaWYgdGhlIHZhbHVlcyBvZiB0aGUgZ2VuZXJhdGVkIGVudW0gd2VyZVxuICogbm90IGVxdWFsIHRvIHRoZWlyIGtleXMuXG4gKlxuICogICBJbnB1dDogIHtrZXkxOiB2YWwxLCBrZXkyOiB2YWwyfVxuICogICBPdXRwdXQ6IHtrZXkxOiBrZXkxLCBrZXkyOiBrZXkyfVxuICpcbiAqIEBwYXJhbSB7b2JqZWN0fSBvYmpcbiAqIEByZXR1cm4ge29iamVjdH1cbiAqL1xudmFyIGtleU1pcnJvciA9IGZ1bmN0aW9uIGtleU1pcnJvcihvYmopIHtcbiAgdmFyIHJldCA9IHt9O1xuICB2YXIga2V5O1xuICAhKG9iaiBpbnN0YW5jZW9mIE9iamVjdCAmJiAhQXJyYXkuaXNBcnJheShvYmopKSA/IHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgPyBpbnZhcmlhbnQoZmFsc2UsICdrZXlNaXJyb3IoLi4uKTogQXJndW1lbnQgbXVzdCBiZSBhbiBvYmplY3QuJykgOiBpbnZhcmlhbnQoZmFsc2UpIDogdm9pZCAwO1xuICBmb3IgKGtleSBpbiBvYmopIHtcbiAgICBpZiAoIW9iai5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG4gICAgcmV0W2tleV0gPSBrZXk7XG4gIH1cbiAgcmV0dXJuIHJldDtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0ga2V5TWlycm9yOyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKipcbiAqIENvcHlyaWdodCAoYykgMjAxMy1wcmVzZW50LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBCU0Qtc3R5bGUgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS4gQW4gYWRkaXRpb25hbCBncmFudFxuICogb2YgcGF0ZW50IHJpZ2h0cyBjYW4gYmUgZm91bmQgaW4gdGhlIFBBVEVOVFMgZmlsZSBpbiB0aGUgc2FtZSBkaXJlY3RvcnkuXG4gKlxuICovXG5cbi8qKlxuICogQWxsb3dzIGV4dHJhY3Rpb24gb2YgYSBtaW5pZmllZCBrZXkuIExldCdzIHRoZSBidWlsZCBzeXN0ZW0gbWluaWZ5IGtleXNcbiAqIHdpdGhvdXQgbG9zaW5nIHRoZSBhYmlsaXR5IHRvIGR5bmFtaWNhbGx5IHVzZSBrZXkgc3RyaW5ncyBhcyB2YWx1ZXNcbiAqIHRoZW1zZWx2ZXMuIFBhc3MgaW4gYW4gb2JqZWN0IHdpdGggYSBzaW5nbGUga2V5L3ZhbCBwYWlyIGFuZCBpdCB3aWxsIHJldHVyblxuICogeW91IHRoZSBzdHJpbmcga2V5IG9mIHRoYXQgc2luZ2xlIHJlY29yZC4gU3VwcG9zZSB5b3Ugd2FudCB0byBncmFiIHRoZVxuICogdmFsdWUgZm9yIGEga2V5ICdjbGFzc05hbWUnIGluc2lkZSBvZiBhbiBvYmplY3QuIEtleS92YWwgbWluaWZpY2F0aW9uIG1heVxuICogaGF2ZSBhbGlhc2VkIHRoYXQga2V5IHRvIGJlICd4YTEyJy4ga2V5T2Yoe2NsYXNzTmFtZTogbnVsbH0pIHdpbGwgcmV0dXJuXG4gKiAneGExMicgaW4gdGhhdCBjYXNlLiBSZXNvbHZlIGtleXMgeW91IHdhbnQgdG8gdXNlIG9uY2UgYXQgc3RhcnR1cCB0aW1lLCB0aGVuXG4gKiByZXVzZSB0aG9zZSByZXNvbHV0aW9ucy5cbiAqL1xudmFyIGtleU9mID0gZnVuY3Rpb24ga2V5T2Yob25lS2V5T2JqKSB7XG4gIHZhciBrZXk7XG4gIGZvciAoa2V5IGluIG9uZUtleU9iaikge1xuICAgIGlmICghb25lS2V5T2JqLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cbiAgICByZXR1cm4ga2V5O1xuICB9XG4gIHJldHVybiBudWxsO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBrZXlPZjsiLCIvKipcbiAqIENvcHlyaWdodCAyMDE0LTIwMTUsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIEJTRC1zdHlsZSBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLiBBbiBhZGRpdGlvbmFsIGdyYW50XG4gKiBvZiBwYXRlbnQgcmlnaHRzIGNhbiBiZSBmb3VuZCBpbiB0aGUgUEFURU5UUyBmaWxlIGluIHRoZSBzYW1lIGRpcmVjdG9yeS5cbiAqXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgZW1wdHlGdW5jdGlvbiA9IHJlcXVpcmUoJy4vZW1wdHlGdW5jdGlvbicpO1xuXG4vKipcbiAqIFNpbWlsYXIgdG8gaW52YXJpYW50IGJ1dCBvbmx5IGxvZ3MgYSB3YXJuaW5nIGlmIHRoZSBjb25kaXRpb24gaXMgbm90IG1ldC5cbiAqIFRoaXMgY2FuIGJlIHVzZWQgdG8gbG9nIGlzc3VlcyBpbiBkZXZlbG9wbWVudCBlbnZpcm9ubWVudHMgaW4gY3JpdGljYWxcbiAqIHBhdGhzLiBSZW1vdmluZyB0aGUgbG9nZ2luZyBjb2RlIGZvciBwcm9kdWN0aW9uIGVudmlyb25tZW50cyB3aWxsIGtlZXAgdGhlXG4gKiBzYW1lIGxvZ2ljIGFuZCBmb2xsb3cgdGhlIHNhbWUgY29kZSBwYXRocy5cbiAqL1xuXG52YXIgd2FybmluZyA9IGVtcHR5RnVuY3Rpb247XG5cbmlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gIChmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHByaW50V2FybmluZyA9IGZ1bmN0aW9uIHByaW50V2FybmluZyhmb3JtYXQpIHtcbiAgICAgIGZvciAodmFyIF9sZW4gPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gQXJyYXkoX2xlbiA+IDEgPyBfbGVuIC0gMSA6IDApLCBfa2V5ID0gMTsgX2tleSA8IF9sZW47IF9rZXkrKykge1xuICAgICAgICBhcmdzW19rZXkgLSAxXSA9IGFyZ3VtZW50c1tfa2V5XTtcbiAgICAgIH1cblxuICAgICAgdmFyIGFyZ0luZGV4ID0gMDtcbiAgICAgIHZhciBtZXNzYWdlID0gJ1dhcm5pbmc6ICcgKyBmb3JtYXQucmVwbGFjZSgvJXMvZywgZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gYXJnc1thcmdJbmRleCsrXTtcbiAgICAgIH0pO1xuICAgICAgaWYgKHR5cGVvZiBjb25zb2xlICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICBjb25zb2xlLmVycm9yKG1lc3NhZ2UpO1xuICAgICAgfVxuICAgICAgdHJ5IHtcbiAgICAgICAgLy8gLS0tIFdlbGNvbWUgdG8gZGVidWdnaW5nIFJlYWN0IC0tLVxuICAgICAgICAvLyBUaGlzIGVycm9yIHdhcyB0aHJvd24gYXMgYSBjb252ZW5pZW5jZSBzbyB0aGF0IHlvdSBjYW4gdXNlIHRoaXMgc3RhY2tcbiAgICAgICAgLy8gdG8gZmluZCB0aGUgY2FsbHNpdGUgdGhhdCBjYXVzZWQgdGhpcyB3YXJuaW5nIHRvIGZpcmUuXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihtZXNzYWdlKTtcbiAgICAgIH0gY2F0Y2ggKHgpIHt9XG4gICAgfTtcblxuICAgIHdhcm5pbmcgPSBmdW5jdGlvbiB3YXJuaW5nKGNvbmRpdGlvbiwgZm9ybWF0KSB7XG4gICAgICBpZiAoZm9ybWF0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdgd2FybmluZyhjb25kaXRpb24sIGZvcm1hdCwgLi4uYXJncylgIHJlcXVpcmVzIGEgd2FybmluZyAnICsgJ21lc3NhZ2UgYXJndW1lbnQnKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGZvcm1hdC5pbmRleE9mKCdGYWlsZWQgQ29tcG9zaXRlIHByb3BUeXBlOiAnKSA9PT0gMCkge1xuICAgICAgICByZXR1cm47IC8vIElnbm9yZSBDb21wb3NpdGVDb21wb25lbnQgcHJvcHR5cGUgY2hlY2suXG4gICAgICB9XG5cbiAgICAgIGlmICghY29uZGl0aW9uKSB7XG4gICAgICAgIGZvciAodmFyIF9sZW4yID0gYXJndW1lbnRzLmxlbmd0aCwgYXJncyA9IEFycmF5KF9sZW4yID4gMiA/IF9sZW4yIC0gMiA6IDApLCBfa2V5MiA9IDI7IF9rZXkyIDwgX2xlbjI7IF9rZXkyKyspIHtcbiAgICAgICAgICBhcmdzW19rZXkyIC0gMl0gPSBhcmd1bWVudHNbX2tleTJdO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpbnRXYXJuaW5nLmFwcGx5KHVuZGVmaW5lZCwgW2Zvcm1hdF0uY29uY2F0KGFyZ3MpKTtcbiAgICAgIH1cbiAgICB9O1xuICB9KSgpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHdhcm5pbmc7IiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vbGliL1JlYWN0Jyk7XG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vc3JjL1B1ZicpO1xyXG4iLCIvKipcbiAqIFJlYWN0IFB1ZiBCdW5kbGVcbiAqXG4gKiB2ZXJzaW9uIDx0dD4kIFZlcnNpb246IDEuMCAkPC90dD4gZGF0ZToyMDE2LzAzLzA4XG4gKiBhdXRob3IgPGEgaHJlZj1cIm1haWx0bzpocmFobkBua2lhLmNvLmtyXCI+QWhuIEh5dW5nLVJvPC9hPlxuICpcbiAqL1xuJ3VzZSBzdHJpY3QnO1xuXG4vLyBjb21wb25lbnRzXG4vLyBFbGVtZW50c1xudmFyIEFsZXJ0ID0gcmVxdWlyZSgnLi9jb21wb25lbnRzL0FsZXJ0Jyk7XG52YXIgTW9kYWwgPSByZXF1aXJlKCcuL2NvbXBvbmVudHMvTW9kYWwnKS5Nb2RhbDtcbnZhciBNb2RhbEhlYWRlciA9IHJlcXVpcmUoJy4vY29tcG9uZW50cy9Nb2RhbCcpLk1vZGFsSGVhZGVyO1xudmFyIE1vZGFsQm9keSA9IHJlcXVpcmUoJy4vY29tcG9uZW50cy9Nb2RhbCcpLk1vZGFsQm9keTtcbnZhciBNb2RhbEZvb3RlciA9IHJlcXVpcmUoJy4vY29tcG9uZW50cy9Nb2RhbCcpLk1vZGFsRm9vdGVyO1xudmFyIFBhbmVsID0gcmVxdWlyZSgnLi9jb21wb25lbnRzL1BhbmVsJykuUGFuZWw7XG52YXIgUGFuZWxIZWFkZXIgPSByZXF1aXJlKCcuL2NvbXBvbmVudHMvUGFuZWwnKS5QYW5lbEhlYWRlcjtcbnZhciBQYW5lbEJvZHkgPSByZXF1aXJlKCcuL2NvbXBvbmVudHMvUGFuZWwnKS5QYW5lbEJvZHk7XG52YXIgUGFuZWxGb290ZXIgPSByZXF1aXJlKCcuL2NvbXBvbmVudHMvUGFuZWwnKS5QYW5lbEZvb3RlcjtcbnZhciBIaWRkZW5Db250ZW50ID0gcmVxdWlyZSgnLi9jb21wb25lbnRzL0hpZGRlbkNvbnRlbnQnKTtcbnZhciBNYWluRnJhbWVTcGxpdHRlciA9IHJlcXVpcmUoJy4vY29tcG9uZW50cy9NYWluRnJhbWVTcGxpdHRlcicpO1xuXG4vLyBGb3JtIEVsZW1lbnRzXG52YXIgQ2hlY2tib3ggPSByZXF1aXJlKCcuL2NvbXBvbmVudHMvQ2hlY2tib3gnKS5DaGVja2JveDtcbnZhciBIQ2hlY2tib3ggPSByZXF1aXJlKCcuL2NvbXBvbmVudHMvQ2hlY2tib3gnKS5IQ2hlY2tib3g7XG52YXIgUmFkaW9Hcm91cCA9IHJlcXVpcmUoJy4vY29tcG9uZW50cy9yYWRpby9SYWRpb0dyb3VwJyk7XG52YXIgUmFkaW8gPSByZXF1aXJlKCcuL2NvbXBvbmVudHMvcmFkaW8vUmFkaW8nKTtcbnZhciBGaWVsZHNldCA9IHJlcXVpcmUoJy4vY29tcG9uZW50cy9GaWVsZHNldCcpO1xuXG4vLyBFdGMgRWxlbWVudHNcbnZhciBGaW5lVXBsb2FkZXIgPSByZXF1aXJlKCcuL2NvbXBvbmVudHMvRmluZVVwbG9hZGVyJyk7XG4vL3ZhciBUYWJTZXQgPSByZXF1aXJlKCcuL2NvbXBvbmVudHMvdGFicy9UYWJTZXQnKTtcbi8vdmFyIFRhYnMgPSByZXF1aXJlKCcuL2NvbXBvbmVudHMvdGFicy9UYWJzJyk7XG4vL3ZhciBUYWIgPSByZXF1aXJlKCcuL2NvbXBvbmVudHMvdGFicy9UYWInKTtcbi8vdmFyIFRhYkNvbnRlbnRzID0gcmVxdWlyZSgnLi9jb21wb25lbnRzL3RhYnMvVGFiQ29udGVudHMnKTtcbi8vdmFyIFRhYkNvbnRlbnQgPSByZXF1aXJlKCcuL2NvbXBvbmVudHMvdGFicy9UYWJDb250ZW50Jyk7XG5cbi8vIEtlbmRvXG52YXIgVHJlZVZpZXcgPSByZXF1aXJlKCcuL2tlbmRvL1RyZWVWaWV3Jyk7XG52YXIgR3JpZCA9IHJlcXVpcmUoJy4va2VuZG8vR3JpZCcpO1xudmFyIERyb3BEb3duTGlzdCA9IHJlcXVpcmUoJy4va2VuZG8vRHJvcERvd25MaXN0Jyk7XG52YXIgRGF0ZVBpY2tlciA9IHJlcXVpcmUoJy4va2VuZG8vRGF0ZVBpY2tlcicpO1xudmFyIERhdGVSYW5nZVBpY2tlciA9IHJlcXVpcmUoJy4va2VuZG8vRGF0ZVJhbmdlUGlja2VyJyk7XG52YXIgVGFiU3RyaXAgPSByZXF1aXJlKCcuL2tlbmRvL3RhYnN0cmlwL1RhYlN0cmlwJyk7XG52YXIgVGFicyA9IHJlcXVpcmUoJy4va2VuZG8vdGFic3RyaXAvVGFicycpO1xudmFyIFRhYiA9IHJlcXVpcmUoJy4va2VuZG8vdGFic3RyaXAvVGFiJyk7XG52YXIgVGFiQ29udGVudCA9IHJlcXVpcmUoJy4va2VuZG8vdGFic3RyaXAvVGFiQ29udGVudCcpO1xudmFyIFBhbmVsQmFyID0gcmVxdWlyZSgnLi9rZW5kby9QYW5lbEJhcicpO1xudmFyIE11bHRpU2VsZWN0ID0gcmVxdWlyZSgnLi9rZW5kby9NdWx0aVNlbGVjdCcpO1xudmFyIE51bWVyaWNUZXh0Qm94ID0gcmVxdWlyZSgnLi9rZW5kby9OdW1lcmljVGV4dEJveCcpO1xudmFyIFByb2dyZXNzQmFyID0gcmVxdWlyZSgnLi9rZW5kby9Qcm9ncmVzc0JhcicpO1xudmFyIFdpbmRvdyA9IHJlcXVpcmUoJy4va2VuZG8vV2luZG93Jyk7XG52YXIgQXV0b0NvbXBsZXRlID0gcmVxdWlyZSgnLi9rZW5kby9BdXRvQ29tcGxldGUnKTtcblxuLy8gU2VydmljZXNcbnZhciBVdGlsID0gcmVxdWlyZSgnLi9zZXJ2aWNlcy9VdGlsJyk7XG52YXIgRGF0ZVV0aWwgPSByZXF1aXJlKCcuL3NlcnZpY2VzL0RhdGVVdGlsJyk7XG52YXIgTnVtYmVyVXRpbCA9IHJlcXVpcmUoJy4vc2VydmljZXMvTnVtYmVyVXRpbCcpO1xudmFyIFJlZ0V4cCA9IHJlcXVpcmUoJy4vc2VydmljZXMvUmVnRXhwJyk7XG52YXIgUmVzb3VyY2UgPSByZXF1aXJlKCcuL3NlcnZpY2VzL1Jlc291cmNlJyk7XG5cbnZhciBQdWYgPSB7XG4gICAgLy8gRWxlbWVudHNcbiAgICBBbGVydDogQWxlcnQsXG4gICAgTW9kYWw6IE1vZGFsLFxuICAgIE1vZGFsSGVhZGVyOiBNb2RhbEhlYWRlcixcbiAgICBNb2RhbEJvZHk6IE1vZGFsQm9keSxcbiAgICBNb2RhbEZvb3RlcjogTW9kYWxGb290ZXIsXG4gICAgUGFuZWw6IFBhbmVsLFxuICAgIFBhbmVsSGVhZGVyOiBQYW5lbEhlYWRlcixcbiAgICBQYW5lbEJvZHk6IFBhbmVsQm9keSxcbiAgICBQYW5lbEZvb3RlcjogUGFuZWxGb290ZXIsXG4gICAgSGlkZGVuQ29udGVudDogSGlkZGVuQ29udGVudCxcbiAgICBNYWluRnJhbWVTcGxpdHRlcjogTWFpbkZyYW1lU3BsaXR0ZXIsXG5cbiAgICAvLyBGb3JtIEVsZW1lbnRzXG4gICAgQ2hlY2tib3g6IENoZWNrYm94LFxuICAgIEhDaGVja2JveDogSENoZWNrYm94LFxuICAgIFJhZGlvR3JvdXA6IFJhZGlvR3JvdXAsXG4gICAgUmFkaW86IFJhZGlvLFxuICAgIEZpZWxkc2V0OiBGaWVsZHNldCxcblxuICAgIC8vIEV0YyBFbGVtZW50c1xuICAgIEZpbmVVcGxvYWRlcjogRmluZVVwbG9hZGVyLFxuICAgIC8vVGFiU2V0OiBUYWJTZXQsXG4gICAgLy9UYWJzOiBUYWJzLFxuICAgIC8vVGFiOiBUYWIsXG4gICAgLy9UYWJDb250ZW50czogVGFiQ29udGVudHMsXG4gICAgLy9UYWJDb250ZW50OiBUYWJDb250ZW50LFxuXG4gICAgLy8gS2VuZG9cbiAgICBUcmVlVmlldzogVHJlZVZpZXcsXG4gICAgR3JpZDogR3JpZCxcbiAgICBEcm9wRG93bkxpc3Q6IERyb3BEb3duTGlzdCxcbiAgICBEYXRlUGlja2VyOiBEYXRlUGlja2VyLFxuICAgIERhdGVSYW5nZVBpY2tlcjogRGF0ZVJhbmdlUGlja2VyLFxuICAgIFRhYlN0cmlwOiBUYWJTdHJpcCxcbiAgICBUYWJzOiBUYWJzLFxuICAgIFRhYjogVGFiLFxuICAgIFRhYkNvbnRlbnQ6IFRhYkNvbnRlbnQsXG4gICAgUGFuZWxCYXI6IFBhbmVsQmFyLlBhbmVsQmFyLFxuICAgIFBhbmVsQmFyUGFuZTogUGFuZWxCYXIuUGFuZWxCYXJQYW5lLFxuICAgIE11bHRpU2VsZWN0OiBNdWx0aVNlbGVjdCxcbiAgICBOdW1lcmljVGV4dEJveDogTnVtZXJpY1RleHRCb3gsXG4gICAgUHJvZ3Jlc3NCYXI6IFByb2dyZXNzQmFyLFxuICAgIFdpbmRvdzogV2luZG93LFxuICAgIEF1dG9Db21wbGV0ZTogQXV0b0NvbXBsZXRlLFxuXG4gICAgLy8gU2VydmljZXNcbiAgICBVdGlsOiBVdGlsLFxuICAgIERhdGVVdGlsOiBEYXRlVXRpbCxcbiAgICBOdW1iZXJVdGlsOiBOdW1iZXJVdGlsLFxuICAgIFJlZ0V4cDogUmVnRXhwLFxuICAgIFJlc291cmNlOiBSZXNvdXJjZVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBQdWY7XG4iLCIvKipcclxuICogQWxlcnQgY29tcG9uZW50XHJcbiAqXHJcbiAqIHZlcnNpb24gPHR0PiQgVmVyc2lvbjogMS4wICQ8L3R0PiBkYXRlOjIwMTYvMDMvMjRcclxuICogYXV0aG9yIDxhIGhyZWY9XCJtYWlsdG86aHJhaG5AbmtpYS5jby5rclwiPkFobiBIeXVuZy1SbzwvYT5cclxuICpcclxuICogZXhhbXBsZTpcclxuICogPFB1bS5BbGVydCByZWY9XCJhbGVydFwiIHRpdGxlPVwi7YOA7J207YuAXCIgbWVzc2FnZT1cIuuplOyLnOyngFwiIG9uT2s9e3RoaXMub25Pa30gLz5cclxuICogPFB1bS5BbGVydCByZWY9XCJjb25maXJtXCIgdHlwZT1cImNvbmZpcm1cIiB0aXRsZT1cIu2DgOydtO2LgFwiIG1lc3NhZ2U9XCLrqZTsi5zsp4BcIiBvbk9rPXt0aGlzLm9uQ29uZmlybX0gb25DYW5jZWw9e3RoaXMub25DYW5jZWx9Lz5cclxuICpcclxuICogYm9vdHN0cmFwIGNvbXBvbmVudFxyXG4gKi9cclxuJ3VzZSBzdHJpY3QnO1xyXG5cclxudmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcclxudmFyIFByb3BUeXBlcyA9IHJlcXVpcmUoJ3JlYWN0JykuUHJvcFR5cGVzO1xyXG52YXIgY2xhc3NOYW1lcyA9IHJlcXVpcmUoJ2NsYXNzbmFtZXMnKTtcclxuXHJcbnZhciBVdGlsID0gcmVxdWlyZSgnLi4vc2VydmljZXMvVXRpbCcpO1xyXG5cclxudmFyIEFsZXJ0ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xyXG4gICAgZGlzcGxheU5hbWU6ICdBbGVydCcsXHJcbiAgICBwcm9wVHlwZXM6IHtcclxuICAgICAgICBpZDogUHJvcFR5cGVzLnN0cmluZyxcclxuICAgICAgICBjbGFzc05hbWU6IFByb3BUeXBlcy5zdHJpbmcsXHJcbiAgICAgICAgdHlwZTogUHJvcFR5cGVzLnN0cmluZywgICAgICAgICAgICAgLy8gbnVsbC9jb25maXJtIChkZWZhdWx0OiBudWxsKVxyXG4gICAgICAgIHRpdGxlOiBQcm9wVHlwZXMuc3RyaW5nLFxyXG4gICAgICAgIHRpdGxlSWNvbkNsYXNzTmFtZTogUHJvcFR5cGVzLnN0cmluZyxcclxuICAgICAgICBtZXNzYWdlOiBQcm9wVHlwZXMuc3RyaW5nLFxyXG4gICAgICAgIG9rTGFiZWw6IFByb3BUeXBlcy5zdHJpbmcsXHJcbiAgICAgICAgY2FuY2VsTGFiZWw6IFByb3BUeXBlcy5zdHJpbmcsXHJcbiAgICAgICAgb2tDbGFzc05hbWU6IFByb3BUeXBlcy5zdHJpbmcsXHJcbiAgICAgICAgY2FuY2VsQ2xhc3NOYW1lOiBQcm9wVHlwZXMuc3RyaW5nLFxyXG4gICAgICAgIG9uT2s6IFByb3BUeXBlcy5mdW5jLFxyXG4gICAgICAgIG9uQ2FuY2VsOiBQcm9wVHlwZXMuZnVuYyxcclxuICAgICAgICB3aWR0aDogUHJvcFR5cGVzLm9uZU9mVHlwZShbXHJcbiAgICAgICAgICAgIFByb3BUeXBlcy5zdHJpbmcsXHJcbiAgICAgICAgICAgIFByb3BUeXBlcy5udW1iZXJcclxuICAgICAgICBdKVxyXG4gICAgfSxcclxuICAgIGlkOiAnJyxcclxuICAgIHNob3c6IGZ1bmN0aW9uKG9rRnVuYywgY2FuY2VsRnVuYykge1xyXG4gICAgICAgIHZhciBhbGVydCA9ICQoJyMnK3RoaXMuaWQpO1xyXG4gICAgICAgIGFsZXJ0Lm1vZGFsKCdzaG93Jyk7XHJcblxyXG4gICAgICAgIHRoaXMub2tGdW5jID0gb2tGdW5jO1xyXG4gICAgICAgIHRoaXMuY2FuY2VsRnVuYyA9IGNhbmNlbEZ1bmM7XHJcbiAgICB9LFxyXG4gICAgaGlkZTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIGFsZXJ0ID0gJCgnIycrdGhpcy5pZCk7XHJcbiAgICAgICAgYWxlcnQubW9kYWwoJ2hpZGUnKTtcclxuICAgIH0sXHJcbiAgICBzZXRNZXNzYWdlOiBmdW5jdGlvbihtZXNzYWdlKSB7XHJcbiAgICAgICAgaWYodHlwZW9mIG1lc3NhZ2UgPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe21lc3NhZ2U6IG1lc3NhZ2V9KTtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgb25PazogZnVuY3Rpb24oZXZlbnQpIHtcclxuICAgICAgICAvLyBjdXN0b20gZXZlbnQgZW1pdCDsl5Ag64yA7ZW07IScIOyXsOq1rCDtlYTsmpRcclxuICAgICAgICB0aGlzLmhpZGUoKTtcclxuXHJcbiAgICAgICAgLy8gb2tGdW5jXHJcbiAgICAgICAgaWYodHlwZW9mIHRoaXMub2tGdW5jID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgICAgIHRoaXMub2tGdW5jKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBvbk9rXHJcbiAgICAgICAgaWYodHlwZW9mIHRoaXMucHJvcHMub25PayA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgICAgICB0aGlzLnByb3BzLm9uT2soKTtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgb25DYW5jZWw6IGZ1bmN0aW9uKGV2ZW50KSB7XHJcbiAgICAgICAgLy8gY3VzdG9tIGV2ZW50IGVtaXQg7JeQIOuMgO2VtOyEnCDsl7Dqtawg7ZWE7JqUXHJcbiAgICAgICAgdGhpcy5oaWRlKCk7XHJcblxyXG4gICAgICAgIC8vIGNhbmNlbEZ1bmNcclxuICAgICAgICBpZih0eXBlb2YgdGhpcy5jYW5jZWxGdW5jID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY2FuY2VsRnVuYygpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gb25DYW5jZWxcclxuICAgICAgICBpZih0eXBlb2YgdGhpcy5wcm9wcy5vbkNhbmNlbCA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgICAgICB0aGlzLnByb3BzLm9uQ2FuY2VsKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIGdldERlZmF1bHRQcm9wczogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIHt0aXRsZTogJ1RpdGxlJywgb2tMYWJlbDogJHBzX2xvY2FsZS5jb25maXJtLCBjYW5jZWxMYWJlbDogJHBzX2xvY2FsZS5jYW5jZWx9O1xyXG4gICAgfSxcclxuICAgIGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgLy8g7Lu07Y+s64SM7Yq46rCAIOuniOyatO2KuOuQmOq4sCDsoIQgKO2VnOuyiCDtmLjstpwpIC8g66as7YS06rCS7J2AIHRoaXMuc3RhdGXsnZgg7LSI6riw6rCS7Jy866GcIOyCrOyaqVxyXG4gICAgICAgIGNvbnN0IHt0aXRsZSwgbWVzc2FnZX0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIHJldHVybiB7dGl0bGU6IHRpdGxlLCBtZXNzYWdlOiBtZXNzYWdlfTtcclxuICAgIH0sXHJcbiAgICBjb21wb25lbnRXaWxsTW91bnQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIC8vIOy1nOy0iCDroIzrjZTrp4HsnbQg7J287Ja064KY6riwIOyngeyghCjtlZzrsogg7Zi47LacKVxyXG4gICAgICAgIGxldCBpZCA9IHRoaXMucHJvcHMuaWQ7XHJcbiAgICAgICAgaWYodHlwZW9mIGlkID09PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgICAgICBpZCA9IFV0aWwuZ2V0VVVJRCgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5pZCA9IGlkO1xyXG4gICAgfSxcclxuICAgIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHM6IGZ1bmN0aW9uKG5leHRQcm9wcykge1xyXG4gICAgICAgIC8vIOy7tO2PrOuEjO2KuOqwgCDsg4jroZzsmrQgcHJvcHPrpbwg67Cb7J2EIOuVjCDtmLjstpwo7LWc7LSIIOugjOuNlOungSDsi5zsl5DripQg7Zi47Lac65CY7KeAIOyViuydjClcclxuICAgICAgICB0aGlzLnNldFN0YXRlKHt0aXRsZTogbmV4dFByb3BzLnRpdGxlLCBtZXNzYWdlOiBuZXh0UHJvcHMubWVzc2FnZX0pO1xyXG4gICAgfSxcclxuICAgIHJlbmRlcjogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgLy8g7ZWE7IiYIO2VreuqqVxyXG4gICAgICAgIGNvbnN0IHtjbGFzc05hbWUsIHR5cGUsIG9rTGFiZWwsIGNhbmNlbExhYmVsLCBva0NsYXNzTmFtZSwgY2FuY2VsQ2xhc3NOYW1lLCB0aXRsZUljb25DbGFzc05hbWUsIHdpZHRofSA9IHRoaXMucHJvcHM7XHJcblxyXG4gICAgICAgIHZhciBjYW5jZWxCdXR0b247XHJcbiAgICAgICAgaWYodHlwZSA9PT0gJ2NvbmZpcm0nKSB7XHJcbiAgICAgICAgICAgIGNhbmNlbEJ1dHRvbiA9IDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzTmFtZT17Y2xhc3NOYW1lcygnYnRuJywgJ2J0bi1jYW5jZWwnLCBjYW5jZWxDbGFzc05hbWUpfSBvbkNsaWNrPXt0aGlzLm9uQ2FuY2VsfSBkYXRhLWRpc21pc3M9XCJtb2RhbFwiPntjYW5jZWxMYWJlbH08L2J1dHRvbj47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICA8ZGl2IGlkPXt0aGlzLmlkfSBjbGFzc05hbWU9e2NsYXNzTmFtZXMoJ21vZGFsJywgJ21vZGFsLWFsZXJ0JywgY2xhc3NOYW1lKX0gcm9sZT1cImRpYWxvZ1wiIGFyaWEtbGFiZWxsZWRieT1cIlwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiIGRhdGEtYmFja2Ryb3A9XCJzdGF0aWNcIiBkYXRhLWtleWJvYXJkPVwiZmFsc2VcIj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibW9kYWwtZGlhbG9nIG1vZGFsLXNtXCIgc3R5bGU9e3t3aWR0aDogd2lkdGh9fT5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1vZGFsLWNvbnRlbnRcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtb2RhbC1oZWFkZXJcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT17Y2xhc3NOYW1lcygndGl0bGUtaWNvbicsIHRpdGxlSWNvbkNsYXNzTmFtZSl9IC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJtb2RhbC10aXRsZVwiPnt0aGlzLnN0YXRlLnRpdGxlfTwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibW9kYWwtYm9keVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge3RoaXMuc3RhdGUubWVzc2FnZX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibW9kYWwtZm9vdGVyXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzc05hbWU9e2NsYXNzTmFtZXMoJ2J0bicsICdidG4tb2snLCBva0NsYXNzTmFtZSl9IG9uQ2xpY2s9e3RoaXMub25Pa30+e29rTGFiZWx9PC9idXR0b24+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7Y2FuY2VsQnV0dG9ufVxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICApO1xyXG4gICAgfVxyXG59KTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQWxlcnQ7IiwiLyoqXHJcbiAqIENoZWNrQm94IGNvbXBvbmVudFxyXG4gKlxyXG4gKiB2ZXJzaW9uIDx0dD4kIFZlcnNpb246IDEuMCAkPC90dD4gZGF0ZToyMDE2LzAzLzE0XHJcbiAqIGF1dGhvciA8YSBocmVmPVwibWFpbHRvOmhyYWhuQG5raWEuY28ua3JcIj5BaG4gSHl1bmctUm88L2E+XHJcbiAqXHJcbiAqIGV4YW1wbGU6XHJcbiAqIDxQdW0uQ2hlY2tCb3ggbmFtZT1cIm5hbWUxXCIgdmFsdWU9XCJ2YWx1ZTFcIiBvbkNoYW5nZT17dGhpcy5vbkNoYW5nZX0gY2hlY2tlZD17dHJ1ZX0+IOyytO2BrOuwleyKpDwvUHVtLkNoZWNrQm94PlxyXG4gKlxyXG4gKi9cclxuJ3VzZSBzdHJpY3QnO1xyXG5cclxudmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcclxudmFyIFByb3BUeXBlcyA9IHJlcXVpcmUoJ3JlYWN0JykuUHJvcFR5cGVzO1xyXG52YXIgY2xhc3NOYW1lcyA9IHJlcXVpcmUoJ2NsYXNzbmFtZXMnKTtcclxuXHJcbnZhciBVdGlsID0gcmVxdWlyZSgnLi4vc2VydmljZXMvVXRpbCcpO1xyXG5cclxudmFyIENoZWNrYm94ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xyXG4gICAgZGlzcGxheU5hbWU6ICdDaGVja2JveCcsXHJcbiAgICBwcm9wVHlwZXM6IHtcclxuICAgICAgICBpZDogUHJvcFR5cGVzLnN0cmluZyxcclxuICAgICAgICBjbGFzc05hbWU6IFByb3BUeXBlcy5zdHJpbmcsXHJcbiAgICAgICAgbmFtZTogUHJvcFR5cGVzLnN0cmluZyxcclxuICAgICAgICB2YWx1ZTogUHJvcFR5cGVzLnN0cmluZyxcclxuICAgICAgICBjaGVja2VkOiBQcm9wVHlwZXMuYm9vbCxcclxuICAgICAgICBkaXJlY3Rpb246IFByb3BUeXBlcy5vbmVPZihbJ2gnLCd2J10pLFxyXG4gICAgICAgIG9uQ2hhbmdlOiBQcm9wVHlwZXMuZnVuY1xyXG4gICAgfSxcclxuICAgIG9uQ2hhbmdlOiBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgLy9jb25zb2xlLmxvZyhlKTtcclxuICAgICAgICB2YXIgY2hlY2tlZCA9ICF0aGlzLnN0YXRlLmNoZWNrZWQ7XHJcbiAgICAgICAgLy9jb25zb2xlLmxvZyhjaGVja2VkKTtcclxuICAgICAgICB0aGlzLnNldFN0YXRlKHtjaGVja2VkOiBjaGVja2VkfSk7XHJcbiAgICAgICAgaWYodHlwZW9mIHRoaXMucHJvcHMub25DaGFuZ2UgPT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICAgICAgdGhpcy5wcm9wcy5vbkNoYW5nZShlLCBjaGVja2VkLCB0aGlzLiRjaGVja2JveC52YWwoKSk7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIHNldFZhbHVlOiBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgY2hlY2tlZCA9IHRoaXMuc3RhdGUuY2hlY2tlZDsvKixcclxuICAgICAgICAgICAgJGNoZWNrYm94ID0gJCgnaW5wdXQ6Y2hlY2tib3hbbmFtZT1cIicgKyB0aGlzLnByb3BzLm5hbWUgKyAnXCJdJyk7Ki9cclxuICAgICAgICBpZih0eXBlb2YgdGhpcy5wcm9wcy52YWx1ZSA9PT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICAgICAgLy8gdHJ1ZS9mYWxzZSDshKTsoJVcclxuICAgICAgICAgICAgdGhpcy4kY2hlY2tib3gudmFsKGNoZWNrZWQpO1xyXG4gICAgICAgIH1lbHNlIHtcclxuICAgICAgICAgICAgaWYoY2hlY2tlZCA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy4kY2hlY2tib3gudmFsKHRoaXMucHJvcHMudmFsdWUpO1xyXG4gICAgICAgICAgICB9ZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLiRjaGVja2JveC52YWwobnVsbCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgc2V0U3RhdGVPYmplY3Q6IGZ1bmN0aW9uKHByb3BzKSB7XHJcbiAgICAgICAgLy9sZXQgdmFsdWUgPSBwcm9wcy52YWx1ZTtcclxuICAgICAgICAvL2lmKHR5cGVvZiB2YWx1ZSA9PT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICAvLyAgICB2YWx1ZSA9IG51bGw7XHJcbiAgICAgICAgLy99XHJcblxyXG4gICAgICAgIGxldCBjaGVja2VkID0gcHJvcHMuY2hlY2tlZDtcclxuICAgICAgICBpZih0eXBlb2YgY2hlY2tlZCA9PT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICAgICAgY2hlY2tlZCA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgLy92YWx1ZTogdmFsdWUsXHJcbiAgICAgICAgICAgIGNoZWNrZWQ6IGNoZWNrZWRcclxuICAgICAgICB9O1xyXG4gICAgfSxcclxuICAgIGdldERlZmF1bHRQcm9wczogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgLy8g7YG0656Y7Iqk6rCAIOyDneyEseuQoCDrlYwg7ZWc67KIIO2YuOy2nOuQmOqzoCDsupDsi5zrkJzri6QuXHJcbiAgICAgICAgLy8g67aA66qoIOy7tO2PrOuEjO2KuOyXkOyEnCBwcm9w7J20IOuEmOyWtOyYpOyngCDslYrsnYAg6rK97JqwIChpbiDsl7DsgrDsnpDroZwg7ZmV7J24KSDrp6TtlZHsnZgg6rCS7J20IHRoaXMucHJvcHPsl5Ag7ISk7KCV65Cc64ukLlxyXG4gICAgICAgIHJldHVybiB7IGRpcmVjdGlvbjogJ3YnIH07XHJcbiAgICB9LFxyXG4gICAgZ2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5zZXRTdGF0ZU9iamVjdCh0aGlzLnByb3BzKTtcclxuICAgIH0sXHJcbiAgICBjb21wb25lbnRXaWxsTW91bnQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIC8vIOy1nOy0iCDroIzrjZTrp4HsnbQg7J287Ja064KY6riwIOyngeyghCjtlZzrsogg7Zi47LacKVxyXG4gICAgICAgIGxldCBpZCA9IHRoaXMucHJvcHMuaWQ7XHJcbiAgICAgICAgaWYodHlwZW9mIGlkID09PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgICAgICBpZCA9IFV0aWwuZ2V0VVVJRCgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5pZCA9IGlkO1xyXG4gICAgfSxcclxuICAgIGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbigpIHtcclxuICAgICAgICAvLyDstZzstIgg66CM642U66eB7J20IOydvOyWtOuCnCDri6TsnYwo7ZWc67KIIO2YuOy2nClcclxuICAgICAgICB0aGlzLiRjaGVja2JveCA9ICQoJ2lucHV0OmNoZWNrYm94W25hbWU9XCInICsgdGhpcy5wcm9wcy5uYW1lICsgJ1wiXScpO1xyXG5cclxuICAgICAgICBpZih0aGlzLnByb3BzLmRpcmVjdGlvbiA9PT0gJ2gnKSB7XHJcbiAgICAgICAgICAgIGxldCAkZGl2ID0gJCgnIycrdGhpcy5pZCksXHJcbiAgICAgICAgICAgICAgICAkbGFiZWwgPSAkZGl2LmNoaWxkcmVuKCk7XHJcbiAgICAgICAgICAgICRsYWJlbC5hZGRDbGFzcygnY2hlY2tib3gtaW5saW5lJyk7XHJcbiAgICAgICAgICAgICRkaXYucmVwbGFjZVdpdGgoJGxhYmVsKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuc2V0VmFsdWUoKTtcclxuICAgIH0sXHJcbiAgICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzOiBmdW5jdGlvbihuZXh0UHJvcHMpIHtcclxuICAgICAgICAvLyDsu7Ttj6zrhIztirjqsIAg7IOI66Gc7Jq0IHByb3Bz66W8IOuwm+ydhCDrlYwg7Zi47LacKOy1nOy0iCDroIzrjZTrp4Eg7Iuc7JeQ64qUIO2YuOy2nOuQmOyngCDslYrsnYwpXHJcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh0aGlzLnNldFN0YXRlT2JqZWN0KG5leHRQcm9wcykpO1xyXG4gICAgfSxcclxuICAgIGNvbXBvbmVudERpZFVwZGF0ZTogZnVuY3Rpb24ocHJldlByb3BzLCBwcmV2U3RhdGUpIHtcclxuICAgICAgICAvLyDsu7Ttj6zrhIztirjsnZgg7JeF642w7J207Yq46rCAIERPTeyXkCDrsJjsmIHrkJwg7KeB7ZuE7JeQIO2YuOy2nCjstZzstIgg66CM642U66eBIOyLnOyXkOuKlCDtmLjstpzrkJjsp4Ag7JWK7J2MKVxyXG4gICAgICAgIC8vY29uc29sZS5sb2cocHJldlByb3BzKTtcclxuICAgICAgICAvL2NvbnNvbGUubG9nKHByZXZTdGF0ZSk7XHJcbiAgICAgICAgLy9jb25zb2xlLmxvZyh0aGlzLnN0YXRlKTtcclxuICAgICAgICB0aGlzLnNldFZhbHVlKCk7XHJcbiAgICB9LFxyXG4gICAgcmVuZGVyOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAvLyDtlYTsiJgg7ZWt66qpXHJcbiAgICAgICAgY29uc3Qge2NsYXNzTmFtZSwgbmFtZSwgY2hpbGRyZW59ID0gdGhpcy5wcm9wcztcclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoZWNrYm94XCIgaWQ9e3RoaXMuaWR9PlxyXG4gICAgICAgICAgICAgICAgPGxhYmVsPlxyXG4gICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIiBjbGFzc05hbWU9e2NsYXNzTmFtZX0gbmFtZT17bmFtZX0gY2hlY2tlZD17dGhpcy5zdGF0ZS5jaGVja2VkfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17dGhpcy5vbkNoYW5nZX0gLz5cclxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJsYmxcIj57Y2hpbGRyZW59PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgIHsvKjxpbnB1dCB0eXBlPVwiaGlkZGVuXCIgbmFtZT17dGhpcy5wcm9wcy5uYW1lfSB2YWx1ZT17dGhpcy5zdGF0ZS52YWx1ZX0+Ki99XHJcbiAgICAgICAgICAgICAgICA8L2xhYmVsPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICApO1xyXG4gICAgfVxyXG59KTtcclxuXHJcbnZhciBIQ2hlY2tib3ggPSBSZWFjdC5jcmVhdGVDbGFzcyh7XHJcbiAgICBkaXNwbGF5TmFtZTogJ0hDaGVja2JveCcsXHJcbiAgICBwcm9wVHlwZXM6IHtcclxuICAgICAgICBpZDogUHJvcFR5cGVzLnN0cmluZyxcclxuICAgICAgICBjbGFzc05hbWU6IFByb3BUeXBlcy5zdHJpbmcsXHJcbiAgICAgICAgbmFtZTogUHJvcFR5cGVzLnN0cmluZyxcclxuICAgICAgICB2YWx1ZTogUHJvcFR5cGVzLnN0cmluZyxcclxuICAgICAgICBjaGVja2VkOiBQcm9wVHlwZXMuYm9vbCxcclxuICAgICAgICBvbkNoYW5nZTogUHJvcFR5cGVzLmZ1bmNcclxuICAgIH0sXHJcbiAgICBvbkNoYW5nZTogZnVuY3Rpb24oZXZlbnQpIHtcclxuICAgICAgICAvL2NvbnNvbGUubG9nKGV2ZW50KTtcclxuICAgICAgICB2YXIgY2hlY2tlZCA9ICF0aGlzLnN0YXRlLmNoZWNrZWQ7XHJcbiAgICAgICAgLy9jb25zb2xlLmxvZyhjaGVja2VkKTtcclxuICAgICAgICB0aGlzLnNldFN0YXRlKHtjaGVja2VkOiBjaGVja2VkfSk7XHJcbiAgICAgICAgaWYodHlwZW9mIHRoaXMucHJvcHMub25DaGFuZ2UgPT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICAgICAgdGhpcy5wcm9wcy5vbkNoYW5nZShldmVudCwgY2hlY2tlZCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH0sXHJcbiAgICBzZXRWYWx1ZTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIGNoZWNrZWQgPSB0aGlzLnN0YXRlLmNoZWNrZWQsXHJcbiAgICAgICAgICAgICRjaGVja2JveCA9ICQoJ2lucHV0OmNoZWNrYm94W25hbWU9XCInICsgdGhpcy5wcm9wcy5uYW1lICsgJ1wiXScpO1xyXG4gICAgICAgIGlmKHR5cGVvZiB0aGlzLnByb3BzLnZhbHVlID09PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgICAgICAvLyB0cnVlL2ZhbHNlIOyEpOyglVxyXG4gICAgICAgICAgICAkY2hlY2tib3gudmFsKGNoZWNrZWQpO1xyXG4gICAgICAgIH1lbHNlIHtcclxuICAgICAgICAgICAgaWYoY2hlY2tlZCA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgJGNoZWNrYm94LnZhbCh0aGlzLnByb3BzLnZhbHVlKTtcclxuICAgICAgICAgICAgfWVsc2Uge1xyXG4gICAgICAgICAgICAgICAgJGNoZWNrYm94LnZhbChudWxsKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICBzZXRTdGF0ZU9iamVjdDogZnVuY3Rpb24ocHJvcHMpIHtcclxuICAgICAgICAvL2xldCB2YWx1ZSA9IHByb3BzLnZhbHVlO1xyXG4gICAgICAgIC8vaWYodHlwZW9mIHZhbHVlID09PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgIC8vICAgIHZhbHVlID0gbnVsbDtcclxuICAgICAgICAvL31cclxuXHJcbiAgICAgICAgbGV0IGNoZWNrZWQgPSBwcm9wcy5jaGVja2VkO1xyXG4gICAgICAgIGlmKHR5cGVvZiBjaGVja2VkID09PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgICAgICBjaGVja2VkID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAvL3ZhbHVlOiB2YWx1ZSxcclxuICAgICAgICAgICAgY2hlY2tlZDogY2hlY2tlZFxyXG4gICAgICAgIH07XHJcbiAgICB9LFxyXG4gICAgZ2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5zZXRTdGF0ZU9iamVjdCh0aGlzLnByb3BzKTtcclxuICAgIH0sXHJcbiAgICBjb21wb25lbnREaWRNb3VudDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgLy8g7LWc7LSIIOugjOuNlOungeydtCDsnbzslrTrgpwg64uk7J2MKO2VnOuyiCDtmLjstpwpXHJcbiAgICAgICAgdGhpcy5zZXRWYWx1ZSgpO1xyXG4gICAgfSxcclxuICAgIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHM6IGZ1bmN0aW9uKG5leHRQcm9wcykge1xyXG4gICAgICAgIC8vIOy7tO2PrOuEjO2KuOqwgCDsg4jroZzsmrQgcHJvcHPrpbwg67Cb7J2EIOuVjCDtmLjstpwo7LWc7LSIIOugjOuNlOungSDsi5zsl5DripQg7Zi47Lac65CY7KeAIOyViuydjClcclxuICAgICAgICB0aGlzLnNldFN0YXRlKHRoaXMuc2V0U3RhdGVPYmplY3QobmV4dFByb3BzKSk7XHJcbiAgICB9LFxyXG4gICAgY29tcG9uZW50RGlkVXBkYXRlOiBmdW5jdGlvbihwcmV2UHJvcHMsIHByZXZTdGF0ZSkge1xyXG4gICAgICAgIC8vIOy7tO2PrOuEjO2KuOydmCDsl4XrjbDsnbTtirjqsIAgRE9N7JeQIOuwmOyYgeuQnCDsp4Htm4Tsl5Ag7Zi47LacKOy1nOy0iCDroIzrjZTrp4Eg7Iuc7JeQ64qUIO2YuOy2nOuQmOyngCDslYrsnYwpXHJcbiAgICAgICAgLy9jb25zb2xlLmxvZyhwcmV2UHJvcHMpO1xyXG4gICAgICAgIC8vY29uc29sZS5sb2cocHJldlN0YXRlKTtcclxuICAgICAgICAvL2NvbnNvbGUubG9nKHRoaXMuc3RhdGUpO1xyXG4gICAgICAgIHRoaXMuc2V0VmFsdWUoKTtcclxuICAgIH0sXHJcbiAgICByZW5kZXI6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIC8vIO2VhOyImCDtla3rqqlcclxuICAgICAgICBjb25zdCB7Y2xhc3NOYW1lLCBuYW1lLCBjaGlsZHJlbn0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIHJldHVybiAoXHJcblxyXG4gICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPSdjaGVja2JveC1pbmxpbmUnPlxyXG4gICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJjaGVja2JveFwiIGNsYXNzTmFtZT17Y2xhc3NOYW1lfSBuYW1lPXtuYW1lfSBjaGVja2VkPXt0aGlzLnN0YXRlLmNoZWNrZWR9XHJcbiAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9e3RoaXMub25DaGFuZ2V9IC8+XHJcbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwibGJsXCI+e2NoaWxkcmVufTwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICB7Lyo8aW5wdXQgdHlwZT1cImhpZGRlblwiIG5hbWU9e3RoaXMucHJvcHMubmFtZX0gdmFsdWU9e3RoaXMuc3RhdGUudmFsdWV9PiovfVxyXG4gICAgICAgICAgICA8L2xhYmVsPlxyXG5cclxuICAgICAgICApO1xyXG4gICAgfVxyXG59KTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0ge1xyXG4gICAgQ2hlY2tib3g6IENoZWNrYm94LFxyXG4gICAgSENoZWNrYm94OiBIQ2hlY2tib3hcclxufTsiLCIvKipcbiAqIEZpZWxkc2V0IGNvbXBvbmVudFxuICpcbiAqIHZlcnNpb24gPHR0PiQgVmVyc2lvbjogMS4wICQ8L3R0PiBkYXRlOjIwMTYvMDMvMzBcbiAqIGF1dGhvciA8YSBocmVmPVwibWFpbHRvOmhyYWhuQG5raWEuY28ua3JcIj5BaG4gSHl1bmctUm88L2E+XG4gKlxuICogZXhhbXBsZTpcbiAqIDxQdW0uRmllbGRzZXQgLz5cbiAqXG4gKi9cbid1c2Ugc3RyaWN0JztcblxudmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcbnZhciBQcm9wVHlwZXMgPSByZXF1aXJlKCdyZWFjdCcpLlByb3BUeXBlcztcbnZhciBjbGFzc05hbWVzID0gcmVxdWlyZSgnY2xhc3NuYW1lcycpO1xuXG52YXIgVXRpbCA9IHJlcXVpcmUoJy4uL3NlcnZpY2VzL1V0aWwnKTtcblxudmFyIEZpZWxkc2V0ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICAgIGRpc3BsYXlOYW1lOiAnRmllbGRzZXQnLFxuICAgIHByb3BUeXBlczoge1xuICAgICAgICBpZDogUHJvcFR5cGVzLnN0cmluZyxcbiAgICAgICAgY2xhc3NOYW1lOiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgICAgICBsZWdlbmQ6IFByb3BUeXBlcy5zdHJpbmcsXG4gICAgICAgIGV4cGFuZDogUHJvcFR5cGVzLmJvb2wsXG4gICAgICAgIGNvbGxhcHNpYmxlOiBQcm9wVHlwZXMuYm9vbCxcbiAgICAgICAgb25Ub2dnbGU6IFByb3BUeXBlcy5mdW5jLFxuICAgICAgICBvbkluaXQ6IFByb3BUeXBlcy5mdW5jXG4gICAgfSxcbiAgICBpZDogJycsXG4gICAgdG9nZ2xlOiBmdW5jdGlvbihwcm9wcykge1xuICAgICAgICBpZih0aGlzLnByb3BzLmNvbGxhcHNpYmxlID09PSB0cnVlKSB7XG4gICAgICAgICAgICBpZih0eXBlb2YgcHJvcHMuZXhwYW5kICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe2V4cGFuZDogcHJvcHMuZXhwYW5kfSk7XG4gICAgICAgICAgICB9ZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7ZXhwYW5kOiB0cnVlfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuICAgIG9uVG9nZ2xlOiBmdW5jdGlvbihldmVudCkge1xuICAgICAgICB2YXIgZXhwYW5kID0gIXRoaXMuc3RhdGUuZXhwYW5kO1xuICAgICAgICB0aGlzLnRvZ2dsZSh7ZXhwYW5kOiBleHBhbmR9KTtcblxuICAgICAgICBpZih0eXBlb2YgdGhpcy5wcm9wcy5vblRvZ2dsZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgdGhpcy5wcm9wcy5vblRvZ2dsZShleHBhbmQpO1xuICAgICAgICB9XG4gICAgfSxcblx0Z2V0RGVmYXVsdFByb3BzOiBmdW5jdGlvbigpIHtcblx0XHQvLyDtgbTrnpjsiqTqsIAg7IOd7ISx65CgIOuVjCDtlZzrsogg7Zi47Lac65CY6rOgIOy6kOyLnOuQnOuLpC5cblx0XHQvLyDrtoDrqqgg7Lu07Y+s64SM7Yq47JeQ7IScIHByb3DsnbQg64SY7Ja07Jik7KeAIOyViuydgCDqsr3smrAgKGluIOyXsOyCsOyekOuhnCDtmZXsnbgpIOunpO2VkeydmCDqsJLsnbQgdGhpcy5wcm9wc+yXkCDshKTsoJXrkJzri6QuXG5cdFx0cmV0dXJuIHtsZWdlbmQ6ICdUaXRsZScsIGNvbGxhcHNpYmxlOiB0cnVlLCBleHBhbmQ6IHRydWV9O1xuXHR9LFxuICAgIGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24oKSB7XG5cdFx0Ly8g7Lu07Y+s64SM7Yq46rCAIOuniOyatO2KuOuQmOq4sCDsoIQgKO2VnOuyiCDtmLjstpwpIC8g66as7YS06rCS7J2AIHRoaXMuc3RhdGXsnZgg7LSI6riw6rCS7Jy866GcIOyCrOyaqVxuICAgICAgICByZXR1cm4ge2V4cGFuZDogdGhpcy5wcm9wcy5leHBhbmR9O1xuICAgIH0sXG4gICAgY29tcG9uZW50V2lsbE1vdW50OiBmdW5jdGlvbigpIHtcbiAgICAgICAgLy8g7LWc7LSIIOugjOuNlOungeydtCDsnbzslrTrgpjquLAg7KeB7KCEKO2VnOuyiCDtmLjstpwpXG4gICAgICAgIGxldCBpZCA9IHRoaXMucHJvcHMuaWQ7XG4gICAgICAgIGlmKHR5cGVvZiBpZCA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIGlkID0gVXRpbC5nZXRVVUlEKCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmlkID0gaWQ7XG4gICAgfSxcbiAgICBjb21wb25lbnREaWRNb3VudDogZnVuY3Rpb24oKSB7XG4gICAgICAgIC8vIOy1nOy0iCDroIzrjZTrp4HsnbQg7J287Ja064KcIOuLpOydjCjtlZzrsogg7Zi47LacKVxuICAgICAgICBpZih0eXBlb2YgdGhpcy5wcm9wcy5vbkluaXQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIHZhciBkYXRhID0ge307XG4gICAgICAgICAgICBkYXRhLmV4cGFuZCA9IHRoaXMuc3RhdGUuZXhwYW5kO1xuICAgICAgICAgICAgdGhpcy5wcm9wcy5vbkluaXQoZGF0YSk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHM6IGZ1bmN0aW9uKG5leHRQcm9wcykge1xuICAgICAgICAvLyDsu7Ttj6zrhIztirjqsIAg7IOI66Gc7Jq0IHByb3Bz66W8IOuwm+ydhCDrlYwg7Zi47LacKOy1nOy0iCDroIzrjZTrp4Eg7Iuc7JeQ64qUIO2YuOy2nOuQmOyngCDslYrsnYwpXG4gICAgICAgIHRoaXMudG9nZ2xlKG5leHRQcm9wcyk7XG4gICAgfSxcbiAgICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgICAvLyDtlYTsiJgg7ZWt66qpXG4gICAgICAgIGNvbnN0IHtjbGFzc05hbWUsIGxlZ2VuZCwgY29sbGFwc2libGV9ID0gdGhpcy5wcm9wcztcblxuICAgICAgICB2YXIgZGlzcGxheSwgY29sbGFwc2VkID0gZmFsc2U7XG4gICAgICAgIGlmKHRoaXMuc3RhdGUuZXhwYW5kID09PSB0cnVlKSB7XG4gICAgICAgICAgICBkaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICAgICAgfWVsc2Uge1xuICAgICAgICAgICAgZGlzcGxheSA9ICdub25lJztcbiAgICAgICAgICAgIGlmKGNvbGxhcHNpYmxlID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgY29sbGFwc2VkID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8ZmllbGRzZXQgY2xhc3NOYW1lPXtjbGFzc05hbWVzKCdmaWVsZHNldCcsIGNsYXNzTmFtZSwge2NvbGxhcHNpYmxlOiBjb2xsYXBzaWJsZSwgY29sbGFwc2VkOiBjb2xsYXBzZWR9KX0+XG4gICAgICAgICAgICAgICAgPGxlZ2VuZCBvbkNsaWNrPXt0aGlzLm9uVG9nZ2xlfSBuYW1lPXt0aGlzLmlkfT4ge2xlZ2VuZH08L2xlZ2VuZD5cbiAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7ZGlzcGxheTogZGlzcGxheX19PlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGlkPXt0aGlzLmlkfSA+e3RoaXMucHJvcHMuY2hpbGRyZW59PC9kaXY+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2ZpZWxkc2V0PlxuXG4gICAgICAgICk7XG4gICAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gRmllbGRzZXQ7IiwiLyoqXHJcbiAqIEZpbmVVcGxvYWRlciBjb21wb25lbnRcclxuICpcclxuICogdmVyc2lvbiA8dHQ+JCBWZXJzaW9uOiAxLjAgJDwvdHQ+IGRhdGU6MjAxNi8wOS8yN1xyXG4gKiBhdXRob3IgPGEgaHJlZj1cIm1haWx0bzpqeXRAbmtpYS5jby5rclwiPkp1bmcgWW91bmctVGFpPC9hPlxyXG4gKlxyXG4gKiBleGFtcGxlOlxyXG4gKiA8UHVmLkZpbmVVcGxvYWRlciBvcHRpb25zPXtvcHRpb25zfSAvPlxyXG4gKlxyXG4gKiBGaW5lVXBsb2FkZXIg65287J2067iM65+s66as7JeQIOyiheyGjeyggeydtOuLpC5cclxuICovXHJcbid1c2Ugc3RyaWN0JztcclxuXHJcbnZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XHJcbnZhciBQcm9wVHlwZXMgPSByZXF1aXJlKCdyZWFjdCcpLlByb3BUeXBlcztcclxudmFyIGNsYXNzTmFtZXMgPSByZXF1aXJlKCdjbGFzc25hbWVzJyk7XHJcblxyXG52YXIgVXRpbCA9IHJlcXVpcmUoJy4uL3NlcnZpY2VzL1V0aWwnKTtcclxuXHJcbnZhciBGaW5lVXBsb2FkZXIgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XHJcbiAgICBkaXNwbGF5TmFtZTogJ0ZpbmVVcGxvYWRlcicsXHJcbiAgICBwcm9wVHlwZXM6IHtcclxuICAgICAgICBpZDogUHJvcFR5cGVzLnN0cmluZyxcclxuICAgICAgICBob3N0OiBQcm9wVHlwZXMuc3RyaW5nLCAvLyDshJzrsoQg7KCV67O0KENyb3NzIEJyb3dzZXIgQWNjZXNzKVxyXG4gICAgICAgIHNlc3Npb25Vcmw6IFByb3BUeXBlcy5zdHJpbmcsICAgLy8g7JeF66Gc65Oc65CcIOy0iOq4sCDtjIzsnbwgR2V0IFVybFxyXG4gICAgICAgIHVwbG9hZFVybDogUHJvcFR5cGVzLnN0cmluZywgICAgLy8g7YyM7J28IOyXheuhnOuTnCBVUkxcclxuICAgICAgICBkZWxldGVVcmw6IFByb3BUeXBlcy5zdHJpbmcsICAgIC8vIO2MjOydvCDsgq3soJwgVVJMXHJcbiAgICAgICAgcGFyYW1zOiBQcm9wVHlwZXMub2JqZWN0LCAgICAgICAvLyDtjIzsnbwg7JeF66Gc65OcIO2MjOudvOuvuO2EsFxyXG4gICAgICAgIHNlc3Npb25QYXJhbXM6IFByb3BUeXBlcy5vYmplY3QsICAgIC8vIOyXheuhnOuTnOuQnCDstIjquLAg7YyM7J28IFNlc3Npb24gUGFyYW1ldGVyXHJcbiAgICAgICAgYXV0b1VwbG9hZDogUHJvcFR5cGVzLmJvb2wsICAgICAvLyBBdXRvIFVwbG9hZFxyXG4gICAgICAgIG11bHRpcGxlOiBQcm9wVHlwZXMuYm9vbCwgICAgICAgLy8g7LKo67aA7YyM7J28IOyXrOufrOqwnCDrk7HroZ0o7ISg7YOdKSDqsIDriqUg7Jes67aAXHJcbiAgICAgICAgdXBsb2FkZWRGaWxlTGlzdDogUHJvcFR5cGVzLmFycmF5LCAgLy8g7JeF66Gc65OcIO2MjOydvCDrqqnroZ1cclxuICAgICAgICBhbGxvd2VkRXh0ZW5zaW9uczogUHJvcFR5cGVzLmFycmF5LCAvLyDssqjrtoDtjIzsnbwg7ZeI7Jqp7ZmV7J6l7J6QXHJcbiAgICAgICAgaXRlbUxpbWl0OiBQcm9wVHlwZXMubnVtYmVyLCAgICAvLyDssqjrtoDtjIzsnbwg7IiYIOygnO2VnFxyXG4gICAgICAgIHNpemVMaW1pdDogUHJvcFR5cGVzLm51bWJlciwgICAgLy8g7LKo67aA7YyM7J28IOyCrOydtOymiCDsoJztlZxcclxuICAgICAgICBlbXB0eUVycm9yOiBQcm9wVHlwZXMuc3RyaW5nLFxyXG4gICAgICAgIG5vRmlsZXNFcnJvcjogUHJvcFR5cGVzLnN0cmluZyxcclxuICAgICAgICBzaXplRXJyb3I6IFByb3BUeXBlcy5zdHJpbmcsXHJcbiAgICAgICAgdG9vTWFueUl0ZW1zRXJyb3I6IFByb3BUeXBlcy5zdHJpbmcsXHJcbiAgICAgICAgdHlwZUVycm9yOiBQcm9wVHlwZXMuc3RyaW5nLFxyXG4gICAgICAgIG9uRGVsZXRlOiBQcm9wVHlwZXMuZnVuYyxcclxuICAgICAgICBvbkRlbGV0ZUNvbXBsZXRlOiBQcm9wVHlwZXMuZnVuYyxcclxuICAgICAgICBvbkNvbXBsZXRlOiBQcm9wVHlwZXMuZnVuYyxcclxuICAgICAgICBvbkVycm9yOiBQcm9wVHlwZXMuZnVuYyxcclxuICAgICAgICBvblNlc3Npb25SZXF1ZXN0Q29tcGxldGU6IFByb3BUeXBlcy5mdW5jXHJcbiAgICB9LFxyXG4gICAgaWQ6ICcnLFxyXG4gICAgJGZpbmVVcGxvYWRlcjogdW5kZWZpbmVkLFxyXG5cdGdldERlZmF1bHRQcm9wczogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIHthdXRvVXBsb2FkOiB0cnVlLCBtdWx0aXBsZTogdHJ1ZSwgcGFyYW1zOiB7fSwgdXBsb2FkZWRGaWxlTGlzdDogW10sIGFsbG93ZWRFeHRlbnNpb25zOiBbXSwgaXRlbUxpbWl0OiAwLCBzaXplTGltaXQ6IDAsIGVtcHR5RXJyb3I6IFwiMGti7J2YIOyemOuqu+uQnCDtjIzsnbzsnoXri4jri6QuXCIsIG5vRmlsZXNFcnJvcjogXCLssqjrtoDrkJwg7YyM7J287J20IOyXhuyKteuLiOuLpC5cIiwgc2l6ZUVycm9yOiBcIntmaWxlfSBpcyB0b28gbGFyZ2UsIG1heGltdW0gZmlsZSBzaXplIGlzIHtzaXplTGltaXR9ISEuXCIsIHRvb01hbnlJdGVtc0Vycm9yOiBcIlRvbyBtYW55IGl0ZW1zICh7bmV0SXRlbXN9KSB3b3VsZCBiZSB1cGxvYWRlZC4gSXRlbSBsaW1pdCBpcyB7aXRlbUxpbWl0fSEhLlwiLCB0eXBlRXJyb3I6IFwie2ZpbGV9IGhhcyBhbiBpbnZhbGlkIGV4dGVuc2lvbi4gVmFsaWQgZXh0ZW5zaW9uKHMpOiB7ZXh0ZW5zaW9uc30uISFcIn07XHJcblx0fSxcclxuICAgIGNvbXBvbmVudFdpbGxNb3VudDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgLy8g7LWc7LSIIOugjOuNlOungeydtCDsnbzslrTrgpjquLAg7KeB7KCEKO2VnOuyiCDtmLjstpwpXHJcbiAgICAgICAgbGV0IGlkID0gdGhpcy5wcm9wcy5pZDtcclxuICAgICAgICBpZih0eXBlb2YgaWQgPT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgICAgIGlkID0gVXRpbC5nZXRVVUlEKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuaWQgPSBpZDtcclxuICAgIH0sXHJcbiAgICBnZXRPcHRpb25zOiBmdW5jdGlvbihwcm9wcykge1xyXG4gICAgICAgIGxldCBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgY29uc3Qge2hvc3QsIHNlc3Npb25VcmwsIHVwbG9hZFVybCwgZGVsZXRlVXJsLCBhdXRvVXBsb2FkLCBtdWx0aXBsZSwgcGFyYW1zLCBzZXNzaW9uUGFyYW1zLCB1cGxvYWRlZEZpbGVMaXN0LCBhbGxvd2VkRXh0ZW5zaW9ucywgaXRlbUxpbWl0LCBzaXplTGltaXQsIGVtcHR5RXJyb3IsIG5vRmlsZXNFcnJvciwgc2l6ZUVycm9yLCB0b29NYW55SXRlbXNFcnJvciwgdHlwZUVycm9yLCBvbkRlbGV0ZSwgb25EZWxldGVDb21wbGV0ZSwgb25Db21wbGV0ZSwgb25FcnJvciwgb25TZXNzaW9uUmVxdWVzdENvbXBsZXRlfSA9IHByb3BzO1xyXG4gICAgICAgIHZhciBvcHRpb25zID0ge1xyXG4gICAgICAgICAgICBhdXRvVXBsb2FkOiBhdXRvVXBsb2FkLFxyXG4gICAgICAgICAgICBtdWx0aXBsZTogbXVsdGlwbGUsXHJcbiAgICAgICAgICAgIHJlcXVlc3Q6IHtcclxuICAgICAgICAgICAgICAgIGVuZHBvaW50OiAoaG9zdCAmJiBob3N0ICE9PSBudWxsICYmIGhvc3QubGVuZ3RoID4gMCkgPyBob3N0ICsgdXBsb2FkVXJsIDogdXBsb2FkVXJsLFxyXG4gICAgICAgICAgICAgICAgcGFyYW1zOiBwYXJhbXNcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgdmFsaWRhdGlvbjoge1xyXG4gICAgICAgICAgICAgICAgYWxsb3dlZEV4dGVuc2lvbnM6IGFsbG93ZWRFeHRlbnNpb25zLFxyXG4gICAgICAgICAgICAgICAgaXRlbUxpbWl0OiBpdGVtTGltaXQsXHJcbiAgICAgICAgICAgICAgICBzaXplTGltaXQ6IHNpemVMaW1pdCxcclxuICAgICAgICAgICAgICAgIHRvb01hbnlJdGVtc0Vycm9yOiB0b29NYW55SXRlbXNFcnJvcixcclxuICAgICAgICAgICAgICAgIHR5cGVFcnJvcjogdHlwZUVycm9yXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIG1lc3NhZ2VzOiB7XHJcbiAgICAgICAgICAgICAgICBlbXB0eUVycm9yOiBlbXB0eUVycm9yLFxyXG4gICAgICAgICAgICAgICAgbm9GaWxlc0Vycm9yOiBub0ZpbGVzRXJyb3IsXHJcbiAgICAgICAgICAgICAgICBzaXplRXJyb3I6IHNpemVFcnJvclxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBzZXNzaW9uOntcclxuICAgICAgICAgICAgICAgIGVuZHBvaW50OiAoaG9zdCAmJiBob3N0ICE9PSBudWxsICYmIGhvc3QubGVuZ3RoID4gMCkgPyBob3N0ICsgc2Vzc2lvblVybCA6IHNlc3Npb25VcmwsXHJcbiAgICAgICAgICAgICAgICBwYXJhbXM6IHtcInRlc3RcIjogMX0sXHJcbiAgICAgICAgICAgICAgICByZWZyZXNoT25SZXF1ZXN0OnRydWVcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZGVsZXRlRmlsZTp7XHJcbiAgICAgICAgICAgICAgICBlbmFibGVkOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXHJcbiAgICAgICAgICAgICAgICBlbmRwb2ludDogKGhvc3QgJiYgaG9zdCAhPT0gbnVsbCAmJiBob3N0Lmxlbmd0aCA+IDApID8gaG9zdCArIGRlbGV0ZVVybCA6IGRlbGV0ZVVybFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBjYWxsYmFja3M6IHtcclxuICAgICAgICAgICAgICAgIG9uRGVsZXRlOiBmdW5jdGlvbihpZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKHR5cGVvZiBvbkRlbGV0ZSA9PT0gJ2Z1bmN0aW9uJyl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9uRGVsZXRlKGlkKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgLy8g7IKt7KCcIOuyhO2KvCDtgbTrpq3si5wgRXZlbnRcclxuICAgICAgICAgICAgICAgIG9uU3VibWl0RGVsZXRlOiBmdW5jdGlvbihpZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIF90aGlzLmZpbmVVcGxvYWRlci5zZXREZWxldGVGaWxlUGFyYW1zKHtmaWxlbmFtZTogX3RoaXMuZmluZVVwbG9hZGVyLmdldE5hbWUoaWQpfSwgaWQpO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIC8vIOyCreygnCDsmYTro4zsi5wgRXZlbnRcclxuICAgICAgICAgICAgICAgIG9uRGVsZXRlQ29tcGxldGU6IGZ1bmN0aW9uKGlkLCB4aHIsIGlzRXJyb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZih4aHIucmVzcG9uc2VUZXh0KXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHJlc3BvbnNlID0gSlNPTi5wYXJzZSh4aHIucmVzcG9uc2VUZXh0KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYoXCJmaWxlX25hbWVcIiBpbiByZXNwb25zZSl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cGxvYWRlZEZpbGVMaXN0LnNvbWUoKGZpbGVOYW1lLCBpZHgpID0+e1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKGZpbGVOYW1lID09IHJlc3BvbnNlLmZpbGVfbmFtZSl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB1cGxvYWRlZEZpbGVMaXN0LnNwbGljZShpZHgsIDEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmKHR5cGVvZiBvbkRlbGV0ZUNvbXBsZXRlID09PSAnZnVuY3Rpb24nKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgb25EZWxldGVDb21wbGV0ZShpZCwgeGhyLCBpc0Vycm9yKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgLy8g7JeF66Gc65OcIOyZhOujjOyLnCBFdmVudFxyXG4gICAgICAgICAgICAgICAgb25Db21wbGV0ZTogZnVuY3Rpb24oaWQsIG5hbWUsIHJlc3BvbnNlLCB4aHIpe1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKFwiZmlsZV9uYW1lXCIgaW4gcmVzcG9uc2Upe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBfdGhpcy5maW5lVXBsb2FkZXIuc2V0VXVpZChpZCwgcmVzcG9uc2UuZmlsZV9uYW1lKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdXBsb2FkZWRGaWxlTGlzdC5wdXNoKHJlc3BvbnNlLmZpbGVfbmFtZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmKHR5cGVvZiBvbkNvbXBsZXRlID09PSAnZnVuY3Rpb24nKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgb25Db21wbGV0ZShpZCwgbmFtZSwgcmVzcG9uc2UsIHhocik7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIC8vIEVycm9yIOuwnOyDnSDsnbTrsqTtirhcclxuICAgICAgICAgICAgICAgIG9uRXJyb3I6IGZ1bmN0aW9uKGlkLCBuYW1lLCBlcnJvclJlYXNvbiwgeGhyKXtcclxuICAgICAgICAgICAgICAgICAgICBpZih0eXBlb2Ygb25FcnJvciA9PT0gJ2Z1bmN0aW9uJyl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9uRXJyb3IoaWQsIG5hbWUsIGVycm9yUmVhc29uLCB4aHIpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAvLyDstIjquLAgRmlsZSDrqqnroZ0g7JqU7LKtIOyZhOujjOyLnFxyXG4gICAgICAgICAgICAgICAgb25TZXNzaW9uUmVxdWVzdENvbXBsZXRlOiBmdW5jdGlvbihyZXNwb25zZSwgc3VjY2VzcywgeGhyKXtcclxuICAgICAgICAgICAgICAgICAgICBpZih0eXBlb2Ygb25TZXNzaW9uUmVxdWVzdENvbXBsZXRlID09PSAnZnVuY3Rpb24nKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgb25TZXNzaW9uUmVxdWVzdENvbXBsZXRlKHJlc3BvbnNlLCBzdWNjZXNzLCB4aHIsIHRoaXMpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGlmKGhvc3QgJiYgaG9zdCAhPT0gbnVsbCAmJiBob3N0Lmxlbmd0aCA+IDApe1xyXG4gICAgICAgICAgICAkLmV4dGVuZChvcHRpb25zLCB7Y29yczoge1xyXG4gICAgICAgICAgICAgICAgLy9hbGwgcmVxdWVzdHMgYXJlIGV4cGVjdGVkIHRvIGJlIGNyb3NzLWRvbWFpbiByZXF1ZXN0c1xyXG4gICAgICAgICAgICAgICAgZXhwZWN0ZWQ6IHRydWVcclxuICAgICAgICAgICAgICAgIC8vaWYgeW91IHdhbnQgY29va2llcyB0byBiZSBzZW50IGFsb25nIHdpdGggdGhlIHJlcXVlc3RcclxuICAgICAgICAgICAgICAgIC8vc2VuZENyZWRlbnRpYWxzOiB0cnVlXHJcbiAgICAgICAgICAgIH19KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBvcHRpb25zO1xyXG4gICAgfSxcclxuICAgIGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbigpIHtcclxuICAgICAgICAvLyDstZzstIgg66CM642U66eB7J20IOydvOyWtOuCnCDri6TsnYwo7ZWc67KIIO2YuOy2nClcclxuICAgICAgICB0aGlzLiRmaW5lVXBsb2FkZXIgPSAkKCcjJyt0aGlzLmlkKVswXTtcclxuICAgICAgICBsZXQgc2V0dGluZ3MgPSB7XHJcbiAgICAgICAgICAgIGVsZW1lbnQ6IHRoaXMuJGZpbmVVcGxvYWRlclxyXG4gICAgICAgIH07XHJcbiAgICAgICAgJC5leHRlbmQoc2V0dGluZ3MsIHRoaXMuZ2V0T3B0aW9ucyh0aGlzLnByb3BzKSk7XHJcbiAgICAgICAgdGhpcy5maW5lVXBsb2FkZXIgPSBuZXcgcXEuRmluZVVwbG9hZGVyKHNldHRpbmdzKTtcclxuICAgIH0sXHJcbiAgICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzOiBmdW5jdGlvbihuZXh0UHJvcHMpIHtcclxuXHJcbiAgICB9LFxyXG4gICAgLy8g7LKo67aA7YyM7J28IOyXheuhnOuTnCBGdW5jdGlvblxyXG4gICAgdXBsb2FkRmlsZXM6IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgdGhpcy5maW5lVXBsb2FkZXIudXBsb2FkU3RvcmVkRmlsZXMoKTtcclxuICAgIH0sXHJcbiAgICAvLyDssqjrtoDtjIzsnbwg7LSI6riw7ZmUIOuwjyDrjbDsnbTthLAg66Gc65OcXHJcbiAgICByZWZyZXNoU2Vzc2lvbjogZnVuY3Rpb24oc2Vzc2lvblBhcmFtcyl7XHJcbiAgICAgICAgdGhpcy5maW5lVXBsb2FkZXIuY2xlYXJTdG9yZWRGaWxlcygpO1xyXG4gICAgICAgIHRoaXMuZmluZVVwbG9hZGVyLl9zZXNzaW9uID0gbnVsbDtcclxuICAgICAgICB0aGlzLmZpbmVVcGxvYWRlci5fb3B0aW9ucy5zZXNzaW9uLnBhcmFtcyA9IHNlc3Npb25QYXJhbXM7XHJcbiAgICAgICAgdGhpcy5maW5lVXBsb2FkZXIucmVzZXQoKTtcclxuICAgIH0sXHJcbiAgICByZW5kZXI6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIC8vIO2VhOyImCDtla3rqqlcclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBpZD17dGhpcy5pZH0+PC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbn0pO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBGaW5lVXBsb2FkZXI7XHJcbiIsIi8qKlxyXG4gKiBIaWRkZW5Db250ZW50IGNvbXBvbmVudFxyXG4gKlxyXG4gKiB2ZXJzaW9uIDx0dD4kIFZlcnNpb246IDEuMCAkPC90dD4gZGF0ZToyMDE2LzAzLzEwXHJcbiAqIGF1dGhvciA8YSBocmVmPVwibWFpbHRvOmhyYWhuQG5raWEuY28ua3JcIj5BaG4gSHl1bmctUm88L2E+XHJcbiAqXHJcbiAqIGV4YW1wbGU6XHJcbiAqIDxQdW0uSGlkZGVuQ29udGVudCBpZD17aWR9IC8+XHJcbiAqXHJcbiAqL1xyXG4ndXNlIHN0cmljdCc7XHJcblxyXG5pbXBvcnQgUmVhY3QsIHtQcm9wVHlwZXN9IGZyb20gJ3JlYWN0JztcclxuLy92YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xyXG4vL3ZhciBQcm9wVHlwZXMgPSByZXF1aXJlKCdyZWFjdCcpLlByb3BUeXBlcztcclxudmFyIGNsYXNzTmFtZXMgPSByZXF1aXJlKCdjbGFzc25hbWVzJyk7XHJcblxyXG52YXIgVXRpbCA9IHJlcXVpcmUoJy4uL3NlcnZpY2VzL1V0aWwnKTtcclxuXHJcbnZhciBIaWRkZW5Db250ZW50ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xyXG4gICAgZGlzcGxheU5hbWU6ICdIaWRkZW5Db250ZW50JyxcclxuICAgIHByb3BUeXBlczoge1xyXG4gICAgICAgIGlkOiBQcm9wVHlwZXMuc3RyaW5nLFxyXG4gICAgICAgIGNsYXNzTmFtZTogUHJvcFR5cGVzLnN0cmluZyxcclxuICAgICAgICBleHBhbmRMYWJlbDogUHJvcFR5cGVzLnN0cmluZyxcclxuICAgICAgICBjb2xsYXBzZUxhYmVsOiBQcm9wVHlwZXMuc3RyaW5nLFxyXG4gICAgICAgIGV4cGFuZEljb246IFByb3BUeXBlcy5zdHJpbmcsXHJcbiAgICAgICAgY29sbGFwc2VJY29uOiBQcm9wVHlwZXMuc3RyaW5nLFxyXG4gICAgICAgIGlzQm90dG9tOiBQcm9wVHlwZXMuYm9vbFxyXG4gICAgfSxcclxuICAgIGlkOiAnJyxcclxuICAgIG9uRXhwYW5kQ29sbGFwc2U6IGZ1bmN0aW9uKGV2ZW50KSB7XHJcbiAgICAgICAgLy92YXIgbm9kZSA9IGV2ZW50LnRhcmdldCxcclxuICAgICAgICAvLyAgICBhVGFnID0gbm9kZS5wYXJlbnROb2RlO1xyXG4gICAgICAgIHZhciBhVGFnID0gZXZlbnQudGFyZ2V0O1xyXG4gICAgICAgIGlmKCQoYVRhZykubmV4dCgpLmNzcygnZGlzcGxheScpID09PSAnbm9uZScpIHtcclxuICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7bGFiZWw6IHRoaXMucHJvcHMuY29sbGFwc2VMYWJlbCwgaWNvbjogdGhpcy5wcm9wcy5jb2xsYXBzZUljb259KTtcclxuICAgICAgICAgICAgJChhVGFnKS5uZXh0KCkuY3NzKCdkaXNwbGF5JywgJ2Jsb2NrJyk7XHJcbiAgICAgICAgfWVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnNldFN0YXRlKHtsYWJlbDogdGhpcy5wcm9wcy5leHBhbmRMYWJlbCwgaWNvbjogdGhpcy5wcm9wcy5leHBhbmRJY29ufSk7XHJcbiAgICAgICAgICAgICQoYVRhZykubmV4dCgpLmNzcygnZGlzcGxheScsICdub25lJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH0sXHJcbiAgICBvbkJvdHRvbUNvbGxhcHNlOiBmdW5jdGlvbihldmVudCkge1xyXG4gICAgICAgIGxldCBub2RlID0gZXZlbnQudGFyZ2V0LFxyXG4gICAgICAgICAgICBkaXYgPSBub2RlLnBhcmVudE5vZGU7Ly8ucGFyZW50Tm9kZTtcclxuICAgICAgICAkKGRpdikuY3NzKCdkaXNwbGF5JywgJ25vbmUnKTtcclxuICAgICAgICB0aGlzLnNldFN0YXRlKHtsYWJlbDogdGhpcy5wcm9wcy5leHBhbmRMYWJlbCwgaWNvbjogdGhpcy5wcm9wcy5leHBhbmRJY29ufSk7XHJcbiAgICB9LFxyXG4gICAgZ2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgbGV0IGxhYmVsID0gdGhpcy5wcm9wcy5leHBhbmRMYWJlbDtcclxuICAgICAgICBpZih0eXBlb2YgbGFiZWwgPT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgICAgIGxhYmVsID0gJ0V4cGFuZCc7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgaWNvbiA9IHRoaXMucHJvcHMuZXhwYW5kSWNvbjtcclxuXHJcbiAgICAgICAgcmV0dXJuIHtsYWJlbDogbGFiZWwsIGljb246IGljb259O1xyXG4gICAgfSxcclxuICAgIGNvbXBvbmVudFdpbGxNb3VudDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgLy8g7LWc7LSIIOugjOuNlOungeydtCDsnbzslrTrgpjquLAg7KeB7KCEKO2VnOuyiCDtmLjstpwpXHJcbiAgICAgICAgbGV0IGlkID0gdGhpcy5wcm9wcy5pZDtcclxuICAgICAgICBpZih0eXBlb2YgaWQgPT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgICAgIGlkID0gVXRpbC5nZXRVVUlEKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmlkID0gaWQ7XHJcbiAgICB9LFxyXG4gICAgcmVuZGVyOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAvLyDtlYTsiJgg7ZWt66qpXHJcbiAgICAgICAgdmFyIEljb247XHJcbiAgICAgICAgaWYodHlwZW9mIHRoaXMuc3RhdGUuaWNvbiA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgICAgICAgSWNvbiA9IDxpIGNsYXNzTmFtZT17dGhpcy5zdGF0ZS5pY29ufT57J1xcdTAwQTAnfTwvaT47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyDrp6gg7JWE656YIOygkeq4sOuyhO2KvCDsspjrpqxcclxuICAgICAgICB2YXIgQm90dG9tQnV0dG9uO1xyXG4gICAgICAgIGlmKHRoaXMucHJvcHMuaXNCb3R0b20gPT09IHRydWUpIHtcclxuICAgICAgICAgICAgbGV0IENvbGxhcHNlSWNvbjtcclxuICAgICAgICAgICAgaWYodHlwZW9mIHRoaXMucHJvcHMuY29sbGFwc2VJY29uID09PSAnc3RyaW5nJykge1xyXG4gICAgICAgICAgICAgICAgQ29sbGFwc2VJY29uID0gPGkgY2xhc3NOYW1lPXt0aGlzLnByb3BzLmNvbGxhcHNlSWNvbn0+eydcXHUwMEEwJ308L2k+O1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyAjIOyZgCByZWFjdC1yb3V0ZXIg7Lap64+M66y47KCcIO2VtOqysO2VtOyVvCDtlahcclxuICAgICAgICAgICAgQm90dG9tQnV0dG9uID0gPGEgaHJlZj17JyMnICsgdGhpcy5pZH0gb25DbGljaz17dGhpcy5vbkJvdHRvbUNvbGxhcHNlfT57Q29sbGFwc2VJY29ufXt0aGlzLnByb3BzLmNvbGxhcHNlTGFiZWx9PC9hPlxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9e2NsYXNzTmFtZXMoJ2hpZGRlbi1jb250ZW50JywgdGhpcy5wcm9wcy5jbGFzc05hbWUpfT5cclxuICAgICAgICAgICAgICAgIDxhIGhyZWY9XCJqYXZhc2NyaXB0OnZvaWQoMClcIiBvbkNsaWNrPXt0aGlzLm9uRXhwYW5kQ29sbGFwc2V9IG5hbWU9e3RoaXMuaWR9PntJY29ufXt0aGlzLnN0YXRlLmxhYmVsfTwvYT5cclxuICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3tkaXNwbGF5OiAnbm9uZSd9fT5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGlkPXt0aGlzLmlkfT57dGhpcy5wcm9wcy5jaGlsZHJlbn08L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICB7Qm90dG9tQnV0dG9ufVxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbn0pO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBIaWRkZW5Db250ZW50OyIsIi8qKlxuICogU3BsaXR0ZXIgY29tcG9uZW50XG4gKlxuICogdmVyc2lvbiA8dHQ+JCBWZXJzaW9uOiAxLjAgJDwvdHQ+IGRhdGU6MjAxNi8wMy8wM1xuICogYXV0aG9yIDxhIGhyZWY9XCJtYWlsdG86aHJhaG5AbmtpYS5jby5rclwiPkFobiBIeXVuZy1SbzwvYT5cbiAqXG4gKiBleGFtcGxlOlxuICogPFB1Zi5TcGxpdHRlciAvPlxuICpcbiAqL1xuJ3VzZSBzdHJpY3QnO1xuXG52YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xudmFyIFByb3BUeXBlcyA9IHJlcXVpcmUoJ3JlYWN0JykuUHJvcFR5cGVzO1xudmFyIGNsYXNzTmFtZXMgPSByZXF1aXJlKCdjbGFzc25hbWVzJyk7XG5cbnZhciBVdGlsID0gcmVxdWlyZSgnLi4vc2VydmljZXMvVXRpbCcpO1xuXG52YXIgU3BsaXR0ZXIgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gICAgZGlzcGxheU5hbWU6ICdTcGxpdHRlcicsXG4gICAgcHJvcFR5cGVzOiB7XG4gICAgICAgIGlkOiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgICAgICBjbGFzc05hbWU6IFByb3BUeXBlcy5zdHJpbmcsXG4gICAgICAgIHR5cGU6IFByb3BUeXBlcy5vbmVPZihbJ2gnLCAndiddKS5pc1JlcXVpcmVkLFxuICAgICAgICBwb3NpdGlvbjogUHJvcFR5cGVzLm9uZU9mKFsnbGVmdCcsICdyaWdodCcsICd0b3AnLCAnYm90dG9tJ10pLmlzUmVxdWlyZWQsXG4gICAgICAgIC8vbGVmdFBhbmU6IFByb3BUeXBlcy5zdHJpbmcsXG4gICAgICAgIC8vcmlnaHRQYW5lOiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgICAgICBtaW5MZWZ0OiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gICAgICAgIG1pblJpZ2h0OiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gICAgICAgIG1heExlZnQ6IFByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgICAgICAgbWF4UmlnaHQ6IFByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgICAgICAgb25SZXNpemU6IFByb3BUeXBlcy5mdW5jXG4gICAgfSxcbiAgICBpZDogJycsXG4gICAgb3BlbjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMuc3BsaXR0ZXJPcGVuKCk7XG4gICAgfSxcbiAgICBjbG9zZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIGNvbnN0IHsgdHlwZSwgcG9zaXRpb24gfSA9IHRoaXMucHJvcHM7XG5cbiAgICAgICAgdGhpcy5zcGxpdHRlckNsb3NlKCk7XG4gICAgICAgIGlmKHR5cGUgPT09ICdoJykge1xuXG4gICAgICAgICAgICBpZihwb3NpdGlvbiA9PT0gJ2xlZnQnKSB7XG4gICAgICAgICAgICAgICAgdGhpcy4kc3BsaXR0ZXIubmV4dCgpLm9mZnNldCh7IGxlZnQ6IDAgfSk7XG4gICAgICAgICAgICB9ZWxzZSBpZihwb3NpdGlvbiA9PT0gJ3JpZ2h0Jykge1xuICAgICAgICAgICAgICAgIHRoaXMuJHNwbGl0dGVyLnByZXYoKS5jc3MoJ3JpZ2h0JywgMCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuICAgIHZpc2libGU6IGZ1bmN0aW9uKGIpIHtcbiAgICAgICAgaWYoYiA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgIHRoaXMuJHNwbGl0dGVyLmNzcygnZGlzcGxheScsICdub25lJyk7XG4gICAgICAgIH1lbHNlIHtcbiAgICAgICAgICAgIHRoaXMuJHNwbGl0dGVyLmNzcygnZGlzcGxheScsICcnKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgb25SZXNpemU6IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgaWYodGhpcy5wcm9wcy5vblJlc2l6ZSkge1xuICAgICAgICAgICAgdGhpcy5wcm9wcy5vblJlc2l6ZShlKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIHByaXZhdGVcbiAgICBzcGxpdHRlckFjdGl2ZUZsYWc6IGZhbHNlLFxuICAgIHNwbGl0dGVyT2JqOiBmYWxzZSxcbiAgICBzcGxpdHRlck1vdXNlRG93bjogZnVuY3Rpb24oZSkge1xuICAgICAgICBpZiAoIXRoaXMuc3BsaXR0ZXJBY3RpdmVGbGFnICYmIHRoaXMuc3RhdGUuZXhwYW5kID09PSB0cnVlKSB7XG4gICAgICAgICAgICAvLyBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLmlkKVxuICAgICAgICAgICAgaWYgKHRoaXMuJHNwbGl0dGVyWzBdLnNldENhcHR1cmUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLiRzcGxpdHRlclswXS5zZXRDYXB0dXJlKCk7XG4gICAgICAgICAgICB9ZWxzZSB7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIHRoaXMuc3BsaXR0ZXJNb3VzZVVwLCB0cnVlKTtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCB0aGlzLnNwbGl0dGVyTW91c2VNb3ZlLCB0cnVlKTtcbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnNwbGl0dGVyQWN0aXZlRmxhZyA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLnNwbGl0dGVyT2JqID0gdGhpcy4kc3BsaXR0ZXJbMF07XG5cbiAgICAgICAgICAgIC8vbGVmdHNpZGViYXJDb2xsYXBzZVdpZHRoID0gJCgnLmxlZnRzaWRlYmFyLWNvbGxhcHNlJykub3V0ZXJXaWR0aCh0cnVlKTtcbiAgICAgICAgICAgIHRoaXMuc3BsaXR0ZXJXaWR0aCA9IHRoaXMuJHNwbGl0dGVyLm91dGVyV2lkdGgodHJ1ZSk7XG5cbiAgICAgICAgICAgIC8qc3BsaXR0ZXJQYXJlbnRPYmogPSBiLnBhcmVudEVsZW1lbnQ7XG4gICAgICAgICAgICAgY29uc29sZS5sb2coc3BsaXR0ZXJPYmoub2Zmc2V0TGVmdCk7XG4gICAgICAgICAgICAgY29uc29sZS5sb2coc3BsaXR0ZXJPYmoucGFyZW50RWxlbWVudC5vZmZzZXRMZWZ0KTsqL1xuICAgICAgICB9XG4gICAgfSxcbiAgICBzcGxpdHRlck1vdXNlVXA6IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgaWYgKHRoaXMuc3BsaXR0ZXJBY3RpdmVGbGFnKSB7XG4gICAgLy8gICAgICAgIHZhciBhID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0b2NcIik7XG4gICAgLy8gICAgICAgIHZhciBjID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjb250ZW50XCIpO1xuICAgIC8vICAgICAgICBjaGFuZ2VRU2VhcmNoYm94V2lkdGgoKTtcbiAgICAvLyAgICAgICAgYS5zdHlsZS53aWR0aCA9IChzcGxpdHRlck9iai5vZmZzZXRMZWZ0IC0gMjApICsgXCJweFwiO1xuICAgIC8vICAgICAgICBjLnN0eWxlLmxlZnQgPSAoc3BsaXR0ZXJPYmoub2Zmc2V0TGVmdCArIDEwKSArIFwicHhcIjtcblxuICAgICAgICAgICAgY29uc3QgeyB0eXBlLCBwb3NpdGlvbiB9ID0gdGhpcy5wcm9wcztcblxuICAgICAgICAgICAgaWYodHlwZSA9PT0gJ2gnKSB7XG4gICAgICAgICAgICAgICAgaWYocG9zaXRpb24gPT09ICdsZWZ0Jykge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLiRzcGxpdHRlci5wcmV2KCkub3V0ZXJXaWR0aCh0aGlzLnNwbGl0dGVyT2JqLm9mZnNldExlZnQpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLiRzcGxpdHRlci5uZXh0KCkub2Zmc2V0KHsgbGVmdDogKHRoaXMuc3BsaXR0ZXJPYmoub2Zmc2V0TGVmdCArIHRoaXMuc3BsaXR0ZXJXaWR0aCkgfSk7XG4gICAgICAgICAgICAgICAgfWVsc2UgaWYocG9zaXRpb24gPT09ICdyaWdodCcpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5oUmlnaHRTcGxpdHRlck9mZnNldFJpZ2h0ID0gdGhpcy4kc3BsaXR0ZXIucGFyZW50KCkub3V0ZXJXaWR0aCh0cnVlKSAtIHRoaXMuc3BsaXR0ZXJPYmoub2Zmc2V0TGVmdDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy4kc3BsaXR0ZXIucHJldigpLmNzcygncmlnaHQnLCB0aGlzLmhSaWdodFNwbGl0dGVyT2Zmc2V0UmlnaHQpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLiRzcGxpdHRlci5uZXh0KCkub3V0ZXJXaWR0aCh0aGlzLmhSaWdodFNwbGl0dGVyT2Zmc2V0UmlnaHQgLSB0aGlzLnNwbGl0dGVyV2lkdGgpO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vdGhpcy4kc3BsaXR0ZXIucHJldigpLm9mZnNldCh7IHJpZ2h0OiB0aGlzLnNwbGl0dGVyT2JqLm9mZnNldFJpZ2h0IH0pO1xuICAgICAgICAgICAgICAgICAgICAvL3RoaXMuJHNwbGl0dGVyLm5leHQoKS5vdXRlcldpZHRoKHRoaXMuc3BsaXR0ZXJPYmoub2Zmc2V0UmlnaHQgLSB0aGlzLnNwbGl0dGVyV2lkdGgpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZih0aGlzLnNwbGl0dGVyT2JqLnJlbGVhc2VDYXB0dXJlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zcGxpdHRlck9iai5yZWxlYXNlQ2FwdHVyZSgpO1xuICAgICAgICAgICAgfWVsc2Uge1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCB0aGlzLnNwbGl0dGVyTW91c2VVcCwgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgdGhpcy5zcGxpdHRlck1vdXNlTW92ZSwgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5zcGxpdHRlckFjdGl2ZUZsYWcgPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMuc2F2ZVNwbGl0dGVyUG9zKCk7XG4gICAgICAgICAgICAvL3RoaXMub25SZXNpemUoKTtcbiAgICAgICAgICAgIHRoaXMuJHNwbGl0dGVyLnRyaWdnZXIoJ3Jlc2l6ZScpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBzcGxpdHRlck1vdXNlTW92ZTogZnVuY3Rpb24oZSkge1xuICAgICAgICBjb25zdCB7IHR5cGUsIHBvc2l0aW9uLCBtaW5MZWZ0LCBtaW5SaWdodCwgbWF4TGVmdCwgbWF4UmlnaHQgfSA9IHRoaXMucHJvcHM7XG5cbiAgICAgICAgaWYgKHRoaXMuc3BsaXR0ZXJBY3RpdmVGbGFnKSB7XG4gICAgICAgICAgICBpZih0eXBlID09PSAnaCcpIHtcbiAgICAgICAgICAgICAgICBpZihwb3NpdGlvbiA9PT0gJ2xlZnQnKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChlLmNsaWVudFggPj0gbWluTGVmdCAmJiBlLmNsaWVudFggPD0gbWF4TGVmdCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zcGxpdHRlck9iai5zdHlsZS5sZWZ0ID0gZS5jbGllbnRYICsgJ3B4JztcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKCF0aGlzLnNwbGl0dGVyT2JqLnJlbGVhc2VDYXB0dXJlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfWVsc2UgaWYocG9zaXRpb24gPT09ICdyaWdodCcpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGUuY2xpZW50WCA8PSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50V2lkdGggLSBtaW5SaWdodCAmJiBlLmNsaWVudFggPj0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudFdpZHRoIC0gbWF4UmlnaHQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc3BsaXR0ZXJPYmouc3R5bGUubGVmdCA9IGUuY2xpZW50WCArICdweCc7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZighdGhpcy5zcGxpdHRlck9iai5yZWxlYXNlQ2FwdHVyZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8qXG4gICAgICAgICAgICBpZiAoZS5jbGllbnRYID49IHRoaXMucHJvcHMubWluTGVmdCAmJiBlLmNsaWVudFggPD0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudFdpZHRoIC0gdGhpcy5wcm9wcy5taW5SaWdodCkge1xuICAgICAgICAgICAgICAgIHRoaXMuc3BsaXR0ZXJPYmouc3R5bGUubGVmdCA9IGUuY2xpZW50WCArICdweCc7XG4gICAgICAgICAgICAgICAgaWYoIXRoaXMuc3BsaXR0ZXJPYmoucmVsZWFzZUNhcHR1cmUpIHtcbiAgICAgICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgICovXG4gICAgICAgIH1cbiAgICB9LFxuICAgIHNwbGl0dGVyT3BlbjogZnVuY3Rpb24gKCkge1xuICAgICAgICBjb25zdCB7IHR5cGUsIHBvc2l0aW9uIH0gPSB0aGlzLnByb3BzO1xuXG4gICAgICAgIGlmKHR5cGUgPT09ICdoJykge1xuICAgICAgICAgICAgaWYocG9zaXRpb24gPT09ICdsZWZ0Jykge1xuICAgICAgICAgICAgICAgIHRoaXMuJHNwbGl0dGVyLnByZXYoKS5vZmZzZXQoeyBsZWZ0OiAwIH0pO1xuICAgICAgICAgICAgICAgIHRoaXMuJHNwbGl0dGVyLm9mZnNldCh7IGxlZnQ6IHRoaXMubGVmdEZyYW1lV2lkdGggfSk7XG4gICAgICAgICAgICAgICAgdGhpcy4kc3BsaXR0ZXIubmV4dCgpLm9mZnNldCh7IGxlZnQ6ICh0aGlzLmxlZnRGcmFtZVdpZHRoICsgdGhpcy5zcGxpdHRlcldpZHRoKSB9KTtcbiAgICAgICAgICAgIH1lbHNlIGlmKHBvc2l0aW9uID09PSAncmlnaHQnKSB7XG4gICAgICAgICAgICAgICAgdGhpcy4kc3BsaXR0ZXIucHJldigpLmNzcygncmlnaHQnLCAodGhpcy5yaWdodEZyYW1lV2lkdGggKyB0aGlzLnNwbGl0dGVyV2lkdGgpKTtcbiAgICAgICAgICAgICAgICB0aGlzLiRzcGxpdHRlci5vZmZzZXQoeyBsZWZ0OiAodGhpcy4kc3BsaXR0ZXIucGFyZW50KCkub3V0ZXJXaWR0aCh0cnVlKSAtIHRoaXMucmlnaHRGcmFtZVdpZHRoIC0gdGhpcy5zcGxpdHRlcldpZHRoKSB9KTtcbiAgICAgICAgICAgICAgICB0aGlzLiRzcGxpdHRlci5uZXh0KCkub3V0ZXJXaWR0aCh0aGlzLnJpZ2h0RnJhbWVXaWR0aCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLiRzcGxpdHRlci5jc3MoJ2N1cnNvcicsICdlLXJlc2l6ZScpO1xuICAgICAgICBcbiAgICAgICAgLypcbiAgICAgICAgIHRoaXMuJHNwbGl0dGVyLnByZXYoKS5vbignd2Via2l0VHJhbnNpdGlvbkVuZCBvdHJhbnNpdGlvbmVuZCBvVHJhbnNpdGlvbkVuZCBtc1RyYW5zaXRpb25FbmQgdHJhbnNpdGlvbmVuZCcsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgIHRoaXMuJHNwbGl0dGVyLmNzcygnZGlzcGxheScsICdibG9jaycpO1xuICAgICAgICB9KTtcbiAgICAgICAgKi9cbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7ZXhwYW5kOiB0cnVlfSk7XG4gICAgICAgIHRoaXMuJHNwbGl0dGVyLnRyaWdnZXIoJ3Jlc2l6ZScpO1xuICAgIH0sXG4gICAgc3BsaXR0ZXJDbG9zZTogZnVuY3Rpb24gKCkge1xuICAgICAgICBjb25zdCB7IHR5cGUsIHBvc2l0aW9uIH0gPSB0aGlzLnByb3BzO1xuXG4gICAgICAgIGlmKHR5cGUgPT09ICdoJykge1xuICAgICAgICAgICAgdGhpcy5zcGxpdHRlcldpZHRoID0gdGhpcy4kc3BsaXR0ZXIub3V0ZXJXaWR0aCh0cnVlKTtcblxuICAgICAgICAgICAgaWYocG9zaXRpb24gPT09ICdsZWZ0Jykge1xuICAgICAgICAgICAgICAgIHRoaXMubGVmdEZyYW1lV2lkdGggPSB0aGlzLiRzcGxpdHRlci5wcmV2KCkub3V0ZXJXaWR0aCh0cnVlKTtcblxuICAgICAgICAgICAgICAgIHRoaXMuJHNwbGl0dGVyLnByZXYoKS5vZmZzZXQoeyBsZWZ0OiAodGhpcy5sZWZ0RnJhbWVXaWR0aCAqIC0xKSB9KTtcbiAgICAgICAgICAgICAgICB0aGlzLiRzcGxpdHRlci5vZmZzZXQoeyBsZWZ0OiAwIH0pO1xuICAgICAgICAgICAgICAgIHRoaXMuJHNwbGl0dGVyLm5leHQoKS5vZmZzZXQoeyBsZWZ0OiB0aGlzLnNwbGl0dGVyV2lkdGggfSk7XG4gICAgICAgICAgICB9ZWxzZSBpZihwb3NpdGlvbiA9PT0gJ3JpZ2h0Jykge1xuICAgICAgICAgICAgICAgIHRoaXMucmlnaHRGcmFtZVdpZHRoID0gdGhpcy4kc3BsaXR0ZXIubmV4dCgpLm91dGVyV2lkdGgodHJ1ZSk7XG5cbiAgICAgICAgICAgICAgICB0aGlzLiRzcGxpdHRlci5wcmV2KCkuY3NzKCdyaWdodCcsIHRoaXMuc3BsaXR0ZXJXaWR0aCk7XG4gICAgICAgICAgICAgICAgdGhpcy4kc3BsaXR0ZXIub2Zmc2V0KHsgbGVmdDogKHRoaXMuJHNwbGl0dGVyLnBhcmVudCgpLm91dGVyV2lkdGgodHJ1ZSkgLSB0aGlzLnNwbGl0dGVyV2lkdGgpIH0pO1xuICAgICAgICAgICAgICAgIHRoaXMuJHNwbGl0dGVyLm5leHQoKS5vdXRlcldpZHRoKDApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy4kc3BsaXR0ZXIuY3NzKCdjdXJzb3InLCAnZGVmYXVsdCcpO1xuICAgICAgICAvL3RoaXMuJHNwbGl0dGVyLnByZXYoKS5vZmYoJ3dlYmtpdFRyYW5zaXRpb25FbmQgb3RyYW5zaXRpb25lbmQgb1RyYW5zaXRpb25FbmQgbXNUcmFuc2l0aW9uRW5kIHRyYW5zaXRpb25lbmQnKTtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7ZXhwYW5kOiBmYWxzZX0pO1xuICAgICAgICB0aGlzLiRzcGxpdHRlci50cmlnZ2VyKCdyZXNpemUnKTtcbiAgICB9LFxuICAgIGV4cGFuZENvbGxhcHNlOiBmdW5jdGlvbihlKSB7XG4gICAgICAgIGlmKHRoaXMuc3RhdGUuZXhwYW5kID09PSB0cnVlKSB7XG4gICAgICAgICAgICB0aGlzLnNwbGl0dGVyQ2xvc2UoKTtcbiAgICAgICAgfWVsc2Uge1xuICAgICAgICAgICAgdGhpcy5zcGxpdHRlck9wZW4oKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgc2F2ZVNwbGl0dGVyUG9zOiBmdW5jdGlvbigpIHtcbiAgICAgICAgY29uc3QgeyB0eXBlLCBwb3NpdGlvbiB9ID0gdGhpcy5wcm9wcztcbiAgICAgICAgdmFyIGEgPSB0aGlzLiRzcGxpdHRlclswXTsvL2RvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuaWQpO1xuICAgICAgICBpZihhKSB7XG4gICAgICAgICAgICBpZih0eXBlID09PSAnaCcpIHtcbiAgICAgICAgICAgICAgICBpZihwb3NpdGlvbiA9PT0gJ2xlZnQnKSB7XG4gICAgICAgICAgICAgICAgICAgIFV0aWwuc2V0Q29va2llKCdoc3BsaXR0ZXJMZWZ0UG9zaXRpb24nLCBhLm9mZnNldExlZnQsIDM2NSk7XG4gICAgICAgICAgICAgICAgfWVsc2UgaWYocG9zaXRpb24gPT09ICdyaWdodCcpIHtcbiAgICAgICAgICAgICAgICAgICAgVXRpbC5zZXRDb29raWUoJ2hzcGxpdHRlclJpZ2h0UG9zaXRpb24nLCB0aGlzLmhSaWdodFNwbGl0dGVyT2Zmc2V0UmlnaHQsIDM2NSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcbiAgICByZXNpemVTcGxpdHRlclBvczogZnVuY3Rpb24oKSB7XG4gICAgICAgIGNvbnN0IHsgdHlwZSwgcG9zaXRpb24gfSA9IHRoaXMucHJvcHM7XG4gICAgICAgIGlmKHR5cGUgPT09ICdoJykge1xuICAgICAgICAgICAgaWYocG9zaXRpb24gPT09ICdyaWdodCcpIHtcbiAgICAgICAgICAgICAgICB2YXIgcmlnaHRGcmFtZVdpZHRoID0gMDtcbiAgICAgICAgICAgICAgICBpZih0aGlzLnN0YXRlLmV4cGFuZCA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICByaWdodEZyYW1lV2lkdGggPSB0aGlzLiRzcGxpdHRlci5uZXh0KCkub3V0ZXJXaWR0aCh0cnVlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy4kc3BsaXR0ZXIub2Zmc2V0KHsgbGVmdDogKHRoaXMuJHNwbGl0dGVyLnBhcmVudCgpLm91dGVyV2lkdGgodHJ1ZSkgLSByaWdodEZyYW1lV2lkdGggLSB0aGlzLnNwbGl0dGVyV2lkdGgpIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcblx0Z2V0RGVmYXVsdFByb3BzOiBmdW5jdGlvbigpIHtcblx0XHQvLyDtgbTrnpjsiqTqsIAg7IOd7ISx65CgIOuVjCDtlZzrsogg7Zi47Lac65CY6rOgIOy6kOyLnOuQnOuLpC5cblx0XHQvLyDrtoDrqqgg7Lu07Y+s64SM7Yq47JeQ7IScIHByb3DsnbQg64SY7Ja07Jik7KeAIOyViuydgCDqsr3smrAgKGluIOyXsOyCsOyekOuhnCDtmZXsnbgpIOunpO2VkeydmCDqsJLsnbQgdGhpcy5wcm9wc+yXkCDshKTsoJXrkJzri6QuXG5cdFx0cmV0dXJuIHt0eXBlOiAnaCcsIHBvc2l0aW9uOiAnbGVmdCcsIG1pbkxlZnQ6IDUwLCBtaW5SaWdodDogNTAsIG1heExlZnQ6IDUwMCwgbWF4UmlnaHQ6IDUwMH07XG5cdH0sXG4gICAgZ2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbigpIHtcblx0XHQvLyDsu7Ttj6zrhIztirjqsIAg66eI7Jq07Yq465CY6riwIOyghCAo7ZWc67KIIO2YuOy2nCkgLyDrpqzthLTqsJLsnYAgdGhpcy5zdGF0ZeydmCDstIjquLDqsJLsnLzroZwg7IKs7JqpXG4gICAgICAgIHJldHVybiB7ZXhwYW5kOiB0cnVlfTtcbiAgICB9LFxuICAgIGNvbXBvbmVudFdpbGxNb3VudDogZnVuY3Rpb24oKSB7XG4gICAgICAgIC8vIOy1nOy0iCDroIzrjZTrp4HsnbQg7J287Ja064KY6riwIOyngeyghCjtlZzrsogg7Zi47LacKVxuICAgICAgICBsZXQgaWQgPSB0aGlzLnByb3BzLmlkO1xuICAgICAgICBpZih0eXBlb2YgaWQgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICBpZCA9IFV0aWwuZ2V0VVVJRCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5pZCA9IGlkO1xuICAgIH0sXG4gICAgY29tcG9uZW50RGlkTW91bnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAvLyDstZzstIgg66CM642U66eB7J20IOydvOyWtOuCnCDri6TsnYwo7ZWc67KIIO2YuOy2nClcbiAgICAgICAgdGhpcy4kc3BsaXR0ZXIgPSAkKCcjJyt0aGlzLmlkKTtcblxuICAgICAgICAvLyBFdmVudHNcbiAgICAgICAgdGhpcy4kc3BsaXR0ZXIub24oJ3Jlc2l6ZScsIHRoaXMub25SZXNpemUpO1xuXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgICQod2luZG93KS5vbigncmVzaXplJywgZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgLy8gc3BsaXR0ZXLsl5DshJwg67Cc7IOd7Iuc7YKk64qUIHJlc2l6ZSDsnbTrsqTtirjsmYAg6rWs67OEXG4gICAgICAgICAgICBpZihlLnRhcmdldCA9PT0gdGhpcykge1xuICAgICAgICAgICAgICAgIC8vX3RoaXMucmVzaXplU3BsaXR0ZXJQb3MoKTtcbiAgICAgICAgICAgICAgICAvLyBzcGxpdHRlck9wZW4vc3BsaXR0ZXJDbG9zZSDtlajsiJgg7Iuk7ZaJ6rO8IOyLnOqwhOywqOulvCDrkZDslrTslbwg7KCB7Jqp65CoXG4gICAgICAgICAgICAgICAgc2V0VGltZW91dChfdGhpcy5yZXNpemVTcGxpdHRlclBvcywgMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0sXG4gICAgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICAgICAgLy8g7ZWE7IiYIO2VreuqqVxuICAgICAgICBjb25zdCB7IGNsYXNzTmFtZSwgdHlwZSwgcG9zaXRpb24sIHZpc2libGUgfSA9IHRoaXMucHJvcHM7XG5cbiAgICAgICAgdmFyIGggPSB0cnVlO1xuICAgICAgICBpZih0eXBlICE9PSAnaCcpIHtcbiAgICAgICAgICAgIGggPSBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBsID0gdHJ1ZTtcbiAgICAgICAgaWYocG9zaXRpb24gIT09ICdsZWZ0Jykge1xuICAgICAgICAgICAgbCA9IGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGRpc3BsYXkgPSAnYmxvY2snO1xuICAgICAgICBpZighdGhpcy5zdGF0ZS5leHBhbmQpIHtcbiAgICAgICAgICAgIGRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPGRpdiBpZD17dGhpcy5pZH0gY2xhc3NOYW1lPXtjbGFzc05hbWVzKHsnbWFpbmZyYW1lLXNwbGl0dGVyJzogdHJ1ZSwgJ2gtc3BsaXR0ZXInOiBoLCAndi1zcGxpdHRlcic6ICFoLCAnbGVmdC1zcGxpdHRlcic6IGwsICdyaWdodC1zcGxpdHRlcic6ICFsfSwgY2xhc3NOYW1lKX1cbiAgICAgICAgICAgICAgICBvbk1vdXNlRG93bj17dGhpcy5zcGxpdHRlck1vdXNlRG93bn0gb25Nb3VzZVVwPXt0aGlzLnNwbGl0dGVyTW91c2VVcH0gb25Nb3VzZU1vdmU9e3RoaXMuc3BsaXR0ZXJNb3VzZU1vdmV9PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXtjbGFzc05hbWVzKHsnc3BsaXR0ZXItY29sbGFwc2UnOiB0aGlzLnN0YXRlLmV4cGFuZCwgJ3NwbGl0dGVyLWV4cGFuZCc6ICF0aGlzLnN0YXRlLmV4cGFuZH0pfSBvbk1vdXNlVXA9e3RoaXMuZXhwYW5kQ29sbGFwc2V9PjwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic3BsaXR0ZXItcmVzaXplLWhhbmRsZVwiIHN0eWxlPXt7ZGlzcGxheTogZGlzcGxheX19PjwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICk7XG4gICAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gU3BsaXR0ZXI7IiwiLyoqXG4gKiBNb2RhbCBjb21wb25lbnRcbiAqXG4gKiB2ZXJzaW9uIDx0dD4kIFZlcnNpb246IDEuMCAkPC90dD4gZGF0ZToyMDE2LzAzLzI1XG4gKiBhdXRob3IgPGEgaHJlZj1cIm1haWx0bzpocmFobkBua2lhLmNvLmtyXCI+QWhuIEh5dW5nLVJvPC9hPlxuICpcbiAqIGV4YW1wbGU6XG4gKiA8UHVtLk1vZGFsIHJlZj1cIm1vZGFsXCIgd2lkdGg9XCI3MDBweFwiPlxuICogICA8UHVtLk1vZGFsSGVhZGVyPk1vZGFsIFRpdGxlPC9QdW0uTW9kYWxIZWFkZXI+XG4gKiAgIDxQdW0uTW9kYWxCb2R5Pk1vZGFsIEJvZHk8L1B1bS5Nb2RhbEJvZHk+XG4gKiAgIDxQdW0uTW9kYWxGb290ZXI+TW9kYWwgRm9vdGVyPC9QdW0uTW9kYWxGb290ZXI+XG4gKiA8L1B1bS5Nb2RhbD5cbiAqXG4gKiBib290c3RyYXAgY29tcG9uZW50XG4gKi9cbid1c2Ugc3RyaWN0JztcblxudmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcbnZhciBQcm9wVHlwZXMgPSByZXF1aXJlKCdyZWFjdCcpLlByb3BUeXBlcztcbnZhciBjbGFzc05hbWVzID0gcmVxdWlyZSgnY2xhc3NuYW1lcycpO1xuXG52YXIgVXRpbCA9IHJlcXVpcmUoJy4uL3NlcnZpY2VzL1V0aWwnKTtcblxudmFyIE1vZGFsSGVhZGVyID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICAgIGRpc3BsYXlOYW1lOiAnTW9kYWxIZWFkZXInLFxuICAgIHByb3BUeXBlczoge1xuICAgICAgICBjbGFzc05hbWU6IFByb3BUeXBlcy5zdHJpbmdcbiAgICB9LFxuICAgIHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgICAgIC8vIO2VhOyImCDtla3rqqlcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXtjbGFzc05hbWVzKCdtb2RhbC1oZWFkZXInLCB0aGlzLnByb3BzLmNsYXNzTmFtZSl9PlxuICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzTmFtZT1cImNsb3NlXCIgZGF0YS1kaXNtaXNzPVwibW9kYWxcIj48c3BhbiBhcmlhLWhpZGRlbj1cInRydWVcIj4mdGltZXM7PC9zcGFuPjxzcGFuIGNsYXNzTmFtZT1cInNyLW9ubHlcIj5DbG9zZTwvc3Bhbj48L2J1dHRvbj5cbiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJtb2RhbC10aXRsZVwiPnt0aGlzLnByb3BzLmNoaWxkcmVufTwvc3Bhbj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICApO1xuICAgIH1cbn0pO1xuXG52YXIgTW9kYWxCb2R5ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICAgIGRpc3BsYXlOYW1lOiAnTW9kYWxCb2R5JyxcbiAgICBwcm9wVHlwZXM6IHtcbiAgICAgICAgY2xhc3NOYW1lOiBQcm9wVHlwZXMuc3RyaW5nXG4gICAgfSxcbiAgICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgICAvLyDtlYTsiJgg7ZWt66qpXG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT17Y2xhc3NOYW1lcygnbW9kYWwtYm9keScsIHRoaXMucHJvcHMuY2xhc3NOYW1lKX0+e3RoaXMucHJvcHMuY2hpbGRyZW59PC9kaXY+XG4gICAgICAgICk7XG4gICAgfVxufSk7XG5cbnZhciBNb2RhbEZvb3RlciA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgICBkaXNwbGF5TmFtZTogJ01vZGFsRm9vdGVyJyxcbiAgICBwcm9wVHlwZXM6IHtcbiAgICAgICAgY2xhc3NOYW1lOiBQcm9wVHlwZXMuc3RyaW5nXG4gICAgfSxcbiAgICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgICAvLyDtlYTsiJgg7ZWt66qpXG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT17Y2xhc3NOYW1lcygnbW9kYWwtZm9vdGVyJywgdGhpcy5wcm9wcy5jbGFzc05hbWUpfT57dGhpcy5wcm9wcy5jaGlsZHJlbn08L2Rpdj5cbiAgICAgICAgKTtcbiAgICB9XG59KTtcblxudmFyIE1vZGFsID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICAgIGRpc3BsYXlOYW1lOiAnTW9kYWwnLFxuICAgIHByb3BUeXBlczoge1xuICAgICAgICBpZDogUHJvcFR5cGVzLnN0cmluZyxcbiAgICAgICAgY2xhc3NOYW1lOiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgICAgICB3aWR0aDogUHJvcFR5cGVzLm9uZU9mVHlwZShbXG4gICAgICAgICAgICBQcm9wVHlwZXMuc3RyaW5nLFxuICAgICAgICAgICAgUHJvcFR5cGVzLm51bWJlclxuICAgICAgICBdKSxcbiAgICAgICAgYmFja2Ryb3A6IFByb3BUeXBlcy5ib29sLFxuICAgICAgICBvblNob3c6IFByb3BUeXBlcy5mdW5jLFxuICAgICAgICBvbkhpZGU6IFByb3BUeXBlcy5mdW5jLFxuICAgICAgICBpbml0OiBQcm9wVHlwZXMuZnVuY1xuICAgIH0sXG4gICAgaWQ6ICcnLFxuICAgIHNob3c6IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgYWxlcnQgPSAkKCcjJyt0aGlzLmlkKTtcbiAgICAgICAgYWxlcnQubW9kYWwoJ3Nob3cnKTtcbiAgICAgICAgLypcbiAgICAgICAgaWYodGhpcy5wcm9wcy5iYWNrZHJvcCA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgYWxlcnQubW9kYWwoJ3Nob3cnKTtcbiAgICAgICAgfWVsc2Uge1xuICAgICAgICAgICAgYWxlcnQubW9kYWwoe1xuICAgICAgICAgICAgICAgIGJhY2tkcm9wOiAnc3RhdGljJyxcbiAgICAgICAgICAgICAgICBrZXlib2FyZDogZmFsc2VcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgICovXG4gICAgfSxcbiAgICBoaWRlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGFsZXJ0ID0gJCgnIycrdGhpcy5pZCk7XG4gICAgICAgIGFsZXJ0Lm1vZGFsKCdoaWRlJyk7XG4gICAgfSxcbiAgICBvblNob3c6IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgIGlmKHR5cGVvZiB0aGlzLnByb3BzLm9uU2hvdyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgdGhpcy5wcm9wcy5vblNob3coZXZlbnQpO1xuICAgICAgICAgICAgLy9ldmVudC5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgb25IaWRlOiBmdW5jdGlvbihldmVudCkge1xuICAgICAgICBpZih0eXBlb2YgdGhpcy5wcm9wcy5vbkhpZGUgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIHRoaXMucHJvcHMub25IaWRlKGV2ZW50KTtcbiAgICAgICAgICAgIC8vZXZlbnQuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIGdldENoaWxkcmVuOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGNoaWxkcmVuID0gdGhpcy5wcm9wcy5jaGlsZHJlbjtcblxuICAgICAgICByZXR1cm4gUmVhY3QuQ2hpbGRyZW4ubWFwKGNoaWxkcmVuLCAoY2hpbGQpID0+IHtcbiAgICAgICAgICAgIGlmKGNoaWxkID09PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBSZWFjdC5jbG9uZUVsZW1lbnQoY2hpbGQsIHt9KTtcbiAgICAgICAgfSk7XG4gICAgfSxcbiAgICBnZXREZWZhdWx0UHJvcHM6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4ge2JhY2tkcm9wOiBmYWxzZX07XG4gICAgfSxcbiAgICBjb21wb25lbnRXaWxsTW91bnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAvLyDstZzstIgg66CM642U66eB7J20IOydvOyWtOuCmOq4sCDsp4HsoIQo7ZWc67KIIO2YuOy2nClcbiAgICAgICAgbGV0IGlkID0gdGhpcy5wcm9wcy5pZDtcbiAgICAgICAgaWYodHlwZW9mIGlkID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgaWQgPSBVdGlsLmdldFVVSUQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuaWQgPSBpZDtcbiAgICB9LFxuICAgIGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbigpIHtcbiAgICAgICAgLy8g7LWc7LSIIOugjOuNlOungeydtCDsnbzslrTrgpwg64uk7J2MKO2VnOuyiCDtmLjstpwpXG4gICAgICAgIHZhciAkbW9kYWwgPSAkKCcjJyt0aGlzLmlkKTtcbiAgICAgICAgaWYodGhpcy5wcm9wcy5iYWNrZHJvcCA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgICRtb2RhbC5hdHRyKCdkYXRhLWJhY2tkcm9wJywgJ3N0YXRpYycpO1xuICAgICAgICAgICAgJG1vZGFsLmF0dHIoJ2RhdGEta2V5Ym9hcmQnLCBmYWxzZSk7XG4gICAgICAgIH1cblxuICAgICAgICAkbW9kYWwub24oJ3Nob3duLmJzLm1vZGFsJywgdGhpcy5vblNob3cpO1xuICAgICAgICAkbW9kYWwub24oJ2hpZGRlbi5icy5tb2RhbCcsIHRoaXMub25IaWRlKTtcblxuICAgICAgICBpZih0eXBlb2YgdGhpcy5wcm9wcy5pbml0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICB2YXIgZGF0YSA9IHt9O1xuICAgICAgICAgICAgZGF0YS4kbW9kYWwgPSAkbW9kYWw7XG4gICAgICAgICAgICB0aGlzLnByb3BzLmluaXQoZGF0YSk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgICAgIC8vIO2VhOyImCDtla3rqqlcbiAgICAgICAgY29uc3Qge2NsYXNzTmFtZSwgd2lkdGh9ID0gdGhpcy5wcm9wcztcblxuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPGRpdiBpZD17dGhpcy5pZH0gY2xhc3NOYW1lPXtjbGFzc05hbWVzKCdtb2RhbCcsICdmYWRlJywgY2xhc3NOYW1lKX0gcm9sZT1cImRpYWxvZ1wiIGFyaWEtbGFiZWxsZWRieT1cIlwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibW9kYWwtZGlhbG9nXCIgc3R5bGU9e3t3aWR0aDogd2lkdGh9fT5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtb2RhbC1jb250ZW50XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICB7dGhpcy5nZXRDaGlsZHJlbigpfVxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICApO1xuICAgIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBNb2RhbDogTW9kYWwsXG4gICAgTW9kYWxIZWFkZXI6IE1vZGFsSGVhZGVyLFxuICAgIE1vZGFsQm9keTogTW9kYWxCb2R5LFxuICAgIE1vZGFsRm9vdGVyOiBNb2RhbEZvb3RlclxufTsiLCIvKipcbiAqIFBhbmVsIGNvbXBvbmVudFxuICpcbiAqIHZlcnNpb24gPHR0PiQgVmVyc2lvbjogMS4wICQ8L3R0PiBkYXRlOjIwMTYvMDMvMzBcbiAqIGF1dGhvciA8YSBocmVmPVwibWFpbHRvOmhyYWhuQG5raWEuY28ua3JcIj5BaG4gSHl1bmctUm88L2E+XG4gKlxuICogZXhhbXBsZTpcbiAqIDxQdW0uUGFuZWwgIC8+XG4gKlxuICogYm9vdHN0cmFwIGNvbXBvbmVudFxuICovXG4ndXNlIHN0cmljdCc7XG5cbnZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG52YXIgUHJvcFR5cGVzID0gcmVxdWlyZSgncmVhY3QnKS5Qcm9wVHlwZXM7XG52YXIgY2xhc3NOYW1lcyA9IHJlcXVpcmUoJ2NsYXNzbmFtZXMnKTtcblxudmFyIFV0aWwgPSByZXF1aXJlKCcuLi9zZXJ2aWNlcy9VdGlsJyk7XG5cbnZhciBQYW5lbEhlYWRlciA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgICBkaXNwbGF5TmFtZTogJ1BhbmVsSGVhZGVyJyxcbiAgICBwcm9wVHlwZXM6IHtcbiAgICAgICAgd2lkdGg6IFByb3BUeXBlcy5vbmVPZlR5cGUoW1xuICAgICAgICAgICAgUHJvcFR5cGVzLnN0cmluZyxcbiAgICAgICAgICAgIFByb3BUeXBlcy5udW1iZXJcbiAgICAgICAgXSksXG4gICAgICAgIGhlaWdodDogUHJvcFR5cGVzLm9uZU9mVHlwZShbXG4gICAgICAgICAgICBQcm9wVHlwZXMuc3RyaW5nLFxuICAgICAgICAgICAgUHJvcFR5cGVzLm51bWJlclxuICAgICAgICBdKVxuICAgIH0sXG4gICAgZ2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgLy8g7Lu07Y+s64SM7Yq46rCAIOuniOyatO2KuOuQmOq4sCDsoIQgKO2VnOuyiCDtmLjstpwpIC8g66as7YS06rCS7J2AIHRoaXMuc3RhdGXsnZgg7LSI6riw6rCS7Jy866GcIOyCrOyaqVxuICAgICAgICBjb25zdCB7d2lkdGgsIGhlaWdodH0gPSB0aGlzLnByb3BzO1xuICAgICAgICByZXR1cm4ge3dpZHRoOiB3aWR0aCwgaGVpZ2h0OiBoZWlnaHR9O1xuICAgIH0sXG4gICAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wczogZnVuY3Rpb24obmV4dFByb3BzKSB7XG4gICAgICAgIC8vIOy7tO2PrOuEjO2KuOqwgCDsg4jroZzsmrQgcHJvcHPrpbwg67Cb7J2EIOuVjCDtmLjstpwo7LWc7LSIIOugjOuNlOungSDsi5zsl5DripQg7Zi47Lac65CY7KeAIOyViuydjClcbiAgICAgICAgY29uc3Qge3dpZHRoLCBoZWlnaHR9ID0gbmV4dFByb3BzO1xuICAgICAgICB0aGlzLnNldFN0YXRlKHt3aWR0aDogd2lkdGgsIGhlaWdodDogaGVpZ2h0fSlcbiAgICB9LFxuICAgIHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgICAgIC8vIO2VhOyImCDtla3rqqlcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicGFuZWwtaGVhZGluZ1wiIHN0eWxlPXt7d2lkdGg6IHRoaXMuc3RhdGUud2lkdGgsIGhlaWdodDogdGhpcy5zdGF0ZS5oZWlnaHR9fT5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInBhbmVsLXRpdGxlXCI+e3RoaXMucHJvcHMuY2hpbGRyZW59PC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKTtcbiAgICB9XG59KTtcblxudmFyIFBhbmVsQm9keSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgICBkaXNwbGF5TmFtZTogJ1BhbmVsQm9keScsXG4gICAgcHJvcFR5cGVzOiB7XG4gICAgICAgIHdpZHRoOiBQcm9wVHlwZXMub25lT2ZUeXBlKFtcbiAgICAgICAgICAgIFByb3BUeXBlcy5zdHJpbmcsXG4gICAgICAgICAgICBQcm9wVHlwZXMubnVtYmVyXG4gICAgICAgIF0pLFxuICAgICAgICBoZWlnaHQ6IFByb3BUeXBlcy5vbmVPZlR5cGUoW1xuICAgICAgICAgICAgUHJvcFR5cGVzLnN0cmluZyxcbiAgICAgICAgICAgIFByb3BUeXBlcy5udW1iZXJcbiAgICAgICAgXSlcbiAgICB9LFxuICAgIGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIC8vIOy7tO2PrOuEjO2KuOqwgCDrp4jsmrTtirjrkJjquLAg7KCEICjtlZzrsogg7Zi47LacKSAvIOumrO2EtOqwkuydgCB0aGlzLnN0YXRl7J2YIOy0iOq4sOqwkuycvOuhnCDsgqzsmqlcbiAgICAgICAgY29uc3Qge3dpZHRoLCBoZWlnaHR9ID0gdGhpcy5wcm9wcztcbiAgICAgICAgcmV0dXJuIHt3aWR0aDogd2lkdGgsIGhlaWdodDogaGVpZ2h0fTtcbiAgICB9LFxuICAgIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHM6IGZ1bmN0aW9uKG5leHRQcm9wcykge1xuICAgICAgICAvLyDsu7Ttj6zrhIztirjqsIAg7IOI66Gc7Jq0IHByb3Bz66W8IOuwm+ydhCDrlYwg7Zi47LacKOy1nOy0iCDroIzrjZTrp4Eg7Iuc7JeQ64qUIO2YuOy2nOuQmOyngCDslYrsnYwpXG4gICAgICAgIGNvbnN0IHt3aWR0aCwgaGVpZ2h0fSA9IG5leHRQcm9wcztcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7d2lkdGg6IHdpZHRoLCBoZWlnaHQ6IGhlaWdodH0pXG4gICAgfSxcbiAgICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgICAvLyDtlYTsiJgg7ZWt66qpXG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInBhbmVsLWJvZHlcIiBzdHlsZT17e3dpZHRoOiB0aGlzLnN0YXRlLndpZHRoLCBoZWlnaHQ6IHRoaXMuc3RhdGUuaGVpZ2h0fX0+e3RoaXMucHJvcHMuY2hpbGRyZW59PC9kaXY+XG4gICAgICAgICk7XG4gICAgfVxufSk7XG5cbnZhciBQYW5lbEZvb3RlciA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgICBkaXNwbGF5TmFtZTogJ1BhbmVsRm9vdGVyJyxcbiAgICBwcm9wVHlwZXM6IHtcbiAgICAgICAgd2lkdGg6IFByb3BUeXBlcy5vbmVPZlR5cGUoW1xuICAgICAgICAgICAgUHJvcFR5cGVzLnN0cmluZyxcbiAgICAgICAgICAgIFByb3BUeXBlcy5udW1iZXJcbiAgICAgICAgXSksXG4gICAgICAgIGhlaWdodDogUHJvcFR5cGVzLm9uZU9mVHlwZShbXG4gICAgICAgICAgICBQcm9wVHlwZXMuc3RyaW5nLFxuICAgICAgICAgICAgUHJvcFR5cGVzLm51bWJlclxuICAgICAgICBdKVxuICAgIH0sXG4gICAgZ2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgLy8g7Lu07Y+s64SM7Yq46rCAIOuniOyatO2KuOuQmOq4sCDsoIQgKO2VnOuyiCDtmLjstpwpIC8g66as7YS06rCS7J2AIHRoaXMuc3RhdGXsnZgg7LSI6riw6rCS7Jy866GcIOyCrOyaqVxuICAgICAgICBjb25zdCB7d2lkdGgsIGhlaWdodH0gPSB0aGlzLnByb3BzO1xuICAgICAgICByZXR1cm4ge3dpZHRoOiB3aWR0aCwgaGVpZ2h0OiBoZWlnaHR9O1xuICAgIH0sXG4gICAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wczogZnVuY3Rpb24obmV4dFByb3BzKSB7XG4gICAgICAgIC8vIOy7tO2PrOuEjO2KuOqwgCDsg4jroZzsmrQgcHJvcHPrpbwg67Cb7J2EIOuVjCDtmLjstpwo7LWc7LSIIOugjOuNlOungSDsi5zsl5DripQg7Zi47Lac65CY7KeAIOyViuydjClcbiAgICAgICAgY29uc3Qge3dpZHRoLCBoZWlnaHR9ID0gbmV4dFByb3BzO1xuICAgICAgICB0aGlzLnNldFN0YXRlKHt3aWR0aDogd2lkdGgsIGhlaWdodDogaGVpZ2h0fSlcbiAgICB9LFxuICAgIHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgICAgIC8vIO2VhOyImCDtla3rqqlcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicGFuZWwtZm9vdGVyXCIgc3R5bGU9e3t3aWR0aDogdGhpcy5zdGF0ZS53aWR0aCwgaGVpZ2h0OiB0aGlzLnN0YXRlLmhlaWdodH19Pnt0aGlzLnByb3BzLmNoaWxkcmVufTwvZGl2PlxuICAgICAgICApO1xuICAgIH1cbn0pO1xuXG52YXIgUGFuZWwgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gICAgZGlzcGxheU5hbWU6ICdQYW5lbCcsXG4gICAgcHJvcFR5cGVzOiB7XG4gICAgICAgIGlkOiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgICAgICBjbGFzc05hbWU6IFByb3BUeXBlcy5zdHJpbmdcbiAgICB9LFxuICAgIGlkOiAnJyxcbiAgICBnZXRDaGlsZHJlbjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBjaGlsZHJlbiA9IHRoaXMucHJvcHMuY2hpbGRyZW47XG5cbiAgICAgICAgcmV0dXJuIFJlYWN0LkNoaWxkcmVuLm1hcChjaGlsZHJlbiwgKGNoaWxkKSA9PiB7XG4gICAgICAgICAgICBpZihjaGlsZCA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gUmVhY3QuY2xvbmVFbGVtZW50KGNoaWxkLCB7fSk7XG4gICAgICAgIH0pO1xuICAgIH0sXG5cdGdldERlZmF1bHRQcm9wczogZnVuY3Rpb24oKSB7XG5cdFx0Ly8g7YG0656Y7Iqk6rCAIOyDneyEseuQoCDrlYwg7ZWc67KIIO2YuOy2nOuQmOqzoCDsupDsi5zrkJzri6QuXG5cdFx0Ly8g67aA66qoIOy7tO2PrOuEjO2KuOyXkOyEnCBwcm9w7J20IOuEmOyWtOyYpOyngCDslYrsnYAg6rK97JqwIChpbiDsl7DsgrDsnpDroZwg7ZmV7J24KSDrp6TtlZHsnZgg6rCS7J20IHRoaXMucHJvcHPsl5Ag7ISk7KCV65Cc64ukLlxuXHRcdHJldHVybiB7Y2xhc3NOYW1lOiAncGFuZWwtZGVmYXVsdCd9O1xuXHR9LFxuICAgIGNvbXBvbmVudFdpbGxNb3VudDogZnVuY3Rpb24oKSB7XG4gICAgICAgIC8vIOy1nOy0iCDroIzrjZTrp4HsnbQg7J287Ja064KY6riwIOyngeyghCjtlZzrsogg7Zi47LacKVxuICAgICAgICBsZXQgaWQgPSB0aGlzLnByb3BzLmlkO1xuICAgICAgICBpZih0eXBlb2YgaWQgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICBpZCA9IFV0aWwuZ2V0VVVJRCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5pZCA9IGlkO1xuICAgIH0sXG4gICAgY29tcG9uZW50RGlkTW91bnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAvLyDstZzstIgg66CM642U66eB7J20IOydvOyWtOuCnCDri6TsnYwo7ZWc67KIIO2YuOy2nClcblxuICAgIH0sXG4gICAgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICAgICAgLy8g7ZWE7IiYIO2VreuqqVxuICAgICAgICBjb25zdCB7Y2xhc3NOYW1lfSA9IHRoaXMucHJvcHM7XG5cbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXtjbGFzc05hbWVzKCdwYW5lbCcsIGNsYXNzTmFtZSl9Pnt0aGlzLmdldENoaWxkcmVuKCl9PC9kaXY+XG4gICAgICAgICk7XG4gICAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIFBhbmVsOiBQYW5lbCxcbiAgICBQYW5lbEhlYWRlcjogUGFuZWxIZWFkZXIsXG4gICAgUGFuZWxCb2R5OiBQYW5lbEJvZHksXG4gICAgUGFuZWxGb290ZXI6IFBhbmVsRm9vdGVyXG59OyIsIi8qKlxyXG4gKiBSYWRpbyBjb21wb25lbnRcclxuICpcclxuICogdmVyc2lvbiA8dHQ+JCBWZXJzaW9uOiAxLjAgJDwvdHQ+IGRhdGU6MjAxNi8wMy8xN1xyXG4gKiBhdXRob3IgPGEgaHJlZj1cIm1haWx0bzpocmFobkBua2lhLmNvLmtyXCI+QWhuIEh5dW5nLVJvPC9hPlxyXG4gKlxyXG4gKiBleGFtcGxlOlxyXG4gKiA8UHVmLlJhZGlvIG9wdGlvbnM9XCJ7b3B0aW9uc31cIiAvPlxyXG4gKlxyXG4gKi9cclxuJ3VzZSBzdHJpY3QnO1xyXG5cclxuaW1wb3J0IFJlYWN0LCB7UHJvcFR5cGVzfSBmcm9tICdyZWFjdCc7XHJcbnZhciBjbGFzc05hbWVzID0gcmVxdWlyZSgnY2xhc3NuYW1lcycpO1xyXG5cclxudmFyIFV0aWwgPSByZXF1aXJlKCcuLi8uLi9zZXJ2aWNlcy9VdGlsJyk7XHJcblxyXG52YXIgUmFkaW8gPSBSZWFjdC5jcmVhdGVDbGFzcyh7XHJcbiAgICBkaXNwbGF5TmFtZTogJ1JhZGlvJyxcclxuICAgIHByb3BUeXBlczoge1xyXG4gICAgICAgIGlkOiBQcm9wVHlwZXMuc3RyaW5nLFxyXG4gICAgICAgIGNsYXNzTmFtZTogUHJvcFR5cGVzLnN0cmluZyxcclxuICAgICAgICBuYW1lOiBQcm9wVHlwZXMuc3RyaW5nLFxyXG4gICAgICAgIHNlbGVjdGVkVmFsdWU6IFByb3BUeXBlcy5vbmVPZlR5cGUoW1xyXG4gICAgICAgICAgICBQcm9wVHlwZXMuc3RyaW5nLFxyXG4gICAgICAgICAgICBQcm9wVHlwZXMubnVtYmVyLFxyXG4gICAgICAgICAgICBQcm9wVHlwZXMuYm9vbCxcclxuICAgICAgICBdKSxcclxuICAgICAgICBkaXJlY3Rpb246IFByb3BUeXBlcy5vbmVPZihbJ2gnLCd2J10pLFxyXG4gICAgICAgIG9uQ2hhbmdlOiBQcm9wVHlwZXMuZnVuYyxcclxuICAgICAgICB2YWx1ZTogUHJvcFR5cGVzLm9uZU9mVHlwZShbXHJcbiAgICAgICAgICAgIFByb3BUeXBlcy5zdHJpbmcsXHJcbiAgICAgICAgICAgIFByb3BUeXBlcy5udW1iZXIsXHJcbiAgICAgICAgICAgIFByb3BUeXBlcy5ib29sLFxyXG4gICAgICAgIF0pXHJcbiAgICB9LFxyXG4gICAgY29tcG9uZW50V2lsbE1vdW50OiBmdW5jdGlvbigpIHtcclxuICAgICAgICAvLyDstZzstIgg66CM642U66eB7J20IOydvOyWtOuCmOq4sCDsp4HsoIQo7ZWc67KIIO2YuOy2nClcclxuICAgICAgICBsZXQgaWQgPSB0aGlzLnByb3BzLmlkO1xyXG4gICAgICAgIGlmKHR5cGVvZiBpZCA9PT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICAgICAgaWQgPSBVdGlsLmdldFVVSUQoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuaWQgPSBpZDtcclxuICAgIH0sXHJcbiAgICBjb21wb25lbnREaWRNb3VudDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgLy8g7LWc7LSIIOugjOuNlOungeydtCDsnbzslrTrgpwg64uk7J2MKO2VnOuyiCDtmLjstpwpXHJcbiAgICAgICAgaWYodGhpcy5wcm9wcy5kaXJlY3Rpb24gPT09ICdoJykge1xyXG4gICAgICAgICAgICBsZXQgJGRpdiA9ICQoJyMnK3RoaXMuaWQpLFxyXG4gICAgICAgICAgICAgICAgJGxhYmVsID0gJGRpdi5jaGlsZHJlbigpO1xyXG4gICAgICAgICAgICAkbGFiZWwuYWRkQ2xhc3MoJ3JhZGlvLWlubGluZScpO1xyXG4gICAgICAgICAgICAkZGl2LnJlcGxhY2VXaXRoKCRsYWJlbCk7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIHJlbmRlcjogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgLy8g7ZWE7IiYIO2VreuqqVxyXG4gICAgICAgIGNvbnN0IHtjbGFzc05hbWUsIG5hbWUsIHNlbGVjdGVkVmFsdWUsIG9uQ2hhbmdlLCB2YWx1ZSwgY2hpbGRyZW59ID0gdGhpcy5wcm9wcztcclxuICAgICAgICBjb25zdCBvcHRpb25hbCA9IHt9O1xyXG4gICAgICAgIGlmKHNlbGVjdGVkVmFsdWUgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBvcHRpb25hbC5jaGVja2VkID0gKHRoaXMucHJvcHMudmFsdWUgPT09IHNlbGVjdGVkVmFsdWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvKlxyXG4gICAgICAgIGlmKHR5cGVvZiBvbkNoYW5nZSA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgICAgICBvcHRpb25hbC5vbkNoYW5nZSA9IG9uQ2hhbmdlLmJpbmQobnVsbCwgdGhpcy5wcm9wcy52YWx1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgICovXHJcbiAgICAgICAgb3B0aW9uYWwub25DaGFuZ2UgPSBvbkNoYW5nZS5iaW5kKG51bGwsIHRoaXMucHJvcHMudmFsdWUpO1xyXG5cclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJhZGlvXCIgaWQ9e3RoaXMuaWR9PlxyXG4gICAgICAgICAgICAgICAgPGxhYmVsPlxyXG4gICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwicmFkaW9cIiBjbGFzc05hbWU9e2NsYXNzTmFtZX0gbmFtZT17bmFtZX0gdmFsdWU9e3ZhbHVlfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7Li4ub3B0aW9uYWx9IC8+XHJcbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwibGJsXCI+e2NoaWxkcmVufTwvc3Bhbj5cclxuICAgICAgICAgICAgICAgIDwvbGFiZWw+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbn0pO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBSYWRpbzsiLCIvKipcclxuICogUmFkaW9Hcm91cCBjb21wb25lbnRcclxuICpcclxuICogdmVyc2lvbiA8dHQ+JCBWZXJzaW9uOiAxLjAgJDwvdHQ+IGRhdGU6MjAxNi8wMy8xN1xyXG4gKiBhdXRob3IgPGEgaHJlZj1cIm1haWx0bzpocmFobkBua2lhLmNvLmtyXCI+QWhuIEh5dW5nLVJvPC9hPlxyXG4gKlxyXG4gKiBleGFtcGxlOlxyXG4gKiA8UHVmLlJhZGlvR3JvdXAgb3B0aW9ucz1cIntvcHRpb25zfVwiIC8+XHJcbiAqXHJcbiAqL1xyXG4ndXNlIHN0cmljdCc7XHJcblxyXG5pbXBvcnQgUmVhY3QsIHtQcm9wVHlwZXN9IGZyb20gJ3JlYWN0JztcclxudmFyIGNsYXNzTmFtZXMgPSByZXF1aXJlKCdjbGFzc25hbWVzJyk7XHJcblxyXG52YXIgUmFkaW9Hcm91cCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcclxuICAgIGRpc3BsYXlOYW1lOiAnUmFkaW9Hcm91cCcsXHJcbiAgICBwcm9wVHlwZXM6IHtcclxuICAgICAgICBjbGFzc05hbWU6IFByb3BUeXBlcy5zdHJpbmcsXHJcbiAgICAgICAgbmFtZTogUHJvcFR5cGVzLnN0cmluZyxcclxuICAgICAgICBzZWxlY3RlZFZhbHVlOiBQcm9wVHlwZXMub25lT2ZUeXBlKFtcclxuICAgICAgICAgICAgUHJvcFR5cGVzLnN0cmluZyxcclxuICAgICAgICAgICAgUHJvcFR5cGVzLm51bWJlcixcclxuICAgICAgICAgICAgUHJvcFR5cGVzLmJvb2wsXHJcbiAgICAgICAgXSksXHJcbiAgICAgICAgZGlyZWN0aW9uOiBQcm9wVHlwZXMub25lT2YoWydoJywndiddKSxcclxuICAgICAgICBvbkNoYW5nZTogUHJvcFR5cGVzLmZ1bmNcclxuICAgIH0sXHJcbiAgICBvbkNoYW5nZTogZnVuY3Rpb24odmFsdWUsIGV2ZW50KSB7XHJcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7c2VsZWN0ZWRWYWx1ZTogdmFsdWV9KTtcclxuICAgICAgICBpZih0eXBlb2YgdGhpcy5wcm9wcy5vbkNoYW5nZSA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgICAgICB0aGlzLnByb3BzLm9uQ2hhbmdlKGV2ZW50LCB2YWx1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIGdldENoaWxkcmVuOiBmdW5jdGlvbigpIHtcclxuICAgICAgICBjb25zdCB7Y2xhc3NOYW1lLCBuYW1lLCBkaXJlY3Rpb24sIGNoaWxkcmVufSA9IHRoaXMucHJvcHMsXHJcbiAgICAgICAgICAgIHNlbGVjdGVkVmFsdWUgPSB0aGlzLnN0YXRlLnNlbGVjdGVkVmFsdWUsXHJcbiAgICAgICAgICAgIG9uQ2hhbmdlID0gdGhpcy5vbkNoYW5nZTtcclxuXHJcbiAgICAgICAgcmV0dXJuIFJlYWN0LkNoaWxkcmVuLm1hcChjaGlsZHJlbiwgKHJhZGlvKSA9PiB7XHJcbiAgICAgICAgICAgIGlmKHJhZGlvID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIFJlYWN0LmNsb25lRWxlbWVudChyYWRpbywge1xyXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lLFxyXG4gICAgICAgICAgICAgICAgbmFtZSxcclxuICAgICAgICAgICAgICAgIHNlbGVjdGVkVmFsdWUsXHJcbiAgICAgICAgICAgICAgICBkaXJlY3Rpb24sXHJcbiAgICAgICAgICAgICAgICBvbkNoYW5nZVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH0sXHJcbiAgICBzZXRTdGF0ZU9iamVjdDogZnVuY3Rpb24ocHJvcHMpIHtcclxuICAgICAgICBsZXQgc2VsZWN0ZWRWYWx1ZSA9IHByb3BzLnNlbGVjdGVkVmFsdWU7XHJcbiAgICAgICAgaWYodHlwZW9mIHNlbGVjdGVkVmFsdWUgPT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgICAgIHNlbGVjdGVkVmFsdWUgPSBudWxsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgc2VsZWN0ZWRWYWx1ZTogc2VsZWN0ZWRWYWx1ZVxyXG4gICAgICAgIH07XHJcbiAgICB9LFxyXG4gICAgZ2V0RGVmYXVsdFByb3BzOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAvLyDtgbTrnpjsiqTqsIAg7IOd7ISx65CgIOuVjCDtlZzrsogg7Zi47Lac65CY6rOgIOy6kOyLnOuQnOuLpC5cclxuICAgICAgICAvLyDrtoDrqqgg7Lu07Y+s64SM7Yq47JeQ7IScIHByb3DsnbQg64SY7Ja07Jik7KeAIOyViuydgCDqsr3smrAgKGluIOyXsOyCsOyekOuhnCDtmZXsnbgpIOunpO2VkeydmCDqsJLsnbQgdGhpcy5wcm9wc+yXkCDshKTsoJXrkJzri6QuXHJcbiAgICAgICAgcmV0dXJuIHsgZGlyZWN0aW9uOiAndicgfTtcclxuICAgIH0sXHJcbiAgICBnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnNldFN0YXRlT2JqZWN0KHRoaXMucHJvcHMpO1xyXG4gICAgfSxcclxuICAgIGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbigpIHtcclxuICAgICAgICAvLyDstZzstIgg66CM642U66eB7J20IOydvOyWtOuCnCDri6TsnYwo7ZWc67KIIO2YuOy2nClcclxuICAgICAgICAvL2NvbnNvbGUubG9nKCdjb21wb25lbnREaWRNb3VudCcpO1xyXG4gICAgfSxcclxuICAgIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHM6IGZ1bmN0aW9uKG5leHRQcm9wcykge1xyXG4gICAgICAgIC8vIOy7tO2PrOuEjO2KuOqwgCDsg4jroZzsmrQgcHJvcHPrpbwg67Cb7J2EIOuVjCDtmLjstpwo7LWc7LSIIOugjOuNlOungSDsi5zsl5DripQg7Zi47Lac65CY7KeAIOyViuydjClcclxuICAgICAgICB0aGlzLnNldFN0YXRlKHRoaXMuc2V0U3RhdGVPYmplY3QobmV4dFByb3BzKSk7XHJcbiAgICB9LFxyXG4gICAgcmVuZGVyOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAvLyDtlYTsiJgg7ZWt66qpXHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyYWRpby1ncm91cFwiPlxyXG4gICAgICAgICAgICAgICAge3RoaXMuZ2V0Q2hpbGRyZW4oKX1cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxufSk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFJhZGlvR3JvdXA7IiwiLyoqXHJcbiAqIEF1dG9Db21wbGV0ZSBjb21wb25lbnRcclxuICpcclxuICogdmVyc2lvbiA8dHQ+JCBWZXJzaW9uOiAxLjAgJDwvdHQ+IGRhdGU6MjAxNi8wOS8wOVxyXG4gKiBhdXRob3IgPGEgaHJlZj1cIm1haWx0bzpqeXRAbmtpYS5jby5rclwiPkp1bmcgWW91bmctVGFpPC9hPlxyXG4gKlxyXG4gKiBleGFtcGxlOlxyXG4gKiA8UHVmLkF1dG9Db21wbGV0ZSBvcHRpb25zPXtvcHRpb25zfSAvPlxyXG4gKlxyXG4gKiBLZW5kbyBBdXRvQ29tcGxldGUg65287J2067iM65+s66as7JeQIOyiheyGjeyggeydtOuLpC5cclxuICovXHJcbid1c2Ugc3RyaWN0JztcclxuXHJcbnZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XHJcbnZhciBQcm9wVHlwZXMgPSByZXF1aXJlKCdyZWFjdCcpLlByb3BUeXBlcztcclxudmFyIGNsYXNzTmFtZXMgPSByZXF1aXJlKCdjbGFzc25hbWVzJyk7XHJcblxyXG52YXIgVXRpbCA9IHJlcXVpcmUoJy4uL3NlcnZpY2VzL1V0aWwnKTtcclxuXHJcbnZhciBBdXRvQ29tcGxldGUgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XHJcbiAgICBkaXNwbGF5TmFtZTogJ0F1dG9Db21wbGV0ZScsXHJcbiAgICBwcm9wVHlwZXM6IHtcclxuICAgICAgICBpZDogUHJvcFR5cGVzLnN0cmluZyxcclxuICAgICAgICBuYW1lOiBQcm9wVHlwZXMuc3RyaW5nLFxyXG4gICAgICAgIGhvc3Q6IFByb3BUeXBlcy5zdHJpbmcsIC8vIOyEnOuyhCDsoJXrs7QoQ3Jvc3MgQnJvd3NlciBBY2Nlc3MpXHJcbiAgICAgICAgdXJsOiBQcm9wVHlwZXMuc3RyaW5nLFxyXG4gICAgICAgIG1ldGhvZDogUHJvcFR5cGVzLnN0cmluZyxcclxuICAgICAgICBkYXRhOiBQcm9wVHlwZXMub2JqZWN0LFxyXG4gICAgICAgIHBsYWNlaG9sZGVyOiBQcm9wVHlwZXMuc3RyaW5nLFxyXG4gICAgICAgIGRhdGFTb3VyY2U6IFByb3BUeXBlcy5vbmVPZlR5cGUoW1xyXG4gICAgICAgICAgICBQcm9wVHlwZXMuYXJyYXksXHJcbiAgICAgICAgICAgIFByb3BUeXBlcy5vYmplY3RcclxuICAgICAgICBdKSxcclxuICAgICAgICB0ZW1wbGF0ZTogUHJvcFR5cGVzLnN0cmluZyxcclxuICAgICAgICBmaWx0ZXI6IFByb3BUeXBlcy5zdHJpbmcsXHJcbiAgICAgICAgc2VwYXJhdG9yOiBQcm9wVHlwZXMuc3RyaW5nLFxyXG4gICAgICAgIG1pbkxlbmd0aDogUHJvcFR5cGVzLm51bWJlcixcclxuICAgICAgICBkYXRhVGV4dEZpZWxkOiBQcm9wVHlwZXMuc3RyaW5nLFxyXG4gICAgICAgIHBhcmFtZXRlck1hcEZpZWxkOiBQcm9wVHlwZXMub2JqZWN0ICAvLyBQYXJhbWV0ZXIgQ29udHJvbCDqsJ3ssrQo7ZWE7YSw7LKY66asKVxyXG4gICAgfSxcclxuICAgIGlkOiAnJyxcclxuICAgICRhdXRvQ29tcGxldGU6IHVuZGVmaW5lZCxcclxuXHRnZXREZWZhdWx0UHJvcHM6IGZ1bmN0aW9uKCkge1xyXG5cdFx0Ly8g7YG0656Y7Iqk6rCAIOyDneyEseuQoCDrlYwg7ZWc67KIIO2YuOy2nOuQmOqzoCDsupDsi5zrkJzri6QuXHJcblx0XHQvLyDrtoDrqqgg7Lu07Y+s64SM7Yq47JeQ7IScIHByb3DsnbQg64SY7Ja07Jik7KeAIOyViuydgCDqsr3smrAgKGluIOyXsOyCsOyekOuhnCDtmZXsnbgpIOunpO2VkeydmCDqsJLsnbQgdGhpcy5wcm9wc+yXkCDshKTsoJXrkJzri6QuXHJcbiAgICAgICAgcmV0dXJuIHttZXRob2Q6ICdQT1NUJywgbGlzdEZpZWxkOiAncmVzdWx0VmFsdWUubGlzdCcsIHRvdGFsRmllbGQ6ICdyZXN1bHRWYWx1ZS50b3RhbENvdW50JywgcGxhY2Vob2xkZXI6ICRwc19sb2NhbGUuYXV0b0NvbXBsZXRlLCBmaWx0ZXI6IFwic3RhcnRzd2l0aFwiLCBzZXBhcmF0b3I6IFwiLCBcIiwgdGVtcGxhdGU6IG51bGwsIGRhdGFUZXh0RmllbGQ6IG51bGwsIG1pbkxlbmd0aDogMX07XHJcblx0fSxcclxuICAgIGNvbXBvbmVudFdpbGxNb3VudDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgLy8vIOy1nOy0iCDroIzrjZTrp4HsnbQg7J287Ja064KY6riwIOyngeyghCjtlZzrsogg7Zi47LacKVxyXG4gICAgICAgIGxldCBpZCA9IHRoaXMucHJvcHMuaWQ7XHJcbiAgICAgICAgaWYodHlwZW9mIGlkID09PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgICAgICBpZCA9IFV0aWwuZ2V0VVVJRCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmlkID0gaWQ7XHJcbiAgICB9LFxyXG4gICAgZ2V0RGF0YVNvdXJjZTogZnVuY3Rpb24ocHJvcHMpIHtcclxuICAgICAgICBjb25zdCB7aG9zdCwgdXJsLCBtZXRob2QsIGRhdGEsIGxpc3RGaWVsZCwgdG90YWxGaWVsZCwgcGFyYW1ldGVyTWFwRmllbGR9ID0gcHJvcHM7XHJcblxyXG4gICAgICAgIGxldCBkYXRhU291cmNlID0gbmV3IGtlbmRvLmRhdGEuRGF0YVNvdXJjZSh7XHJcbiAgICAgICAgICAgIHRyYW5zcG9ydDoge1xyXG4gICAgICAgICAgICAgICAgcmVhZDoge1xyXG4gICAgICAgICAgICAgICAgICAgIHVybDogKGhvc3QgJiYgaG9zdCAhPT0gbnVsbCAmJiBob3N0Lmxlbmd0aCA+IDApID8gaG9zdCArIHVybCA6IHVybCxcclxuICAgICAgICAgICAgICAgICAgICB0eXBlOiBtZXRob2QsXHJcbiAgICAgICAgICAgICAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcclxuICAgICAgICAgICAgICAgICAgICBkYXRhOiBkYXRhLCAgICAgIC8vIHNlYXJjaCAoQFJlcXVlc3RCb2R5IEdyaWRQYXJhbSBncmlkUGFyYW0g66GcIOuwm+uKlOuLpC4pXHJcbiAgICAgICAgICAgICAgICAgICAgY29udGVudFR5cGU6ICdhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04J1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHBhcmFtZXRlck1hcDogZnVuY3Rpb24oZGF0YSwgdHlwZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKHR5cGUgPT0gXCJyZWFkXCIgJiYgcGFyYW1ldGVyTWFwRmllbGQgIT09IG51bGwpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBGaWx0ZXIgQXJyYXkgPT4gSnNvbiBPYmplY3QgQ29weVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZihwYXJhbWV0ZXJNYXBGaWVsZC5maWx0ZXJzVG9Kc29uICYmIGRhdGEuZmlsdGVyICYmIGRhdGEuZmlsdGVyLmZpbHRlcnMpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGZpbHRlcnMgPSBkYXRhLmZpbHRlci5maWx0ZXJzO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsdGVycy5tYXAoKGZpbHRlcikgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFbcGFyYW1ldGVyTWFwRmllbGQuc2VhcmNoRmllbGRdID0gZmlsdGVyLnZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBzY2hlbWE6IHtcclxuICAgICAgICAgICAgICAgIC8vIHJldHVybmVkIGluIHRoZSBcImxpc3RGaWVsZFwiIGZpZWxkIG9mIHRoZSByZXNwb25zZVxyXG4gICAgICAgICAgICAgICAgZGF0YTogZnVuY3Rpb24ocmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgYXJyID0gW10sIGdyaWRMaXN0ID0gcmVzcG9uc2U7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmKGxpc3RGaWVsZCAmJiBsaXN0RmllbGQubGVuZ3RoID4gMCAmJiBsaXN0RmllbGQgIT0gJ251bGwnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFyciA9IGxpc3RGaWVsZC5zcGxpdCgnLicpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBmb3IodmFyIGkgaW4gYXJyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coYXJyW2ldKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYoIWdyaWRMaXN0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBncmlkTGlzdCA9IFtdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgZ3JpZExpc3QgPSBncmlkTGlzdFthcnJbaV1dO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZ3JpZExpc3Q7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgLy8gcmV0dXJuZWQgaW4gdGhlIFwidG90YWxGaWVsZFwiIGZpZWxkIG9mIHRoZSByZXNwb25zZVxyXG4gICAgICAgICAgICAgICAgdG90YWw6IGZ1bmN0aW9uKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhyZXNwb25zZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGFyciA9IFtdLCB0b3RhbCA9IHJlc3BvbnNlO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKHRvdGFsRmllbGQgJiYgdG90YWxGaWVsZC5sZW5ndGggPiAwICYmIHRvdGFsRmllbGQgIT0gJ251bGwnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFyciA9IHRvdGFsRmllbGQuc3BsaXQoJy4nKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yKHZhciBpIGluIGFycikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKGFycltpXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKCF0b3RhbCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdG90YWwgPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgdG90YWwgPSB0b3RhbFthcnJbaV1dO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdG90YWw7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHNlcnZlckZpbHRlcmluZzogdHJ1ZVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiBkYXRhU291cmNlO1xyXG4gICAgfSxcclxuICAgIGdldE9wdGlvbnM6IGZ1bmN0aW9uKHByb3BzKSB7XHJcbiAgICAgICAgY29uc3Qge3BsYWNlaG9sZGVyLCB0ZW1wbGF0ZSwgZGF0YVRleHRGaWVsZCwgbWluTGVuZ3RoLCBzZXBhcmF0b3J9ID0gcHJvcHM7XHJcbiAgICAgICAgdmFyIGRhdGFTb3VyY2UgPSB0aGlzLmdldERhdGFTb3VyY2UocHJvcHMpO1xyXG5cclxuICAgICAgICB2YXIgb3B0aW9ucyA9IHtcclxuICAgICAgICAgICAgcGxhY2Vob2xkZXI6IHBsYWNlaG9sZGVyLFxyXG4gICAgICAgICAgICB0ZW1wbGF0ZTogdGVtcGxhdGUsXHJcbiAgICAgICAgICAgIGRhdGFTb3VyY2U6IGRhdGFTb3VyY2UsXHJcbiAgICAgICAgICAgIGRhdGFUZXh0RmllbGQ6IGRhdGFUZXh0RmllbGQsXHJcbiAgICAgICAgICAgIG1pbkxlbmd0aDogbWluTGVuZ3RoLFxyXG4gICAgICAgICAgICBzZXBhcmF0b3I6IHNlcGFyYXRvclxyXG4gICAgICAgIH07XHJcbiAgICAgICAgcmV0dXJuIG9wdGlvbnM7XHJcbiAgICB9LFxyXG4gICAgY29tcG9uZW50RGlkTW91bnQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIC8vIOy1nOy0iCDroIzrjZTrp4HsnbQg7J287Ja064KcIOuLpOydjCjtlZzrsogg7Zi47LacKVxyXG4gICAgICAgIHRoaXMuJGF1dG9Db21wbGV0ZSA9ICQoJyMnK3RoaXMuaWQpO1xyXG4gICAgICAgIC8vY29uc29sZS5sb2codGhpcy5nZXRPcHRpb25zKHRoaXMucHJvcHMpKTtcclxuICAgICAgICB0aGlzLmF1dG9Db21wbGV0ZSA9IHRoaXMuJGF1dG9Db21wbGV0ZS5rZW5kb0F1dG9Db21wbGV0ZSh0aGlzLmdldE9wdGlvbnModGhpcy5wcm9wcykpO1xyXG4gICAgfSxcclxuICAgIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHM6IGZ1bmN0aW9uKG5leHRQcm9wcykge1xyXG5cclxuICAgIH0sXHJcbiAgICByZW5kZXI6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIC8vIO2VhOyImCDtla3rqqlcclxuICAgICAgICB2YXIgaW5wdXRTdHlsZSA9IHtcclxuICAgICAgICAgICAgd2lkdGg6IFwiMTAwJVwiXHJcbiAgICAgICAgfTtcclxuICAgICAgICBjb25zdCB7IG5hbWUsIGNsYXNzTmFtZSB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICA8aW5wdXQgaWQ9e3RoaXMuaWR9IG5hbWU9e25hbWV9IGNsYXNzTmFtZT17Y2xhc3NOYW1lcyhjbGFzc05hbWUpfSBzdHlsZT17aW5wdXRTdHlsZX0gLz5cclxuICAgICAgICApO1xyXG4gICAgfVxyXG59KTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQXV0b0NvbXBsZXRlO1xyXG4iLCIvKipcbiAqIERhdGVQaWNrZXIgY29tcG9uZW50XG4gKlxuICogdmVyc2lvbiA8dHQ+JCBWZXJzaW9uOiAxLjAgJDwvdHQ+IGRhdGU6MjAxNi8wNi8wNVxuICogYXV0aG9yIDxhIGhyZWY9XCJtYWlsdG86aHJhaG5AbmtpYS5jby5rclwiPkFobiBIeXVuZy1SbzwvYT5cbiAqXG4gKiBleGFtcGxlOlxuICogPFB1Zi5EYXRlUGlja2VyIG9wdGlvbnM9e29wdGlvbnN9IC8+XG4gKlxuICogS2VuZG8gRGF0ZVBpY2tlciDrnbzsnbTruIzrn6zrpqzsl5Ag7KKF7IaN7KCB7J2064ukLlxuICovXG4ndXNlIHN0cmljdCc7XG5cbnZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG52YXIgUHJvcFR5cGVzID0gcmVxdWlyZSgncmVhY3QnKS5Qcm9wVHlwZXM7XG52YXIgY2xhc3NOYW1lcyA9IHJlcXVpcmUoJ2NsYXNzbmFtZXMnKTtcblxudmFyIFV0aWwgPSByZXF1aXJlKCcuLi9zZXJ2aWNlcy9VdGlsJyk7XG52YXIgRGF0ZVV0aWwgPSByZXF1aXJlKCcuLi9zZXJ2aWNlcy9EYXRlVXRpbCcpO1xuXG52YXIgRGF0ZVBpY2tlciA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgICBkaXNwbGF5TmFtZTogJ0RhdGVQaWNrZXInLFxuICAgIHByb3BUeXBlczoge1xuICAgICAgICBpZDogUHJvcFR5cGVzLnN0cmluZyxcbiAgICAgICAgY2xhc3NOYW1lOiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgICAgICBuYW1lOiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgICAgICBkYXRlOiBQcm9wVHlwZXMub25lT2ZUeXBlKFtcbiAgICAgICAgICAgIFByb3BUeXBlcy5zdHJpbmcsICAgICAgICAgICAgICAgLy8gWVlZWS1NTS1ERCBISDptbTpzcyBmb3JtYXTsnZggc3RyaW5nXG4gICAgICAgICAgICBQcm9wVHlwZXMub2JqZWN0ICAgICAgICAgICAgICAgIC8vIERhdGVcbiAgICAgICAgXSksXG4gICAgICAgIG1pbjogUHJvcFR5cGVzLm9uZU9mVHlwZShbXG4gICAgICAgICAgICBQcm9wVHlwZXMuc3RyaW5nLCAgICAgICAgICAgICAgIC8vIFlZWVktTU0tREQgSEg6bW06c3MgZm9ybWF07J2YIHN0cmluZ1xuICAgICAgICAgICAgUHJvcFR5cGVzLm9iamVjdCAgICAgICAgICAgICAgICAvLyBEYXRlXG4gICAgICAgIF0pLFxuICAgICAgICBtYXg6IFByb3BUeXBlcy5vbmVPZlR5cGUoW1xuICAgICAgICAgICAgUHJvcFR5cGVzLnN0cmluZywgICAgICAgICAgICAgICAvLyBZWVlZLU1NLUREIEhIOm1tOnNzIGZvcm1hdOydmCBzdHJpbmdcbiAgICAgICAgICAgIFByb3BUeXBlcy5vYmplY3QgICAgICAgICAgICAgICAgLy8gRGF0ZVxuICAgICAgICBdKSxcbiAgICAgICAgdGltZVBpY2tlcjogUHJvcFR5cGVzLmJvb2wsXG4gICAgICAgIGludGVydmFsOiBQcm9wVHlwZXMubnVtYmVyLFxuICAgICAgICB3aWR0aDogUHJvcFR5cGVzLm9uZU9mVHlwZShbXG4gICAgICAgICAgICBQcm9wVHlwZXMuc3RyaW5nLFxuICAgICAgICAgICAgUHJvcFR5cGVzLm51bWJlclxuICAgICAgICBdKSxcbiAgICAgICAgZGlzYWJsZWQ6IFByb3BUeXBlcy5ib29sLFxuICAgICAgICBvbkNoYW5nZTogUHJvcFR5cGVzLmZ1bmMsXG4gICAgICAgIG9uQ2xvc2U6IFByb3BUeXBlcy5mdW5jLFxuICAgICAgICBvbk9wZW46IFByb3BUeXBlcy5mdW5jLFxuICAgICAgICBpbml0OiBQcm9wVHlwZXMuZnVuY1xuICAgIH0sXG4gICAgaWQ6ICcnLFxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBhcGlcbiAgICBvcGVuOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5kYXRlUGlja2VyLm9wZW4oKTtcbiAgICB9LFxuICAgIGNsb3NlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5kYXRlUGlja2VyLmNsb3NlKCk7XG4gICAgfSxcbiAgICByZWFkb25seTogZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMuZGF0ZVBpY2tlci5yZWFkb25seSgpO1xuICAgIH0sXG4gICAgZ2V0RGF0ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBkYXRlID0gdGhpcy5kYXRlUGlja2VyLnZhbHVlKCk7IC8vIERhdGUg6rCd7LK0IOumrO2EtO2VqFxuICAgICAgICAvL2NvbnNvbGUubG9nKGRhdGUpO1xuICAgICAgICAvL2NvbnNvbGUubG9nKHR5cGVvZiBkYXRlKTtcbiAgICAgICAgcmV0dXJuIERhdGVVdGlsLmdldERhdGVUb1N0cmluZyhkYXRlKTsgICAgLy8gWVlZWS1NTS1ERCBISDptbTpzcyBmb3JtYXTsnZggc3RyaW5nXG4gICAgfSxcbiAgICBzZXREYXRlOiBmdW5jdGlvbihkYXRlKSB7XG4gICAgICAgIC8qXG4gICAgICAgIGlmKHR5cGVvZiBkYXRlID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgdGhpcy5kYXRlUGlja2VyLnZhbHVlKG5ldyBEYXRlKCkpO1xuICAgICAgICB9ZWxzZSBpZih0eXBlb2YgZGF0ZSA9PT0gJ3N0cmluZycgfHwgdHlwZW9mIGRhdGUuZ2V0TW9udGggPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIC8vIFlZWVktTU0tREQgSEg6bW06c3MgZm9ybWF07J2YIHN0cmluZ1xuICAgICAgICAgICAgdGhpcy5kYXRlUGlja2VyLnZhbHVlKGRhdGUpO1xuICAgICAgICB9XG4gICAgICAgICovXG4gICAgICAgIC8vIFlZWVktTU0tREQgSEg6bW06c3MgZm9ybWF07J2YIHN0cmluZ1xuICAgICAgICBpZih0eXBlb2YgZGF0ZSA9PT0gJ3N0cmluZycgfHwgdHlwZW9mIGRhdGUuZ2V0TW9udGggPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIHRoaXMuZGF0ZVBpY2tlci52YWx1ZShkYXRlKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgZW5hYmxlOiBmdW5jdGlvbihiKSB7XG4gICAgICAgIGlmKHR5cGVvZiBiID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgYiA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5kYXRlUGlja2VyLmVuYWJsZShiKTtcbiAgICB9LFxuICAgIG1pbjogZnVuY3Rpb24oZGF0ZSkge1xuICAgICAgICBpZih0eXBlb2YgZGF0ZSA9PT0gJ3N0cmluZycgfHwgdHlwZW9mIGRhdGUuZ2V0TW9udGggPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIHRoaXMuZGF0ZVBpY2tlci5taW4oZGF0ZSk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIG1heDogZnVuY3Rpb24oZGF0ZSkge1xuICAgICAgICBpZih0eXBlb2YgZGF0ZSA9PT0gJ3N0cmluZycgfHwgdHlwZW9mIGRhdGUuZ2V0TW9udGggPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIHRoaXMuZGF0ZVBpY2tlci5tYXgoZGF0ZSk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBldmVudFxuICAgIG9uQ2hhbmdlOiBmdW5jdGlvbihlKSB7XG4gICAgICAgIC8vY29uc29sZS5sb2coJ29uQ2hhbmdlJyk7XG4gICAgICAgIGlmKHR5cGVvZiB0aGlzLnByb3BzLm9uQ2hhbmdlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICB2YXIgZGF0ZSA9IHRoaXMuZ2V0RGF0ZSgpO1xuICAgICAgICAgICAgdGhpcy5wcm9wcy5vbkNoYW5nZShkYXRlKTtcblxuICAgICAgICAgICAgLy9ldmVudC5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgb25DbG9zZTogZnVuY3Rpb24oZSkge1xuICAgICAgICAvL2NvbnNvbGUubG9nKCdvbkNsb3NlJyk7XG4gICAgICAgIC8vZS5wcmV2ZW50RGVmYXVsdCgpOyAvL3ByZXZlbnQgcG9wdXAgY2xvc2luZ1xuICAgICAgICBpZih0eXBlb2YgdGhpcy5wcm9wcy5vbkNsb3NlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICB0aGlzLnByb3BzLm9uQ2xvc2UoZSk7XG5cbiAgICAgICAgICAgIC8vZXZlbnQuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIG9uT3BlbjogZnVuY3Rpb24oZSkge1xuICAgICAgICAvL2NvbnNvbGUubG9nKCdvbk9wZW4nKTtcbiAgICAgICAgLy9lLnByZXZlbnREZWZhdWx0KCk7IC8vcHJldmVudCBwb3B1cCBvcGVuaW5nXG4gICAgICAgIGlmKHR5cGVvZiB0aGlzLnByb3BzLm9uT3BlbiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgdGhpcy5wcm9wcy5vbk9wZW4oZSk7XG5cbiAgICAgICAgICAgIC8vZXZlbnQuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvKlxuICAgIHNldFN0YXRlT2JqZWN0OiBmdW5jdGlvbihwcm9wcykge1xuXG4gICAgICAgIGxldCBkaXNhYmxlZCA9IHByb3BzLmRpc2FibGVkO1xuICAgICAgICBpZih0eXBlb2YgZGlzYWJsZWQgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICBkaXNhYmxlZCA9IGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGRpc2FibGVkOiBkaXNhYmxlZFxuICAgICAgICB9O1xuICAgIH0sXG4gICAgKi9cbiAgICBnZXRUaW1lT3B0aW9uczogZnVuY3Rpb24oKSB7XG4gICAgICAgIGNvbnN0IHtpbnRlcnZhbH0gPSB0aGlzLnByb3BzO1xuXG4gICAgICAgIHZhciBpbnRlcnZhbFZhbHVlO1xuICAgICAgICBpZih0eXBlb2YgaW50ZXJ2YWwgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICBpbnRlcnZhbFZhbHVlID0gNTtcbiAgICAgICAgfWVsc2Uge1xuICAgICAgICAgICAgaW50ZXJ2YWxWYWx1ZSA9IGludGVydmFsO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHRpbWVGb3JtYXQ6ICdISDptbScsXG4gICAgICAgICAgICBpbnRlcnZhbDogaW50ZXJ2YWxWYWx1ZVxuICAgICAgICB9XG4gICAgfSxcbiAgICBnZXRPcHRpb25zOiBmdW5jdGlvbigpIHtcbiAgICAgICAgY29uc3Qge2RhdGUsIHRpbWVQaWNrZXIsIG1pbiwgbWF4fSA9IHRoaXMucHJvcHM7XG5cbiAgICAgICAgdmFyIGRhdGVWYWx1ZTtcbiAgICAgICAgaWYodHlwZW9mIGRhdGUgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICBkYXRlVmFsdWUgPSBuZXcgRGF0ZSgpO1xuICAgICAgICB9ZWxzZSBpZih0eXBlb2YgZGF0ZSA9PT0gJ3N0cmluZycgfHwgdHlwZW9mIGRhdGUuZ2V0TW9udGggPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGRhdGVWYWx1ZSA9IGRhdGU7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgZm9ybWF0ID0gJ3l5eXktTU0tZGQnLFxuICAgICAgICAgICAgdGltZU9wdGlvbnM7XG4gICAgICAgIGlmKHRpbWVQaWNrZXIgPT09IHRydWUpIHtcbiAgICAgICAgICAgIGZvcm1hdCA9ICd5eXl5LU1NLWRkIEhIOm1tJztcbiAgICAgICAgICAgIHRpbWVPcHRpb25zID0gdGhpcy5nZXRUaW1lT3B0aW9ucygpO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIG9wdGlvbnMgPSB7XG4gICAgICAgICAgICB2YWx1ZTogZGF0ZVZhbHVlLFxuICAgICAgICAgICAgZm9ybWF0OiBmb3JtYXQsXG4gICAgICAgICAgICBjdWx0dXJlOiAna28tS1InLCAgICAgICAvLyBodHRwOi8vZG9jcy50ZWxlcmlrLmNvbS9rZW5kby11aS9mcmFtZXdvcmsvZ2xvYmFsaXphdGlvbi9vdmVydmlld1xuICAgICAgICAgICAgY2hhbmdlOiB0aGlzLm9uQ2hhbmdlLFxuICAgICAgICAgICAgY2xvc2U6IHRoaXMub25DbG9zZSxcbiAgICAgICAgICAgIG9wZW46IHRoaXMub25PcGVuXG4gICAgICAgIH07XG5cbiAgICAgICAgJC5leHRlbmQob3B0aW9ucywgdGltZU9wdGlvbnMpO1xuXG4gICAgICAgIC8vIG1pblxuICAgICAgICBpZih0eXBlb2YgbWluICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgJC5leHRlbmQob3B0aW9ucywge21pbjogbWlufSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBtYXhcbiAgICAgICAgaWYodHlwZW9mIG1heCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICQuZXh0ZW5kKG9wdGlvbnMsIHttYXg6IG1heH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG9wdGlvbnM7XG4gICAgfSxcbiAgICAvKlxuICAgIGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24oKSB7XG5cdFx0Ly8g7Lu07Y+s64SM7Yq46rCAIOuniOyatO2KuOuQmOq4sCDsoIQgKO2VnOuyiCDtmLjstpwpIC8g66as7YS06rCS7J2AIHRoaXMuc3RhdGXsnZgg7LSI6riw6rCS7Jy866GcIOyCrOyaqVxuICAgICAgICByZXR1cm4gdGhpcy5zZXRTdGF0ZU9iamVjdCh0aGlzLnByb3BzKTtcbiAgICB9LFxuICAgICovXG4gICAgY29tcG9uZW50V2lsbE1vdW50OiBmdW5jdGlvbigpIHtcbiAgICAgICAgLy8g7LWc7LSIIOugjOuNlOungeydtCDsnbzslrTrgpjquLAg7KeB7KCEKO2VnOuyiCDtmLjstpwpXG4gICAgICAgIGxldCBpZCA9IHRoaXMucHJvcHMuaWQ7XG4gICAgICAgIGlmKHR5cGVvZiBpZCA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIGlkID0gVXRpbC5nZXRVVUlEKCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmlkID0gaWQ7XG4gICAgfSxcbiAgICBjb21wb25lbnREaWRNb3VudDogZnVuY3Rpb24oKSB7XG4gICAgICAgIC8vIOy1nOy0iCDroIzrjZTrp4HsnbQg7J287Ja064KcIOuLpOydjCjtlZzrsogg7Zi47LacKVxuICAgICAgICB0aGlzLiRkYXRlUGlja2VyID0gJCgnIycrdGhpcy5pZCk7XG5cbiAgICAgICAgaWYodGhpcy5wcm9wcy50aW1lUGlja2VyID09PSB0cnVlKSB7XG4gICAgICAgICAgICB0aGlzLmRhdGVQaWNrZXIgPSB0aGlzLiRkYXRlUGlja2VyLmtlbmRvRGF0ZVRpbWVQaWNrZXIodGhpcy5nZXRPcHRpb25zKCkpLmRhdGEoJ2tlbmRvRGF0ZVRpbWVQaWNrZXInKTtcbiAgICAgICAgfWVsc2Uge1xuICAgICAgICAgICAgdGhpcy5kYXRlUGlja2VyID0gdGhpcy4kZGF0ZVBpY2tlci5rZW5kb0RhdGVQaWNrZXIodGhpcy5nZXRPcHRpb25zKCkpLmRhdGEoJ2tlbmRvRGF0ZVBpY2tlcicpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYodGhpcy5wcm9wcy5kaXNhYmxlZCA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgdGhpcy5lbmFibGUoZmFsc2UpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYodHlwZW9mIHRoaXMucHJvcHMuaW5pdCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgdmFyIGRhdGEgPSB7fTtcbiAgICAgICAgICAgIGRhdGEuJGRhdGVQaWNrZXIgPSB0aGlzLiRkYXRlUGlja2VyO1xuICAgICAgICAgICAgZGF0YS5kYXRlUGlja2VyID0gdGhpcy5kYXRlUGlja2VyO1xuICAgICAgICAgICAgdGhpcy5wcm9wcy5pbml0KGRhdGEpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzOiBmdW5jdGlvbihuZXh0UHJvcHMpIHtcbiAgICAgICAgLy8g7Lu07Y+s64SM7Yq46rCAIOyDiOuhnOyatCBwcm9wc+ulvCDrsJvsnYQg65WMIO2YuOy2nCjstZzstIgg66CM642U66eBIOyLnOyXkOuKlCDtmLjstpzrkJjsp4Ag7JWK7J2MKVxuICAgICAgICAvL3RoaXMuc2V0U3RhdGUodGhpcy5zZXRTdGF0ZU9iamVjdChuZXh0UHJvcHMpKTtcbiAgICAgICAgdGhpcy5zZXREYXRlKG5leHRQcm9wcy5kYXRlKTtcbiAgICAgICAgdGhpcy5lbmFibGUoIW5leHRQcm9wcy5kaXNhYmxlZCk7XG4gICAgfSxcbiAgICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgICAvLyDtlYTsiJgg7ZWt66qpXG4gICAgICAgIGNvbnN0IHtjbGFzc05hbWUsIG5hbWUsIHdpZHRofSA9IHRoaXMucHJvcHM7XG5cbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxpbnB1dCBpZD17dGhpcy5pZH0gY2xhc3NOYW1lPXtjbGFzc05hbWVzKGNsYXNzTmFtZSl9IG5hbWU9e25hbWV9IHN0eWxlPXt7d2lkdGg6IHdpZHRofX0gLz5cbiAgICAgICAgKTtcbiAgICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBEYXRlUGlja2VyOyIsIi8qKlxuICogRGF0ZVJhbmdlUGlja2VyIGNvbXBvbmVudFxuICpcbiAqIHZlcnNpb24gPHR0PiQgVmVyc2lvbjogMS4wICQ8L3R0PiBkYXRlOjIwMTYvMDYvMDVcbiAqIGF1dGhvciA8YSBocmVmPVwibWFpbHRvOmhyYWhuQG5raWEuY28ua3JcIj5BaG4gSHl1bmctUm88L2E+XG4gKlxuICogZXhhbXBsZTpcbiAqIDxQdWYuRGF0ZVJhbmdlUGlja2VyIG9wdGlvbnM9e29wdGlvbnN9IC8+XG4gKlxuICogS2VuZG8gRGF0ZVBpY2tlciDrnbzsnbTruIzrn6zrpqzsl5Ag7KKF7IaN7KCB7J2064ukLlxuICovXG4ndXNlIHN0cmljdCc7XG5cbnZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG52YXIgUHJvcFR5cGVzID0gcmVxdWlyZSgncmVhY3QnKS5Qcm9wVHlwZXM7XG52YXIgY2xhc3NOYW1lcyA9IHJlcXVpcmUoJ2NsYXNzbmFtZXMnKTtcblxudmFyIFV0aWwgPSByZXF1aXJlKCcuLi9zZXJ2aWNlcy9VdGlsJyk7XG52YXIgRGF0ZVV0aWwgPSByZXF1aXJlKCcuLi9zZXJ2aWNlcy9EYXRlVXRpbCcpO1xuXG52YXIgRGF0ZVJhbmdlUGlja2VyID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICAgIGRpc3BsYXlOYW1lOiAnRGF0ZVJhbmdlUGlja2VyJyxcbiAgICBwcm9wVHlwZXM6IHtcbiAgICAgICAgaWQ6IFByb3BUeXBlcy5zdHJpbmcsXG4gICAgICAgIGNsYXNzTmFtZTogUHJvcFR5cGVzLnN0cmluZyxcbiAgICAgICAgc3RhcnROYW1lOiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgICAgICBlbmROYW1lOiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgICAgICBzdGFydERhdGU6IFByb3BUeXBlcy5vbmVPZlR5cGUoW1xuICAgICAgICAgICAgUHJvcFR5cGVzLnN0cmluZywgICAgICAgICAgICAgICAvLyBZWVlZLU1NLUREIEhIOm1tOnNzIGZvcm1hdOydmCBzdHJpbmdcbiAgICAgICAgICAgIFByb3BUeXBlcy5vYmplY3QgICAgICAgICAgICAgICAgLy8gRGF0ZVxuICAgICAgICBdKSxcbiAgICAgICAgZW5kRGF0ZTogUHJvcFR5cGVzLm9uZU9mVHlwZShbXG4gICAgICAgICAgICBQcm9wVHlwZXMuc3RyaW5nLCAgICAgICAgICAgICAgIC8vIFlZWVktTU0tREQgSEg6bW06c3MgZm9ybWF07J2YIHN0cmluZ1xuICAgICAgICAgICAgUHJvcFR5cGVzLm9iamVjdCAgICAgICAgICAgICAgICAvLyBEYXRlXG4gICAgICAgIF0pLFxuICAgICAgICBkaXNhYmxlZDogUHJvcFR5cGVzLmJvb2wsXG4gICAgICAgIHRpbWVQaWNrZXI6IFByb3BUeXBlcy5ib29sLFxuICAgICAgICBvbkNoYW5nZTogUHJvcFR5cGVzLmZ1bmMsXG4gICAgICAgIGluaXQ6IFByb3BUeXBlcy5mdW5jXG4gICAgfSxcbiAgICBpZDogJycsXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIGFwaVxuICAgIGdldFN0YXJ0RGF0ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBkYXRlID0gdGhpcy5zdGFydFBpY2tlci52YWx1ZSgpOyAgICAgICAgLy8gRGF0ZSDqsJ3ssrQg66as7YS07ZWoXG4gICAgICAgIC8vY29uc29sZS5sb2coZGF0ZSk7XG4gICAgICAgIC8vY29uc29sZS5sb2codHlwZW9mIGRhdGUpO1xuICAgICAgICByZXR1cm4gRGF0ZVV0aWwuZ2V0RGF0ZVRvU3RyaW5nKGRhdGUpOyAgICAgIC8vIFlZWVktTU0tREQgSEg6bW06c3MgZm9ybWF07J2YIHN0cmluZ1xuICAgIH0sXG4gICAgZ2V0RW5kRGF0ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBkYXRlID0gdGhpcy5lbmRQaWNrZXIudmFsdWUoKTsgICAgICAgICAgLy8gRGF0ZSDqsJ3ssrQg66as7YS07ZWoXG4gICAgICAgIHJldHVybiBEYXRlVXRpbC5nZXREYXRlVG9TdHJpbmcoZGF0ZSk7ICAgICAgLy8gWVlZWS1NTS1ERCBISDptbTpzcyBmb3JtYXTsnZggc3RyaW5nXG4gICAgfSxcbiAgICBzZXRTdGFydERhdGU6IGZ1bmN0aW9uKGRhdGUpIHtcbiAgICAgICAgLy8gWVlZWS1NTS1ERCBISDptbTpzcyBmb3JtYXTsnZggc3RyaW5nXG4gICAgICAgIGlmKHR5cGVvZiBkYXRlID09PSAnc3RyaW5nJyB8fCB0eXBlb2YgZGF0ZS5nZXRNb250aCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgdGhpcy5zdGFydFBpY2tlci52YWx1ZShkYXRlKTtcbiAgICAgICAgICAgIHRoaXMub25TdGFydENoYW5nZShkYXRlKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgc2V0RW5kRGF0ZTogZnVuY3Rpb24oZGF0ZSkge1xuICAgICAgICAvLyBZWVlZLU1NLUREIEhIOm1tOnNzIGZvcm1hdOydmCBzdHJpbmdcbiAgICAgICAgaWYodHlwZW9mIGRhdGUgPT09ICdzdHJpbmcnIHx8IHR5cGVvZiBkYXRlLmdldE1vbnRoID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICB0aGlzLmVuZFBpY2tlci52YWx1ZShkYXRlKTtcbiAgICAgICAgICAgIHRoaXMub25FbmRDaGFuZ2UoZGF0ZSk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIGVuYWJsZTogZnVuY3Rpb24oYikge1xuICAgICAgICBpZih0eXBlb2YgYiA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIGIgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuc3RhcnRQaWNrZXIuZW5hYmxlKGIpO1xuICAgICAgICB0aGlzLmVuZFBpY2tlci5lbmFibGUoYik7XG4gICAgfSxcbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgb25TdGFydEluaXQ6IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgdGhpcy5zdGFydFBpY2tlciA9IGRhdGEuZGF0ZVBpY2tlcjtcbiAgICB9LFxuICAgIG9uRW5kSW5pdDogZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICB0aGlzLmVuZFBpY2tlciA9IGRhdGEuZGF0ZVBpY2tlcjtcbiAgICB9LFxuICAgIG9uU3RhcnRDaGFuZ2U6IGZ1bmN0aW9uKGRhdGUpIHtcbiAgICAgICAgdGhpcy5lbmRQaWNrZXIubWluKGRhdGUpO1xuICAgICAgICBpZih0eXBlb2YgdGhpcy5wcm9wcy5vbkNoYW5nZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgdGhpcy5wcm9wcy5vbkNoYW5nZSh0aGlzLmdldFN0YXJ0RGF0ZSgpLCB0aGlzLmdldEVuZERhdGUoKSk7XG4gICAgICAgICAgICAvL2V2ZW50LnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xuICAgICAgICB9XG4gICAgICAgIC8vdmFyIHN0YXJ0RGF0ZSA9IHRoaXMuc3RhcnRQaWNrZXIudmFsdWUoKSxcbiAgICAgICAgLy8gICAgZW5kRGF0ZSA9IHRoaXMuZW5kUGlja2VyLnZhbHVlKCk7XG4gICAgICAgIC8vXG4gICAgICAgIC8vaWYgKHN0YXJ0RGF0ZSkge1xuICAgICAgICAvLyAgICB0aGlzLmVuZFBpY2tlci5taW4oc3RhcnREYXRlKTtcbiAgICAgICAgLy99IGVsc2UgaWYgKGVuZERhdGUpIHtcbiAgICAgICAgLy8gICAgdGhpcy5zdGFydFBpY2tlci5tYXgoZW5kRGF0ZSk7XG4gICAgICAgIC8vfSBlbHNlIHtcbiAgICAgICAgLy8gICAgZW5kRGF0ZSA9IG5ldyBEYXRlKCk7XG4gICAgICAgIC8vICAgIHN0YXJ0Lm1heChlbmREYXRlKTtcbiAgICAgICAgLy8gICAgZW5kLm1pbihlbmREYXRlKTtcbiAgICAgICAgLy99XG4gICAgfSxcbiAgICBvbkVuZENoYW5nZTogZnVuY3Rpb24oZGF0ZSkge1xuICAgICAgICB0aGlzLnN0YXJ0UGlja2VyLm1heChkYXRlKTtcbiAgICAgICAgaWYodHlwZW9mIHRoaXMucHJvcHMub25DaGFuZ2UgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIHRoaXMucHJvcHMub25DaGFuZ2UodGhpcy5nZXRTdGFydERhdGUoKSwgdGhpcy5nZXRFbmREYXRlKCkpO1xuICAgICAgICAgICAgLy9ldmVudC5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgc2V0U3RhdGVPYmplY3Q6IGZ1bmN0aW9uKHByb3BzKSB7XG4gICAgICAgIC8vIHN0YXJ0RGF0ZSDsspjrpqxcbiAgICAgICAgbGV0IHN0YXJ0RGF0ZSA9IHByb3BzLnN0YXJ0RGF0ZTtcblxuICAgICAgICAvLyBlbmREYXRlIOyymOumrFxuICAgICAgICBsZXQgZW5kRGF0ZSA9IHByb3BzLmVuZERhdGU7XG5cbiAgICAgICAgLy8gZGlzYWJsZWQg7LKY66asXG4gICAgICAgIGxldCBkaXNhYmxlZCA9IHByb3BzLmRpc2FibGVkO1xuICAgICAgICBpZih0eXBlb2YgZGlzYWJsZWQgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICBkaXNhYmxlZCA9IGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHN0YXJ0RGF0ZTogc3RhcnREYXRlLFxuICAgICAgICAgICAgZW5kRGF0ZTogZW5kRGF0ZSxcbiAgICAgICAgICAgIGRpc2FibGVkOiBkaXNhYmxlZFxuICAgICAgICB9O1xuICAgIH0sXG4gICAgZ2V0RGVmYXVsdFByb3BzOiBmdW5jdGlvbigpIHtcbiAgICAgICAgLy8g7YG0656Y7Iqk6rCAIOyDneyEseuQoCDrlYwg7ZWc67KIIO2YuOy2nOuQmOqzoCDsupDsi5zrkJzri6QuXG4gICAgICAgIC8vIOu2gOuqqCDsu7Ttj6zrhIztirjsl5DshJwgcHJvcOydtCDrhJjslrTsmKTsp4Ag7JWK7J2AIOqyveyasCAoaW4g7Jew7IKw7J6Q66GcIO2ZleyduCkg66ek7ZWR7J2YIOqwkuydtCB0aGlzLnByb3Bz7JeQIOyEpOygleuQnOuLpC5cbiAgICAgICAgcmV0dXJuIHtzdGFydE5hbWU6ICdzdGFydERhdGUnLCBlbmROYW1lOiAnZW5kRGF0ZSd9O1xuICAgIH0sXG4gICAgZ2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgLy8g7Lu07Y+s64SM7Yq46rCAIOuniOyatO2KuOuQmOq4sCDsoIQgKO2VnOuyiCDtmLjstpwpIC8g66as7YS06rCS7J2AIHRoaXMuc3RhdGXsnZgg7LSI6riw6rCS7Jy866GcIOyCrOyaqVxuICAgICAgICByZXR1cm4gdGhpcy5zZXRTdGF0ZU9iamVjdCh0aGlzLnByb3BzKTtcbiAgICB9LFxuICAgIGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbigpIHtcbiAgICAgICAgLy8g7LWc7LSIIOugjOuNlOungeydtCDsnbzslrTrgpwg64uk7J2MKO2VnOuyiCDtmLjstpwpXG4gICAgICAgIHRoaXMuc3RhcnRQaWNrZXIubWF4KHRoaXMuZW5kUGlja2VyLnZhbHVlKCkpO1xuICAgICAgICB0aGlzLmVuZFBpY2tlci5taW4odGhpcy5zdGFydFBpY2tlci52YWx1ZSgpKTtcblxuICAgICAgICBpZih0eXBlb2YgdGhpcy5wcm9wcy5pbml0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICB2YXIgZGF0YSA9IHt9O1xuICAgICAgICAgICAgZGF0YS5zdGFydFBpY2tlciA9IHRoaXMuc3RhcnRQaWNrZXI7XG4gICAgICAgICAgICBkYXRhLmVuZFBpY2tlciA9IHRoaXMuZW5kUGlja2VyO1xuICAgICAgICAgICAgdGhpcy5wcm9wcy5pbml0KGRhdGEpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzOiBmdW5jdGlvbihuZXh0UHJvcHMpIHtcbiAgICAgICAgLy8g7Lu07Y+s64SM7Yq46rCAIOyDiOuhnOyatCBwcm9wc+ulvCDrsJvsnYQg65WMIO2YuOy2nCjstZzstIgg66CM642U66eBIOyLnOyXkOuKlCDtmLjstpzrkJjsp4Ag7JWK7J2MKVxuICAgICAgICB0aGlzLnNldFN0YXRlKHRoaXMuc2V0U3RhdGVPYmplY3QobmV4dFByb3BzKSk7XG4gICAgfSxcbiAgICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgICAvLyDtlYTsiJgg7ZWt66qpXG4gICAgICAgIGNvbnN0IHtjbGFzc05hbWUsIHN0YXJ0TmFtZSwgZW5kTmFtZSwgdGltZVBpY2tlcn0gPSB0aGlzLnByb3BzO1xuICAgICAgICBjb25zdCB7c3RhcnREYXRlLCBlbmREYXRlLCBkaXNhYmxlZH0gPSB0aGlzLnN0YXRlO1xuXG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImRhdGVwaWNrZXItZ3JvdXBcIj5cbiAgICAgICAgICAgICAgICA8UHVmLkRhdGVQaWNrZXIgY2xhc3NOYW1lPXtjbGFzc05hbWV9IG5hbWU9e3N0YXJ0TmFtZX0gZGF0ZT17c3RhcnREYXRlfSBpbml0PXt0aGlzLm9uU3RhcnRJbml0fSBvbkNoYW5nZT17dGhpcy5vblN0YXJ0Q2hhbmdlfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aW1lUGlja2VyPXt0aW1lUGlja2VyfSBkaXNhYmxlZD17ZGlzYWJsZWR9IC8+eydcXHUwMEEwJ31cbiAgICAgICAgICAgICAgICA8UHVmLkRhdGVQaWNrZXIgY2xhc3NOYW1lPXtjbGFzc05hbWV9IG5hbWU9e2VuZE5hbWV9IGRhdGU9e2VuZERhdGV9IGluaXQ9e3RoaXMub25FbmRJbml0fSBvbkNoYW5nZT17dGhpcy5vbkVuZENoYW5nZX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGltZVBpY2tlcj17dGltZVBpY2tlcn0gZGlzYWJsZWQ9e2Rpc2FibGVkfSAvPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICk7XG4gICAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gRGF0ZVJhbmdlUGlja2VyOyIsIi8qKlxuICogRHJvcERvd25MaXN0IGNvbXBvbmVudFxuICpcbiAqIHZlcnNpb24gPHR0PiQgVmVyc2lvbjogMS4wICQ8L3R0PiBkYXRlOjIwMTYvMDUvMDNcbiAqIGF1dGhvciA8YSBocmVmPVwibWFpbHRvOmhyYWhuQG5raWEuY28ua3JcIj5BaG4gSHl1bmctUm88L2E+XG4gKlxuICogZXhhbXBsZTpcbiAqIDxQdWYuRHJvcERvd25MaXN0IG9wdGlvbnM9e29wdGlvbnN9IC8+XG4gKlxuICogS2VuZG8gRHJvcERvd25MaXN0IOudvOydtOu4jOufrOumrOyXkCDsooXsho3soIHsnbTri6QuXG4gKi9cbid1c2Ugc3RyaWN0JztcblxudmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcbnZhciBQcm9wVHlwZXMgPSByZXF1aXJlKCdyZWFjdCcpLlByb3BUeXBlcztcbnZhciBjbGFzc05hbWVzID0gcmVxdWlyZSgnY2xhc3NuYW1lcycpO1xuXG52YXIgVXRpbCA9IHJlcXVpcmUoJy4uL3NlcnZpY2VzL1V0aWwnKTtcblxudmFyIERyb3BEb3duTGlzdCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgICBkaXNwbGF5TmFtZTogJ0Ryb3BEb3duTGlzdCcsXG4gICAgcHJvcFR5cGVzOiB7XG4gICAgICAgIGlkOiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgICAgICBjbGFzc05hbWU6IFByb3BUeXBlcy5zdHJpbmcsXG4gICAgICAgIG5hbWU6IFByb3BUeXBlcy5zdHJpbmcsXG4gICAgICAgIHVybDogUHJvcFR5cGVzLnN0cmluZyxcbiAgICAgICAgbWV0aG9kOiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgICAgICB3aWR0aDogUHJvcFR5cGVzLm9uZU9mVHlwZShbXG4gICAgICAgICAgICBQcm9wVHlwZXMuc3RyaW5nLFxuICAgICAgICAgICAgUHJvcFR5cGVzLm51bWJlclxuICAgICAgICBdKSxcbiAgICAgICAgb3B0aW9uTGFiZWw6IFByb3BUeXBlcy5zdHJpbmcsXG4gICAgICAgIGRhdGFUZXh0RmllbGQ6IFByb3BUeXBlcy5zdHJpbmcsXG4gICAgICAgIGRhdGFWYWx1ZUZpZWxkOiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgICAgICBzZWxlY3RlZEl0ZW06IFByb3BUeXBlcy5vYmplY3QsXG4gICAgICAgIHNlbGVjdGVkVmFsdWU6IFByb3BUeXBlcy5vbmVPZlR5cGUoW1xuICAgICAgICAgICAgUHJvcFR5cGVzLnN0cmluZyxcbiAgICAgICAgICAgIFByb3BUeXBlcy5udW1iZXJcbiAgICAgICAgXSksXG4gICAgICAgIHNlbGVjdGVkSW5kZXg6IFByb3BUeXBlcy5udW1iZXIsXG4gICAgICAgIGl0ZW1zOiBQcm9wVHlwZXMuYXJyYXksXG4gICAgICAgIGhlYWRlclRlbXBsYXRlOiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgICAgICB2YWx1ZVRlbXBsYXRlOiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgICAgICB0ZW1wbGF0ZTogUHJvcFR5cGVzLnN0cmluZyxcbiAgICAgICAgZGlzYWJsZWQ6IFByb3BUeXBlcy5ib29sLFxuICAgICAgICBvblNlbGVjdDogUHJvcFR5cGVzLmZ1bmMsXG4gICAgICAgIG9uQ2hhbmdlOiBQcm9wVHlwZXMuZnVuYyxcbiAgICAgICAgb25DbG9zZTogUHJvcFR5cGVzLmZ1bmMsXG4gICAgICAgIG9uT3BlbjogUHJvcFR5cGVzLmZ1bmMsXG4gICAgICAgIG9uRmlsdGVyaW5nOiBQcm9wVHlwZXMuZnVuYyxcbiAgICAgICAgb25EYXRhQm91bmQ6IFByb3BUeXBlcy5mdW5jXG4gICAgfSxcbiAgICBpZDogJycsXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIGFwaVxuICAgIG9wZW46IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLmRyb3Bkb3dubGlzdC5vcGVuKCk7XG4gICAgfSxcbiAgICBjbG9zZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMuZHJvcGRvd25saXN0LmNsb3NlKCk7XG4gICAgfSxcbiAgICBzZWxlY3Q6IGZ1bmN0aW9uKGluZGV4KSB7XG4gICAgICAgIC8vIGluZGV4OiBsaSBqUXVlcnkgfCBOdW1iZXIgfCBGdW5jdGlvblxuICAgICAgICAvLyByZXR1cm4gVGhlIGluZGV4IG9mIHRoZSBzZWxlY3RlZCBpdGVtXG4gICAgICAgIHJldHVybiB0aGlzLmRyb3Bkb3dubGlzdC5zZWxlY3QoaW5kZXgpO1xuICAgIH0sXG4gICAgdmFsdWU6IGZ1bmN0aW9uKHYpIHtcbiAgICAgICAgaWYoYXJndW1lbnRzLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5kcm9wZG93bmxpc3QudmFsdWUoKTtcbiAgICAgICAgfWVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZHJvcGRvd25saXN0LnZhbHVlKHYpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gZXZlbnRcbiAgICBvblNlbGVjdDogZnVuY3Rpb24oZSkge1xuICAgIFx0Ly9jb25zb2xlLmxvZygnb25TZWxlY3QnKTtcbiAgICBcdC8vY29uc29sZS5sb2coZXZlbnQpO1xuICAgICAgICB2YXIgZHJvcGRvd25saXN0ID0gdGhpcy4kZHJvcERvd25MaXN0LmRhdGEoJ2tlbmRvRHJvcERvd25MaXN0JyksXG4gICAgICAgICAgICBkYXRhSXRlbSA9IGRyb3Bkb3dubGlzdC5kYXRhSXRlbShlLml0ZW0pO1xuICAgICAgICAvL2NvbnNvbGUubG9nKGRhdGFJdGVtKTtcbiAgICAgICAgLy9jb25zb2xlLmxvZyhkYXRhSXRlbVt0aGlzLnByb3BzLmRhdGFWYWx1ZUZpZWxkXSk7XG4gICAgICAgIC8vJCgnW25hbWU9JyArIHRoaXMucHJvcHMubmFtZSArICddJykudmFsKGRhdGFJdGVtLnZhbHVlKTtcbiAgICAgICAgLy8kKCdpbnB1dFtuYW1lPWRpc3BsYXlEYXRhXScpLnZhbChkYXRhSXRlbVt0aGlzLnByb3BzLmRhdGFWYWx1ZUZpZWxkXSk7XG4gICAgICAgIC8vdGhpcy4kZHJvcERvd25MaXN0LnZhbChkYXRhSXRlbVt0aGlzLnByb3BzLmRhdGFWYWx1ZUZpZWxkXSk7XG5cbiAgICBcdGlmKHR5cGVvZiB0aGlzLnByb3BzLm9uU2VsZWN0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICB2YXIgc2VsZWN0ZWRJdGVtID0gZGF0YUl0ZW0sXG4gICAgICAgICAgICAgICAgc2VsZWN0ZWRWYWx1ZSA9IGRhdGFJdGVtW3RoaXMucHJvcHMuZGF0YVZhbHVlRmllbGRdO1xuICAgICAgICAgICAgdGhpcy5wcm9wcy5vblNlbGVjdChlLCBzZWxlY3RlZEl0ZW0sIHNlbGVjdGVkVmFsdWUpO1xuXG4gICAgICAgICAgICAvL2Uuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIG9uQ2hhbmdlOiBmdW5jdGlvbihlKSB7XG4gICAgXHQvL2NvbnNvbGUubG9nKCdvbkNoYW5nZScpO1xuICAgIFx0Ly9jb25zb2xlLmxvZyhldmVudCk7XG4gICAgXHRcbiAgICBcdGlmKHR5cGVvZiB0aGlzLnByb3BzLm9uQ2hhbmdlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICB0aGlzLnByb3BzLm9uQ2hhbmdlKGUpO1xuXG4gICAgICAgICAgICAvL2V2ZW50LnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBvbkNsb3NlOiBmdW5jdGlvbihlKSB7XG4gICAgXHQvL2NvbnNvbGUubG9nKCdvbkNsb3NlJyk7XG4gICAgXHQvL2NvbnNvbGUubG9nKGV2ZW50KTtcbiAgICBcdFxuICAgIFx0aWYodHlwZW9mIHRoaXMucHJvcHMub25DbG9zZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgdGhpcy5wcm9wcy5vbkNsb3NlKGUpO1xuXG4gICAgICAgICAgICAvL2V2ZW50LnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBvbk9wZW46IGZ1bmN0aW9uKGUpIHtcbiAgICBcdC8vY29uc29sZS5sb2coJ29uT3BlbicpO1xuICAgIFx0Ly9jb25zb2xlLmxvZyhldmVudCk7XG4gICAgXHRcbiAgICBcdGlmKHR5cGVvZiB0aGlzLnByb3BzLm9uT3BlbiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgdGhpcy5wcm9wcy5vbk9wZW4oZSk7XG5cbiAgICAgICAgICAgIC8vZXZlbnQuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIG9uRmlsdGVyaW5nOiBmdW5jdGlvbihlKSB7XG5cbiAgICAgICAgaWYodHlwZW9mIHRoaXMucHJvcHMub25GaWx0ZXJpbmcgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICB0aGlzLnByb3BzLm9uRmlsdGVyaW5nKGUpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBvbkRhdGFCb3VuZDogZnVuY3Rpb24oZXZlbnQpIHtcbiAgICBcdC8vY29uc29sZS5sb2coJ29uRGF0YUJvdW5kJyk7XG4gICAgXHQvL2NvbnNvbGUubG9nKGV2ZW50KTtcbiAgICBcdFxuICAgIFx0aWYodHlwZW9mIHRoaXMucHJvcHMub25EYXRhQm91bmQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIHRoaXMucHJvcHMub25EYXRhQm91bmQoZXZlbnQpO1xuXG4gICAgICAgICAgICAvL2V2ZW50LnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBnZXRPcHRpb25zOiBmdW5jdGlvbigpIHtcbiAgICAgICAgY29uc3Qge3VybCwgbWV0aG9kLCBpdGVtcywgc2VsZWN0ZWRJbmRleCwgc2VsZWN0ZWRWYWx1ZSwgZGF0YVRleHRGaWVsZCwgZGF0YVZhbHVlRmllbGQsIGhlYWRlclRlbXBsYXRlLCB2YWx1ZVRlbXBsYXRlLCB0ZW1wbGF0ZSB9ID0gdGhpcy5wcm9wcztcblxuICAgICAgICB2YXIgb3B0aW9ucyA9IHtcbiAgICAgICAgICAgIGRhdGFUZXh0RmllbGQ6IGRhdGFUZXh0RmllbGQsXG4gICAgICAgICAgICBkYXRhVmFsdWVGaWVsZDogZGF0YVZhbHVlRmllbGQsXG4gICAgICAgICAgICBkYXRhU291cmNlOiBbXVxuICAgICAgICB9O1xuXG4gICAgICAgIC8vIGRhdGFTb3VyY2VcbiAgICAgICAgLy8gdXJsXG4gICAgICAgIGlmKHR5cGVvZiB1cmwgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAkLmV4dGVuZChvcHRpb25zLCB7IGRhdGFTb3VyY2U6IHtcbiAgICAgICAgICAgICAgICB0cmFuc3BvcnQ6IHtcbiAgICAgICAgICAgICAgICAgICAgcmVhZDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgdXJsOiB1cmwsXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBtZXRob2QsXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IH0pO1xuXG4gICAgICAgIH1lbHNlIGlmKHR5cGVvZiBpdGVtcyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICQuZXh0ZW5kKG9wdGlvbnMsIHsgZGF0YVNvdXJjZTogaXRlbXMgfSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBzZWxlY3RlZEluZGV4XG4gICAgICAgIGlmKHR5cGVvZiBzZWxlY3RlZEluZGV4ICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgJC5leHRlbmQob3B0aW9ucywgeyBpbmRleDogc2VsZWN0ZWRJbmRleCB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHNlbGVjdGVkVmFsdWVcbiAgICAgICAgaWYodHlwZW9mIHNlbGVjdGVkVmFsdWUgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAkLmV4dGVuZChvcHRpb25zLCB7IHZhbHVlOiBzZWxlY3RlZFZhbHVlIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gaGVhZGVyVGVtcGxhdGVcbiAgICAgICAgaWYodHlwZW9mIGhlYWRlclRlbXBsYXRlICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgJC5leHRlbmQob3B0aW9ucywgeyBoZWFkZXJUZW1wbGF0ZTogaGVhZGVyVGVtcGxhdGUgfSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyB2YWx1ZVRlbXBsYXRlXG4gICAgICAgIGlmKHR5cGVvZiB2YWx1ZVRlbXBsYXRlICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgJC5leHRlbmQob3B0aW9ucywgeyB2YWx1ZVRlbXBsYXRlOiB2YWx1ZVRlbXBsYXRlIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gdGVtcGxhdGVcbiAgICAgICAgaWYodHlwZW9mIHRlbXBsYXRlICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgJC5leHRlbmQob3B0aW9ucywgeyB0ZW1wbGF0ZTogdGVtcGxhdGUgfSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gb3B0aW9ucztcbiAgICB9LFxuICAgIGdldERlZmF1bHRQcm9wczogZnVuY3Rpb24oKSB7XG5cdFx0Ly8g7YG0656Y7Iqk6rCAIOyDneyEseuQoCDrlYwg7ZWc67KIIO2YuOy2nOuQmOqzoCDsupDsi5zrkJzri6QuXG5cdFx0Ly8g67aA66qoIOy7tO2PrOuEjO2KuOyXkOyEnCBwcm9w7J20IOuEmOyWtOyYpOyngCDslYrsnYAg6rK97JqwIChpbiDsl7DsgrDsnpDroZwg7ZmV7J24KSDrp6TtlZHsnZgg6rCS7J20IHRoaXMucHJvcHPsl5Ag7ISk7KCV65Cc64ukLlx0XHRcblx0XHRyZXR1cm4ge3dpZHRoOiAnMTAwJScsIGRhdGFUZXh0RmllbGQ6ICd0ZXh0JywgZGF0YVZhbHVlRmllbGQ6ICd2YWx1ZScsIHNlbGVjdGVkSW5kZXg6IDB9O1xuXHR9LFxuICAgIGNvbXBvbmVudFdpbGxNb3VudDogZnVuY3Rpb24oKSB7XG4gICAgICAgIC8vIOy1nOy0iCDroIzrjZTrp4HsnbQg7J287Ja064KY6riwIOyngeyghCjtlZzrsogg7Zi47LacKSAgICAgIFxuICAgICAgICBsZXQgaWQgPSB0aGlzLnByb3BzLmlkO1xuICAgICAgICBpZih0eXBlb2YgaWQgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICBpZCA9IFV0aWwuZ2V0VVVJRCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5pZCA9IGlkO1xuICAgIH0sXG4gICAgY29tcG9uZW50RGlkTW91bnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAvLyDstZzstIgg66CM642U66eB7J20IOydvOyWtOuCnCDri6TsnYwo7ZWc67KIIO2YuOy2nClcbiAgICBcdHRoaXMuJGRyb3BEb3duTGlzdCA9ICQoJyMnK3RoaXMuaWQpO1xuICAgICAgICB0aGlzLmRyb3Bkb3dubGlzdCA9IHRoaXMuJGRyb3BEb3duTGlzdC5rZW5kb0Ryb3BEb3duTGlzdCh0aGlzLmdldE9wdGlvbnMoKSkuZGF0YSgna2VuZG9Ecm9wRG93bkxpc3QnKTtcblxuICAgICAgICAvLyBFdmVudHNcbiAgICAgICAgdGhpcy5kcm9wZG93bmxpc3QuYmluZCgnc2VsZWN0JywgdGhpcy5vblNlbGVjdCk7XG4gICAgICAgIHRoaXMuZHJvcGRvd25saXN0LmJpbmQoJ2NoYW5nZScsIHRoaXMub25DaGFuZ2UpO1xuICAgICAgICB0aGlzLmRyb3Bkb3dubGlzdC5iaW5kKCdvcGVuJywgdGhpcy5vbk9wZW4pO1xuICAgICAgICB0aGlzLmRyb3Bkb3dubGlzdC5iaW5kKCdjbG9zZScsIHRoaXMub25DbG9zZSk7XG4gICAgICAgIHRoaXMuZHJvcGRvd25saXN0LmJpbmQoJ2ZpbHRlcmluZycsIHRoaXMub25GaWx0ZXJpbmcpO1xuICAgICAgICB0aGlzLmRyb3Bkb3dubGlzdC5iaW5kKCdkYXRhQm91bmQnLCB0aGlzLm9uRGF0YUJvdW5kKTtcblxuICAgICAgICAvLyBkcm9wZG93bmxpc3Qg7LSI6riwIOyEoO2DnSAoZ2V0T3B0aW9ucygpIOyXkOyEnCDsspjrpqwpXG4gICAgICAgIC8qXG4gICAgICAgIGlmKHR5cGVvZiB0aGlzLnByb3BzLnNlbGVjdGVkVmFsdWUgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICB0aGlzLmRyb3Bkb3dubGlzdC52YWx1ZSh0aGlzLnByb3BzLnNlbGVjdGVkVmFsdWUpO1xuICAgICAgICB9ZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmRyb3Bkb3dubGlzdC5zZWxlY3QoMCk7XG4gICAgICAgIH1cbiAgICAgICAgKi9cblxuICAgICAgICAvKlxuICAgICAgICBpZih0eXBlb2YgdGhpcy5wcm9wcy5pbml0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICB2YXIgZGF0YSA9IHt9O1xuICAgICAgICAgICAgZGF0YS4kZHJvcERvd25MaXN0ID0gdGhpcy4kZHJvcERvd25MaXN0O1xuICAgICAgICAgICAgZGF0YS5kcm9wZG93bmxpc3QgPSB0aGlzLmRyb3Bkb3dubGlzdDtcbiAgICAgICAgICAgIHRoaXMucHJvcHMuaW5pdChkYXRhKTtcbiAgICAgICAgfVxuICAgICAgICAqL1xuICAgIH0sXG4gICAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wczogZnVuY3Rpb24obmV4dFByb3BzKSB7XG4gICAgICAgIC8vIOy7tO2PrOuEjO2KuOqwgCDsg4jroZzsmrQgcHJvcHPrpbwg67Cb7J2EIOuVjCDtmLjstpwo7LWc7LSIIOugjOuNlOungSDsi5zsl5DripQg7Zi47Lac65CY7KeAIOyViuydjClcbiAgICAgICAgaWYodHlwZW9mIG5leHRQcm9wcy5zZWxlY3RlZFZhbHVlICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgdGhpcy5kcm9wZG93bmxpc3QudmFsdWUobmV4dFByb3BzLnNlbGVjdGVkVmFsdWUpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgICAvLyDtlYTsiJgg7ZWt66qpICAgICAgIFxuICAgICAgICBjb25zdCB7Y2xhc3NOYW1lLCBuYW1lLCB3aWR0aH0gPSB0aGlzLnByb3BzO1xuXG4gICAgICAgIHJldHVybiAoXG4gICAgICAgIFx0PGlucHV0IGlkPXt0aGlzLmlkfSBuYW1lPXtuYW1lfSBzdHlsZT17e3dpZHRoOiB3aWR0aH19IC8+XG4gICAgICAgICk7XG4gICAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gRHJvcERvd25MaXN0OyIsIi8qKlxuICogR3JpZCBjb21wb25lbnRcbiAqXG4gKiB2ZXJzaW9uIDx0dD4kIFZlcnNpb246IDEuMCAkPC90dD4gZGF0ZToyMDE2LzA0LzE3XG4gKiBhdXRob3IgPGEgaHJlZj1cIm1haWx0bzpocmFobkBua2lhLmNvLmtyXCI+QWhuIEh5dW5nLVJvPC9hPlxuICpcbiAqIGV4YW1wbGU6XG4gKiA8UHVmLkdyaWQgb3B0aW9ucz17b3B0aW9uc30gLz5cbiAqXG4gKiBLZW5kbyBHcmlkIOudvOydtOu4jOufrOumrOyXkCDsooXsho3soIHsnbTri6QuXG4gKi9cbid1c2Ugc3RyaWN0JztcblxudmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcbnZhciBQcm9wVHlwZXMgPSByZXF1aXJlKCdyZWFjdCcpLlByb3BUeXBlcztcbnZhciBjbGFzc05hbWVzID0gcmVxdWlyZSgnY2xhc3NuYW1lcycpO1xuXG52YXIgVXRpbCA9IHJlcXVpcmUoJy4uL3NlcnZpY2VzL1V0aWwnKTtcblxudmFyIEdyaWQgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gICAgZGlzcGxheU5hbWU6ICdHcmlkJyxcbiAgICBwcm9wVHlwZXM6IHtcbiAgICAgICAgaWQ6IFByb3BUeXBlcy5zdHJpbmcsXG4gICAgICAgIGNsYXNzTmFtZTogUHJvcFR5cGVzLnN0cmluZyxcbiAgICAgICAgaG9zdDogUHJvcFR5cGVzLnN0cmluZywgLy8g7ISc67KEIOygleuztChDcm9zcyBCcm93c2VyIEFjY2VzcylcbiAgICAgICAgdXJsOiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgICAgICBtZXRob2Q6IFByb3BUeXBlcy5zdHJpbmcsXG4gICAgICAgIGNoZWNrYm94RmllbGQ6IFByb3BUeXBlcy5zdHJpbmcsXG4gICAgICAgIGRhdGE6IFByb3BUeXBlcy5vYmplY3QsXG4gICAgICAgIGNvbHVtbnM6IFByb3BUeXBlcy5hcnJheSxcbiAgICAgICAgc2VsZWN0ZWRJZHM6IFByb3BUeXBlcy5hcnJheSxcbiAgICAgICAgbGlzdEZpZWxkOiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgICAgICB0b3RhbEZpZWxkOiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgICAgICBjaGVja0ZpZWxkOiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgICAgICBvblNlbGVjdFJvdzogUHJvcFR5cGVzLmZ1bmMsXG4gICAgICAgIG9uQ2hhbmdlOiBQcm9wVHlwZXMuZnVuYyxcbiAgICAgICAgcmVzaXphYmxlOiBQcm9wVHlwZXMuYm9vbCxcbiAgICAgICAgZmlsdGVyYWJsZTogUHJvcFR5cGVzLm9uZU9mVHlwZShbXG4gICAgICAgICAgICBQcm9wVHlwZXMuYm9vbCxcbiAgICAgICAgICAgIFByb3BUeXBlcy5vYmplY3RcbiAgICAgICAgXSksXG4gICAgICAgIHNvcnRhYmxlOiBQcm9wVHlwZXMuYm9vbCxcbiAgICAgICAgcGFnZWFibGU6IFByb3BUeXBlcy5vbmVPZlR5cGUoW1xuICAgICAgICAgICAgUHJvcFR5cGVzLmJvb2wsXG4gICAgICAgICAgICBQcm9wVHlwZXMub2JqZWN0XG4gICAgICAgIF0pLFxuICAgICAgICBwYWdlU2l6ZTogUHJvcFR5cGVzLm51bWJlcixcbiAgICAgICAgaGVpZ2h0OiBQcm9wVHlwZXMub25lT2ZUeXBlKFtcbiAgICAgICAgICAgIFByb3BUeXBlcy5zdHJpbmcsXG4gICAgICAgICAgICBQcm9wVHlwZXMubnVtYmVyXG4gICAgICAgIF0pLFxuXG4gICAgICAgIC8qXG4gICAgICAgICAgR3JpZCBzZWxlY3RhYmxlIOyEpOygleqwklxuICAgICAgICAgIFwicm93XCIgLSB0aGUgdXNlciBjYW4gc2VsZWN0IGEgc2luZ2xlIHJvdy5cbiAgICAgICAgICBcImNlbGxcIiAtIHRoZSB1c2VyIGNhbiBzZWxlY3QgYSBzaW5nbGUgY2VsbC5cbiAgICAgICAgICBcIm11bHRpcGxlLCByb3dcIiAtIHRoZSB1c2VyIGNhbiBzZWxlY3QgbXVsdGlwbGUgcm93cy5cbiAgICAgICAgICBcIm11bHRpcGxlLCBjZWxsXCIgLSB0aGUgdXNlciBjYW4gc2VsZWN0IG11bHRpcGxlIGNlbGxzLlxuICAgICAgICAqL1xuICAgICAgICBzZWxlY3RNb2RlOiBQcm9wVHlwZXMub25lT2YoWydyb3cnLCdjZWxsJ10pLCAvLyBHcmlkIFNlbGVjdCBSb3cg65iQ64qUIENlbGwg7ISg7YOdXG4gICAgICAgIG11bHRpcGxlOiBQcm9wVHlwZXMuYm9vbCwgICAvLyDshYDroIntirggbXVsdGlwbGUg7KeA7JuQXG4gICAgICAgIC8qXG4gICAgICAgICAgR3JpZCBwYXJhbWV0ZXJNYXBGaWVsZCDshKTsoJXqsJJcbiAgICAgICAgICBza2lwOiBcInN0YXJ0XCIsIC0gcGFnaW5nIHNraXAg67OA7IiYIOyeheugpeuQnCDqsJIoa2V5KeycvOuhnCDrs7XsoJxcbiAgICAgICAgICB0YWtlOiBcImxpbWl0XCIsIC0gcGFnaW5nIGxpbWl0IOuzgOyImCDsnoXroKXrkJwg6rCSKGtleSnsnLzroZwg67O17KCcXG4gICAgICAgICAgY29udmVydFNvcnQ6IHRydWUsIC0gc29ydCBwYXJhbWV0ZXIg67O17KCcIOyXrOu2gFxuICAgICAgICAgIGZpZWxkOlwicHJvcGVydHlcIiwgIC0gc29ydCBmaWVsZCDrs4DsiJgg7J6F66Cl65CcIOqwkihrZXkp7Jy866GcIOuzteygnFxuICAgICAgICAgIGRpcjogXCJkaXJlY3Rpb25cIiwgIC0gc29ydCBkaXIg67OA7IiYIOyeheugpeuQnCDqsJIoa2V5KeycvOuhnCDrs7XsoJxcbiAgICAgICAgICBmaWx0ZXJzVG9Kc29uOiB0cnVlLCAgICAgIC0gZmlsdGVyIOygleuztOulvCBqc29u7Jy866GcIOuzgO2ZmO2VtOyEnCDsnbzrsJgg7YyM652866+47YSwIOyymOufvCDsspjrpqxcbiAgICAgICAgICBmaWx0ZXJQcmVmaXg6IFwic2VhcmNoX1wiLCAgLSBmaWx0ZXIganNvbuycvOuhnCDrs4DtmZjsi5wgcHJlZml46rCAIO2VhOyalO2VnCDqsr3smrAgcHJlZml466W8IOu2meyXrOyEnCDrsJjtmZhcbiAgICAgICAgICBmaWx0ZXJGaWVsZFRvTG93ZXJDYXNlOiB0cnVlICAtIGZpbHRlcuydmCBmaWVsZOulvCBsb3dlckNhc2Uo7IaM66y47J6QKeuhnCDrsJjtmZhcbiAgICAgICAgKi9cbiAgICAgICAgcGFyYW1ldGVyTWFwRmllbGQ6IFByb3BUeXBlcy5vYmplY3QsICAvLyBQYXJhbWV0ZXIgQ29udHJvbCDqsJ3ssrQo642w7J207YSwIOuzteyCrCwg7ZWE7YSw7LKY66asLCBTb3J0aW5nIO2MjOumrOuvuO2EsCDsoJXsnZgg65OxKVxuICAgICAgICBzY3JvbGxhYmxlOiBQcm9wVHlwZXMuYm9vbCAvLyDsoozsmrAg7Iqk7YGs66GkIOyDneyEsVxuICAgIH0sXG4gICAgaWQ6ICcnLFxuICAgICRncmlkOiB1bmRlZmluZWQsXG4gICAgY2hlY2tlZElkczoge30sXG4gICAgY2hlY2tlZEl0ZW1zOiB7fSxcbiAgICAvKlxuICAgICogR3JpZCBDaGFuZ2UgRXZlbnQoU2VsZWN0IEV2ZW50KSwgZGF0YVNldOycvOuhnCDsoJXsnZjtlZjsl6wg67Cb64qU64ukLlxuICAgICogcm93SW5kZXhcbiAgICAqIGNlbGxJbmRleFxuICAgICogZGF0YVxuICAgICogcm93c1xuICAgICovXG4gICAgb25DaGFuZ2U6IGZ1bmN0aW9uKCkge1xuICAgICAgICBsZXQgZ3JpZCA9IHRoaXMuZ3JpZDtcbiAgICAgICAgaWYodHlwZW9mIHRoaXMucHJvcHMub25DaGFuZ2UgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIC8vdmFyIGRhdGEgPSBldmVudC5ub2RlO1xuICAgICAgICAgICAgbGV0IGRhdGFTZXQgPSB7fTtcbiAgICAgICAgICAgIGlmKHRoaXMucHJvcHMuc2VsZWN0TW9kZSA9PT0gXCJjZWxsXCIpe1xuICAgICAgICAgICAgICAgIGxldCByb3cgPSAkKGdyaWQuc2VsZWN0KCkpLmNsb3Nlc3QoXCJ0clwiKTtcbiAgICAgICAgICAgICAgICBsZXQgY2VsbCA9IGdyaWQuc2VsZWN0KCk7XG4gICAgICAgICAgICAgICAgbGV0IGNlbGxUZXh0ID0gJChjZWxsKS50ZXh0KCk7XG4gICAgICAgICAgICAgICAgZGF0YVNldC5yb3dJbmRleCA9ICQoXCJ0clwiLCBncmlkLnRib2R5KS5pbmRleChyb3cpO1xuICAgICAgICAgICAgICAgIGRhdGFTZXQuY2VsbEluZGV4ID0gZ3JpZC5jZWxsSW5kZXgoY2VsbCk7XG4gICAgICAgICAgICAgICAgZGF0YVNldC5kYXRhID0gJChjZWxsKS50ZXh0KCk7XG4gICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICBsZXQgcm93cyA9IGdyaWQuc2VsZWN0KCk7XG5cbiAgICAgICAgICAgICAgICBpZihyb3dzLmxlbmd0aCA+IDEpe1xuICAgICAgICAgICAgICAgICAgICBsZXQgcm93c0RhdGEgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgcm93cy5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvd3NEYXRhLnB1c2goZ3JpZC5kYXRhSXRlbSgkKHRoaXMpKSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBkYXRhU2V0LnJvd3MgPSByb3dzO1xuICAgICAgICAgICAgICAgICAgICBkYXRhU2V0LmRhdGEgPSByb3dzRGF0YTtcbiAgICAgICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICAgICAgZGF0YVNldC5yb3dzID0gcm93cztcbiAgICAgICAgICAgICAgICAgICAgZGF0YVNldC5kYXRhID0gZ3JpZC5kYXRhSXRlbShyb3dzKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnByb3BzLm9uQ2hhbmdlKGRhdGFTZXQpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIHNldFNlbGVjdGVkSWRzOiBmdW5jdGlvbihwcm9wcykge1xuICAgICAgICBjb25zdCB7Y2hlY2tGaWVsZCwgc2VsZWN0ZWRJZHN9ID0gcHJvcHM7XG5cbiAgICAgICAgaWYoc2VsZWN0ZWRJZHMgIT09IG51bGwgJiYgdHlwZW9mIHNlbGVjdGVkSWRzICE9PSAndW5kZWZpbmVkJyAmJiBzZWxlY3RlZElkcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICB2YXIgcm93cyA9IHRoaXMuZ3JpZC50YWJsZS5maW5kKCd0cicpLmZpbmQoJ3RkOmZpcnN0IGlucHV0JykuY2xvc2VzdCgndHInKSxcbiAgICAgICAgICAgICAgICBfdGhpcyA9IHRoaXM7XG5cbiAgICAgICAgICAgIHJvd3MuZWFjaChmdW5jdGlvbihpbmRleCwgcm93KSB7XG4gICAgICAgICAgICAgICAgdmFyICRjaGVja2JveCA9ICQocm93KS5maW5kKCdpbnB1dDpjaGVja2JveC5jaGVja2JveCcpLFxuICAgICAgICAgICAgICAgICAgICBkYXRhSXRlbSA9IF90aGlzLmdyaWQuZGF0YUl0ZW0ocm93KSxcbiAgICAgICAgICAgICAgICAgICAgY2hlY2tlZCA9IGZhbHNlO1xuXG4gICAgICAgICAgICAgICAgZm9yKHZhciBpPTA7IGk8c2VsZWN0ZWRJZHMubGVuZ3RoOyBpKyspIHtcblxuICAgICAgICAgICAgICAgICAgICBpZihjaGVja0ZpZWxkICE9PSBudWxsICYmIHR5cGVvZiBjaGVja0ZpZWxkICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYoZGF0YUl0ZW1bY2hlY2tGaWVsZF0gPT0gc2VsZWN0ZWRJZHNbaV0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGVja2VkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICB9ZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZigkY2hlY2tib3gudmFsKCkgPT0gc2VsZWN0ZWRJZHNbaV0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGVja2VkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICRjaGVja2JveC5hdHRyKCdjaGVja2VkJywgY2hlY2tlZCk7XG4gICAgICAgICAgICAgICAgX3RoaXMuc2VsZWN0Q2hlY2tib3goJGNoZWNrYm94LCBjaGVja2VkLCAkKHJvdykpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgIH0sXG4gICAgb25TZWxlY3RSb3c6IGZ1bmN0aW9uKGV2ZW50KSB7XG5cbiAgICAgICAgaWYodHlwZW9mIHRoaXMucHJvcHMub25TZWxlY3RSb3cgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIHZhciBpZHMgPSBbXSwgaXRlbXMgPSBbXTtcbiAgICAgICAgICAgIGZvcih2YXIga2V5IGluIHRoaXMuY2hlY2tlZElkcykge1xuICAgICAgICAgICAgICAgIGlmKHRoaXMuY2hlY2tlZElkc1trZXldKSB7XG4gICAgICAgICAgICAgICAgICAgIGlkcy5wdXNoKGtleSk7XG4gICAgICAgICAgICAgICAgICAgIGl0ZW1zLnB1c2godGhpcy5jaGVja2VkSXRlbXNba2V5XSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLnByb3BzLm9uU2VsZWN0Um93KGV2ZW50LCBpZHMsIGl0ZW1zKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgb25DaGVja2JveEhlYWRlcjogZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgdmFyIGNoZWNrZWQgPSAkKGV2ZW50LnRhcmdldCkuaXMoJzpjaGVja2VkJyk7XG5cbiAgICAgICAgdmFyIHJvd3MgPSB0aGlzLmdyaWQudGFibGUuZmluZChcInRyXCIpLmZpbmQoXCJ0ZDpmaXJzdCBpbnB1dFwiKS5jbG9zZXN0KFwidHJcIiksXG4gICAgICAgICAgICBfdGhpcyA9IHRoaXM7XG5cbiAgICAgICAgcm93cy5lYWNoKGZ1bmN0aW9uKGluZGV4LCByb3cpIHtcbiAgICAgICAgICAgIHZhciAkY2hlY2tib3ggPSAkKHJvdykuZmluZCgnaW5wdXQ6Y2hlY2tib3guY2hlY2tib3gnKTtcbiAgICAgICAgICAgICRjaGVja2JveC5hdHRyKCdjaGVja2VkJywgY2hlY2tlZCk7XG5cbiAgICAgICAgICAgIF90aGlzLnNlbGVjdENoZWNrYm94KCRjaGVja2JveCwgY2hlY2tlZCwgJChyb3cpKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5vblNlbGVjdFJvdyhldmVudCk7XG4gICAgfSxcbiAgICBvbkNoZWNrYm94Um93OiBmdW5jdGlvbihldmVudCkge1xuICAgICAgICB2YXIgY2hlY2tlZCA9IGV2ZW50LnRhcmdldC5jaGVja2VkLFxuICAgICAgICAgICAgJHJvdyA9ICQoZXZlbnQudGFyZ2V0KS5jbG9zZXN0KCd0cicpO1xuXG4gICAgICAgIHRoaXMuc2VsZWN0Q2hlY2tib3goJChldmVudC50YXJnZXQpLCBjaGVja2VkLCAkcm93KTtcbiAgICAgICAgdGhpcy5vblNlbGVjdFJvdyhldmVudCk7XG4gICAgfSxcbiAgICBzZWxlY3RDaGVja2JveDogZnVuY3Rpb24oJGNoZWNrYm94LCBjaGVja2VkLCAkcm93KSB7XG5cbiAgICAgICAgdmFyIGRhdGFJdGVtID0gdGhpcy5ncmlkLmRhdGFJdGVtKCRyb3cpO1xuXG4gICAgICAgIGlmKHRoaXMucHJvcHMuY2hlY2tGaWVsZCAhPT0gbnVsbCAmJiB0eXBlb2YgdGhpcy5wcm9wcy5jaGVja0ZpZWxkICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgdGhpcy5jaGVja2VkSWRzW2RhdGFJdGVtW3RoaXMucHJvcHMuY2hlY2tGaWVsZF1dID0gY2hlY2tlZDtcbiAgICAgICAgICAgIHRoaXMuY2hlY2tlZEl0ZW1zW2RhdGFJdGVtW3RoaXMucHJvcHMuY2hlY2tGaWVsZF1dID0gZGF0YUl0ZW07XG4gICAgICAgIH1lbHNlIHtcbiAgICAgICAgICAgIHRoaXMuY2hlY2tlZElkc1skY2hlY2tib3gudmFsKCldID0gY2hlY2tlZDtcbiAgICAgICAgICAgIHRoaXMuY2hlY2tlZEl0ZW1zWyRjaGVja2JveC52YWwoKV0gPSBkYXRhSXRlbTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmKGNoZWNrZWQpIHtcbiAgICAgICAgICAgIC8vLXNlbGVjdCB0aGUgcm93XG4gICAgICAgICAgICAkcm93LmFkZENsYXNzKFwiay1zdGF0ZS1zZWxlY3RlZFwiKTtcbiAgICAgICAgfWVsc2Uge1xuICAgICAgICAgICAgLy8tcmVtb3ZlIHNlbGVjdGlvblxuICAgICAgICAgICAgJHJvdy5yZW1vdmVDbGFzcyhcImstc3RhdGUtc2VsZWN0ZWRcIik7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIGdldENoZWNrYm94Q29sdW1uOiBmdW5jdGlvbihjaGVja2JveEZpZWxkKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBmaWVsZDogY2hlY2tib3hGaWVsZCxcbiAgICAgICAgICAgIGhlYWRlclRlbXBsYXRlOiAnPGlucHV0IHR5cGU9XCJjaGVja2JveFwiIGNsYXNzPVwiY2hlY2tib3hcIiAvPicsXG4gICAgICAgICAgICAvL2hlYWRlclRlbXBsYXRlOiAnPGRpdiBjbGFzcz1cImNoZWNrYm94XCI+PGxhYmVsPjxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIiAvPjwvbGFiZWw+PC9kaXY+JyxcbiAgICAgICAgICAgIGhlYWRlckF0dHJpYnV0ZXM6IHtcbiAgICAgICAgICAgICAgICAnY2xhc3MnOiAndGFibGUtaGVhZGVyLWNlbGwnLFxuICAgICAgICAgICAgICAgIHN0eWxlOiAndGV4dC1hbGlnbjogY2VudGVyJ1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHRlbXBsYXRlOiAnPGlucHV0IHR5cGU9XCJjaGVja2JveFwiIGNsYXNzPVwiY2hlY2tib3hcIiB2YWx1ZT1cIiM9JyArIGNoZWNrYm94RmllbGQgKyAnI1wiIC8+JyxcbiAgICAgICAgICAgIGF0dHJpYnV0ZXM6IHtcbiAgICAgICAgICAgICAgICBhbGlnbjogJ2NlbnRlcidcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB3aWR0aDogNTAsXG4gICAgICAgICAgICBzb3J0YWJsZTogZmFsc2VcbiAgICAgICAgfTtcbiAgICB9LFxuICAgIG9uRGF0YUJvdW5kOiBmdW5jdGlvbihhcmcpIHtcbiAgICAgICAgLy8gc2VsZWN0ZWQgY2hlY2tcbiAgICAgICAgdGhpcy5zZXRTZWxlY3RlZElkcyh0aGlzLnByb3BzKTtcbiAgICB9LFxuICAgIGdldERhdGFTb3VyY2U6IGZ1bmN0aW9uKHByb3BzKSB7XG4gICAgICAgIGNvbnN0IHtob3N0LCB1cmwsIG1ldGhvZCwgZGF0YSwgbGlzdEZpZWxkLCB0b3RhbEZpZWxkLCBwYWdlYWJsZSwgcGFnZVNpemUsIHBhcmFtZXRlck1hcEZpZWxkfSA9IHByb3BzO1xuXG4gICAgICAgIC8vIHBhZ2VTaXplXG4gICAgICAgIHZhciBfcGFnZVNpemUgPSAwLCBfcGFnZWFibGUgPSBmYWxzZTtcbiAgICAgICAgaWYocGFnZWFibGUpIHtcbiAgICAgICAgICAgIF9wYWdlU2l6ZSA9IHBhZ2VTaXplO1xuICAgICAgICAgICAgX3BhZ2VhYmxlID0gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGh0dHA6Ly9pdHEubmwva2VuZG8tdWktZ3JpZC13aXRoLXNlcnZlci1wYWdpbmctZmlsdGVyaW5nLWFuZC1zb3J0aW5nLXdpdGgtbXZjMy9cbiAgICAgICAgLy8gaHR0cHM6Ly9ibG9nLmxvbmdsZS5uZXQvMjAxMi8wNC8xMy90ZWxlcmlrcy1odG1sNS1rZW5kby11aS1ncmlkLXdpdGgtc2VydmVyLXNpZGUtcGFnaW5nLXNvcnRpbmctZmlsdGVyaW5nLXdpdGgtbXZjMy1lZjQtZHluYW1pYy1saW5xL1xuICAgICAgICB2YXIgZGF0YVNvdXJjZSA9IG5ldyBrZW5kby5kYXRhLkRhdGFTb3VyY2Uoe1xuICAgICAgICAgICAgdHJhbnNwb3J0OiB7XG4gICAgICAgICAgICAgICAgLypcbiAgICAgICAgICAgICAgICByZWFkOiBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgICAgICAgICAgICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBtZXRob2QsXG4gICAgICAgICAgICAgICAgICAgICAgICB1cmw6IHVybCxcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vY29udGVudFR5cGU6IFwiYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOFwiLCDsnbTqsoMg7ISk7KCV7ZWY66m0IGRhdGEg7KCE7IahIOyViOuQqFxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IGRhdGEsLy9KU09OLnN0cmluZ2lmeSh7a2V5OiBcInZhbHVlXCJ9KSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKGRhdGEpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGFyciA9IFtdLCBncmlkTGlzdCA9IGRhdGE7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYobGlzdEZpZWxkICYmIGxpc3RGaWVsZC5sZW5ndGggPiAwICYmIGxpc3RGaWVsZCAhPSAnbnVsbCcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXJyID0gbGlzdEZpZWxkLnNwbGl0KCcuJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvcih2YXIgaSBpbiBhcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhhcnJbaV0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBncmlkTGlzdCA9IGdyaWRMaXN0W2FycltpXV07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbnMuc3VjY2VzcyhncmlkTGlzdCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9vcHRpb25zLnN1Y2Nlc3MoZGF0YS5yZXN1bHRWYWx1ZS5saXN0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgcmVhZDoge1xuICAgICAgICAgICAgICAgICAgICB1cmw6IChob3N0ICYmIGhvc3QgIT09IG51bGwgJiYgaG9zdC5sZW5ndGggPiAwKSA/IGhvc3QgKyB1cmwgOiB1cmwsXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IG1ldGhvZCxcbiAgICAgICAgICAgICAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcbiAgICAgICAgICAgICAgICAgICAgZGF0YTogZGF0YSwgICAgICAvLyBzZWFyY2ggKEBSZXF1ZXN0Qm9keSBHcmlkUGFyYW0gZ3JpZFBhcmFtIOuhnCDrsJvripTri6QuKVxuICAgICAgICAgICAgICAgICAgICBjb250ZW50VHlwZTogJ2FwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBwYXJhbWV0ZXJNYXA6IGZ1bmN0aW9uKGRhdGEsIHR5cGUpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYodHlwZSA9PSBcInJlYWRcIiAmJiBwYXJhbWV0ZXJNYXBGaWVsZCAhPT0gbnVsbCl7XG4gICAgICAgICAgICAgICAgICAgIFx0Ly8g642w7J207YSwIOydveyWtOyYrOuVjCDtlYTsmpTtlZwg642w7J207YSwKGV4Ou2OmOydtOyngOq0gOugqCnqsIAg7J6I7Jy866m0IGRhdGHrpbwgY29wee2VnOuLpC5cbiAgICAgICAgICAgICAgICAgICAgICAgIGZvcihsZXQgY29weSBpbiBwYXJhbWV0ZXJNYXBGaWVsZCl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYodHlwZW9mIHBhcmFtZXRlck1hcEZpZWxkW2NvcHldID09PSBcInN0cmluZ1wiICYmICggY29weSBpbiBkYXRhICkpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhW3BhcmFtZXRlck1hcEZpZWxkW2NvcHldXSA9IGRhdGFbY29weV07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gRmlsdGVyIEFycmF5ID0+IEpzb24gT2JqZWN0IENvcHlcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKHBhcmFtZXRlck1hcEZpZWxkLmZpbHRlcnNUb0pzb24gJiYgZGF0YS5maWx0ZXIgJiYgZGF0YS5maWx0ZXIuZmlsdGVycyl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGZpbHRlcnMgPSBkYXRhLmZpbHRlci5maWx0ZXJzO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbHRlcnMubWFwKChmaWx0ZXIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGZpZWxkID0gKHBhcmFtZXRlck1hcEZpZWxkLmZpbHRlclByZWZpeCkgPyBwYXJhbWV0ZXJNYXBGaWVsZC5maWx0ZXJQcmVmaXggKyBmaWx0ZXIuZmllbGQgOiBmaWx0ZXIuZmllbGQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKHBhcmFtZXRlck1hcEZpZWxkLmZpbHRlckZpZWxkVG9Mb3dlckNhc2Upe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YVtmaWVsZC50b0xvd2VyQ2FzZSgpXSA9IGZpbHRlci52YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhW2ZpZWxkXSA9IGZpbHRlci52YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gU29ydCBBcnJheSA9PiBGaWVsZCwgRGlyIENvbnZlcnRcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKHBhcmFtZXRlck1hcEZpZWxkLmNvbnZlcnRTb3J0ICYmIGRhdGEuc29ydCl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS5zb3J0Lm1hcCgoc29ydERhdGEpID0+e1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZihcImZpZWxkXCIgaW4gcGFyYW1ldGVyTWFwRmllbGQpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc29ydERhdGFbcGFyYW1ldGVyTWFwRmllbGQuZmllbGRdID0gc29ydERhdGEuZmllbGQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYoXCJkaXJcIiBpbiBwYXJhbWV0ZXJNYXBGaWVsZCl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzb3J0RGF0YVtwYXJhbWV0ZXJNYXBGaWVsZC5kaXJdID0gc29ydERhdGEuZGlyO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKGRhdGEpO1xuICAgICAgICAgICAgICAgICAgICAvLyBwYWdpbmcg7LKY66as7IucIOyEnOuyhOuhnCDrs7TrgrTsp4DripQg6re466as65OcIOq0gOugqCDrjbDsnbTthLAge3Rha2U6IDIwLCBza2lwOiAwLCBwYWdlOiAxLCBwYWdlU2l6ZTogMjB9XG4gICAgICAgICAgICAgICAgICAgIC8vIG5vIHBhZ2luZyDsspjrpqzsi5zsl5DripQge30g7J2EIOyEnOuyhOuhnCDrs7Trgrjri6QuXG4gICAgICAgICAgICAgICAgICAgIC8vIEBSZXF1ZXN0Qm9keSBHcmlkUGFyYW0gZ3JpZFBhcmFtIOuhnCDrsJvripTri6QuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShkYXRhKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2NoZW1hOiB7XG4gICAgICAgICAgICAgICAgLy8gcmV0dXJuZWQgaW4gdGhlIFwibGlzdEZpZWxkXCIgZmllbGQgb2YgdGhlIHJlc3BvbnNlXG4gICAgICAgICAgICAgICAgZGF0YTogZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhyZXNwb25zZSk7XG4gICAgICAgICAgICAgICAgICAgIHZhciBhcnIgPSBbXSwgZ3JpZExpc3QgPSByZXNwb25zZTtcblxuICAgICAgICAgICAgICAgICAgICBpZihsaXN0RmllbGQgJiYgbGlzdEZpZWxkLmxlbmd0aCA+IDAgJiYgbGlzdEZpZWxkICE9ICdudWxsJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgYXJyID0gbGlzdEZpZWxkLnNwbGl0KCcuJyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZm9yKHZhciBpIGluIGFycikge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhhcnJbaV0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYoIWdyaWRMaXN0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ3JpZExpc3QgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGdyaWRMaXN0ID0gZ3JpZExpc3RbYXJyW2ldXTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZ3JpZExpc3Q7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAvLyByZXR1cm5lZCBpbiB0aGUgXCJ0b3RhbEZpZWxkXCIgZmllbGQgb2YgdGhlIHJlc3BvbnNlXG4gICAgICAgICAgICAgICAgdG90YWw6IGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2cocmVzcG9uc2UpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgYXJyID0gW10sIHRvdGFsID0gcmVzcG9uc2U7XG4gICAgICAgICAgICAgICAgICAgIGlmKHRvdGFsRmllbGQgJiYgdG90YWxGaWVsZC5sZW5ndGggPiAwICYmIHRvdGFsRmllbGQgIT0gJ251bGwnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhcnIgPSB0b3RhbEZpZWxkLnNwbGl0KCcuJyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZm9yKHZhciBpIGluIGFycikge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhhcnJbaV0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYoIXRvdGFsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdG90YWwgPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgdG90YWwgPSB0b3RhbFthcnJbaV1dO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0b3RhbDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcGFnZVNpemU6IF9wYWdlU2l6ZSxcbiAgICAgICAgICAgIHNlcnZlclBhZ2luZzogX3BhZ2VhYmxlLFxuICAgICAgICAgICAgc2VydmVyRmlsdGVyaW5nOiBfcGFnZWFibGUsXG4gICAgICAgICAgICBzZXJ2ZXJTb3J0aW5nOiBfcGFnZWFibGVcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIGRhdGFTb3VyY2U7XG4gICAgfSxcbiAgICBnZXRPcHRpb25zOiBmdW5jdGlvbihwcm9wcykge1xuICAgICAgICBjb25zdCB7cmVzaXphYmxlLCBmaWx0ZXJhYmxlLCBzb3J0YWJsZSwgcGFnZWFibGUsIGhlaWdodCwgY2hlY2tib3hGaWVsZCwgc2VsZWN0TW9kZSwgbXVsdGlwbGUsIHNjcm9sbGFibGV9ID0gcHJvcHM7XG5cbiAgICAgICAgdmFyIGRhdGFTb3VyY2UgPSB0aGlzLmdldERhdGFTb3VyY2UocHJvcHMpO1xuXG4gICAgICAgIHZhciBjb2x1bW5zID0gcHJvcHMuY29sdW1ucztcbiAgICAgICAgaWYodHlwZW9mIGNoZWNrYm94RmllbGQgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICB2YXIgYiA9IHRydWU7XG4gICAgICAgICAgICBmb3IodmFyIGkgaW4gY29sdW1ucykge1xuICAgICAgICAgICAgICAgIGlmKGNoZWNrYm94RmllbGQgPT0gY29sdW1uc1tpXS5maWVsZCkge1xuICAgICAgICAgICAgICAgICAgICBiID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmKGIgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICBjb2x1bW5zLnVuc2hpZnQodGhpcy5nZXRDaGVja2JveENvbHVtbihjaGVja2JveEZpZWxkKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgZmlsdGVyO1xuICAgICAgICBpZih0eXBlb2YgZmlsdGVyYWJsZSA9PT0gJ2Jvb2xlYW4nICYmIGZpbHRlcmFibGUgPT09IHRydWUpIHtcbiAgICAgICAgICAgIGZpbHRlciA9IHtcbiAgICAgICAgICAgICAgICBleHRyYTogZmFsc2UsXG4gICAgICAgICAgICAgICAgb3BlcmF0b3JzOiB7XG4gICAgICAgICAgICAgICAgICAgIHN0cmluZzoge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29udGFpbnM6ICdjb250YWlucydcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgbnVtYmVyOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBlcTogJ2VxJy8qLFxuICAgICAgICAgICAgICAgICAgICAgICAgbmVxOiBcIkRpdmVyc28gZGFcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIGd0ZTogXCJNYWdnaW9yZSBvIHVndWFsZSBhXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBndDogXCJNYWdnaW9yZSBkaVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgbHRlOiBcIk1pbm9yZSBvIHVndWFsZSBhXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBsdDogXCJNaW5vcmUgZGlcIiovXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIGRhdGU6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVxOiAnZXEnLyosXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXE6IFwiRGl2ZXJzbyBkYVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgZ3RlOiBcIlN1Y2Nlc3NpdmEgbyB1Z3VhbGUgYWxcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIGd0OiBcIlN1Y2Nlc3NpdmEgYWxcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIGx0ZTogXCJQcmVjZWRlbnRlIG8gdWd1YWxlIGFsXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBsdDogXCJQcmVjZWRlbnRlIGFsXCIqL1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBlbnVtczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29udGFpbnM6ICdjb250YWlucydcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgdWk6IGZ1bmN0aW9uKGVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyICRwYXJlbnQgPSBlbGVtZW50LnBhcmVudCgpO1xuICAgICAgICAgICAgICAgICAgICB3aGlsZSgkcGFyZW50LmNoaWxkcmVuKCkubGVuZ3RoID4gMSlcbiAgICAgICAgICAgICAgICAgICAgICAgICQoJHBhcmVudC5jaGlsZHJlbigpWzBdKS5yZW1vdmUoKTtcblxuICAgICAgICAgICAgICAgICAgICAkcGFyZW50LnByZXBlbmQoJzxpbnB1dCB0eXBlPVwidGV4dFwiIGRhdGEtYmluZD1cInZhbHVlOmZpbHRlcnNbMF0udmFsdWVcIiBjbGFzcz1cImstdGV4dGJveFwiPicpO1xuICAgICAgICAgICAgICAgICAgICAkcGFyZW50LmZpbmQoJ2J1dHRvbjpzdWJtaXQuay1idXR0b24uay1wcmltYXJ5JykuaHRtbCgn7ZWE7YSwJyk7XG4gICAgICAgICAgICAgICAgICAgICRwYXJlbnQuZmluZCgnYnV0dG9uOnJlc2V0LmstYnV0dG9uJykuaHRtbCgn7LSI6riw7ZmUJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfWVsc2Uge1xuICAgICAgICAgICAgZmlsdGVyID0gZmlsdGVyYWJsZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBfcGFnZWFibGU7XG4gICAgICAgIGlmKHR5cGVvZiBwYWdlYWJsZSA9PT0gJ2Jvb2xlYW4nICYmIHBhZ2VhYmxlID09PSB0cnVlKSB7XG4gICAgICAgICAgICBfcGFnZWFibGUgPSB7XG4gICAgICAgICAgICAgICAgYnV0dG9uQ291bnQ6IDUsXG4gICAgICAgICAgICAgICAgcGFnZVNpemVzOiBbMTAsIDIwLCAzMCwgNTAsIDEwMF0sXG4gICAgICAgICAgICAgICAgbWVzc2FnZXM6IHtcbiAgICAgICAgICAgICAgICAgICAgZGlzcGxheTogJHBzX2xvY2FsZS5ncmlkLnJlY29yZHRleHQsLy8nezB9LXsxfS97Mn0nLFxuICAgICAgICAgICAgICAgICAgICBlbXB0eTogJycsXG4gICAgICAgICAgICAgICAgICAgIC8vb2Y6ICcvezB9JyxcbiAgICAgICAgICAgICAgICAgICAgaXRlbXNQZXJQYWdlOiAkcHNfbG9jYWxlLmdyaWQucm93c1BlclBhZ2VcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICB9ZWxzZSB7XG4gICAgICAgICAgICBfcGFnZWFibGUgPSBwYWdlYWJsZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBvcHRpb25zID0ge1xuICAgICAgICAgICAgLy9kYXRhU291cmNlOiB7XG4gICAgICAgICAgICAvLyAgICB0cmFuc3BvcnQ6IHtcbiAgICAgICAgICAgIC8vICAgICAgICByZWFkOiB7XG4gICAgICAgICAgICAvLyAgICAgICAgICAgIHR5cGU6IG1ldGhvZCxcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgdXJsOiB1cmwsXG4gICAgICAgICAgICAvLyAgICAgICAgICAgIC8vZGF0YTogZGF0YSxcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgZGF0YVR5cGU6ICdqc29uJ1xuICAgICAgICAgICAgLy8gICAgICAgIH1cbiAgICAgICAgICAgIC8vICAgIH0vLyxcbiAgICAgICAgICAgIC8vICAgIC8vc2NoZW1hOiB7XG4gICAgICAgICAgICAvLyAgICAvLyAgICBkYXRhOiAnZGF0YSdcbiAgICAgICAgICAgIC8vICAgIC8vfSxcbiAgICAgICAgICAgIC8vICAgIC8vcGFnZVNpemU6IDIwLFxuICAgICAgICAgICAgLy8gICAgLy9zZXJ2ZXJQYWdpbmc6IHRydWUsXG4gICAgICAgICAgICAvLyAgICAvL3NlcnZlckZpbHRlcmluZzogdHJ1ZSxcbiAgICAgICAgICAgIC8vICAgIC8vc2VydmVyU29ydGluZzogdHJ1ZVxuICAgICAgICAgICAgLy99LFxuICAgICAgICAgICAgZGF0YVNvdXJjZTogZGF0YVNvdXJjZSxcbiAgICAgICAgICAgIGNvbHVtbnM6IGNvbHVtbnMsXG4gICAgICAgICAgICBub1JlY29yZHM6IHtcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZTogJHBzX2xvY2FsZS5ncmlkLmVtcHR5cmVjb3Jkc1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGhlaWdodDogaGVpZ2h0LFxuICAgICAgICAgICAgZGF0YUJvdW5kOiB0aGlzLm9uRGF0YUJvdW5kLFxuICAgICAgICAgICAgcmVzaXphYmxlOiByZXNpemFibGUsXG4gICAgICAgICAgICBmaWx0ZXJhYmxlOiBmaWx0ZXIsXG4gICAgICAgICAgICBzb3J0YWJsZTogc29ydGFibGUsXG4gICAgICAgICAgICBzY3JvbGxhYmxlOiBzY3JvbGxhYmxlLFxuICAgICAgICAgICAgcGFnZWFibGU6IF9wYWdlYWJsZSxcbiAgICAgICAgICAgIHNlbGVjdGFibGU6IChtdWx0aXBsZSkgPyBcIm11bHRpcGxlICxcIiArIHNlbGVjdE1vZGUgOiBzZWxlY3RNb2RlXG4gICAgICAgIH07XG5cbiAgICAgICAgaWYodHlwZW9mIGhlaWdodCA9PT0gJ251bWJlcicgfHwgdHlwZW9mIGhlaWdodCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICQuZXh0ZW5kKG9wdGlvbnMsIHtoZWlnaHQ6IGhlaWdodH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgLypcbiAgICAgICAgaWYodHlwZW9mIG9uQ2hhbmdlID09PSAnZnVuY3Rpb24nKXtcbiAgICAgICAgICAkLmV4dGVuZChvcHRpb25zLCB7Y2hhbmdlOiB0aGlzLm9uQ2hhbmdlUm93fSk7XG4gICAgICAgIH1cbiAgICAgICAgKi9cbiAgICAgICAgcmV0dXJuIG9wdGlvbnM7XG4gICAgfSxcblx0Z2V0RGVmYXVsdFByb3BzOiBmdW5jdGlvbigpIHtcblx0XHQvLyDtgbTrnpjsiqTqsIAg7IOd7ISx65CgIOuVjCDtlZzrsogg7Zi47Lac65CY6rOgIOy6kOyLnOuQnOuLpC5cblx0XHQvLyDrtoDrqqgg7Lu07Y+s64SM7Yq47JeQ7IScIHByb3DsnbQg64SY7Ja07Jik7KeAIOyViuydgCDqsr3smrAgKGluIOyXsOyCsOyekOuhnCDtmZXsnbgpIOunpO2VkeydmCDqsJLsnbQgdGhpcy5wcm9wc+yXkCDshKTsoJXrkJzri6QuXG4gICAgICAgIHJldHVybiB7bWV0aG9kOiAnUE9TVCcsIGxpc3RGaWVsZDogJ3Jlc3VsdFZhbHVlLmxpc3QnLCB0b3RhbEZpZWxkOiAncmVzdWx0VmFsdWUudG90YWxDb3VudCcsIHJlc2l6YWJsZTogdHJ1ZSwgZmlsdGVyYWJsZTogZmFsc2UsIHNvcnRhYmxlOiB0cnVlLCBwYWdlYWJsZTogdHJ1ZSwgcGFnZVNpemU6IDIwLCBzZWxlY3RNb2RlOiBudWxsLCBtdWx0aXBsZTogZmFsc2UsIHBhcmFtZXRlck1hcEZpZWxkOiBudWxsLCBzY3JvbGxhYmxlOiB0cnVlfTtcblx0fSxcbiAgICBjb21wb25lbnRXaWxsTW91bnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAvLyDstZzstIgg66CM642U66eB7J20IOydvOyWtOuCmOq4sCDsp4HsoIQo7ZWc67KIIO2YuOy2nClcbiAgICAgICAgbGV0IGlkID0gdGhpcy5wcm9wcy5pZDtcbiAgICAgICAgaWYodHlwZW9mIGlkID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgaWQgPSBVdGlsLmdldFVVSUQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuaWQgPSBpZDtcbiAgICB9LFxuICAgIGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbigpIHtcbiAgICAgICAgLy8g7LWc7LSIIOugjOuNlOungeydtCDsnbzslrTrgpwg64uk7J2MKO2VnOuyiCDtmLjstpwpXG4gICAgICAgIHRoaXMuJGdyaWQgPSAkKCcjJyt0aGlzLmlkKTtcblxuICAgICAgICAvL2NvbnNvbGUubG9nKHRoaXMuZ2V0T3B0aW9ucyh0aGlzLnByb3BzKSk7XG4gICAgICAgIHRoaXMuZ3JpZCA9IHRoaXMuJGdyaWQua2VuZG9HcmlkKHRoaXMuZ2V0T3B0aW9ucyh0aGlzLnByb3BzKSkuZGF0YSgna2VuZG9HcmlkJyk7XG5cbiAgICAgICAgLypcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgJCh3aW5kb3cpLnJlc2l6ZShmdW5jdGlvbigpe1xuICAgICAgICAgICAgLy9fdGhpcy4kZ3JpZC5kYXRhKFwia2VuZG9HcmlkXCIpLnJlc2l6ZSgpO1xuICAgICAgICAgICAgX3RoaXMuYXV0b1Jlc2l6ZUdyaWQoKTtcbiAgICAgICAgfSk7XG4gICAgICAgICovXG4gICAgICAgIC8vIGJpbmQgY2xpY2sgZXZlbnQgdG8gdGhlIGNoZWNrYm94XG4gICAgICAgIC8vY29uc29sZS5sb2coZ3JpZCk7XG4gICAgICAgIC8vIEV2ZW50c1xuICAgICAgICB0aGlzLmdyaWQuYmluZCgnY2hhbmdlJywgdGhpcy5vbkNoYW5nZSk7XG5cbiAgICAgICAgdGhpcy5ncmlkLnRhYmxlLm9uKCdjbGljaycsICcuY2hlY2tib3gnICwgdGhpcy5vbkNoZWNrYm94Um93KTsgICAgICAgICAvLyBjaGVja2JveFxuICAgICAgICB0aGlzLmdyaWQudGhlYWQub24oJ2NsaWNrJywgJy5jaGVja2JveCcgLCB0aGlzLm9uQ2hlY2tib3hIZWFkZXIpOyAgICAgIC8vIGhlYWRlciBjaGVja2JveFxuXG4gICAgICAgIGlmKHR5cGVvZiB0aGlzLnByb3BzLmluaXQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIHZhciBkYXRhID0ge307XG4gICAgICAgICAgICBkYXRhLiRncmlkID0gdGhpcy4kZ3JpZDtcbiAgICAgICAgICAgIGRhdGEuZ3JpZCA9IHRoaXMuZ3JpZDtcbiAgICAgICAgICAgIHRoaXMucHJvcHMuaW5pdChkYXRhKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wczogZnVuY3Rpb24obmV4dFByb3BzKSB7XG4gICAgICAgIC8vIOy7tO2PrOuEjO2KuOqwgCDsg4jroZzsmrQgcHJvcHPrpbwg67Cb7J2EIOuVjCDtmLjstpwo7LWc7LSIIOugjOuNlOungSDsi5zsl5DripQg7Zi47Lac65CY7KeAIOyViuydjClcbiAgICAgICAgLyogZGF0YVNvdXJjZSDsl5Ag6rSA66Co65CcIOqwkuydtCDrsJTrgIzslrTslbwg64uk7IucIOuNsOydtO2EsCDroZzrlKntlZjripQg67Cp7Iud7J2AIOydvOuLqCDrs7TrpZhcbiAgICAgICAg7ZmU66m07JeQ7IScIHJlZnJlc2gg6rCAIOyViOuQqFxuICAgICAgICBjb25zdCB7dXJsLCBtZXRob2QsIGRhdGEsIGxpc3RGaWVsZH0gPSB0aGlzLnByb3BzO1xuXG4gICAgICAgIHZhciBiID0gZmFsc2U7XG4gICAgICAgIGZvcih2YXIga2V5IGluIGRhdGEpIHtcbiAgICAgICAgICAgIGlmKG5leHRQcm9wcy5kYXRhW2tleV0gIT0gZGF0YVtrZXldKSB7XG4gICAgICAgICAgICAgICAgYiA9IHRydWU7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZihuZXh0UHJvcHMudXJsICE9IHVybCB8fCBiID09IHRydWUpIHtcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coJ3NldERhdGFTb3VyY2UnKTtcbiAgICAgICAgICAgIHZhciBncmlkID0gJCgnIycrdGhpcy5pZCkuZGF0YShcImtlbmRvR3JpZFwiKTtcbiAgICAgICAgICAgIGdyaWQuc2V0RGF0YVNvdXJjZSh0aGlzLmdldERhdGFTb3VyY2UobmV4dFByb3BzKSk7XG4gICAgICAgIH1cbiAgICAgICAgKi9cbiAgICAgICAgdGhpcy5ncmlkLnNldERhdGFTb3VyY2UodGhpcy5nZXREYXRhU291cmNlKG5leHRQcm9wcykpO1xuICAgICAgICB0aGlzLmNoZWNrZWRJZHMgPSBbXTtcbiAgICAgICAgdGhpcy5ncmlkLnRoZWFkLmZpbmQoJy5jaGVja2JveCcpLmF0dHIoJ2NoZWNrZWQnLCBmYWxzZSk7XG4gICAgICAgIC8vIHNldERhdGFTb3VyY2Ug6rCAIOydvOyWtOuCmOuptCBoZWFkZXIgY2hlY2tib3ggY2xpY2sg7J2067Kk7Yq4IOumrOyKpOuEiOqwgCDsgqzrnbzsoLjshJwg64uk7IucIOyEpOyglVxuICAgICAgICB0aGlzLmdyaWQudGhlYWQub24oJ2NsaWNrJywgJy5jaGVja2JveCcgLCB0aGlzLm9uQ2hlY2tib3hIZWFkZXIpOyAgICAgIC8vIGhlYWRlciBjaGVja2JveFxuXG4gICAgICAgIC8vIHNlbGVjdGVkIGNoZWNrXG4gICAgICAgIHRoaXMuc2V0U2VsZWN0ZWRJZHMobmV4dFByb3BzKTtcbiAgICB9LFxuICAgIHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgICAgIC8vIO2VhOyImCDtla3rqqlcbiAgICAgICAgY29uc3Qge2NsYXNzTmFtZX0gPSB0aGlzLnByb3BzO1xuXG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8ZGl2IGlkPXt0aGlzLmlkfSBjbGFzc05hbWU9e2NsYXNzTmFtZXMoY2xhc3NOYW1lKX0+PC9kaXY+XG4gICAgICAgICk7XG4gICAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gR3JpZDtcbiIsIi8qKlxuICogTXVsdGlTZWxlY3QgY29tcG9uZW50XG4gKlxuICogdmVyc2lvbiA8dHQ+JCBWZXJzaW9uOiAxLjAgJDwvdHQ+IGRhdGU6MjAxNi8wOC8yM1xuICogYXV0aG9yIDxhIGhyZWY9XCJtYWlsdG86aHJhaG5AbmtpYS5jby5rclwiPkFobiBIeXVuZy1SbzwvYT5cbiAqXG4gKiBleGFtcGxlOlxuICogPFB1Zi5NdWx0aVNlbGVjdCBvcHRpb25zPXtvcHRpb25zfSAvPlxuICpcbiAqIEtlbmRvIE11bHRpU2VsZWN0IOudvOydtOu4jOufrOumrOyXkCDsooXsho3soIHsnbTri6QuXG4gKi9cbid1c2Ugc3RyaWN0JztcblxudmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcbnZhciBQcm9wVHlwZXMgPSByZXF1aXJlKCdyZWFjdCcpLlByb3BUeXBlcztcbnZhciBjbGFzc05hbWVzID0gcmVxdWlyZSgnY2xhc3NuYW1lcycpO1xuXG52YXIgVXRpbCA9IHJlcXVpcmUoJy4uL3NlcnZpY2VzL1V0aWwnKTtcblxudmFyIE11bHRpU2VsZWN0ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICAgIGRpc3BsYXlOYW1lOiAnTXVsdGlTZWxlY3QnLFxuICAgIHByb3BUeXBlczoge1xuICAgICAgICBpZDogUHJvcFR5cGVzLnN0cmluZyxcbiAgICAgICAgbmFtZTogUHJvcFR5cGVzLnN0cmluZyxcbiAgICAgICAgY2xhc3NOYW1lOiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgICAgICBob3N0OiBQcm9wVHlwZXMuc3RyaW5nLCAvLyDshJzrsoQg7KCV67O0KENyb3NzIEJyb3dzZXIgQWNjZXNzKVxuICAgICAgICB1cmw6IFByb3BUeXBlcy5zdHJpbmcsXG4gICAgICAgIG1ldGhvZDogUHJvcFR5cGVzLnN0cmluZyxcbiAgICAgICAgZGF0YTogUHJvcFR5cGVzLm9iamVjdCxcbiAgICAgICAgaXRlbXM6IFByb3BUeXBlcy5hcnJheSxcbiAgICAgICAgc2VsZWN0ZWRJdGVtczogUHJvcFR5cGVzLmFycmF5LFxuICAgICAgICBwbGFjZWhvbGRlcjogUHJvcFR5cGVzLnN0cmluZyxcbiAgICAgICAgbGlzdEZpZWxkOiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgICAgICBkYXRhVGV4dEZpZWxkOiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgICAgICBkYXRhVmFsdWVGaWVsZDogUHJvcFR5cGVzLnN0cmluZyxcbiAgICAgICAgbXVsdGlwbGU6IFByb3BUeXBlcy5ib29sLCAgICAgICAgICAgLy8g64uk7KSR7ISg7YOd7J2EIOyngOybkO2VmOupsCwg64ur7Z6I7KeAIOyViuqzoCDsl6zrn6zqsJzrpbwg7ISg7YOd7ZWgIOyImCDsnojri6QuXG4gICAgICAgIGhlYWRlclRlbXBsYXRlOiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgICAgICBpdGVtVGVtcGxhdGU6IFByb3BUeXBlcy5zdHJpbmcsXG4gICAgICAgIHRhZ1RlbXBsYXRlOiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgICAgICBoZWlnaHQ6IFByb3BUeXBlcy5udW1iZXIsXG4gICAgICAgIG9uU2VsZWN0OiBQcm9wVHlwZXMuZnVuYyxcbiAgICAgICAgb25EZXNlbGVjdDogUHJvcFR5cGVzLmZ1bmMsXG4gICAgICAgIG9uQ2hhbmdlOiBQcm9wVHlwZXMuZnVuYyxcbiAgICAgICAgb25PcGVuOiBQcm9wVHlwZXMuZnVuYyxcbiAgICAgICAgb25DbG9zZTogUHJvcFR5cGVzLmZ1bmMsXG4gICAgICAgIG9uRmlsdGVyaW5nOiBQcm9wVHlwZXMuZnVuYyxcbiAgICAgICAgb25EYXRhQm91bmQ6IFByb3BUeXBlcy5mdW5jLFxuICAgICAgICBtaW5MZW5ndGg6IFByb3BUeXBlcy5udW1iZXIsICAgICAgICAgICAgLy8g6rKA7IOJ7IucIO2VhOyalO2VnCDstZzshowg64uo7Ja0IOq4uOydtFxuICAgICAgICBtYXhTZWxlY3RlZEl0ZW1zOiBQcm9wVHlwZXMubnVtYmVyLCAgICAgLy8g7LWc64yAIOyEoO2DnSDsiJhcbiAgICAgICAgcGFyYW1ldGVyTWFwRmllbGQ6IFByb3BUeXBlcy5vYmplY3QsICAgIC8vIFBhZ2luZywgRmlsdGVySnNvblxuICAgICAgICBzZXJ2ZXJGaWx0ZXJpbmc6IFByb3BUeXBlcy5ib29sLCAgICAvLyDshJzrsoQgRmlsdGVyaW5nKOqygOyDieyhsOqxtOyXkCDrlLDrpbgg66as7Iqk7Yq47JeFKVxuICAgICAgICBzZXJ2ZXJQYWdpbmc6IFByb3BUeXBlcy5ib29sLCAgIC8vIOyEnOuyhCBQYWdpbmco66mA7Yuw7IWA66CJ7Yq4IOumrOyKpO2KuCDsoJztlZwpXG4gICAgICAgIHBhZ2VTaXplOiBQcm9wVHlwZXMubnVtYmVyLCAgICAgLy8g7ISc67KE7IKs7J2065OcIFBhZ2UgU2l6ZVxuICAgICAgICBmaWx0ZXJGaWVsZHM6IFByb3BUeXBlcy5hcnJheSAgIC8vIO2VhO2EsCDtlYTrk5wg7KCV7J2YKG9y66GcIOuLpOykkSDqsoDsg4nsi5wg7KCc6rO1KVxuICAgIH0sXG4gICAgaWQ6ICcnLFxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBhcGlcbiAgICB2YWx1ZTogZnVuY3Rpb24odikge1xuICAgICAgICBpZihhcmd1bWVudHMubGVuZ3RoID09IDApIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLm11bHRpU2VsZWN0LnZhbHVlKCk7XG4gICAgICAgIH1lbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLm11bHRpU2VsZWN0LnZhbHVlKHYpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gZXZlbnRcbiAgICBvblNlbGVjdDogZnVuY3Rpb24oZSkge1xuICAgICAgICB2YXIgZGF0YUl0ZW0gPSB0aGlzLm11bHRpU2VsZWN0LmRhdGFTb3VyY2UudmlldygpW2UuaXRlbS5pbmRleCgpXTtcblxuICAgICAgICBpZih0eXBlb2YgdGhpcy5wcm9wcy5vblNlbGVjdCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIHRoaXMucHJvcHMub25TZWxlY3QoZSwgZGF0YUl0ZW0pO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBvbkRlc2VsZWN0OiBmdW5jdGlvbihlKSB7XG4gICAgICAgIGlmKHR5cGVvZiB0aGlzLnByb3BzLm9uRGVzZWxlY3QgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICB0aGlzLnByb3BzLm9uRGVzZWxlY3QoZSwgZS5kYXRhSXRlbSk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIG9uQ2hhbmdlOiBmdW5jdGlvbihlKSB7XG4gICAgICAgIGlmKHR5cGVvZiB0aGlzLnByb3BzLm9uQ2hhbmdlICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgdGhpcy5wcm9wcy5vbkNoYW5nZShlKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgb25PcGVuOiBmdW5jdGlvbihlKSB7XG4gICAgICAgIGlmKHR5cGVvZiB0aGlzLnByb3BzLm9uT3BlbiAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIHRoaXMucHJvcHMub25PcGVuKGUpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBvbkNsb3NlOiBmdW5jdGlvbihlKSB7XG4gICAgICAgIGlmKHR5cGVvZiB0aGlzLnByb3BzLm9uQ2xvc2UgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICB0aGlzLnByb3BzLm9uQ2xvc2UoZSk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIG9uRmlsdGVyaW5nOiBmdW5jdGlvbihlKSB7XG4gICAgICAgIGlmKHR5cGVvZiB0aGlzLnByb3BzLm9uRmlsdGVyaW5nICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgdGhpcy5wcm9wcy5vbkZpbHRlcmluZyhlKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgb25EYXRhQm91bmQ6IGZ1bmN0aW9uKGUpIHtcblxuICAgICAgICBpZih0eXBlb2YgdGhpcy5wcm9wcy5vbkRhdGFCb3VuZCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIHRoaXMucHJvcHMub25EYXRhQm91bmQoZSk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIGdldE9wdGlvbnM6IGZ1bmN0aW9uKCkge1xuICAgICAgICBjb25zdCB7IGhvc3QsIHVybCwgZGF0YSwgbWV0aG9kLCBpdGVtcywgc2VsZWN0ZWRJdGVtcywgcGxhY2Vob2xkZXIsIGxpc3RGaWVsZCwgZGF0YVRleHRGaWVsZCwgZGF0YVZhbHVlRmllbGQsIGhlYWRlclRlbXBsYXRlLCBpdGVtVGVtcGxhdGUsIHRhZ1RlbXBsYXRlLCBoZWlnaHQsIG11bHRpcGxlLCBtaW5MZW5ndGgsIG1heFNlbGVjdGVkSXRlbXMsIHBhcmFtZXRlck1hcEZpZWxkLCBzZXJ2ZXJGaWx0ZXJpbmcsIHNlcnZlclBhZ2luZywgcGFnZVNpemUsIGZpbHRlckZpZWxkcyB9ID0gdGhpcy5wcm9wcztcblxuICAgICAgICB2YXIgb3B0aW9ucyA9IHtcbiAgICAgICAgICAgIHBsYWNlaG9sZGVyOiBwbGFjZWhvbGRlcixcbiAgICAgICAgICAgIGRhdGFUZXh0RmllbGQ6IGRhdGFUZXh0RmllbGQsXG4gICAgICAgICAgICBkYXRhVmFsdWVGaWVsZDogZGF0YVZhbHVlRmllbGQsXG4gICAgICAgICAgICBkYXRhU291cmNlOiBbXVxuICAgICAgICB9O1xuXG4gICAgICAgIGlmKG11bHRpcGxlKXtcbiAgICAgICAgICAgICQuZXh0ZW5kKG9wdGlvbnMsIHsgYXV0b0Nsb3NlOiBmYWxzZSB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmKG1pbkxlbmd0aCA+IDApe1xuICAgICAgICAgICAgJC5leHRlbmQob3B0aW9ucywgeyBtaW5MZW5ndGg6IG1pbkxlbmd0aCB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmKG1heFNlbGVjdGVkSXRlbXMgIT09IG51bGwpe1xuICAgICAgICAgICAgJC5leHRlbmQob3B0aW9ucywgeyBtYXhTZWxlY3RlZEl0ZW1zOiBtYXhTZWxlY3RlZEl0ZW1zIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gZGF0YVNvdXJjZVxuICAgICAgICAvLyB1cmxcbiAgICAgICAgaWYodHlwZW9mIHVybCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICQuZXh0ZW5kKG9wdGlvbnMsIHsgZGF0YVNvdXJjZToge1xuICAgICAgICAgICAgICAgIHRyYW5zcG9ydDoge1xuICAgICAgICAgICAgICAgICAgICByZWFkOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB1cmw6IChob3N0ICYmIGhvc3QgIT09IG51bGwgJiYgaG9zdC5sZW5ndGggPiAwKSA/IGhvc3QgKyB1cmwgOiB1cmwsXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBtZXRob2QsXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nLFxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogZGF0YSwgICAgICAvLyBzZWFyY2ggKEBSZXF1ZXN0Qm9keSBHcmlkUGFyYW0gZ3JpZFBhcmFtIOuhnCDrsJvripTri6QuKVxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGVudFR5cGU6ICdhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04J1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBwYXJhbWV0ZXJNYXA6IGZ1bmN0aW9uKGRhdGEsIHR5cGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKHR5cGUgPT0gXCJyZWFkXCIgJiYgcGFyYW1ldGVyTWFwRmllbGQgIT09IG51bGwpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIOuNsOydtO2EsCDsnb3slrTsmKzrlYwg7ZWE7JqU7ZWcIOuNsOydtO2EsChleDrtjpjsnbTsp4DqtIDroKgp6rCAIOyeiOycvOuptCBkYXRh66W8IGNvcHntlZzri6QuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yKGxldCBjb3B5IGluIHBhcmFtZXRlck1hcEZpZWxkKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYodHlwZW9mIHBhcmFtZXRlck1hcEZpZWxkW2NvcHldID09PSBcInN0cmluZ1wiICYmICggY29weSBpbiBkYXRhICkpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YVtwYXJhbWV0ZXJNYXBGaWVsZFtjb3B5XV0gPSBkYXRhW2NvcHldO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYocGFyYW1ldGVyTWFwRmllbGQuZmlsdGVyc1RvSnNvbiAmJiBkYXRhLmZpbHRlciAmJiBkYXRhLmZpbHRlci5maWx0ZXJzKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gRmlsdGVyIEFycmF5ID0+IEpzb24gT2JqZWN0IENvcHlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGZpbHRlcnMgPSBkYXRhLmZpbHRlci5maWx0ZXJzO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWx0ZXJzLm1hcCgoZmlsdGVyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgZmllbGQgPSAocGFyYW1ldGVyTWFwRmllbGQuZmlsdGVyUHJlZml4KSA/IHBhcmFtZXRlck1hcEZpZWxkLmZpbHRlclByZWZpeCArIGZpbHRlci5maWVsZCA6IGZpbHRlci5maWVsZDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKHBhcmFtZXRlck1hcEZpZWxkLmZpbHRlckZpZWxkVG9Mb3dlckNhc2Upe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFbZmllbGQudG9Mb3dlckNhc2UoKV0gPSBmaWx0ZXIudmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhW2ZpZWxkXSA9IGZpbHRlci52YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KGRhdGEpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBzY2hlbWE6IHtcbiAgICAgICAgICAgICAgICAgICAgLy8gcmV0dXJuZWQgaW4gdGhlIFwibGlzdEZpZWxkXCIgZmllbGQgb2YgdGhlIHJlc3BvbnNlXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbGlzdEZpZWxkcyA9IFtdLCBkYXRhTGlzdCA9IHJlc3BvbnNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYobGlzdEZpZWxkICYmIGxpc3RGaWVsZC5sZW5ndGggPiAwICYmIGxpc3RGaWVsZCAhPSAnbnVsbCcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsaXN0RmllbGRzID0gbGlzdEZpZWxkLnNwbGl0KCcuJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGlzdEZpZWxkcy5tYXAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChmaWVsZCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YUxpc3QgPSBkYXRhTGlzdFtmaWVsZF07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRhdGFMaXN0O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBzZXJ2ZXJGaWx0ZXJpbmc6IHNlcnZlckZpbHRlcmluZyxcbiAgICAgICAgICAgICAgICBzZXJ2ZXJQYWdpbmc6IHNlcnZlclBhZ2luZyxcbiAgICAgICAgICAgICAgICBwYWdlU2l6ZTogcGFnZVNpemVcbiAgICAgICAgICAgIH0gfSk7XG5cbiAgICAgICAgfWVsc2UgaWYodHlwZW9mIGl0ZW1zICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgJC5leHRlbmQob3B0aW9ucywgeyBkYXRhU291cmNlOiBpdGVtcyB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHNlbGVjdGVkSXRlbXNcbiAgICAgICAgaWYodHlwZW9mIHNlbGVjdGVkSXRlbXMgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAkLmV4dGVuZChvcHRpb25zLCB7IHZhbHVlOiBzZWxlY3RlZEl0ZW1zIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gaGVhZGVyVGVtcGxhdGVcbiAgICAgICAgaWYodHlwZW9mIGhlYWRlclRlbXBsYXRlICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgJC5leHRlbmQob3B0aW9ucywgeyBoZWFkZXJUZW1wbGF0ZTogaGVhZGVyVGVtcGxhdGUgfSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBpdGVtVGVtcGxhdGVcbiAgICAgICAgaWYodHlwZW9mIGl0ZW1UZW1wbGF0ZSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICQuZXh0ZW5kKG9wdGlvbnMsIHsgaXRlbVRlbXBsYXRlOiBpdGVtVGVtcGxhdGUgfSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyB0YWdUZW1wbGF0ZVxuICAgICAgICBpZih0eXBlb2YgdGFnVGVtcGxhdGUgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAkLmV4dGVuZChvcHRpb25zLCB7IHRhZ1RlbXBsYXRlOiB0YWdUZW1wbGF0ZSB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGhlaWdodFxuICAgICAgICBpZih0eXBlb2YgaGVpZ2h0ICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgJC5leHRlbmQob3B0aW9ucywgeyBoZWlnaHQ6IGhlaWdodCB9KTtcbiAgICAgICAgfVxuICAgICAgICBpZihmaWx0ZXJGaWVsZHMgIT09IG51bGwgJiYgQXJyYXkuaXNBcnJheShmaWx0ZXJGaWVsZHMpKXtcbiAgICAgICAgICAgICQuZXh0ZW5kKG9wdGlvbnMsIHsgZmlsdGVyaW5nOiBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgICAgIGlmIChlLmZpbHRlcikge1xuICAgICAgICAgICAgICAgICAgICBsZXQgZmllbGRzID0gZmlsdGVyRmllbGRzO1xuICAgICAgICAgICAgICAgICAgICB2YXIgdmFsdWUgPSBlLmZpbHRlci52YWx1ZTtcblxuICAgICAgICAgICAgICAgICAgICBsZXQgbmV3RmllbGRzID0gW107XG4gICAgICAgICAgICAgICAgICAgIGZpZWxkcy5tYXAoZmllbGQgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgbmV3RmllbGRzLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpZWxkOiBmaWVsZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcGVyYXRvcjogXCJjb250YWluc1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiB2YWx1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgIHZhciBuZXdGaWx0ZXIgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmaWx0ZXJzOiBuZXdGaWVsZHMsXG4gICAgICAgICAgICAgICAgICAgICAgICBsb2dpYzogXCJvclwiXG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgIGUuc2VuZGVyLmRhdGFTb3VyY2UuZmlsdGVyKG5ld0ZpbHRlcik7XG4gICAgICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgfSB9KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gb3B0aW9ucztcbiAgICB9LFxuXHRnZXREZWZhdWx0UHJvcHM6IGZ1bmN0aW9uKCkge1xuXHRcdC8vIO2BtOuemOyKpOqwgCDsg53shLHrkKAg65WMIO2VnOuyiCDtmLjstpzrkJjqs6Ag7LqQ7Iuc65Cc64ukLlxuXHRcdC8vIOu2gOuqqCDsu7Ttj6zrhIztirjsl5DshJwgcHJvcOydtCDrhJjslrTsmKTsp4Ag7JWK7J2AIOqyveyasCAoaW4g7Jew7IKw7J6Q66GcIO2ZleyduCkg66ek7ZWR7J2YIOqwkuydtCB0aGlzLnByb3Bz7JeQIOyEpOygleuQnOuLpC5cblx0XHRyZXR1cm4ge21ldGhvZDogJ1BPU1QnLCBsaXN0RmllbGQ6ICdyZXN1bHRWYWx1ZS5saXN0JywgcGxhY2Vob2xkZXI6ICRwc19sb2NhbGUuc2VsZWN0LCBkYXRhVGV4dEZpZWxkOiAndGV4dCcsIGRhdGFWYWx1ZUZpZWxkOiAndmFsdWUnLCBtdWx0aXBsZTogZmFsc2UsIG1pbkxlbmd0aDogMCwgbWF4U2VsZWN0ZWRJdGVtczogbnVsbCwgc2VydmVyRmlsdGVyaW5nOiBmYWxzZSwgc2VydmVyUGFnaW5nOiBmYWxzZSwgcGFnZVNpemU6IDEwLCBmaWx0ZXJGaWVsZHM6IG51bGx9O1xuXHR9LFxuICAgIGNvbXBvbmVudFdpbGxNb3VudDogZnVuY3Rpb24oKSB7XG4gICAgICAgIC8vIOy1nOy0iCDroIzrjZTrp4HsnbQg7J287Ja064KY6riwIOyngeyghCjtlZzrsogg7Zi47LacKVxuICAgICAgICBsZXQgaWQgPSB0aGlzLnByb3BzLmlkO1xuICAgICAgICBpZih0eXBlb2YgaWQgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICBpZCA9IFV0aWwuZ2V0VVVJRCgpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuaWQgPSBpZDtcbiAgICB9LFxuICAgIGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbigpIHtcbiAgICAgICAgLy8g7LWc7LSIIOugjOuNlOungeydtCDsnbzslrTrgpwg64uk7J2MKO2VnOuyiCDtmLjstpwpXG4gICAgICAgIHRoaXMuJG11bHRpU2VsZWN0ID0gJCgnIycrdGhpcy5pZCk7XG4gICAgICAgIHRoaXMubXVsdGlTZWxlY3QgPSB0aGlzLiRtdWx0aVNlbGVjdC5rZW5kb011bHRpU2VsZWN0KHRoaXMuZ2V0T3B0aW9ucygpKS5kYXRhKCdrZW5kb011bHRpU2VsZWN0Jyk7XG5cbiAgICAgICAgLy8gRXZlbnRzXG4gICAgICAgIHRoaXMubXVsdGlTZWxlY3QuYmluZCgnc2VsZWN0JywgdGhpcy5vblNlbGVjdCk7XG4gICAgICAgIHRoaXMubXVsdGlTZWxlY3QuYmluZCgnZGVzZWxlY3QnLCB0aGlzLm9uRGVzZWxlY3QpO1xuICAgICAgICB0aGlzLm11bHRpU2VsZWN0LmJpbmQoJ2NoYW5nZScsIHRoaXMub25DaGFuZ2UpO1xuICAgICAgICB0aGlzLm11bHRpU2VsZWN0LmJpbmQoJ29wZW4nLCB0aGlzLm9uT3Blbik7XG4gICAgICAgIHRoaXMubXVsdGlTZWxlY3QuYmluZCgnY2xvc2UnLCB0aGlzLm9uQ2xvc2UpO1xuICAgICAgICB0aGlzLm11bHRpU2VsZWN0LmJpbmQoJ2ZpbHRlcmluZycsIHRoaXMub25GaWx0ZXJpbmcpO1xuICAgICAgICB0aGlzLm11bHRpU2VsZWN0LmJpbmQoJ2RhdGFCb3VuZCcsIHRoaXMub25EYXRhQm91bmQpO1xuICAgIH0sXG4gICAgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICAgICAgLy8g7ZWE7IiYIO2VreuqqVxuICAgICAgICBjb25zdCB7IGNsYXNzTmFtZSwgbmFtZSwgbXVsdGlwbGUgfSA9IHRoaXMucHJvcHM7XG5cbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxzZWxlY3QgaWQ9e3RoaXMuaWR9IG5hbWU9e25hbWV9IG11bHRpcGxlPXttdWx0aXBsZX0gY2xhc3NOYW1lPXtjbGFzc05hbWVzKGNsYXNzTmFtZSl9Pjwvc2VsZWN0PlxuICAgICAgICApO1xuICAgIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IE11bHRpU2VsZWN0O1xuIiwiLyoqXG4gKiBOdW1lcmljVGV4dEJveCBjb21wb25lbnRcbiAqXG4gKiB2ZXJzaW9uIDx0dD4kIFZlcnNpb246IDEuMCAkPC90dD4gZGF0ZToyMDE2LzA4LzMxXG4gKiBhdXRob3IgPGEgaHJlZj1cIm1haWx0bzpocmFobkBua2lhLmNvLmtyXCI+QWhuIEh5dW5nLVJvPC9hPlxuICpcbiAqIGV4YW1wbGU6XG4gKiA8UHVmLk51bWVyaWNUZXh0Qm94IG9wdGlvbnM9e29wdGlvbnN9IC8+XG4gKlxuICogS2VuZG8gTnVtZXJpY1RleHRCb3gg65287J2067iM65+s66as7JeQIOyiheyGjeyggeydtOuLpC5cbiAqL1xuJ3VzZSBzdHJpY3QnO1xuXG52YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xudmFyIFByb3BUeXBlcyA9IHJlcXVpcmUoJ3JlYWN0JykuUHJvcFR5cGVzO1xudmFyIGNsYXNzTmFtZXMgPSByZXF1aXJlKCdjbGFzc25hbWVzJyk7XG5cbnZhciBVdGlsID0gcmVxdWlyZSgnLi4vc2VydmljZXMvVXRpbCcpO1xuXG52YXIgTnVtZXJpY1RleHRCb3ggPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gICAgZGlzcGxheU5hbWU6ICdOdW1lcmljVGV4dEJveCcsXG4gICAgcHJvcFR5cGVzOiB7XG4gICAgICAgIGlkOiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgICAgICBjbGFzc05hbWU6IFByb3BUeXBlcy5zdHJpbmcsXG4gICAgICAgIG5hbWU6IFByb3BUeXBlcy5zdHJpbmcsXG4gICAgICAgIHdpZHRoOiBQcm9wVHlwZXMub25lT2ZUeXBlKFtcbiAgICAgICAgICAgIFByb3BUeXBlcy5zdHJpbmcsXG4gICAgICAgICAgICBQcm9wVHlwZXMubnVtYmVyXG4gICAgICAgIF0pLFxuICAgICAgICBmb3JtYXQ6IFByb3BUeXBlcy5zdHJpbmcsXG4gICAgICAgIHZhbHVlOiBQcm9wVHlwZXMubnVtYmVyLFxuICAgICAgICBzdGVwOiBQcm9wVHlwZXMubnVtYmVyLFxuICAgICAgICBtaW46IFByb3BUeXBlcy5udW1iZXIsXG4gICAgICAgIG1heDogUHJvcFR5cGVzLm51bWJlcixcbiAgICAgICAgZGVjaW1hbHM6IFByb3BUeXBlcy5udW1iZXIsXG4gICAgICAgIHBsYWNlaG9sZGVyOiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgICAgICBkb3duQXJyb3dUZXh0OiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgICAgICB1cEFycm93VGV4dDogUHJvcFR5cGVzLnN0cmluZyxcbiAgICAgICAgb25DaGFuZ2U6IFByb3BUeXBlcy5mdW5jXG4gICAgfSxcbiAgICBpZDogJycsXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIGFwaVxuICAgIHZhbHVlOiBmdW5jdGlvbih2KSB7XG4gICAgICAgIGlmKGFyZ3VtZW50cy5sZW5ndGggPT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMubnVtZXJpY1RleHRCb3gudmFsdWUoKTtcbiAgICAgICAgfWVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMubnVtZXJpY1RleHRCb3gudmFsdWUodik7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBldmVudFxuICAgIG9uQ2hhbmdlOiBmdW5jdGlvbihlKSB7XG4gICAgICAgIGlmKHR5cGVvZiB0aGlzLnByb3BzLm9uQ2hhbmdlICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgdGhpcy5wcm9wcy5vbkNoYW5nZShlLCB0aGlzLnZhbHVlKCkpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBnZXRPcHRpb25zOiBmdW5jdGlvbigpIHtcbiAgICAgICAgY29uc3QgeyBmb3JtYXQsIHZhbHVlLCBzdGVwLCBtaW4sIG1heCwgZGVjaW1hbHMsIHBsYWNlaG9sZGVyLCBkb3duQXJyb3dUZXh0LCB1cEFycm93VGV4dCB9ID0gdGhpcy5wcm9wcztcblxuICAgICAgICB2YXIgb3B0aW9ucyA9IHtcbiAgICAgICAgICAgIGZvcm1hdDogZm9ybWF0LFxuICAgICAgICAgICAgdmFsdWU6IHZhbHVlLFxuICAgICAgICAgICAgZG93bkFycm93VGV4dDogZG93bkFycm93VGV4dCxcbiAgICAgICAgICAgIHVwQXJyb3dUZXh0OiB1cEFycm93VGV4dFxuICAgICAgICB9O1xuXG4gICAgICAgIC8vIHN0ZXBcbiAgICAgICAgaWYodHlwZW9mIHN0ZXAgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAkLmV4dGVuZChvcHRpb25zLCB7IHN0ZXA6IHN0ZXAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBtaW5cbiAgICAgICAgaWYodHlwZW9mIG1pbiAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICQuZXh0ZW5kKG9wdGlvbnMsIHsgbWluOiBtaW4gfSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBtYXhcbiAgICAgICAgaWYodHlwZW9mIG1heCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICQuZXh0ZW5kKG9wdGlvbnMsIHsgbWF4OiBtYXggfSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBkZWNpbWFsc1xuICAgICAgICBpZih0eXBlb2YgZGVjaW1hbHMgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAkLmV4dGVuZChvcHRpb25zLCB7IGRlY2ltYWxzOiBkZWNpbWFscyB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHBsYWNlaG9sZGVyXG4gICAgICAgIGlmKHR5cGVvZiBwbGFjZWhvbGRlciAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICQuZXh0ZW5kKG9wdGlvbnMsIHsgcGxhY2Vob2xkZXI6IHBsYWNlaG9sZGVyIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG9wdGlvbnM7XG4gICAgfSxcblx0Z2V0RGVmYXVsdFByb3BzOiBmdW5jdGlvbigpIHtcblx0XHQvLyDtgbTrnpjsiqTqsIAg7IOd7ISx65CgIOuVjCDtlZzrsogg7Zi47Lac65CY6rOgIOy6kOyLnOuQnOuLpC5cblx0XHQvLyDrtoDrqqgg7Lu07Y+s64SM7Yq47JeQ7IScIHByb3DsnbQg64SY7Ja07Jik7KeAIOyViuydgCDqsr3smrAgKGluIOyXsOyCsOyekOuhnCDtmZXsnbgpIOunpO2VkeydmCDqsJLsnbQgdGhpcy5wcm9wc+yXkCDshKTsoJXrkJzri6QuXG5cdFx0cmV0dXJuIHsgZm9ybWF0OiAnbjAnLCB2YWx1ZTogMSwgZG93bkFycm93VGV4dDogJycsIHVwQXJyb3dUZXh0OiAnJyB9O1xuXHR9LFxuICAgIGNvbXBvbmVudFdpbGxNb3VudDogZnVuY3Rpb24oKSB7XG4gICAgICAgIC8vIOy1nOy0iCDroIzrjZTrp4HsnbQg7J287Ja064KY6riwIOyngeyghCjtlZzrsogg7Zi47LacKVxuICAgICAgICBsZXQgaWQgPSB0aGlzLnByb3BzLmlkO1xuICAgICAgICBpZih0eXBlb2YgaWQgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICBpZCA9IFV0aWwuZ2V0VVVJRCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5pZCA9IGlkO1xuICAgIH0sXG4gICAgY29tcG9uZW50RGlkTW91bnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAvLyDstZzstIgg66CM642U66eB7J20IOydvOyWtOuCnCDri6TsnYwo7ZWc67KIIO2YuOy2nClcbiAgICAgICAgdGhpcy4kbnVtZXJpY1RleHRCb3ggPSAkKCcjJyt0aGlzLmlkKTtcbiAgICAgICAgdGhpcy5udW1lcmljVGV4dEJveCA9IHRoaXMuJG51bWVyaWNUZXh0Qm94LmtlbmRvTnVtZXJpY1RleHRCb3godGhpcy5nZXRPcHRpb25zKCkpLmRhdGEoJ2tlbmRvTnVtZXJpY1RleHRCb3gnKTtcblxuICAgICAgICAvLyBFdmVudHNcbiAgICAgICAgdGhpcy5udW1lcmljVGV4dEJveC5iaW5kKCdjaGFuZ2UnLCB0aGlzLm9uQ2hhbmdlKTtcbiAgICB9LFxuICAgIHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgICAgIC8vIO2VhOyImCDtla3rqqlcbiAgICAgICAgY29uc3QgeyBjbGFzc05hbWUsIG5hbWUsIHdpZHRoIH0gPSB0aGlzLnByb3BzO1xuXG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8aW5wdXQgaWQ9e3RoaXMuaWR9IG5hbWU9e25hbWV9IHN0eWxlPXt7d2lkdGg6IHdpZHRofX0gLz5cbiAgICAgICAgKTtcbiAgICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBOdW1lcmljVGV4dEJveDsiLCIvKipcbiAqIFBhbmVsQmFyIGNvbXBvbmVudFxuICpcbiAqIHZlcnNpb24gPHR0PiQgVmVyc2lvbjogMS4wICQ8L3R0PiBkYXRlOjIwMTYvMDgvMThcbiAqIGF1dGhvciA8YSBocmVmPVwibWFpbHRvOmhyYWhuQG5raWEuY28ua3JcIj5BaG4gSHl1bmctUm88L2E+XG4gKlxuICogZXhhbXBsZTpcbiAqIDxQdWYuUGFuZWxCYXIgb3B0aW9ucz17b3B0aW9uc30gLz5cbiAqXG4gKiBLZW5kbyBQYW5lbEJhciDrnbzsnbTruIzrn6zrpqzsl5Ag7KKF7IaN7KCB7J2064ukLlxuICovXG4ndXNlIHN0cmljdCc7XG5cbnZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG52YXIgUHJvcFR5cGVzID0gcmVxdWlyZSgncmVhY3QnKS5Qcm9wVHlwZXM7XG52YXIgY2xhc3NOYW1lcyA9IHJlcXVpcmUoJ2NsYXNzbmFtZXMnKTtcblxudmFyIFV0aWwgPSByZXF1aXJlKCcuLi9zZXJ2aWNlcy9VdGlsJyk7XG5cbnZhciBQYW5lbEJhciA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgICBkaXNwbGF5TmFtZTogJ1BhbmVsQmFyJyxcbiAgICBwcm9wVHlwZXM6IHtcbiAgICAgICAgaWQ6IFByb3BUeXBlcy5zdHJpbmcsXG4gICAgICAgIGNsYXNzTmFtZTogUHJvcFR5cGVzLnN0cmluZyxcbiAgICAgICAgY29udGVudFVybHM6IFByb3BUeXBlcy5hcnJheVxuICAgIH0sXG4gICAgaWQ6ICcnLFxuICAgIGV4cGFuZDogZnVuY3Rpb24oJGl0ZW0pIHtcbiAgICAgICAgdGhpcy5wYW5lbEJhci5leHBhbmQoJGl0ZW0pO1xuICAgIH0sXG4gICAgb25TZWxlY3Q6IGZ1bmN0aW9uKGUpIHtcblxuICAgIH0sXG4gICAgZ2V0T3B0aW9uczogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB7fVxuICAgIH0sXG5cdGdldERlZmF1bHRQcm9wczogZnVuY3Rpb24oKSB7XG5cdFx0Ly8g7YG0656Y7Iqk6rCAIOyDneyEseuQoCDrlYwg7ZWc67KIIO2YuOy2nOuQmOqzoCDsupDsi5zrkJzri6QuXG5cdFx0Ly8g67aA66qoIOy7tO2PrOuEjO2KuOyXkOyEnCBwcm9w7J20IOuEmOyWtOyYpOyngCDslYrsnYAg6rK97JqwIChpbiDsl7DsgrDsnpDroZwg7ZmV7J24KSDrp6TtlZHsnZgg6rCS7J20IHRoaXMucHJvcHPsl5Ag7ISk7KCV65Cc64ukLlxuXHRcdHJldHVybiB7dmFsdWU6ICdkZWZhdWx0IHZhbHVlJ307XG5cdH0sXG4gICAgZ2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbigpIHtcblx0XHQvLyDsu7Ttj6zrhIztirjqsIAg66eI7Jq07Yq465CY6riwIOyghCAo7ZWc67KIIO2YuOy2nCkgLyDrpqzthLTqsJLsnYAgdGhpcy5zdGF0ZeydmCDstIjquLDqsJLsnLzroZwg7IKs7JqpXG4gICAgICAgIHJldHVybiB7ZGF0YTogW119O1xuICAgIH0sXG4gICAgY29tcG9uZW50V2lsbE1vdW50OiBmdW5jdGlvbigpIHtcbiAgICAgICAgLy8g7LWc7LSIIOugjOuNlOungeydtCDsnbzslrTrgpjquLAg7KeB7KCEKO2VnOuyiCDtmLjstpwpXG4gICAgICAgIGxldCBpZCA9IHRoaXMucHJvcHMuaWQ7XG4gICAgICAgIGlmKHR5cGVvZiBpZCA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIGlkID0gVXRpbC5nZXRVVUlEKCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmlkID0gaWQ7XG4gICAgfSxcbiAgICBjb21wb25lbnREaWRNb3VudDogZnVuY3Rpb24oKSB7XG4gICAgICAgIC8vIOy1nOy0iCDroIzrjZTrp4HsnbQg7J287Ja064KcIOuLpOydjCjtlZzrsogg7Zi47LacKVxuICAgICAgICB0aGlzLiRwYW5lbEJhciA9ICQoJyMnK3RoaXMuaWQpO1xuICAgICAgICB0aGlzLnBhbmVsQmFyID0gdGhpcy4kcGFuZWxCYXIua2VuZG9QYW5lbEJhcih0aGlzLmdldE9wdGlvbnMoKSkuZGF0YSgna2VuZG9QYW5lbEJhcicpO1xuXG4gICAgICAgIC8vIEV2ZW50c1xuICAgICAgICB0aGlzLnBhbmVsQmFyLmJpbmQoJ3NlbGVjdCcsIHRoaXMub25TZWxlY3QpO1xuICAgIH0sXG4gICAgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICAgICAgLy8g7ZWE7IiYIO2VreuqqVxuICAgICAgICBjb25zdCB7Y2xhc3NOYW1lLCBjaGlsZHJlbn0gPSB0aGlzLnByb3BzO1xuXG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8dWwgaWQ9e3RoaXMuaWR9IGNsYXNzTmFtZT17Y2xhc3NOYW1lcyhjbGFzc05hbWUpfT57Y2hpbGRyZW59PC91bD5cbiAgICAgICAgKTtcbiAgICB9XG59KTtcblxudmFyIFBhbmVsQmFyUGFuZSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgICBkaXNwbGF5TmFtZTogJ1BhbmVsQmFyUGFuZScsXG4gICAgcHJvcFR5cGVzOiB7XG4gICAgICAgIGlkOiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgICAgICB0aXRsZTogUHJvcFR5cGVzLnN0cmluZyxcbiAgICAgICAgaXRlbXM6IFByb3BUeXBlcy5hcnJheVxuICAgIH0sXG4gICAgZ2V0Q29udGVudDogZnVuY3Rpb24oKSB7XG4gICAgICAgIGNvbnN0IHtpdGVtcywgY2hpbGRyZW4sIGNvbnRlbnRVcmxzfSA9IHRoaXMucHJvcHM7XG4gICAgICAgIHZhciBjb250ZW50O1xuXG4gICAgICAgIGlmKGl0ZW1zKSB7XG4gICAgICAgICAgICB2YXIgX2l0ZW1zID0gaXRlbXMubWFwKGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICAgICAgICAgICAgICBpZih0eXBlb2YgaXRlbSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGljb24sIHRleHQ7XG4gICAgICAgICAgICAgICAgICAgIGlmKGl0ZW0uaGFzT3duUHJvcGVydHkoJ3Nwcml0ZUNzc0NsYXNzJykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGljb24gPSA8c3BhbiBjbGFzc05hbWU9e2NsYXNzTmFtZXMoaXRlbS5zcHJpdGVDc3NDbGFzcyl9Pjwvc3Bhbj47XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYoaXRlbS5oYXNPd25Qcm9wZXJ0eSgnaW1hZ2VVcmwnKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWNvbiA9IDxpbWcgc3JjPXtpdGVtLmltYWdlVXJsfSAvPjtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGlmKGl0ZW0uaGFzT3duUHJvcGVydHkoJ3RleHQnKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dCA9IGl0ZW0udGV4dDtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHZhciBkYXRhO1xuICAgICAgICAgICAgICAgICAgICBpZihpdGVtLmhhc093blByb3BlcnR5KCdkYXRhJykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEgPSB7IGRhdGE6IEpTT04uc3RyaW5naWZ5KGl0ZW0uZGF0YSkgfTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAvL3JldHVybiAoPGxpIGtleT17VXRpbC51bmlxdWVJRCgpfT57aWNvbn0ge3RleHR9PC9saT4pO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gKDxsaSB7Li4uZGF0YX0+e2ljb259IHt0ZXh0fTwvbGk+KTtcbiAgICAgICAgICAgICAgICAgICAgLy9yZXR1cm4gPFBhbmVsQmFyUGFuZUl0ZW0gZGF0YT17ZGF0YX0+e2ljb259IHt0ZXh0fTwvUGFuZWxCYXJQYW5lSXRlbT47XG4gICAgICAgICAgICAgICAgfWVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvL3JldHVybiAoPGxpIGtleT17VXRpbC51bmlxdWVJRCgpfT57aXRlbX08L2xpPik7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAoPGxpPntpdGVtfTwvbGk+KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGNvbnRlbnQgPSA8dWw+e19pdGVtc308L3VsPjtcblxuICAgICAgICB9ZWxzZSBpZihjaGlsZHJlbikge1xuICAgICAgICAgICAgY29udGVudCA9IGNoaWxkcmVuO1xuXG4gICAgICAgIH1lbHNlIHtcbiAgICAgICAgICAgIC8vIGNvbnRlbnRVcmxzIOydtOudvOqzoCDtjJDri6hcbiAgICAgICAgICAgIGNvbnRlbnQgPSA8ZGl2PjwvZGl2PjtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBjb250ZW50O1xuICAgIH0sXG4gICAgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICAgICAgLy8g7ZWE7IiYIO2VreuqqVxuICAgICAgICBjb25zdCB7aWQsIHRpdGxlfSA9IHRoaXMucHJvcHM7XG5cbiAgICAgICAgdmFyIF9pZDtcbiAgICAgICAgaWYoaWQpIHtcbiAgICAgICAgICAgIF9pZCA9IHtpZDogaWR9O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8bGkgey4uLl9pZH0+XG4gICAgICAgICAgICAgICAge3RpdGxlfVxuICAgICAgICAgICAgICAgIHt0aGlzLmdldENvbnRlbnQoKX1cbiAgICAgICAgICAgIDwvbGk+XG4gICAgICAgICk7XG4gICAgfVxufSk7XG5cbnZhciBQYW5lbEJhclBhbmVJdGVtID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICAgIHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgICAgIGNvbnN0IHsgZGF0YSB9ID0gdGhpcy5wcm9wcztcbiAgICAgICAgcmV0dXJuICg8bGkgey4uLmRhdGF9Pnt0aGlzLnByb3BzLmNoaWxkcmVufTwvbGk+KTtcbiAgICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgUGFuZWxCYXI6IFBhbmVsQmFyLFxuICAgIFBhbmVsQmFyUGFuZTogUGFuZWxCYXJQYW5lXG59OyIsIi8qKlxuICogUHJvZ3Jlc3NCYXIgY29tcG9uZW50XG4gKlxuICogdmVyc2lvbiA8dHQ+JCBWZXJzaW9uOiAxLjAgJDwvdHQ+IGRhdGU6MjAxNi8wOS8wNlxuICogYXV0aG9yIDxhIGhyZWY9XCJtYWlsdG86aHJhaG5AbmtpYS5jby5rclwiPkFobiBIeXVuZy1SbzwvYT5cbiAqXG4gKiBleGFtcGxlOlxuICogPFB1Zi5Qcm9ncmVzc0JhciBvcHRpb25zPXtvcHRpb25zfSAvPlxuICpcbiAqIEtlbmRvIFByb2dyZXNzQmFyIOudvOydtOu4jOufrOumrOyXkCDsooXsho3soIHsnbTri6QuXG4gKi9cbid1c2Ugc3RyaWN0JztcblxudmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcbnZhciBQcm9wVHlwZXMgPSByZXF1aXJlKCdyZWFjdCcpLlByb3BUeXBlcztcbnZhciBjbGFzc05hbWVzID0gcmVxdWlyZSgnY2xhc3NuYW1lcycpO1xuXG52YXIgVXRpbCA9IHJlcXVpcmUoJy4uL3NlcnZpY2VzL1V0aWwnKTtcblxudmFyIFByb2dyZXNzQmFyID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICAgIGRpc3BsYXlOYW1lOiAnUHJvZ3Jlc3NCYXInLFxuICAgIHByb3BUeXBlczoge1xuICAgICAgICBpZDogUHJvcFR5cGVzLnN0cmluZyxcbiAgICAgICAgY2xhc3NOYW1lOiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgICAgICB0eXBlOiBQcm9wVHlwZXMub25lT2YoWyd2YWx1ZScsICdwZXJjZW50JywgJ2NodW5rJ10pLFxuICAgICAgICB2YWx1ZTogUHJvcFR5cGVzLm51bWJlcixcbiAgICAgICAgYW5pbWF0aW9uOiBQcm9wVHlwZXMub25lT2ZUeXBlKFtcbiAgICAgICAgICAgIFByb3BUeXBlcy5udW1iZXIsXG4gICAgICAgICAgICBQcm9wVHlwZXMuYm9vbCxcbiAgICAgICAgICAgIFByb3BUeXBlcy5vYmplY3RcbiAgICAgICAgXSksXG4gICAgICAgIG1pbjogUHJvcFR5cGVzLm51bWJlcixcbiAgICAgICAgbWF4OiBQcm9wVHlwZXMubnVtYmVyLFxuICAgICAgICBlbmFibGU6IFByb3BUeXBlcy5ib29sLFxuICAgICAgICBvcmllbnRhdGlvbjogUHJvcFR5cGVzLm9uZU9mKFsnaG9yaXpvbnRhbCcsICd2ZXJ0aWNhbCddKSxcbiAgICAgICAgb25DaGFuZ2U6IFByb3BUeXBlcy5mdW5jLFxuICAgICAgICBvbkNvbXBsZXRlOiBQcm9wVHlwZXMuZnVuY1xuICAgIH0sXG4gICAgaWQ6ICcnLFxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBhcGlcbiAgICB2YWx1ZTogZnVuY3Rpb24odikge1xuICAgICAgICBpZihhcmd1bWVudHMubGVuZ3RoID09IDApIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnByb2dyZXNzQmFyLnZhbHVlKCk7XG4gICAgICAgIH1lbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnByb2dyZXNzQmFyLnZhbHVlKHYpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBlbmFibGU6IGZ1bmN0aW9uKGIpIHtcbiAgICAgICAgaWYoYXJndW1lbnRzLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgICAgICB0aGlzLnByb2dyZXNzQmFyLmVuYWJsZSgpO1xuICAgICAgICB9ZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnByb2dyZXNzQmFyLmVuYWJsZShiKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIGV2ZW50XG4gICAgb25DaGFuZ2U6IGZ1bmN0aW9uKGUpIHtcblxuICAgICAgICBpZih0eXBlb2YgdGhpcy5wcm9wcy5vbkNoYW5nZSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIHRoaXMucHJvcHMub25DaGFuZ2UoZS52YWx1ZSk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIG9uQ29tcGxldGU6IGZ1bmN0aW9uKGUpIHtcblxuICAgICAgICBpZih0eXBlb2YgdGhpcy5wcm9wcy5vbkNvbXBsZXRlICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgdGhpcy5wcm9wcy5vbkNvbXBsZXRlKGUudmFsdWUpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBnZXRPcHRpb25zOiBmdW5jdGlvbigpIHtcbiAgICAgICAgY29uc3QgeyB0eXBlLCB2YWx1ZSwgYW5pbWF0aW9uLCBlbmFibGUsIG9yaWVudGF0aW9uIH0gPSB0aGlzLnByb3BzO1xuXG4gICAgICAgIC8vIGFuaW1hdGlvblxuICAgICAgICB2YXIgX2FuaW1hdGlvbjtcbiAgICAgICAgaWYodHlwZW9mIGFuaW1hdGlvbiA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgIF9hbmltYXRpb24gPSB7IGR1cmF0aW9uOiBhbmltYXRpb24gfTtcbiAgICAgICAgfWVsc2UgaWYoYW5pbWF0aW9uID09PSB0cnVlKSB7XG4gICAgICAgICAgICBfYW5pbWF0aW9uID0geyBkdXJhdGlvbjogNjAwIH07XG4gICAgICAgIH1lbHNlIHtcbiAgICAgICAgICAgIF9hbmltYXRpb24gPSBhbmltYXRpb247XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgb3B0aW9ucyA9IHtcbiAgICAgICAgICAgIHR5cGU6IHR5cGUsXG4gICAgICAgICAgICB2YWx1ZTogdmFsdWUsXG4gICAgICAgICAgICBhbmltYXRpb246IF9hbmltYXRpb24sXG4gICAgICAgICAgICBlbmFibGU6IGVuYWJsZSxcbiAgICAgICAgICAgIG9yaWVudGF0aW9uOiBvcmllbnRhdGlvblxuICAgICAgICB9O1xuXG4gICAgICAgIC8vIG1pblxuICAgICAgICBpZih0eXBlb2YgbWluICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgJC5leHRlbmQob3B0aW9ucywgeyBtaW46IG1pbiB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIG1heFxuICAgICAgICBpZih0eXBlb2YgbWF4ICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgJC5leHRlbmQob3B0aW9ucywgeyBtYXg6IG1heCB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBvcHRpb25zO1xuICAgIH0sXG5cdGdldERlZmF1bHRQcm9wczogZnVuY3Rpb24oKSB7XG5cdFx0Ly8g7YG0656Y7Iqk6rCAIOyDneyEseuQoCDrlYwg7ZWc67KIIO2YuOy2nOuQmOqzoCDsupDsi5zrkJzri6QuXG5cdFx0Ly8g67aA66qoIOy7tO2PrOuEjO2KuOyXkOyEnCBwcm9w7J20IOuEmOyWtOyYpOyngCDslYrsnYAg6rK97JqwIChpbiDsl7DsgrDsnpDroZwg7ZmV7J24KSDrp6TtlZHsnZgg6rCS7J20IHRoaXMucHJvcHPsl5Ag7ISk7KCV65Cc64ukLlxuXHRcdHJldHVybiB7IHR5cGU6ICd2YWx1ZScsIHZhbHVlOiAwLCBhbmltYXRpb246IHsgZHVyYXRpb246IDYwMCB9LCBlbmFibGU6IHRydWUsIG9yaWVudGF0aW9uOiAnaG9yaXpvbnRhbCcgfTtcblx0fSxcbiAgICBjb21wb25lbnRXaWxsTW91bnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAvLyDstZzstIgg66CM642U66eB7J20IOydvOyWtOuCmOq4sCDsp4HsoIQo7ZWc67KIIO2YuOy2nClcbiAgICAgICAgbGV0IGlkID0gdGhpcy5wcm9wcy5pZDtcbiAgICAgICAgaWYodHlwZW9mIGlkID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgaWQgPSBVdGlsLmdldFVVSUQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuaWQgPSBpZDtcbiAgICB9LFxuICAgIGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbigpIHtcbiAgICAgICAgLy8g7LWc7LSIIOugjOuNlOungeydtCDsnbzslrTrgpwg64uk7J2MKO2VnOuyiCDtmLjstpwpXG4gICAgICAgIHRoaXMuJHByb2dyZXNzQmFyID0gJCgnIycrdGhpcy5pZCk7XG4gICAgICAgIHRoaXMucHJvZ3Jlc3NCYXIgPSB0aGlzLiRwcm9ncmVzc0Jhci5rZW5kb1Byb2dyZXNzQmFyKHRoaXMuZ2V0T3B0aW9ucygpKS5kYXRhKCdrZW5kb1Byb2dyZXNzQmFyJyk7XG5cbiAgICAgICAgLy8gRXZlbnRzXG4gICAgICAgIHRoaXMucHJvZ3Jlc3NCYXIuYmluZCgnY2hhbmdlJywgdGhpcy5vbkNoYW5nZSk7XG4gICAgICAgIHRoaXMucHJvZ3Jlc3NCYXIuYmluZCgnY29tcGxldGUnLCB0aGlzLm9uQ29tcGxldGUpO1xuICAgIH0sXG4gICAgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICAgICAgLy8g7ZWE7IiYIO2VreuqqVxuICAgICAgICBjb25zdCB7IGNsYXNzTmFtZSB9ID0gdGhpcy5wcm9wcztcblxuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPGRpdiBpZD17dGhpcy5pZH0gY2xhc3NOYW1lPXtjbGFzc05hbWVzKGNsYXNzTmFtZSl9PjwvZGl2PlxuICAgICAgICApO1xuICAgIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFByb2dyZXNzQmFyOyIsIi8qKlxuICogVHJlZVZpZXcgY29tcG9uZW50XG4gKlxuICogdmVyc2lvbiA8dHQ+JCBWZXJzaW9uOiAxLjAgJDwvdHQ+IGRhdGU6MjAxNi8wNC8xNVxuICogYXV0aG9yIDxhIGhyZWY9XCJtYWlsdG86aHJhaG5AbmtpYS5jby5rclwiPkFobiBIeXVuZy1SbzwvYT5cbiAqXG4gKiBleGFtcGxlOlxuICogPFB1Zi5UcmVlVmlldyBvcHRpb25zPXtvcHRpb25zfSAvPlxuICpcbiAqIEtlbmRvIFRyZWVWaWV3IOudvOydtOu4jOufrOumrOyXkCDsooXsho3soIHsnbTri6QuXG4gKi9cbid1c2Ugc3RyaWN0JztcblxudmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcbnZhciBQcm9wVHlwZXMgPSByZXF1aXJlKCdyZWFjdCcpLlByb3BUeXBlcztcbnZhciBjbGFzc05hbWVzID0gcmVxdWlyZSgnY2xhc3NuYW1lcycpO1xuXG52YXIgVXRpbCA9IHJlcXVpcmUoJy4uL3NlcnZpY2VzL1V0aWwnKTtcblxudmFyIFRyZWVWaWV3ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICAgIGRpc3BsYXlOYW1lOiAnVHJlZVZpZXcnLFxuICAgIHByb3BUeXBlczoge1xuICAgICAgICBpZDogUHJvcFR5cGVzLnN0cmluZyxcbiAgICAgICAgY2xhc3NOYW1lOiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgICAgICBvcHRpb25zOiBQcm9wVHlwZXMub2JqZWN0LFxuICAgICAgICBob3N0OiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgICAgICB1cmw6IFByb3BUeXBlcy5zdHJpbmcsXG4gICAgICAgIG1ldGhvZDogUHJvcFR5cGVzLnN0cmluZyxcbiAgICAgICAgaXRlbXM6IFByb3BUeXBlcy5hcnJheSxcbiAgICAgICAgZGF0YTogUHJvcFR5cGVzLm9iamVjdCxcbiAgICAgICAgb25EZW1hbmQ6IFByb3BUeXBlcy5ib29sLFxuICAgICAgICBkYXRhVGV4dEZpZWxkOiBQcm9wVHlwZXMub25lT2ZUeXBlKFtcbiAgICAgICAgICAgIFByb3BUeXBlcy5zdHJpbmcsXG4gICAgICAgICAgICBQcm9wVHlwZXMuYXJyYXlcbiAgICAgICAgXSksXG4gICAgICAgIGNoaWxkcmVuRmllbGQ6IFByb3BUeXBlcy5zdHJpbmcsXG4gICAgICAgIGNoZWNrYm94ZXM6IFByb3BUeXBlcy5ib29sLFxuICAgICAgICBkcmFnQW5kRHJvcDogUHJvcFR5cGVzLmJvb2wsXG4gICAgICAgIHRlbXBsYXRlOiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgICAgICBvblNlbGVjdDogUHJvcFR5cGVzLmZ1bmMsXG4gICAgICAgIG9uQ2hhbmdlOiBQcm9wVHlwZXMuZnVuYyxcbiAgICAgICAgb25DbGljazogUHJvcFR5cGVzLmZ1bmMsXG4gICAgICAgIG9uRGJsY2xpY2s6IFByb3BUeXBlcy5mdW5jLFxuICAgICAgICBvbkNvbGxhcHNlOiBQcm9wVHlwZXMuZnVuYyxcbiAgICAgICAgb25FeHBhbmQ6IFByb3BUeXBlcy5mdW5jXG4gICAgfSxcbiAgICBpZDogJycsXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIGFwaVxuICAgIGRhdGFJdGVtOiBmdW5jdGlvbihub2RlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnRyZWVWaWV3LmRhdGFJdGVtKG5vZGUpO1xuICAgIH0sXG4gICAgcGFyZW50OiBmdW5jdGlvbihub2RlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnRyZWVWaWV3LnBhcmVudChub2RlKTtcbiAgICB9LFxuICAgIHNlbGVjdDogZnVuY3Rpb24obm9kZSkge1xuICAgICAgICBpZihhcmd1bWVudHMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy50cmVlVmlldy5zZWxlY3QoKTtcbiAgICAgICAgfWVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudHJlZVZpZXcuc2VsZWN0KG5vZGUpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBhcHBlbmQ6IGZ1bmN0aW9uKG5vZGVEYXRhLCBwYXJlbnROb2RlLCBzdWNjZXNzKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnRyZWVWaWV3LmFwcGVuZChub2RlRGF0YSwgcGFyZW50Tm9kZSwgc3VjY2Vzcyk7XG4gICAgfSxcbiAgICByZW1vdmU6IGZ1bmN0aW9uKG5vZGUpIHtcbiAgICAgICAgdGhpcy50cmVlVmlldy5yZW1vdmUobm9kZSk7XG4gICAgfSxcbiAgICBleHBhbmQ6IGZ1bmN0aW9uKG5vZGUpIHtcbiAgICAgICAgdGhpcy50cmVlVmlldy5leHBhbmQobm9kZSk7XG4gICAgfSxcbiAgICBleHBhbmRBbGw6IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLnRyZWVWaWV3LmV4cGFuZCgnLmstaXRlbScpO1xuICAgIH0sXG4gICAgY29sbGFwc2U6IGZ1bmN0aW9uKG5vZGUpIHtcbiAgICAgICAgdGhpcy50cmVlVmlldy5jb2xsYXBzZShub2RlKTtcbiAgICB9LFxuICAgIGNvbGxhcHNlQWxsOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy50cmVlVmlldy5jb2xsYXBzZSgnLmstaXRlbScpO1xuICAgIH0sXG4gICAgZW5hYmxlOiBmdW5jdGlvbihub2RlKSB7XG4gICAgICAgIHRoaXMudHJlZVZpZXcuZW5hYmxlKG5vZGUpO1xuICAgIH0sXG4gICAgZGlzYWJsZTogZnVuY3Rpb24obm9kZSkge1xuICAgICAgICB0aGlzLnRyZWVWaWV3LmVuYWJsZShub2RlLCBmYWxzZSk7XG4gICAgfSxcbiAgICBlbmFibGVBbGw6IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLnRyZWVWaWV3LmVuYWJsZSgnLmstaXRlbScpO1xuICAgIH0sXG4gICAgZGlzYWJsZUFsbDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMudHJlZVZpZXcuZW5hYmxlKCcuay1pdGVtJywgZmFsc2UpO1xuICAgIH0sXG4gICAgZmlsdGVyOiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICBpZih2YWx1ZSAhPT0gXCJcIikge1xuICAgICAgICAgICAgdGhpcy50cmVlVmlldy5kYXRhU291cmNlLmZpbHRlcih7XG4gICAgICAgICAgICAgICAgZmllbGQ6IHRoaXMucHJvcHMuZGF0YVRleHRGaWVsZCxcbiAgICAgICAgICAgICAgICBvcGVyYXRvcjogJ2NvbnRhaW5zJyxcbiAgICAgICAgICAgICAgICB2YWx1ZTogdmFsdWVcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9ZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnRyZWVWaWV3LmRhdGFTb3VyY2UuZmlsdGVyKHt9KTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgc29ydDogZnVuY3Rpb24oZGlyKSB7XG4gICAgICAgIC8vIGRpcuydgCAnYXNjJyBvciAnZGVzYydcbiAgICAgICAgdGhpcy50cmVlVmlldy5kYXRhU291cmNlLnNvcnQoe1xuICAgICAgICAgICAgZmllbGQ6IHRoaXMucHJvcHMuZGF0YVRleHRGaWVsZCxcbiAgICAgICAgICAgIGRpcjogZGlyXG4gICAgICAgIH0pO1xuICAgIH0sXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIGV2ZW50XG4gICAgb25TZWxlY3Q6IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgIC8vIOqwmeydgCDrhbjrk5zrpbwgc2VsZWN0IO2VoCDqsr3smrAg7J2067Kk7Yq4IOuwnOyDne2VmOuPhOuhnSDtlZjquLAg7JyE7ZW0XG4gICAgICAgIC8vIGNsaWNrIOydtOuypO2KuOyLnCBrLXN0YXRlLXNlbGVjdGVkIOygnOqxsO2VmOqzoFxuICAgICAgICAvLyBzZWxlY3Qg7J2067Kk7Yq47IucIOy2lOqwgO2VnOuLpC5cbiAgICAgICAgLy9jb25zb2xlLmxvZygndHJlZXZpZXcgc2VsZWN0Jyk7XG5cblxuICAgICAgICAvLyQoZXZlbnQubm9kZSkuZmluZCgnc3Bhbi5rLWluJykuYWRkQ2xhc3MoJ2stc3RhdGUtc2VsZWN0ZWQnKTtcbiAgICAgICAgdmFyIG5vZGUsIHNlbGVjdGVkSXRlbTtcblxuICAgICAgICBpZih0eXBlb2YgZXZlbnQubm9kZSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coJ2Rpc3BhdGNoIGNsaWNrJyk7XG4gICAgICAgICAgICBub2RlID0gZXZlbnQ7XG4gICAgICAgICAgICAvLyQobm9kZSkuZmluZCgnc3Bhbi5rLWluJykuYWRkQ2xhc3MoJ2stc3RhdGUtc2VsZWN0ZWQnKTtcbiAgICAgICAgICAgICQobm9kZSkuY2hpbGRyZW4oJzpmaXJzdCcpLmZpbmQoJ3NwYW4uay1pbicpLmFkZENsYXNzKCdrLXN0YXRlLXNlbGVjdGVkJyk7XG4gICAgICAgICAgICB0aGlzLm9uU2VsZWN0Q2FsbCA9IGZhbHNlO1xuICAgICAgICB9ZWxzZSB7XG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKCdjbGljaycpO1xuICAgICAgICAgICAgbm9kZSA9IGV2ZW50Lm5vZGU7XG4gICAgICAgICAgICB0aGlzLm9uU2VsZWN0Q2FsbCA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgc2VsZWN0ZWRJdGVtID0gdGhpcy50cmVlVmlldy5kYXRhSXRlbShub2RlKTtcbiAgICAgICAgLy92YXIgc2VsZWN0ZWRJdGVtID0gdGhpcy50cmVlVmlldy5kYXRhSXRlbShldmVudC5ub2RlKTtcbiAgICAgICAgLy9jb25zb2xlLmxvZyhzZWxlY3RlZEl0ZW0pO1xuXG4gICAgICAgIGlmKHR5cGVvZiB0aGlzLnByb3BzLm9uU2VsZWN0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICB0aGlzLnByb3BzLm9uU2VsZWN0KGV2ZW50LCBzZWxlY3RlZEl0ZW0pO1xuXG4gICAgICAgICAgICAvL2V2ZW50LnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBvbkNoZWNrOiBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAvL2NvbnNvbGUubG9nKFwiQ2hlY2tib3ggY2hhbmdlZDogXCIpO1xuICAgICAgICAvL2NvbnNvbGUubG9nKGV2ZW50Lm5vZGUpO1xuICAgIH0sXG4gICAgb25DaGFuZ2U6IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgIC8vY29uc29sZS5sb2coXCJTZWxlY3Rpb24gY2hhbmdlZFwiKTtcbiAgICAgICAgLy9jb25zb2xlLmxvZyhldmVudCk7XG5cbiAgICAgICAgaWYodHlwZW9mIHRoaXMucHJvcHMub25DaGFuZ2UgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIC8vdmFyIGRhdGEgPSBldmVudC5ub2RlO1xuICAgICAgICAgICAgdGhpcy5wcm9wcy5vbkNoYW5nZShldmVudCk7XG4gICAgICAgICAgICAvL2V2ZW50LnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBvbkNvbGxhcHNlOiBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAvL2NvbnNvbGUubG9nKFwiQ29sbGFwc2luZyBcIik7XG4gICAgICAgIC8vY29uc29sZS5sb2coZXZlbnQubm9kZSk7XG4gICAgICAgIHZhciBzZWxlY3RlZEl0ZW0gPSB0aGlzLnRyZWVWaWV3LmRhdGFJdGVtKGV2ZW50Lm5vZGUpO1xuICAgICAgICAvL2NvbnNvbGUubG9nKHNlbGVjdGVkSXRlbSk7XG4gICAgICAgIGlmKHR5cGVvZiB0aGlzLnByb3BzLm9uQ29sbGFwc2UgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIHRoaXMucHJvcHMub25Db2xsYXBzZShldmVudCwgc2VsZWN0ZWRJdGVtKTtcblxuICAgICAgICAgICAgLy9ldmVudC5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgb25FeHBhbmQ6IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgIC8vY29uc29sZS5sb2coXCJFeHBhbmRpbmcgXCIpO1xuICAgICAgICAvL2NvbnNvbGUubG9nKGV2ZW50Lm5vZGUpO1xuICAgICAgICB2YXIgc2VsZWN0ZWRJdGVtID0gdGhpcy50cmVlVmlldy5kYXRhSXRlbShldmVudC5ub2RlKTtcbiAgICAgICAgLy9jb25zb2xlLmxvZyhzZWxlY3RlZEl0ZW0pO1xuICAgICAgICBpZih0eXBlb2YgdGhpcy5wcm9wcy5vbkV4cGFuZCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgdGhpcy5wcm9wcy5vbkV4cGFuZChldmVudCwgc2VsZWN0ZWRJdGVtKTtcblxuICAgICAgICAgICAgLy9ldmVudC5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgb25EcmFnU3RhcnQ6IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgIC8vY29uc29sZS5sb2coXCJTdGFydGVkIGRyYWdnaW5nIFwiKTtcbiAgICAgICAgLy9jb25zb2xlLmxvZyhldmVudC5zb3VyY2VOb2RlKTtcbiAgICAgICAgdmFyIHNlbGVjdGVkSXRlbSA9IHRoaXMudHJlZVZpZXcuZGF0YUl0ZW0oZXZlbnQuc291cmNlTm9kZSk7XG4gICAgICAgIGlmKHR5cGVvZiB0aGlzLnByb3BzLm9uRHJhZ1N0YXJ0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICB2YXIgaXRlbSA9IHNlbGVjdGVkSXRlbTtcbiAgICAgICAgICAgIHRoaXMucHJvcHMub25EcmFnU3RhcnQoZXZlbnQsIGl0ZW0pO1xuXG4gICAgICAgICAgICAvL2V2ZW50LnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBvbkRyYWc6IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgIC8vY29uc29sZS5sb2coXCJEcmFnZ2luZyBcIik7XG4gICAgICAgIC8vY29uc29sZS5sb2coZXZlbnQuc291cmNlTm9kZSk7XG4gICAgICAgIHZhciBzZWxlY3RlZEl0ZW0gPSB0aGlzLnRyZWVWaWV3LmRhdGFJdGVtKGV2ZW50LnNvdXJjZU5vZGUpLFxuICAgICAgICAgICAgcGFyZW50Tm9kZSA9IHRoaXMudHJlZVZpZXcucGFyZW50KGV2ZW50LmRyb3BUYXJnZXQpLFxuICAgICAgICAgICAgcGFyZW50SXRlbSA9IHRoaXMudHJlZVZpZXcuZGF0YUl0ZW0ocGFyZW50Tm9kZSk7XG5cbiAgICAgICAgLy9jb25zb2xlLmxvZyhwYXJlbnRJdGVtKTtcbiAgICAgICAgaWYodHlwZW9mIHRoaXMucHJvcHMub25EcmFnID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICB0aGlzLnByb3BzLm9uRHJhZyhldmVudCwgc2VsZWN0ZWRJdGVtLCBwYXJlbnRJdGVtKTtcblxuICAgICAgICAgICAgLy9ldmVudC5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgb25Ecm9wOiBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAvL2NvbnNvbGUubG9nKFwiRHJvcHBlZCBcIik7XG4gICAgICAgIC8vY29uc29sZS5sb2coZXZlbnQudmFsaWQpO1xuICAgICAgICAvL2NvbnNvbGUubG9nKGV2ZW50LnNvdXJjZU5vZGUpO1xuICAgICAgICAvL2NvbnNvbGUubG9nKGV2ZW50LmRlc3RpbmF0aW9uTm9kZSk7XG4gICAgICAgIHZhciBzZWxlY3RlZEl0ZW0gPSB0aGlzLnRyZWVWaWV3LmRhdGFJdGVtKGV2ZW50LnNvdXJjZU5vZGUpLFxuICAgICAgICAgICAgcGFyZW50Tm9kZSA9IHRoaXMudHJlZVZpZXcucGFyZW50KGV2ZW50LmRlc3RpbmF0aW9uTm9kZSksXG4gICAgICAgICAgICBwYXJlbnRJdGVtID0gdGhpcy50cmVlVmlldy5kYXRhSXRlbShwYXJlbnROb2RlKTtcblxuICAgICAgICAvL2NvbnNvbGUubG9nKHBhcmVudEl0ZW0pO1xuICAgICAgICBpZih0eXBlb2YgdGhpcy5wcm9wcy5vbkRyb3AgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIHRoaXMucHJvcHMub25Ecm9wKGV2ZW50LCBzZWxlY3RlZEl0ZW0sIHBhcmVudEl0ZW0pO1xuXG4gICAgICAgICAgICAvL2V2ZW50LnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBvbkRyYWdFbmQ6IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgIC8vY29uc29sZS5sb2coXCJGaW5pc2hlZCBkcmFnZ2luZyBcIik7XG4gICAgICAgIC8vY29uc29sZS5sb2coZXZlbnQuc291cmNlTm9kZSk7XG4gICAgICAgIHZhciBzZWxlY3RlZEl0ZW0gPSB0aGlzLnRyZWVWaWV3LmRhdGFJdGVtKGV2ZW50LnNvdXJjZU5vZGUpLFxuICAgICAgICAgICAgcGFyZW50Tm9kZSA9IHRoaXMudHJlZVZpZXcucGFyZW50KGV2ZW50LmRlc3RpbmF0aW9uTm9kZSksXG4gICAgICAgICAgICBwYXJlbnRJdGVtID0gdGhpcy50cmVlVmlldy5kYXRhSXRlbShwYXJlbnROb2RlKTtcblxuICAgICAgICBpZih0eXBlb2YgdGhpcy5wcm9wcy5vbkRyYWdFbmQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIHRoaXMucHJvcHMub25EcmFnRW5kKGV2ZW50LCBzZWxlY3RlZEl0ZW0sIHBhcmVudEl0ZW0pO1xuXG4gICAgICAgICAgICAvL2V2ZW50LnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBvbk5hdmlnYXRlOiBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAvL2NvbnNvbGUubG9nKFwiTmF2aWdhdGUgXCIpO1xuICAgICAgICAvL2NvbnNvbGUubG9nKGV2ZW50Lm5vZGUpO1xuICAgIH0sXG4gICAgb25EYXRhQm91bmQ6IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdvbkRhdGFCb3VuZCcpO1xuICAgIH0sXG4gICAgb25DbGljazogZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgLypcbiAgICAgICAgdmFyIG5vZGUgPSAkKGV2ZW50LnRhcmdldCkuY2xvc2VzdChcIi5rLWl0ZW1cIiksXG4gICAgICAgICAgICBzZWxlY3RlZEl0ZW0gPSB0aGlzLnRyZWVWaWV3LmRhdGFJdGVtKG5vZGUpO1xuICAgICAgICBjb25zb2xlLmxvZygndHJlZXZpZXcgY2xpY2snKTtcbiAgICAgICAgLy9jb25zb2xlLmxvZyhzZWxlY3RlZEl0ZW0pO1xuICAgICAgICBpZih0eXBlb2YgdGhpcy5wcm9wcy5vbkNsaWNrID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICB0aGlzLnByb3BzLm9uQ2xpY2soZXZlbnQsIHNlbGVjdGVkSXRlbSk7XG5cbiAgICAgICAgICAgIC8vZXZlbnQuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XG4gICAgICAgIH1cbiAgICAgICAgKi9cbiAgICAgICAgLy8g6rCZ7J2AIOuFuOuTnOulvCBzZWxlY3Qg7ZWgIOqyveyasCDsnbTrsqTtirgg67Cc7IOd7ZWY64+E66GdIO2VmOq4sCDsnITtlbRcbiAgICAgICAgLy8gY2xpY2sg7J2067Kk7Yq47IucIGstc3RhdGUtc2VsZWN0ZWQg7KCc6rGw7ZWY6rOgXG4gICAgICAgIC8vIHNlbGVjdCDsnbTrsqTtirjsi5wg7LaU6rCA7ZWc64ukLlxuICAgICAgICAvL2NvbnNvbGUubG9nKCQoZXZlbnQudGFyZ2V0KS5oYXNDbGFzcygnay1zdGF0ZS1zZWxlY3RlZCcpKTtcbiAgICAgICAgLy9jb25zb2xlLmxvZygndHJlZXZpZXcgb25jbGljaycpO1xuICAgICAgICBpZih0aGlzLm9uU2VsZWN0Q2FsbCA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgIHZhciBub2RlID0gJChldmVudC50YXJnZXQpLmNsb3Nlc3QoXCIuay1pdGVtXCIpO1xuICAgICAgICAgICAgJChldmVudC50YXJnZXQpLnJlbW92ZUNsYXNzKCdrLXN0YXRlLXNlbGVjdGVkJyk7XG4gICAgICAgICAgICB0aGlzLnRyZWVWaWV3LnRyaWdnZXIoJ3NlbGVjdCcsIG5vZGUpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMub25TZWxlY3RDYWxsID0gZmFsc2U7XG4gICAgfSxcbiAgICBvbkRibGNsaWNrOiBmdW5jdGlvbihldmVudCkge1xuICAgICAgICB2YXIgbm9kZSA9ICQoZXZlbnQudGFyZ2V0KS5jbG9zZXN0KFwiLmstaXRlbVwiKSxcbiAgICAgICAgICAgIHNlbGVjdGVkSXRlbSA9IHRoaXMudHJlZVZpZXcuZGF0YUl0ZW0obm9kZSk7XG4gICAgICAgIC8vY29uc29sZS5sb2coJ29uRGJsY2xpY2snKTtcbiAgICAgICAgLy9jb25zb2xlLmxvZyhzZWxlY3RlZEl0ZW0pO1xuXG4gICAgICAgIGlmKHR5cGVvZiB0aGlzLnByb3BzLm9uRGJsY2xpY2sgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIHRoaXMucHJvcHMub25EYmxjbGljayhldmVudCwgc2VsZWN0ZWRJdGVtKTtcblxuICAgICAgICAgICAgLy9ldmVudC5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgZ2V0T3B0aW9uczogZnVuY3Rpb24oKSB7XG4gICAgICAgIGNvbnN0IHsgaG9zdCwgdXJsLCBtZXRob2QsIGRhdGEsIGl0ZW1zLCBvbkRlbWFuZCwgZGF0YVRleHRGaWVsZCwgY2hpbGRyZW5GaWVsZCwgY2hlY2tib3hlcywgZHJhZ0FuZERyb3AsIHRlbXBsYXRlIH0gPSB0aGlzLnByb3BzO1xuXG4gICAgICAgIHZhciBvcHRpb25zID0ge1xuICAgICAgICAgICAgY2hlY2tib3hlczogY2hlY2tib3hlcywgICAgICAgICAvLyB0cnVlIG9yIGZhbHNlXG4gICAgICAgICAgICBkYXRhVGV4dEZpZWxkOiBkYXRhVGV4dEZpZWxkLFxuICAgICAgICAgICAgZGF0YVNvdXJjZTogW10sXG4gICAgICAgICAgICBkcmFnQW5kRHJvcDogZHJhZ0FuZERyb3AgICAgICAgIC8vIHRydWUgb3IgZmFsc2VcbiAgICAgICAgfTtcblxuICAgICAgICAvL0pTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkoZGF0YS50cmVlVk8pLnNwbGl0KCdcImNoaWxkcmVuXCI6Jykuam9pbignXCJpdGVtc1wiOicpKS5pdGVtc1xuXG4gICAgICAgIC8vIGRhdGFTb3VyY2VcbiAgICAgICAgLy8gdXJsXG4gICAgICAgIGlmKHR5cGVvZiB1cmwgIT09ICd1bmRlZmluZWQnICYmIGNoaWxkcmVuRmllbGQgIT0gXCJjaGlsZHJlblwiKSB7XG5cbiAgICAgICAgICAgICQuZXh0ZW5kKG9wdGlvbnMsIHsgZGF0YVNvdXJjZTogbmV3IGtlbmRvLmRhdGEuSGllcmFyY2hpY2FsRGF0YVNvdXJjZSh7XG4gICAgICAgICAgICAgICAgdHJhbnNwb3J0OiB7XG4gICAgICAgICAgICAgICAgICAgIHJlYWQ6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHVybDogKGhvc3QgJiYgaG9zdCAhPT0gbnVsbCAmJiBob3N0Lmxlbmd0aCA+IDApID8gaG9zdCArIHVybCA6IHVybCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IG1ldGhvZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFUeXBlOiAnanNvbicsXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiBkYXRhLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGVudFR5cGU6ICdhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04J1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBwYXJhbWV0ZXJNYXA6IGZ1bmN0aW9uKGRhdGEsIHR5cGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShkYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgc2NoZW1hOiB7XG4gICAgICAgICAgICAgICAgICAgIG1vZGVsOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjaGlsZHJlbjogY2hpbGRyZW5GaWVsZFxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSkgfSk7XG5cbiAgICAgICAgfWVsc2UgaWYodHlwZW9mIHVybCAhPT0gJ3VuZGVmaW5lZCcgJiYgY2hpbGRyZW5GaWVsZCA9PSBcImNoaWxkcmVuXCIpIHtcbiAgICAgICAgICAgICQuZXh0ZW5kKG9wdGlvbnMsIHsgZGF0YVNvdXJjZTogbmV3IGtlbmRvLmRhdGEuSGllcmFyY2hpY2FsRGF0YVNvdXJjZSh7XG4gICAgICAgICAgICAgICAgdHJhbnNwb3J0OiB7XG4gICAgICAgICAgICAgICAgICAgIHJlYWQ6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHVybDogKGhvc3QgJiYgaG9zdCAhPT0gbnVsbCAmJiBob3N0Lmxlbmd0aCA+IDApID8gaG9zdCArIHVybCA6IHVybCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IG1ldGhvZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFUeXBlOiAnanNvbicsXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiBkYXRhLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGVudFR5cGU6ICdhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04J1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBwYXJhbWV0ZXJNYXA6IGZ1bmN0aW9uKGRhdGEsIHR5cGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShkYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgc2NoZW1hOiB7XG4gICAgICAgICAgICAgICAgICAgIG1vZGVsOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjaGlsZHJlbjogXCJpdGVtc1wiXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXNwb25zZS50cmVlVk8gPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KHJlc3BvbnNlLnRyZWVWTykuc3BsaXQoJ1wiY2hpbGRyZW5cIjonKS5qb2luKCdcIml0ZW1zXCI6JykpLml0ZW1zO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLnRyZWVWTztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pIH0pO1xuXG4gICAgICAgIH1lbHNlIGlmKHR5cGVvZiBpdGVtcyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICQuZXh0ZW5kKG9wdGlvbnMsIHsgZGF0YVNvdXJjZTogbmV3IGtlbmRvLmRhdGEuSGllcmFyY2hpY2FsRGF0YVNvdXJjZSh7XG4gICAgICAgICAgICAgICAgZGF0YTogaXRlbXMsXG4gICAgICAgICAgICAgICAgc2NoZW1hOiB7XG4gICAgICAgICAgICAgICAgICAgIG1vZGVsOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjaGlsZHJlbjogY2hpbGRyZW5GaWVsZFxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSkgfSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyB0ZW1wbGF0ZVxuICAgICAgICBpZih0eXBlb2YgdGVtcGxhdGUgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAkLmV4dGVuZChvcHRpb25zLCB7IHRlbXBsYXRlOiB0ZW1wbGF0ZSB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBvcHRpb25zO1xuICAgIH0sXG4gICAgZ2V0RGVmYXVsdFByb3BzOiBmdW5jdGlvbigpIHtcbiAgICAgICAgLy8g7YG0656Y7Iqk6rCAIOyDneyEseuQoCDrlYwg7ZWc67KIIO2YuOy2nOuQmOqzoCDsupDsi5zrkJzri6QuXG4gICAgICAgIC8vIOu2gOuqqCDsu7Ttj6zrhIztirjsl5DshJwgcHJvcOydtCDrhJjslrTsmKTsp4Ag7JWK7J2AIOqyveyasCAoaW4g7Jew7IKw7J6Q66GcIO2ZleyduCkg66ek7ZWR7J2YIOqwkuydtCB0aGlzLnByb3Bz7JeQIOyEpOygleuQnOuLpC5cbiAgICAgICAgcmV0dXJuIHtvbkRlbWFuZDogZmFsc2UsIG1ldGhvZDogJ1BPU1QnLCBkYXRhVGV4dEZpZWxkOiAndGV4dCcsIGNoaWxkcmVuRmllbGQ6ICdpdGVtcycsIGRyYWdBbmREcm9wOiBmYWxzZX07XG4gICAgfSxcbiAgICBjb21wb25lbnRXaWxsTW91bnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAvLyDstZzstIgg66CM642U66eB7J20IOydvOyWtOuCmOq4sCDsp4HsoIQo7ZWc67KIIO2YuOy2nClcbiAgICAgICAgbGV0IGlkID0gdGhpcy5wcm9wcy5pZDtcbiAgICAgICAgaWYodHlwZW9mIGlkID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgaWQgPSBVdGlsLmdldFVVSUQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuaWQgPSBpZDtcbiAgICB9LFxuICAgIGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbigpIHtcbiAgICAgICAgLy8g7LWc7LSIIOugjOuNlOungeydtCDsnbzslrTrgpwg64uk7J2MKO2VnOuyiCDtmLjstpwpXG4gICAgICAgIHRoaXMuJHRyZWVWaWV3ID0gJCgnIycrdGhpcy5pZCk7XG4gICAgICAgIHRoaXMudHJlZVZpZXcgPSB0aGlzLiR0cmVlVmlldy5rZW5kb1RyZWVWaWV3KHRoaXMuZ2V0T3B0aW9ucygpKS5kYXRhKCdrZW5kb1RyZWVWaWV3Jyk7XG5cbiAgICAgICAgLy8gRXZlbnRzXG4gICAgICAgIHRoaXMudHJlZVZpZXcuYmluZCgnc2VsZWN0JywgdGhpcy5vblNlbGVjdCk7XG4gICAgICAgIHRoaXMudHJlZVZpZXcuYmluZCgnY2hlY2snLCB0aGlzLm9uQ2hlY2spO1xuICAgICAgICB0aGlzLnRyZWVWaWV3LmJpbmQoJ2NoYW5nZScsIHRoaXMub25DaGFuZ2UpO1xuICAgICAgICB0aGlzLnRyZWVWaWV3LmJpbmQoJ2NvbGxhcHNlJywgdGhpcy5vbkNvbGxhcHNlKTtcbiAgICAgICAgdGhpcy50cmVlVmlldy5iaW5kKCdleHBhbmQnLCB0aGlzLm9uRXhwYW5kKTtcblxuICAgICAgICAvKiBkcmFnICYgZHJvcCBldmVudHMgKi9cbiAgICAgICAgdGhpcy50cmVlVmlldy5iaW5kKCdkcmFnc3RhcnQnLCB0aGlzLm9uRHJhZ1N0YXJ0KTtcbiAgICAgICAgdGhpcy50cmVlVmlldy5iaW5kKCdkcmFnJywgdGhpcy5vbkRyYWcpO1xuICAgICAgICB0aGlzLnRyZWVWaWV3LmJpbmQoJ2Ryb3AnLCB0aGlzLm9uRHJvcCk7XG4gICAgICAgIHRoaXMudHJlZVZpZXcuYmluZCgnZHJhZ2VuZCcsIHRoaXMub25EcmFnRW5kKTtcbiAgICAgICAgdGhpcy50cmVlVmlldy5iaW5kKCduYXZpZ2F0ZScsIHRoaXMub25OYXZpZ2F0ZSk7XG5cbiAgICAgICAgLy90aGlzLiR0cmVlVmlldy5maW5kKCcuay1pbicpLm9uKCdjbGljaycsIHRoaXMub25DbGljayk7ICAgICAgIC8vIGNsaWNr7J20IHNlbGVjdCDrs7Tri6Qg66i87KCAIOuwnOyDnVxuICAgICAgICB0aGlzLiR0cmVlVmlldy5vbignY2xpY2snLCAnLmstaW4nLCB0aGlzLm9uQ2xpY2spOyAgICAgICAgICAgICAgLy8gY2xpY2vsnbQgc2VsZWN0IOuztOuLpCDrgpjspJHsl5Ag67Cc7IOdXG4gICAgICAgIHRoaXMuJHRyZWVWaWV3LmZpbmQoJy5rLWluJykub24oJ2RibGNsaWNrJywgdGhpcy5vbkRibGNsaWNrKTtcblxuICAgIH0sXG4gICAgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICAgICAgLy8g7ZWE7IiYIO2VreuqqVxuICAgICAgICBjb25zdCB7Y2xhc3NOYW1lfSA9IHRoaXMucHJvcHM7XG5cbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxkaXYgaWQ9e3RoaXMuaWR9IGNsYXNzTmFtZT17Y2xhc3NOYW1lcyhjbGFzc05hbWUpfT48L2Rpdj5cbiAgICAgICAgKTtcbiAgICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBUcmVlVmlldztcbiIsIi8qKlxuICogV2luZG93IGNvbXBvbmVudFxuICpcbiAqIHZlcnNpb24gPHR0PiQgVmVyc2lvbjogMS4wICQ8L3R0PiBkYXRlOjIwMTYvMDkvMDZcbiAqIGF1dGhvciA8YSBocmVmPVwibWFpbHRvOmhyYWhuQG5raWEuY28ua3JcIj5BaG4gSHl1bmctUm88L2E+XG4gKlxuICogZXhhbXBsZTpcbiAqIDxQdWYuV2luZG93IG9wdGlvbnM9e29wdGlvbnN9IC8+XG4gKlxuICogS2VuZG8gV2luZG93IOudvOydtOu4jOufrOumrOyXkCDsooXsho3soIHsnbTri6QuXG4gKi9cbid1c2Ugc3RyaWN0JztcblxudmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcbnZhciBQcm9wVHlwZXMgPSByZXF1aXJlKCdyZWFjdCcpLlByb3BUeXBlcztcbnZhciBjbGFzc05hbWVzID0gcmVxdWlyZSgnY2xhc3NuYW1lcycpO1xuXG52YXIgVXRpbCA9IHJlcXVpcmUoJy4uL3NlcnZpY2VzL1V0aWwnKTtcblxudmFyIFdpbmRvdyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgICBkaXNwbGF5TmFtZTogJ1dpbmRvdycsXG4gICAgcHJvcFR5cGVzOiB7XG4gICAgICAgIGlkOiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgICAgICBjbGFzc05hbWU6IFByb3BUeXBlcy5zdHJpbmcsXG4gICAgICAgIHRpdGxlOiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgICAgICB2aXNpYmxlOiBQcm9wVHlwZXMuYm9vbCxcbiAgICAgICAgYWN0aW9uczogUHJvcFR5cGVzLmFycmF5LCAgICAgICAvLyBbJ1BpbicsICdSZWZyZXNoJywgJ01pbmltaXplJywgJ01heGltaXplJywgJ0Nsb3NlJ11cbiAgICAgICAgbW9kYWw6IFByb3BUeXBlcy5ib29sLFxuICAgICAgICByZXNpemFibGU6IFByb3BUeXBlcy5ib29sLFxuICAgICAgICB3aWR0aDogUHJvcFR5cGVzLm9uZU9mVHlwZShbXG4gICAgICAgICAgICBQcm9wVHlwZXMuc3RyaW5nLFxuICAgICAgICAgICAgUHJvcFR5cGVzLm51bWJlclxuICAgICAgICBdKSxcbiAgICAgICAgaGVpZ2h0OiBQcm9wVHlwZXMub25lT2ZUeXBlKFtcbiAgICAgICAgICAgIFByb3BUeXBlcy5zdHJpbmcsXG4gICAgICAgICAgICBQcm9wVHlwZXMubnVtYmVyXG4gICAgICAgIF0pLFxuICAgICAgICBtaW5XaWR0aDogUHJvcFR5cGVzLm51bWJlcixcbiAgICAgICAgbWluSGVpZ2h0OiBQcm9wVHlwZXMubnVtYmVyLFxuICAgICAgICBvbk9wZW46IFByb3BUeXBlcy5mdW5jLFxuICAgICAgICBvbkNsb3NlOiBQcm9wVHlwZXMuZnVuYyxcbiAgICAgICAgb25SZXNpemU6IFByb3BUeXBlcy5mdW5jLFxuICAgICAgICBvbkRyYWdTdGFydDogUHJvcFR5cGVzLmZ1bmMsXG4gICAgICAgIG9uRHJhZ0VuZDogUHJvcFR5cGVzLmZ1bmMsXG4gICAgICAgIG9uUmVmcmVzaDogUHJvcFR5cGVzLmZ1bmMsXG4gICAgICAgIG9uQWN0aXZhdGU6IFByb3BUeXBlcy5mdW5jLFxuICAgICAgICBvbkRlYWN0aXZhdGU6IFByb3BUeXBlcy5mdW5jXG4gICAgfSxcbiAgICBpZDogJycsXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIGFwaVxuICAgIG9wZW46IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy53aW5kb3cub3BlbigpO1xuICAgIH0sXG4gICAgY2xvc2U6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy53aW5kb3cuY2xvc2UoKTtcbiAgICB9LFxuICAgIGNlbnRlcjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLndpbmRvdy5jZW50ZXIoKTtcbiAgICB9LFxuICAgIHBvczogZnVuY3Rpb24oeCwgeSkge1xuICAgICAgICB0aGlzLiR3aW5kb3cub2Zmc2V0KHsgbGVmdDogeCwgdG9wOiB5IH0pO1xuICAgIH0sXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIGV2ZW50XG4gICAgb25PcGVuOiBmdW5jdGlvbihlKSB7XG5cbiAgICAgICAgaWYodHlwZW9mIHRoaXMucHJvcHMub25PcGVuICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgdGhpcy5wcm9wcy5vbk9wZW4oZSk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIG9uQ2xvc2U6IGZ1bmN0aW9uKGUpIHtcblxuICAgICAgICBpZih0eXBlb2YgdGhpcy5wcm9wcy5vbkNsb3NlICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgdGhpcy5wcm9wcy5vbkNsb3NlKGUpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBvblJlc2l6ZTogZnVuY3Rpb24oZSkge1xuXG4gICAgICAgIGlmKHR5cGVvZiB0aGlzLnByb3BzLm9uUmVzaXplICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgdGhpcy5wcm9wcy5vblJlc2l6ZShlKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgb25EcmFnU3RhcnQ6IGZ1bmN0aW9uKGUpIHtcblxuICAgICAgICBpZih0eXBlb2YgdGhpcy5wcm9wcy5vbkRyYWdTdGFydCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIHRoaXMucHJvcHMub25EcmFnU3RhcnQoZSk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIG9uRHJhZ0VuZDogZnVuY3Rpb24oZSkge1xuXG4gICAgICAgIGlmKHR5cGVvZiB0aGlzLnByb3BzLm9uRHJhZ0VuZCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIHRoaXMucHJvcHMub25EcmFnRW5kKGUpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBvblJlZnJlc2g6IGZ1bmN0aW9uKGUpIHtcblxuICAgICAgICBpZih0eXBlb2YgdGhpcy5wcm9wcy5vblJlZnJlc2ggIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICB0aGlzLnByb3BzLm9uUmVmcmVzaChlKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgb25BY3RpdmF0ZTogZnVuY3Rpb24oZSkge1xuXG4gICAgICAgIGlmKHR5cGVvZiB0aGlzLnByb3BzLm9uQWN0aXZhdGUgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICB0aGlzLnByb3BzLm9uQWN0aXZhdGUoZSk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIG9uRGVhY3RpdmF0ZTogZnVuY3Rpb24oZSkge1xuXG4gICAgICAgIGlmKHR5cGVvZiB0aGlzLnByb3BzLm9uRGVhY3RpdmF0ZSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIHRoaXMucHJvcHMub25EZWFjdGl2YXRlKGUpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBnZXRPcHRpb25zOiBmdW5jdGlvbigpIHtcbiAgICAgICAgY29uc3QgeyB0aXRsZSwgdmlzaWJsZSwgYWN0aW9ucywgbW9kYWwsIHJlc2l6YWJsZSwgd2lkdGgsIGhlaWdodCwgbWluV2lkdGgsIG1pbkhlaWdodCB9ID0gdGhpcy5wcm9wcztcblxuICAgICAgICB2YXIgb3B0aW9ucyA9IHtcbiAgICAgICAgICAgIHRpdGxlOiB0aXRsZSxcbiAgICAgICAgICAgIHZpc2libGU6IHZpc2libGUsXG4gICAgICAgICAgICBhY3Rpb25zOiBhY3Rpb25zLFxuICAgICAgICAgICAgbW9kYWw6IG1vZGFsLFxuICAgICAgICAgICAgcmVzaXphYmxlOiByZXNpemFibGUsXG4gICAgICAgICAgICBtaW5XaWR0aDogbWluV2lkdGgsXG4gICAgICAgICAgICBtaW5IZWlnaHQ6IG1pbkhlaWdodFxuICAgICAgICB9O1xuXG4gICAgICAgIC8vIHdpZHRoXG4gICAgICAgIGlmKHR5cGVvZiB3aWR0aCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICQuZXh0ZW5kKG9wdGlvbnMsIHsgd2lkdGg6IHdpZHRoIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gaGVpZ2h0XG4gICAgICAgIGlmKHR5cGVvZiBoZWlnaHQgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAkLmV4dGVuZChvcHRpb25zLCB7IGhlaWdodDogaGVpZ2h0IH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG9wdGlvbnM7XG4gICAgfSxcblx0Z2V0RGVmYXVsdFByb3BzOiBmdW5jdGlvbigpIHtcblx0XHQvLyDtgbTrnpjsiqTqsIAg7IOd7ISx65CgIOuVjCDtlZzrsogg7Zi47Lac65CY6rOgIOy6kOyLnOuQnOuLpC5cblx0XHQvLyDrtoDrqqgg7Lu07Y+s64SM7Yq47JeQ7IScIHByb3DsnbQg64SY7Ja07Jik7KeAIOyViuydgCDqsr3smrAgKGluIOyXsOyCsOyekOuhnCDtmZXsnbgpIOunpO2VkeydmCDqsJLsnbQgdGhpcy5wcm9wc+yXkCDshKTsoJXrkJzri6QuXG5cdFx0cmV0dXJuIHsgdGl0bGU6ICdUaXRsZScsIHZpc2libGU6IHRydWUsIGFjdGlvbnM6IFsnUGluJywgJ01pbmltaXplJywgJ01heGltaXplJywgJ0Nsb3NlJ10sIG1vZGFsOiBmYWxzZSwgcmVzaXphYmxlOiB0cnVlLCBtaW5XaWR0aDogMTUwLCBtaW5IZWlnaHQ6IDEwMCB9O1xuXHR9LFxuICAgIGNvbXBvbmVudFdpbGxNb3VudDogZnVuY3Rpb24oKSB7XG4gICAgICAgIC8vIOy1nOy0iCDroIzrjZTrp4HsnbQg7J287Ja064KY6riwIOyngeyghCjtlZzrsogg7Zi47LacKVxuICAgICAgICBsZXQgaWQgPSB0aGlzLnByb3BzLmlkO1xuICAgICAgICBpZih0eXBlb2YgaWQgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICBpZCA9IFV0aWwuZ2V0VVVJRCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5pZCA9IGlkO1xuICAgIH0sXG4gICAgY29tcG9uZW50RGlkTW91bnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAvLyDstZzstIgg66CM642U66eB7J20IOydvOyWtOuCnCDri6TsnYwo7ZWc67KIIO2YuOy2nClcbiAgICAgICAgdGhpcy4kd2luZG93ID0gJCgnIycrdGhpcy5pZCk7XG4gICAgICAgIHRoaXMud2luZG93ID0gdGhpcy4kd2luZG93LmtlbmRvV2luZG93KHRoaXMuZ2V0T3B0aW9ucygpKS5kYXRhKCdrZW5kb1dpbmRvdycpO1xuXG4gICAgICAgIC8vIEV2ZW50c1xuICAgICAgICB0aGlzLndpbmRvdy5iaW5kKCdvcGVuJywgdGhpcy5vbk9wZW4pO1xuICAgICAgICB0aGlzLndpbmRvdy5iaW5kKCdjbG9zZScsIHRoaXMub25DbG9zZSk7XG4gICAgICAgIHRoaXMud2luZG93LmJpbmQoJ3Jlc2l6ZScsIHRoaXMub25SZXNpemUpO1xuICAgICAgICB0aGlzLndpbmRvdy5iaW5kKCdkcmFnc3RhcnQnLCB0aGlzLm9uRHJhZ1N0YXJ0KTtcbiAgICAgICAgdGhpcy53aW5kb3cuYmluZCgnZHJhZ2VuZCcsIHRoaXMub25EcmFnRW5kKTtcbiAgICAgICAgdGhpcy53aW5kb3cuYmluZCgncmVmcmVzaCcsIHRoaXMub25SZWZyZXNoKTtcbiAgICAgICAgdGhpcy53aW5kb3cuYmluZCgnYWN0aXZhdGUnLCB0aGlzLm9uQWN0aXZhdGUpO1xuICAgICAgICB0aGlzLndpbmRvdy5iaW5kKCdkZWFjdGl2YXRlJywgdGhpcy5vbkRlYWN0aXZhdGUpO1xuXG4gICAgICAgIC8vIHJlbmRlcuydmCBkaXbripQgay13aW5kb3ctY29udGVudCDsl5Ag7ZW064u565CY64qUIGRvbeydtOuLpC5cbiAgICAgICAgLy8g67aA66qo7J24IGstd2luZG93IOyXkCBhZGRDbGFzcyDtlbTspIDri6QuXG4gICAgICAgIGlmKHR5cGVvZiB0aGlzLnByb3BzLmNsYXNzTmFtZSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIHRoaXMuJHdpbmRvdy5wYXJlbnQoKS5hZGRDbGFzcyh0aGlzLnByb3BzLmNsYXNzTmFtZSk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgICAgIC8vIO2VhOyImCDtla3rqqlcbiAgICAgICAgY29uc3QgeyBjbGFzc05hbWUsIGNoaWxkcmVuIH0gPSB0aGlzLnByb3BzO1xuXG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8ZGl2IGlkPXt0aGlzLmlkfT57Y2hpbGRyZW59PC9kaXY+XG4gICAgICAgICk7XG4gICAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gV2luZG93OyIsIi8qKlxyXG4gKiBUYWIgY29tcG9uZW50XHJcbiAqXHJcbiAqIHZlcnNpb24gPHR0PiQgVmVyc2lvbjogMS4wICQ8L3R0PiBkYXRlOjIwMTYvMDgvMDZcclxuICogYXV0aG9yIDxhIGhyZWY9XCJtYWlsdG86aHJhaG5AbmtpYS5jby5rclwiPkFobiBIeXVuZy1SbzwvYT5cclxuICpcclxuICogZXhhbXBsZTpcclxuICogPFB1Zi5UYWIgLz5cclxuICpcclxuICogS2VuZG8gVGFiU3RyaXAg65287J2067iM65+s66as7JeQIOyiheyGjeyggeydtOuLpC5cclxuICovXHJcbid1c2Ugc3RyaWN0JztcclxuXHJcbnZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XHJcblxyXG52YXIgVGFiID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xyXG4gICAgICAgIGRpc3BsYXlOYW1lOiAnVGFiJyxcclxuICAgICAgICByZW5kZXI6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAvLyDtlYTsiJgg7ZWt66qpXHJcbiAgICAgICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgICAgICA8bGk+e3RoaXMucHJvcHMuY2hpbGRyZW59PC9saT5cclxuICAgICAgICAgICAgKTtcclxuICAgICAgICB9XHJcbn0pO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBUYWI7IiwiLyoqXHJcbiAqIFRhYkNvbnRlbnQgY29tcG9uZW50XHJcbiAqXHJcbiAqIHZlcnNpb24gPHR0PiQgVmVyc2lvbjogMS4wICQ8L3R0PiBkYXRlOjIwMTYvMDgvMDZcclxuICogYXV0aG9yIDxhIGhyZWY9XCJtYWlsdG86aHJhaG5AbmtpYS5jby5rclwiPkFobiBIeXVuZy1SbzwvYT5cclxuICpcclxuICogZXhhbXBsZTpcclxuICogPFB1Zi5UYWJDb250ZW50IC8+XHJcbiAqXHJcbiAqIEtlbmRvIFRhYlN0cmlwIO+/ve+/ve+/vcy66rev77+977+977+977+9IO+/ve+/ve+/ve+/ve+/ve+/ve+/vcy077+9LlxyXG4gKi9cclxuJ3VzZSBzdHJpY3QnO1xyXG5cclxudmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcclxuXHJcbnZhciBUYWJDb250ZW50ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xyXG4gICAgICAgIGRpc3BsYXlOYW1lOiAnVGFiQ29udGVudCcsXHJcbiAgICAgICAgcmVuZGVyOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgLy8g77+9yrzvv70g77+917jvv71cclxuICAgICAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgICAgICAgICAge3RoaXMucHJvcHMuY2hpbGRyZW59XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgKTtcclxuICAgICAgICB9XHJcbn0pO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBUYWJDb250ZW50OyIsIi8qKlxuICogVGFiU3RyaXAgY29tcG9uZW50XG4gKlxuICogdmVyc2lvbiA8dHQ+JCBWZXJzaW9uOiAxLjAgJDwvdHQ+IGRhdGU6MjAxNi8wOC8wNlxuICogYXV0aG9yIDxhIGhyZWY9XCJtYWlsdG86aHJhaG5AbmtpYS5jby5rclwiPkFobiBIeXVuZy1SbzwvYT5cbiAqXG4gKiBleGFtcGxlOlxuICogPFB1Zi5UYWJTdHJpcCBjbGFzc05hbWU9e2NsYXNzTmFtZX0gc2VsZWN0ZWRJbmRleD17MH0gb25TZWxlY3Q9e2Z1bmN9IC8+XG4gKlxuICogS2VuZG8gVGFiU3RyaXAg65287J2067iM65+s66as7JeQIOyiheyGjeyggeydtOuLpC5cbiAqL1xuJ3VzZSBzdHJpY3QnO1xuXG52YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xudmFyIFByb3BUeXBlcyA9IHJlcXVpcmUoJ3JlYWN0JykuUHJvcFR5cGVzO1xuXG52YXIgVXRpbCA9IHJlcXVpcmUoJy4uLy4uL3NlcnZpY2VzL1V0aWwnKTtcblxudmFyIFRhYlN0cmlwID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICAgIGRpc3BsYXlOYW1lOiAnVGFiU3RyaXAnLFxuICAgIHByb3BUeXBlczoge1xuICAgICAgICBjbGFzc05hbWU6IFByb3BUeXBlcy5zdHJpbmcsXG4gICAgICAgIHNlbGVjdGVkSW5kZXg6IFByb3BUeXBlcy5udW1iZXIsXG4gICAgICAgIGNvbnRlbnRVcmxzOiBQcm9wVHlwZXMuYXJyYXksXG4gICAgICAgIGFuaW1hdGlvbjogUHJvcFR5cGVzLm9uZU9mVHlwZShbXG4gICAgICAgICAgICBQcm9wVHlwZXMub2JqZWN0LFxuICAgICAgICAgICAgUHJvcFR5cGVzLmJvb2xcbiAgICAgICAgXSksXG4gICAgICAgIHRhYlBvc2l0aW9uOiBQcm9wVHlwZXMub25lT2YoWydsZWZ0JywncmlnaHQnLCdib3R0b20nXSksXG4gICAgICAgIG9uU2VsZWN0OiBQcm9wVHlwZXMuZnVuYyxcbiAgICAgICAgb25BY3RpdmF0ZTogUHJvcFR5cGVzLmZ1bmMsXG4gICAgICAgIG9uU2hvdzogUHJvcFR5cGVzLmZ1bmMsXG4gICAgICAgIG9uQ29udGVudExvYWQ6IFByb3BUeXBlcy5mdW5jLFxuICAgICAgICBvbkVycm9yOiBQcm9wVHlwZXMuZnVuY1xuICAgIH0sXG4gICAgaWQ6ICcnLFxuICAgIHNlbGVjdDogZnVuY3Rpb24oaW5kZXgpIHtcbiAgICAgICAgdGhpcy50YWJzdHJpcC5zZWxlY3QoaW5kZXgpO1xuICAgIH0sXG4gICAgb25TZWxlY3Q6IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgLy9jb25zb2xlLmxvZygnb25TZWxlY3QnKTtcbiAgICAgICAgLy9jb25zb2xlLmxvZyhlKTtcbiAgICAgICAgaWYodHlwZW9mIHRoaXMucHJvcHMub25TZWxlY3QgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIHRoaXMucHJvcHMub25TZWxlY3QoZSk7IC8vIGUuaXRlbSwgaW5kZXgg7JWM7JWE64K07IScIOuEmOq4sOyekFxuICAgICAgICB9XG4gICAgfSxcbiAgICBvbkFjdGl2YXRlOiBmdW5jdGlvbihlKSB7XG4gICAgICAgIC8vY29uc29sZS5sb2coJ29uQWN0aXZhdGUnKTtcbiAgICAgICAgLy9jb25zb2xlLmxvZyhlKTtcbiAgICAgICAgaWYodHlwZW9mIHRoaXMucHJvcHMub25BY3RpdmF0ZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgdGhpcy5wcm9wcy5vbkFjdGl2YXRlKGUpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBvblNob3c6IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgLy9jb25zb2xlLmxvZygnb25TaG93Jyk7XG4gICAgICAgIC8vY29uc29sZS5sb2coZSk7XG4gICAgICAgIGlmKHR5cGVvZiB0aGlzLnByb3BzLm9uU2hvdyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgdGhpcy5wcm9wcy5vblNob3coZSk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIG9uQ29udGVudExvYWQ6IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgLy9jb25zb2xlLmxvZygnb25Db250ZW50TG9hZCcpO1xuICAgICAgICAvL2NvbnNvbGUubG9nKGUpO1xuICAgICAgICBpZih0eXBlb2YgdGhpcy5wcm9wcy5vbkNvbnRlbnRMb2FkID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICB0aGlzLnByb3BzLm9uQ29udGVudExvYWQoZSk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIG9uRXJyb3I6IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgLy9jb25zb2xlLmxvZygnb25FcnJvcicpO1xuICAgICAgICAvL2NvbnNvbGUubG9nKGUpO1xuICAgICAgICBpZih0eXBlb2YgdGhpcy5wcm9wcy5vbkVycm9yID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICB0aGlzLnByb3BzLm9uRXJyb3IoZSk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIGdldENoaWxkcmVuOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGNoaWxkcmVuID0gdGhpcy5wcm9wcy5jaGlsZHJlbixcbiAgICAgICAgICAgIGNvdW50ID0gMDtcblxuICAgICAgICByZXR1cm4gUmVhY3QuQ2hpbGRyZW4ubWFwKGNoaWxkcmVuLCAoY2hpbGQpID0+IHtcbiAgICAgICAgICAgIGlmKGNoaWxkID09PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgcmVzdWx0O1xuXG4gICAgICAgICAgICAvLyBUYWJzXG4gICAgICAgICAgICBpZihjb3VudCsrID09PSAwKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gUmVhY3QuY2xvbmVFbGVtZW50KGNoaWxkLCB7XG4gICAgICAgICAgICAgICAgICAgIGNoaWxkcmVuOiBSZWFjdC5DaGlsZHJlbi5tYXAoY2hpbGQucHJvcHMuY2hpbGRyZW4sICh0YWIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKHRhYiA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gUmVhY3QuY2xvbmVFbGVtZW50KHRhYik7XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIH1lbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBUYWJDb250ZW50XG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gUmVhY3QuY2xvbmVFbGVtZW50KGNoaWxkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH0pO1xuICAgIH0sXG4gICAgZ2V0T3B0aW9uczogZnVuY3Rpb24oKSB7XG4gICAgICAgIGNvbnN0IHthbmltYXRpb24sIGNvbnRlbnRVcmxzLCB0YWJQb3NpdGlvbn0gPSB0aGlzLnByb3BzO1xuXG4gICAgICAgIC8vIGFuaW1hdGlvbiAoZmFsc2V8b2JqZWN0KSB0cnVl64qUIOycoO2aqO2VmOyngCDslYrsnYxcbiAgICAgICAgdmFyIF9hbmltYXRpb247XG4gICAgICAgIGlmKHR5cGVvZiBhbmltYXRpb24gPT09ICdib29sZWFuJyAmJiBhbmltYXRpb24gPT09IHRydWUpIHtcbiAgICAgICAgICAgIF9hbmltYXRpb24gPSB7XG4gICAgICAgICAgICAgICAgb3Blbjoge1xuICAgICAgICAgICAgICAgICAgICBlZmZlY3RzOiAnZmFkZUluJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfWVsc2Uge1xuICAgICAgICAgICAgX2FuaW1hdGlvbiA9IGFuaW1hdGlvbjtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBvcHRpb25zID0ge1xuICAgICAgICAgICAgYW5pbWF0aW9uOiBfYW5pbWF0aW9uXG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gdGFiUG9zaXRpb25cbiAgICAgICAgaWYodGFiUG9zaXRpb24pIHtcbiAgICAgICAgICAgICQuZXh0ZW5kKG9wdGlvbnMsIHt0YWJQb3NpdGlvbjogdGFiUG9zaXRpb259KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGNvbnRlbnRVcmxzXG4gICAgICAgIGlmKGNvbnRlbnRVcmxzKSB7XG4gICAgICAgICAgICAkLmV4dGVuZChvcHRpb25zLCB7Y29udGVudFVybHM6IGNvbnRlbnRVcmxzfSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gb3B0aW9ucztcbiAgICB9LFxuICAgIGdldERlZmF1bHRQcm9wczogZnVuY3Rpb24oKSB7XG4gICAgICAgIC8vIO2BtOuemOyKpOqwgCDsg53shLHrkKAg65WMIO2VnOuyiCDtmLjstpzrkJjqs6Ag7LqQ7Iuc65Cc64ukLlxuICAgICAgICAvLyDrtoDrqqgg7Lu07Y+s64SM7Yq47JeQ7IScIHByb3DsnbQg64SY7Ja07Jik7KeAIOyViuydgCDqsr3smrAgKGluIOyXsOyCsOyekOuhnCDtmZXsnbgpIOunpO2VkeydmCDqsJLsnbQgdGhpcy5wcm9wc+yXkCDshKTsoJXrkJzri6QuXG4gICAgICAgIHJldHVybiB7c2VsZWN0ZWRJbmRleDogMCwgYW5pbWF0aW9uOiBmYWxzZX07XG4gICAgfSxcbiAgICBnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIHJldHVybiB7fTtcbiAgICB9LFxuICAgIGNvbXBvbmVudFdpbGxNb3VudDogZnVuY3Rpb24oKSB7XG4gICAgICAgIC8vIOy1nOy0iCDroIzrjZTrp4HsnbQg7J287Ja064KY6riwIOyngeyghCjtlZzrsogg7Zi47LacKVxuICAgICAgICBsZXQgaWQgPSB0aGlzLnByb3BzLmlkO1xuICAgICAgICBpZih0eXBlb2YgaWQgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICBpZCA9IFV0aWwuZ2V0VVVJRCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5pZCA9IGlkO1xuICAgIH0sXG4gICAgY29tcG9uZW50RGlkTW91bnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAvLyDstZzstIgg66CM642U66eB7J20IOydvOyWtOuCnCDri6TsnYwo7ZWc67KIIO2YuOy2nClcbiAgICAgICAgdGhpcy4kdGFic3RyaXAgPSAkKCcjJyt0aGlzLmlkKTtcbiAgICAgICAgdGhpcy50YWJzdHJpcCA9IHRoaXMuJHRhYnN0cmlwLmtlbmRvVGFiU3RyaXAodGhpcy5nZXRPcHRpb25zKCkpLmRhdGEoJ2tlbmRvVGFiU3RyaXAnKTtcblxuICAgICAgICAvLyBFdmVudHNcbiAgICAgICAgdGhpcy50YWJzdHJpcC5iaW5kKCdzZWxlY3QnLCB0aGlzLm9uU2VsZWN0KTtcbiAgICAgICAgdGhpcy50YWJzdHJpcC5iaW5kKCdhY3RpdmF0ZScsIHRoaXMub25BY3RpdmF0ZSk7XG4gICAgICAgIHRoaXMudGFic3RyaXAuYmluZCgnc2hvdycsIHRoaXMub25TaG93KTtcbiAgICAgICAgdGhpcy50YWJzdHJpcC5iaW5kKCdjb250ZW50TG9hZCcsIHRoaXMub25Db250ZW50TG9hZCk7XG4gICAgICAgIHRoaXMudGFic3RyaXAuYmluZCgnZXJyb3InLCB0aGlzLm9uRXJyb3IpO1xuXG4gICAgICAgIHRoaXMuc2VsZWN0KHRoaXMucHJvcHMuc2VsZWN0ZWRJbmRleCk7XG4gICAgfSxcbiAgICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgICAvLyDtlYTsiJgg7ZWt66qpXG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8ZGl2IGlkPXt0aGlzLmlkfSBjbGFzc05hbWU9e3RoaXMucHJvcHMuY2xhc3NOYW1lfT5cbiAgICAgICAgICAgICAgICB7dGhpcy5nZXRDaGlsZHJlbigpfVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICk7XG4gICAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gVGFiU3RyaXA7IiwiLyoqXHJcbiAqIFRhYnMgY29tcG9uZW50XHJcbiAqXHJcbiAqIHZlcnNpb24gPHR0PiQgVmVyc2lvbjogMS4wICQ8L3R0PiBkYXRlOjIwMTYvMDgvMDZcclxuICogYXV0aG9yIDxhIGhyZWY9XCJtYWlsdG86aHJhaG5AbmtpYS5jby5rclwiPkFobiBIeXVuZy1SbzwvYT5cclxuICpcclxuICogZXhhbXBsZTpcclxuICogPFB1Zi5UYWJzIC8+XHJcbiAqXHJcbiAqIEtlbmRvIFRhYlN0cmlwIO+/ve+/ve+/vcy66rev77+977+977+977+9IO+/ve+/ve+/ve+/ve+/ve+/ve+/vcy077+9LlxyXG4gKi9cclxuJ3VzZSBzdHJpY3QnO1xyXG5cclxudmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcclxuXHJcbnZhciBUYWJzID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xyXG4gICAgICAgIGRpc3BsYXlOYW1lOiAnVGFicycsXHJcbiAgICAgICAgcmVuZGVyOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgLy8g77+9yrzvv70g77+917jvv71cclxuICAgICAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgICAgIDx1bD57dGhpcy5wcm9wcy5jaGlsZHJlbn08L3VsPlxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIH1cclxufSk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFRhYnM7IiwiLyoqXG4gKiBwcy11dGlsIHNlcnZpY2VzXG4gKiBcbiAqIHZlcnNpb24gPHR0PiQgVmVyc2lvbjogMS4wICQ8L3R0PiBkYXRlOjIwMTYvMDMvMDFcbiAqIGF1dGhvciA8YSBocmVmPVwibWFpbHRvOmhyYWhuQG5raWEuY28ua3JcIj5BaG4gSHl1bmctUm88L2E+XG4gKiBcbiAqIGV4YW1wbGU6XG4gKiBhcHAuY29udHJvbGxlcignQ3RybCcsIFsnJHNjb3BlJywgJ3BzVXRpbCcsIGZ1bmN0aW9uKCRzY29wZSwgcHNVdGlsKSB7XG4gKiBcdCAgIHZhciByb290UGF0aCA9IHBzVXRpbC5nZXRSb290UGF0aCgpO1xuICogfV0pO1xuICogXG4gKi9cbid1c2Ugc3RyaWN0JztcblxuZnVuY3Rpb24gZ2V0RGF0ZVRvU3RyaW5nKGRhdGUpIHtcblx0dmFyIHllYXIgPSBkYXRlLmdldEZ1bGxZZWFyKCksXG5cdFx0bW9udGggPSB6ZXJvZmlsbChkYXRlLmdldE1vbnRoKCkgKyAxLCAyKSxcblx0XHRkYXkgPSB6ZXJvZmlsbChkYXRlLmdldERhdGUoKSwgMiksXG5cdFx0aG91cnMgPSAoZGF0ZS5nZXRIb3VycygpIDwgMCkgPyAnMDAnIDogemVyb2ZpbGwoZGF0ZS5nZXRIb3VycygpLCAyKSxcdC8vIGRhdGVyYW5nZXBpY2tlciBob3VycyA57Iuc6rCEIOyYpOuyhO2RnOyLnOuQmOuKlCDrsoTqt7jroZwg7J247ZW0IOu5vOykgOuLpC5cblx0XHRtaW51dGVzID0gemVyb2ZpbGwoZGF0ZS5nZXRNaW51dGVzKCksIDIpLFxuXHRcdHNlY29uZHMgPSB6ZXJvZmlsbChkYXRlLmdldFNlY29uZHMoKSwgMiksXG5cdFx0ZGF0ZVN0cmluZyA9IHllYXIgKyAnLScgKyBtb250aCArICctJyArIGRheSArICcgJyArIGhvdXJzICsgJzonICsgbWludXRlcyArICc6JyArIHNlY29uZHM7XG5cblx0cmV0dXJuIGRhdGVTdHJpbmc7XG59XG5cbmZ1bmN0aW9uIHplcm9maWxsKG4sIGRpZ2l0cykge1xuXHR2YXIgemVybyA9ICcnO1xuXHRuID0gbi50b1N0cmluZygpO1xuXG5cdGlmIChuLmxlbmd0aCA8IGRpZ2l0cykge1xuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgZGlnaXRzIC0gbi5sZW5ndGg7IGkrKykge1xuXHRcdFx0emVybyArPSAnMCc7XG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIHplcm8gKyBuO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblx0Z2V0RGF0ZVRvU3RyaW5nOiBnZXREYXRlVG9TdHJpbmdcbn07IiwiLyoqXG4gKiBOdW1iZXJVdGlsIHNlcnZpY2VzXG4gKiBcbiAqIHZlcnNpb24gPHR0PiQgVmVyc2lvbjogMS4wICQ8L3R0PiBkYXRlOjIwMTYvMDUvMTlcbiAqIGF1dGhvciA8YSBocmVmPVwibWFpbHRvOmhyYWhuQG5raWEuY28ua3JcIj5BaG4gSHl1bmctUm88L2E+XG4gKiBcbiAqIGV4YW1wbGU6XG4gKiB2YXIgTnVtYmVyVXRpbCA9IHJlcXVpcmUoJy4uL3NlcnZpY2VzL051bWJlclV0aWwnKTtcbiAqIE51bWJlclV0aWwuZGlnaXQoKTtcbiAqXG4gKiBQdWYuTnVtYmVyVXRpbC5kaWdpdCgpO1xuICovXG4ndXNlIHN0cmljdCc7XG5cbmZ1bmN0aW9uIGRpZ2l0KGkpIHtcblx0dmFyIGRpc3BsYXlUZXh0O1xuXHRpZihpPDEwKSB7XG5cdFx0ZGlzcGxheVRleHQgPSAnMCcraTtcblx0fWVsc2Uge1xuXHRcdGRpc3BsYXlUZXh0ID0gaS50b1N0cmluZygpO1xuXHR9XG5cdHJldHVybiBkaXNwbGF5VGV4dDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cdGRpZ2l0OiBkaWdpdFxufTsiLCIvKipcbiAqIFJlZ0V4cCBzZXJ2aWNlc1xuICogXG4gKiB2ZXJzaW9uIDx0dD4kIFZlcnNpb246IDEuMCAkPC90dD4gZGF0ZToyMDE2LzA1LzIwXG4gKiBhdXRob3IgPGEgaHJlZj1cIm1haWx0bzpocmFobkBua2lhLmNvLmtyXCI+QWhuIEh5dW5nLVJvPC9hPlxuICogXG4gKiBleGFtcGxlOlxuICogdmFyIFJlZ0V4cCA9IHJlcXVpcmUoJy4uL3NlcnZpY2VzL1JlZ0V4cCcpO1xuICogUmVnRXhwLmNoZWNrRW1haWwoc3RyVmFsdWUpO1xuICpcbiAqIFB1Zi5SZWdFeHAuY2hlY2tFbWFpbChzdHJWYWx1ZSk7XG4gKi9cbid1c2Ugc3RyaWN0JztcblxudmFyIHJlZ0V4cF9FTUFJTCA9IC9bMC05YS16QS1aXVtfMC05YS16QS1aLV0qQFtfMC05YS16QS1aLV0rKFxcLltfMC05YS16QS1aLV0rKXsxLDJ9JC87XG5cbmZ1bmN0aW9uIGNoZWNrRW1haWwoc3RyVmFsdWUpIHtcblx0aWYgKCFzdHJWYWx1ZS5tYXRjaChyZWdFeHBfRU1BSUwpKSB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cdHJldHVybiB0cnVlO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblx0Y2hlY2tFbWFpbDogY2hlY2tFbWFpbFxufTsiLCIvKipcbiAqIFJlc291cmNlIHNlcnZpY2VzXG4gKiBcbiAqIHZlcnNpb24gPHR0PiQgVmVyc2lvbjogMS4wICQ8L3R0PiBkYXRlOjIwMTYvMDYvMDNcbiAqIGF1dGhvciA8YSBocmVmPVwibWFpbHRvOmhyYWhuQG5raWEuY28ua3JcIj5BaG4gSHl1bmctUm88L2E+XG4gKiBcbiAqIGV4YW1wbGU6XG4gKiBQdWYuUmVzb3VyY2UubG9hZFJlc291cmNlKCk7XG4gKiBQdWYuUmVzb3VyY2UuaTE4bihrZXkpO1xuICpcbiAqIOuLpOq1reyWtCDsspjrpqxcbiAqL1xuJ3VzZSBzdHJpY3QnO1xuXG4vLyBsb2FkIHByb3BlcnRpZXNcbnZhciBsb2FkUmVzb3VyY2UgPSBmdW5jdGlvbihuYW1lLCBwYXRoLCBtb2RlLCBsYW5ndWFnZSwgY2FsbGJhY2spIHtcblxuXHQkLmkxOG4ucHJvcGVydGllcyh7XG5cdCAgICBuYW1lOiBuYW1lLFxuXHQgICAgcGF0aDogcGF0aCxcblx0ICAgIG1vZGU6IG1vZGUsXG5cdCAgICBsYW5ndWFnZTogbGFuZ3VhZ2UsXG5cdCAgICBjYWxsYmFjazogY2FsbGJhY2tcblx0XHQvKlxuXHRcdGZ1bmN0aW9uKCkge1xuXHRcdFx0Ly8gQWNjZXNzaW5nIGEgc2ltcGxlIHZhbHVlIHRocm91Z2ggdGhlIG1hcFxuXHRcdFx0alF1ZXJ5LmkxOG4ucHJvcCgnbXNnX2hlbGxvJyk7XG5cdFx0XHQvLyBBY2Nlc3NpbmcgYSB2YWx1ZSB3aXRoIHBsYWNlaG9sZGVycyB0aHJvdWdoIHRoZSBtYXBcblx0XHRcdGpRdWVyeS5pMThuLnByb3AoJ21zZ19jb21wbGV4JywgJ0pvaG4nKTtcblx0XG5cdFx0XHQvLyBBY2Nlc3NpbmcgYSBzaW1wbGUgdmFsdWUgdGhyb3VnaCBhIEpTIHZhcmlhYmxlXG5cdFx0XHRhbGVydChtc2dfaGVsbG8gKycgJysgbXNnX3dvcmxkKTtcblx0XHRcdC8vIEFjY2Vzc2luZyBhIHZhbHVlIHdpdGggcGxhY2Vob2xkZXJzIHRocm91Z2ggYSBKUyBmdW5jdGlvblxuXHRcdFx0YWxlcnQobXNnX2NvbXBsZXgoJ0pvaG4nKSk7XG5cdFx0XHRhbGVydChtc2dfaGVsbG8pO1xuXHQgICAgfVxuXHQgICAgKi9cblx0fSk7XG59O1xuXG52YXIgaTE4biA9IGZ1bmN0aW9uKGtleSkge1xuXHQvL3ZhciBhcmdzID0gJ1xcJycgKyBrZXkgKyAnXFwnJztcblx0Ly9mb3IgKHZhciBpPTE7IGk8YXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgIC8vICAgYXJncyArPSAnLCBcXCcnICsgYXJndW1lbnRzW2ldICsgJ1xcJyc7XG5cdC8vfVxuXHQvL3JldHVybiBldmFsKCckLmkxOG4ucHJvcCgnICsgYXJncyArICcpJyk7XG5cdHJldHVybiAkLmkxOG4ucHJvcC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xufTtcblxudmFyIGkxOG5CeUtleSA9IGZ1bmN0aW9uKGtleSkge1xuXHQvL3ZhciBhcmdzID0gJ1xcJycgKyBrZXkgKyAnXFwnJztcblx0Ly9mb3IgKHZhciBpPTE7IGk8YXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG5cdC8vXHRhcmdzICs9ICcsIFxcJycgKyAkLmkxOG4ucHJvcChhcmd1bWVudHNbaV0pICsgJ1xcJyc7XG5cdC8vfVxuXHQvL3JldHVybiBldmFsKCckLmkxOG4ucHJvcCgnICsgYXJncyArICcpJyk7XG5cdHZhciBhcmdzID0gW2tleV07XG5cdGZvciAodmFyIGk9MTsgaTxhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcblx0XHRhcmdzLnB1c2goJC5pMThuLnByb3AoYXJndW1lbnRzW2ldKSk7XG5cdH1cblx0cmV0dXJuICQuaTE4bi5wcm9wLmFwcGx5KHRoaXMsIGFyZ3MpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cdGxvYWRSZXNvdXJjZTogbG9hZFJlc291cmNlLFxuXHRpMThuOiBpMThuLFxuXHRpMThuQnlLZXk6IGkxOG5CeUtleVxufTsiLCIvKipcbiAqIFV0aWwgc2VydmljZXNcbiAqIFxuICogdmVyc2lvbiA8dHQ+JCBWZXJzaW9uOiAxLjAgJDwvdHQ+IGRhdGU6MjAxNi8wMy8wMVxuICogYXV0aG9yIDxhIGhyZWY9XCJtYWlsdG86aHJhaG5AbmtpYS5jby5rclwiPkFobiBIeXVuZy1SbzwvYT5cbiAqIFxuICogZXhhbXBsZTpcbiAqIHZhciBVdGlsID0gcmVxdWlyZSgnLi4vc2VydmljZXMvVXRpbCcpO1xuICogVXRpbC5nZXRVVUlEKCk7XG4gKlxuICovXG4ndXNlIHN0cmljdCc7XG5cbmZ1bmN0aW9uIGdldFVVSUQoKSB7XG5cdHJldHVybiAneHh4eHh4eHgteHh4eC00eHh4LXl4eHgteHh4eHh4eHh4eHh4Jy5yZXBsYWNlKC9beHldL2csIGZ1bmN0aW9uKGMpIHtcblx0XHR2YXIgciA9IE1hdGgucmFuZG9tKCkqMTZ8MCwgdiA9IGMgPT0gJ3gnID8gciA6IChyJjB4M3wweDgpO1xuXHRcdHJldHVybiB2LnRvU3RyaW5nKDE2KTtcblx0fSk7XG59XG5cbmZ1bmN0aW9uIHVuaXF1ZUlEKCkge1xuXHRyZXR1cm4gJ2lkLScgKyBNYXRoLnJhbmRvbSgpLnRvU3RyaW5nKDM2KS5zdWJzdHIoMiwgOSk7XG59XG5cbmZ1bmN0aW9uIHNsZWVwKG1pbGxpc2Vjb25kcykge1xuXHR2YXIgc3RhcnQgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcblx0Zm9yICh2YXIgaSA9IDA7IGkgPCAxZTc7IGkrKykge1xuXHRcdGlmICgobmV3IERhdGUoKS5nZXRUaW1lKCkgLSBzdGFydCkgPiBtaWxsaXNlY29uZHMpIHtcblx0XHRcdGJyZWFrO1xuXHRcdH1cblx0fVxufVxuXG4vLyDsi5zsnpHtjpjsnbTsp4DroZwg7ISk7KCVXG5mdW5jdGlvbiBzZXRTdGFydFBhZ2Uob2JqLCB1cmwpIHtcblx0b2JqLnN0eWxlLmJlaGF2aW9yPSd1cmwoI2RlZmF1bHQjaG9tZXBhZ2UpJztcblx0Ly9vYmouc2V0SG9tZVBhZ2UoJ2h0dHA6Ly9pbnRlcm5ldC5zY291cnQuZ28ua3IvJyk7XG5cdG9iai5zZXRIb21lUGFnZSh1cmwpO1xufVxuXG4vLyDsv6DtgqQg7ISk7KCVXG4vKlxuZnVuY3Rpb24gc2V0Q29va2llKG5hbWUsIHZhbHVlLCBleHBpcmVzKSB7XG5cdC8vIGFsZXJ0KG5hbWUgKyBcIiwgXCIgKyB2YWx1ZSArIFwiLCBcIiArIGV4cGlyZXMpO1xuXHRkb2N1bWVudC5jb29raWUgPSBuYW1lICsgXCI9XCIgKyBlc2NhcGUodmFsdWUpICsgXCI7IHBhdGg9LzsgZXhwaXJlcz1cIiArIGV4cGlyZXMudG9HTVRTdHJpbmcoKTtcbn1cbiovXG5mdW5jdGlvbiBzZXRDb29raWUoY25hbWUsIGN2YWx1ZSwgZXhkYXlzLCBjZG9tYWluKSB7XG5cdHZhciBkID0gbmV3IERhdGUoKTtcblx0ZC5zZXRUaW1lKGQuZ2V0VGltZSgpICsgKGV4ZGF5cyoyNCo2MCo2MCoxMDAwKSk7XG5cdHZhciBleHBpcmVzID0gJ2V4cGlyZXM9JyArIGQudG9VVENTdHJpbmcoKTtcblx0dmFyIGRvbWFpbjtcblx0aWYoY2RvbWFpbikge1xuXHRcdGRvbWFpbiA9ICc7IGRvbWFpbj0nICsgY2RvbWFpbjtcblx0fVxuXHRkb2N1bWVudC5jb29raWUgPSBjbmFtZSArICc9JyArIGVzY2FwZShjdmFsdWUpICsgJzsgcGF0aD0vOyAnICsgZXhwaXJlcyArIGRvbWFpbjtcbn1cblxuLy8g7L+g7YKkIOqwgOyguOyYpOq4sFxuLypcbmZ1bmN0aW9uIGdldENvb2tpZShOYW1lKSB7XG5cdHZhciBzZWFyY2ggPSBOYW1lICsgXCI9XCJcblx0aWYgKGRvY3VtZW50LmNvb2tpZS5sZW5ndGggPiAwKSB7IC8vIOy/oO2CpOqwgCDshKTsoJXrkJjslrQg7J6I64uk66m0XG5cdFx0b2Zmc2V0ID0gZG9jdW1lbnQuY29va2llLmluZGV4T2Yoc2VhcmNoKVxuXHRcdGlmIChvZmZzZXQgIT0gLTEpIHsgLy8g7L+g7YKk6rCAIOyhtOyerO2VmOuptFxuXHRcdFx0b2Zmc2V0ICs9IHNlYXJjaC5sZW5ndGhcblx0XHRcdC8vIHNldCBpbmRleCBvZiBiZWdpbm5pbmcgb2YgdmFsdWVcblx0XHRcdGVuZCA9IGRvY3VtZW50LmNvb2tpZS5pbmRleE9mKFwiO1wiLCBvZmZzZXQpXG5cdFx0XHQvLyDsv6DtgqQg6rCS7J2YIOuniOyngOuniSDsnITsuZgg7J24642x7IqkIOuyiO2YuCDshKTsoJVcblx0XHRcdGlmIChlbmQgPT0gLTEpXG5cdFx0XHRcdGVuZCA9IGRvY3VtZW50LmNvb2tpZS5sZW5ndGhcblx0XHRcdHJldHVybiB1bmVzY2FwZShkb2N1bWVudC5jb29raWUuc3Vic3RyaW5nKG9mZnNldCwgZW5kKSlcblx0XHR9XG5cdH1cblx0cmV0dXJuIFwiXCI7XG59XG4qL1xuZnVuY3Rpb24gZ2V0Q29va2llKGNuYW1lKSB7XG5cdHZhciBuYW1lID0gY25hbWUgKyAnPSc7XG5cdHZhciBjYSA9IGRvY3VtZW50LmNvb2tpZS5zcGxpdCgnOycpO1xuXHRmb3IodmFyIGkgPSAwOyBpIDxjYS5sZW5ndGg7IGkrKykge1xuXHRcdHZhciBjID0gY2FbaV07XG5cdFx0d2hpbGUgKGMuY2hhckF0KDApPT0nICcpIHtcblx0XHRcdGMgPSBjLnN1YnN0cmluZygxKTtcblx0XHR9XG5cdFx0aWYgKGMuaW5kZXhPZihuYW1lKSA9PSAwKSB7XG5cdFx0XHRyZXR1cm4gdW5lc2NhcGUoYy5zdWJzdHJpbmcobmFtZS5sZW5ndGgsIGMubGVuZ3RoKSk7XG5cdFx0fVxuXHR9XG5cdHJldHVybiAnJztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cdGdldFVVSUQ6IGdldFVVSUQsXG5cdHVuaXF1ZUlEOiB1bmlxdWVJRCxcblx0c2xlZXA6IHNsZWVwLFxuXHRzZXRDb29raWU6IHNldENvb2tpZSxcblx0Z2V0Q29va2llOiBnZXRDb29raWVcbn07XG5cbi8vYW5ndWxhci5tb2R1bGUoJ3BzLnNlcnZpY2VzLnV0aWwnLCBbXSlcbi8vLmZhY3RvcnkoJ3BzVXRpbCcsIFsnJHdpbmRvdycsICckbG9jYXRpb24nLCBmdW5jdGlvbigkd2luZG93LCAkbG9jYXRpb24pIHtcbi8vXHR2YXIgZmFjdG9yeSA9IHt9O1xuLy9cdGZhY3Rvcnkuc2hvdyA9IGZ1bmN0aW9uKG1zZykge1xuLy8gICAgICAgICR3aW5kb3cuYWxlcnQobXNnKTtcbi8vICAgIH07XG4vL1xuLy8gICAgZmFjdG9yeS5yZXZlcnNlID0gZnVuY3Rpb24obmFtZSkge1xuLy9cdFx0cmV0dXJuIG5hbWUuc3BsaXQoXCJcIikucmV2ZXJzZSgpLmpvaW4oXCJcIik7XG4vL1x0fTtcbi8vXG4vL1x0Ly8gcm9vdCBwYXRoXG4vL1x0ZmFjdG9yeS5nZXRSb290UGF0aCA9IGZ1bmN0aW9uKCkge1xuLy9cdFx0Ly8ganPsl5DshJwgQ29udGV4dFBhdGgg66W8IOyWu+ydhCDsiJgg7JeG7J2MIC0gUm9vdCBQYXRo66W8IOyWu+yWtOyEnCDsnZHsmqntlZjsnpAuXG4vL1x0XHQvKnZhciBvZmZzZXQ9bG9jYXRpb24uaHJlZi5pbmRleE9mKGxvY2F0aW9uLmhvc3QpK2xvY2F0aW9uLmhvc3QubGVuZ3RoO1xuLy9cdCAgICB2YXIgY3R4UGF0aD1sb2NhdGlvbi5ocmVmLnN1YnN0cmluZyhvZmZzZXQsbG9jYXRpb24uaHJlZi5pbmRleE9mKCcvJyxvZmZzZXQrMSkpO1xuLy9cdCAgICByZXR1cm4gY3R4UGF0aDsqL1xuLy9cbi8vXHQgICAgdmFyIG9mZnNldCA9ICR3aW5kb3cubG9jYXRpb24uaHJlZi5pbmRleE9mKCR3aW5kb3cubG9jYXRpb24uaG9zdCkgKyAkd2luZG93LmxvY2F0aW9uLmhvc3QubGVuZ3RoO1xuLy9cdCAgICB2YXIgY3R4UGF0aCA9ICR3aW5kb3cubG9jYXRpb24uaHJlZi5zdWJzdHJpbmcob2Zmc2V0LCAkd2luZG93LmxvY2F0aW9uLmhyZWYuaW5kZXhPZignLycsIG9mZnNldCArIDEpKTtcbi8vXHQgICAgcmV0dXJuIGN0eFBhdGg7XG4vL1x0fTtcbi8vXG4vL1x0Ly8gdXVpZFxuLy9cdGZhY3RvcnkuZ2V0VVVJRCA9IGZ1bmN0aW9uKCkge1xuLy9cdFx0cmV0dXJuICd4eHh4eHh4eC14eHh4LTR4eHgteXh4eC14eHh4eHh4eHh4eHgnLnJlcGxhY2UoL1t4eV0vZywgZnVuY3Rpb24oYykge1xuLy9cdFx0XHR2YXIgciA9IE1hdGgucmFuZG9tKCkqMTZ8MCwgdiA9IGMgPT0gJ3gnID8gciA6IChyJjB4M3wweDgpO1xuLy9cdFx0XHRyZXR1cm4gdi50b1N0cmluZygxNik7XG4vL1x0XHR9KTtcbi8vXHR9O1xuLy9cbi8vXHQvLyB0b29sdGlwXG4vL1x0ZmFjdG9yeS50b29sdGlwID0gZnVuY3Rpb24oc2VsZWN0b3IpIHtcbi8vXG4vL1x0XHRpZih0eXBlb2Ygc2VsZWN0b3IgPT09ICd1bmRlZmluZWQnKSB7XG4vL1x0XHRcdHNlbGVjdG9yID0gJ1tkYXRhLXRvZ2dsZT1cInRvb2x0aXBcIl0nO1xuLy9cdFx0fVxuLy8vL1x0XHQkKHNlbGVjdG9yKS5ic1Rvb2x0aXAoKTtcbi8vXHRcdCQoc2VsZWN0b3IpLnRvb2x0aXAoKTtcbi8vXHR9O1xuLy9cbi8vICAgIHJldHVybiBmYWN0b3J5O1xuLy99XSk7XG4iXX0=
