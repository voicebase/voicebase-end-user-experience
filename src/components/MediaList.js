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
    let mediaList = state.mediaList;

    return (
      <div className="list-group listings">
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
