import ListView from './list.js';

const items = [];

for (let i = 0; i < 100; i++) {
  items.push(String(Math.random()));
}

const startTime = new Date().getTime();

const app = new ListView(items);
app.mount(document.getElementById("main"));

const elapsedTime = new Date().getTime() - startTime;

console.log("ELAPSED", elapsedTime);
