import View from './base';
import ItemView from './item';


class ListView extends View {

  initialize(items) {
    this.items = items;
  }

  render() {
    this.el = this.tmpl`
      <div class="listing">
        LISTING:
        ${this.items.map(item => new ItemView(item).render())}
      </div>
    `;
    return this.el;
  }

}

export default ListView;
