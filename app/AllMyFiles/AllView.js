import React from 'react'
import PropTypes from 'prop-types'
import connectWrapper from '../redux/utils/connect'
import {actions as authActions} from '../redux/modules/auth'
import NotificationSystem from 'react-notification-system'
import CounterLabel from '../components/CounterLabel'
import SearchForm from '../components/SearchForm'
import MediaListToolbar from '../components/MediaListToolbar'
import MediaList from '../components/MediaList'
import UploadProgress from '../components/upload/UploadProgress'
import Spinner from '../components/Spinner'
import ErrorList from '../components/error/ErrorList'

export class AllView extends React.Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired
  };

  static propTypes = {
    state: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired
  };

  componentDidUpdate() {
    const { state, actions } = this.props;

    let mediaList = state.media.mediaList;

    if (state.search.get('isSearching') && (mediaList.get('isGetCompleted') || mediaList.get('errorMessage'))) {
      actions.cancelSearch();
    }
    if (mediaList.get('errorMessage')) {
      let message = mediaList.get('errorMessage')
      if (typeof message !== 'string') {
        console.error('AllView: received non-string message', message)
        message = String(message)
      }
      this.refs.notificationSystem.addNotification({
        message,
        level: 'error'
      });
      actions.clearMediaListError();
    }
  }

  onSearch = () => {
    const { state, actions } = this.props;
    actions.startSearch();
    actions.getMedia(state.auth.token, {
      searchString: state.search.get('searchString')
    })
  };

  render () {
    const { state, actions } = this.props;
    let mediaList = state.media.mediaList;
    const errorState = state.error.toJS();
    return (
      <div>
        {mediaList.get('isGetPending') && !state.search.get('isSearching') && <Spinner />}
        {(!mediaList.get('isGetPending') || state.search.get('isSearching')) &&
          <div>
            <div className="content__heading">
              <h3>
                All My Files&nbsp;
                <CounterLabel value={mediaList.get('mediaIds').size} />
              </h3>
            </div>
            <SearchForm
              state={state.search}
              onSearch={this.onSearch}
              actions={actions}
            />
            <MediaListToolbar
              token={state.auth.token}
              selectedMediaIds={mediaList.get('selectedMediaIds').toJS()}
              actions={actions}
            />

            <UploadProgress
              uploadState={state.upload.toJS()}
            />

            <MediaList
              token={state.auth.token}
              state={state.media}
              searchString={state.search.get('searchString')}
              actions={actions}
            />
          </div>
        }
        <NotificationSystem ref="notificationSystem" />
        <ErrorList
          errorState={errorState}
          actions={actions}
        />
      </div>
    )
  }
}

export default connectWrapper(authActions, AllView)
