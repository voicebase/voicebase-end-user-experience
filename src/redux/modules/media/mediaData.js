import { createAction, handleActions } from 'redux-actions'
import { getClearWordFromTranscript, getRandomColor } from '../../../common/Common'
import { normalize } from '../../../common/Normalize'
import { fromJS } from 'immutable';

import MediaApi from '../../../api/mediaApi'

/*
 * Constants
 * */
export const GET_DATA_FOR_MEDIA = 'GET_DATA_FOR_MEDIA';
export const GET_MEDIA_URL = 'GET_MEDIA_URL';
export const SET_ACTIVE_TOPIC = 'SET_ACTIVE_TOPIC';
export const SET_ACTIVE_GROUP = 'SET_ACTIVE_GROUP';
export const CHOOSE_PLAYER_APP_TAB = 'CHOOSE_PLAYER_APP_TAB';

//view
export const KEYWORDS_TAB = 1;
export const DETECTION_TAB = 2;
export const PREDICTION_TAB = 3;
export const GROUPS_TAB = 4;

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
export const getMediaUrl = createAction(GET_MEDIA_URL, (token, mediaId) => {
  return {
    data: {
      mediaId
    },
    promise: MediaApi.getMediaUrl(token, mediaId)
  }
});
export const setActiveTopic = createAction(SET_ACTIVE_TOPIC, (mediaId, topicId) => {
  return {mediaId, topicId};
});
export const setActiveGroup = createAction(SET_ACTIVE_GROUP, (mediaId, topicId) => {
  return {mediaId, topicId};
});
export const choosePlayerAppTab = createAction(CHOOSE_PLAYER_APP_TAB, (mediaId, tabId) => {
  return {mediaId, tabId};
});

export const actions = {
  getDataForMedia,
  getMediaUrl,
  setActiveTopic,
  setActiveGroup,
  choosePlayerAppTab
};

/*
 * State
 * */
export const initialState = fromJS({});

export const initialViewState = {
  activeTab: KEYWORDS_TAB
};

/*
 * Reducers
 * */
export default handleActions({
  [GET_DATA_FOR_MEDIA + '_PENDING']: (state, { payload }) => {
    return state.mergeIn([payload.mediaId], {
      getPending: true,
      view: initialViewState
    });
  },

  [GET_DATA_FOR_MEDIA + '_REJECTED']: (state, { payload }) => {
    return state.mergeIn([payload.mediaId], {
      getPending: false,
      getError: payload.error
    });
  },

  [GET_DATA_FOR_MEDIA + '_FULFILLED']: (state, { payload: response }) => {
    let parsedResult = parseMediaData(response);
    return state.mergeIn([response.mediaId], {
      data: response,
      status: parsedResult.status,
      topicsIds: parsedResult.topicsIds,
      topics: parsedResult.topics,
      activeTopic: parsedResult.activeTopic,
      groupsIds: parsedResult.groupsIds,
      groups: parsedResult.groups,
      activeGroup: parsedResult.activeGroup,
      speakers: parsedResult.speakers,
      transcriptSpeakers: parsedResult.transcriptSpeakers,
      activeSpeaker: parsedResult.activeSpeaker,
      transcript: parsedResult.transcript,
      predictions: parsedResult.predictions,
      utterances: parsedResult.utterances,
      jobTasks: parsedResult.jobTasks,
      getPending: false,
      getError: '',
      view: initialViewState
    });
  },

  [GET_MEDIA_URL + '_PENDING']: (state, { payload }) => {
    return state.mergeIn([payload.mediaId], {
      getUrlPending: true
    });
  },

  [GET_MEDIA_URL + '_REJECTED']: (state, { payload }) => {
    return state.mergeIn([payload.mediaId], {
      getUrlPending: false,
      getUrlError: payload.error
    });
  },

  [GET_MEDIA_URL + '_FULFILLED']: (state, { payload }) => {
    return state.mergeIn([payload.mediaId], {
      mediaUrl: payload.url,
      getUrlPending: false,
      getUrlError: ''
    });
  },

  [SET_ACTIVE_TOPIC]: (state, { payload }) => {
    return state.setIn([payload.mediaId, 'activeTopic'], payload.topicId);
  },

  [SET_ACTIVE_GROUP]: (state, { payload }) => {
    return state.setIn([payload.mediaId, 'activeGroup'], payload.topicId);
  },

  [CHOOSE_PLAYER_APP_TAB]: (state, { payload: {tabId, mediaId} }) => {
    return state.setIn([mediaId, 'view', 'activeTab'], tabId);
  }

}, initialState);

export const parseMediaData = function (data) {
  let topicsIds = [];
  let topics = {};
  let activeTopic = null;
  let speakers = {};
  let groupsIds = [];
  let groups = {};
  let activeGroup = {};
  if (data.keywords && data.keywords.latest) {
    if (data.keywords.latest.words) {
      topicsIds.push('ALL_TOPICS');
      let parseKeywordsResult = parseKeywords(data.keywords.latest.words);
      speakers = Object.assign({}, speakers, parseKeywordsResult.speakers);
      let speakersNames = Object.keys(parseKeywordsResult.speakers);
      topics['ALL_TOPICS'] = {
        name: 'ALL TOPICS',
        type: 'category',
        keywordsIds: parseKeywordsResult.keywordsIds,
        keywords: parseKeywordsResult.keywords,
        speakers: speakersNames
      };
      activeTopic = 'ALL_TOPICS';
    }
    if (data.keywords.latest.groups && Array.isArray(data.keywords.latest.groups)) {
      let parseGroupsResult = parseTopics(data.keywords.latest.groups);
      groupsIds = parseGroupsResult.topicsIds;
      groups = parseGroupsResult.topics;
      activeGroup = parseGroupsResult.activeTopic;
      speakers = Object.assign({}, speakers, parseGroupsResult.speakers);
    }
  }

  if (data.topics && data.topics.latest && data.topics.latest.topics && Array.isArray(data.topics.latest.topics)) {
    let parseTopicsResult = parseTopics(data.topics.latest.topics);
    topicsIds = topicsIds.concat(parseTopicsResult.topicsIds);
    topics = Object.assign({}, topics, parseTopicsResult.topics);
    speakers = Object.assign({}, speakers, parseTopicsResult.speakers);
  }

  let transcript = {
    wordIds: [],
    words: {}
  };

  let transcriptSpeakers = [];
  if (data.transcripts && data.transcripts.latest && data.transcripts.latest.words) {
    let result = normalize(data.transcripts.latest.words, word => {
      if (word.m && word.m === 'turn') {
        let clearSpeakerName = getClearWordFromTranscript(word.w);
        speakers = addSpeaker(speakers, [clearSpeakerName]);
        transcriptSpeakers.push({start: word.s, name: clearSpeakerName});
      }
      return word;
    });
    transcript.wordIds = result.ids;
    transcript.words = result.entities;
  }

  let predictions = null;
  if (data.predictions && data.predictions.latest && data.predictions.latest.predictions) {
    predictions = parsePredictions(data.predictions.latest.predictions);
  }

  let utterances = null;
  if (data.utterances && data.utterances.latest && data.utterances.latest.utterances) {
    let result = normalize(data.utterances.latest.utterances, (utterance, i) => {
      return {
        ...utterance,
        id: i.toString(),
        color: getRandomColor()
      };
    });
    utterances = {
      itemIds: result.ids,
      items: result.entities
    };
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
    activeTopic,
    activeSpeaker: activeSpeakerId,
    speakers,
    transcriptSpeakers,
    groupsIds,
    groups,
    activeGroup,
    topicsIds,
    topics,
    transcript,
    predictions,
    utterances,
    jobTasks
  }
};

const parseKeywords = function (keywordsArr) {
  let speakers = {};
  let result = normalize(keywordsArr, keyword => {
    speakers = addSpeaker(speakers, Object.keys(keyword.t));
    return keyword;
  });
  let keywordsIds = result.ids;
  let keywords = result.entities;
  return {keywordsIds, keywords, speakers}
};

const parseTopics = function (topicsArr) {
  let activeTopic = null;
  let speakers = {};

  let result = normalize(topicsArr, (topic, i) => {
    if (i === 0) {
      activeTopic = i.toString();
    }
    let parseKeywordsResult = parseKeywords(topic.keywords);
    speakers = Object.assign({}, speakers, parseKeywordsResult.speakers);
    return {
      ...topic,
      key: i.toString(),
      keywordsIds: parseKeywordsResult.keywordsIds,
      keywords: parseKeywordsResult.keywords
    }
  });
  let topicsIds = result.ids;
  let topics = result.entities;

  return {topicsIds, topics, activeTopic, speakers}
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

const parsePredictions = function (predictions) {
  let res = {};
  predictions.forEach(prediction => {
    if (prediction.name === 'Hot Sales Lead') {
      res.sales_lead = {
        value: Math.round(prediction.score * 10),
        data: prediction
      }
    }
    else if (prediction.name === 'Request for Quote') {
      res.request_quote = {
        value: parseScore(prediction.score),
        data: prediction
      }
    }
    else if (prediction.name === 'Directions Requested') {
      res.directions = {
        value: parseScore(prediction.score),
        data: prediction
      }
    }
    else if (prediction.name === 'Asked About Employment') {
      res.employment = {
        value: parseScore(prediction.score),
        data: prediction
      }
    }
    else if (prediction.name === 'Churn Risk') {
      res.churn = {
        value: prediction.score,
        data: prediction
      }
    }
    else if (prediction.name === 'Appointment Request') {
      res.appointment = {
        value: prediction.score,
        data: prediction
      }
    }
  });
  return res;
};

let parseScore = function (score) {
  return parseFloat(score.toFixed(1));
};
