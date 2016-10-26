import {
  CREATE_PLAYER,
  DESTROY_PLAYER,
  PLAY,
  PAUSE,
  SET_POSITION,
  SET_BUFFERED,
  SET_DURATION,
  SET_TIMELINE_WIDTH,
  SET_UTTERANCE_TIME,
  CLEAR_UTTERANCE_TIME,
  SET_FULLSCREEN,
  actions,
  initialState,
  initialPlayerState,
  default as playerReducer
} from '../../../app/redux/modules/media/player'

import { checkActionTypes, checkCreatingAction, checkCreatingActionWithMultipleParameters } from '../../../app/common/Test'
import Immutable, { fromJS } from 'immutable'

describe('(Redux Module) markers.js', function () {
  describe('Constants', () => {
    const constants = {
      CREATE_PLAYER,
      DESTROY_PLAYER,
      PLAY,
      PAUSE,
      SET_POSITION,
      SET_BUFFERED,
      SET_DURATION,
      SET_TIMELINE_WIDTH,
      SET_UTTERANCE_TIME,
      CLEAR_UTTERANCE_TIME,
      SET_FULLSCREEN
    };
    Object.keys(constants).forEach(key => {
      it(`Should export a constant ${key}`, function () {
        expect(constants[key]).to.equal(key)
      });
    });
  });

  describe('Actions', () => {
    describe('CREATE_PLAYER', () => {
      checkActionTypes(actions, 'createPlayer', CREATE_PLAYER);
      checkCreatingActionWithMultipleParameters(actions, 'createPlayer', CREATE_PLAYER, ['mediaId', 'url', 'video'], ['id', 'url', 'type']);
    });

    describe('DESTROY_PLAYER', () => {
      checkActionTypes(actions, 'destroyPlayer', DESTROY_PLAYER);
      checkCreatingAction(actions, 'destroyPlayer', DESTROY_PLAYER, ['mediaId']);
    });

    describe('PLAY', () => {
      checkActionTypes(actions, 'play', PLAY);
      checkCreatingAction(actions, 'play', PLAY, ['mediaId']);
    });

    describe('PAUSE', () => {
      checkActionTypes(actions, 'pause', PAUSE);
      checkCreatingAction(actions, 'pause', PAUSE, ['mediaId']);
    });

    describe('SET_POSITION', () => {
      checkActionTypes(actions, 'setPosition', SET_POSITION);
      checkCreatingActionWithMultipleParameters(actions, 'setPosition', SET_POSITION, ['mediaId', 0], ['id', 'pos']);
    });

    describe('SET_BUFFERED', () => {
      checkActionTypes(actions, 'setBuffered', SET_BUFFERED);
      checkCreatingActionWithMultipleParameters(actions, 'setBuffered', SET_BUFFERED, ['mediaId', 0], ['id', 'pos']);
    });

    describe('SET_DURATION', () => {
      checkActionTypes(actions, 'setDuration', SET_DURATION);
      checkCreatingActionWithMultipleParameters(actions, 'setDuration', SET_DURATION, ['mediaId', 0], ['id', 'duration']);
    });

    describe('SET_TIMELINE_WIDTH', () => {
      checkActionTypes(actions, 'setTimelineWidth', SET_TIMELINE_WIDTH);
      checkCreatingActionWithMultipleParameters(actions, 'setTimelineWidth', SET_TIMELINE_WIDTH, ['mediaId', 0], ['id', 'timelineWidth']);
    });

    describe('SET_UTTERANCE_TIME', () => {
      checkActionTypes(actions, 'setUtteranceTime', SET_UTTERANCE_TIME);
      checkCreatingActionWithMultipleParameters(actions, 'setUtteranceTime', SET_UTTERANCE_TIME, ['mediaId', 0], ['id', 'time']);
    });

    describe('CLEAR_UTTERANCE_TIME', () => {
      checkActionTypes(actions, 'clearUtteranceTime', CLEAR_UTTERANCE_TIME);
      checkCreatingAction(actions, 'clearUtteranceTime', CLEAR_UTTERANCE_TIME, ['mediaId']);
    });

    describe('SET_FULLSCREEN', () => {
      checkActionTypes(actions, 'setFullscreen', SET_FULLSCREEN);
      checkCreatingActionWithMultipleParameters(actions, 'setFullscreen', SET_FULLSCREEN, ['mediaId', true], ['id', 'isFullscreen']);
    });

  });

  describe('Reducers', () => {
    let playerState = fromJS({
      playerIds: ['0'],
      players: {
        0: {
          ...initialPlayerState,
          url: 'url',
          type: 'audio'
        }
      }
    });

    it(`${CREATE_PLAYER} reducer `, function () {
      let expectedRes = playerState;

      let res = playerReducer(initialState, {
        type: CREATE_PLAYER,
        payload: {id: '0', url: 'url', type: 'audio'}
      });

      assert.isTrue(Immutable.is(expectedRes, res));
    });

    it(`${DESTROY_PLAYER} reducer `, function () {
      let expectedRes = initialState;

      let createRes = playerReducer(initialState, {
        type: CREATE_PLAYER,
        payload: {id: '0', url: 'url', type: 'audio'}
      });

      let res = playerReducer(createRes, {
        type: DESTROY_PLAYER,
        payload: '0'
      });

      assert.isTrue(Immutable.is(expectedRes, res));
    });

    it(`${PLAY} reducer `, function () {
      let expectedRes = playerState.setIn(['players', '0', 'playing'], true);

      let res = playerReducer(playerState, {
        type: PLAY,
        payload: '0'
      });

      assert.isTrue(Immutable.is(expectedRes, res));
    });

    it(`${PAUSE} reducer `, function () {
      let expectedRes = playerState.setIn(['players', '0', 'playing'], false);

      let res = playerReducer(playerState, {
        type: PAUSE,
        payload: '0'
      });

      assert.isTrue(Immutable.is(expectedRes, res));
    });

    it(`${SET_POSITION} reducer `, function () {
      let expectedRes = playerState.setIn(['players', '0', 'played'], 100);

      let res = playerReducer(playerState, {
        type: SET_POSITION,
        payload: { id: '0', pos: 100 }
      });

      assert.isTrue(Immutable.is(expectedRes, res));
    });

    it(`${SET_BUFFERED} reducer `, function () {
      let expectedRes = playerState.setIn(['players', '0', 'loaded'], 100);

      let res = playerReducer(playerState, {
        type: SET_BUFFERED,
        payload: { id: '0', pos: 100 }
      });

      assert.isTrue(Immutable.is(expectedRes, res));
    });

    it(`${SET_DURATION} reducer `, function () {
      let expectedRes = playerState.setIn(['players', '0', 'duration'], 100);

      let res = playerReducer(playerState, {
        type: SET_DURATION,
        payload: { id: '0', duration: 100 }
      });

      assert.isTrue(Immutable.is(expectedRes, res));
    });

    it(`${SET_TIMELINE_WIDTH} reducer `, function () {
      let expectedRes = playerState.setIn(['players', '0', 'timelineWidth'], 100);

      let res = playerReducer(playerState, {
        type: SET_TIMELINE_WIDTH,
        payload: { id: '0', timelineWidth: 100 }
      });

      assert.isTrue(Immutable.is(expectedRes, res));
    });

    it(`${SET_UTTERANCE_TIME} reducer `, function () {
      let expectedRes = playerState.setIn(['players', '0', 'utteranceTime'], 100);

      let res = playerReducer(playerState, {
        type: SET_UTTERANCE_TIME,
        payload: { id: '0', time: 100 }
      });

      assert.isTrue(Immutable.is(expectedRes, res));
    });

    it(`${CLEAR_UTTERANCE_TIME} reducer `, function () {
      let expectedRes = playerState.setIn(['players', '0', 'utteranceTime'], null);

      let res = playerReducer(playerState, {
        type: CLEAR_UTTERANCE_TIME,
        payload: '0'
      });

      assert.isTrue(Immutable.is(expectedRes, res));
    });

    it(`${SET_FULLSCREEN} reducer `, function () {
      let expectedRes = playerState.setIn(['players', '0', 'isFullscreen'], true);

      let res = playerReducer(playerState, {
        type: SET_FULLSCREEN,
        payload: {
          id: '0',
          isFullscreen: true
        }
      });

      assert.isTrue(Immutable.is(expectedRes, res));
    });

  });
});
