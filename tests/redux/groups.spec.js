import {
  GET_GROUPS,
  DELETE_GROUP,
  EDIT_GROUP,
  ADD_GROUP,
  SET_ACTIVE_GROUP,
  CLEAR_ACTIVE_GROUP,
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
      ADD_GROUP,
      SET_ACTIVE_GROUP,
      CLEAR_ACTIVE_GROUP
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

    describe('setActiveGroup', () => {
      checkActionTypes(actions, 'setActiveGroup', SET_ACTIVE_GROUP);
      checkCreatingAction(actions, 'setActiveGroup', SET_ACTIVE_GROUP, ['0']);
    });

    describe('clearActiveGroup', () => {
      checkActionTypes(actions, 'clearActiveGroup', CLEAR_ACTIVE_GROUP);
      checkCreatingAction(actions, 'clearActiveGroup', CLEAR_ACTIVE_GROUP, []);
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

    const getStateWithGroups = function () {
      return initialState.merge({
        groupIds: groupsState.groupIds,
        groups: groupsState.groups
      });
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
      let expectedRes = getStateWithGroups()
        .merge({
          isGetPending: false,
          errorMessage: ''
        });

      let res = groupsReducer(initialState, {
        type: GET_GROUPS + '_FULFILLED',
        payload: groupsResponse
      });

      assert.isTrue(Immutable.is(expectedRes, res));
    });

    it(`${DELETE_GROUP}_PENDING reducer `, function () {
      let expectedRes = getStateWithGroups()
        .mergeIn(['groups', '0'], {
          isDeletePending: true
        });

      let getRes = groupsReducer(initialState, {
        type: GET_GROUPS + '_FULFILLED',
        payload: groupsResponse
      });

      let res = groupsReducer(getRes, {
        type: DELETE_GROUP + '_PENDING',
        payload: {groupId: '0'}
      });

      assert.isTrue(Immutable.is(expectedRes, res));
    });

    it(`${DELETE_GROUP}_REJECTED reducer `, function () {
      let expectedRes = getStateWithGroups()
        .mergeIn(['groups', '0'], {
          isDeletePending: false,
          deleteError: 'error'
        });

      let getRes = groupsReducer(initialState, {
        type: GET_GROUPS + '_FULFILLED',
        payload: groupsResponse
      });

      let res = groupsReducer(getRes, {
        type: DELETE_GROUP + '_REJECTED',
        payload: {groupId: '0', error: 'error'}
      });

      assert.isTrue(Immutable.is(expectedRes, res));
    });

    it(`${DELETE_GROUP}_FULFILLED reducer `, function () {
      let expectedRes = getStateWithGroups()
        .setIn(['groupIds'], fromJS(['1']))
        .deleteIn(['groups', '0']);

      let getRes = groupsReducer(initialState, {
        type: GET_GROUPS + '_FULFILLED',
        payload: groupsResponse
      });

      let res = groupsReducer(getRes, {
        type: DELETE_GROUP + '_FULFILLED',
        payload: {groupId: '0'}
      });

      assert.isTrue(Immutable.is(expectedRes, res));
    });

    it(`${EDIT_GROUP}_PENDING reducer `, function () {
      let expectedRes = getStateWithGroups()
        .mergeIn(['groups', '0'], {
          isEditPending: true,
          editError: ''
        });

      let getRes = groupsReducer(initialState, {
        type: GET_GROUPS + '_FULFILLED',
        payload: groupsResponse
      });

      let res = groupsReducer(getRes, {
        type: EDIT_GROUP + '_PENDING',
        payload: {groupId: '0'}
      });

      assert.isTrue(Immutable.is(expectedRes, res));
    });

    it(`${EDIT_GROUP}_REJECTED reducer `, function () {
      let expectedRes = getStateWithGroups()
        .mergeIn(['groups', '0'], {
          isEditPending: false,
          editError: 'error'
        });

      let getRes = groupsReducer(initialState, {
        type: GET_GROUPS + '_FULFILLED',
        payload: groupsResponse
      });

      let res = groupsReducer(getRes, {
        type: EDIT_GROUP + '_REJECTED',
        payload: {groupId: '0', error: 'error'}
      });

      assert.isTrue(Immutable.is(expectedRes, res));
    });

    it(`${EDIT_GROUP}_FULFILLED reducer `, function () {
      let expectedRes = getStateWithGroups()
        .mergeIn(['groups', '0'], {
          isEditPending: false,
          editError: '',
          ...groupsState.groups["1"],
          id: "0"
        });

      let getRes = groupsReducer(initialState, {
        type: GET_GROUPS + '_FULFILLED',
        payload: groupsResponse
      });

      let res = groupsReducer(getRes, {
        type: EDIT_GROUP + '_FULFILLED',
        payload: {groupId: '0', data: groupsResponse.groups["1"]}
      });

      assert.isTrue(Immutable.is(expectedRes, res));
    });

    it(`${ADD_GROUP}_PENDING reducer `, function () {
      let expectedRes = initialState
        .merge({
          isAddPending: true
        });

      let res = groupsReducer(initialState, {
        type: ADD_GROUP + '_PENDING'
      });

      assert.isTrue(Immutable.is(expectedRes, res));
    });

    it(`${ADD_GROUP}_REJECTED reducer `, function () {
      let expectedRes = initialState
        .merge({
          isAddPending: false,
          addError: 'error'
        });

      let res = groupsReducer(initialState, {
        type: ADD_GROUP + '_REJECTED',
        payload: {error: 'error'}
      });

      assert.isTrue(Immutable.is(expectedRes, res));
    });

    it(ADD_GROUP + '_FULFILLED reducer', function () {
      let res = groupsReducer(initialState, {
        type: ADD_GROUP + '_FULFILLED',
        payload: {data: groupsResponse.groups["0"]}
      });
      let newId = res.getIn(['groupIds', 0]);

      let expectedRes = initialState.merge({
        isAddPending: false,
        addError: '',
        groupIds: [newId],
        groups: {
          [newId]: {
            ...groupsState.groups["0"],
            id: newId
          }
        }
      });

      assert.isTrue(Immutable.is(expectedRes, res));
    });

    it(`SET_ACTIVE_GROUP reducer`, function () {
      let id = '0';
      let expectedRes = initialState.set('activeGroup', id);
      let res = groupsReducer(initialState, {
        type: 'SET_ACTIVE_GROUP',
        payload: id
      });
      assert.isTrue(Immutable.is(expectedRes, res));
    });

    it(`SET_ACTIVE_GROUP reducer with same value`, function () {
      let id = '0';
      let expectedRes = initialState.set('activeGroup', null);

      let stateWithActiveItem = groupsReducer(initialState, {
        type: 'SET_ACTIVE_GROUP',
        payload: id
      });
      let res = groupsReducer(stateWithActiveItem, {
        type: 'SET_ACTIVE_GROUP',
        payload: id
      });
      assert.isTrue(Immutable.is(expectedRes, res));
    });

    it(`CLEAR_ACTIVE_GROUP reducer`, function () {
      let expectedRes = initialState.set('activeGroup', null);

      let res = groupsReducer(initialState, {
        type: 'CLEAR_ACTIVE_GROUP'
      });
      assert.isTrue(Immutable.is(expectedRes, res));
    });

  });
});
