import morphdom from 'morphdom';


const registry = {
  idInstances: {},
  fns: {},
  fids: new WeakMap(),
}

const id = () => {
  return String(Math.random());
}

class View {

  constructor() {
    this.handlers = { mount: [], update: [], updated: [] };
    this.initialize.apply(this, arguments);
    this.finalize.apply(this);
    this.refs = Refs(this);
    this.id = id();
  }

  _register() {
    registry.idInstances[this.id] = this;
  }

  _harvest() {
    // deal with views and elements we've just mounted
    const els = Array.from(this.el.querySelectorAll('[data-rio-id]'));
    const descendants = [];
    for (const el of els) {
      const instance = registry.idInstances[el.getAttribute('data-rio-id')];
      instance.el = el;
      descendants.push(instance);
    }

    for (const instance of descendants) {
      instance.dispatch('mount');
    }
  }

  initialize() {
    // implement in subclass
  }

  finalize() {
    // implement in subclass
  }

  render() {
    // implement in subclass
    return '<div></div>';
  }

  tmpl(strings, ...expressions) {

    const registerFn = (fn) => {
      let fid;
      if (registry.fids.has(fn)) {
        // if we've already this one just give it back
        fid = registry.fids.get(fn);
      } else {
        fid = 'ev' + String(parseInt(Math.random() * 1000000000));
        registry.fids.set(fn, fid);
        // proxy through with the event as an argument
        registry.fns[fid] = () => fn(window.event);
      }
      return fid;
    }

    let output = '';

    for (let i = 0; i < strings.length; i++) {

      output += strings[i];
      if (i < expressions.length) {
        const val = expressions[i];
        if (val instanceof View) {
          // assume we want to render if it is a view instance
          output += val.render();
        } else if (typeof val == 'function') {
          // assume a function is an event handler and stash a reference
          const fid = registerFn(val);
          output += `"rio.fns.${fid}()"`;
        } else if (Array.isArray(val)) {
          // we need to flatten the array to a string
          for (let i = 0; i < val.length; i++) {
            if (val[i] instanceof View) {
              // assume we want to render if it is a view instance
              val[i] = val[i].render()
            }
          }
          output += val.join('');
        } else {
          output += val;
        }
      }
    }

    this._register(this.id, this);

    // what could go wrong here?
    output = output.replace(/(<\w+)/, '$1 data-rio-id="' + this.id + '"');

    return output;
  }

  mount(el) {
    try {
      window.rio = rio;
    } catch(e) {}
    this.el = el;
    this.html = this.render();
    this.el.innerHTML = this.html;
    this._harvest();
    this.dispatch('mount');
  }

  update() {
    this.dispatch('update');
    const newHTML = this.render().trim();
    morphdom(this.el, newHTML);
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
      const el = view.el.querySelector(`[ref=${name}]`);
      target[name] = el;
      return el;
    }
  }

  return new Proxy({}, handler);
}


const rio = { fns: registry.fns };

export { View, rio };

