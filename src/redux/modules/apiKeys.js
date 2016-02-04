import { createAction, handleActions } from 'redux-actions'
import ApiKeyApi from '../../api/apiKeyApi'

/*
 * Constants
 * */
export const CREATE_KEY = 'CREATE_KEY';

/*
 * Actions
 **/
export const createKey = createAction(CREATE_KEY, (token) => {
  return {
    promise: ApiKeyApi.createKey(token)
  }
});

export const actions = {
  createKey
};

/*
 * State
 * */
export const initialState = {
  apiKey: ''
};

/*
 * Reducers
 **/
export default handleActions({
  [`${CREATE_KEY}_FULFILLED`]: (state, { payload: response }) => {
    return {
      ...state,
      apiKey: response.apiKey
    };
  }
}, initialState);

