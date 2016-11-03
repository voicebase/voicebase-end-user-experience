import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import { reducer as formReducer } from 'redux-form';
import error from './modules/error';
import auth from './modules/auth';
import media from './modules/media.index';
import search from './modules/search';
import settings from './modules/settings';
import upload from './modules/upload';

export default combineReducers({
  form: formReducer,
  routing: routerReducer,
  auth,
  media,
  search,
  settings,
  upload,
  error
})
