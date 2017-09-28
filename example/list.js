import { View } from '../rio';
import store from './store';
import ItemView from './item';


class ListView extends View {

  initialize(items) {
    this.items = items;
  }

  style() {
    return this.css`
      h1 {
        padding: 0;
        margin: 0.2em 0 0.6em;;
      }
      section.listing {
        border-radius: 2px;
        color: #444;
        font-family: Arial, sans-serif;
        box-shadow: 0 0 10px rgba(0,0,0,0.4);
        max-width: 400px;
        margin: 20px;
        padding: 20px;
      }
    `;
  }

  addItem(e) {
    e.preventDefault();
    this.items.push({
      id: Math.random(),
      title: this.refs.input.value
    });
    this.update();
  }

  key() {
    return 'ListView';
  }

  render() {
    return this.tmpl`
      <section class="listing">
        <h1>Things to do...</h1>
        <form class="add-row" onsubmit=${this.addItem}>
          <input type="text" ref="input">
          <button onclick=${this.addItem}>add</button>
        </form>
        ${this.items.map(item => new ItemView(item))}
      </section>
    `;
  }

}

export default ListView;
