import {actions as authActions} from '../redux/modules/auth'
import {actions as searchActions} from '../redux/modules/search'
import {actions as mediaActions} from '../redux/modules/media/mediaList'
import {actions as mediaDataActions} from '../redux/modules/media/mediaData'
import {actions as groupsActions} from '../redux/modules/groups'
import {actions as settingsActions} from '../redux/modules/settings'
import {actions as uploadActions} from '../redux/modules/upload'

export default Object.assign(
  authActions,
  searchActions,
  mediaActions,
  mediaDataActions,
  groupsActions,
  settingsActions,
  uploadActions
)
