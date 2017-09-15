import View from './base';


class ItemView extends View {

  initialize(title) {
    this.title = title;
    this.summary = title;
    this.handleClick = this.handleClick.bind(this);
  }

  render() {
    this.el = super.render(`
      <section class="item">
        <div ref="title" class="title">${this.title}</div>
        <div ref="summary" class="summary">${this.summary}</div>
      </section>
    `);

    this.el.addEventListener('click', this.handleClick);

    return this.el;
  }

  handleClick() {
    console.log("REF", this.refs.title);
  }
}

export default ItemView;
