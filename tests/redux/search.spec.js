import {
  APPLY_DATE,
  CLEAR_DATE,
  SELECT_ORDER,
  SET_SEARCH_STRING,
  START_SEARCH,
  actions,
  initialState,
  default as searchReducer
} from '../../src/redux/modules/search'

import Immutable, { fromJS } from 'immutable'
import { checkActionTypes, checkCreatingAction } from '../../src/common/Test'

describe('(Redux Module) search.js', function () {

  let initialJsState = initialState.toJS();

  let dateObj = {
    dateFrom: "02/24/2016 0:00",
    dateTo: "02/24/2016 14:00"
  };

  describe('Constants', () => {
    const constants = {
      APPLY_DATE,
      CLEAR_DATE,
      SELECT_ORDER,
      SET_SEARCH_STRING,
      START_SEARCH
    };

    Object.keys(constants).forEach(key => {
      it(`Should export a constant ${key}`, function () {
        expect(constants[key]).to.equal(key)
      });
    });
  });

  describe('Actions', () => {

    describe('Apply date', () => {
      checkActionTypes(actions, 'applyDate', APPLY_DATE);
      checkCreatingAction(actions, 'applyDate', APPLY_DATE, [dateObj]);
    });

    describe('Clear date', () => {
      checkActionTypes(actions, 'clearDate', CLEAR_DATE);
      checkCreatingAction(actions, 'clearDate', CLEAR_DATE, []);
    });

    describe('Select Order', () => {
      checkActionTypes(actions, 'selectOrder', SELECT_ORDER);
      checkCreatingAction(actions, 'selectOrder', SELECT_ORDER, ['orderId']);
    });

    describe('Setting Search String', () => {
      checkActionTypes(actions, 'setSearchString', SET_SEARCH_STRING);
      checkCreatingAction(actions, 'setSearchString', SET_SEARCH_STRING, ['text']);
    });

    describe('Start Search', () => {
      checkActionTypes(actions, 'startSearch', START_SEARCH);
      checkCreatingAction(actions, 'startSearch', START_SEARCH, []);
    });

  });

  describe('Reducers', () => {

    it('APPLY_DATE reducer', function () {
      let expectedRes = fromJS({
        ...initialJsState,
        ...dateObj
      });

      let action = {
        type: "APPLY_DATE",
        payload: dateObj
      };
      let reducerRes = searchReducer(initialState, action);

      assert.isTrue(Immutable.is(expectedRes, reducerRes));
    });

    it('CLEAR_DATE reducer', function () {
      let action = {
        type: "CLEAR_DATE"
      };
      let state = initialState.merge(dateObj);
      let reducerRes = searchReducer(state, action);

      assert.isTrue(Immutable.is(initialState, reducerRes));
    });

    it('SELECT_ORDER reducer', function () {
      let expectedRes = fromJS({
        ...initialJsState,
        selectedOrderId: '1'
      });

      let action = {
        type: "SELECT_ORDER",
        payload: '1'
      };
      let reducerRes = searchReducer(initialState, action);

      assert.isTrue(Immutable.is(expectedRes, reducerRes));
    });

    it('SET_SEARCH_STRING reducer', function () {
      let expectedRes = fromJS({
        ...initialJsState,
        searchString: 'text'
      });

      let action = {
        type: "SET_SEARCH_STRING",
        payload: 'text'
      };
      let reducerRes = searchReducer(initialState, action);

      assert.isTrue(Immutable.is(expectedRes, reducerRes));
    });

  });

});
