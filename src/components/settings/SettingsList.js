import React, { PropTypes } from 'react'
import {Panel, Collapse, ListGroup, Alert} from 'react-bootstrap'
import Spinner from '../Spinner'
import SettingsListHeader from './SettingsListHeader'
import SettingsListItem from './SettingsListItem'
import PredictionForm from './PredictionForm'
import DetectionForm from './DetectionForm'

export class SettingsList extends React.Component {
  static propTypes = {
    state: PropTypes.object.isRequired,
    type: PropTypes.string.isRequired,
    onAddItem: PropTypes.func.isRequired,
    onDeleteItem: PropTypes.func.isRequired,
    onEditItem: PropTypes.func.isRequired,
    actions: PropTypes.object.isRequired
  };

  toggleList() {
    this.props.actions.toggleList(this.props.type);
  }

  expandCreateForm(event) {
    event.preventDefault();
    event.stopPropagation();
    this.props.actions.toggleCreateForm(this.props.type, true);
    this.props.actions.toggleList(this.props.type, true);
  }

  collapseCreateForm() {
    this.props.actions.toggleCreateForm(this.props.type, false);
  }

  addItem(values) {
    this.collapseCreateForm();
    this.props.onAddItem(values);
  }

  getHeader() {
    return (
      <SettingsListHeader title={this.props.state.view.title}
                  addButtonLabel={this.props.state.view.addButtonLabel}
                  length={this.props.state.itemIds.length}
                  isAddPending={this.props.state.isAddPending}
                  handleClickHeader={this.toggleList.bind(this)}
                  handleClickAdd={this.expandCreateForm.bind(this)}
      />
    )
  }

  render() {
    let state = this.props.state;
    let type = this.props.type;

    return (
      <div>
        { state.isGetPending && <Spinner /> }
        {
          state.errorMessage &&
          <Alert bsStyle="warning">
            {state.errorMessage}
          </Alert>
        }
        {
          !state.isGetPending &&
          <Panel className="panel panel-default panel-settings" header={this.getHeader()}>
            <Collapse in={state.view.isExpandList}>
              <ListGroup>

                <Collapse in={state.view.isExpandCreateForm}>
                  <div>
                    {
                      type === 'predictions' &&
                      <PredictionForm formKey={'add-' + type}
                                      onSubmit={this.addItem.bind(this)}
                                      onCancel={this.collapseCreateForm.bind(this)}
                      />
                    }
                    {
                      type === 'detection' &&
                      <DetectionForm formKey={'add-' + type}
                                     onSubmit={this.addItem.bind(this)}
                                     onCancel={this.collapseCreateForm.bind(this)}
                      />
                    }
                  </div>
                </Collapse>
                {
                  state.itemIds.map(id => {
                    return (
                      <SettingsListItem key={type + id}
                                        type={type}
                                        item={state.items[id]}
                                        onDeleteItem={this.props.onDeleteItem}
                                        onEditItem={this.props.onEditItem}
                      />
                    )
                  })
                }
              </ListGroup>
            </Collapse>
          </Panel>
        }
      </div>
    )
  }
}

export default SettingsList
