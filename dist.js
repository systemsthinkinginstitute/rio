/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(1);


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.View = exports.rio = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _morphdom = __webpack_require__(2);

var _morphdom2 = _interopRequireDefault(_morphdom);

var _css2 = __webpack_require__(3);

var _css3 = _interopRequireDefault(_css2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var registry = {
  idInstances: {},
  fns: {},
  fids: new WeakMap(),
  styles: []
};

var id = function id() {
  return String(Math.random());
};

var View = function () {
  function View() {
    _classCallCheck(this, View);

    var key = this.key.apply(this, arguments);
    if (registry.idInstances[key]) {
      // give back an existing instance if we already have
      return registry.idInstances[key];
    }
    this.handlers = { mount: [], update: [], updated: [], unmount: [] };
    this.initialize.apply(this, arguments);
    this.finalize.apply(this);
    this.refs = Refs(this);
    this._id = key;
    this._fids = [];
    this.parent = null;
    this._updatedQueue = [];
    this._mounted = false;
    this._depth = 0;
    this.views = {};
    registry.fids.set(this, new WeakMap());
  }

  /* methods to override */

  _createClass(View, [{
    key: 'namespace',
    value: function namespace() {
      // used for scoping css
      return this.constructor.name;
    }
  }, {
    key: 'initialize',
    value: function initialize() {
      // implement in subclass
    }
  }, {
    key: 'finalize',
    value: function finalize() {
      // implement in subclass
    }
  }, {
    key: 'render',
    value: function render() {
      // implement in subclass
    }
  }, {
    key: 'style',
    value: function style() {
      // implement in subclass
    }
  }, {
    key: 'key',
    value: function key() {
      throw new Error("Please define a 'key' method that returns a deterministic key for a given instance.");
    }

    /* helper methods */

  }, {
    key: '_register',
    value: function _register() {
      registry.idInstances[this._id] = this;
    }
  }, {
    key: '_injectStyle',
    value: function _injectStyle() {
      // construct compiled stylesheet and inject
      var css = '';
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = registry.styles[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var _step$value = _slicedToArray(_step.value, 2),
              name = _step$value[0],
              content = _step$value[1];

          css += content;
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      var styleEl = document.createElement('style');
      styleEl.innerHTML = css;
      this.el.parentNode.insertBefore(styleEl, this.el);
    }
  }, {
    key: '_harvestViews',
    value: function _harvestViews() {
      // deal with views and elements we've just mounted
      var els = Array.from(this.el.querySelectorAll('[data-rio-id]'));
      var descendants = [];
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = els[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var el = _step2.value;

          var instance = registry.idInstances[el.getAttribute('data-rio-id')];
          instance.el = el;
          descendants.push(instance);
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      descendants = descendants.sort(function (a, b) {
        return b._depth - a._depth;
      });

      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = descendants[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var _instance = _step3.value;

          _instance.dispatch('mount');
          _instance._mounted = true;
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3.return) {
            _iterator3.return();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }
    }
  }, {
    key: '_setEl',
    value: function _setEl(el) {
      this.el = el;
      this.refs = Refs(this);
    }
  }, {
    key: '_parent',
    value: function _parent(p) {
      // allow tmpl to set the parent
      this.parent = p;
    }
  }, {
    key: '_renderView',
    value: function _renderView(view) {
      view._parent(this);
      var viewName = view.namespace();
      this.views[viewName] = this.views[viewName] || [];
      this.views[viewName].push(view);
      view._depth = this._depth + 1;
      if (view._mounted) view.dispatch('update');
      var output = view.render();
      if (view._mounted) this._updatedQueue.push(view);
      return output;
    }

    /* public interface */

  }, {
    key: 'tmpl',
    value: function tmpl(strings) {
      var _this = this;

      // tag function for interpolating templates

      if (!registry.styles.find(function (s) {
        return s[0] == _this.namespace();
      })) {
        registry.styles.push([this.namespace(), this.style()]);
      }

      var registerFn = function registerFn(fn) {

        var fid = void 0;
        if (registry.fids.get(_this).has(fn)) {
          fid = registry.fids.get(_this).get(fn);
        } else {
          fid = 'ev' + String(parseInt(Math.random() * Number.MAX_SAFE_INTEGER - 1));
          var boundFn = function boundFn() {
            fn.bind(_this)(window.event);
            return window.event.defaultPrevented;
          };
          registry.fids.get(_this).set(fn, fid);
          registry.fns[fid] = boundFn;
          _this._fids.push(fid);
        }
        return fid;
      };

      var output = '';
      this._updatedQueue.length = 0;

      for (var i = 0; i < strings.length; i++) {

        output += strings[i];
        if (i < (arguments.length <= 1 ? 0 : arguments.length - 1)) {
          var val = arguments.length <= i + 1 ? undefined : arguments[i + 1];
          if (val instanceof View) {
            // assume we want to render if it is a view instance
            output += this._renderView(val);
          } else if (typeof val == 'function') {
            // assume a function is an event handler and stash a reference
            var fid = registerFn(val);
            output += '"rio.fns.' + fid + '()"';
          } else if (Array.isArray(val)) {
            // we need to flatten the array to a string
            for (var _i = 0; _i < val.length; _i++) {
              if (val[_i] instanceof View) {
                val[_i] = this._renderView(val[_i]);
              }
            }
            output += val.join('');
          } else if (val === null || val === undefined) {
            output += '';
          } else {
            output += val;
          }
        }
      }

      this._register(this._id, this);

      // tack our id and view name onto the root element of the view
      output = output.replace(/(<[\w\-]+)/, '$1 data-rio-id="' + this._id + '" data-rio-view="' + this.namespace() + '"');

      return output;
    }
  }, {
    key: 'css',
    value: function css(strings) {
      // tag function for interpolating css
      var output = '';
      for (var i = 0; i < strings.length; i++) {
        output += strings[i];
        if (i < (arguments.length <= 1 ? 0 : arguments.length - 1)) {
          output += arguments.length <= i + 1 ? undefined : arguments[i + 1];
        }
      }
      var namespace = '[data-rio-view=' + this.namespace() + ']';
      output = _css3.default.serialize(_css3.default.namespace(output, namespace));
      return output;
    }
  }, {
    key: 'mount',
    value: function mount(el) {
      try {
        window.rio = rio;
      } catch (e) {}
      this.el = el;
      this.html = this.render();
      this._injectStyle();
      this.el.innerHTML = this.html;
      this._harvestViews();
    }
  }, {
    key: 'unmount',
    value: function unmount() {
      var _this2 = this;

      // deregister our  event listeners
      var _iteratorNormalCompletion4 = true;
      var _didIteratorError4 = false;
      var _iteratorError4 = undefined;

      try {
        for (var _iterator4 = this._fids[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
          var fid = _step4.value;

          delete registry.fns[fid];
        }
        // remove any associated element from the dom
      } catch (err) {
        _didIteratorError4 = true;
        _iteratorError4 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion4 && _iterator4.return) {
            _iterator4.return();
          }
        } finally {
          if (_didIteratorError4) {
            throw _iteratorError4;
          }
        }
      }

      if (this.el && this.el.parentNode) {
        this.el.parentNode.removeChild(this.el);
      }
      // remove ourself from our parent's views listing
      if (this.parent) {
        var viewName = this.namespace();
        var index = this.parent.views[viewName].findIndex(function (v) {
          return v == _this2;
        });
        this.parent.views[viewName].splice(index, 1);
      }
    }
  }, {
    key: 'update',
    value: function update() {
      // rerender the view and morph the dom to match
      if (!this.el) return;
      this.dispatch('update');
      var newHTML = this.render().trim();

      function isElement(node) {
        return node.nodeType == Node.ELEMENT_NODE;
      }

      (0, _morphdom2.default)(this.el, newHTML, {
        getNodeKey: function getNodeKey(node) {
          return isElement(node) ? node.getAttribute('data-rio-id') || node.id : node.id;
        },
        onNodeDiscarded: function onNodeDiscarded(node) {
          // unmount our associated instance
          if (isElement(node) && node.hasAttribute('data-rio-id')) {
            var rioId = node.getAttribute('data-rio-id');
            var instance = registry.idInstances[rioId];
            instance.dispatch('unmount');
            instance.unmount();
          }
        },
        onBeforeNodeDiscarded: function onBeforeNodeDiscarded(node) {
          // don't remove elements with rio-sacrosanct attribute
          return isElement(node) && !node.hasAttribute('rio-sacrosanct');
        },
        onBeforeNodeAdded: function onBeforeNodeAdded(node) {
          // transplant existing view instance to its new element if need be
          if (isElement(node) && node.hasAttribute('data-rio-id')) {
            var rioId = node.getAttribute('data-rio-id');
            var instance = registry.idInstances[rioId];
            // if the old element is in the dom, remove it and throw it away
            if (instance && instance.el && instance.el.parentNode) {
              instance.el.parentNode.removeChild(instance.el);
            }
            instance._setEl(node);
          }
        },
        onNodeAdded: function onNodeAdded(node) {
          // mount our view instance if it is new
          if (isElement(node) && node.hasAttribute('data-rio-view') && node.hasAttribute('data-rio-id')) {
            var rioId = node.getAttribute('data-rio-id');
            var instance = registry.idInstances[rioId];
            instance.el = node;
            if (!instance._mounted) {
              instance.dispatch('mount');
            }
          }
        }
      });

      while (this._updatedQueue.length) {
        var view = this._updatedQueue.shift();
        view.dispatch('updated');
      }

      this.dispatch('updated');
    }
  }, {
    key: 'on',
    value: function on(eventName, callback) {
      if (!this.handlers[eventName]) {
        throw new Error("no event " + eventName);
      }
      this.handlers[eventName].push(callback);
    }
  }, {
    key: 'dispatch',
    value: function dispatch(eventName) {
      var _iteratorNormalCompletion5 = true;
      var _didIteratorError5 = false;
      var _iteratorError5 = undefined;

      try {
        for (var _iterator5 = this.handlers[eventName][Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
          var handler = _step5.value;

          handler.call(this);
        }
      } catch (err) {
        _didIteratorError5 = true;
        _iteratorError5 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion5 && _iterator5.return) {
            _iterator5.return();
          }
        } finally {
          if (_didIteratorError5) {
            throw _iteratorError5;
          }
        }
      }
    }
  }, {
    key: 'root',
    get: function get() {
      return this.el;
    }
  }]);

  return View;
}();

function Refs(view) {

  var handler = {
    get: function get(target, name) {
      if (target[name]) {
        return target[name];
      }
      if (view.el) {
        var el = view.el.querySelector('[ref=' + name + ']');
        target[name] = el;
        return el;
      } else {
        return null;
      }
    }
  };

  return new Proxy({}, handler);
}

var rio = { fns: registry.fns, View: View };

exports.rio = rio;
exports.View = View;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var range; // Create a range object for efficently rendering strings to elements.
var NS_XHTML = 'http://www.w3.org/1999/xhtml';

var doc = typeof document === 'undefined' ? undefined : document;

var testEl = doc ?
    doc.body || doc.createElement('div') :
    {};

// Fixes <https://github.com/patrick-steele-idem/morphdom/issues/32>
// (IE7+ support) <=IE7 does not support el.hasAttribute(name)
var actualHasAttributeNS;

if (testEl.hasAttributeNS) {
    actualHasAttributeNS = function(el, namespaceURI, name) {
        return el.hasAttributeNS(namespaceURI, name);
    };
} else if (testEl.hasAttribute) {
    actualHasAttributeNS = function(el, namespaceURI, name) {
        return el.hasAttribute(name);
    };
} else {
    actualHasAttributeNS = function(el, namespaceURI, name) {
        return el.getAttributeNode(namespaceURI, name) != null;
    };
}

var hasAttributeNS = actualHasAttributeNS;


function toElement(str) {
    if (!range && doc.createRange) {
        range = doc.createRange();
        range.selectNode(doc.body);
    }

    var fragment;
    if (range && range.createContextualFragment) {
        fragment = range.createContextualFragment(str);
    } else {
        fragment = doc.createElement('body');
        fragment.innerHTML = str;
    }
    return fragment.childNodes[0];
}

/**
 * Returns true if two node's names are the same.
 *
 * NOTE: We don't bother checking `namespaceURI` because you will never find two HTML elements with the same
 *       nodeName and different namespace URIs.
 *
 * @param {Element} a
 * @param {Element} b The target element
 * @return {boolean}
 */
function compareNodeNames(fromEl, toEl) {
    var fromNodeName = fromEl.nodeName;
    var toNodeName = toEl.nodeName;

    if (fromNodeName === toNodeName) {
        return true;
    }

    if (toEl.actualize &&
        fromNodeName.charCodeAt(0) < 91 && /* from tag name is upper case */
        toNodeName.charCodeAt(0) > 90 /* target tag name is lower case */) {
        // If the target element is a virtual DOM node then we may need to normalize the tag name
        // before comparing. Normal HTML elements that are in the "http://www.w3.org/1999/xhtml"
        // are converted to upper case
        return fromNodeName === toNodeName.toUpperCase();
    } else {
        return false;
    }
}

/**
 * Create an element, optionally with a known namespace URI.
 *
 * @param {string} name the element name, e.g. 'div' or 'svg'
 * @param {string} [namespaceURI] the element's namespace URI, i.e. the value of
 * its `xmlns` attribute or its inferred namespace.
 *
 * @return {Element}
 */
function createElementNS(name, namespaceURI) {
    return !namespaceURI || namespaceURI === NS_XHTML ?
        doc.createElement(name) :
        doc.createElementNS(namespaceURI, name);
}

/**
 * Copies the children of one DOM element to another DOM element
 */
function moveChildren(fromEl, toEl) {
    var curChild = fromEl.firstChild;
    while (curChild) {
        var nextChild = curChild.nextSibling;
        toEl.appendChild(curChild);
        curChild = nextChild;
    }
    return toEl;
}

function morphAttrs(fromNode, toNode) {
    var attrs = toNode.attributes;
    var i;
    var attr;
    var attrName;
    var attrNamespaceURI;
    var attrValue;
    var fromValue;

    for (i = attrs.length - 1; i >= 0; --i) {
        attr = attrs[i];
        attrName = attr.name;
        attrNamespaceURI = attr.namespaceURI;
        attrValue = attr.value;

        if (attrNamespaceURI) {
            attrName = attr.localName || attrName;
            fromValue = fromNode.getAttributeNS(attrNamespaceURI, attrName);

            if (fromValue !== attrValue) {
                fromNode.setAttributeNS(attrNamespaceURI, attrName, attrValue);
            }
        } else {
            fromValue = fromNode.getAttribute(attrName);

            if (fromValue !== attrValue) {
                fromNode.setAttribute(attrName, attrValue);
            }
        }
    }

    // Remove any extra attributes found on the original DOM element that
    // weren't found on the target element.
    attrs = fromNode.attributes;

    for (i = attrs.length - 1; i >= 0; --i) {
        attr = attrs[i];
        if (attr.specified !== false) {
            attrName = attr.name;
            attrNamespaceURI = attr.namespaceURI;

            if (attrNamespaceURI) {
                attrName = attr.localName || attrName;

                if (!hasAttributeNS(toNode, attrNamespaceURI, attrName)) {
                    fromNode.removeAttributeNS(attrNamespaceURI, attrName);
                }
            } else {
                if (!hasAttributeNS(toNode, null, attrName)) {
                    fromNode.removeAttribute(attrName);
                }
            }
        }
    }
}

function syncBooleanAttrProp(fromEl, toEl, name) {
    if (fromEl[name] !== toEl[name]) {
        fromEl[name] = toEl[name];
        if (fromEl[name]) {
            fromEl.setAttribute(name, '');
        } else {
            fromEl.removeAttribute(name, '');
        }
    }
}

var specialElHandlers = {
    /**
     * Needed for IE. Apparently IE doesn't think that "selected" is an
     * attribute when reading over the attributes using selectEl.attributes
     */
    OPTION: function(fromEl, toEl) {
        syncBooleanAttrProp(fromEl, toEl, 'selected');
    },
    /**
     * The "value" attribute is special for the <input> element since it sets
     * the initial value. Changing the "value" attribute without changing the
     * "value" property will have no effect since it is only used to the set the
     * initial value.  Similar for the "checked" attribute, and "disabled".
     */
    INPUT: function(fromEl, toEl) {
        syncBooleanAttrProp(fromEl, toEl, 'checked');
        syncBooleanAttrProp(fromEl, toEl, 'disabled');

        if (fromEl.value !== toEl.value) {
            fromEl.value = toEl.value;
        }

        if (!hasAttributeNS(toEl, null, 'value')) {
            fromEl.removeAttribute('value');
        }
    },

    TEXTAREA: function(fromEl, toEl) {
        var newValue = toEl.value;
        if (fromEl.value !== newValue) {
            fromEl.value = newValue;
        }

        var firstChild = fromEl.firstChild;
        if (firstChild) {
            // Needed for IE. Apparently IE sets the placeholder as the
            // node value and vise versa. This ignores an empty update.
            var oldValue = firstChild.nodeValue;

            if (oldValue == newValue || (!newValue && oldValue == fromEl.placeholder)) {
                return;
            }

            firstChild.nodeValue = newValue;
        }
    },
    SELECT: function(fromEl, toEl) {
        if (!hasAttributeNS(toEl, null, 'multiple')) {
            var selectedIndex = -1;
            var i = 0;
            var curChild = toEl.firstChild;
            while(curChild) {
                var nodeName = curChild.nodeName;
                if (nodeName && nodeName.toUpperCase() === 'OPTION') {
                    if (hasAttributeNS(curChild, null, 'selected')) {
                        selectedIndex = i;
                        break;
                    }
                    i++;
                }
                curChild = curChild.nextSibling;
            }

            fromEl.selectedIndex = i;
        }
    }
};

var ELEMENT_NODE = 1;
var TEXT_NODE = 3;
var COMMENT_NODE = 8;

function noop() {}

function defaultGetNodeKey(node) {
    return node.id;
}

function morphdomFactory(morphAttrs) {

    return function morphdom(fromNode, toNode, options) {
        if (!options) {
            options = {};
        }

        if (typeof toNode === 'string') {
            if (fromNode.nodeName === '#document' || fromNode.nodeName === 'HTML') {
                var toNodeHtml = toNode;
                toNode = doc.createElement('html');
                toNode.innerHTML = toNodeHtml;
            } else {
                toNode = toElement(toNode);
            }
        }

        var getNodeKey = options.getNodeKey || defaultGetNodeKey;
        var onBeforeNodeAdded = options.onBeforeNodeAdded || noop;
        var onNodeAdded = options.onNodeAdded || noop;
        var onBeforeElUpdated = options.onBeforeElUpdated || noop;
        var onElUpdated = options.onElUpdated || noop;
        var onBeforeNodeDiscarded = options.onBeforeNodeDiscarded || noop;
        var onNodeDiscarded = options.onNodeDiscarded || noop;
        var onBeforeElChildrenUpdated = options.onBeforeElChildrenUpdated || noop;
        var childrenOnly = options.childrenOnly === true;

        // This object is used as a lookup to quickly find all keyed elements in the original DOM tree.
        var fromNodesLookup = {};
        var keyedRemovalList;

        function addKeyedRemoval(key) {
            if (keyedRemovalList) {
                keyedRemovalList.push(key);
            } else {
                keyedRemovalList = [key];
            }
        }

        function walkDiscardedChildNodes(node, skipKeyedNodes) {
            if (node.nodeType === ELEMENT_NODE) {
                var curChild = node.firstChild;
                while (curChild) {

                    var key = undefined;

                    if (skipKeyedNodes && (key = getNodeKey(curChild))) {
                        // If we are skipping keyed nodes then we add the key
                        // to a list so that it can be handled at the very end.
                        addKeyedRemoval(key);
                    } else {
                        // Only report the node as discarded if it is not keyed. We do this because
                        // at the end we loop through all keyed elements that were unmatched
                        // and then discard them in one final pass.
                        onNodeDiscarded(curChild);
                        if (curChild.firstChild) {
                            walkDiscardedChildNodes(curChild, skipKeyedNodes);
                        }
                    }

                    curChild = curChild.nextSibling;
                }
            }
        }

        /**
         * Removes a DOM node out of the original DOM
         *
         * @param  {Node} node The node to remove
         * @param  {Node} parentNode The nodes parent
         * @param  {Boolean} skipKeyedNodes If true then elements with keys will be skipped and not discarded.
         * @return {undefined}
         */
        function removeNode(node, parentNode, skipKeyedNodes) {
            if (onBeforeNodeDiscarded(node) === false) {
                return;
            }

            if (parentNode) {
                parentNode.removeChild(node);
            }

            onNodeDiscarded(node);
            walkDiscardedChildNodes(node, skipKeyedNodes);
        }

        // // TreeWalker implementation is no faster, but keeping this around in case this changes in the future
        // function indexTree(root) {
        //     var treeWalker = document.createTreeWalker(
        //         root,
        //         NodeFilter.SHOW_ELEMENT);
        //
        //     var el;
        //     while((el = treeWalker.nextNode())) {
        //         var key = getNodeKey(el);
        //         if (key) {
        //             fromNodesLookup[key] = el;
        //         }
        //     }
        // }

        // // NodeIterator implementation is no faster, but keeping this around in case this changes in the future
        //
        // function indexTree(node) {
        //     var nodeIterator = document.createNodeIterator(node, NodeFilter.SHOW_ELEMENT);
        //     var el;
        //     while((el = nodeIterator.nextNode())) {
        //         var key = getNodeKey(el);
        //         if (key) {
        //             fromNodesLookup[key] = el;
        //         }
        //     }
        // }

        function indexTree(node) {
            if (node.nodeType === ELEMENT_NODE) {
                var curChild = node.firstChild;
                while (curChild) {
                    var key = getNodeKey(curChild);
                    if (key) {
                        fromNodesLookup[key] = curChild;
                    }

                    // Walk recursively
                    indexTree(curChild);

                    curChild = curChild.nextSibling;
                }
            }
        }

        indexTree(fromNode);

        function handleNodeAdded(el) {
            onNodeAdded(el);

            var curChild = el.firstChild;
            while (curChild) {
                var nextSibling = curChild.nextSibling;

                var key = getNodeKey(curChild);
                if (key) {
                    var unmatchedFromEl = fromNodesLookup[key];
                    if (unmatchedFromEl && compareNodeNames(curChild, unmatchedFromEl)) {
                        curChild.parentNode.replaceChild(unmatchedFromEl, curChild);
                        morphEl(unmatchedFromEl, curChild);
                    }
                }

                handleNodeAdded(curChild);
                curChild = nextSibling;
            }
        }

        function morphEl(fromEl, toEl, childrenOnly) {
            var toElKey = getNodeKey(toEl);
            var curFromNodeKey;

            if (toElKey) {
                // If an element with an ID is being morphed then it is will be in the final
                // DOM so clear it out of the saved elements collection
                delete fromNodesLookup[toElKey];
            }

            if (toNode.isSameNode && toNode.isSameNode(fromNode)) {
                return;
            }

            if (!childrenOnly) {
                if (onBeforeElUpdated(fromEl, toEl) === false) {
                    return;
                }

                morphAttrs(fromEl, toEl);
                onElUpdated(fromEl);

                if (onBeforeElChildrenUpdated(fromEl, toEl) === false) {
                    return;
                }
            }

            if (fromEl.nodeName !== 'TEXTAREA') {
                var curToNodeChild = toEl.firstChild;
                var curFromNodeChild = fromEl.firstChild;
                var curToNodeKey;

                var fromNextSibling;
                var toNextSibling;
                var matchingFromEl;

                outer: while (curToNodeChild) {
                    toNextSibling = curToNodeChild.nextSibling;
                    curToNodeKey = getNodeKey(curToNodeChild);

                    while (curFromNodeChild) {
                        fromNextSibling = curFromNodeChild.nextSibling;

                        if (curToNodeChild.isSameNode && curToNodeChild.isSameNode(curFromNodeChild)) {
                            curToNodeChild = toNextSibling;
                            curFromNodeChild = fromNextSibling;
                            continue outer;
                        }

                        curFromNodeKey = getNodeKey(curFromNodeChild);

                        var curFromNodeType = curFromNodeChild.nodeType;

                        var isCompatible = undefined;

                        if (curFromNodeType === curToNodeChild.nodeType) {
                            if (curFromNodeType === ELEMENT_NODE) {
                                // Both nodes being compared are Element nodes

                                if (curToNodeKey) {
                                    // The target node has a key so we want to match it up with the correct element
                                    // in the original DOM tree
                                    if (curToNodeKey !== curFromNodeKey) {
                                        // The current element in the original DOM tree does not have a matching key so
                                        // let's check our lookup to see if there is a matching element in the original
                                        // DOM tree
                                        if ((matchingFromEl = fromNodesLookup[curToNodeKey])) {
                                            if (curFromNodeChild.nextSibling === matchingFromEl) {
                                                // Special case for single element removals. To avoid removing the original
                                                // DOM node out of the tree (since that can break CSS transitions, etc.),
                                                // we will instead discard the current node and wait until the next
                                                // iteration to properly match up the keyed target element with its matching
                                                // element in the original tree
                                                isCompatible = false;
                                            } else {
                                                // We found a matching keyed element somewhere in the original DOM tree.
                                                // Let's moving the original DOM node into the current position and morph
                                                // it.

                                                // NOTE: We use insertBefore instead of replaceChild because we want to go through
                                                // the `removeNode()` function for the node that is being discarded so that
                                                // all lifecycle hooks are correctly invoked
                                                fromEl.insertBefore(matchingFromEl, curFromNodeChild);

                                                fromNextSibling = curFromNodeChild.nextSibling;

                                                if (curFromNodeKey) {
                                                    // Since the node is keyed it might be matched up later so we defer
                                                    // the actual removal to later
                                                    addKeyedRemoval(curFromNodeKey);
                                                } else {
                                                    // NOTE: we skip nested keyed nodes from being removed since there is
                                                    //       still a chance they will be matched up later
                                                    removeNode(curFromNodeChild, fromEl, true /* skip keyed nodes */);
                                                }

                                                curFromNodeChild = matchingFromEl;
                                            }
                                        } else {
                                            // The nodes are not compatible since the "to" node has a key and there
                                            // is no matching keyed node in the source tree
                                            isCompatible = false;
                                        }
                                    }
                                } else if (curFromNodeKey) {
                                    // The original has a key
                                    isCompatible = false;
                                }

                                isCompatible = isCompatible !== false && compareNodeNames(curFromNodeChild, curToNodeChild);
                                if (isCompatible) {
                                    // We found compatible DOM elements so transform
                                    // the current "from" node to match the current
                                    // target DOM node.
                                    morphEl(curFromNodeChild, curToNodeChild);
                                }

                            } else if (curFromNodeType === TEXT_NODE || curFromNodeType == COMMENT_NODE) {
                                // Both nodes being compared are Text or Comment nodes
                                isCompatible = true;
                                // Simply update nodeValue on the original node to
                                // change the text value
                                if (curFromNodeChild.nodeValue !== curToNodeChild.nodeValue) {
                                    curFromNodeChild.nodeValue = curToNodeChild.nodeValue;
                                }

                            }
                        }

                        if (isCompatible) {
                            // Advance both the "to" child and the "from" child since we found a match
                            curToNodeChild = toNextSibling;
                            curFromNodeChild = fromNextSibling;
                            continue outer;
                        }

                        // No compatible match so remove the old node from the DOM and continue trying to find a
                        // match in the original DOM. However, we only do this if the from node is not keyed
                        // since it is possible that a keyed node might match up with a node somewhere else in the
                        // target tree and we don't want to discard it just yet since it still might find a
                        // home in the final DOM tree. After everything is done we will remove any keyed nodes
                        // that didn't find a home
                        if (curFromNodeKey) {
                            // Since the node is keyed it might be matched up later so we defer
                            // the actual removal to later
                            addKeyedRemoval(curFromNodeKey);
                        } else {
                            // NOTE: we skip nested keyed nodes from being removed since there is
                            //       still a chance they will be matched up later
                            removeNode(curFromNodeChild, fromEl, true /* skip keyed nodes */);
                        }

                        curFromNodeChild = fromNextSibling;
                    }

                    // If we got this far then we did not find a candidate match for
                    // our "to node" and we exhausted all of the children "from"
                    // nodes. Therefore, we will just append the current "to" node
                    // to the end
                    if (curToNodeKey && (matchingFromEl = fromNodesLookup[curToNodeKey]) && compareNodeNames(matchingFromEl, curToNodeChild)) {
                        fromEl.appendChild(matchingFromEl);
                        morphEl(matchingFromEl, curToNodeChild);
                    } else {
                        var onBeforeNodeAddedResult = onBeforeNodeAdded(curToNodeChild);
                        if (onBeforeNodeAddedResult !== false) {
                            if (onBeforeNodeAddedResult) {
                                curToNodeChild = onBeforeNodeAddedResult;
                            }

                            if (curToNodeChild.actualize) {
                                curToNodeChild = curToNodeChild.actualize(fromEl.ownerDocument || doc);
                            }
                            fromEl.appendChild(curToNodeChild);
                            handleNodeAdded(curToNodeChild);
                        }
                    }

                    curToNodeChild = toNextSibling;
                    curFromNodeChild = fromNextSibling;
                }

                // We have processed all of the "to nodes". If curFromNodeChild is
                // non-null then we still have some from nodes left over that need
                // to be removed
                while (curFromNodeChild) {
                    fromNextSibling = curFromNodeChild.nextSibling;
                    if ((curFromNodeKey = getNodeKey(curFromNodeChild))) {
                        // Since the node is keyed it might be matched up later so we defer
                        // the actual removal to later
                        addKeyedRemoval(curFromNodeKey);
                    } else {
                        // NOTE: we skip nested keyed nodes from being removed since there is
                        //       still a chance they will be matched up later
                        removeNode(curFromNodeChild, fromEl, true /* skip keyed nodes */);
                    }
                    curFromNodeChild = fromNextSibling;
                }
            }

            var specialElHandler = specialElHandlers[fromEl.nodeName];
            if (specialElHandler) {
                specialElHandler(fromEl, toEl);
            }
        } // END: morphEl(...)

        var morphedNode = fromNode;
        var morphedNodeType = morphedNode.nodeType;
        var toNodeType = toNode.nodeType;

        if (!childrenOnly) {
            // Handle the case where we are given two DOM nodes that are not
            // compatible (e.g. <div> --> <span> or <div> --> TEXT)
            if (morphedNodeType === ELEMENT_NODE) {
                if (toNodeType === ELEMENT_NODE) {
                    if (!compareNodeNames(fromNode, toNode)) {
                        onNodeDiscarded(fromNode);
                        morphedNode = moveChildren(fromNode, createElementNS(toNode.nodeName, toNode.namespaceURI));
                    }
                } else {
                    // Going from an element node to a text node
                    morphedNode = toNode;
                }
            } else if (morphedNodeType === TEXT_NODE || morphedNodeType === COMMENT_NODE) { // Text or comment node
                if (toNodeType === morphedNodeType) {
                    if (morphedNode.nodeValue !== toNode.nodeValue) {
                        morphedNode.nodeValue = toNode.nodeValue;
                    }

                    return morphedNode;
                } else {
                    // Text node to something else
                    morphedNode = toNode;
                }
            }
        }

        if (morphedNode === toNode) {
            // The "to node" was not compatible with the "from node" so we had to
            // toss out the "from node" and use the "to node"
            onNodeDiscarded(fromNode);
        } else {
            morphEl(morphedNode, toNode, childrenOnly);

            // We now need to loop over any keyed nodes that might need to be
            // removed. We only do the removal if we know that the keyed node
            // never found a match. When a keyed node is matched up we remove
            // it out of fromNodesLookup and we use fromNodesLookup to determine
            // if a keyed node has been matched up or not
            if (keyedRemovalList) {
                for (var i=0, len=keyedRemovalList.length; i<len; i++) {
                    var elToRemove = fromNodesLookup[keyedRemovalList[i]];
                    if (elToRemove) {
                        removeNode(elToRemove, elToRemove.parentNode, false);
                    }
                }
            }
        }

        if (!childrenOnly && morphedNode !== fromNode && fromNode.parentNode) {
            if (morphedNode.actualize) {
                morphedNode = morphedNode.actualize(fromNode.ownerDocument || doc);
            }
            // If we had to swap out the from node with a new node because the old
            // node was not compatible with the target node then we need to
            // replace the old DOM node in the original DOM tree. This is only
            // possible if the original DOM node was part of a DOM tree which
            // we know is the case if it has a parent node.
            fromNode.parentNode.replaceChild(morphedNode, fromNode);
        }

        return morphedNode;
    };
}

var morphdom = morphdomFactory(morphAttrs);

module.exports = morphdom;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// lifted and modified from https://github.com/jotform/css.js/blob/master/css.js



var fi = function fi() {

  this.cssImportStatements = [];
  this.cssKeyframeStatements = [];

  this.cssRegex = new RegExp('([\\s\\S]*?){([\\s\\S]*?)}', 'gi');
  this.cssMediaQueryRegex = '((@media [\\s\\S]*?){([\\s\\S]*?}\\s*?)})';
  this.cssKeyframeRegex = '((@.*?keyframes [\\s\\S]*?){([\\s\\S]*?}\\s*?)})';
  this.combinedCSSRegex = '((\\s*?(?:\\/\\*[\\s\\S]*?\\*\\/)?\\s*?@media[\\s\\S]*?){([\\s\\S]*?)}\\s*?})|(([\\s\\S]*?){([\\s\\S]*?)})'; //to match css & media queries together
  this.cssCommentsRegex = '(\\/\\*[\\s\\S]*?\\*\\/)';
  this.cssImportStatementRegex = new RegExp('@import .*?;', 'gi');
};

/*
  Strip outs css comments and returns cleaned css string

  @param css, the original css string to be stipped out of comments

  @return cleanedCSS contains no css comments
*/
fi.prototype.stripComments = function (cssString) {
  var regex = new RegExp(this.cssCommentsRegex, 'gi');

  return cssString.replace(regex, '');
};

/*
  Parses given css string, and returns css object
  keys as selectors and values are css rules
  eliminates all css comments before parsing

  @param source css string to be parsed

  @return object css
*/
fi.prototype.parse = function (source) {

  if (source === undefined) {
    return [];
  }

  var css = [];
  //strip out comments
  //source = this.stripComments(source);

  //get import statements

  while (true) {
    var imports = this.cssImportStatementRegex.exec(source);
    if (imports !== null) {
      this.cssImportStatements.push(imports[0]);
      css.push({
        selector: '@imports',
        type: 'imports',
        styles: imports[0]
      });
    } else {
      break;
    }
  }
  source = source.replace(this.cssImportStatementRegex, '');
  //get keyframe statements
  var keyframesRegex = new RegExp(this.cssKeyframeRegex, 'gi');
  var arr;
  while (true) {
    arr = keyframesRegex.exec(source);
    if (arr === null) {
      break;
    }
    css.push({
      selector: '@keyframes',
      type: 'keyframes',
      styles: arr[0]
    });
  }
  source = source.replace(keyframesRegex, '');

  //unified regex
  var unified = new RegExp(this.combinedCSSRegex, 'gi');

  while (true) {
    arr = unified.exec(source);
    if (arr === null) {
      break;
    }
    var selector = '';
    if (arr[2] === undefined) {
      selector = arr[5].split('\r\n').join('\n').trim();
    } else {
      selector = arr[2].split('\r\n').join('\n').trim();
    }

    /*
      fetch comments and associate it with current selector
    */
    var commentsRegex = new RegExp(this.cssCommentsRegex, 'gi');
    var comments = commentsRegex.exec(selector);
    if (comments !== null) {
      selector = selector.replace(commentsRegex, '').trim();
    }

    // Never have more than a single line break in a row
    selector = selector.replace(/\n+/, "\n");

    //determine the type
    if (selector.indexOf('@media') !== -1) {
      //we have a media query
      var cssObject = {
        selector: selector,
        type: 'media',
        subStyles: this.parse(arr[3] + '\n}') //recursively parse media query inner css
      };
      if (comments !== null) {
        cssObject.comments = comments[0];
      }
      css.push(cssObject);
    } else {
      //we have standard css
      var rules = this.parseRules(arr[6]);
      var style = {
        selector: selector,
        rules: rules
      };
      if (selector === '@font-face') {
        style.type = 'font-face';
      }
      if (comments !== null) {
        style.comments = comments[0];
      }
      css.push(style);
    }
  }

  return css;
};

/*
  parses given string containing css directives
  and returns an array of objects containing ruleName:ruleValue pairs

  @param rules, css directive string example
      \n\ncolor:white;\n    font-size:18px;\n
*/
fi.prototype.parseRules = function (rules) {
  //convert all windows style line endings to unix style line endings
  rules = rules.split('\r\n').join('\n');
  var ret = [];

  rules = rules.split(';');

  //proccess rules line by line
  for (var i = 0; i < rules.length; i++) {
    var line = rules[i];

    //determine if line is a valid css directive, ie color:white;
    line = line.trim();
    if (line.indexOf(':') !== -1) {
      //line contains :
      line = line.split(':');
      var cssDirective = line[0].trim();
      var cssValue = line.slice(1).join(':').trim();

      //more checks
      if (cssDirective.length < 1 || cssValue.length < 1) {
        continue; //there is no css directive or value that is of length 1 or 0
        // PLAIN WRONG WHAT ABOUT margin:0; ?
      }

      //push rule
      ret.push({
        directive: cssDirective,
        value: cssValue
      });
    } else {
      //if there is no ':', but what if it was mis splitted value which starts with base64
      if (line.trim().substr(0, 7) === 'base64,') {
        //hack :)
        ret[ret.length - 1].value += line.trim();
      } else {
        //add rule, even if it is defective
        if (line.length > 0) {
          ret.push({
            directive: '',
            value: line,
            defective: true
          });
        }
      }
    }
  }

  return ret; //we are done!
};

/*
  computes string for ace editor using this.css or given cssBase optional parameter

  @param [optional] cssBase, if given computes cssString from cssObject array
*/
fi.prototype.serialize = function (cssBase) {
  var depth = 0;
  var ret = '';
  if (cssBase === undefined) {
    cssBase = this.css;
  }
  //append imports
  for (var i = 0; i < cssBase.length; i++) {
    if (cssBase[i].type === 'imports') {
      ret += cssBase[i].styles + '\n\n';
    }
  }
  for (i = 0; i < cssBase.length; i++) {
    var tmp = cssBase[i];
    if (tmp.selector === undefined) {
      //temporarily omit media queries
      continue;
    }
    var comments = "";
    if (tmp.comments !== undefined) {
      comments = tmp.comments + '\n';
    }

    if (tmp.type === 'media') {
      //also put media queries to output
      ret += comments + tmp.selector + '{\n';
      ret += this.getCSSForEditor(tmp.subStyles, depth + 1);
      ret += '}\n\n';
    } else if (tmp.type !== 'keyframes' && tmp.type !== 'imports') {
      ret += this.getSpaces(depth) + comments + tmp.selector + ' {\n';
      ret += this.getCSSOfRules(tmp.rules, depth + 1);
      ret += this.getSpaces(depth) + '}\n\n';
    }
  }

  //append keyFrames
  for (i = 0; i < cssBase.length; i++) {
    if (cssBase[i].type === 'keyframes') {
      ret += cssBase[i].styles + '\n\n';
    }
  }

  return ret;
};

/*
  given rules array, returns visually formatted css string
  to be used inside editor
*/
fi.prototype.getCSSOfRules = function (rules, depth) {
  var ret = '';
  for (var i = 0; i < rules.length; i++) {
    if (rules[i] === undefined) {
      continue;
    }
    if (rules[i].defective === undefined) {
      ret += this.getSpaces(depth) + rules[i].directive + ': ' + rules[i].value + ';\n';
    } else {
      ret += this.getSpaces(depth) + rules[i].value + ';\n';
    }
  }
  return ret || '\n';
};

/*
    A very simple helper function returns number of spaces appended in a single string,
    the number depends input parameter, namely input*2
*/
fi.prototype.getSpaces = function (num) {
  var ret = '';
  for (var i = 0; i < num * 4; i++) {
    ret += ' ';
  }
  return ret;
};

/*
  Given css string or objectArray, parses it and then for every selector,
  prepends this.cssPreviewNamespace to prevent css collision issues

  @returns css string in which this.cssPreviewNamespace prepended
*/
fi.prototype.namespace = function (css, forcedNamespace) {
  var cssObjectArray = css;
  var namespaceClass = forcedNamespace;

  if (typeof css === 'string') {
    cssObjectArray = this.parse(css);
  }

  for (var i = 0; i < cssObjectArray.length; i++) {
    var obj = cssObjectArray[i];

    //bypass namespacing for @font-face @keyframes @import
    if (obj.selector.indexOf('@font-face') > -1 || obj.selector.indexOf('keyframes') > -1 || obj.selector.indexOf('@import') > -1 || obj.selector.indexOf('.form-all') > -1 || obj.selector.indexOf('#stage') > -1) {
      continue;
    }

    if (obj.type !== 'media') {
      var selector = obj.selector.split(',');
      var newSelector = [];
      for (var j = 0; j < selector.length; j++) {
        var descendantSelector = namespaceClass + ' ' + selector[j];
        var rootSelector = selector[j].trim().replace(/\s|$/, namespaceClass + " ");

        newSelector.push(descendantSelector + ',' + rootSelector);
      }
      obj.selector = newSelector.join(',');
    } else {
      obj.subStyles = this.namespace(obj.subStyles, forcedNamespace); //handle media queries as well
    }
  }

  return cssObjectArray;
};

module.exports = new fi();

/***/ })
/******/ ]);