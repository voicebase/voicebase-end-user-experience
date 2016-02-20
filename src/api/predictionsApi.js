let TYPE = 'predictions';

export default {
  getItems(token) {
    let data = [{
      name: 'First prediction model',
      description: 'test',
      isDefault: false
    }, {
      name: 'Second prediction model',
      description: 'test',
      isDefault: false
    }, {
      name: 'Third prediction model',
      description: 'test',
      isDefault: false
    }];

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve({
          type: TYPE,
          data
        });
      }, 500)
    })
  },

  deleteItem(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve({
          type: TYPE,
          id
        });
      }, 500)
    })
  },

  editItem(id, newItem) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve({
          type: TYPE,
          id,
          data: newItem
        });
      }, 500)
    })
  }
}
