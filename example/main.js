import { rio } from '../rio';

import ListView from './list.js';
import store from './store.js';


const app = new ListView(store.items);
app.mount(document.getElementById("main"));

