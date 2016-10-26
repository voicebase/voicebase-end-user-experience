import {
  GET_ITEMS,
  DELETE_ITEM,
  EDIT_ITEM,
  ADD_ITEM,
  TOGGLE_CREATE_FORM,
  SET_ACTIVE_ITEM,
  CLEAR_ACTIVE_ITEM,
  actions,
  itemInitialState,
  initialState,
  settings
} from '../../app/redux/modules/settings'

import { createAction } from 'redux-actions'
import configureMockStore from 'redux-mock-store';
import promiseMiddleware from 'redux-promise-middleware';
import thunk from 'redux-thunk';

import { checkActionTypes, checkIsFunction, checkCreatingAction, checkApiAction, checkAsyncAction } from '../../app/common/Test'
import Immutable, { fromJS } from 'immutable'

describe('(Redux Module) settings.js', function () {
  let types = ['predictions', 'detection', 'numbers'];

  describe('Constants', () => {
    const constants = {
      GET_ITEMS,
      DELETE_ITEM,
      EDIT_ITEM,
      ADD_ITEM,
      TOGGLE_CREATE_FORM,
      SET_ACTIVE_ITEM,
      CLEAR_ACTIVE_ITEM
    };
    Object.keys(constants).forEach(key => {
      it(`Should export a constant ${key}`, function () {
        expect(constants[key]).to.equal(key)
      });
    });
  });

  describe('Actions', () => {

    describe('GET_ITEMS', () => {
      checkIsFunction(actions, 'getItems');

      it('check GET_ITEMS_FULFILLED for predictions type', (done) => {
        checkApiAction(actions, 'getItems', GET_ITEMS, ['token', 'predictions'], false, done);
      });

      it('check GET_ITEMS_REJECTED for predictions type', (done) => {
        checkApiAction(actions, 'getItems', GET_ITEMS, ['token', 'predictions'], true, done);
      });

      it('check GET_ITEMS_FULFILLED for detection type', (done) => {
        checkAsyncAction(actions, 'getItems', GET_ITEMS, ['token', 'detection'], done);
      });

      it('check GET_ITEMS_FULFILLED for numbers type', (done) => {
        checkAsyncAction(actions, 'getItems', GET_ITEMS, ['token', 'numbers'], done);
      });

    });

    describe('DELETE_ITEM', () => {
      checkIsFunction(actions, 'deleteItem');

      types.forEach(type => {
        it(`check DELETE_ITEM for ${type} type`, (done) => {
          checkAsyncAction(actions, 'deleteItem', DELETE_ITEM, ['token', type, '0'], done);
        });
      });

    });

    describe('EDIT_ITEM', () => {
      checkIsFunction(actions, 'editItem');

      types.forEach(type => {
        it(`check EDIT_ITEM for ${type} type`, (done) => {
          checkAsyncAction(actions, 'editItem', EDIT_ITEM, ['token', type, '0', {}], done);
        });
      });

    });

    describe('ADD_ITEM', () => {
      checkIsFunction(actions, 'addItem');

      types.forEach(type => {
        it(`check ADD_ITEM for ${type} type`, (done) => {
          checkAsyncAction(actions, 'addItem', ADD_ITEM, ['token', type, {}], done);
        });
      });

    });

    describe('TOGGLE_CREATE_FORM', () => {
      checkActionTypes(actions, 'toggleCreateForm', TOGGLE_CREATE_FORM);

      it(`Should create an action to toggleList`, () => {
        let props = ['predictions', true];
        let expectedAction = createAction(TOGGLE_CREATE_FORM, (type, value) => {return {type, value}});
        expect(actions.toggleCreateForm.apply(this, props)).to.deep.equal(expectedAction.apply(this, props))
      });
    });

    describe('setActiveItem', () => {
      checkActionTypes(actions, 'setActiveItem', SET_ACTIVE_ITEM);

      it(`Should create an action to setActiveItem`, () => {
        let props = ['predictions', '0'];
        let expectedAction = createAction(TOGGLE_CREATE_FORM, (type, value) => {return {type, value}});
        expect(actions.toggleCreateForm.apply(this, props)).to.deep.equal(expectedAction.apply(this, props))
      });
    });

    describe('clearActiveItem', () => {
      checkActionTypes(actions, 'clearActiveItem', CLEAR_ACTIVE_ITEM);
      checkCreatingAction(actions, 'clearActiveItem', CLEAR_ACTIVE_ITEM, ['predictions']);
    });

  });

  describe('Reducers', () => {
    let initialJsState = initialState.toJS();

    let itemsData = [{
      name: 'first'
    }, {
      name: 'phone'
    }];

    let dataState = {
        "itemIds": ["0", "1"],
        "items": {
          "0": {"name": "first", "id": "0"},
          "1": {"name": "phone", "id": "1"}
        }
    };

    describe(GET_ITEMS + '_PENDING reducer', function () {
      types.forEach(type => {
        it(`${GET_ITEMS}_PENDING reducer for ${type} type`, function () {
          let expectedRes = initialState
            .mergeIn([type], {
              isGetPending: true,
              errorMessage: ''
            });

          let res = settings(initialState, {
            type: GET_ITEMS + '_PENDING',
            payload: {type}
          });

          assert.isTrue(Immutable.is(expectedRes, res));
        });
      });

    });

    describe(GET_ITEMS + '_REJECTED reducer', function () {
      types.forEach(type => {
        it(`${GET_ITEMS}_REJECTED reducer for ${type} type`, function () {
          let expectedRes = initialState
            .mergeIn([type], {
              isGetPending: false,
              errorMessage: 'error'
            });

          let res = settings(initialState, {
            type: GET_ITEMS + '_REJECTED',
            payload: {type, error: 'error'}
          });

          assert.isTrue(Immutable.is(expectedRes, res));
        });
      });

    });

    describe(GET_ITEMS + '_FULFILLED reducer', function () {
      types.forEach(type => {
        it(`${GET_ITEMS}_FULFILLED reducer for ${type} type`, function () {
          let expectedRes = initialState
            .mergeIn([type], {
              itemIds: dataState.itemIds,
              items: dataState.items,
              isGetPending: false,
              errorMessage: ''
            });

          let res = settings(initialState, {
            type: GET_ITEMS + '_FULFILLED',
            payload: {type, data: itemsData}
          });

          assert.isTrue(Immutable.is(expectedRes, res));
        });
      });

    });

    describe(DELETE_ITEM + '_PENDING reducer', function () {
      types.forEach(type => {
        it(`${DELETE_ITEM}_PENDING reducer for ${type} type`, function () {
          let expectedRes = initialState
            .mergeIn([type], {
              itemIds: dataState.itemIds,
              items: dataState.items
            })
            .setIn([type, 'items', '0', 'isDeletePending'], true);

          let getRes = settings(initialState, {
            type: GET_ITEMS + '_FULFILLED',
            payload: {type, data: itemsData}
          });

          let res = settings(getRes, {
            type: DELETE_ITEM + '_PENDING',
            payload: {type, id: '0'}
          });

          assert.isTrue(Immutable.is(expectedRes, res));
        });
      });

    });

    describe(DELETE_ITEM + '_REJECTED reducer', function () {
      types.forEach(type => {
        it(`${DELETE_ITEM}_REJECTED reducer for ${type} type`, function () {
          let expectedRes = initialState
            .mergeIn([type], {
              itemIds: dataState.itemIds,
              items: dataState.items
            })
            .mergeIn([type, 'items', '0'], {
              isDeletePending: false,
              deleteError: 'error'
            });

          let getRes = settings(initialState, {
            type: GET_ITEMS + '_FULFILLED',
            payload: {type, data: itemsData}
          });

          let res = settings(getRes, {
            type: DELETE_ITEM + '_REJECTED',
            payload: {type, id: '0', error: 'error'}
          });

          assert.isTrue(Immutable.is(expectedRes, res));
        });
      });

    });

    describe(DELETE_ITEM + '_FULFILLED reducer', function () {
      types.forEach(type => {
        it(`${DELETE_ITEM}_FULFILLED reducer for ${type} type`, function () {
          let expectedRes = initialState
            .mergeIn([type], {
              itemIds: ['1'],
              items: dataState.items
            })
            .deleteIn([type, 'items', '0']);

          let getRes = settings(initialState, {
            type: GET_ITEMS + '_FULFILLED',
            payload: {type, data: itemsData}
          });

          let res = settings(getRes, {
            type: DELETE_ITEM + '_FULFILLED',
            payload: {type, id: '0'}
          });

          assert.isTrue(Immutable.is(expectedRes, res));
        });
      });

    });

    describe(EDIT_ITEM + '_PENDING reducer', function () {
      types.forEach(type => {
        it(`${EDIT_ITEM}_PENDING reducer for ${type} type`, function () {
          let expectedRes = initialState
            .mergeIn([type], {
              itemIds: dataState.itemIds,
              items: dataState.items
            })
            .mergeIn([type, 'items', '0'], {
              isEditPending: true,
              editError: ''
            });

          let getRes = settings(initialState, {
            type: GET_ITEMS + '_FULFILLED',
            payload: {type, data: itemsData}
          });

          let res = settings(getRes, {
            type: EDIT_ITEM + '_PENDING',
            payload: {type, id: '0'}
          });

          assert.isTrue(Immutable.is(expectedRes, res));
        });
      });

    });

    describe(EDIT_ITEM + '_REJECTED reducer', function () {
      types.forEach(type => {
        it(`${EDIT_ITEM}_REJECTED reducer for ${type} type`, function () {
          let expectedRes = initialState
            .mergeIn([type], {
              itemIds: dataState.itemIds,
              items: dataState.items
            })
            .mergeIn([type, 'items', '0'], {
              isEditPending: false,
              editError: 'error'
            });

          let getRes = settings(initialState, {
            type: GET_ITEMS + '_FULFILLED',
            payload: {type, data: itemsData}
          });

          let res = settings(getRes, {
            type: EDIT_ITEM + '_REJECTED',
            payload: {type, id: '0', error: 'error'}
          });

          assert.isTrue(Immutable.is(expectedRes, res));
        });
      });

    });

    describe(EDIT_ITEM + '_FULFILLED reducer', function () {
      types.forEach(type => {
        it(`${EDIT_ITEM}_FULFILLED reducer for ${type} type`, function () {
          let expectedRes = initialState
            .mergeIn([type], {
              itemIds: dataState.itemIds,
              items: dataState.items
            })
            .mergeIn([type, 'items', '0'], {
              isDefault: true,
              isEditPending: false,
              editError: ''
            });

          let getRes = settings(initialState, {
            type: GET_ITEMS + '_FULFILLED',
            payload: {type, data: itemsData}
          });

          let newItem = getRes.getIn([type, 'items', '0']).merge({
            isDefault: true
          }).toJS();

          let res = settings(getRes, {
            type: EDIT_ITEM + '_FULFILLED',
            payload: {type, id: '0', data: newItem}
          });

          assert.isTrue(Immutable.is(expectedRes, res));
        });
      });

    });

    describe(ADD_ITEM + '_PENDING reducer', function () {
      types.forEach(type => {
        it(`${ADD_ITEM}_PENDING reducer for ${type} type`, function () {
          let expectedRes = initialState.setIn([type, 'isAddPending'], true);

          let res = settings(initialState, {
            type: ADD_ITEM + '_PENDING',
            payload: {type}
          });

          assert.isTrue(Immutable.is(expectedRes, res));
        });
      });

    });

    describe(ADD_ITEM + '_REJECTED reducer', function () {
      types.forEach(type => {
        it(`${ADD_ITEM}_REJECTED reducer for ${type} type`, function () {
          let expectedRes = initialState.mergeIn([type], {
            isAddPending: false,
            addError: 'error'
          });

          let res = settings(initialState, {
            type: ADD_ITEM + '_REJECTED',
            payload: {type, error: 'error'}
          });

          assert.isTrue(Immutable.is(expectedRes, res));
        });
      });
    });

    describe(ADD_ITEM + '_FULFILLED reducer', function () {
      types.forEach(type => {
        it(`${ADD_ITEM}_FULFILLED reducer for ${type} type`, function () {
          let res = settings(initialState, {
            type: ADD_ITEM + '_FULFILLED',
            payload: {type, data: dataState.items[0]}
          });
          let newId = res.getIn([type, 'itemIds', 0]);

          let expectedRes = initialState.mergeIn([type], {
            isAddPending: false,
            addError: '',
            itemIds: [newId],
            items: {[newId]: {
              ...dataState.items[0],
              id: newId.toString()
            }}
          });

          assert.isTrue(Immutable.is(expectedRes, res));
        });
      });
    });

    describe(TOGGLE_CREATE_FORM + ' reducer', function () {
      types.forEach(type => {
        it(`TOGGLE_CREATE_FORM reducer for ${type} type`, function () {
          let expectedRes = initialState.mergeIn([type, 'view'], {
            isExpandCreateForm: false
          });
          let res = settings(initialState, {
            type: 'TOGGLE_CREATE_FORM',
            payload: {type, value: false}
          });
          assert.isTrue(Immutable.is(expectedRes, res));
        });

        it(`TOGGLE_CREATE_FORM reducer for ${type} type without value`, function () {
          let expectedRes = initialState.mergeIn([type, 'view'], {
            isExpandCreateForm: true
          });
          let res = settings(initialState, {
            type: 'TOGGLE_CREATE_FORM',
            payload: {type}
          });
          assert.isTrue(Immutable.is(expectedRes, res));
        });
      });
    });

    describe(SET_ACTIVE_ITEM + ' reducer', function () {
      types.forEach(type => {
        it(`SET_ACTIVE_ITEM reducer for ${type} type`, function () {
          let id = '0';
          let expectedRes = initialState.setIn([type, 'activeItem'], id);
          let res = settings(initialState, {
            type: 'SET_ACTIVE_ITEM',
            payload: {type, itemId: id}
          });
          assert.isTrue(Immutable.is(expectedRes, res));
        });

        it(`SET_ACTIVE_ITEM reducer for ${type} type with same value`, function () {
          let id = '0';
          let expectedRes = initialState.setIn([type, 'activeItem'], null);

          let stateWithActiveItem = settings(initialState, {
            type: 'SET_ACTIVE_ITEM',
            payload: {type, itemId: id}
          });
          let res = settings(stateWithActiveItem, {
            type: 'SET_ACTIVE_ITEM',
            payload: {type, itemId: id}
          });
          assert.isTrue(Immutable.is(expectedRes, res));
        });
      });
    });

    describe(CLEAR_ACTIVE_ITEM + ' reducer', function () {
      types.forEach(type => {
        it(`CLEAR_ACTIVE_ITEM reducer for ${type} type`, function () {
          let expectedRes = initialState.setIn([type, 'activeItem'], null);

          let res = settings(initialState, {
            type: 'CLEAR_ACTIVE_ITEM',
            payload: type
          });
          assert.isTrue(Immutable.is(expectedRes, res));
        });
      });
    });

  });

});
