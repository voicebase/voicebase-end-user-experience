import React, { PropTypes } from 'react'
import { ListGroup } from 'react-bootstrap'
import UploadPreviewItem from './UploadPreviewItem';

export default class UploadPreview extends React.Component {
  static propTypes = {
    uploadState: PropTypes.object.isRequired,
    playerState: PropTypes.object,
    actions: PropTypes.object.isRequired
  };

  render () {
    let uploadState = this.props.uploadState;
    let playerState = this.props.playerState;

    return (
      <ListGroup className="preview-players-list">
        {uploadState.fileIds.map(fileId => {
          let file = uploadState.files[fileId];

          return (
            <UploadPreviewItem
              key={'preview' + fileId}
              file={file}
              fileId={fileId}
              playerState={playerState}
              actions={this.props.actions}
            />
          )
        })}
      </ListGroup>
    )
  }
}
