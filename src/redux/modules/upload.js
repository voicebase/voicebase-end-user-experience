import { createAction, handleActions } from 'redux-actions'

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
};

/*
 * Reducers
 * */
export default handleActions({
  [createAction]: (state, { payload }) => {
    return {
      ...state
    };
  }
}, initialState);
