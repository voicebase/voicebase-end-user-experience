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

export class AllView extends React.Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    state: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired
  };

  componentWillMount(nextProps) {
    let mediaList = this.props.state.media.mediaList;
    if (mediaList.get('isGetCompleted') && mediaList.get('mediaIds').size === 0) {
      this.props.history.pushState(null, '/upload');
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

  onSearch() {
    let state = this.props.state;
    this.props.actions.startSearch();
    this.props.actions.getMedia(state.auth.token, {
      dateFrom: state.search.get('dateFrom'),
      dateTo: state.search.get('dateTo'),
      searchString: state.search.get('searchString')
    })
  }

  render () {
    let state = this.props.state;
    let mediaList = state.media.mediaList;
    return (
      <div>
        {mediaList.get('isGetPending') && !state.search.get('isSearching') && <Spinner />}
        {
          (!mediaList.get('isGetPending') || state.search.get('isSearching')) &&
          <div>
            <div className="content__heading">
              <h3>
                All My Files&nbsp;
                <CounterLabel value={mediaList.get('mediaIds').size}/>
              </h3>
            </div>
            <SearchForm state={state.search}
                        onSearch={this.onSearch.bind(this)}
                        actions={this.props.actions}
            />
            <MediaListToolbar token={state.auth.token}
                              selectedMediaIds={mediaList.get('selectedMediaIds').toJS()}
                              actions={this.props.actions}
            />

            <UploadProgressList uploadState={state.upload.toJS()}
                                actions={this.props.actions}
            />

            <MediaList token={state.auth.token} state={state.media} actions={this.props.actions}/>
          </div>
        }
        <NotificationSystem ref="notificationSystem" />
      </div>
    )
  }
}

export default connectWrapper(authActions, AllView)
