import { createAction } from 'redux-actions'
import ApiKeyApi from '../../api/apiKeyApi'

/*
 * Constants
 * */
export const CREATE_KEY = 'CREATE_KEY';

/*
 * Actions
 * */
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
  isRemember: false,
  isPending: false,
  token: '',
  errorMessage: ''
};
