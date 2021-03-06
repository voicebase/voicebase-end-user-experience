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
export const CLEAR_MEDIA_LIST_ERROR = 'CLEAR_MEDIA_LIST_ERROR';
export const ORDER_BY_DATE = 'ORDER_BY_DATE';
export const FILTER_BY_DATE = 'FILTER_BY_DATE';

/*
 * Actions
 * */
export const getMedia = createAction(GET_MEDIA, (token, searchOptions) => {
  return {
    promise: MediaApi.getMedia(token, searchOptions)
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
export const clearMediaListError = createAction(CLEAR_MEDIA_LIST_ERROR);
export const deleteMedia = createAction(DELETE_MEDIA, (token, mediaId) => {
  return {
    data: {
      token,
      mediaId
    },
    promise: MediaApi.deleteMedia(token, mediaId)
  }
});
export const orderByDate = createAction(ORDER_BY_DATE, (isDesc) => isDesc);
export const filterByDate = createAction(FILTER_BY_DATE, (dateFrom, dateTo) => {
  return {dateFrom, dateTo};
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
  deleteMedia,
  clearMediaListError,
  orderByDate,
  filterByDate
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
    let mediaIds = state.get('mediaIds').unshift(mediaData.mediaId);
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
    let activeMediaId = (state.get('activeMediaId') === mediaId) ? '' : state.get('activeMediaId');
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
    let selectedMediaIds = state.get('selectedMediaIds').filter(id => id !== response.mediaId);
    return state
      .set('mediaIds', mediaIds)
      .set('selectedMediaIds', selectedMediaIds)
      .deleteIn(['media', response.mediaId]);
  },

  [CLEAR_MEDIA_LIST_ERROR]: (state) => {
    return state.set('errorMessage', '');
  },

  [ORDER_BY_DATE]: (state, { payload: isDesc }) => {
    let media = state.get('media');
    media = media.sortBy((mediaObj) => mediaObj.get('dateCreated'));

    let mediaIds = media.keySeq().toArray();
    if (isDesc) {
      mediaIds = mediaIds.reverse();
    }

    return state
      .merge({mediaIds});
  },

  [FILTER_BY_DATE]: (state, { payload }) => {
    const dateFrom = (payload.dateFrom) ? new Date(payload.dateFrom) : null;
    const dateTo = (payload.dateTo) ? new Date(payload.dateTo) : null;
    let media = state.get('media');
    media = media.filter((mediaObj) => {
      if (!dateFrom || !dateTo) return true;

      const dateCreated = new Date(mediaObj.get('dateCreated'));
      return dateCreated >= dateFrom && dateCreated <= dateTo;
    });
    let mediaIds = media.keySeq().toArray();

    return state
      .merge({mediaIds});
  }
}, initialState);
