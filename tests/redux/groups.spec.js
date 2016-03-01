import {
  GET_GROUPS,
  DELETE_GROUP,
  EDIT_GROUP,
  ADD_GROUP,
  actions,
  initialState,
  default as groupsReducer
} from '../../src/redux/modules/groups'

import { checkActionTypes, checkIsFunction, checkCreatingAction, checkApiAction, checkAsyncAction } from '../../src/common/Test'
import Immutable, { fromJS } from 'immutable'

describe('(Redux Module) groups.js', function () {
  describe('Constants', () => {
    const constants = {
      GET_GROUPS,
      DELETE_GROUP,
      EDIT_GROUP,
      ADD_GROUP
    };
    Object.keys(constants).forEach(key => {
      it(`Should export a constant ${key}`, function () {
        expect(constants[key]).to.equal(key)
      });
    });
  });

  describe('Actions', () => {
    describe('GET_GROUPS', () => {
      checkIsFunction(actions, 'getGroups');

      it('check GET_GROUPS_FULFILLED', (done) => {
        checkApiAction(actions, 'getGroups', GET_GROUPS, ['token'], false, done);
      });

      it('check GET_GROUPS_REJECTED', (done) => {
        checkApiAction(actions, 'getGroups', GET_GROUPS, ['token'], true, done);
      });

    });

    describe('DELETE_GROUP', () => {
      checkIsFunction(actions, 'deleteGroup');

      it('check DELETE_GROUP_FULFILLED', (done) => {
        checkApiAction(actions, 'deleteGroup', DELETE_GROUP, ['token', '0', 'name'], false, done);
      });

      it('check DELETE_GROUP_REJECTED', (done) => {
        checkApiAction(actions, 'deleteGroup', DELETE_GROUP, ['token', '0', 'name'], true, done);
      });

    });

    describe('EDIT_GROUP', () => {
      checkIsFunction(actions, 'editGroup');

      let newGroup = {
        name: ' name',
        keywords: []
      };

      it('check EDIT_GROUP_FULFILLED', (done) => {
        checkApiAction(actions, 'editGroup', EDIT_GROUP, ['token', '0', newGroup], false, done);
      });

      it('check EDIT_GROUP_REJECTED', (done) => {
        checkApiAction(actions, 'editGroup', EDIT_GROUP, ['token', '0', newGroup], true, done);
      });

    });

    describe('ADD_GROUP', () => {
      checkIsFunction(actions, 'addGroup');

      let newGroup = {
        name: ' name',
        keywords: []
      };

      it('check ADD_GROUP_FULFILLED', (done) => {
        checkApiAction(actions, 'addGroup', ADD_GROUP, ['token', '0', newGroup], false, done);
      });

      it('check ADD_GROUP_REJECTED', (done) => {
        checkApiAction(actions, 'addGroup', ADD_GROUP, ['token', '0', newGroup], true, done);
      });

    });
  });

  describe('Reducers', () => {
    let initialJsState = initialState.toJS();

    let groupsResponse = {
      groups: [
        {
          "keywords": [
            "data"
          ],
          "name": "first"
        },
        {
          "keywords": [
            "data2"
          ],
          "name": "phone"
        }
      ]
    };

    let groupsState = {
      "groupIds": ["0", "1"],
      "groups": {
        "0": {
          "name": "first",
          "id": "0",
          "keywordIds": ["0"],
          "keywords": {
            "0": "data"
          }
        },
        "1": {
          "name": "phone",
          "id": "1",
          "keywordIds": ["0"],
          "keywords": {
            "0": "data2"
          }
        }
      }
    };

    it(`${GET_GROUPS}_PENDING reducer `, function () {
      let expectedRes = initialState
        .merge({
          isGetPending: true,
          errorMessage: ''
        });

      let res = groupsReducer(initialState, {
        type: GET_GROUPS + '_PENDING'
      });

      assert.isTrue(Immutable.is(expectedRes, res));
    });

    it(`${GET_GROUPS}_REJECTED reducer `, function () {
      let expectedRes = initialState
        .merge({
          isGetPending: false,
          errorMessage: 'error'
        });

      let res = groupsReducer(initialState, {
        type: GET_GROUPS + '_REJECTED',
        payload: {error: 'error'}
      });

      assert.isTrue(Immutable.is(expectedRes, res));
    });

    it(`${GET_GROUPS}_FULFILLED reducer `, function () {
      let expectedRes = initialState
        .merge({
          groupIds: groupsState.groupIds,
          groups: groupsState.groups,
          isGetPending: false,
          errorMessage: ''
        });

      let res = groupsReducer(initialState, {
        type: GET_GROUPS + '_FULFILLED',
        payload: groupsResponse
      });

      assert.isTrue(Immutable.is(expectedRes, res));
    });

  });
});
