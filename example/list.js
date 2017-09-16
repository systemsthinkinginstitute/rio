import { View } from '..';
import ItemView from './item';


class ListView extends View {

  initialize(items) {
    this.items = items;
  }

  render() {
    return this.tmpl`
      <section class="listing">
        <h1>A beautiful listing...</h1>
        ${this.items.map(item => new ItemView(item))}
      </section>
    `;
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

}

export default ListView;
