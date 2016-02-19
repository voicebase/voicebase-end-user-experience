import { createAction, handleActions } from 'redux-actions'
import { fromJS } from 'immutable';

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
export const initialState = fromJS({
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
});

/*
 * Reducers
 * */
export default handleActions({
  [`${GET_MEDIA}_PENDING`]: (state) => {
    return state.merge({
      isGetPending: true,
      isGetCompleted: false,
      errorMessage: ''
    });
  },

  [`${GET_MEDIA}_REJECTED`]: (state, { payload: error }) => {
    return state.merge({
      isGetPending: false,
      isGetCompleted: false,
      errorMessage: error
    });
  },

  [`${GET_MEDIA}_FULFILLED`]: (state, { payload: response }) => {
    return state.merge({
      isGetPending: false,
      isGetCompleted: true,
      errorMessage: '',
      mediaIds: response.mediaIds,
      media: response.media,
      processingIds: response.processingIds,
      processingMedia: response.processingMedia
    });
  },

  [ADD_MEDIA]: (state, { payload: mediaData }) => {
    let mediaIds = state.get('mediaIds').concat(mediaData.mediaId);
    return state
      .set('mediaIds', mediaIds)
      .mergeIn(['media', mediaData.mediaId], {
        ...mediaData
      });
  },

  [ADD_PROCESSING_MEDIA]: (state, { payload: mediaData }) => {
    let processingIds = state.get('processingIds').concat(mediaData.mediaId);
    return state
      .set('processingIds', processingIds)
      .mergeIn(['processingMedia', mediaData.mediaId], {
        ...mediaData
      });
  },

  [REMOVE_PROCESSING_MEDIA]: (state, { payload: mediaId }) => {
    let processingIds = state.get('processingIds').filter(id => id !== mediaId);
    return state
      .set('processingIds', processingIds)
      .deleteIn(['processingMedia', mediaId]);
  },

  [EXPAND_MEDIA]: (state, { payload: mediaId }) => {
    return state.set('activeMediaId', mediaId);
  },

  [COLLAPSE_MEDIA]: (state, { payload: mediaId }) => {
    let activeMediaId = (state.activeMediaId === mediaId) ? '' : state.activeMediaId;
    return state.set('activeMediaId', activeMediaId);
  },

  [SELECT_MEDIA]: (state, { payload: mediaId }) => {
    let selectedMediaIds = state.get('selectedMediaIds').concat(mediaId);
    return state
      .set('selectedMediaIds', selectedMediaIds)
      .setIn(['media', mediaId, 'checked'], true);
  },

  [UNSELECT_MEDIA]: (state, { payload: mediaId }) => {
    let selectedMediaIds = state.get('selectedMediaIds').filter(id => id !== mediaId);
    return state
      .set('selectedMediaIds', selectedMediaIds)
      .setIn(['media', mediaId, 'checked'], false);
  },

  [SELECT_ALL_MEDIA]: (state) => {
    let selectedMediaIds = state.get('mediaIds');
    let media = state.get('media').map(mediaItem => mediaItem.set('checked', true));

    return state
      .set('selectedMediaIds', selectedMediaIds)
      .set('media', media);
  },

  [UNSELECT_ALL_MEDIA]: (state) => {
    let selectedMediaIds = state.get('selectedMediaIds').clear();
    let media = state.get('media').map(mediaItem => mediaItem.set('checked', false));

    return state
      .set('selectedMediaIds', selectedMediaIds)
      .set('media', media);
  },

  [`${DELETE_MEDIA}_PENDING`]: (state, { payload }) => {
    return state.setIn(['media', payload.mediaId, 'deletePending'], true);
  },

  [`${DELETE_MEDIA}_REJECTED`]: (state, { payload }) => {
    return state.mergeIn(['media', payload.mediaId], {
      deletePending: false,
      deleteError: payload.error
    });
  },

  [`${DELETE_MEDIA}_FULFILLED`]: (state, { payload: response }) => {
    let mediaIds = state.get('mediaIds').filter(mediaId => response.mediaId !== mediaId);
    return state
      .set('mediaIds', mediaIds)
      .deleteIn(['media', response.mediaId]);
  }
}, initialState);
