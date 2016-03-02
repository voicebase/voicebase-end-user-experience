import { createAction, handleActions } from 'redux-actions'
import { fromJS } from 'immutable';

/*
 * Constants
 * */
export const CREATE_PLAYER = 'CREATE_PLAYER';
export const DESTROY_PLAYER = 'DESTROY_PLAYER';
export const PLAY = 'PLAY';
export const PAUSE = 'PAUSE';
export const SET_POSITION = 'SET_POSITION';
export const SET_BUFFERED = 'SET_BUFFERED';
export const SET_DURATION = 'SET_DURATION';
export const SET_TIMELINE_WIDTH = 'SET_TIMELINE_WIDTH';
export const SET_UTTERANCE_TIME = 'SET_UTTERANCE_TIME';
export const CLEAR_UTTERANCE_TIME = 'CLEAR_UTTERANCE_TIME';
export const SET_FULLSCREEN = 'SET_FULLSCREEN';

/*
 * Actions
 * */
export const createPlayer = createAction(CREATE_PLAYER, (id, url, type) => {
  return {id, url, type};
});
export const destroyPlayer = createAction(DESTROY_PLAYER, id => id);
export const play = createAction(PLAY, (id) => id);
export const pause = createAction(PAUSE, (id) => id);
export const setPosition = createAction(SET_POSITION, (id, pos) => {
  return {id, pos};
});
export const setBuffered = createAction(SET_BUFFERED, (id, pos) => {
  return {id, pos};
});
export const setDuration = createAction(SET_DURATION, (id, duration) => {
  return {id, duration};
});
export const setTimelineWidth = createAction(SET_TIMELINE_WIDTH, (id, timelineWidth) => {
  return {id, timelineWidth};
});
export const setUtteranceTime = createAction(SET_UTTERANCE_TIME, (id, time) => {
  return {id, time};
});
export const clearUtteranceTime = createAction(CLEAR_UTTERANCE_TIME, (id) => id);
export const setFullscreen = createAction(SET_FULLSCREEN, (id, isFullscreen) => {
  return {id, isFullscreen};
});

export const actions = {
  createPlayer,
  destroyPlayer,
  play,
  pause,
  setPosition,
  setBuffered,
  setDuration,
  setTimelineWidth,
  setUtteranceTime,
  clearUtteranceTime,
  setFullscreen
};

/*
 * State
 * */
export const initialState = fromJS({
  playerIds: [],
  players: {}
});

export const initialPlayerState = {
  url: '',
  type: 'audio',
  playing: false,
  played: 0,
  loaded: 0,
  duration: 0,
  timelineWidth: null,
  utteranceTime: null,
  isFullscreen: false,
  error: ''
};

/*
 * Reducers
 * */
export default handleActions({
  [CREATE_PLAYER]: (state, {payload}) => {
    let playerIds = state.get('playerIds').concat(payload.id);
    return state
      .set('playerIds', playerIds)
      .mergeIn(['players', payload.id], {
        ...initialPlayerState,
        url: payload.url,
        type: payload.type
      });
  },

  [DESTROY_PLAYER]: (state, { payload: id }) => {
    let playerIds = state.get('playerIds').filter(playerId => playerId !== id)
    return state
      .set('playerIds', playerIds)
      .deleteIn(['players', id]);
  },

  [PLAY]: (state, {payload: id}) => {
    return state.setIn(['players', id, 'playing'], true);
  },

  [PAUSE]: (state, {payload: id}) => {
    return state.setIn(['players', id, 'playing'], false);
  },

  [SET_POSITION]: (state, {payload}) => {
    return state.setIn(['players', payload.id, 'played'], payload.pos);
  },

  [SET_BUFFERED]: (state, {payload}) => {
    return state.setIn(['players', payload.id, 'loaded'], payload.pos);
  },

  [SET_DURATION]: (state, {payload}) => {
    return state.setIn(['players', payload.id, 'duration'], payload.duration);
  },

  [SET_TIMELINE_WIDTH]: (state, {payload}) => {
    return state.setIn(['players', payload.id, 'timelineWidth'], payload.timelineWidth);
  },

  [SET_UTTERANCE_TIME]: (state, {payload}) => {
    return state.setIn(['players', payload.id, 'utteranceTime'], payload.time);
  },

  [CLEAR_UTTERANCE_TIME]: (state, {payload: id}) => {
    return state.setIn(['players', id, 'utteranceTime'], null);
  },

  [SET_FULLSCREEN]: (state, {payload: { id, isFullscreen }}) => {
    return state.setIn(['players', id, 'isFullscreen'], isFullscreen);
  }

}, initialState);
