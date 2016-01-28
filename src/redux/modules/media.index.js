import { combineReducers } from 'redux'
import mediaList from './media/mediaList';
import mediaData from './media/mediaData';
import player from './media/player';

export default combineReducers({
  mediaList,
  mediaData,
  player
});
