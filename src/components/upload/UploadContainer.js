import React, { PropTypes } from 'react'
import {OPTIONS_TAB, FILES_PREVIEW_TAB} from '../../redux/modules/upload'
import UploadModal from './UploadModal'
import UploadPanel from './UploadPanel'
import UploadTabs from './UploadTabs'

export default class UploadContainer extends React.Component {
  static propTypes = {
    state: PropTypes.object.isRequired,
    onFinish: PropTypes.func.isRequired,
    isModal: PropTypes.bool.isRequired,
    actions: PropTypes.object.isRequired
  };

  onClose = () => {
    this.props.state.upload.get('fileIds').forEach(id => {
      this.props.actions.destroyPlayer(id);
    });
    this.props.actions.cancelUpload();
  };

  onSelectTab = (key) => {
    this.props.actions.chooseTab(key);
  };

  nextTab = () => {
    let uploadState = this.props.state.upload.toJS();
    if (uploadState.view.activeTab === FILES_PREVIEW_TAB) {
      this.onSelectTab(OPTIONS_TAB);
    }
    if (uploadState.view.activeTab === OPTIONS_TAB) {
      let options = uploadState.options;
      let settings = this.props.state.settings;
      let groups = options.groups && options.groups.map(groupId => settings.groups.getIn(['groups', groupId, 'name']));
      let predictions = options.predictions && options.predictions.map(id => settings.items.getIn(['predictions', 'items', id, 'modelId']));
      let speakers = (uploadState.view.isStereoFile) ? options.speakers : null;
      let vocabularies = (uploadState.view.showVocabularies) ? options.vocabularies : null;
      uploadState.fileIds.forEach(fileId => {
        let file = uploadState.files[fileId].file;
        this.props.actions.postFile(this.props.state.auth.token, fileId, file, {groups, predictions, speakers, vocabularies});
      });
      this.props.onFinish();
    }
  };

  getTabs() {
    let state = this.props.state;
    return (
      <UploadTabs
        token={state.auth.token}
        uploadState={state.upload.toJS()}
        playerState={state.media.player.toJS()}
        settingsState={state.settings}
        onSelectTab={this.onSelectTab}
        actions={this.props.actions}
      />
    )
  }

  render () {
    let state = this.props.state;
    let uploadState = state.upload.toJS();

    var isOptionsTab = uploadState.view.activeTab === OPTIONS_TAB;
    var isFilePreviewTab = uploadState.view.activeTab === FILES_PREVIEW_TAB;
    let nextButtonText = (isOptionsTab) ? 'Finish' : 'Next';

    return (
      <div>
        {this.props.isModal &&
          <UploadModal
            showForm={uploadState.view.showForm}
            nextTab={this.nextTab}
            nextButtonText={nextButtonText}
            onClose={this.onClose}
            onSelectTab={this.onSelectTab}
          >
            {this.getTabs()}
          </UploadModal>
        }
        {!this.props.isModal &&
          <div>
            <div className="content__heading">
              {isFilePreviewTab && <h3><span className="text-muted">Step 1 of 2:</span> Select files for upload</h3>}
              {isOptionsTab && <h3><span className="text-muted">Step 2 of 2:</span> Choose processing options</h3>}
            </div>

            <UploadPanel
              showForm={uploadState.view.showForm}
              nextTab={this.nextTab}
              nextButtonText={nextButtonText}
              onClose={this.onClose}
              onSelectTab={this.onSelectTab}
            >
              {this.getTabs()}
            </UploadPanel>
          </div>
        }
      </div>
    )
  }
}
