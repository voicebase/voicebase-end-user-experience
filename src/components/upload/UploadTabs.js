import React, { PropTypes } from 'react'
import {Tabs, Tab} from 'react-bootstrap'
import {OPTIONS_TAB, FILES_PREVIEW_TAB} from '../../redux/modules/upload'
import UploadPreview from './UploadPreview'
import UploadOptions from './UploadOptions'

export default class UploadTabs extends React.Component {
  static propTypes = {
    token: PropTypes.string.isRequired,
    uploadState: PropTypes.object.isRequired,
    playerState: PropTypes.object.isRequired,
    settingsState: PropTypes.object.isRequired,
    onSelectTab: PropTypes.func.isRequired,
    actions: PropTypes.object.isRequired
  };

  render () {
    let uploadState = this.props.uploadState;

    return (
      <Tabs activeKey={uploadState.view.activeTab} onSelect={this.props.onSelectTab} className="dialog-tabs">
        <Tab eventKey={FILES_PREVIEW_TAB} title="Select files">
          <UploadPreview playerState={this.props.playerState}
                         uploadState={uploadState}
                         actions={this.props.actions}
          />
        </Tab>
        <Tab eventKey={OPTIONS_TAB} title="Processing options">
          <UploadOptions token={this.props.token}
                         uploadState={uploadState}
                         settingsState={this.props.settingsState}
                         actions={this.props.actions}
          />
        </Tab>
      </Tabs>
    )
  }
}
