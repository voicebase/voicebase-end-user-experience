import React, { PropTypes } from 'react'
import classnames from 'classnames'
import {Col, Button, ListGroupItem, Collapse, Label} from 'react-bootstrap'
import Spinner from '../Spinner'
import PredictionForm from './PredictionForm'
import DetectionForm from './DetectionForm'
import NumbersForm from './NumbersForm'

export class SettingsListItem extends React.Component {
  static propTypes = {
    type: PropTypes.string.isRequired,
    item: PropTypes.object.isRequired,
    isActive: PropTypes.bool.isRequired,
    onDeleteItem: PropTypes.func.isRequired,
    onEditItem: PropTypes.func.isRequired,
    onSetActiveItem: PropTypes.func.isRequired,
    onClearActiveItem: PropTypes.func.isRequired
  };

  toggleItem() {
    if (this.props.isActive) {
      this.collapseForm();
    }
    else {
      this.props.onSetActiveItem(this.props.type, this.props.item.id);
    }
  }

  collapseForm() {
    this.props.onClearActiveItem(this.props.type);
  }

  deleteItem(event) {
    event.preventDefault();
    event.stopPropagation();
    this.props.onDeleteItem(this.props.item.id);
  }

  editItem(values) {
    this.collapseForm();
    this.props.onEditItem(this.props.item.id, values);
  }

  render() {
    let type = this.props.type;
    let item = this.props.item;
    let initialValue = {
      ...item
    };

    let listItemClasses = classnames('list-group-item__section', {'collapsed': !this.props.isActive});

    return (
      <section className={listItemClasses}>
        <ListGroupItem href="javascript:void(0)" onClick={this.toggleItem.bind(this)}>
          <Col sm={11}>
            <h4 className="list-group-item-heading">
              { item.displayName }&nbsp;
              { item.isDefault && <Label bsStyle="primary">Default</Label> }
            </h4>
          </Col>
          { (item.isDeletePending || item.isEditPending) && <Spinner isSmallItem/> }
          {
            !item.isDeletePending && !item.isEditPending &&
            <Button bsStyle="link" className="btn-delete" onClick={this.deleteItem.bind(this)}>
              <i className="fa fa-trash"/>
            </Button>
          }
        </ListGroupItem>

        <Collapse id={type + item.id} in={this.props.isActive}>
          <div>
            {
              type === 'predictions' &&
              <PredictionForm formKey={type + item.id}
                              initialValues={initialValue}
                              onSubmit={this.editItem.bind(this)}
                              onCancel={this.collapseForm.bind(this)}
              />
            }
            {
              type === 'detection' &&
              <DetectionForm formKey={type + item.id}
                             initialValues={initialValue}
                             onSubmit={this.editItem.bind(this)}
                             onCancel={this.collapseForm.bind(this)}
              />
            }
            {
              type === 'numbers' &&
              <NumbersForm formKey={type + item.id}
                           initialValues={initialValue}
                           onSubmit={this.editItem.bind(this)}
                           onCancel={this.collapseForm.bind(this)}
              />
            }
          </div>
        </Collapse>

      </section>
    )
  }
}

export default SettingsListItem
