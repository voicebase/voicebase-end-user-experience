import { createAction, handleActions } from 'redux-actions'
import { getClearWordFromTranscript, getRandomColor } from '../../../common/Common'
import { normalize } from '../../../common/Normalize'
import { fromJS } from 'immutable';

import MediaApi from '../../../api/mediaApi'
import { setMarkers } from './markers'
import { localSearch, searchResultsToMarkers } from '../../../common/Search'

/*
 * Constants
 * */
export const GET_DATA_FOR_MEDIA = 'GET_DATA_FOR_MEDIA';
export const REMOVE_DATA_FOR_MEDIA = 'REMOVE_DATA_FOR_MEDIA';
export const GET_MEDIA_URL = 'GET_MEDIA_URL';
export const SET_ACTIVE_TOPIC = 'SET_ACTIVE_TOPIC';
export const CHOOSE_PLAYER_APP_TAB = 'CHOOSE_PLAYER_APP_TAB';

//view
export const KEYWORDS_TAB = 1;
export const DETECTION_TAB = 2;
export const PREDICTION_TAB = 3;
export const GROUPS_TAB = 4;

/*
 * Actions
 * */
export const getDataForMedia = (token, mediaId, searchString) => {
  return (dispatch) => dispatch({
    type: GET_DATA_FOR_MEDIA,
    payload: {
      data: {
        token,
        mediaId
      },
      promise: MediaApi.getDataForMedia(token, mediaId)
        .then(response => {
          if (searchString) {
            let searchResult = localSearch(response.transcripts.latest.words, searchString);
            let markers = searchResultsToMarkers(searchResult);
            dispatch(setMarkers(mediaId, markers));
          }
          return response;
        })
    }
  });
};

export const removeDataForMedia = createAction(REMOVE_DATA_FOR_MEDIA, (mediaId) => mediaId);
export const getMediaUrl = createAction(GET_MEDIA_URL, (token, mediaId) => {
  return {
    data: {
      mediaId
    },
    promise: MediaApi.getMediaUrl(token, mediaId)
  }
});
export const setActiveTopic = createAction(SET_ACTIVE_TOPIC, (mediaId, topicId, type) => {
  return {mediaId, topicId, type};
});
export const choosePlayerAppTab = createAction(CHOOSE_PLAYER_APP_TAB, (mediaId, tabId) => {
  return {mediaId, tabId};
});

export const actions = {
  getDataForMedia,
  removeDataForMedia,
  getMediaUrl,
  setActiveTopic,
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
    response = parseMediaData(response);
    return state.mergeIn([response.mediaId], {
      status: response.status,
      metadata: response.metadata,
      topicsIds: response.topicsIds,
      topics: response.topics,
      activeTopic: response.activeTopic,
      groupsIds: response.groupsIds,
      groups: response.groups,
      activeGroup: response.activeGroup,
      speakers: response.speakers,
      transcriptSpeakers: response.transcriptSpeakers,
      activeSpeaker: response.activeSpeaker,
      transcript: response.transcript,
      predictions: response.predictions,
      utterances: response.utterances,
      jobTasks: response.jobTasks,
      getPending: false,
      getError: '',
      view: initialViewState
    });
  },

  [REMOVE_DATA_FOR_MEDIA]: (state, { payload: mediaId }) => {
    return state.delete(mediaId);
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
    let field = payload.type === 'keywords' ? 'activeTopic' : 'activeGroup';
    return state.setIn([payload.mediaId, field], payload.topicId);
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
    if (data.keywords.latest.groups) {
      let parseGroupsResult = parseGroups(data.keywords.latest.groups);
      groupsIds = parseGroupsResult.groupIds;
      groups = parseGroupsResult.groups;
      activeGroup = parseGroupsResult.activeGroup;
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
        let clearSpeakerName = getClearWordFromTranscript(word.w).toLowerCase();
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

  let metadata = null;
  if (data.metadata) {
    metadata = {
      ...data.metadata
    }
  }

  return {
    mediaId: data.mediaId,
    metadata,
    status: data.status,
    activeTopic,
    activeSpeaker: null,
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
    let times = {};
    Object.keys(keyword.t).forEach(speakerName => {
      times[speakerName.toLowerCase()] = keyword.t[speakerName];
    });
    keyword.t = times;
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

const parseGroups = function (groupsData) {
  let activeGroup = null;
  let groupIds = [];
  let groups = {};

  Object.keys(groupsData).forEach((groupName, i) => {
    let id = i.toString();
    let group = groupsData[groupName];
    if (i === 0) {
      activeGroup = id;
    }

    let keywords = {};
    let keywordsIds = Object.keys(group).map((keywordName, j) => {
      let keywordId = j.toString();
      let keyword = group[keywordName];
      let times = keyword.map(keywordItem => keywordItem.s);

      keywords[keywordId] = {
        name: keywordName,
        t: {
          'unknown': times
        }
      };
      return keywordId;
    });

    groupIds.push(id);
    groups[id] = {
      key: id,
      name: groupName,
      keywordsIds,
      keywords
    }
  });

  return {groupIds, groups, activeGroup}
};

const addSpeaker = function (speakersObject, newSpeakersNames) {
  newSpeakersNames.forEach(speakerName => {
    const key = speakerName.toLowerCase();
    if (!speakersObject[key]) {
      speakersObject[key] = {
        name: key,
        originalName: speakerName,
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

const parseScore = function (score) {
  return parseFloat(score.toFixed(1));
};
