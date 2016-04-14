import { combineReducers } from 'redux'
import { routeReducer as router } from 'redux-simple-router'
import { reducer as formReducer } from 'redux-form';
import auth from './modules/auth';
import media from './modules/media.index';
import search from './modules/search';
import settings from './modules/settings';
import upload from './modules/upload';

export default combineReducers({
  form: formReducer,
  router,
  auth,
  media,
  search,
  settings,
  upload
})
