import {
  GET_MEDIA,
  ADD_MEDIA,
  ADD_PROCESSING_MEDIA,
  REMOVE_PROCESSING_MEDIA,
  EXPAND_MEDIA,
  COLLAPSE_MEDIA,
  SELECT_MEDIA,
  UNSELECT_MEDIA,
  SELECT_ALL_MEDIA,
  UNSELECT_ALL_MEDIA,
  DELETE_MEDIA,
  CLEAR_MEDIA_LIST_ERROR,
  actions,
  initialState,
  default as mediaListReducer
} from '../../../app/redux/modules/media/mediaList'

import { checkActionTypes, checkIsFunction, checkCreatingAction, checkApiAction, checkCreatingActionWithMultipleParameters } from '../../../app/common/Test'
import configureMockStore from 'redux-mock-store';
import promiseMiddleware from 'redux-promise-middleware';
import thunk from 'redux-thunk';
import Immutable, { fromJS } from 'immutable'

describe('(Redux Module) mediaList.js', function () {
  describe('Constants', () => {
    const constants = {
      GET_MEDIA,
      ADD_MEDIA,
      ADD_PROCESSING_MEDIA,
      REMOVE_PROCESSING_MEDIA,
      EXPAND_MEDIA,
      COLLAPSE_MEDIA,
      SELECT_MEDIA,
      UNSELECT_MEDIA,
      SELECT_ALL_MEDIA,
      UNSELECT_ALL_MEDIA,
      DELETE_MEDIA,
      CLEAR_MEDIA_LIST_ERROR
    };
    Object.keys(constants).forEach(key => {
      it(`Should export a constant ${key}`, function () {
        expect(constants[key]).to.equal(key)
      });
    });
  });

  describe('Actions', () => {
    describe('GET_MEDIA', () => {
      checkIsFunction(actions, 'getMedia');

      it('check GET_MEDIA_FULFILLED', (done) => {
        checkApiAction(actions, 'getMedia', GET_MEDIA, ['token', {}], false, done);
      });

      it('check GET_MEDIA_REJECTED', (done) => {
        checkApiAction(actions, 'getMedia', GET_MEDIA, ['token', {}], true, done);
      });
    });

    describe('ADD_MEDIA', () => {
      checkActionTypes(actions, 'addMedia', ADD_MEDIA);
      checkCreatingAction(actions, 'addMedia', ADD_MEDIA, [{}]);
    });

    describe('ADD_PROCESSING_MEDIA', () => {
      checkActionTypes(actions, 'addProcessingMedia', ADD_PROCESSING_MEDIA);
      checkCreatingAction(actions, 'addProcessingMedia', ADD_PROCESSING_MEDIA, [{}]);
    });

    describe('REMOVE_PROCESSING_MEDIA', () => {
      checkActionTypes(actions, 'removeProcessingMedia', REMOVE_PROCESSING_MEDIA);
      checkCreatingAction(actions, 'removeProcessingMedia', REMOVE_PROCESSING_MEDIA, ['mediaId']);
    });

    describe('EXPAND_MEDIA', () => {
      checkActionTypes(actions, 'expandMedia', EXPAND_MEDIA);
      checkCreatingAction(actions, 'expandMedia', EXPAND_MEDIA, ['mediaId']);
    });

    describe('COLLAPSE_MEDIA', () => {
      checkActionTypes(actions, 'collapseMedia', COLLAPSE_MEDIA);
      checkCreatingAction(actions, 'collapseMedia', COLLAPSE_MEDIA, ['mediaId']);
    });

    describe('SELECT_MEDIA', () => {
      checkActionTypes(actions, 'selectMedia', SELECT_MEDIA);
      checkCreatingAction(actions, 'selectMedia', SELECT_MEDIA, ['mediaId']);
    });

    describe('UNSELECT_MEDIA', () => {
      checkActionTypes(actions, 'unselectMedia', UNSELECT_MEDIA);
      checkCreatingAction(actions, 'unselectMedia', UNSELECT_MEDIA, ['mediaId']);
    });

    describe('SELECT_ALL_MEDIA', () => {
      checkActionTypes(actions, 'selectAllMedia', SELECT_ALL_MEDIA);
      checkCreatingAction(actions, 'selectAllMedia', SELECT_ALL_MEDIA, []);
    });

    describe('UNSELECT_ALL_MEDIA', () => {
      checkActionTypes(actions, 'unselectAllMedia', UNSELECT_ALL_MEDIA);
      checkCreatingAction(actions, 'unselectAllMedia', UNSELECT_ALL_MEDIA, []);
    });

    describe('CLEAR_MEDIA_LIST_ERROR', () => {
      checkActionTypes(actions, 'clearMediaListError', CLEAR_MEDIA_LIST_ERROR);
      checkCreatingAction(actions, 'clearMediaListError', CLEAR_MEDIA_LIST_ERROR, []);
    });

    describe('DELETE_MEDIA', () => {
      checkIsFunction(actions, 'getMedia');

      it('check DELETE_MEDIA_FULFILLED', (done) => {
        let xhr = sinon.useFakeXMLHttpRequest();
        var requests = [];

        xhr.onCreate = function (xhr) {
          requests.push(xhr);
        };

        const middlewares = [thunk, promiseMiddleware()];
        const mockStore = configureMockStore(middlewares);

        // create actions callback
        const pendingAction = (incomingAction) => {
          setTimeout(() => {
            expect(incomingAction.type).to.equal('DELETE_MEDIA_PENDING');
            requests[0].respond(204);
          }, 0);
        };
        const successAction = (incomingAction) => {
          expect(incomingAction.type).to.equal('DELETE_MEDIA_FULFILLED');
        };

        // create mock store
        const store = mockStore(undefined, [pendingAction, successAction], done);
        // call action;
        store.dispatch(actions.deleteMedia.apply(this, ['token', 'mediaId']));
      });

      it('check DELETE_MEDIA_REJECTED', (done) => {
        checkApiAction(actions, 'deleteMedia', DELETE_MEDIA, ['token', 'mediaId'], true, done);
      });
    });

  });

  describe('Reducers', () => {
    let mediaResponse = {
      mediaIds: ['mediaId'],
      media: {
        'mediaId': {
          mediaId: "mediaId",
          metadata: {},
          status: "finished"
        }
      },
      processingIds: ['mediaId_process'],
      processingMedia: {
        'mediaId_process': {
          mediaId: "mediaId_process"
        }
      }
    };

    let stateAfterGetting = initialState
      .merge({
        isGetPending: false,
        isGetCompleted: true,
        errorMessage: '',
        ...mediaResponse
      });

    it(`${GET_MEDIA}_PENDING reducer `, function () {
      let expectedRes = initialState
        .merge({
          isGetPending: true,
          isGetCompleted: false,
          errorMessage: ''
        });

      let res = mediaListReducer(initialState, {
        type: GET_MEDIA + '_PENDING'
      });

      assert.isTrue(Immutable.is(expectedRes, res));
    });

    it(`${GET_MEDIA}_REJECTED reducer `, function () {
      let expectedRes = initialState
        .merge({
          isGetPending: false,
          isGetCompleted: false,
          errorMessage: 'error'
        });

      let res = mediaListReducer(initialState, {
        type: GET_MEDIA + '_REJECTED',
        payload: 'error'
      });

      assert.isTrue(Immutable.is(expectedRes, res));
    });

    it(`${GET_MEDIA}_FULFILLED reducer `, function () {
      let expectedRes = stateAfterGetting

      let res = mediaListReducer(initialState, {
        type: GET_MEDIA + '_FULFILLED',
        payload: mediaResponse
      });

      assert.isTrue(Immutable.is(expectedRes, res));
    });

    it(`${ADD_MEDIA} reducer `, function () {
      let expectedRes = initialState
        .merge({
          mediaIds: mediaResponse.mediaIds,
          media: mediaResponse.media
        });

      let res = mediaListReducer(initialState, {
        type: ADD_MEDIA,
        payload: mediaResponse.media.mediaId
      });

      assert.isTrue(Immutable.is(expectedRes, res));
    });

    it(`${ADD_PROCESSING_MEDIA} reducer `, function () {
      let expectedRes = initialState
        .merge({
          processingIds: mediaResponse.processingIds,
          processingMedia: mediaResponse.processingMedia
        });

      let res = mediaListReducer(initialState, {
        type: ADD_PROCESSING_MEDIA,
        payload: mediaResponse.processingMedia.mediaId_process
      });

      assert.isTrue(Immutable.is(expectedRes, res));
    });

    it(`${REMOVE_PROCESSING_MEDIA} reducer `, function () {
      let expectedRes = initialState

      let addRes = mediaListReducer(initialState, {
        type: ADD_PROCESSING_MEDIA,
        payload: mediaResponse.processingMedia.mediaId_process
      });

      let res = mediaListReducer(addRes, {
        type: REMOVE_PROCESSING_MEDIA,
        payload: 'mediaId_process'
      });

      assert.isTrue(Immutable.is(expectedRes, res));
    });

    it(`${EXPAND_MEDIA} reducer `, function () {
      let expectedRes = initialState.set('activeMediaId', 'mediaId');

      let res = mediaListReducer(initialState, {
        type: EXPAND_MEDIA,
        payload: 'mediaId'
      });

      assert.isTrue(Immutable.is(expectedRes, res));
    });

    it(`${COLLAPSE_MEDIA} reducer `, function () {
      let expectedRes = initialState;

      let expandRes = mediaListReducer(initialState, {
        type: EXPAND_MEDIA,
        payload: 'mediaId'
      });

      let res = mediaListReducer(expandRes, {
        type: COLLAPSE_MEDIA,
        payload: 'mediaId'
      });

      assert.isTrue(Immutable.is(expectedRes, res));
    });

    it(`${SELECT_MEDIA} reducer `, function () {
      let expectedRes = stateAfterGetting
        .set('selectedMediaIds', fromJS(['mediaId']))
        .setIn(['media', 'mediaId', 'checked'], true);

      let res = mediaListReducer(stateAfterGetting, {
        type: SELECT_MEDIA,
        payload: 'mediaId'
      });

      assert.isTrue(Immutable.is(expectedRes, res));
    });

    it(`${UNSELECT_MEDIA} reducer `, function () {
      let expectedRes = stateAfterGetting
        .setIn(['media', 'mediaId', 'checked'], false);

      let res = mediaListReducer(stateAfterGetting, {
        type: UNSELECT_MEDIA,
        payload: 'mediaId'
      });

      assert.isTrue(Immutable.is(expectedRes, res));
    });

    it(`${SELECT_ALL_MEDIA} reducer `, function () {
      let selectedMediaIds = stateAfterGetting.get('mediaIds');
      let media = stateAfterGetting.get('media').map(mediaItem => mediaItem.set('checked', true));
      let expectedRes = stateAfterGetting
        .set('selectedMediaIds', selectedMediaIds)
        .set('media', media);

      let res = mediaListReducer(stateAfterGetting, {
        type: SELECT_ALL_MEDIA
      });

      assert.isTrue(Immutable.is(expectedRes, res));
    });

    it(`${UNSELECT_ALL_MEDIA} reducer `, function () {
      let media = stateAfterGetting.get('media').map(mediaItem => mediaItem.set('checked', false));
      let expectedRes = stateAfterGetting
        .set('media', media);

      let res = mediaListReducer(stateAfterGetting, {
        type: UNSELECT_ALL_MEDIA
      });

      assert.isTrue(Immutable.is(expectedRes, res));
    });

    it(`${DELETE_MEDIA}_PENDING reducer `, function () {
      let expectedRes = stateAfterGetting
        .mergeIn(['media', 'mediaId'], {
          deletePending: true
        });

      let res = mediaListReducer(stateAfterGetting, {
        type: DELETE_MEDIA + '_PENDING',
        payload: {mediaId: 'mediaId'}
      });

      assert.isTrue(Immutable.is(expectedRes, res));
    });

    it(`${DELETE_MEDIA}_REJECTED reducer `, function () {
      let expectedRes = stateAfterGetting
        .mergeIn(['media', 'mediaId'], {
          deletePending: false,
          deleteError: 'error'
        });

      let res = mediaListReducer(stateAfterGetting, {
        type: DELETE_MEDIA + '_REJECTED',
        payload: {mediaId: 'mediaId', error: 'error'}
      });

      assert.isTrue(Immutable.is(expectedRes, res));
    });

    it(`${DELETE_MEDIA}_FULFILLED reducer `, function () {
      let expectedRes = stateAfterGetting
        .set('mediaIds', fromJS([]))
        .deleteIn(['media', 'mediaId'])

      let res = mediaListReducer(stateAfterGetting, {
        type: DELETE_MEDIA + '_FULFILLED',
        payload: {mediaId: 'mediaId'}
      });

      assert.isTrue(Immutable.is(expectedRes, res));
    });

    it(`${CLEAR_MEDIA_LIST_ERROR} reducer `, function () {
      let expectedRes = stateAfterGetting
        .set('errorMessage', '');

      let res = mediaListReducer(stateAfterGetting, {
        type: CLEAR_MEDIA_LIST_ERROR
      });

      assert.isTrue(Immutable.is(expectedRes, res));
    });

  });
});
