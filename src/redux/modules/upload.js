import { createAction, handleActions } from 'redux-actions'
import _ from 'lodash'

/*
 * Constants
 * */
export const ADD_FILES = 'ADD_FILES';

/*
 * Actions
 * */
export const addFiles = createAction(ADD_FILES, (files) => files);

export const actions = {
  addFiles
};

/*
 * State
 * */
export const initialState = {
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
      files: filesObj
    };
  }
}, initialState);
