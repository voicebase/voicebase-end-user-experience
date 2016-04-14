import axios from 'axios'

//const baseUrl = 'https://voicebase.auth0.com/v2/logout?returnTo=http://localhost:5090/login'
const baseUrl = 'https://voicebase.auth0.com/v2/logout'

export default {
  signIn: function (Auth0Lock, domain, api) {
    return new Promise(function(resolve, reject) {
      const lock = new Auth0Lock(api, domain);
      lock.show({icon:'https://s3.amazonaws.com/www-tropo-com/wp-content/uploads/2015/06/voicebase-logo.png'}, function (err, profile, token) {
        if (err) {
          reject(err);
        } else {
          const loggedInUser = { profile, token, lock };
          resolve(loggedInUser);
        }
      })
    })
  },
  signOut: function (domain, returnTo) {
    let url = `${baseUrl}`;
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
