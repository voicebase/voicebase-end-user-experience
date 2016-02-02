import axios from 'axios'

const baseUrl = 'https://apis.voicebase.com/v2-beta';

export default {
  getGroups(token) {
    let url = `${baseUrl}/definitions/keywords/groups`;
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
  },

  deleteGroup(token, groupId, groupName) {
    let url = `${baseUrl}/definitions/keywords/groups/${groupName}`;
    return axios.delete(url, {
      headers: {
        Authorization: 'Bearer ' + token
      }
    })
    .then(response => {
      return {groupId};
    })
    .catch(error => {
      if (error.data && error.data.errors) {
        error = error.data.errors.error;
      }
      return Promise.reject({error})
    });
  },

  createGroup(token, groupId, newGroup) {
    let url = `${baseUrl}/definitions/keywords/groups/${newGroup.name}`;
    return axios.put(url, {
      name: newGroup.name,
      keywords: newGroup.keywords
    }, {
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      return response.data;
    })
    .catch(error => {
      if (error.data && error.data.errors) {
        error = error.data.errors.error;
      }
      return Promise.reject({error})
    });
  }

}
