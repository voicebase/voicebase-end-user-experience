import React, { PropTypes } from 'react'
import {Modal, ModalBody, ModalFooter, Button, Tabs, Tab} from 'react-bootstrap'
import UploadPreview from './UploadPreview'

export default class UploadZone extends React.Component {
  static propTypes = {
    state: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired
  };

  closeModal() {
    this.props.actions.cancelUpload();
  }

  render () {
    let uploadState = this.props.state.upload;
    let playerState = this.props.state.media.player;

    return (
      <div>
        <Modal show={uploadState.view.showModalForm} onHide={this.closeModal.bind(this)} dialogClassName="upload-dialog">
          <ModalBody>
            <Tabs className="dialod-tabs">
              <Tab eventKey={1} title="Select files">
                <UploadPreview playerState={playerState}
                               uploadState={uploadState}
                               actions={this.props.actions}
                />
              </Tab>
              <Tab eventKey={2} title="Processing options">
                2 tab
              </Tab>
            </Tabs>
          </ModalBody>
          <ModalFooter>
            <Button onClick={this.closeModal.bind(this)}>Cancel</Button>
          </ModalFooter>
        </Modal>
      </div>
    )
  }
}
