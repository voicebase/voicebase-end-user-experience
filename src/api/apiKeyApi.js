import axios from 'axios'

// const baseUrl = 'https://apis.voicebase.com/v2-beta';
const baseUrl = 'http://localhost:8080/auth0demo/api/token';

export default {
  createKey: function (token) {
    let url = `${baseUrl}`;
    return axios.get(url, {
      headers: {
        Authorization: 'Bearer ' + token
      }
    })
    .then(response => {
      const apiKey = response.data.apiToken;
      const returnedObject = { apiKey };
      return returnedObject;
    })
    .catch(error => {
      if (error.data && error.data.errors) {
        error = error.data.errors.error;
      }
      return Promise.reject(error);
    });
  }
}
