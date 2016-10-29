import axios from 'axios'
import { baseUrl } from './baseUrl'

const DOMAIN = (window.voicebaseEnv && window.voicebaseEnv.auth0Domain) || 'voicebase-dev.auth0.com';
const CLIENT_ID = (window.voicebaseEnv && window.voicebaseEnv.auth0ClientId) || 'OCGWPv8TtRySqVezChYf6KJsof7ATG83';
const AUTH0_OPTIONS = {
  theme: {
    logo: 'https://s3.amazonaws.com/www-tropo-com/wp-content/uploads/2015/06/voicebase-logo.png'
  },
  auth: {
    redirect: false,
    sso: false,
    params: {
      scope: 'openid app_metadata'
    }
  },
  avatar: null,
  additionalSignUpFields: [{
    name: 'account',
    placeholder: 'your account name'
  }],
  languageDictionary: {
    title: 'DEVELOPER PORTAL',
    emailInputPlaceholder: 'someone@yourcompany.com',
    signUpTerms: 'I accept the <a href="https://www.voicebase.com/terms-of-use/" target="_new">Terms of Service</a>.'
  },
  mustAcceptTerms: true,
  closable: false
};

export default {
  signIn: function () {
    return new Promise(function(resolve, reject) {
      const lock = new window.Auth0Lock(CLIENT_ID, DOMAIN, AUTH0_OPTIONS);
      lock.on('authenticated', function(result) {
        var token = result.idToken;
        lock.getProfile(token, function (error, profile) {
          if (error) {
            reject(error);
          }
          lock.hide();
          resolve({ profile, token });
        });
      });
      lock.show();
    })
  },

  createToken(auth0Token, ephemeral) {
    let url = `${baseUrl}/profile/keys`;

    var data = {key: {}};
    if (ephemeral) {
      data = {
        key: {
          ttlMillis: 7200000,
          ephemeral: true
        }
      }
    }

    return axios.post(url, data, {
      headers: {
        Authorization: `Bearer ${auth0Token}`,
        'Content-Type': 'application/json'
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
  },

  getApiKeys(auth0Token) {
    let url = `${baseUrl}/profile/keys`;
    return axios.get(url, {
      headers: {
        Authorization: `Bearer ${auth0Token}`
      }
    })
      .then(response => {
        const keys = response.data.keys;
        return { keys };
      })
      .catch(error => {
        if (error.data && error.data.errors) {
          error = error.data.error;
        }
        return Promise.reject(error);
      });
  }
}
