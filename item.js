import View from './base';


class ItemView extends View {

  initialize(title) {
    this.title = title;
    this.summary = title;
    this.handleClick = this.handleClick.bind(this);
  }

  render() {
    this.el = this.tmpl`
      <section class="item" onclick=${this.handleClick}>
        <div ref="title" class="title">${this.title}</div>
        <div ref="summary" class="summary">${this.summary}</div>
      </section>
    `;
    return this.el;
  }

  handleClick() {
    console.log("REF", this.refs.title);
  }
}

export default ItemView;
