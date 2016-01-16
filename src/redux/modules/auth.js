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
  token: ''
};

/*
 * Reducers
 * */
export default handleActions({
  'SIGN_IN_PENDING': (state, { payload }) => {
    return state;
  },

  'SIGN_IN_REJECTED': (state, { payload }) => {
    return state;
  },

  'SIGN_IN_FULFILLED': (state, { payload }) => {
    return state;
  }
}, initialState);
