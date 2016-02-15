import { createAction, handleActions } from 'redux-actions'
import _ from 'lodash'

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

/*
 * Actions
 * */
export const createPlayer = createAction(CREATE_PLAYER, (id, url) => {
  return {id, url};
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
  clearUtteranceTime
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
  played: 0,
  loaded: 0,
  duration: 0,
  timelineWidth: null,
  utteranceTime: null,
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

  [DESTROY_PLAYER]: (state, { payload: id }) => {
    let playerIds = state.playerIds.filter(playerId => playerId !== id)
    return {
      ...state,
      playerIds,
      players: _.pick(state.players, playerIds)
    }
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
  },

  [SET_TIMELINE_WIDTH]: (state, {payload}) => {
    return {
      ...state,
      players: {
        ...state.players,
        [payload.id]: {
          ...state.players[payload.id],
          timelineWidth: payload.timelineWidth
        }
      }
    };
  },

  [SET_UTTERANCE_TIME]: (state, {payload}) => {
    return {
      ...state,
      players: {
        ...state.players,
        [payload.id]: {
          ...state.players[payload.id],
          utteranceTime: payload.time
        }
      }
    };
  },

  [CLEAR_UTTERANCE_TIME]: (state, {payload: id}) => {
    return {
      ...state,
      players: {
        ...state.players,
        [id]: {
          ...state.players[id],
          utteranceTime: null
        }
      }
    };
  }

}, initialState);
