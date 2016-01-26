import React, { PropTypes } from 'react'
import MediaListItem from './MediaListItem'

export class MediaList extends React.Component {
  static propTypes = {
    token: PropTypes.string.isRequired,
    state: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired
  };

  render () {
    let state = this.props.state;
    let mediaState = state.media;
    let activeMediaId = mediaState.activeMediaId;

    return (
      <div className="list-group listings">
        {
          mediaState.mediaIds.map(mediaId => {
            return <MediaListItem key={mediaId}
                                  mediaId={mediaId}
                                  isExpanded={mediaId === activeMediaId}
                                  token={this.props.token}
                                  mediaState={mediaState}
                                  playerState={state.player}
                                  actions={this.props.actions} />
          })

        }
      </div>
    )
  }
}

export default MediaList
