import React, { PropTypes } from 'react'
import SettingsList from './SettingsList'

export class Predictions extends React.Component {
  static propTypes = {
    token: PropTypes.string.isRequired,
    state: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired
  };

  type = 'predictions';

  addPrediction = (values) => {
    this.props.actions.addItem(this.props.token, this.type, values);
  };

  deletePrediction = (id) => {
    this.props.actions.deleteItem(this.props.token, this.type, id);
  };

  editPrediction = (id, values) => {
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
          onAddItem={this.addPrediction}
          onDeleteItem={this.deletePrediction}
          onEditItem={this.editPrediction}
        />
      </div>
    )
  }
}

export default Predictions
