import React, { PropTypes } from 'react'
import { Row, Col, ButtonGroup, Button, Fade } from 'react-bootstrap'
import Select, { Creatable } from 'react-select'
import 'react-select/dist/react-select.css'
import { parseReactSelectValues } from '../../common/Common'
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
    let groups = settingsState.groups.toJS();
    let items = settingsState.items.toJS();
    if (groups.groupIds.length === 0) {
      this.props.actions.getGroups(this.props.token);
    }
    if (items.predictions.itemIds.length === 0 && items.predictions.view.enabled) {
      this.props.actions.getItems(this.props.token, 'predictions');
    }
    if (items.vocabularies.itemIds.length === 0 && items.vocabularies.view.enabled) {
      this.props.actions.getItems(this.props.token, 'vocabularies');
    }
    if (items.detection.itemIds.length === 0 && items.detection.view.enabled) {
      this.props.actions.getItems(this.props.token, 'detection');
    }
    if (items.numbers.itemIds.length === 0 && items.numbers.view.enabled) {
      this.props.actions.getItems(this.props.token, 'numbers');
    }
  }

  componentDidUpdate() {
    let settingsState = this.props.settingsState;
    let uploadState = this.props.uploadState;
    if (uploadState.fileIds.length === 0) {
      return false;
    }
    let groups = settingsState.groups.toJS();
    let items = settingsState.items.toJS();
    if (items.languages.items && !uploadState.options.language) {
      this.props.actions.setLanguage(items.languages.defaultLanguage);
    }
    if (items.priority.items && !uploadState.options.priority) {
      this.props.actions.setPriority(items.priority.defaultPriority);
    }
    if (items.predictions.itemIds.length > 0 && !uploadState.options.predictions) {
      let defaultItems = this.getDefaultIds(items.predictions.items);
      this.props.actions.setPrediction(defaultItems);
    }
    if (items.detection.itemIds.length > 0 && !uploadState.options.detection) {
      let defaultItems = this.getDefaultIds(items.detection.items);
      this.props.actions.setDetection(defaultItems);
    }
    if (items.numbers.itemIds.length > 0 && !uploadState.options.numbers) {
      let defaultItems = this.getDefaultIds(items.numbers.items);
      this.props.actions.setNumbers(defaultItems);
    }
    if (groups.groupIds.length > 0 && !uploadState.options.groups) {
      let defaultItems = this.getDefaultIds(groups.groups);
      this.props.actions.setGroups(defaultItems);
    }
  }

  getDefaultIds(items) {
    return Object.keys(items).filter(itemId => items[itemId].isDefault);
  }

  onSelectLanguage = (languageId) => {
    this.props.actions.setLanguage(languageId);
  };

  onSelectPriority = (priorityId) => {
    this.props.actions.setPriority(priorityId);
  };

  onChangePrediction = (newValue) => {
    let value = this.parseSelectValue(newValue);
    this.props.actions.setPrediction(value);
  };

  onChangeDetection = (newValue) => {
    let value = this.parseSelectValue(newValue);
    this.props.actions.setDetection(value);
  };

  onChangeNumbers = (newValue) => {
    let value = this.parseSelectValue(newValue);
    this.props.actions.setNumbers(value);
  };

  onChangeGroups = (newValue) => {
    let value = this.parseSelectValue(newValue);
    this.props.actions.setGroups(value);
  };

  onChangeVocabulary = (newValue) => {
    let value = this.parseSelectValue(newValue);
    this.props.actions.setVocabulary(value);
  };

  onChangeCustomTerms = (newValue) => {
    let value = this.parseSelectValue(newValue);
    this.props.actions.setCustomTerms(value);
  };

  turnOnStereo = () => {
    this.props.actions.setIsStereo(true);
  };

  turnOffStereo = () => {
    this.props.actions.setIsStereo(false);
  };

  onChangeLeftSpeaker = (event) => {
    this.onChangeSpeakerName(event, 'left');
  };

  onChangeRightSpeaker = (event) => {
    this.onChangeSpeakerName(event, 'right');
  };

  onChangeSpeakerName(event, type) {
    const speakerName = event.target.value;
    this.props.actions.setSpeaker(type, speakerName);
  }

  parseSelectValue(value) {
    return parseReactSelectValues(value) || [];
  }

  getSelectValue(key, items, isPlainArray) {
    let uploadState = this.props.uploadState;
    let defaultValue = [];
    let selectValue = [];
    if (uploadState.options[key]) {
      defaultValue = uploadState.options[key];
      selectValue = Object.keys(items).map((id, i) => {
        let item = items[id];
        const value = (!isPlainArray) ? item.id || i : item;
        return {
          value,
          label: item.displayName || item.name || item
        }
      });
    }
    return {defaultValue, selectValue}
  }

  onBlur = () => {};

  render() {
    let uploadState = this.props.uploadState;
    let settingsState = this.props.settingsState;
    var items = settingsState.items.toJS();
    let activeLanguageId = uploadState.options.language;

    let priorities = items.priority;
    let activePriority = uploadState.options.priority;

    let predictions = items.predictions;
    let predictionsValue = this.getSelectValue('predictions', predictions.items, false);

    let detection = items.detection;
    let detectionValue = this.getSelectValue('detection', detection.items, false);

    let numbers = items.numbers;
    let numbersValue = this.getSelectValue('numbers', numbers.items, false);

    let groups = settingsState.groups.toJS();
    let groupsValue = this.getSelectValue('groups', groups.groups, false);

    const vocabularies = items.vocabularies;
    let vocabularyValue = this.getSelectValue('vocabularies', vocabularies.items, false);

    const customTerms = this.getSelectValue('customTerms', uploadState.options.customTerms, true);

    const isStereo = uploadState.view.isStereoFile;
    const speakers = uploadState.options.speakers;

    return (
      <div>
        <form className="upload-options">
          <Row>
            <Col sm={6}>
              {activeLanguageId &&
                <div className="form-group dropdown-full-width">
                  <label className="control-label">What languages are spoken in the files?</label>
                  <LanguageDropdown
                    languages={items.languages.items}
                    activeLanguageId={activeLanguageId}
                    onSelect={this.onSelectLanguage}
                  />
                </div>
              }
            </Col>

            <Col sm={6}>
              {activePriority &&
                <div className="form-group dropdown-full-width">
                  <label className="control-label">Pick a priority for processing</label>
                  <DropdownList
                    onSelect={this.onSelectPriority}
                    dropdownKey="priority-dropdown"
                    items={priorities.items}
                    activeItemId={activePriority}
                  />
                </div>
              }
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <div className="form-group">
                <label className="control-label">Are the files in stereo?</label>
                <ButtonGroup>
                  <Button active={isStereo} onClick={this.turnOnStereo}>Yes</Button>
                  <Button active={!isStereo} onClick={this.turnOffStereo}>No</Button>
                </ButtonGroup>
              </div>
            </Col>
            <Col md={6}>
              <Fade in={isStereo}>
                <Row>
                  <Col md={6}>
                    <div className="form-group">
                      <label className="control-label">Speaker 1</label>
                      <input
                        type="text" className="form-control" placeholder="Name of Speaker 1"
                        value={speakers.left}
                        onChange={this.onChangeLeftSpeaker}
                      />
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="form-group">
                      <label className="control-label">Speaker 2</label>
                      <input
                        type="text" className="form-control" placeholder="Name of Speaker 2"
                        value={speakers.right}
                        onChange={this.onChangeRightSpeaker}
                      />
                    </div>
                  </Col>
                </Row>
              </Fade>
            </Col>
          </Row>
          {predictions.view.enabled &&
            <Row>
              <Col sm={12}>
                {!predictions.isGetPending && !predictions.errorMessage &&
                  <div className="form-group">
                    <label className="control-label">Enable 1 or more prediction models (Optional)</label>
                    <Select
                      placeholder="Pick a prediction model"
                      multi
                      value={predictionsValue.defaultValue}
                      options={predictionsValue.selectValue}
                      onChange={this.onChangePrediction}
                      onBlur={this.onBlur}
                    />
                  </div>
                }
              </Col>
            </Row>
          }
          {detection.view.enabled &&
            <Row>
              <Col sm={12}>
                {!detection.isGetPending && !detection.errorMessage &&
                  <div className="form-group">
                    <label className="control-label">Enable 1 or more detection models (Optional)</label>
                    <Select
                      placeholder="Pick a detection model"
                      multi
                      value={detectionValue.defaultValue}
                      options={detectionValue.selectValue}
                      onChange={this.onChangeDetection}
                      onBlur={this.onBlur}
                    />
                  </div>
                }
              </Col>
            </Row>
          }
          {numbers.view.enabled &&
            <Row>
              <Col sm={12}>
                {!numbers.isGetPending && !numbers.errorMessage &&
                  <div className="form-group">
                    <label className="control-label">Enable 1 or more number formats (Optional)</label>
                    <Select
                      placeholder="Pick a number format"
                      multi
                      value={numbersValue.defaultValue}
                      options={numbersValue.selectValue}
                      onChange={this.onChangeNumbers}
                      onBlur={this.onBlur}
                    />
                  </div>
                }
              </Col>
            </Row>
          }
          <Row>
            <Col sm={12}>
              {!groups.isGetPending && !groups.errorMessage &&
                <div className="form-group">
                  <label className="control-label">Enable 1 or more phrase groups (Optional)</label>
                  <Select
                    placeholder="Pick 1 or more phrase groups"
                    multi
                    value={groupsValue.defaultValue}
                    options={groupsValue.selectValue}
                    onChange={this.onChangeGroups}
                    onBlur={this.onBlur}
                  />
                </div>
              }
            </Col>
          </Row>
          <Row>
            <Col sm={12}>
              {uploadState.view.showVocabularies &&
                <div className="form-group">
                  <label className="control-label">Pick 1 or more list of custom terms (Optional)</label>
                  <Select
                    placeholder="Pick 1 or more list of custom terms"
                    multi
                    value={vocabularyValue.defaultValue}
                    options={vocabularyValue.selectValue}
                    onChange={this.onChangeVocabulary}
                    onBlur={this.onBlur}
                  />
                </div>
              }
            </Col>
          </Row>
          <Row>
            <Col sm={12}>
              {uploadState.view.showVocabularies &&
                <div className="form-group">
                  <label className="control-label">Add 1 or more custom terms (Optional)</label>
                  <Creatable
                    placeholder="Add 1 or more custom terms"
                    multi
                    value={customTerms.defaultValue}
                    options={customTerms.selectValue}
                    onChange={this.onChangeCustomTerms}
                    onBlur={this.onBlur}
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
