import {
  GET_ITEMS,
  DELETE_ITEM,
  EDIT_ITEM,
  ADD_ITEM,
  TOGGLE_LIST,
  TOGGLE_CREATE_FORM,
  actions,
  itemInitialState,
  initialState,
  settings
} from '../../src/redux/modules/settings'

import { createAction } from 'redux-actions'
import configureMockStore from 'redux-mock-store';
import promiseMiddleware from 'redux-promise-middleware';
import thunk from 'redux-thunk';

import { checkActionTypes, checkIsFunction, checkCreatingAction, checkApiAction, checkAsyncAction } from '../../src/common/Test'

describe('(Redux Module) settings.js', function () {
  let types = ['predictions', 'detection', 'numbers'];

  describe('Constants', () => {
    const constants = {
      GET_ITEMS,
      DELETE_ITEM,
      EDIT_ITEM,
      ADD_ITEM,
      TOGGLE_LIST,
      TOGGLE_CREATE_FORM,
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

    describe('TOGGLE_LIST', () => {
      checkActionTypes(actions, 'toggleList', TOGGLE_LIST);

      it(`Should create an action to toggleList`, () => {
        let props = ['predictions', true];
        let expectedAction = createAction(TOGGLE_LIST, (type, value) => {return {type, value}});
        expect(actions.toggleList.apply(this, props)).to.deep.equal(expectedAction.apply(this, props))
      });
    });

  });

});
