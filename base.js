import bel from 'bel';
import morphdom from 'morphdom';


class View {

  constructor() {
    this.handlers = { mount: [], update: [], updated: [] };
    this.initialize.apply(this, arguments);
    this.tmpl = bel;
    this.finalize.apply(this);
    this.refs = Refs(this);
  }

  initialize() {
    // implement in subclass
  }

  finalize() {
    // implement in subclass
  }

  render() {
    // implement in subclass
    return bel`<div></div>`;
  }

  mount(el) {
    this.el = el;
    this.el.appendChild(this.render());
    this.handle('mount');
  }

  update() {
    this.handle('update');
    const newEl = this.render();
    morphdom(this.el, newEl);
    this.handle('updated');
  }

  on(eventName, callback) {
    if (!this.handlers[eventName]) {
      throw new Error("no event " + eventName);
    }
    this.handlers[eventName].push(callback);
  }

  handle(eventName) {
    for (const handler of this.handlers[eventName]) {
      handler.call(this);
    }
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



export default View;
