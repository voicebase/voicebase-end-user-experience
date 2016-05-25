import { createAction, handleActions } from 'redux-actions'
import { fromJS } from 'immutable';
import { normalize } from '../../common/Normalize'
import { getFileType } from '../../common/Common'
import MediaApi from '../../api/mediaApi'

/*
 * Constants
 * */
export const ADD_FILES = 'ADD_FILES';
export const REMOVE_FILE = 'REMOVE_FILE';
export const POST_FILE = 'POST_FILE';
export const SET_LANGUAGE = 'SET_LANGUAGE';
export const SET_PRIORITY = 'SET_PRIORITY';
export const SET_PREDICTION = 'SET_PREDICTION';
export const SET_DETECTION = 'SET_DETECTION';
export const SET_NUMBERS = 'SET_NUMBERS';
export const SET_GROUPS = 'SET_GROUPS';
export const SET_VOCABULARY = 'SET_VOCABULARY';
export const SET_IS_STEREO = 'SET_IS_STEREO';
export const SET_SPEAKER = 'SET_SPEAKER';
export const CANCEL_UPLOAD = 'CANCEL_UPLOAD';
export const CHOOSE_TAB = 'CHOOSE_TAB';
export const FILES_PREVIEW_TAB = 1;
export const OPTIONS_TAB = 2;

/*
 * Actions
 * */
export const addFiles = createAction(ADD_FILES, (files) => files);
export const removeFile = createAction(REMOVE_FILE, (id) => id);
export const postFile = createAction(POST_FILE, (token, fileId, file, options) => {
  return {
    data: {fileId},
    promise: MediaApi.postMedia(token, fileId, file, options)
  }
});
export const setLanguage = createAction(SET_LANGUAGE, (language) => language);
export const setPriority = createAction(SET_PRIORITY, (priority) => priority);
export const setPrediction = createAction(SET_PREDICTION, (predictionIds) => predictionIds);
export const setDetection = createAction(SET_DETECTION, (detectionIds) => detectionIds);
export const setNumbers = createAction(SET_NUMBERS, (numberIds) => numberIds);
export const setGroups = createAction(SET_GROUPS, (groupIds) => groupIds);
export const setVocabulary = createAction(SET_VOCABULARY, (vocabulary) => vocabulary);
export const setIsStereo = createAction(SET_IS_STEREO, (isStereo) => isStereo);
export const setSpeaker = createAction(SET_SPEAKER, (speakerType, speakerName) => {
  return {speakerType, speakerName};
});

// view
export const cancelUpload = createAction(CANCEL_UPLOAD);
export const chooseTab = createAction(CHOOSE_TAB, (tabId) => tabId);

export const actions = {
  addFiles,
  removeFile,
  postFile,
  setLanguage,
  setPriority,
  setPrediction,
  setDetection,
  setNumbers,
  setGroups,
  setVocabulary,
  setIsStereo,
  setSpeaker,
  cancelUpload,
  chooseTab
};

/*
 * State
 * */
export const initialState = fromJS({
  view: {
    showForm: false,
    activeTab: FILES_PREVIEW_TAB,
    isStereoFile: false,
    showVocabularies: true
  },
  fileIds: [],
  files: {},
  options: {
    speakers: {
      left: 'Speaker 1',
      right: 'Speaker 2'
    },
    vocabularies: []
  }
});

/*
 * Reducers
 * */
export default handleActions({
  [ADD_FILES]: (state, { payload: files }) => {
    let result = normalize(files, file => {
      let type = getFileType(file);
      return { file, type }
    });

    return state
      .merge({
        fileIds: result.ids,
        files: result.entities
      })
      .mergeIn(['view'], {
        showForm: true,
        activeTab: FILES_PREVIEW_TAB
      });
  },

  [REMOVE_FILE]: (state, { payload: id }) => {
    let fileIds = state.get('fileIds').filter(fileId => fileId !== id);
    return state
      .set('fileIds', fileIds)
      .deleteIn(['files', id]);
  },

  [POST_FILE + '_PENDING']: (state, {payload}) => {
    return state
      .mergeIn(['files', payload.fileId], {
        isPostPending: true,
        errorMessage: ''
      })
      .setIn(['view', 'showForm'], false);
  },

  [POST_FILE + '_REJECTED']: (state, {payload: {fileId, error}}) => {
    return state.mergeIn(['files', fileId], {
      isPostPending: false,
      errorMessage: error
    });
  },

  [POST_FILE + '_FULFILLED']: (state, {payload: {fileId, data}}) => {
    return state.mergeIn(['files', fileId], {
      isPostPending: false,
      isPostComplete: true,
      mediaId: data.mediaId,
      data
    });
  },

  [CANCEL_UPLOAD]: () => {
    return initialState;
  },

  [CHOOSE_TAB]: (state, { payload: tabId }) => {
    return state.setIn(['view', 'activeTab'], tabId);
  },

  [SET_LANGUAGE]: (state, { payload: language }) => {
    return state.setIn(['options', 'language'], language);
  },

  [SET_PRIORITY]: (state, { payload: priority }) => {
    return state.setIn(['options', 'priority'], priority);
  },

  [SET_PREDICTION]: (state, { payload: predictionIds }) => {
    return state.setIn(['options', 'predictions'], predictionIds);
  },

  [SET_DETECTION]: (state, { payload: detectionIds }) => {
    return state.setIn(['options', 'detection'], detectionIds);
  },

  [SET_NUMBERS]: (state, { payload: numberIds }) => {
    return state.setIn(['options', 'numbers'], numberIds);
  },

  [SET_GROUPS]: (state, { payload: groupIds }) => {
    return state.setIn(['options', 'groups'], groupIds);
  },

  [SET_VOCABULARY]: (state, { payload: vocabulary }) => {
    return state.setIn(['options', 'vocabularies'], vocabulary);
  },

  [SET_IS_STEREO]: (state, { payload: isStereo }) => {
    return state.setIn(['view', 'isStereoFile'], isStereo);
  },

  [SET_SPEAKER]: (state, { payload }) => {
    return state.setIn(['options', 'speakers', payload.speakerType], payload.speakerName);
  }
}, initialState);
