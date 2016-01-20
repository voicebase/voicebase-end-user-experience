import { createAction, handleActions } from 'redux-actions'

import AuthApi from '../../api/authApi'

/*
 * Constants
 * */
export const SIGN_IN = 'SIGN_IN';
export const SET_REMEMBER = 'SET_REMEMBER';
export const SIGN_OUT = 'SIGN_OUT';

/*
 * Actions
 * */
export const signIn = createAction(SIGN_IN, (credentials) => {
  return {
    promise: AuthApi.signIn(credentials)
  }
});

export const setRemember = createAction(SET_REMEMBER, (isRemember) => isRemember);

export const signOut = createAction(SIGN_OUT, {});

export const actions = {
  signIn,
  signOut,
  setRemember
};

/*
 * State
 * */
export const initialState = {
  isRemember: false,
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
      token: ''
    };
  },

  [`${SIGN_IN}_REJECTED`]: (state, { payload: error }) => {
    return {
      ...state,
      isPending: false,
      errorMessage: error,
      token: ''
    };
  },

  [`${SIGN_IN}_FULFILLED`]: (state, { payload: response }) => {
    return {
      ...state,
      isPending: false,
      errorMessage: '',
      token: response.token
    };
  },

  [SET_REMEMBER]: (state, { payload: isRemember }) => {
    return {
      ...state,
      isRemember: isRemember
    };
  },

  [SIGN_OUT]: (state) => {
    return {
      ...initialState,
      isRemember: state.isRemember
    };
  }
}, initialState);
