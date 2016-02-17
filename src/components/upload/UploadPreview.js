import React, { PropTypes } from 'react'
import classnames from 'classnames'
import { ListGroup, ListGroupItem, Button } from 'react-bootstrap'
import Player from '../player/Player';

export default class UploadPreview extends React.Component {
  static propTypes = {
    uploadState: PropTypes.object.isRequired,
    playerState: PropTypes.object,
    actions: PropTypes.object.isRequired
  };

  componentWillMount() {
    let fileIds = this.props.uploadState.fileIds;
    if (fileIds.length > 0) {
      fileIds.forEach(id => {
        if (!this.props.playerState[id]) {
          let file = this.props.uploadState.files[id];
          this.props.actions.createPlayer(id, URL.createObjectURL(file.file), file.type);
        }
      });
    }
  }

  componentWillUnmount() {
    let fileIds = this.props.uploadState.fileIds;
    if (fileIds.length > 0) {
      fileIds.forEach(id => {
        this.props.actions.destroyPlayer(id);
      });
    }
  }

  removeFile(id) {
    this.props.actions.removeFile(id);
    this.props.actions.destroyPlayer(id);
  }

  render () {
    let uploadState = this.props.uploadState;
    let playerState = this.props.playerState;

    return (
      <ListGroup className="preview-players-list">
        {
          uploadState.fileIds.map(fileId => {
            let file = uploadState.files[fileId];
            let itemClasses = classnames({
              'preview-player-item--video': file.type === 'video',
              'preview-player-item--audio': file.type === 'audio'
            });

            return (
              <ListGroupItem key={'preview' + fileId} className={itemClasses}>
                <h4>{file.file.name}</h4>
                <div className="preview-player-row">
                  <div className="player-wrapper">
                    <Player mediaId={fileId}
                            playerType="FileInputPlayer"
                            playerState={playerState.players[fileId] || {loading: true}}
                            hasNextKeywordButton={false}
                            hasDownloadButton={false}
                            isShowKeywordsMarkers={false}
                            actions={this.props.actions}
                    />
                  </div>
                  {
                    playerState.players[fileId] &&
                    <Button bsStyle="danger" bsSize="small" className="btn-delete" onClick={this.removeFile.bind(this, fileId)}>
                      <i className="fa fa-fw fa-times"/>
                    </Button>
                  }
                </div>
              </ListGroupItem>
            )
          })
        }
      </ListGroup>
    )
  }
}
