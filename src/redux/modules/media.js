import { createAction, handleActions } from 'redux-actions'

import MediaApi from '../../api/mediaApi'

/*
 * Constants
 * */
export const GET_MEDIA = 'GET_MEDIA';

/*
 * Actions
 * */
export const getMedia = createAction(GET_MEDIA, (token) => {
  return {
    promise: MediaApi.getMedia(token)
  }
});

export const actions = {
  getMedia
};

/*
 * State
 * */
export const initialState = {
  media: [],
  isGetPending: false,
  isGetCompleted: false,
  errorMessage: ''
};

/*
 * Reducers
 * */
export default handleActions({
  [`${GET_MEDIA}_PENDING`]: (state, { payload }) => {
    return {
      ...state,
      isGetPending: true,
      isGetCompleted: false,
      errorMessage: ''
    };
  },

  [`${GET_MEDIA}_REJECTED`]: (state, { payload: error }) => {
    return {
      ...state,
      isGetPending: false,
      isGetCompleted: false,
      errorMessage: error
    };
  },

  [`${GET_MEDIA}_FULFILLED`]: (state, { payload: response }) => {
    return {
      ...state,
      isGetPending: false,
      isGetCompleted: true,
      errorMessage: '',
      media: response.media
    };
  }
}, initialState);
