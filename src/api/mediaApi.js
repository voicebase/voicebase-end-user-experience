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
        let mediaIds = ['fake_mediaId'];
        let media = {
          'fake_mediaId': {
            mediaId: 'fake_mediaId',
            status: 'finished',
            metadata: {title: 'Fake Media For Testing'}
          }
        };
        response.data.media.forEach(mediaItem => {
          mediaIds.push(mediaItem.mediaId);
          media[mediaItem.mediaId] = mediaItem;
        });
        return {
          mediaIds,
          media
        };
      })
      .catch(error => {
        if (error.data && error.data.errors) {
          error = error.data.errors.error;
        }
        return Promise.reject(error)
      });
  },

  deleteMedia(token, mediaId) {
    let url = `${baseUrl}/media/${mediaId}`;
    return axios.delete(url, {
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
        alert(error);
        return Promise.reject({error, mediaId})
      });
  },

  getDataForMedia(token, mediaId) {
    let _mediaId = (mediaId === 'fake_mediaId') ? '89af3eea-47b3-4520-a979-92bbbe2116ea' : mediaId;
    let url = `${baseUrl}/media/${_mediaId}`;
    return axios.get(url, {
      headers: {
        Authorization: 'Bearer ' + token
      }
    })
      .then(response => {
        if (mediaId === 'fake_mediaId') {
          response.data.media.mediaId = 'fake_mediaId';
        }
        return response.data.media;
      })
      .catch(error => {
        if (error.data && error.data.errors) {
          error = error.data.errors.error;
        }
        return Promise.reject({error})
      });
  }
}
