import {
  SIGN_IN,
  SET_REMEMBER,
  SIGN_OUT,
  actions,
  initialState,
  default as authReducer
} from '../../app/redux/modules/auth'

import { checkActionTypes, checkIsFunction, checkCreatingAction, checkApiAction, checkAsyncAction } from '../../app/common/Test'

describe('(Redux Module) auth.js', function () {
  describe('Constants', () => {
    const constants = {
      SIGN_IN,
      SET_REMEMBER,
      SIGN_OUT
    };
    Object.keys(constants).forEach(key => {
      it(`Should export a constant ${key}`, function () {
        expect(constants[key]).to.equal(key)
      });
    });
  });

  describe('Actions', () => {
    describe('SIGN_IN', () => {
      checkIsFunction(actions, 'signIn');

      it('check SIGN_IN_FULFILLED', (done) => {
        checkApiAction(actions, 'signIn', SIGN_IN, [{}], false, done);
      });

      it('check SIGN_IN_REJECTED', (done) => {
        checkApiAction(actions, 'signIn', SIGN_IN, [{}], true, done);
      });

    });

    describe('SET_REMEMBER', () => {
      checkActionTypes(actions, 'setRemember', SET_REMEMBER);
      checkCreatingAction(actions, 'setRemember', SET_REMEMBER, [true]);
    });

    describe('SIGN_OUT', () => {
      checkActionTypes(actions, 'signOut', SIGN_OUT);
      checkCreatingAction(actions, 'signOut', SIGN_OUT, []);
    });
  });

  describe('Reducers', () => {
    it(`${SIGN_IN}_PENDING reducer `, function () {
      let expectedRes = {
        ...initialState,
        isPending: true,
        errorMessage: '',
        token: ''
      };

      let res = authReducer(initialState, {
        type: SIGN_IN + '_PENDING'
      });

      expect(res).to.eql(expectedRes);
    });

    it(`${SIGN_IN}_REJECTED reducer `, function () {
      let expectedRes = {
        ...initialState,
        isPending: false,
        errorMessage: 'error',
        token: ''
      };

      let res = authReducer(initialState, {
        type: SIGN_IN + '_REJECTED',
        payload: 'error'
      });

      expect(res).to.eql(expectedRes);
    });

    it(`${SIGN_IN}_FULFILLED reducer `, function () {
      let expectedRes = {
        ...initialState,
        isPending: false,
        errorMessage: '',
        token: 'token'
      };

      let res = authReducer(initialState, {
        type: SIGN_IN + '_FULFILLED',
        payload: {token: 'token'}
      });

      expect(res).to.eql(expectedRes);
    });

    it(`${SET_REMEMBER} reducer with isRemember === false `, function () {
      let expectedRes = {
        ...initialState,
        isRemember: false
      };

      let res = authReducer(initialState, {
        type: SET_REMEMBER,
        payload: false
      });

      expect(res).to.eql(expectedRes);
    });

    it(`${SET_REMEMBER} reducer with isRemember === true `, function () {
      let expectedRes = {
        ...initialState,
        isRemember: true
      };

      let res = authReducer(initialState, {
        type: SET_REMEMBER,
        payload: true
      });

      expect(res).to.eql(expectedRes);
    });

    it(`${SIGN_OUT} reducer with isRemember === false `, function () {
      let state = {
        ...initialState,
        isRemember: false
      };

      let expectedRes = {...state};

      let res = authReducer(state, {
        type: SIGN_OUT
      });

      expect(res).to.eql(expectedRes);
    });

    it(`${SIGN_OUT} reducer with isRemember === true `, function () {
      let state = {
        ...initialState,
        isRemember: true
      };

      let expectedRes = {...state};

      let res = authReducer(state, {
        type: SIGN_OUT
      });

      expect(res).to.eql(expectedRes);
    });

  });
});
