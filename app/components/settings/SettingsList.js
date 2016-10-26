import React, { PropTypes } from 'react'
import { Panel, Collapse, ListGroup, Alert, Button } from 'react-bootstrap'
import Spinner from '../Spinner'
import SettingsListItem from './SettingsListItem'
import PredictionForm from './PredictionForm'
import DetectionForm from './DetectionForm'
import NumbersForm from './NumbersForm'
import VocabularyForm from './VocabularyForm'

export class SettingsList extends React.Component {
  static propTypes = {
    state: PropTypes.object.isRequired,
    type: PropTypes.string.isRequired,
    onAddItem: PropTypes.func.isRequired,
    onDeleteItem: PropTypes.func.isRequired,
    onEditItem: PropTypes.func.isRequired,
    actions: PropTypes.object.isRequired
  };

  expandCreateForm = (event) => {
    event.preventDefault();
    event.stopPropagation();
    this.props.actions.toggleCreateForm(this.props.type, true);
  };

  collapseCreateForm = () => {
    this.props.actions.toggleCreateForm(this.props.type, false);
  };

  expandItem = (type, itemId) => {
    this.props.actions.setActiveItem(type, itemId);
  };

  collapseItem = (type) => {
    this.props.actions.clearActiveItem(type);
  };

  addItem = (values) => {
    this.collapseCreateForm();
    this.props.onAddItem(values);
  };

  render() {
    let state = this.props.state;
    let type = this.props.type;
    let activeItemId = state.activeItem;

    return (
      <div>
        {state.isGetPending && <Spinner />}
        {state.errorMessage &&
          <Alert bsStyle="warning">
            {state.errorMessage}
          </Alert>
        }
        {!state.isGetPending &&
          <div>
            {state.isAddPending && <div className="btn-add-settings"><Spinner /></div>}
            {!state.isAddPending &&
              <Button bsStyle="link" className="btn-add" onClick={this.expandCreateForm}>
                <i className="fa fa-plus" />&nbsp;{state.view.addButtonLabel}
              </Button>
            }
            <Collapse in={state.view.isExpandCreateForm}>
              <div>
                {type === 'predictions' &&
                  <PredictionForm
                    formKey={'add-' + type}
                    onSubmit={this.addItem}
                    onCancel={this.collapseCreateForm}
                  />
                }
                {type === 'detection' &&
                  <DetectionForm
                    formKey={'add-' + type}
                    onSubmit={this.addItem}
                    onCancel={this.collapseCreateForm}
                  />
                }
                {type === 'numbers' &&
                  <NumbersForm
                    formKey={'add-' + type}
                    onSubmit={this.addItem}
                    onCancel={this.collapseCreateForm}
                  />
                }
                {type === 'vocabularies' &&
                  <VocabularyForm
                    formKey={'add-' + type}
                    termsSelectValue={[]}
                    onSubmit={this.addItem}
                    onCancel={this.collapseCreateForm}
                  />
                }
              </div>
            </Collapse>
            <Panel className="panel panel-default panel-settings">
              <ListGroup>
                {state.itemIds.map(id => {
                  return (
                    <SettingsListItem
                      key={type + id}
                      type={type}
                      item={state.items[id]}
                      isActive={activeItemId === id}
                      onDeleteItem={this.props.onDeleteItem}
                      onEditItem={this.props.onEditItem}
                      onSetActiveItem={this.expandItem}
                      onClearActiveItem={this.collapseItem}
                    />
                  )
                })}
              </ListGroup>
            </Panel>
          </div>
        }
      </div>
    )
  }
}

export default SettingsList
