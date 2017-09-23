const store = {

  items: [
    { id: 1, title: 'buy milk' },
    { id: 2, title: 'go to the doctor' },
    { id: 3, title: 'cash the checks' }
  ],

  toggleItemCompleted: (id) => {
    const item = store.items.find(item => item.id == id);
    item.completed = !item.completed;
  },

  removeItem: (id) => {
    const index = store.items.findIndex(item => item.id == id);
    if (index >= 0) {
      store.items.splice(index, 1);
    }
  }

};

export default store;
