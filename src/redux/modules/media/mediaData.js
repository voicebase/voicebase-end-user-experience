import { createAction, handleActions } from 'redux-actions'

import MediaApi from '../../../api/mediaApi'

/*
 * Constants
 * */
export const GET_DATA_FOR_MEDIA = 'GET_DATA_FOR_MEDIA';

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

export const actions = {
  getDataForMedia
};

/*
 * State
 * */
export const initialState = {
  data: {}
};

/*
 * Reducers
 * */
export default handleActions({
  [`${GET_DATA_FOR_MEDIA}_PENDING`]: (state, { payload }) => {
    return {
      ...state,
      data: {
        ...state.data,
        [payload.mediaId]: {
          ...state.data[payload.mediaId],
          getPending: true
        }
      }
    };
  },

  [`${GET_DATA_FOR_MEDIA}_REJECTED`]: (state, { payload }) => {
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

  [`${GET_DATA_FOR_MEDIA}_FULFILLED`]: (state, { payload: response }) => {
    return {
      ...state,
      data: {
        ...state.data,
        [response.mediaId]: {
          data: response,
          getPending: false,
          getError: ''
        }
      }
    };
  }

}, initialState);
