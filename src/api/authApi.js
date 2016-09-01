import axios from 'axios'
import { baseUrl } from './baseUrl'

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
