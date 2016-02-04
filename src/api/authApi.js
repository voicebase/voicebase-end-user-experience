import axios from 'axios'

// const baseUrl = 'https://apis.voicebase.com/v2-beta';
const baseUrl = 'http://localhost:8080/auth0demo/api/auth';

export default {
  signIn(credentials) {
    let url = `${baseUrl}?apikey=${credentials.username}&password=${credentials.password}`;
    return axios.get(url)
      .then(response => {
        return response.data;
      })
      .catch(error => {
        if (error.data && error.data.errors) {
          error = error.data.errors.error;
        }
        return Promise.reject(error);
      });
  }
}
