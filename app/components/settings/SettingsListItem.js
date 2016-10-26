import React, { PropTypes } from 'react'
import classnames from 'classnames'
import {Col, Button, ListGroupItem, Collapse, Label} from 'react-bootstrap'
import Spinner from '../Spinner'
import PredictionForm from './PredictionForm'
import DetectionForm from './DetectionForm'
import NumbersForm from './NumbersForm'
import VocabularyForm from './VocabularyForm'

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

  toggleItem = () => {
    if (this.props.isActive) {
      this.collapseForm();
    }
    else {
      this.props.onSetActiveItem(this.props.type, this.props.item.id);
    }
  };

  collapseForm = () => {
    this.props.onClearActiveItem(this.props.type);
  };

  deleteItem = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const { item } = this.props;
    this.props.onDeleteItem(item.id, item.name);
  };

  editItem = (values) => {
    this.collapseForm();
    this.props.onEditItem(this.props.item.id, values);
  };

  getCommonItem (item) {
    return (
      <ListGroupItem href="javascript:void(0)" onClick={this.toggleItem}>
        <Col sm={11}>
          <h4 className="list-group-item-heading">
            {item.displayName}&nbsp;
            {item.isDefault && <Label bsStyle="primary">Default</Label>}
          </h4>
        </Col>
        {(item.isDeletePending || item.isEditPending) && <Spinner isSmallItem />}
        {!item.isDeletePending && !item.isEditPending &&
          <Button bsStyle="link" className="btn-delete" onClick={this.deleteItem}>
            <i className="fa fa-trash" />
          </Button>
        }
      </ListGroupItem>
    )
  }

  getVocabularyItem (item) {
    return (
      <ListGroupItem href="javascript:void(0)" onClick={this.toggleItem}>
        <Col sm={4}>
          <h4 className="list-group-item-heading">
            {item.name}
          </h4>
        </Col>
        <Col sm={7} className="overflow-hidden">
          <p className="list-group-item-labels">
            {item.terms.map((term) => {
              let key = 'group__keyword-label-' + term;
              return <Label key={key} className="label-bordered">{term}</Label>
            })}
          </p>
        </Col>
        {(item.isDeletePending || item.isEditPending) && <Spinner isSmallItem />}
        {!item.isDeletePending && !item.isEditPending &&
          <Button bsStyle="link" className="btn-delete" onClick={this.deleteItem}>
            <i className="fa fa-trash" />
          </Button>
        }
      </ListGroupItem>
    )
  }

  getVocabularyForm (item) {
    let type = this.props.type;
    let termsSelectValue = item.terms.map((word) => {
      return {
        value: word,
        label: word
      }
    });
    let initialValue = {
      ...item
    };

    return (
      <VocabularyForm
        formKey={type + item.id}
        initialValues={initialValue}
        termsSelectValue={termsSelectValue}
        onSubmit={this.editItem}
        onCancel={this.collapseForm}
      />
    )
  }

  render() {
    let type = this.props.type;
    let item = this.props.item;
    let initialValue = {
      ...item
    };

    const isVocabularyItem = type === 'vocabularies';
    const isCommonItem = !isVocabularyItem;

    let listItemClasses = classnames('list-group-item__section', {'collapsed': !this.props.isActive});

    return (
      <section className={listItemClasses}>
        {isCommonItem && this.getCommonItem(item)}
        {isVocabularyItem && this.getVocabularyItem(item)}

        <Collapse id={type + item.id} in={this.props.isActive}>
          <div>
            {type === 'predictions' &&
              <PredictionForm
                formKey={type + item.id}
                initialValues={initialValue}
                onSubmit={this.editItem}
                onCancel={this.collapseForm}
              />
            }
            {type === 'detection' &&
              <DetectionForm
                formKey={type + item.id}
                initialValues={initialValue}
                onSubmit={this.editItem}
                onCancel={this.collapseForm}
              />
            }
            {type === 'numbers' &&
              <NumbersForm
                formKey={type + item.id}
                initialValues={initialValue}
                onSubmit={this.editItem}
                onCancel={this.collapseForm}
              />
            }
            {type === 'vocabularies' && this.getVocabularyForm(item)}
          </div>
        </Collapse>

      </section>
    )
  }
}

export default SettingsListItem
