import React, {PropTypes} from 'react'
import {Dropdown, MenuItem} from 'react-bootstrap'
import UsFlag from '../../images/us.png'
import UkFlag from '../../images/uk.png'

export default class LanguageDropdown extends React.Component {
  static propTypes = {
    onSelect: PropTypes.func.isRequired,
    languages: PropTypes.object.isRequired,
    activeLanguageId: PropTypes.string.isRequired
  };

  onSelectItem = (key) => {
    this.props.onSelect(key);
  };

  getFlag(languageId) {
    if (languageId === 'uk') {
      return UkFlag;
    }
    else if (languageId === 'us') {
      return UsFlag;
    }
  }

  getItemContent(language) {
    let flag = this.getFlag(language.id);
    return (
      <span><img className="flag" src={flag} /> {language.name}</span>
    )
  }

  getLanguages() {
    let languageState = this.props.languages;
    let activeLanguageId = this.props.activeLanguageId;
    return Object.keys(languageState).map(id => {
      let language = languageState[id];
      return (
        <MenuItem
          key={'language-item' + language.id}
          eventKey={language.id}
          active={language.id === activeLanguageId}
        >
          {this.getItemContent(language)}
        </MenuItem>
      )
    })
  }

  render() {
    let activeLanguage = this.props.languages[this.props.activeLanguageId];
    return (
      <Dropdown id="languages-dropdown" onSelect={this.onSelectItem} className="dropdown--custom-caret">
        <Dropdown.Toggle>
          {this.getItemContent(activeLanguage)}
          <i className="fa fa-caret-down" />
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {this.getLanguages()}
        </Dropdown.Menu>
      </Dropdown>
    )
  }
}

