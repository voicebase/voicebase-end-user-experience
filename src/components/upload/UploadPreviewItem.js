import React, { PropTypes } from 'react'
import classnames from 'classnames'
import { ListGroupItem, Button } from 'react-bootstrap'
import Player from '../player/Player';

export default class UploadPreviewItem extends React.Component {
  static propTypes = {
    file: PropTypes.object.isRequired,
    fileId: PropTypes.string.isRequired,
    playerState: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired
  };

  onRemove = () => {
    const { fileId, actions } = this.props;
    actions.removeFile(fileId);
    actions.destroyPlayer(fileId);
  };

  render () {
    const { file, fileId, playerState, actions } = this.props;
    const itemClasses = classnames({
      'preview-player-item--video': file.type === 'video',
      'preview-player-item--audio': file.type === 'audio'
    });

    return (
      <ListGroupItem key={'preview' + fileId} className={itemClasses}>
        <h4>{file.file.name}</h4>
        <div className="preview-player-row">
          <div className="player-wrapper">
            <Player
              mediaId={fileId}
              playerType="FileInputPlayer"
              playerState={playerState.players[fileId] || {loading: true}}
              hasNextKeywordButton={false}
              hasDownloadButton={false}
              isShowKeywordsMarkers={false}
              actions={actions}
            />
          </div>
          {playerState.players[fileId] &&
            <Button bsStyle="danger" className="btn-delete" onClick={this.onRemove}>
              <i className="fa fa-fw fa-times" />
            </Button>
          }
        </div>
      </ListGroupItem>
    )
  }
}
