import React, { PropTypes } from 'react'
import SettingsList from './SettingsList'
import { parseVocabulary } from '../../common/Vocabulary'

export class Predictions extends React.Component {
  static propTypes = {
    token: PropTypes.string.isRequired,
    state: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired
  };

  type = 'vocabularies';

  addItem = (values) => {
    return parseVocabulary(values)
      .then((vocabulary) => {
        this.props.actions.addItem(this.props.token, this.type, vocabulary);
      });
  };

  deleteItem = (id, name) => {
    this.props.actions.deleteItem(this.props.token, this.type, id, name);
  };

  editItem = (id, values) => {
    return parseVocabulary(values)
      .then((vocabulary) => {
        this.props.actions.editItem(this.props.token, this.type, id, vocabulary);
      });
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
