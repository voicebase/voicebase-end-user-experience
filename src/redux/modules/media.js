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
  isPending: false,
  isCompleted: false,
  errorMessage: ''
};

/*
 * Reducers
 * */
export default handleActions({
  [`${GET_MEDIA}_PENDING`]: (state, { payload }) => {
    return {
      ...state,
      isPending: true,
      isCompleted: false,
      errorMessage: ''
    };
  },

  [`${GET_MEDIA}_REJECTED`]: (state, { payload: error }) => {
    return {
      ...state,
      isPending: false,
      isCompleted: false,
      errorMessage: error
    };
  },

  [`${GET_MEDIA}_FULFILLED`]: (state, { payload: response }) => {
    return {
      ...state,
      isPending: false,
      isCompleted: true,
      errorMessage: '',
      media: response.media
    };
  }
}, initialState);
