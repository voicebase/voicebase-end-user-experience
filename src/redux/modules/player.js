import { createAction, handleActions } from 'redux-actions'
import _ from 'lodash'

/*
 * Constants
 * */
export const CREATE_PLAYER = 'CREATE_PLAYER';
export const PLAY = 'PLAY';
export const PAUSE = 'PAUSE';
export const SET_POSITION = 'SET_POSITION';
export const SET_BUFFERED = 'SET_BUFFERED';
export const SET_DURATION = 'SET_DURATION';

/*
 * Actions
 * */
export const createPlayer = createAction(CREATE_PLAYER, (id, url) => {
  return {id, url};
});
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

export const actions = {
  createPlayer,
  play,
  pause,
  setPosition,
  setBuffered,
  setDuration
};

/*
 * State
 * */
export const initialState = {
  playerIds: [],
  players: {}
};

const initialPlayerState = {
  url: '',
  playing: false,
  volume: 1,
  played: 0,
  loaded: 0,
  duration: 0,
  error: ''
};

/*
 * Reducers
 * */
export default handleActions({
  [CREATE_PLAYER]: (state, {payload}) => {
    return {
      ...state,
      playerIds: _.concat(state.playerIds, payload.id),
      players: {
        ...state.players,
        [payload.id]: {
          ...initialPlayerState,
          url: payload.url
        }
      }
    };
  },

  [PLAY]: (state, {payload: id}) => {
    return {
      ...state,
      players: {
        ...state.players,
        [id]: {
          ...state.players[id],
          playing: true
        }
      }
    };
  },

  [PAUSE]: (state, {payload: id}) => {
    return {
      ...state,
      players: {
        ...state.players,
        [id]: {
          ...state.players[id],
          playing: false
        }
      }
    };
  },

  [SET_POSITION]: (state, {payload}) => {
    return {
      ...state,
      players: {
        ...state.players,
        [payload.id]: {
          ...state.players[payload.id],
          played: payload.pos
        }
      }
    };
  },

  [SET_BUFFERED]: (state, {payload}) => {
    return {
      ...state,
      players: {
        ...state.players,
        [payload.id]: {
          ...state.players[payload.id],
          loaded: payload.pos
        }
      }
    };
  },

  [SET_DURATION]: (state, {payload}) => {
    return {
      ...state,
      players: {
        ...state.players,
        [payload.id]: {
          ...state.players[payload.id],
          duration: payload.duration
        }
      }
    };
  }

}, initialState);
