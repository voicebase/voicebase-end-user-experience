import React, { PropTypes } from 'react'
import SettingsList from './SettingsList'

export class Detections extends React.Component {
  static propTypes = {
    token: PropTypes.string.isRequired,
    state: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired
  };

  type = 'detection';

  addDetection = (values) => {
    this.props.actions.addItem(this.props.token, this.type, values);
  };

  deleteDetection = (id) => {
    this.props.actions.deleteItem(this.props.token, this.type, id);
  };

  editDetection = (id, values) => {
    this.props.actions.editItem(this.props.token, this.type, id, values);
  };

  render() {
    let state = this.props.state;

    return (
      <div>
        <SettingsList
          state={state}
          type={this.type}
          actions={this.props.actions}
          onAddItem={this.addDetection}
          onDeleteItem={this.deleteDetection}
          onEditItem={this.editDetection}
        />
      </div>
    )
  }
}

export default Detections
