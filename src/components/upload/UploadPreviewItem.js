import React, { PropTypes } from 'react'
import classnames from 'classnames'
import { ListGroupItem, Button } from 'react-bootstrap'
import { FilePlayer } from 'voicebase-player-v2';

export default class UploadPreviewItem extends React.Component {
  static propTypes = {
    file: PropTypes.object.isRequired,
    fileId: PropTypes.string.isRequired,
    actions: PropTypes.object.isRequired
  };

  onRemove = () => {
    const { fileId, actions } = this.props;
    actions.removeFile(fileId);
  };

  render () {
    const { file, fileId } = this.props;
    const itemClasses = classnames({
      'preview-player-item--video': file.type === 'video',
      'preview-player-item--audio': file.type === 'audio'
    });

    return (
      <ListGroupItem key={'preview' + fileId} className={itemClasses}>
        <h4>{file.file.name}</h4>
        <div className="preview-player-row">
          <div className="player-wrapper">
            <FilePlayer
              fileId={fileId}
              file={file}
            />
          </div>
          <Button bsStyle="danger" className="btn-delete" onClick={this.onRemove}>
            <i className="fa fa-fw fa-times" />
          </Button>
        </div>
      </ListGroupItem>
    )
  }
}
