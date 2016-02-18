import React, { PropTypes } from 'react'
import {Row, Col} from 'react-bootstrap'
import Select from 'react-select'
import 'react-select/dist/react-select.css'

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
    if (this.props.uploadState.fileIds.length === 0) {
      return false;
    }
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

  componentDidUpdate() {
    let settingsState = this.props.settingsState;
    let uploadState = this.props.uploadState;
    if (uploadState.fileIds.length === 0) {
      return false;
    }
    if (settingsState.items.languages.items && !uploadState.options.language) {
      this.props.actions.setLanguage(settingsState.items.languages.defaultLanguage);
    }
    if (settingsState.items.priority.items && !uploadState.options.priority) {
      this.props.actions.setPriority(settingsState.items.priority.defaultPriority);
    }
    if (settingsState.items.predictions.itemIds.length > 0 && !uploadState.options.predictions) {
      let defaultItems = this.getDefaultIds(settingsState.items.predictions.items);
      this.props.actions.setPrediction(defaultItems);
    }
    if (settingsState.items.detection.itemIds.length > 0 && !uploadState.options.detection) {
      let defaultItems = this.getDefaultIds(settingsState.items.detection.items);
      this.props.actions.setDetection(defaultItems);
    }
    if (settingsState.items.numbers.itemIds.length > 0 && !uploadState.options.numbers) {
      let defaultItems = this.getDefaultIds(settingsState.items.numbers.items);
      this.props.actions.setNumbers(defaultItems);
    }
    if (settingsState.groups.groupIds.length > 0 && !uploadState.options.groups) {
      let defaultItems = this.getDefaultIds(settingsState.groups.groups);
      this.props.actions.setGroups(defaultItems);
    }
  }

  getDefaultIds(items) {
    return Object.keys(items).filter(itemId => items[itemId].isDefault);
  }

  onSelectLanguage(languageId) {
    this.props.actions.setLanguage(languageId);
  }

  onSelectPriority(priorityId) {
    this.props.actions.setPriority(priorityId);
  }

  onChangePrediction(newValue) {
    this.props.actions.setPrediction(newValue.split(','));
  }

  onChangeDetection(newValue) {
    this.props.actions.setDetection(newValue.split(','));
  }

  onChangeNumbers(newValue) {
    this.props.actions.setNumbers(newValue.split(','));
  }

  onChangeGroups(newValue) {
    this.props.actions.setGroups(newValue.split(','));
  }

  getSelectValue(key, items) {
    let uploadState = this.props.uploadState;
    let defaultValue = [];
    let selectValue = [];
    if (uploadState.options[key]) {
      defaultValue = uploadState.options[key];
      selectValue = Object.keys(items).map(id => {
        let item = items[id];
        return {
          value: item.id,
          label: item.name
        }
      });
    }
    return {defaultValue, selectValue}
  }

  render() {
    let uploadState = this.props.uploadState;
    let settingsState = this.props.settingsState;
    let activeLanguageId = uploadState.options.language;

    let priorities = settingsState.items.priority;
    let activePriority = uploadState.options.priority;

    let predictions = settingsState.items.predictions;
    let predictionsValue = this.getSelectValue('predictions', predictions.items);

    let detection = settingsState.items.detection;
    let detectionValue = this.getSelectValue('detection', detection.items);

    let numbers = settingsState.items.numbers;
    let numbersValue = this.getSelectValue('numbers', numbers.items);

    let groups = settingsState.groups;
    let groupsValue = this.getSelectValue('groups', groups.groups);

    return (
      <div>
        <form className="upload-options">
          <Row>
            <Col sm={6}>
              {
                activeLanguageId &&
                <div className="form-group dropdown-full-width">
                  <label className="control-label">What languages are spoken in the files?</label>
                  <LanguageDropdown languages={settingsState.items.languages.items}
                                    activeLanguageId={activeLanguageId}
                                    onSelect={this.onSelectLanguage.bind(this)}
                  />
                </div>
              }
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
          <Row>
            <Col sm={12}>
              {
                !predictions.isGetPending && !predictions.errorMessage &&
                <div className="form-group">
                  <label className="control-label">Enable 1 or more prediction models (Optional)</label>
                  <Select placeholder="Pick a prediction model"
                          multi
                          value={predictionsValue.defaultValue.join(',')}
                          options={predictionsValue.selectValue}
                          onChange={this.onChangePrediction.bind(this)}
                          onBlur={() => {}}
                  />
                </div>
              }
            </Col>
          </Row>
          <Row>
            <Col sm={12}>
              {
                !detection.isGetPending && !detection.errorMessage &&
                <div className="form-group">
                  <label className="control-label">Enable 1 or more detection models (Optional)</label>
                  <Select placeholder="Pick a detection model"
                          multi
                          value={detectionValue.defaultValue.join(',')}
                          options={detectionValue.selectValue}
                          onChange={this.onChangeDetection.bind(this)}
                          onBlur={() => {}}
                  />
                </div>
              }
            </Col>
          </Row>
          <Row>
            <Col sm={12}>
              {
                !numbers.isGetPending && !numbers.errorMessage &&
                <div className="form-group">
                  <label className="control-label">Enable 1 or more number formats (Optional)</label>
                  <Select placeholder="Pick a number format"
                          multi
                          value={numbersValue.defaultValue.join(',')}
                          options={numbersValue.selectValue}
                          onChange={this.onChangeNumbers.bind(this)}
                          onBlur={() => {}}
                  />
                </div>
              }
            </Col>
          </Row>
          <Row>
            <Col sm={12}>
              {
                !groups.isGetPending && !groups.errorMessage &&
                <div className="form-group">
                  <label className="control-label">Enable 1 or more phrase groups (Optional)</label>
                  <Select placeholder="Pick 1 or more phrase groups"
                          multi
                          value={groupsValue.defaultValue.join(',')}
                          options={groupsValue.selectValue}
                          onChange={this.onChangeGroups.bind(this)}
                          onBlur={() => {}}
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
