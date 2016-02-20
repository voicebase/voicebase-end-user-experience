let TYPE = 'numbers';

export default {
  getItems(token) {
    let data = [{
      name: 'First number',
      description: 'test',
      isDefault: false
    }, {
      name: 'Phone',
      description: 'test',
      isDefault: false
    }, {
      name: 'test number',
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
