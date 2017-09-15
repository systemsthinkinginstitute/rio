import View from './base';
import ItemView from './item';


class ListView extends View {

  initialize(items) {
    this.items = items;
  }

  render() {
    this.el = super.render(`
      <div class="listing">
        LISTING:
      </div>
    `);

    for (const item of this.items) {
      this.el.appendChild(new ItemView(item).render());
    }
    return this.el;
  }

}

export default ListView;
