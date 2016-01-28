import {actions as authActions} from '../redux/modules/auth'
import {actions as searchActions} from '../redux/modules/search'
import {actions as mediaActions} from '../redux/modules/media/mediaList'
import {actions as mediaDataActions} from '../redux/modules/media/mediaData'
import {actions as playerActions} from '../redux/modules/media/player'

export default Object.assign(
  authActions,
  searchActions,
  mediaActions,
  mediaDataActions,
  playerActions
)
