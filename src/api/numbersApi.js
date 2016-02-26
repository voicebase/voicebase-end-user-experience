let TYPE = 'numbers';

export default {
  getItems(token) {
    let data = [{
      name: 'first',
      displayName: 'First number',
      description: 'test',
      isDefault: false
    }, {
      name: 'phone',
      displayName: 'Phone',
      description: 'test',
      isDefault: false
    }, {
      name: 'test',
      displayName: 'test number',
      description: 'test',
      isDefault: false
    }];

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve({
          type: TYPE,
          data
        });
      }, 0)
    })
  },

  deleteItem(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve({
          type: TYPE,
          id
        });
      }, 0)
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
      }, 0)
    })
  }
}
