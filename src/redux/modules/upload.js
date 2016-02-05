import { createAction, handleActions } from 'redux-actions'
import _ from 'lodash'

/*
 * Constants
 * */
export const ADD_FILES = 'ADD_FILES';
export const CANCEL_UPLOAD = 'CANCEL_UPLOAD';

/*
 * Actions
 * */
export const addFiles = createAction(ADD_FILES, (files) => files);

// view
export const cancelUpload = createAction(CANCEL_UPLOAD);

export const actions = {
  addFiles,
  cancelUpload
};

/*
 * State
 * */
export const initialState = {
  view: {
    showModalForm: false
  },
  fileIds: [],
  files: {}
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

  [CANCEL_UPLOAD]: (state) => {
    return {
      ...state,
      view: {
        ...state.view,
        showModalForm: false
      }
    }
  }
}, initialState);
