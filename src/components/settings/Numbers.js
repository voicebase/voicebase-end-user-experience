import React, { PropTypes } from 'react'
import SettingsList from './SettingsList'

export class Numbers extends React.Component {
  static propTypes = {
    token: PropTypes.string.isRequired,
    state: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired
  };

  type = 'numbers';

  addNumber(values) {
    this.props.actions.addItem(this.props.token, this.type, values);
  }

  deleteNumber(id) {
    this.props.actions.deleteItem(this.props.token, this.type, id);
  }

  editNumber(id, values) {
    this.props.actions.editItem(this.props.token, this.type, id, values);
  }

  render() {
    let state = this.props.state;

    return (
      <div>
        <SettingsList
          state={state}
          type={this.type}
          actions={this.props.actions}
          onAddItem={this.addNumber.bind(this)}
          onDeleteItem={this.deleteNumber.bind(this)}
          onEditItem={this.editNumber.bind(this)}
        />
      </div>
    )
  }
}

export default Numbers
