import { createAction, handleActions } from 'redux-actions'
import _ from 'lodash'
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
  cancelUpload,
  chooseTab
};

/*
 * State
 * */
export const initialState = {
  view: {
    showForm: false,
    activeTab: FILES_PREVIEW_TAB
  },
  fileIds: [],
  files: {},
  options: {}
};

/*
 * Reducers
 * */
export default handleActions({
  [ADD_FILES]: (state, { payload: files }) => {
    let fileIds = [];
    let filesObj = {};
    files.forEach(file => {
      let id = _.uniqueId('file-');
      let type = getFileType(file);
      fileIds.push(id);
      filesObj[id] = {
        file: file,
        type: type
      }
    });
    return {
      ...state,
      fileIds,
      files: filesObj,
      view: {
        ...state.view,
        showForm: true,
        activeTab: FILES_PREVIEW_TAB
      }
    };
  },

  [REMOVE_FILE]: (state, { payload: id }) => {
    let fileIds = state.fileIds.filter(fileId => fileId !== id)
    return {
      ...state,
      fileIds,
      files: _.pick(state.files, fileIds)
    }
  },

  [POST_FILE + '_PENDING']: (state, {payload}) => {
    return {
      ...state,
      files: {
        ...state.files,
        [payload.fileId]: {
          ...state.files[payload.fileId],
          isPostPending: true,
          errorMessage: ''
        }
      },
      view: {
        ...state.view,
        showForm: false
      }
    };
  },

  [POST_FILE + '_REJECTED']: (state, {payload: {fileId, error}}) => {
    return {
      ...state,
      files: {
        ...state.files,
        [fileId]: {
          ...state.files[fileId],
          isPostPending: false,
          errorMessage: error
        }
      }
    };
  },

  [POST_FILE + '_FULFILLED']: (state, {payload: {fileId, data}}) => {
    return {
      ...state,
      files: {
        ...state.files,
        [fileId]: {
          ...state.files[fileId],
          isPostPending: false,
          isPostComplete: true,
          mediaId: data.mediaId,
          data
        }
      }
    };
  },

  [CANCEL_UPLOAD]: (state) => {
    return {
      ...state,
      fileIds: [],
      files: {},
      view: {
        ...state.view,
        showForm: false,
        activeTab: FILES_PREVIEW_TAB
      },
      options: {}
    }
  },

  [CHOOSE_TAB]: (state, { payload: tabId }) => {
    return {
      ...state,
      view: {
        ...state.view,
        activeTab: tabId
      }
    }
  },

  [SET_LANGUAGE]: (state, { payload: language }) => {
    return {
      ...state,
      options: {
        ...state.options,
        language
      }
    }
  },

  [SET_PRIORITY]: (state, { payload: priority }) => {
    return {
      ...state,
      options: {
        ...state.options,
        priority
      }
    }
  },

  [SET_PREDICTION]: (state, { payload: predictionIds }) => {
    return {
      ...state,
      options: {
        ...state.options,
        predictions: predictionIds
      }
    }
  },

  [SET_DETECTION]: (state, { payload: detectionIds }) => {
    return {
      ...state,
      options: {
        ...state.options,
        detection: detectionIds
      }
    }
  },

  [SET_NUMBERS]: (state, { payload: numberIds }) => {
    return {
      ...state,
      options: {
        ...state.options,
        numbers: numberIds
      }
    }
  },

  [SET_GROUPS]: (state, { payload: groupIds }) => {
    return {
      ...state,
      options: {
        ...state.options,
        groups: groupIds
      }
    }
  }
}, initialState);
