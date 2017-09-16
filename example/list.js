import { View } from '..';
import ItemView from './item';


class ListView extends View {

  initialize(items) {
    this.items = items;
  }

  render() {
    return this.tmpl`
      <div class="listing">
        LISTING:
        ${this.items.map(item => new ItemView(item))}
      </div>
    `;
  }

}

export default ListView;
