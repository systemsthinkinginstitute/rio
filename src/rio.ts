import morphdom from 'morphdom';
import css from './css.js';

type Function = (...args: any[]) => any;


interface Registry {
  idInstances: { [key: string]: View };
  fns: { [key: string]: Function };
  fids: WeakMap<object, any>;
  styles: [string, string][];
  updateOpts: object;
}

interface ViewInterface {
  initialize: () => void;
  finalize: () => void;
  style: () => string;
  render: () => string;
  key: () => string;
}

const registry: Registry = {
  idInstances: {},
  fns: {},
  fids: new WeakMap(),
  styles: [],
  updateOpts: {},
};

const id = () => {
  return String(Math.random());
};

abstract class View implements ViewInterface {
  handlers: { mount: any[], update: any[], updated: any[], unmount: any[] };
  refs: object;
  _id: string;
  _fids: string[];
  parent?: View;
  _updatedQueue: View[];
  _mounted: boolean;
  _depth: number;
  views: { [key: string]: View[] };
  html: string;
  el: Element;

  constructor() {
    const key = this.key(...arguments);
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
    this._updatedQueue = [];
    this._mounted = false;
    this._depth = 0;
    this.views = {};
    registry.fids.set(this, new WeakMap());
  }

  /* methods to override */
  
  abstract initialize(): void;
  
  abstract finalize(): void;
  
  abstract style(): string;
  
  abstract render(): string;
  
  abstract key(): string;
  
  namespace() {
    // used for scoping css
    return this.constructor.name;
  }  

  /* helper methods */
  
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
    let descendants: View[] = [];
    for (const el of els) {
      const instance = registry.idInstances[el.getAttribute('data-rio-id')];
      instance.el = el;
      descendants.push(instance);
    }

    descendants = descendants
      .sort((a, b) => b._depth - a._depth);

    for (const instance of descendants) {
      instance.dispatch('mount');
      instance._mounted = true;
    }
  }

  _setEl(el: Element) {
    this.el = el;
    this.refs = Refs(this);
  }

  _parent(p: View) {
    // allow tmpl to set the parent
    this.parent = p;
  }

  _renderView(view: View) {
    if (view._mounted && view.shouldUpdate(registry.updateOpts) === false) {
      let html = view.el.outerHTML;
      html = html.replace(/(<[\w\-]+)/, '$1 data-rio-should-render-false');
      return html;
    }
    view._parent(this);
    const viewName = view.namespace();
    this.views[viewName] = this.views[viewName] || [] as View[];
    this.views[viewName].push(view);
    view._depth = this._depth + 1;
    if (view._mounted)
      view.dispatch('update');
    const output = view.render();
    if (view._mounted)
      this._updatedQueue.push(view);
    return output;
  }

  /* public interface */
  
  tmpl(strings: string[], ...expressions: (View | View[] | Function | string)[] ) {
    const self = this; 
    
    // tag function for interpolating templates

    if (!registry.styles.find(s => s[0] == this.namespace())) {
      registry.styles.push([this.namespace(), this.style()]);
    }

    const registerFn = (fn: Function) => {
      let fid;
      if (registry.fids.get(this).has(fn)) {
        fid = registry.fids.get(this).get(fn);
      } else {
        fid = 'ev' + String(Math.round(Math.random() * Number.MAX_SAFE_INTEGER - 1));
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
          output += val.reduce((rendered: string, view: any) => {
            if (view instanceof View) {
              return rendered + self._renderView(view);
            } else {
              return rendered;
            }
          }, '');
        } else if (val === null || val === undefined) {
          output += '';
        } else {
          output += val;
        }
      }
    }

    this._register();

    // tack our id and view name onto the root element of the view
    output = output.replace(/(<[\w\-]+)/, '$1 data-rio-id="' + this._id + '" data-rio-view="' + this.namespace() + '"');

    return output;
  }

  css(strings: string[], ...expressions: any[]) {
    // tag function for interpolating css
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

  mount(el: Element) {
    try {
      window.rio = rio;
    } catch(e) {}
    this.el = el;
    this.html = this.render();
    this._injectStyle();
    this.el.innerHTML = this.html;
    this._harvestViews();
  }

  unmount() {
    // deregister our  event listeners
    for (let fid of this._fids) {
      delete registry.fns[fid];
    }
    // remove any associated element from the dom
    if (this.el && this.el.parentNode) {
      this.el.parentNode.removeChild(this.el);
    }
    // remove ourself from our parent's views listing
    if (this.parent) {
      const viewName = this.namespace();
      const index = this.parent.views[viewName].findIndex(v => v == this);
      this.parent.views[viewName].splice(index, 1);
    }
  }

  shouldUpdate(opts: object) {
    return true;
  }

  update(opts: object) {
    // rerender the view and morph the dom to match
    if (this._mounted && this.shouldUpdate(opts) === false) {
      return;
    }

    if (!this.el) return;
    this.dispatch('update');
    const newHTML = this.render().trim();
    registry.updateOpts = opts;
    try {
      function isElement(node: Node) {
        return node.nodeType == Node.ELEMENT_NODE;
      }

      morphdom(this.el, newHTML, {
        getNodeKey: (node: Node) => {
          return isElement(node) ? node.getAttribute('data-rio-id') || node.id : node.id;
        },
        onNodeDiscarded: (node: Node) => {
          // unmount our associated instance
          if (isElement(node) && node.hasAttribute('data-rio-id')) {
            const rioId = node.getAttribute('data-rio-id');
            const instance = registry.idInstances[rioId];
            instance.dispatch('unmount');
            instance.unmount();
          }
        },
        onBeforeNodeDiscarded: (node: Node) => {
          // don't remove elements with rio-sacrosanct attribute
          return isElement(node) && !node.hasAttribute('rio-sacrosanct');
        },
        onBeforeElUpdated: ( fromNode, toNode ) => {
          if (toNode.hasAttribute('data-rio-should-render-false')) {
            return false;
          }
          if (isElement(fromNode) && document.activeElement == fromNode && fromNode.hasAttribute('rio-uninterruptable-input')) {
            // don't update the focused element if it is uninterruptable
            return false;
          }
        },
        onBeforeNodeAdded: (node: Node) => {
          // transplant existing view instance to its new element if need be
          if (isElement(node) && node.hasAttribute('data-rio-id')) {
            const rioId = node.getAttribute('data-rio-id');
            const instance = registry.idInstances[rioId];
            // if the old element is in the dom, remove it and throw it away
            if (instance && instance.el && instance.el.parentNode) {
              instance.el.parentNode.removeChild(instance.el);
            }
            instance._setEl(node as Element);
          }
        },
        onNodeAdded: node => {
          // mount our view instance if it is new
          if (isElement(node) && node.hasAttribute('data-rio-view') && node.hasAttribute('data-rio-id')) {
            const rioId = node.getAttribute('data-rio-id');
            const instance = registry.idInstances[rioId];
            instance.el = node;
            if (!instance._mounted) {
              instance.dispatch('mount');
              instance._mounted = true;
            }
          }
        }
      });

      while (this._updatedQueue.length) {
        const view = this._updatedQueue.shift();
        view.dispatch('updated');
      }

      this.dispatch('updated');
    } catch (e) {
      throw e;
    } finally {
      registry.updateOpts = {};
    }
  }


  on(eventName: string, callback: Function) {
    if (!this.handlers[eventName]) {
      throw new Error("no event " + eventName);
    } else {
      this.handlers[eventName].push(callback);
    }
  }

  dispatch(eventName: string) {
    for (const handler of this.handlers[eventName]) {
      handler.call(this);
    }
  }

  get root() {
    return this.el;
  }

}

function Refs(view: View): object {

  const traverse = function(el, name, descendant) {
    if (el.getAttribute('ref') == name) return el;
    for (const c of el.children) {
      // don't descend into other views' elements
      if (descendant && c.hasAttribute('data-rio-view')) continue;
      const match = traverse(c, name, true);
      if (match) return match;
    }
    return null;
  }

  const handler = {
    get: function(target, name) {
      if (target[name]) {
        return target[name];
      }
      if (view.el) {
        const el = traverse(view.el, name, false);
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
