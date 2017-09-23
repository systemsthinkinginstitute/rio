import { View } from '..';
import store from './store';


class ItemView extends View {

  initialize(item) {
    this.item = item;
  }

  style() {
    return this.css`
      .item {
        border: 1px solid #ddd;
        margin: 5px;
        padding: 20px;
        border-radius: 2px;
        display: block;
      }
      .item.completed {
        background: #fafafa;
      }
      .item .completed {
        text-decoration: line-through;
        color: #aaa;
      }
      section:hover {
        background: #f6f6f6;
        cursor: pointer;
      }
      .summary {
        color: #aaa;
        font-size: 13px;
      }
    `;
  }

  handleChange(e) {
    store.toggleItemCompleted(this.item.id);
    this.update();
  }

  removeItem(e) {
    e.stopPropagation();
    store.removeItem(this.item.id);
    this.parent.update();
  }

  finalize() {
    this.on('mount', () => {
      console.log("MOUNTED", this.item.title);
    });
  }

  key() {
    const [item] = arguments;
    return item.id;
  }

  render() {
    return this.tmpl`
      <label class="item ${this.item.completed && 'completed'}">
        <input type="checkbox" ${this.item.completed && 'checked'} onchange=${this.handleChange}>
        <span ref="title" class="title ${this.item.completed && 'completed'}">
          ${this.item.title}
        </span>
        <button onclick=${this.removeItem}>&times;</button>
      </label>
    `;
  }
}

export default ItemView;
