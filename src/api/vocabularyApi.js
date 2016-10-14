import axios from 'axios'
import { baseUrl } from './baseUrl'

let TYPE = 'vocabularies';

export default {
  getItems(token) {
    let url = `${baseUrl}/definitions/transcripts/vocabularies`;
    return axios.get(url, {
      headers: {
        Authorization: 'Bearer ' + token
      }
    })
      .then(response => {
        return {type: 'vocabularies', data: response.data.vocabularies};
      })
      .catch(error => {
        if (error.data && error.data.errors) {
          error = error.data.errors.error;
        }
        return Promise.reject(error)
      });
  },

  deleteItem(token, id, name) {
    let url = `${baseUrl}/definitions/transcripts/vocabularies/${name}`;
    return axios.delete(url, {
      headers: {
        Authorization: 'Bearer ' + token
      }
    })
      .then(response => {
        return {
          type: TYPE,
          id
        };
      })
      .catch(error => {
        if (error.data && error.data.errors) {
          error = error.data.errors.error;
        }
        return Promise.reject({error})
      });
  },

  editItem(token, id, newItem) {
    let url = `${baseUrl}/definitions/transcripts/vocabularies/${newItem.name}`;
    const data = {
      vocabulary: newItem
    };

    return axios.put(url, data, {
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        return {
          type: TYPE,
          id,
          data: response.data
        }
      })
      .catch(error => {
        if (error.data && error.data.errors) {
          error = error.data.errors[0].error;
        }
        return Promise.reject({id, error})
      });
  }

}
