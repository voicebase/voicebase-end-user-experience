import { createAction, handleActions } from 'redux-actions'
import _ from 'lodash'

import MediaApi from '../../api/mediaApi'

/*
 * Constants
 * */
export const GET_MEDIA = 'GET_MEDIA';
export const EXPAND_MEDIA = 'EXPAND_MEDIA';
export const COLLAPSE_MEDIA = 'COLLAPSE_MEDIA';
export const SELECT_MEDIA = 'SELECT_MEDIA';
export const UNSELECT_MEDIA = 'UNSELECT_MEDIA';
export const SELECT_ALL_MEDIA = 'SELECT_ALL_MEDIA';
export const UNSELECT_ALL_MEDIA = 'UNSELECT_ALL_MEDIA';

/*
 * Actions
 * */
export const getMedia = createAction(GET_MEDIA, (token) => {
  return {
    promise: MediaApi.getMedia(token)
  }
});

export const expandMedia = createAction(EXPAND_MEDIA, (mediaId) => mediaId);
export const collapseMedia = createAction(COLLAPSE_MEDIA, (mediaId) => mediaId);
export const selectMedia = createAction(SELECT_MEDIA, (mediaId) => mediaId);
export const unselectMedia = createAction(UNSELECT_MEDIA, (mediaId) => mediaId);
export const selectAllMedia = createAction(SELECT_ALL_MEDIA);
export const unselectAllMedia = createAction(UNSELECT_ALL_MEDIA);

export const actions = {
  getMedia,
  expandMedia,
  collapseMedia,
  selectMedia,
  unselectMedia,
  selectAllMedia,
  unselectAllMedia
};

/*
 * State
 * */
export const initialState = {
  mediaIds: [],
  media: {},
  isGetPending: false,
  isGetCompleted: false,
  errorMessage: '',
  lastUploadedIds: [],
  activeMediaId: '',
  mediaData: {},
  selectedMediaIds: []
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
      mediaIds: response.mediaIds,
      media: response.media
    };
  },

  [EXPAND_MEDIA]: (state, { payload: mediaId }) => {
    return {
      ...state,
      activeMediaId: mediaId
    }
  },

  [COLLAPSE_MEDIA]: (state, { payload: mediaId }) => {
    return {
      ...state,
      activeMediaId: (state.activeMediaId === mediaId) ? '' : state.activeMediaId
    }
  },

  [SELECT_MEDIA]: (state, { payload: mediaId }) => {
    return {
      ...state,
      media: {
        ...state.media,
        [mediaId]: {
          ...state.media[mediaId],
          checked: true
        }
      },
      selectedMediaIds: _.concat(state.selectedMediaIds, mediaId)
    }
  },

  [UNSELECT_MEDIA]: (state, { payload: mediaId }) => {
    return {
      ...state,
      media: {
        ...state.media,
        [mediaId]: {
          ...state.media[mediaId],
          checked: false
        }
      },
      selectedMediaIds: _.filter(state.selectedMediaIds, id => id !== mediaId)
    }
  },

  [SELECT_ALL_MEDIA]: (state) => {
    let selectedMediaIds = [];
    let media = _.mapValues(state.media, function(mediaItem) {
      selectedMediaIds = _.concat(selectedMediaIds, mediaItem.mediaId);
      return {
        ...mediaItem,
        checked: true
      }
    });

    return {
      ...state,
      media: media,
      selectedMediaIds: selectedMediaIds
    }
  },

  [UNSELECT_ALL_MEDIA]: (state) => {
    let media = _.mapValues(state.media, function(mediaItem) {
      return {
        ...mediaItem,
        checked: false
      }
    });

    return {
      ...state,
      media: media,
      selectedMediaIds: []
    }
  }

}, initialState);
