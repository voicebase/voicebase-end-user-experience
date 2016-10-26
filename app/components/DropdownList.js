import React, {PropTypes} from 'react'
import {Dropdown, MenuItem} from 'react-bootstrap'

export default class DropdownList extends React.Component {
  static propTypes = {
    onSelect: PropTypes.func.isRequired,
    items: PropTypes.object.isRequired,
    dropdownKey: PropTypes.string.isRequired,
    activeItemId: PropTypes.string.isRequired
  };

  onSelectItem = (key) => {
    this.props.onSelect(key);
  };

  render() {
    let items = this.props.items;
    let activeItem = items[this.props.activeItemId];
    return (
      <Dropdown id={this.props.dropdownKey + '-dropdown'} onSelect={this.onSelectItem} className="dropdown--custom-caret">
        <Dropdown.Toggle>
          {activeItem && activeItem.name}
          <i className="fa fa-caret-down" />
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {Object.keys(items).map(id => {
            let item = items[id];
            let activeId = (activeItem) ? activeItem.id : null;
            return (
              <MenuItem
                key={this.props.dropdownKey + 'priority-item' + id}
                eventKey={id}
                active={id === activeId}
              >
                {item.name}
              </MenuItem>
            )
          })}
        </Dropdown.Menu>
      </Dropdown>
    )
  }
}

