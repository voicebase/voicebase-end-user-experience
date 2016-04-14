import { createAction, handleActions } from 'redux-actions'

import authLockApi from '../../api/authLockApi'

/*
 * Constants
 * */
export const SIGN_IN = 'SIGN_IN';
export const SET_REMEMBER = 'SET_REMEMBER';
export const SIGN_OUT = 'SIGN_OUT';
export const DOMAIN = 'voicebase.auth0.com';
export const API = '1eQFoL41viLp5qK90AMme5tc5TjEpUeE';
export const RETURN_TO = '1eQFoL41viLp5qK90AMme5tc5TjEpUeE';

/*
 * Actions
 * */
export const signIn = createAction(SIGN_IN, Auth0Lock => {
  return {
    promise: authLockApi.signIn(Auth0Lock, DOMAIN, API)
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
  errorMessage: '',
  emailVerified: false
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
      isRemember: true,
      errorMessage: '',
      token: response.token,
      email: response.profile.email,
      name: response.profile.nickname,
      userId: response.profile.user_id,
      picture: response.profile.picture,
      emailVerified: response.profile.email_verified
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
