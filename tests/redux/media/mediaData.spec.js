import {
  GET_DATA_FOR_MEDIA,
  REMOVE_DATA_FOR_MEDIA,
  GET_MEDIA_URL,
  SET_ACTIVE_TOPIC,
  CHOOSE_PLAYER_APP_TAB,
  actions,
  initialState,
  initialViewState,
  parseMediaData,
  default as mediaDataReducer
} from '../../../app/redux/modules/media/mediaData'

import { checkActionTypes, checkIsFunction, checkCreatingAction, checkApiAction, checkCreatingActionWithMultipleParameters } from '../../../app/common/Test'
import Immutable, { fromJS } from 'immutable'
import fakeData from '../../../app/fakeData/fakeData'

describe('(Redux Module) mediaData.js', function () {
  describe('Constants', () => {
    const constants = {
      GET_DATA_FOR_MEDIA,
      REMOVE_DATA_FOR_MEDIA,
      GET_MEDIA_URL,
      SET_ACTIVE_TOPIC,
      CHOOSE_PLAYER_APP_TAB
    };
    Object.keys(constants).forEach(key => {
      it(`Should export a constant ${key}`, function () {
        expect(constants[key]).to.equal(key)
      });
    });
  });

  describe('Actions', () => {
    describe('GET_DATA_FOR_MEDIA', () => {
      checkIsFunction(actions, 'getDataForMedia');

      it('check GET_DATA_FOR_MEDIA_FULFILLED', (done) => {
        checkApiAction(actions, 'getDataForMedia', GET_DATA_FOR_MEDIA, ['token', 'mediaId'], false, done);
      });

      it('check GET_DATA_FOR_MEDIA_REJECTED', (done) => {
        checkApiAction(actions, 'getDataForMedia', GET_DATA_FOR_MEDIA, ['token', 'mediaId'], true, done);
      });
    });

    describe('REMOVE_DATA_FOR_MEDIA', () => {
      checkActionTypes(actions, 'removeDataForMedia', REMOVE_DATA_FOR_MEDIA);
      checkCreatingAction(actions, 'removeDataForMedia', REMOVE_DATA_FOR_MEDIA, ['mediaId']);
    });

    describe('GET_MEDIA_URL', () => {
      checkIsFunction(actions, 'getMediaUrl');

      it('check GET_MEDIA_URL_FULFILLED', (done) => {
        checkApiAction(actions, 'getMediaUrl', GET_MEDIA_URL, ['token', 'fake'], false, done);
      });

      it('check GET_MEDIA_URL_REJECTED', (done) => {
        checkApiAction(actions, 'getMediaUrl', GET_MEDIA_URL, ['token', 'mediaId'], true, done);
      });
    });

    describe('SET_ACTIVE_TOPIC', () => {
      checkActionTypes(actions, 'setActiveTopic', SET_ACTIVE_TOPIC);
      checkCreatingActionWithMultipleParameters(actions, 'setActiveTopic', SET_ACTIVE_TOPIC, ['mediaId', 0, 'keywords'], ['mediaId', 'topicId', 'type']);
    });

    describe('CHOOSE_PLAYER_APP_TAB', () => {
      checkActionTypes(actions, 'choosePlayerAppTab', CHOOSE_PLAYER_APP_TAB);
      checkCreatingActionWithMultipleParameters(actions, 'choosePlayerAppTab', CHOOSE_PLAYER_APP_TAB, ['mediaId', 0], ['mediaId', 'tabId']);
    });

  });

  describe('Reducers', () => {
    it(`${GET_DATA_FOR_MEDIA}_PENDING reducer `, function () {
      let expectedRes = initialState
        .mergeIn(['mediaId'], {
          getPending: true,
          view: initialViewState
        });

      let res = mediaDataReducer(initialState, {
        type: GET_DATA_FOR_MEDIA + '_PENDING',
        payload: {mediaId: 'mediaId'}
      });

      assert.isTrue(Immutable.is(expectedRes, res));
    });

    it(`${GET_DATA_FOR_MEDIA}_REJECTED reducer `, function () {
      let expectedRes = initialState
        .mergeIn(['mediaId'], {
          getPending: false,
          getError: 'error'
        });

      let res = mediaDataReducer(initialState, {
        type: GET_DATA_FOR_MEDIA + '_REJECTED',
        payload: {mediaId: 'mediaId', error: 'error'}
      });

      assert.isTrue(Immutable.is(expectedRes, res));
    });

    it(`${GET_DATA_FOR_MEDIA}_FULFILLED reducer `, function () {
      let response = fakeData.media;
      response.job = {
        progress: {
          tasks: []
        }
      };
      let mediaId = response.mediaId;

      let res = mediaDataReducer(initialState, {
        type: GET_DATA_FOR_MEDIA + '_FULFILLED',
        payload: JSON.parse(JSON.stringify(response))
      });

      let speaker1Color = res.getIn([mediaId, 'speakers', 'speaker 1', 'color']);
      let speaker2Color = res.getIn([mediaId, 'speakers', 'speaker 2', 'color']);
      let utter1Color = res.getIn([mediaId, 'utterances', 'items', '0', 'color']);
      let utter2Color = res.getIn([mediaId, 'utterances', 'items', '1', 'color']);

      let parsedResult = parseMediaData(JSON.parse(JSON.stringify(response)));
      let expectedRes = initialState
        .mergeIn([mediaId], {
          status: parsedResult.status,
          metadata: parsedResult.metadata,
          topicsIds: parsedResult.topicsIds,
          topics: parsedResult.topics,
          activeTopic: parsedResult.activeTopic,
          groupsIds: parsedResult.groupsIds,
          groups: parsedResult.groups,
          activeGroup: parsedResult.activeGroup,
          speakers: parsedResult.speakers,
          transcriptSpeakers: parsedResult.transcriptSpeakers,
          activeSpeaker: parsedResult.activeSpeaker,
          transcript: parsedResult.transcript,
          predictions: parsedResult.predictions,
          utterances: parsedResult.utterances,
          jobTasks: parsedResult.jobTasks,
          getPending: false,
          getError: '',
          view: initialViewState
        })
        .setIn([mediaId, 'speakers', 'speaker 1', 'color'], speaker1Color)
        .setIn([mediaId, 'speakers', 'speaker 2', 'color'], speaker2Color)
        .setIn([mediaId, 'utterances', 'items', '0', 'color'], utter1Color)
        .setIn([mediaId, 'utterances', 'items', '1', 'color'], utter2Color)

      assert.isTrue(Immutable.is(expectedRes, res));
    });

    it(`${REMOVE_DATA_FOR_MEDIA} reducer `, function () {
      let state = initialState
        .merge({
          'mediaId': {},
          'mediaId2': {}
        });

      let expectedRes = initialState.merge({'mediaId': {}});

      let res = mediaDataReducer(state, {
        type: REMOVE_DATA_FOR_MEDIA,
        payload: 'mediaId2'
      });

      assert.isTrue(Immutable.is(expectedRes, res));
    });

    it(`${GET_MEDIA_URL}_PENDING reducer `, function () {
      let expectedRes = initialState
        .mergeIn(['mediaId'], {
          getUrlPending: true
        });

      let res = mediaDataReducer(initialState, {
        type: GET_MEDIA_URL + '_PENDING',
        payload: {mediaId: 'mediaId'}
      });

      assert.isTrue(Immutable.is(expectedRes, res));
    });

    it(`${GET_MEDIA_URL}_REJECTED reducer `, function () {
      let expectedRes = initialState
        .mergeIn(['mediaId'], {
          getUrlPending: false,
          getUrlError: 'error'
        });

      let res = mediaDataReducer(initialState, {
        type: GET_MEDIA_URL + '_REJECTED',
        payload: {mediaId: 'mediaId', error: 'error'}
      });

      assert.isTrue(Immutable.is(expectedRes, res));
    });

    it(`${GET_MEDIA_URL}_FULFILLED reducer `, function () {
      let expectedRes = initialState
        .mergeIn(['mediaId'], {
          mediaUrl: 'url',
          getUrlPending: false,
          getUrlError: ''
        });

      let res = mediaDataReducer(initialState, {
        type: GET_MEDIA_URL + '_FULFILLED',
        payload: {mediaId: 'mediaId', url: 'url'}
      });

      assert.isTrue(Immutable.is(expectedRes, res));
    });

    it(`${SET_ACTIVE_TOPIC} reducer `, function () {
      let expectedRes = initialState
        .setIn(['mediaId', 'activeTopic'], 0);

      let res = mediaDataReducer(initialState, {
        type: SET_ACTIVE_TOPIC,
        payload: {mediaId: 'mediaId', topicId: 0, type: 'keywords'}
      });

      assert.isTrue(Immutable.is(expectedRes, res));
    });

    it(`${SET_ACTIVE_TOPIC} reducer for group`, function () {
      let expectedRes = initialState
        .setIn(['mediaId', 'activeGroup'], 0);

      let res = mediaDataReducer(initialState, {
        type: SET_ACTIVE_TOPIC,
        payload: {mediaId: 'mediaId', topicId: 0, type: 'group'}
      });

      assert.isTrue(Immutable.is(expectedRes, res));
    });

    it(`${CHOOSE_PLAYER_APP_TAB} reducer `, function () {
      let expectedRes = initialState
        .setIn(['mediaId', 'view', 'activeTab'], 0);

      let res = mediaDataReducer(initialState, {
        type: CHOOSE_PLAYER_APP_TAB,
        payload: {mediaId: 'mediaId', tabId: 0}
      });

      assert.isTrue(Immutable.is(expectedRes, res));
    });

  });
});
