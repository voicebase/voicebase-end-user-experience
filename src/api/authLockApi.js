export default {
  showLock: function (Auth0Lock, api, domain) {
    return new Promise(function(resolve, reject) {
      const lock = new Auth0Lock(api, domain);
      lock.show(function (err, profile, token) {
        if (err) {
          reject(err);
        } else {
          const loggedInUser = { profile, token, lock };
          resolve(loggedInUser);
        }
      })
    })
  }
}
