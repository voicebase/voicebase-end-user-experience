import axios from 'axios'
import $ from 'jquery'
import fakeJson from './fakeData'

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
        let processingIds = [];
        let processingMedia = {};
        let mediaIds = ['fake_mediaId'];
        let media = {
          'fake_mediaId': {
            mediaId: 'fake_mediaId',
            status: 'finished',
            metadata: {
              title: 'Fake Media For Testing',
              duration: 360
            }
          }
        };
        response.data.media.forEach(mediaItem => {
          if (mediaItem.status === 'failed' || mediaItem.status === 'finished') {
            mediaIds.push(mediaItem.mediaId);
            media[mediaItem.mediaId] = mediaItem;
          }
          else if (mediaItem.status === 'accepted' || mediaItem.status === 'running') {
            processingIds.push(mediaItem.mediaId);
            processingMedia[mediaItem.mediaId] = mediaItem;
          }
        });
        return {
          mediaIds,
          media,
          processingIds,
          processingMedia
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
    if (mediaId === 'fake_mediaId') {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(fakeJson.media);
        }, 500)
      })
    }
    else {
      let url = `${baseUrl}/media/${mediaId}`;
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
  },

  postMedia(token, fileId, file, options) {
    return new Promise((resolve, reject) => {
      let data = new FormData();
      data.append('media', file);

      let jobConf = {executor: 'v2'};
      let conf = {
        configuration: jobConf
      };
      data.append('configuration', JSON.stringify(conf));

      let metadata = {
        metadata: {
          external: {
            title: file.name
          }
        }
      };
      data.append('metadata', JSON.stringify(metadata));

      $.ajax({
        url: baseUrl + '/media',
        type: 'POST',
        contentType: false,
        processData: false,
        data: data,
        headers: {
          'Authorization': 'Bearer ' + token
        },
        success: function (data) {
          resolve({fileId, data});
        },
        error: function (jqXHR, textStatus, errorThrown) {
          console.log(errorThrown + ': Error ' + jqXHR.status);
          reject({fileId, error: 'Upload is failed'})
        }
      });
    })
  }
}
