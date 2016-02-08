import React, { PropTypes } from 'react'
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
          let file = this.props.uploadState.files[id].file;
          this.props.actions.createPlayer(id, URL.createObjectURL(file));
        }
      });
    }
  }

  componentWillUnmount() {
    this.props.uploadState.fileIds.forEach(id => {
      this.removeFile(id);
    });
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
            let file = uploadState.files[fileId].file;
            return (
              <ListGroupItem key={'preview' + fileId}>
                <h4>{file.name}</h4>
                <div className="preview-player-row">
                  <div className="player-wrapper">
                    <Player mediaId={fileId}
                            playerType="FileInputPlayer"
                            playerState={playerState.players[fileId] || {loading: true}}
                            hasNextKeywordButton={false}
                            hasDownloadButton={false}
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

/*
*/
