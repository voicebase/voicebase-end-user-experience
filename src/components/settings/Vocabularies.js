import React, { PropTypes } from 'react'
import SettingsList from './SettingsList'

export class Predictions extends React.Component {
  static propTypes = {
    token: PropTypes.string.isRequired,
    state: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired
  };

  type = 'vocabularies';

  parseTerms = (values) => {
    return values.terms.map(term => term.value);
  };

  addItem = (values) => {
    values.terms = this.parseTerms(values);
    this.props.actions.addItem(this.props.token, this.type, values);
  };

  deleteItem = (id, name) => {
    this.props.actions.deleteItem(this.props.token, this.type, id, name);
  };

  editItem = (id, values) => {
    values.terms = this.parseTerms(values);
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
          onAddItem={this.addItem}
          onDeleteItem={this.deleteItem}
          onEditItem={this.editItem}
        />
      </div>
    )
  }
}

export default Predictions
