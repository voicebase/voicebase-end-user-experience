import axios from 'axios'

const baseUrl = 'https://apis.voicebase.com/v2-beta';
const TYPE = 'predictions';

export default {
  getItems(token) {
    let url = `${baseUrl}/definitions/predictions/models`;
    return axios.get(url, {
      headers: {
        Authorization: 'Bearer ' + token
      }
    })
    .then(response => {
      return {
        type: TYPE,
        data: response.data.models
      }
    })
    .catch(error => {
      if (error.data && error.data.errors) {
        error = error.data.errors.error;
      }
      return Promise.reject(error)
    });
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
