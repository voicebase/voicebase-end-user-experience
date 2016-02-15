import { createAction, handleActions } from 'redux-actions'
import { getClearWordFromTranscript, getRandomColor } from '../../../common/Common'
import uniqueId from 'lodash/uniqueId'
import MediaApi from '../../../api/mediaApi'

/*
 * Constants
 * */
export const GET_DATA_FOR_MEDIA = 'GET_DATA_FOR_MEDIA';
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
  setActiveTopic,
  setActiveGroup,
  choosePlayerAppTab
};

/*
 * State
 * */
export const initialState = {
  data: {}
};

export const initialViewState = {
  activeTab: KEYWORDS_TAB
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
          getPending: true,
          view: initialViewState
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
  },

  [SET_ACTIVE_GROUP]: (state, { payload }) => {
    return {
      ...state,
      data: {
        ...state.data,
        [payload.mediaId]: {
          ...state.data[payload.mediaId],
          activeGroup: payload.topicId
        }
      }
    }
  },

  [CHOOSE_PLAYER_APP_TAB]: (state, { payload: {tabId, mediaId} }) => {
    return {
      ...state,
      data: {
        ...state.data,
        [mediaId]: {
          ...state.data[mediaId],
          view: {
            ...state.data[mediaId].view,
            activeTab: tabId
          }
        }
      }
    };
  }

}, initialState);

const parseMediaData = function (data) {
  let topicsIds = [];
  let topics = {};
  let activeTopic = null;
  let speakers = {};
  if (data.keywords && data.keywords.latest && data.keywords.latest.words) {
    let allKeywords = data.keywords.latest.words;
    topicsIds.push('ALL_TOPICS');
    let parseKeywordsResult = parseKeywords(allKeywords);
    speakers = Object.assign({}, speakers, parseKeywordsResult.speakers);
    topics['ALL_TOPICS'] = {
      name: 'ALL TOPICS',
      type: 'category',
      ...parseKeywordsResult
    };
    activeTopic = 'ALL_TOPICS';
  }

  if (data.topics && data.topics.latest && data.topics.latest.topics && Array.isArray(data.topics.latest.topics)) {
    let parseTopicsResult = parseTopics(data.topics.latest.topics);
    topicsIds = topicsIds.concat(parseTopicsResult.topicsIds);
    topics = Object.assign({}, topics, parseTopicsResult.topics);
    speakers = Object.assign({}, speakers, parseTopicsResult.speakers);
  }

  let groupsIds = [];
  let groups = {};
  let activeGroup = {};
  if (data.groups && data.groups.latest && data.groups.latest.groups && Array.isArray(data.groups.latest.groups)) {
    let parseGroupsResult = parseTopics(data.groups.latest.groups);
    groupsIds = parseGroupsResult.topicsIds;
    groups = parseGroupsResult.topics;
    activeGroup = parseGroupsResult.activeTopic;
    speakers = Object.assign({}, speakers, parseGroupsResult.speakers);
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

  let utterances = null;
  if (data.utterances && data.utterances.latest && data.utterances.latest.utterances) {
    utterances = {
      itemIds: [],
      items: {}
    };
    data.utterances.latest.utterances.forEach((utterance, i) => {
      utterances.itemIds.push(i);
      utterances.items[i] = {
        ...utterance,
        id: i,
        color: getRandomColor()
      };
    })
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

const parseTopics = function (topicsArr) {
  let topicsIds = [];
  let topics = {};
  let activeTopic = null;
  let speakers = {};

  topicsArr.forEach((topic, i) => {
    let key = uniqueId('topic-');
    if (i === 0) {
      activeTopic = key;
    }
    topicsIds.push(key);
    let parseKeywordsResult = parseKeywords(topic.keywords);
    speakers = Object.assign({}, speakers, parseKeywordsResult.speakers);
    topics[key] = {
      ...topic,
      key,
      keywordsIds: parseKeywordsResult.keywordsIds,
      keywords: parseKeywordsResult.keywords
    }
  });

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
