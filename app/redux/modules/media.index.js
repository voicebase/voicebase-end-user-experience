import { combineReducers } from 'redux'
import mediaList from './media/mediaList';
import mediaData from './media/mediaData';

export default combineReducers({
  mediaList,
  mediaData
});
