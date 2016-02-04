import { createAction, handleActions } from 'redux-actions'
import authLockApi from '../../api/authLockApi'

/*
 * Constants
 * */
export const SHOW_LOCK = 'SHOW_LOCK';
export const API = '1eQFoL41viLp5qK90AMme5tc5TjEpUeE';
export const DOMAIN = 'voicebase.auth0.com';

/*
 * Actions
 * */
export const showLock = createAction(SHOW_LOCK, Auth0Lock => {
  return {
    promise: authLockApi.showLock(Auth0Lock, API, DOMAIN)
  }
});

export const actions = {
  showLock
};

/*
 * State
 * */
export const initialState = {
  isRemember: false,
  isPending: false,
  lock: '',
  token: '',
  profile: ''
};

/*
 * Reducers
 **/
export default handleActions({
  [`${SHOW_LOCK}_FULFILLED`]: (state, { payload: response }) => {
    return {
      ...state,
      isPending: false,
      errorMessage: '',
      lock: response.lock,
      token: response.token,
      profile: response.profile
    };
  }
}, initialState);
