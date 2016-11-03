import React, { PropTypes } from 'react'
import connectWrapper from '../redux/utils/connect'
import {actions as authActions} from '../redux/modules/auth'
import NotificationSystem from 'react-notification-system'
import CounterLabel from '../components/CounterLabel'
import SearchForm from '../components/SearchForm'
import MediaListToolbar from '../components/MediaListToolbar'
import MediaList from '../components/MediaList'
import UploadProgressList from '../components/upload/UploadProgressList'
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

  componentWillMount(nextProps) {
    let mediaList = this.props.state.media.mediaList;
    if (mediaList.get('isGetCompleted') && mediaList.get('mediaIds').size === 0) {
      this.context.router.push('/upload');
    }
  }

  componentDidUpdate() {
    let state = this.props.state;
    let mediaList = state.media.mediaList;
    if (state.search.get('isSearching') && (mediaList.get('isGetCompleted') || mediaList.get('errorMessage'))) {
      this.props.actions.cancelSearch();
    }
    if (mediaList.get('errorMessage')) {
      this.refs.notificationSystem.addNotification({
        message: mediaList.get('errorMessage'),
        level: 'error'
      });
      this.props.actions.clearMediaListError();
    }
  }

  onSearch = () => {
    let state = this.props.state;
    this.props.actions.startSearch();
    this.props.actions.getMedia(state.auth.token, {
      searchString: state.search.get('searchString')
    })
  };

  render () {
    let state = this.props.state;
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
              actions={this.props.actions}
            />
            <MediaListToolbar
              token={state.auth.token}
              selectedMediaIds={mediaList.get('selectedMediaIds').toJS()}
              actions={this.props.actions}
            />

            <UploadProgressList
              uploadState={state.upload.toJS()}
              actions={this.props.actions}
            />

            <MediaList
              token={state.auth.token}
              state={state.media}
              searchString={state.search.get('searchString')}
              actions={this.props.actions}
            />
          </div>
        }
        <NotificationSystem ref="notificationSystem" />
        <ErrorList
          errorState={errorState}
          actions={this.props.actions}
        />
      </div>
    )
  }
}

export default connectWrapper(authActions, AllView)
