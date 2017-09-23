import { rio } from '..';

import ListView from './list.js';
import store from './store.js';


const app = new ListView(store.items);
app.mount(document.getElementById("main"));

