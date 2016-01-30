import { createAction, handleActions } from 'redux-actions'
import _ from 'lodash'

import MediaApi from '../../../api/mediaApi'

/*
 * Constants
 * */
export const GET_DATA_FOR_MEDIA = 'GET_DATA_FOR_MEDIA';
export const SET_ACTIVE_TOPIC = 'SET_ACTIVE_TOPIC';

/*
 * Actions
 * */
export const getDataForMedia = createAction(GET_DATA_FOR_MEDIA, (token, mediaId) => {
  return {
    data: {
      token,
      mediaId
    },
    promise: MediaApi.getDataForMedia(token, mediaId)
  }
});
export const setActiveTopic = createAction(SET_ACTIVE_TOPIC, (mediaId, topicId) => {
  return {mediaId, topicId};
});

export const actions = {
  getDataForMedia,
  setActiveTopic
};

/*
 * State
 * */
export const initialState = {
  data: {}
};

/*
 * Reducers
 * */
export default handleActions({
  [GET_DATA_FOR_MEDIA + '_PENDING']: (state, { payload }) => {
    return {
      ...state,
      data: {
        ...state.data,
        [payload.mediaId]: {
          ...state.data[payload.mediaId],
          getPending: true
        }
      }
    };
  },

  [GET_DATA_FOR_MEDIA + '_REJECTED']: (state, { payload }) => {
    return {
      ...state,
      data: {
        ...state.data,
        [payload.mediaId]: {
          ...state.data[payload.mediaId],
          getPending: false,
          getError: payload.error
        }
      }
    };
  },

  [GET_DATA_FOR_MEDIA + '_FULFILLED']: (state, { payload: response }) => {
    let parsedResult = parseMediaData(response);
    return {
      ...state,
      data: {
        ...state.data,
        [response.mediaId]: {
          data: response,
          topicsIds: parsedResult.topicsIds,
          topics: parsedResult.topics,
          speakers: parsedResult.speakers,
          activeTopic: parsedResult.activeTopic,
          activeSpeaker: parsedResult.activeSpeaker,
          transcript: parsedResult.transcript,
          predictions: parsedResult.predictions,
          getPending: false,
          getError: ''
        }
      }
    };
  },

  [SET_ACTIVE_TOPIC]: (state, { payload }) => {
    return {
      ...state,
      data: {
        ...state.data,
        [payload.mediaId]: {
          ...state.data[payload.mediaId],
          activeTopic: payload.topicId
        }
      }
    }
  }

}, initialState);

const parseMediaData = function (data) {
  let topicsIds = [];
  let topics = {};
  let speakers = [];
  if (data.keywords && data.keywords.latest && data.keywords.latest.words) {
    let allKeywords = data.keywords.latest.words;
    topicsIds.push(0);
    let parseKeywordsResult = parseKeywords(allKeywords);
    speakers = _.concat(speakers, parseKeywordsResult.speakers);
    topics[0] = {
      name: 'ALL TOPICS',
      type: 'category',
      ...parseKeywordsResult
    }
  }

  if (data.topics && data.topics.latest && data.topics.latest.topics) {
    data.topics.latest.topics.forEach((topic, i) => {
      topicsIds.push(i + 1);
      let parseKeywordsResult = parseKeywords(topic.keywords);
      speakers = _.uniq(_.concat(speakers, parseKeywordsResult.speakers));
      topics[i + 1] = {
        ...topic,
        keywordsIds: parseKeywordsResult.keywordsIds,
        keywords: parseKeywordsResult.keywords
      }
    });
  }

  let transcript = {
    wordIds: [],
    words: {}
  };
  if (data.transcripts && data.transcripts.latest && data.transcripts.latest.words) {
    data.transcripts.latest.words.forEach((word, i) => {
      transcript.wordIds.push(i);
      transcript.words[i] = {
        ...word
      };
    });
  }

  let predictions = {};
  if (data.predictions && data.predictions.latest) {
    predictions = {
      ...data.predictions.latest
    }
  }

  return {
    activeTopic: (topics[0]) ? 0 : null,
    activeSpeaker: speakers[0],
    speakers,
    topicsIds,
    topics,
    transcript,
    predictions
  }
};

const parseKeywords = function (keywordsArr) {
  let keywordsIds = [];
  let keywords = {};
  let speakers = [];
  keywordsArr.forEach((keyword, i) => {
    keywordsIds.push(i);
    keywords[i] = keyword;
    speakers = _.uniq(_.concat(speakers, Object.keys(keyword.t)));
  });
  return {keywordsIds, keywords, speakers}
};
