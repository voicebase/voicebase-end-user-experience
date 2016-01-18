import fetch from 'isomorphic-fetch'

const baseUrl = 'https://apis.voicebase.com/v2-beta';

export default {
  signIn(credentials) {
    let url = `${baseUrl}?apikey=${credentials.username}&password=${credentials.password}`;
    return fetch(url, {mode: 'cors'})
      .then(response => {
        return response.json();
      })
      .then(json => {
        if (!json.errors) {
          return json;
        }
        else {
          throw json.errors.error;
        }
      })
      .catch(error => {
        return Promise.reject(error)
      });
  }
}
