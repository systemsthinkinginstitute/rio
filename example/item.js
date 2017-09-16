import { View } from '..';


class ItemView extends View {

  initialize(title) {
    this.title = title;
    this.summary = String(title).substr(0, String(title).length / 2);
    this.handleClick = this.handleClick.bind(this);
  }

  render() {
    return this.tmpl`
      <section class="item" onclick=${this.handleClick}>
        <div ref="title" class="title">${this.title}</div>
        <div ref="summary" class="summary">${this.summary}</div>
      </section>
    `;
  }

  style() {
    return this.css`
      section {
        border: 1px solid #ddd;
        margin: 5px;
        padding: 20px;
        border-radius: 2px;
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

  handleClick(e) {
    this.title = "HELLO " + new Date();
    this.update();
  }

  finalize() {
    this.on('mount', () => {
      console.log("MOUNTED", this.title);
    });
  }

}

export default ItemView;
