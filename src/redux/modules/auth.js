import { createAction, handleActions } from 'redux-actions'
import authLockApi from '../../api/authLockApi'

/*
 * Constants
 * */
export const SIGN_IN = 'SIGN_IN';
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

//export const signOut = createAction(SIGN_OUT);

export const signOut = createAction(SIGN_OUT, Auth0Lock => {
  return {
    promise: authLockApi.signOut(DOMAIN, RETURN_TO)
  }
});

export const actions = {
  signOut,
  signIn
};

/*
 * State
 * */
export const initialState = {
  isRemember: false,
  isPending: false
};

/*
 * Reducers
 **/
export default handleActions({
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
      picture: response.profile.picture
    };
  },
  [`${SIGN_OUT}_PENDING`]: (state, { payload: response }) => {
    return {
      ...state,
      isPending: true,
      isRemember: false,
      errorMessage: '',
      token: '',
      email: '',
      name: '',
      userId: '',
      picture: ''
    };
  },
  [`${SIGN_OUT}_FULFILLED`]: (state, { payload: response }) => {
    return {
      ...state,
      isPending: false,
      isRemember: false
    };
  },
  [`${SIGN_OUT}_REJECTED`]: (state, { payload: response }) => {
    return {
      ...state,
      isPending: false,
      isRemember: false,
      errorMessage: response.error
    };
  }
}, initialState);
