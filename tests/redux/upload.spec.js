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

import { createAction, handleActions } from 'redux-actions'
import Immutable, { fromJS } from 'immutable'
import { checkActionTypes, checkCreatingAction } from '../../src/common/Test'

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
      checkActionTypes(actions, 'postFile', POST_FILE);
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

    it('ADD_FILES reducer', function () {
      let expectedRes = fromJS({
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

      let action = {
        type: "ADD_FILES",
        payload: files
      };
      let reducerRes = uploadReducer(initialState, action);

      assert.isTrue(Immutable.is(expectedRes, reducerRes));
    });

    it('REMOVE_FILE reducer', function () {
      let expectedRes = fromJS({
        ...initialJsState,
        view: {
          showForm: true,
          activeTab: FILES_PREVIEW_TAB
        },
        fileIds: ['0'],
        files: {
          0: {
            file: {...files[0]},
            type: files[0].type
          }
        }
      });

      // Add two files
      let addRes = uploadReducer(initialState, {
        type: "ADD_FILES",
        payload: files
      });

      // Remove two files
      let deleteRes = uploadReducer(addRes, {
        type: "REMOVE_FILE",
        payload: '1'
      });

      assert.isTrue(Immutable.is(expectedRes, deleteRes));
    });

  });

});

