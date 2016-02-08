import React, { PropTypes } from 'react'
import {Row, Col} from 'react-bootstrap'

import LanguageDropdown from './LanguageDropdown'
import DropdownList from '../DropdownList'

export default class UploadPreview extends React.Component {
  static propTypes = {
    token: PropTypes.string.isRequired,
    uploadState: PropTypes.object.isRequired,
    settingsState: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired
  };

  componentWillMount() {
    let settingsState = this.props.settingsState;
    if (settingsState.groups.groupIds.length === 0) {
      this.props.actions.getGroups(this.props.token);
    }
    if (settingsState.items.predictions.itemIds.length === 0) {
      this.props.actions.getItems(this.props.token, 'predictions');
    }
    if (settingsState.items.detection.itemIds.length === 0) {
      this.props.actions.getItems(this.props.token, 'detection');
    }
    if (settingsState.items.numbers.itemIds.length === 0) {
      this.props.actions.getItems(this.props.token, 'numbers');
    }
  }

  componentWillUpdate() {
    let settingsState = this.props.settingsState;
    let uploadState = this.props.uploadState;
    if (settingsState.items.languages.items && !uploadState.options.language) {
      this.props.actions.setLanguage(settingsState.items.languages.defaultLanguage);
    }
    if (settingsState.items.priority.items && !uploadState.options.priority) {
      this.props.actions.setPriority(settingsState.items.priority.defaultPriority);
    }
  }

  onSelectLanguage(languageId) {
    this.props.actions.setLanguage(languageId);
  }

  onSelectPriority(priorityId) {
    this.props.actions.setPriority(priorityId);
  }

  render () {
    let uploadState = this.props.uploadState;
    let settingsState = this.props.settingsState;
    let activeLanguageId = (uploadState.options.language) ? uploadState.options.language : settingsState.items.languages.defaultLanguage;
    let priorities = settingsState.items.priority;
    let activePriority = uploadState.options.priority;

    return (
      <div>
        <form className="upload-options ng-pristine ng-valid">
          <Row>
            <Col sm={6}>
              <div className="form-group dropdown-full-width">
                <label className="control-label">What languages are spoken in the files?</label>
                <LanguageDropdown languages={settingsState.items.languages.items}
                                  activeLanguageId={activeLanguageId}
                                  onSelect={this.onSelectLanguage.bind(this)}
                />
              </div>
            </Col>

            <Col sm={6}>
              {
                activePriority &&
                <div className="form-group dropdown-full-width">
                  <label className="control-label">Pick a priority for processing</label>
                  <DropdownList onSelect={this.onSelectPriority.bind(this)}
                                dropdownKey="priority-dropdown"
                                items={priorities.items}
                                activeItemId={activePriority}
                  />
                </div>
              }
            </Col>
          </Row>
        </form>
      </div>
    )
  }
}
