import React, {PropTypes} from 'react'
import {Dropdown, MenuItem} from 'react-bootstrap'

export default class LanguageDropdown extends React.Component {
  static propTypes = {
    onSelect: PropTypes.func.isRequired,
    items: PropTypes.object.isRequired,
    dropdownKey: PropTypes.string.isRequired,
    activeItemId: PropTypes.string.isRequired
  };

  onSelectItem(event, key) {
    this.props.onSelect(key);
  }

  render() {
    let items = this.props.items;
    let activeItem = items[this.props.activeItemId];
    return (
      <Dropdown id={this.props.dropdownKey + '-dropdown'} onSelect={this.onSelectItem.bind(this)} className="dropdown--custom-caret">
        <Dropdown.Toggle>
          { activeItem.name }
          <i className="fa fa-caret-down"/>
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {
            Object.keys(items).map(id => {
              let item = items[id];
              return (
                <MenuItem key={this.props.dropdownKey + 'priority-item' + id}
                          eventKey={id}
                          active={id === activeItem.id}
                >
                  {item.name}
                </MenuItem>
              )
            })
          }
        </Dropdown.Menu>
      </Dropdown>
    )
  }
}

