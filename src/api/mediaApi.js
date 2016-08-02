import axios from 'axios'
import $ from 'jquery'
import { dateToIso } from '../common/Common'
import { baseUrl } from './baseUrl'
import fakeJson from './../fakeData/fakeData'
import fakeDataVideoJson from './../fakeData/fakeDataVideo'
import cablehotleadJson from './../fakeData/cablehotlead'
import CallCenter1Json from './../fakeData/CallCenter1'

const fakeExamples = {
  'fake_cablehotlead': {
    mediaId: 'fake_cablehotlead',
    metadata: cablehotleadJson.media.metadata,
    data: cablehotleadJson.media,
    url: 'http://demo.voicebase.dev5.sibers.com/bryonJPTest1.mp3'
  },
  'fake_callCenter1': {
    mediaId: 'fake_callCenter1',
    metadata: CallCenter1Json.media.metadata,
    data: CallCenter1Json.media,
    url: 'http://demo.voicebase.dev5.sibers.com/CallCenter1.mp4'
  },
  'fake_mediaId': {
    mediaId: 'fake_mediaId',
    metadata: fakeJson.media.metadata,
    data: fakeJson.media,
    url: 'http://demo.voicebase.dev5.sibers.com/washington.mp3'
  },
  'fake_video_media': {
    mediaId: 'fake_video_media',
    metadata: fakeDataVideoJson.media.metadata,
    data: fakeDataVideoJson.media,
    url: 'http://demo.voicebase.dev5.sibers.com/dual.mp4'
  }
};

export default {
  getMedia(token, searchOptions = {}) {
    let filterDateFrom = '';
    let filterDateTo = '';
    let filterQuery = '';
    if (searchOptions.dateFrom) {
      let isoDate = dateToIso(searchOptions.dateFrom);
      filterDateFrom = '&filter.created.gte=' + isoDate;
    }
    if (searchOptions.dateTo) {
      let isoDate = dateToIso(searchOptions.dateTo);
      filterDateTo = '&filter.created.lte=' + isoDate;
    }
    if (searchOptions.searchString) {
      filterQuery = '&query=' + searchOptions.searchString;
    }

    let url = `${baseUrl}/media?include=metadata${filterDateFrom}${filterDateTo}${filterQuery}`;
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
        if (__DEBUG__) {
          mediaIds = [].concat(Object.keys(fakeExamples));
          Object.keys(fakeExamples).forEach(id => {
            let fakeExample = fakeExamples[id];
            media[id] = {
              mediaId: id,
              status: 'finished',
              metadata: fakeExample.metadata
            }
          });
        }
        if (response.data.media) {
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
    if (mediaId.indexOf('fake') > -1 && fakeExamples[mediaId]) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(fakeExamples[mediaId].data);
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

  getMediaUrl(token, mediaId) {
    if (mediaId.indexOf('fake') > -1 && fakeExamples[mediaId]) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            url: fakeExamples[mediaId].url,
            mediaId
          });
        }, 500)
      });
    }
    else {
      let url = `${baseUrl}/media/${mediaId}/streams?access_token=${token}`;
      return axios.get(url)
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
    }
  },

  postMedia(token, fileId, file, options) {
    return new Promise((resolve, reject) => {
      let data = new FormData();
      data.append('media', file);

      let jobConf = {executor: 'v2'};

      let groupsConf = {};
      if (options.groups && options.groups.length > 0) {
        groupsConf = {
          keywords: {
            groups: options.groups
          }
        };
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

      let sumConf = Object.assign({}, jobConf, groupsConf, predictionsConf, speakersConf, transcriptConf);

      let conf = {
        configuration: sumConf
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
