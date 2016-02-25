let TYPE = 'detection';

export default {
  getItems(token) {
    let data = [{
      name: 'first',
      displayName: 'First detection model',
      description: 'test22',
      isDefault: false
    }, {
      name: 'second',
      displayName: 'Second detection model',
      description: 'test22',
      isDefault: false
    }, {
      name: 'third',
      displayName: 'Third detection model',
      description: 'test22',
      isDefault: false
    }];

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve({
          type: 'detection',
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
