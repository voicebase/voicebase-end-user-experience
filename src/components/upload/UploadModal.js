import React, { PropTypes } from 'react'
import {Modal, ModalBody, ModalFooter, Button, Tabs, Tab} from 'react-bootstrap'
import {OPTIONS_TAB, FILES_PREVIEW_TAB} from '../../redux/modules/upload'
import UploadPreview from './UploadPreview'
import UploadOptions from './UploadOptions'

export default class UploadZone extends React.Component {
  static propTypes = {
    state: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired
  };

  closeModal() {
    this.props.actions.cancelUpload();
  }

  handleSelectTab(key) {
    this.props.actions.chooseTab(key);
  }

  nextTab() {
    let uploadState = this.props.state.upload;
    if (uploadState.view.activeTab === FILES_PREVIEW_TAB) {
      this.props.actions.chooseTab(OPTIONS_TAB);
    }
  }

  render () {
    let uploadState = this.props.state.upload;
    let playerState = this.props.state.media.player;

    return (
      <div>
        <Modal show={uploadState.view.showModalForm} onHide={this.closeModal.bind(this)} dialogClassName="upload-dialog">
          <ModalBody>
            <Tabs activeKey={uploadState.view.activeTab} onSelect={this.handleSelectTab.bind(this)} className="dialod-tabs">
              <Tab eventKey={FILES_PREVIEW_TAB} title="Select files">
                <UploadPreview playerState={playerState}
                               uploadState={uploadState}
                               actions={this.props.actions}
                />
              </Tab>
              <Tab eventKey={OPTIONS_TAB} title="Processing options">
                <UploadOptions token={this.props.state.auth.token}
                               uploadState={uploadState}
                               settingsState={this.props.state.settings}
                               actions={this.props.actions}
                />
              </Tab>
            </Tabs>
          </ModalBody>
          <ModalFooter>
            <Button onClick={this.nextTab.bind(this)} bsStyle="success" className="pull-left">Next</Button>
            <Button onClick={this.closeModal.bind(this)} className="pull-right">Cancel</Button>
          </ModalFooter>
        </Modal>
      </div>
    )
  }
}
