import React, { PropTypes } from 'react'
import {Col, Button, ListGroupItem, Label, Collapse} from 'react-bootstrap'
import Spinner from '../Spinner'
import SpottingGroupItemForm from './SpottingGroupItemForm'

export class SpottingGroupItem extends React.Component {
  static propTypes = {
    token: PropTypes.string.isRequired,
    group: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired
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

  deleteGroup(event) {
    event.preventDefault();
    event.stopPropagation();
    this.props.actions.deleteGroup(this.props.token, this.props.group.id, this.props.group.name);
  }

  editGroup(values) {
    let keywords = values.keywords.split(',');

    let newGroup = {
      name: values.name,
      keywords
    };
    this.collapseForm();
    this.props.actions.editGroup(this.props.token, this.props.group.id, newGroup);
  }

  render() {
    let group = this.props.group;

    let keywords = group.keywordIds.map(id => group.keywords[id]);
    let initialValue = {
      name: group.name,
      description: group.description,
      isDefault: group.isDefault,
      keywords: keywords.join(',')
    };
    let keywordsSelectValue = keywords.map(word => {
      return {
        value: word,
        label: word
      }
    });

    return (
      <section className="list-group-item__section">
        <ListGroupItem href="javascript:void(0)" onClick={ () => this.setState({ open: !this.state.open })}>
          <Col sm={4}>
            <h4 className="list-group-item-heading">
              { group.name }
              { group.isDefault && <Label bsStyle="primary">Default</Label> }
            </h4>
          </Col>
          <Col sm={7} className="overflow-hidden">
            <p className="list-group-item-labels">
              {
                group.keywordIds.map(keywordId => {
                  let keywordName = group.keywords[keywordId];
                  let key = 'group__keyword-label-' + keywordName;
                  return <Label key={key} className="label-bordered">{ keywordName }</Label>
                })
              }
            </p>
          </Col>
          { (group.isDeletePending || group.isEditPending) && <Spinner isSmallItem/> }
          {
            !group.isDeletePending && !group.isEditPending &&
            <Button bsStyle="link" className="btn-delete" onClick={this.deleteGroup.bind(this)}>
              <i className="fa fa-trash"/>
            </Button>
          }
        </ListGroupItem>

        <Collapse id={'group-form' + group.id} in={this.state.open}>
          <div>
            <SpottingGroupItemForm formKey={'group' + group.id}
                                   keywordsSelectValue={keywordsSelectValue}
                                   initialValues={initialValue}
                                   onSubmit={this.editGroup.bind(this)}
                                   onCancel={this.collapseForm.bind(this)}
            />
          </div>
        </Collapse>

      </section>
    )
  }
}

export default SpottingGroupItem
