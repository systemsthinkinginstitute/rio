# rio-prototype

Rio is inspired by <a href="http://riotjs.com/">riot.js</a>.

```javascript

class GreeterView extends rio.View {

  initialize() {
    this.greetings = ['Hello', 'Salut'];
    this.index = 0;
  }

  render() {
    // event handlers will be interpolated and bound
    return this.tmpl`
      <h1 onclick=${this.cycleGreeting}>
        ${this.greeting}, World!
      </h1>
    `;
  }

  style() {
    // css will be scoped to this view only
    return  this.css`
      h1 {
        background: red;
        color: white;
      }
    `;
  }

  finalize() {
    this.on('mount', () => {
      console.log("We're live!");
    }
  }

  cycleGreeting(e) {
    this.greeting = this.greetings[++this.index % greetings.length];
  }

}

export default GreeterView;

```

## Methods to Define

Create views by extending the `View` base class and defining methods below.

#### initialize(_args_)

Run initialization code upon instantiation and receives args passed through to the constructor.

#### render()

Renders the view to a string suitable for inserting into the DOM via Element#innerHTML.  Use `this.tmpl` tag to support iteration and binding event handlers.

```javascript
render() {
  return this.tmpl`
    <h1 class="greeting">Hello, World!</h1>
  `;
}
```

#### style()

Optionally specify css styles to be injected.  Use `this.css` tag to support scoping css.

```javascript
style() {
  return this.css`
    h1 {
      font-size: 96px;
    }
  `;
}
```

#### finalize()

Run code just after instantiation, for example to attach lifecycle event handlers.

## Base Methods

#### update()

Re-renders the view and morph its real DOM tree to match.

#### mount(_element_)

Render the view and attach it to the given element in the DOM.

#### unmount()

Removes the view and its contents from the DOM.

#### on(_eventName_, _callback_)

Register an event handler for a lifecycle event.  Events are `mount`, `update`, and `updated`.

## Properties

#### refs

The `refs` property is an object containing references to DOM nodes with the matching `ref` attribute.

#### root

The `root` property is an element reference to the top-level DOM node within the view.

#### parent

Reference to the parent view instance (if any) that caused this view to come into being. 
