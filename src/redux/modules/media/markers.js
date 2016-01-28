import { createAction, handleActions } from 'redux-actions'

/*
 * Constants
 * */
export const SET_MARKERS = 'SET_MARKERS';

/*
 * Actions
 * */
export const setMarkers = createAction(SET_MARKERS, (mediaId, markers) => {
  return {mediaId, markers};
});

export const actions = {
  setMarkers
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
    let markerIds = [];
    let markers = {};
    payload.markers.forEach((marker, i) => {
      markerIds = markerIds.concat(i);
      markers[i] = {
        ...initialMarkerState,
        time: marker.time,
        keywordName: marker.keywordName
      }
    });

    return {
      ...state,
      [payload.mediaId]: {
        ...state[payload.mediaId],
        markerIds,
        markers
      }
    };
  }

}, initialState);
