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

import { createAction, handleActions } from 'redux-actions'
import Immutable, { fromJS } from 'immutable'

describe('(Redux Module) search.js', function () {

  let initialJsState = initialState.toJS();

  let dateObj = {
    dateFrom: "02/24/2016 0:00",
    dateTo: "02/24/2016 14:00"
  };

  describe('Constants', () => {
    it('Should export a constant APPLY_DATE.', function () {
      expect(APPLY_DATE).to.equal('APPLY_DATE')
    });

    it('Should export a constant CLEAR_DATE.', function () {
      expect(CLEAR_DATE).to.equal('CLEAR_DATE')
    });

    it('Should export a constant SELECT_ORDER.', function () {
      expect(SELECT_ORDER).to.equal('SELECT_ORDER')
    });

    it('Should export a constant SET_SEARCH_STRING.', function () {
      expect(SET_SEARCH_STRING).to.equal('SET_SEARCH_STRING')
    });

    it('Should export a constant START_SEARCH.', function () {
      expect(START_SEARCH).to.equal('START_SEARCH')
    });
  });

  describe('Actions', () => {

    describe('Apply date', () => {
      it('Should be exported applyDate action as a function.', function () {
        expect(actions.applyDate).to.be.a('function')
      });

      it('Should return an action with type "APPLY_DATE".', function () {
        expect(actions.applyDate()).to.have.property('type', APPLY_DATE)
      });

      it('Should create an action to applyDate', () => {
        let expectedAction = createAction(APPLY_DATE, {});
        expect(actions.applyDate(dateObj)).to.deep.equal(expectedAction(dateObj))
      });
    });

    describe('Clear date', () => {
      it('Should be exported clearDate action as a function.', function () {
        expect(actions.clearDate).to.be.a('function')
      });

      it('Should return an action with type "CLEAR_DATE".', function () {
        expect(actions.clearDate()).to.have.property('type', CLEAR_DATE)
      });

      it('Should create an action to clearDate', () => {
        let expectedAction = createAction(CLEAR_DATE);
        expect(actions.clearDate()).to.deep.equal(expectedAction())
      });
    });

    describe('Select Order', () => {
      it('Should be exported selectOrder action as a function.', function () {
        expect(actions.selectOrder).to.be.a('function')
      });

      it('Should return an action with type "SELECT_ORDER".', function () {
        expect(actions.selectOrder()).to.have.property('type', SELECT_ORDER)
      });

      it('Should create an action to selectOrder', () => {
        let id = 'orderId';
        let expectedAction = createAction(SELECT_ORDER, {});
        expect(actions.selectOrder(id)).to.deep.equal(expectedAction(id))
      });
    });

    describe('Setting Search String', () => {
      it('Should be exported setSearchString action as a function.', function () {
        expect(actions.setSearchString).to.be.a('function')
      });

      it('Should return an action with type "SET_SEARCH_STRING".', function () {
        expect(actions.setSearchString()).to.have.property('type', SET_SEARCH_STRING)
      });

      it('Should create an action to setSearchString', () => {
        let text = 'text';
        let expectedAction = createAction(SET_SEARCH_STRING, {});
        expect(actions.setSearchString(text)).to.deep.equal(expectedAction(text))
      });
    });

    describe('Start Search', () => {
      it('Should be exported startSearch action as a function.', function () {
        expect(actions.startSearch).to.be.a('function')
      });

      it('Should return an action with type "START_SEARCH".', function () {
        expect(actions.startSearch()).to.have.property('type', START_SEARCH)
      });

      it('Should create an action to startSearch', () => {
        let expectedAction = createAction(START_SEARCH);
        expect(actions.startSearch()).to.deep.equal(expectedAction())
      });
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
