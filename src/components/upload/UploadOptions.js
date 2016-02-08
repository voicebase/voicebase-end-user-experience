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

  getSelectValue(key) {
    let uploadState = this.props.uploadState;
    let settingsState = this.props.settingsState;
    let defaultValue = [];
    let selectValue = [];
    if (uploadState.options[key]) {
      defaultValue = uploadState.options[key];
      selectValue = settingsState.items[key].itemIds.map(id => {
        let item = settingsState.items[key].items[id];
        return {
          value: item.id,
          label: item.name
        }
      });
    }
    return {defaultValue, selectValue}
  }

  render () {
    let uploadState = this.props.uploadState;
    let settingsState = this.props.settingsState;
    let activeLanguageId = (uploadState.options.language) ? uploadState.options.language : settingsState.items.languages.defaultLanguage;
    let priorities = settingsState.items.priority;
    let activePriority = uploadState.options.priority;

    let predictions = settingsState.items.predictions;
    let predictionsValue = this.getSelectValue('predictions');

    let detection = settingsState.items.detection;
    let detectionValue = this.getSelectValue('detection');

    let numbers = settingsState.items.numbers;
    let numbersValue = this.getSelectValue('numbers');

    return (
      <div>
        <form className="upload-options">
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

          {
            !predictions.isGetPending && !predictions.errorMessage &&
            <div className="form-group">
              <label className="control-label">Pick a prediction model to use</label>
              <Select placeholder="Pick a prediction model"
                      multi
                      value={predictionsValue.defaultValue.join(',')}
                      options={predictionsValue.selectValue}
                      onChange={this.onChangeDetection.bind(this)}
                      onBlur={() => {}}
              />
            </div>
          }

          {
            !detection.isGetPending && !detection.errorMessage &&
            <div className="form-group">
              <label className="control-label">Pick a detection model to use</label>
              <Select placeholder="Pick a detection model"
                      multi
                      value={detectionValue.defaultValue.join(',')}
                      options={detectionValue.selectValue}
                      onChange={this.onChangePrediction.bind(this)}
                      onBlur={() => {}}
              />
            </div>
          }

          {
            !numbers.isGetPending && !numbers.errorMessage &&
            <div className="form-group">
              <label className="control-label">Pick a number format to use</label>
              <Select placeholder="Pick a number format"
                      multi
                      value={numbersValue.defaultValue.join(',')}
                      options={numbersValue.selectValue}
                      onChange={this.onChangePrediction.bind(this)}
                      onBlur={() => {}}
              />
            </div>
          }

        </form>
      </div>
    )
  }
}
