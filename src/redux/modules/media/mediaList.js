import { createAction, handleActions } from 'redux-actions'
import _ from 'lodash'

import MediaApi from '../../../api/mediaApi'

/*
 * Constants
 * */
export const GET_MEDIA = 'GET_MEDIA';
export const ADD_MEDIA = 'ADD_MEDIA';
export const ADD_PROCESSING_MEDIA = 'ADD_PROCESSING_MEDIA';
export const REMOVE_PROCESSING_MEDIA = 'REMOVE_PROCESSING_MEDIA';
export const EXPAND_MEDIA = 'EXPAND_MEDIA';
export const COLLAPSE_MEDIA = 'COLLAPSE_MEDIA';
export const SELECT_MEDIA = 'SELECT_MEDIA';
export const UNSELECT_MEDIA = 'UNSELECT_MEDIA';
export const SELECT_ALL_MEDIA = 'SELECT_ALL_MEDIA';
export const UNSELECT_ALL_MEDIA = 'UNSELECT_ALL_MEDIA';
export const DELETE_MEDIA = 'DELETE_MEDIA';

/*
 * Actions
 * */
export const getMedia = createAction(GET_MEDIA, (token) => {
  return {
    promise: MediaApi.getMedia(token)
  }
});
export const addMedia = createAction(ADD_MEDIA, (mediaData) => mediaData);
export const addProcessingMedia = createAction(ADD_PROCESSING_MEDIA, (mediaData) => mediaData);
export const removeProcessingMedia = createAction(REMOVE_PROCESSING_MEDIA, (mediaId) => mediaId);
export const expandMedia = createAction(EXPAND_MEDIA, (mediaId) => mediaId);
export const collapseMedia = createAction(COLLAPSE_MEDIA, (mediaId) => mediaId);
export const selectMedia = createAction(SELECT_MEDIA, (mediaId) => mediaId);
export const unselectMedia = createAction(UNSELECT_MEDIA, (mediaId) => mediaId);
export const selectAllMedia = createAction(SELECT_ALL_MEDIA);
export const unselectAllMedia = createAction(UNSELECT_ALL_MEDIA);
export const deleteMedia = createAction(DELETE_MEDIA, (token, mediaId) => {
  return {
    data: {
      token,
      mediaId
    },
    promise: MediaApi.deleteMedia(token, mediaId)
  }
});

export const actions = {
  getMedia,
  addMedia,
  addProcessingMedia,
  removeProcessingMedia,
  expandMedia,
  collapseMedia,
  selectMedia,
  unselectMedia,
  selectAllMedia,
  unselectAllMedia,
  deleteMedia
};

/*
 * State
 * */
export const initialState = {
  mediaIds: [],
  media: {},
  processingIds: [],
  processingMedia: {},
  isGetPending: false,
  isGetCompleted: false,
  errorMessage: '',
  lastUploadedIds: [],
  activeMediaId: '',
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
      media: response.media,
      processingIds: response.processingIds,
      processingMedia: response.processingMedia
    };
  },

  [ADD_MEDIA]: (state, { payload: mediaData }) => {
    return {
      ...state,
      mediaIds: [mediaData.mediaId].concat(state.mediaIds),
      media: {
        ...state.media,
        [mediaData.mediaId]: {
          ...mediaData
        }
      }
    };
  },

  [ADD_PROCESSING_MEDIA]: (state, { payload: mediaData }) => {
    return {
      ...state,
      processingIds: [mediaData.mediaId].concat(state.processingIds),
      processingMedia: {
        ...state.processingMedia,
        [mediaData.mediaId]: {
          ...mediaData
        }
      }
    };
  },

  [REMOVE_PROCESSING_MEDIA]: (state, { payload: mediaId }) => {
    let processingIds = state.processingIds.filter(id => id !== mediaId);
    return {
      ...state,
      processingIds,
      processingMedia: _.pick(state.processingMedia, processingIds)
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
  },

  [`${DELETE_MEDIA}_PENDING`]: (state, { payload }) => {
    return {
      ...state,
      media: {
        ...state.media,
        [payload.mediaId]: {
          ...state.media[payload.mediaId],
          deletePending: true
        }
      }
    };
  },

  [`${DELETE_MEDIA}_REJECTED`]: (state, { payload }) => {
    return {
      ...state,
      media: {
        ...state.media,
        [payload.mediaId]: {
          ...state.media[payload.mediaId],
          deletePending: false,
          deleteError: payload.error
        }
      }
    };
  },

  [`${DELETE_MEDIA}_FULFILLED`]: (state, { payload: response }) => {
    let mediaIds = state.mediaIds.filter(mediaId => response.mediaId !== mediaId);
    return {
      ...state,
      mediaIds: mediaIds,
      media: _.pick(state.media, mediaIds)
    };
  }
}, initialState);
