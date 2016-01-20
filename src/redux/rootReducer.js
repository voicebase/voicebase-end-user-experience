import { combineReducers } from 'redux'
import { routeReducer as router } from 'redux-simple-router'
import { reducer as formReducer } from 'redux-form';
import auth from './modules/auth';
import media from './modules/media';

export default combineReducers({
  form: formReducer,
  router,
  auth,
  media
})
