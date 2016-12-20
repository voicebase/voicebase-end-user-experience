import axios from 'axios'
import $ from 'jquery'
import { baseUrl } from './baseUrl'
import { sortByDate } from '../common/Common'

export default {
  getMedia(token, searchOptions = {}) {
    let filterQuery = '';
    if (searchOptions.searchString) {
      filterQuery = '&query=' + searchOptions.searchString;
    }

    let url = `${baseUrl}/media?sortOrder=asc&include=metadata${filterQuery}`;
    return axios.get(url, {
      headers: {
        Authorization: 'Bearer ' + token
      }
    })
      .then(response => {
        let processingIds = [];
        let processingMedia = {};
        let mediaIds = [];
        let media = {};
        if (response.data.media) {
          const sortedMedia = response.data.media.sort(sortByDate('dateCreated'));
          sortedMedia.forEach(mediaItem => {
            if (mediaItem.status === 'failed' || mediaItem.status === 'finished') {
              mediaIds.push(mediaItem.mediaId);
              media[mediaItem.mediaId] = mediaItem;
            }
            else if (mediaItem.status === 'accepted' || mediaItem.status === 'running') {
              processingIds.push(mediaItem.mediaId);
              processingMedia[mediaItem.mediaId] = mediaItem;
            }
          });
        }
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
        if (response.status === 204) {
          return { mediaId };
        }
        else throw (new Error('Can\'t remove media'));
      })
      .catch(error => {
        if (error.data && error.data.errors) {
          error = error.data.errors.error;
        }
        return Promise.reject({error, mediaId})
      });
  },

  getDataForMedia(token, mediaId) {
    let url = `${baseUrl}/media/${mediaId}`;
    return axios.get(url, {
      headers: {
        Authorization: 'Bearer ' + token
      }
    })
      .then(response => {
        return response.data.media;
      })
      .catch(error => {
        if (error.data && error.data.errors) {
          error = error.data.errors.error;
        }
        return Promise.reject({error})
      });
  },

  getMediaUrl(token, mediaId) {
    let url = `${baseUrl}/media/${mediaId}/streams`;
    return axios.get(url, {
      headers: {
        Authorization: 'Bearer ' + token
      }
    })
      .then(response => {
        let url = null;
        if (response.data && response.data.streams && response.data.streams.original) {
          url = response.data.streams.original;
        }
        return {
          url: url,
          mediaId
        };
      })
      .catch(error => {
        if (error.data && error.data.errors) {
          error = error.data.errors.error;
        }
        return Promise.reject(error)
      });
  },

  postMedia(token, fileId, file, options) {
    return new Promise((resolve, reject) => {
      let data = new FormData();
      data.append('media', file);

      let jobConf = {executor: 'v2'};
      if (options.language) {
        jobConf.language = options.language;
      }

      let keywordsConf = {};
      if (options.groups && options.groups.length > 0) {
        keywordsConf = {
          keywords: {
            groups: options.groups
          }
        };
      }

      let topicsConf = {};
      if (options.language === 'es-LA' || options.language === 'pt-BZ') {
        if (!keywordsConf.keywords) {
          keywordsConf.keywords = {};
        }
        keywordsConf.keywords = {
          ...keywordsConf.keywords,
          semantic: false
        };
        topicsConf = {
          topics: {
            semantic: false
          }
        }
      }

      let predictionsConf = {};
      if (options.predictions && options.predictions.length > 0) {
        predictionsConf = {
          predictions: options.predictions
        };
      }

      let speakersConf = {};
      if (options.speakers) {
        speakersConf = {
          ingest: {
            channels: {
              left: {
                speaker: options.speakers.left
              },
              right: {
                speaker: options.speakers.right
              }
            }
          }
        };
      }

      let transcriptConf = {
        transcripts: {
          formatNumbers: true
        }
      };
      if (options.vocabularies && options.vocabularies.length > 0) {
        transcriptConf.transcripts = {
          ...transcriptConf.transcripts,
          vocabularies: [{
            terms: options.vocabularies
          }]
        };
      }

      let sumConf = Object.assign({}, jobConf, keywordsConf, topicsConf, predictionsConf, speakersConf, transcriptConf);

      let conf = {
        configuration: sumConf
      };
      data.append('configuration', JSON.stringify(conf));

/*
      let metadata = {
        metadata: {
          external: {
            title: file.name
          }
        }
      };
      data.append('metadata', JSON.stringify(metadata));
*/

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
          resolve(data);
        },
        error: function (jqXHR, textStatus, errorThrown) {
          console.log(errorThrown + ': Error ' + jqXHR.status);
          reject('Upload is failed')
        }
      });
    })
  }
}
