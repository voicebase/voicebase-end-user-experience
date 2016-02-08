import { createAction, handleActions } from 'redux-actions'
import _ from 'lodash'

/*
 * Constants
 * */
export const ADD_FILES = 'ADD_FILES';
export const REMOVE_FILE = 'REMOVE_FILE';
export const SET_LANGUAGE = 'SET_LANGUAGE';
export const SET_PRIORITY = 'SET_PRIORITY';
export const CANCEL_UPLOAD = 'CANCEL_UPLOAD';
export const CHOOSE_TAB = 'CHOOSE_TAB';
export const FILES_PREVIEW_TAB = 1;
export const OPTIONS_TAB = 2;

/*
 * Actions
 * */
export const addFiles = createAction(ADD_FILES, (files) => files);
export const removeFile = createAction(REMOVE_FILE, (id) => id);
export const setLanguage = createAction(SET_LANGUAGE, (language) => language);
export const setPriority = createAction(SET_PRIORITY, (priority) => priority);

// view
export const cancelUpload = createAction(CANCEL_UPLOAD);
export const chooseTab = createAction(CHOOSE_TAB, (tabId) => tabId);

export const actions = {
  addFiles,
  removeFile,
  setLanguage,
  setPriority,
  cancelUpload,
  chooseTab
};

/*
 * State
 * */
export const initialState = {
  view: {
    showModalForm: false,
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
      fileIds.push(id);
      filesObj[id] = {
        file: file
      }
    });
    return {
      ...state,
      fileIds,
      files: filesObj,
      view: {
        ...state.view,
        showModalForm: true
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

  [CANCEL_UPLOAD]: (state) => {
    return {
      ...state,
      view: {
        ...state.view,
        showModalForm: false,
        activeTab: FILES_PREVIEW_TAB
      }
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
  }
}, initialState);
