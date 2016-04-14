import axios from 'axios'

// Auth0 prototype
// const baseUrl = 'https://apis.voicebase.com/v2-beta';
const baseUrl = 'https://apis.dev.voicebase.com/v2-beta/profile/keys';
// const baseUrl = 'http://localhost:10080/v2-beta/profile/keys';

export default {
  createKey(token) {
    let url = `${baseUrl}`;
    return axios.post(url, null, {
      headers: {
        Authorization: 'Bearer ' + token
      }
    })
    .then(response => {
      const apiKey = response.data.key.bearerToken;
      const returnedObject = { apiKey };
      return returnedObject;
    })
    .catch(error => {
      if (error.data && error.data.errors) {
        error = error.data.error;
      }
      return Promise.reject(error);
    });
  }
}
