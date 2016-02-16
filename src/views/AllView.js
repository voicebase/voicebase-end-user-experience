import React, { PropTypes } from 'react'
import connectWrapper from '../redux/utils/connect'
import {actions as authActions} from '../redux/modules/auth'
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
    if (mediaList.isGetCompleted && mediaList.mediaIds.length === 0) {
      this.props.history.pushState(null, '/upload');
    }
  }

  render () {
    let state = this.props.state;
    let mediaList = state.media.mediaList;
    return (
      <div>
        {mediaList.isGetPending && <Spinner />}
        {
          !mediaList.isGetPending &&
          <div>
            <div className="content__heading">
              <h3>
                All My Files&nbsp;
                <CounterLabel value={mediaList.mediaIds.length}/>
              </h3>
            </div>
            <SearchForm state={state.search} actions={this.props.actions}/>
            <MediaListToolbar token={state.auth.token} selectedMediaIds={mediaList.selectedMediaIds}
                              actions={this.props.actions}/>

            <UploadProgressList uploadState={state.upload}
                                actions={this.props.actions}
            />

            <MediaList token={state.auth.token} state={state.media} actions={this.props.actions}/>
          </div>
        }
      </div>
    )
  }
}

export default connectWrapper(authActions, AllView)
