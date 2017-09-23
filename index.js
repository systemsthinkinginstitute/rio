import morphdom from 'morphdom';
import css from './lib/css';


const registry = {
  idInstances: {},
  fns: {},
  fids: new WeakMap(),
  styles: [],
}

const id = () => {
  return String(Math.random());
}

class View {

  constructor() {
    const key = this.key(...arguments);
    if (registry.idInstances[key]) {
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
    registry.fids.set(this, new WeakMap());
  }

  _register() {
    registry.idInstances[this._id] = this;
  }

  _injectStyle() {
    // construct compiled stylesheet and inject
    let css = '';
    for (let [name, content] of registry.styles) {
      css += content;
    }
    const styleEl = document.createElement('style');
    styleEl.innerHTML = css;
    this.el.parentNode.insertBefore(styleEl, this.el);
  }

  _harvestViews() {
    // deal with views and elements we've just mounted
    const els = Array.from(this.el.querySelectorAll('[data-rio-id]'));
    const descendants = [];
    for (const el of els) {
      const instance = registry.idInstances[el.getAttribute('data-rio-id')];
      instance.el = el;
      descendants.push(instance);
    }

    for (const instance of descendants) {
      instance._mounted = true;
      instance.dispatch('mount');
    }
  }

  _parent(p) {
    // allow tmpl to set the parent
    this.parent = p;
  }

  namespace() {
    // used for scoping css
    return this.constructor.name;
  }

  initialize() {
    // implement in subclass
  }

  finalize() {
    // implement in subclass
  }

  render() {
    // implement in subclass
  }

  _renderView(view) {
    view._parent(this);
    if (view._mounted)
      view.dispatch('update');
    const output = view.render();
    if (view._mounted)
      this._updatedQueue.push(view);
    return output;
  }

  tmpl(strings, ...expressions) {

    if (!registry.styles.find(s => s[0] == this.namespace())) {
      registry.styles.push([this.namespace(), this.style()]);
    }

    const registerFn = (fn) => {

      let fid;
      if (registry.fids.get(this).has(fn)) {
        fid = registry.fids.get(this).get(fn);
      } else {
        fid = 'ev' + String(parseInt(Math.random() * Number.MAX_SAFE_INTEGER - 1));
        const boundFn = () => {
          fn.bind(this)(window.event);
          return window.event.defaultPrevented;
        }
        registry.fids.get(this).set(fn, fid);
        registry.fns[fid] = boundFn;
        this._fids.push(fid);
      }
      return fid;
    }

    let output = '';
    this._updatedQueue.length = 0;

    for (let i = 0; i < strings.length; i++) {

      output += strings[i];
      if (i < expressions.length) {
        const val = expressions[i];
        if (val instanceof View) {
          // assume we want to render if it is a view instance
          output += this._renderView(val);
        } else if (typeof val == 'function') {
          // assume a function is an event handler and stash a reference
          const fid = registerFn(val);
          output += `"rio.fns.${fid}()"`;
        } else if (Array.isArray(val)) {
          // we need to flatten the array to a string
          for (let i = 0; i < val.length; i++) {
            if (val[i] instanceof View) {
              val[i] = this._renderView(val[i]);
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

    // what could go wrong here?
    output = output.replace(/(<\w+)/, '$1 data-rio-id="' + this._id + '" data-rio-view="' + this.namespace() + '"');

    return output;
  }

  css(strings, ...expressions) {
    let output = '';
    for (let i = 0; i < strings.length; i++) {
      output += strings[i];
      if (i < expressions.length) {
        output += expressions[i];
      }
    }
    const namespace = `[data-rio-view=${this.namespace()}]`;
    output = css.serialize(css.namespace(output, namespace));
    return output;
  }

  style() {
    // implement in subclass
  }

  key() {
    throw new Error("Please define a key method that returns a deterministic key for a given instance.");
  }

  mount(el) {
    try {
      window.rio = rio;
    } catch(e) {}
    this.el = el;
    this.html = this.render();
    this._injectStyle();
    this.el.innerHTML = this.html;
    this._harvestViews();
    this._mounted = true;
    this.dispatch('mount');
  }

  unmount() {
    // deregister our  event listeners
    for (let fid of this._fids) {
      delete registry.fns[fid];
    }
    if (this.el && this.el.parentNode) {
      this.el.parentNode.removeChild(this.el);
    }
  }

  update() {

    if (!this.el) return;

    this.dispatch('update');
    const newHTML = this.render().trim();

    function isElement(node) {
      return node.nodeType == Node.ELEMENT_NODE;
    }

    morphdom(this.el, newHTML, {
      getNodeKey: node => {
        return isElement(node) ? node.getAttribute('data-rio-id') || node.id : node.id;
      },
      onNodeDiscarded: node => {
        if (isElement(node) && node.hasAttribute('data-rio-id')) {
          const rioId = node.getAttribute('data-rio-id');
          const instance = registry.idInstances[rioId];
          instance.dispatch('unmount');
          instance.unmount();
        }
      },
      onBeforeNodeDiscarded: node => {
        // don't remove elements with rio-sacrosanct attribute
        return isElement(node) && !node.hasAttribute('rio-sacrosanct')
      },
      onNodeAdded: node => {
        if (isElement(node) && node.hasAttribute('data-rio-view') && node.hasAttribute('data-rio-id')) {
          const rioId = node.getAttribute('data-rio-id');
          const instance = registry.idInstances[rioId];
          instance.el = node;
          instance.dispatch('mount');
        }
      }
    });

    while (this._updatedQueue.length) {
      const view = this._updatedQueue.shift();
      view.dispatch('updated');
    }

    this.dispatch('updated');
  }

  on(eventName, callback) {
    if (!this.handlers[eventName]) {
      throw new Error("no event " + eventName);
    }
    this.handlers[eventName].push(callback);
  }

  dispatch(eventName) {
    for (const handler of this.handlers[eventName]) {
      handler.call(this);
    }
  }

  get root() {
    return this.el;
  }

}

function Refs(view) {

  const handler = {
    get: function(target, name) {
      if (target[name]) {
        return target[name];
      }
      if (view.el) {
        const el = view.el.querySelector(`[ref=${name}]`);
        target[name] = el;
        return el;
      } else {
        return null;
      }
    }
  }

  return new Proxy({}, handler);
}


const rio = { fns: registry.fns, View };

export { rio, View }

