import React, { PropTypes } from 'react'
import MediaListItem from './MediaListItem'

export class MediaList extends React.Component {
  static propTypes = {
    state: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired
  };

  render () {
    let activeMediaId = this.props.state.activeMediaId;
    return (
      <div className="list-group listings">
        {
          this.props.state.mediaIds.map(mediaId => {
            return <MediaListItem key={mediaId}
                                  mediaId={mediaId}
                                  isExpanded={mediaId === activeMediaId}
                                  state={this.props.state}
                                  actions={this.props.actions} />
          })

        }
      </div>
    )
  }
}

export default MediaList
