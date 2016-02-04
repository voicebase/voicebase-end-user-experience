import React, { PropTypes } from 'react'
import {Col, Button, ListGroupItem, Collapse, Label} from 'react-bootstrap'
import Spinner from '../Spinner'
import PredictionForm from './PredictionForm'
import DetectionForm from './DetectionForm'
import NumbersForm from './NumbersForm'

export class SettingsListItem extends React.Component {
  static propTypes = {
    type: PropTypes.string.isRequired,
    item: PropTypes.object.isRequired,
    onDeleteItem: PropTypes.func.isRequired,
    onEditItem: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {};
  }

  collapseForm() {
    this.setState({
      open: false
    });
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

    return (
      <section className="list-group-item__section">
        <ListGroupItem href="javascript:void(0)" onClick={ () => this.setState({ open: !this.state.open })}>
          <Col sm={11}>
            <h4 className="list-group-item-heading">
              { item.name }
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

        <Collapse id={type + item.id} in={this.state.open}>
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
