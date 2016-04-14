import axios from 'axios'
import { baseUrl } from './baseUrl'

const DOMAIN = 'voicebase.auth0.com';
const API = '1eQFoL41viLp5qK90AMme5tc5TjEpUeE';
const AUTH0_OPTIONS = {
  icon: 'https://s3.amazonaws.com/www-tropo-com/wp-content/uploads/2015/06/voicebase-logo.png',
  focusInput: false,
  popup: true
};

export default {
  signIn: function () {
    return new Promise(function(resolve, reject) {
      const lock = new window.Auth0Lock(API, DOMAIN);
      lock.show(AUTH0_OPTIONS, function (err, profile, token) {
        if (err) {
          reject(err);
        }
        else {
          resolve({ profile, token });
        }
      })
    })
  },

  createToken(auth0Token) {
    let url = `${baseUrl}/profile/keys`;
    return axios.post(url, null, {
      headers: {
        Authorization: `Bearer ${auth0Token}`
      }
    })
    .then(response => {
      const token = response.data.key.bearerToken;
      return { token };
    })
    .catch(error => {
      if (error.data && error.data.errors) {
        error = error.data.error;
      }
      return Promise.reject(error);
    });
  }
}
