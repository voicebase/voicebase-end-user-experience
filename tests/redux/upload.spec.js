import {
  ADD_FILES,
  REMOVE_FILE,
  POST_FILE,
  SET_LANGUAGE,
  SET_PRIORITY,
  SET_PREDICTION,
  SET_DETECTION,
  SET_NUMBERS,
  SET_GROUPS,
  CANCEL_UPLOAD,
  CHOOSE_TAB,
  FILES_PREVIEW_TAB,
  OPTIONS_TAB,
  actions,
  initialState,
  default as uploadReducer
} from '../../src/redux/modules/upload'

import configureMockStore from 'redux-mock-store';
import promiseMiddleware from 'redux-promise-middleware';
import thunk from 'redux-thunk';

import Immutable, { fromJS } from 'immutable'
import { checkActionTypes, checkCreatingAction, checkIsFunction, checkApiAction } from '../../src/common/Test'

describe('(Redux Module) upload.js', function () {

  let initialJsState = initialState.toJS();

  describe('Constants', () => {
    const constants = {
      ADD_FILES,
      REMOVE_FILE,
      POST_FILE,
      SET_LANGUAGE,
      SET_PRIORITY,
      SET_PREDICTION,
      SET_DETECTION,
      SET_NUMBERS,
      SET_GROUPS,
      CANCEL_UPLOAD,
      CHOOSE_TAB
    };
    Object.keys(constants).forEach(key => {
      it(`Should export a constant ${key}`, function () {
        expect(constants[key]).to.equal(key)
      });
    });
  });

  describe('Actions', () => {

    describe('ADD_FILES', () => {
      checkActionTypes(actions, 'addFiles', ADD_FILES);
      checkCreatingAction(actions, 'addFiles', ADD_FILES, [[]]);
    });

    describe('REMOVE_FILE', () => {
      checkActionTypes(actions, 'removeFile', REMOVE_FILE);
      checkCreatingAction(actions, 'removeFile', REMOVE_FILE, ['fileId']);
    });

    describe('POST_FILE', () => {
      checkIsFunction(actions, 'postFile');

      it('check POST_FILE_FULFILLED when call action postFile', (done) => {
        checkApiAction(actions, 'postFile', POST_FILE, ['token', 'fileId', {}, {}], false, done);
      });

      it('check POST_FILE_REJECTED when call action postFile', (done) => {
        checkApiAction(actions, 'postFile', POST_FILE, ['token', 'fileId', {}, {}], true, done);
      });
    });

    describe('SET_LANGUAGE', () => {
      checkActionTypes(actions, 'setLanguage', SET_LANGUAGE);
      checkCreatingAction(actions, 'setLanguage', SET_LANGUAGE, ['uk']);
    });

    describe('SET_PRIORITY', () => {
      checkActionTypes(actions, 'setPriority', SET_PRIORITY);
      checkCreatingAction(actions, 'setPriority', SET_PRIORITY, ['high']);
    });

    describe('SET_PREDICTION', () => {
      checkActionTypes(actions, 'setPrediction', SET_PREDICTION);
      checkCreatingAction(actions, 'setPrediction', SET_PREDICTION, [['1', '2']]);
    });

    describe('SET_DETECTION', () => {
      checkActionTypes(actions, 'setDetection', SET_DETECTION);
      checkCreatingAction(actions, 'setDetection', SET_DETECTION, [['1', '2']]);
    });

    describe('SET_NUMBERS', () => {
      checkActionTypes(actions, 'setNumbers', SET_NUMBERS);
      checkCreatingAction(actions, 'setNumbers', SET_NUMBERS, [['1', '2']]);
    });

    describe('SET_GROUPS', () => {
      checkActionTypes(actions, 'setGroups', SET_GROUPS);
      checkCreatingAction(actions, 'setGroups', SET_GROUPS, [['1', '2']]);
    });

    describe('CANCEL_UPLOAD', () => {
      checkActionTypes(actions, 'cancelUpload', CANCEL_UPLOAD);
      checkCreatingAction(actions, 'cancelUpload', CANCEL_UPLOAD, []);
    });

    describe('CHOOSE_TAB', () => {
      checkActionTypes(actions, 'chooseTab', CHOOSE_TAB);
      checkCreatingAction(actions, 'chooseTab', CHOOSE_TAB, [FILES_PREVIEW_TAB]);
    });

  });

  describe('Reducers', () => {
    let files = [{
      name: 'testFile',
      type: 'audio'
    }, {
      name: 'testFile2',
      type: 'video'
    }];

    let addFilesState = fromJS({
      ...initialJsState,
      view: {
        showForm: true,
        activeTab: FILES_PREVIEW_TAB
      },
      fileIds: ['0', '1'],
      files: {
        0: {
          file: {...files[0]},
          type: files[0].type
        },
        1: {
          file: {...files[1]},
          type: files[1].type
        }
      }
    });

    it('ADD_FILES reducer', function () {
      let expectedRes = addFilesState;

      let action = {
        type: 'ADD_FILES',
        payload: files
      };
      let reducerRes = uploadReducer(initialState, action);

      assert.isTrue(Immutable.is(expectedRes, reducerRes));
    });

    it('REMOVE_FILE reducer', function () {
      let expectedRes = addFilesState.set('fileIds', fromJS(['0'])).deleteIn(['files', '1']);

      // Add two files
      let addRes = uploadReducer(initialState, {
        type: 'ADD_FILES',
        payload: files
      });

      // Remove file
      let deleteRes = uploadReducer(addRes, {
        type: 'REMOVE_FILE',
        payload: '1'
      });

      assert.isTrue(Immutable.is(expectedRes, deleteRes));
    });

    it('POST_FILE_PENDING reducer', function () {
      let expectedRes = addFilesState
        .setIn(['view', 'showForm'], false)
        .mergeIn(['files', '0'], {
          isPostPending: true,
          errorMessage: ''
        });

      // Add two files
      let addRes = uploadReducer(initialState, {
        type: 'ADD_FILES',
        payload: files
      });

      let postPendingRes = uploadReducer(addRes, {
        type: POST_FILE + '_PENDING',
        payload: {fileId: '0'}
      });

      assert.isTrue(Immutable.is(expectedRes, postPendingRes));
    });

    it('POST_FILE_REJECTED reducer', function () {
      let expectedRes = addFilesState
        .mergeIn(['files', '0'], {
          isPostPending: false,
          errorMessage: 'error'
        });

      // Add two files
      let addRes = uploadReducer(initialState, {
        type: 'ADD_FILES',
        payload: files
      });

      let postRemoveRes = uploadReducer(addRes, {
        type: POST_FILE + '_REJECTED',
        payload: {
          fileId: '0',
          error: 'error'
        }
      });

      assert.isTrue(Immutable.is(expectedRes, postRemoveRes));
    });

    it('POST_FILE_FULFILLED reducer', function () {
      let mediaId = 'mediaId';
      let fileId = '0';
      let expectedRes = addFilesState
        .setIn(['view', 'showForm'], false)
        .mergeIn(['files', fileId], {
          isPostPending: false,
          isPostComplete: true,
          errorMessage: '',
          mediaId: mediaId,
          data: {
            mediaId: mediaId
          }
        });

      // Add two files
      let addRes = uploadReducer(initialState, {
        type: 'ADD_FILES',
        payload: files
      });

      // Pending
      let postPendingRes = uploadReducer(addRes, {
        type: POST_FILE + '_PENDING',
        payload: {fileId: fileId}
      });

      // post success
      let postRes = uploadReducer(postPendingRes, {
        type: POST_FILE + '_FULFILLED',
        payload: {
          fileId: fileId,
          data: {
            mediaId: mediaId
          }
        }
      });

      assert.isTrue(Immutable.is(expectedRes, postRes));
    });

    it('CANCEL_UPLOAD reducer', function () {
      let expectedRes = initialState;

      // Add two files
      let addRes = uploadReducer(initialState, {
        type: 'ADD_FILES',
        payload: files
      });

      // Pending
      let cancelRes = uploadReducer(addRes, {
        type: 'CANCEL_UPLOAD'
      });

      assert.isTrue(Immutable.is(expectedRes, cancelRes));
    });

    it('CHOOSE_TAB reducer', function () {
      let expectedRes = initialState.setIn(['view', 'activeTab'], OPTIONS_TAB);

      let res = uploadReducer(initialState, {
        type: 'CHOOSE_TAB',
        payload: OPTIONS_TAB
      });

      assert.isTrue(Immutable.is(expectedRes, res));
    });

    it('SET_LANGUAGE reducer', function () {
      let lang = 'uk';
      let expectedRes = initialState.setIn(['options', 'language'], lang);

      let res = uploadReducer(initialState, {
        type: 'SET_LANGUAGE',
        payload: lang
      });

      assert.isTrue(Immutable.is(expectedRes, res));
    });

    it('SET_PRIORITY reducer', function () {
      let priority = '1';
      let expectedRes = initialState.setIn(['options', 'priority'], priority);

      let res = uploadReducer(initialState, {
        type: 'SET_PRIORITY',
        payload: priority
      });

      assert.isTrue(Immutable.is(expectedRes, res));
    });

    it('SET_PREDICTION reducer', function () {
      let payload = ['1'];
      let expectedRes = initialState.setIn(['options', 'predictions'], payload);

      let res = uploadReducer(initialState, {
        type: 'SET_PREDICTION',
        payload: payload
      });

      assert.isTrue(Immutable.is(expectedRes, res));
    });

    it('SET_DETECTION reducer', function () {
      let payload = ['1'];
      let expectedRes = initialState.setIn(['options', 'detection'], payload);

      let res = uploadReducer(initialState, {
        type: 'SET_DETECTION',
        payload: payload
      });

      assert.isTrue(Immutable.is(expectedRes, res));
    });

    it('SET_NUMBERS reducer', function () {
      let payload = ['1'];
      let expectedRes = initialState.setIn(['options', 'numbers'], payload);

      let res = uploadReducer(initialState, {
        type: 'SET_NUMBERS',
        payload: payload
      });

      assert.isTrue(Immutable.is(expectedRes, res));
    });

    it('SET_GROUPS reducer', function () {
      let payload = ['1'];
      let expectedRes = initialState.setIn(['options', 'groups'], payload);

      let res = uploadReducer(initialState, {
        type: 'SET_GROUPS',
        payload: payload
      });

      assert.isTrue(Immutable.is(expectedRes, res));
    });

  });

});

