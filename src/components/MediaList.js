import React, { PropTypes } from 'react'
import MediaListItem from './MediaListItem'
import ProcessingListItem from './upload/ProcessingListItem'

export class MediaList extends React.Component {
  static propTypes = {
    token: PropTypes.string.isRequired,
    state: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired
  };

  render () {
    let state = this.props.state;
    let mediaList = state.mediaList;

    return (
      <div className="list-group listings">
        {
          mediaList.processingIds.map(mediaId => {
            return (
              <ProcessingListItem key={'upload-progress-' + mediaId}
                                  token={this.props.token}
                                  mediaId={mediaId}
                                  mediaDataState={state.mediaData.data[mediaId]}
                                  actions={this.props.actions}
              />
            )
          })
        }

        {
          mediaList.mediaIds.map(mediaId => {
            return <MediaListItem key={mediaId}
                                  mediaId={mediaId}
                                  isExpanded={mediaId === mediaList.activeMediaId}
                                  token={this.props.token}
                                  mediaState={state}
                                  actions={this.props.actions} />
          })
        }
      </div>
    )
  }
}

export default MediaList
