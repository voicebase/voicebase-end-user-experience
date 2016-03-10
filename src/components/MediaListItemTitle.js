import React, { PropTypes } from 'react'

export class MediaListItemTitle extends React.Component {
  static propTypes = {
    mediaId: PropTypes.string.isRequired,
    metadata: PropTypes.object.isRequired
  };

  render () {
    let title = this.props.mediaId;
    let metadata = this.props.metadata;
    if (metadata && metadata.external && metadata.external.id) {
      title = metadata.external.id;
    }
    if (metadata && metadata.title) {
      title = metadata.title;
    }

    return (
      <h4 className="list-group-item-heading">{title}</h4>
    )
  }
}

export default MediaListItemTitle
