import axios from 'axios'

const baseUrl = 'https://apis.voicebase.com/v2-beta';

export default {
  getMedia(token) {
    let url = `${baseUrl}/media?include=metadata`;
    return axios.get(url, {
      headers: {
        Authorization: 'Bearer ' + token
      }
    })
      .then(response => {
        return response.data;
      })
      .catch(error => {
        if (error.data && error.data.errors) {
          error = error.data.errors.error;
        }
        return Promise.reject(error)
      });
  }
}
