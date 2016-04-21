import { createAction, handleActions } from 'redux-actions'

import authLockApi from '../../api/authLockApi'

/*
 * Constants
 * */
export const SIGN_IN = 'SIGN_IN';
export const SET_REMEMBER = 'SET_REMEMBER';
export const SIGN_OUT = 'SIGN_OUT';
export const CREATE_TOKEN = 'CREATE_TOKEN';
export const GET_API_KEYS = 'GET_API_KEYS';

/*
 * Actions
 * */
export const signIn = () => {
  return (dispatch) => dispatch({
    type: SIGN_IN,
    payload: {
      promise: authLockApi.signIn()
        .then(response => {
          if (response.profile.email_verified) {
            dispatch(createToken(response.token));
          }
          return response;
        })
    }
  })
};

export const createToken = createAction(CREATE_TOKEN, (auth0Token) => {
  return {
    promise: authLockApi.createToken(auth0Token)
  }
});

export const getApiKeys = createAction(GET_API_KEYS, (auth0Token) => {
  return {
    promise: authLockApi.getApiKeys(auth0Token)
  }
});

export const setRemember = createAction(SET_REMEMBER, (isRemember) => isRemember);

export const signOut = createAction(SIGN_OUT, {});

export const actions = {
  signIn,
  signOut,
  setRemember,
  createToken,
  getApiKeys
};

/*
 * State
 * */
export const initialState = {
  isRemember: false,
  isPending: false,
  tokenPending: false,
  errorMessage: '',
  auth0Token: '',
  token: '',
  profile: {},
  keys: {
    isPending: false,
    errorMessage: '',
    keys: []
  }
};

/*
 * Reducers
 * */
export default handleActions({
  [`${SIGN_IN}_PENDING`]: (state) => {
    return {
      ...state,
      isPending: true,
      errorMessage: '',
      auth0Token: '',
      token: ''
    };
  },

  [`${SIGN_IN}_REJECTED`]: (state, { payload: error }) => {
    return {
      ...state,
      isPending: false,
      errorMessage: error,
      auth0Token: '',
      token: ''
    };
  },

  [`${SIGN_IN}_FULFILLED`]: (state, { payload: response }) => {
    return {
      ...state,
      isPending: false,
      isRemember: true,
      errorMessage: '',
      auth0Token: response.token,
      token: '',
      profile: response.profile
    };
  },

  [`${CREATE_TOKEN}_PENDING`]: (state) => {
    return {
      ...state,
      tokenPending: true,
      token: ''
    };
  },

  [`${CREATE_TOKEN}_REJECTED`]: (state, { payload: error }) => {
    return {
      ...state,
      tokenPending: false,
      errorMessage: error,
      token: ''
    };
  },

  [`${CREATE_TOKEN}_FULFILLED`]: (state, { payload: response }) => {
    return {
      ...state,
      tokenPending: false,
      token: response.token
    };
  },

  [`${GET_API_KEYS}_PENDING`]: (state) => {
    return {
      ...state,
      keys: {
        ...state.keys,
        isPending: true,
        errorMessage: ''
      }
    };
  },

  [`${GET_API_KEYS}_REJECTED`]: (state, { payload: error }) => {
    return {
      ...state,
      keys: {
        ...state.keys,
        isPending: false,
        errorMessage: error
      }
    };
  },

  [`${GET_API_KEYS}_FULFILLED`]: (state, { payload: response }) => {
    return {
      ...state,
      keys: {
        ...state.keys,
        isPending: false,
        errorMessage: '',
        keys: response.keys
      }
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
