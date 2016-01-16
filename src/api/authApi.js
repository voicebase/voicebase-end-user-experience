import fetch from 'isomorphic-fetch'

const baseUrl = 'https://apis.voicebase.com/v2-beta';

export default {
  signIn(credentials) {
    let url = `${baseUrl}?apikey=${credentials.username}&password=${credentials.password}`;
    return fetch(url, {mode: 'cors'})
      .then(response => response.json())
      .catch(error => {
        return error;
      });
  }
}
