import React, { PropTypes } from 'react'
import { ListGroup } from 'react-bootstrap'
import UploadPreviewItem from './UploadPreviewItem';

export default class UploadPreview extends React.Component {
  static propTypes = {
    uploadState: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired
  };

  render () {
    let uploadState = this.props.uploadState;

    return (
      <ListGroup className="preview-players-list">
        {uploadState.fileIds.map(fileId => {
          let file = uploadState.files[fileId];
          if (file.isPostPending) return null;

          return (
            <UploadPreviewItem
              key={'preview' + fileId}
              file={file}
              fileId={fileId}
              actions={this.props.actions}
            />
          )
        })}
      </ListGroup>
    )
  }
}
