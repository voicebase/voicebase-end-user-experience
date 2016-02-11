import { createAction, handleActions } from 'redux-actions'
import { getClearWordFromTranscript, getRandomColor } from '../../../common/Common'

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
          status: parsedResult.status,
          topicsIds: parsedResult.topicsIds,
          topics: parsedResult.topics,
          speakers: parsedResult.speakers,
          transcriptSpeakers: parsedResult.transcriptSpeakers,
          activeTopic: parsedResult.activeTopic,
          activeSpeaker: parsedResult.activeSpeaker,
          transcript: parsedResult.transcript,
          predictions: parsedResult.predictions,
          jobTasks: parsedResult.jobTasks,
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
  let speakers = {};
  if (data.keywords && data.keywords.latest && data.keywords.latest.words) {
    let allKeywords = data.keywords.latest.words;
    topicsIds.push(0);
    let parseKeywordsResult = parseKeywords(allKeywords);
    speakers = Object.assign({}, speakers, parseKeywordsResult.speakers);
    topics[0] = {
      name: 'ALL TOPICS',
      type: 'category',
      ...parseKeywordsResult
    }
  }

  if (data.topics && data.topics.latest && data.topics.latest.topics && Array.isArray(data.topics.latest.topics)) {
    data.topics.latest.topics.forEach((topic, i) => {
      topicsIds.push(i + 1);
      let parseKeywordsResult = parseKeywords(topic.keywords);
      speakers = Object.assign({}, speakers, parseKeywordsResult.speakers);
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

  let transcriptSpeakers = [];
  if (data.transcripts && data.transcripts.latest && data.transcripts.latest.words) {
    data.transcripts.latest.words.forEach((word, i) => {
      if (word.m && word.m === 'turn') {
        let clearSpeakerName = getClearWordFromTranscript(word.w);
        speakers = addSpeaker(speakers, [clearSpeakerName]);
        transcriptSpeakers.push({start: word.s, name: clearSpeakerName});
      }
      transcript.wordIds.push(i);
      transcript.words[i] = {
        ...word
      };
    });
  }

  let predictions = null;
  if (data.predictions && data.predictions.latest) {
    predictions = {
      ...data.predictions.latest
    }
  }

  let jobTasks = null;
  if (data.job && data.job.progress && data.job.progress.tasks) {
    jobTasks = {
      ...data.job.progress.tasks
    }
  }

  let activeSpeakerId = (transcriptSpeakers.length > 0) ? transcriptSpeakers[0].name : Object.keys(speakers)[0];

  return {
    status: data.status,
    activeTopic: (topics[0]) ? 0 : null,
    activeSpeaker: activeSpeakerId,
    speakers,
    transcriptSpeakers,
    topicsIds,
    topics,
    transcript,
    predictions,
    jobTasks
  }
};

const parseKeywords = function (keywordsArr) {
  let keywordsIds = [];
  let keywords = {};
  let speakers = {};
  keywordsArr.forEach((keyword, i) => {
    keywordsIds.push(i);
    keywords[i] = keyword;
    speakers = addSpeaker(speakers, Object.keys(keyword.t));
  });
  return {keywordsIds, keywords, speakers}
};

const addSpeaker = function (speakersObject, newSpeakersNames) {
  newSpeakersNames.forEach(speakerName => {
    if (!speakersObject[speakerName]) {
      speakersObject[speakerName] = {
        name: speakerName,
        color: getRandomColor()
      }
    }
  });
  return speakersObject;
};
