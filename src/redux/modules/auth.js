import { createAction, handleActions } from 'redux-actions'
//import * as _ from 'lodash';

import AuthApi from '../../api/authApi'

/*
 * Constants
 * */
export const SIGN_IN = 'SIGN_IN';

/*
 * Actions
 * */
export const signIn = createAction(SIGN_IN, (credentials) => {
  return {
    promise: AuthApi.signIn(credentials)
  }
});

export const actions = {
  signIn
};

/*
 * State
 * */
const initialState = {
  isLoggedIn: false,
  isPending: false,
  token: '',
  errorMessage: ''
};

/*
 * Reducers
 * */
export default handleActions({
  [`${SIGN_IN}_PENDING`]: (state, { payload }) => {
    return {
      ...state,
      isPending: true,
      errorMessage: '',
      isLoggedIn: false,
      token: ''
    };
  },

  [`${SIGN_IN}_REJECTED`]: (state, { payload: error }) => {
    return {
      ...state,
      isPending: false,
      errorMessage: error,
      isLoggedIn: false,
      token: ''
    };
  },

  [`${SIGN_IN}_FULFILLED`]: (state, { payload: response }) => {
    return {
      ...state,
      isPending: false,
      errorMessage: '',
      isLoggedIn: true,
      token: response.token
    };
  }
}, initialState);
