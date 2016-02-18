import { createAction, handleActions } from 'redux-actions'
import { normalize } from '../../../common/Normalize'

/*
 * Constants
 * */
export const SET_MARKERS = 'SET_MARKERS';
export const CLEAR_JUST_CREATED_MARKERS = 'CLEAR_JUST_CREATED_MARKERS';

/*
 * Actions
 * */
export const setMarkers = createAction(SET_MARKERS, (mediaId, markers) => {
  return {mediaId, markers};
});
export const clearJustCreatedMarkers = createAction(CLEAR_JUST_CREATED_MARKERS, (mediaId) => mediaId);

export const actions = {
  setMarkers,
  clearJustCreatedMarkers
};

/*
 * State
 * */
export const initialState = {};
export const initialMarkerState = {
  time: 0,
  keywordName: ''
};

/*
 * Reducers
 * */
export default handleActions({
  [SET_MARKERS]: (state, {payload}) => {
    let result = normalize(payload.markers, (marker, i) => {
      return {
        ...initialMarkerState,
        id: i.toString(),
        time: marker.time,
        keywordName: marker.keywordName
      }
    });

    return {
      ...state,
      [payload.mediaId]: {
        ...state[payload.mediaId],
        markerIds: result.ids,
        markers: result.entities,
        justCreated: true
      }
    };
  },

  [CLEAR_JUST_CREATED_MARKERS]: (state, {payload: mediaId}) => {
    return {
      ...state,
      [mediaId]: {
        ...state[mediaId],
        justCreated: false
      }
    };
  }
}, initialState);
