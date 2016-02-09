import React, { PropTypes } from 'react'
import {OPTIONS_TAB, FILES_PREVIEW_TAB} from '../../redux/modules/upload'
import UploadModal from './UploadModal'
import UploadPanel from './UploadPanel'
import UploadTabs from './UploadTabs'

export default class UploadContainer extends React.Component {
  static propTypes = {
    state: PropTypes.object.isRequired,
    isModal: PropTypes.bool.isRequired,
    actions: PropTypes.object.isRequired
  };

  onClose() {
    this.props.actions.cancelUpload();
  }

  onSelectTab(key) {
    this.props.actions.chooseTab(key);
  }

  nextTab() {
    let uploadState = this.props.state.upload;
    if (uploadState.view.activeTab === FILES_PREVIEW_TAB) {
      this.onSelectTab(OPTIONS_TAB);
    }
    if (uploadState.view.activeTab === OPTIONS_TAB) {
      let options = uploadState.options;
      uploadState.fileIds.forEach(fileId => {
        let file = uploadState.files[fileId].file;
        this.props.actions.postFile(this.props.state.auth.token, fileId, file, options);
      });
    }
  }

  getTabs() {
    let state = this.props.state;
    return (
      <UploadTabs token={state.auth.token}
                  uploadState={state.upload}
                  playerState={state.media.player}
                  settingsState={state.settings}
                  onSelectTab={this.onSelectTab.bind(this)}
                  actions={this.props.actions}
      />
    )
  }

  render () {
    let state = this.props.state;
    let uploadState = state.upload;

    return (
      <div>
        {
          this.props.isModal &&
          <UploadModal showForm={uploadState.view.showForm}
                       nextTab={this.nextTab.bind(this)}
                       onClose={this.onClose.bind(this)}
                       onSelectTab={this.onSelectTab.bind(this)}
          >
            { this.getTabs() }
          </UploadModal>
        }
        {
          !this.props.isModal &&
          <UploadPanel showForm={uploadState.view.showForm}
                       nextTab={this.nextTab.bind(this)}
                       onClose={this.onClose.bind(this)}
                       onSelectTab={this.onSelectTab.bind(this)}
          >
            { this.getTabs() }
          </UploadPanel>
        }
      </div>
    )
  }
}
