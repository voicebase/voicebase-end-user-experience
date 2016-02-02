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

  deleteGroup(event) {
    event.preventDefault();
    event.stopPropagation();
    this.props.actions.deleteGroup(this.props.token, this.props.group.id, this.props.group.name);
  }

  editGroup(group) {
    console.log(group);
  }

  render() {
    let group = this.props.group;

    return (
      <section className="list-group-item__section">
        <ListGroupItem href="javascript:void(0)" onClick={ () => this.setState({ open: !this.state.open })}>
          <Col sm={4}>
            <h4 className="list-group-item-heading">
              {group.name}
            </h4>
          </Col>
          <Col sm={7} className="overflow-hidden">
            <p className="list-group-item-labels">
              <Label bsStyle="primary">Default</Label>
              {
                group.keywords.map(keywordName => {
                  let key = 'group__keyword-label-' + keywordName;
                  return <Label key={key} className="label-bordered">{ keywordName }</Label>
                })
              }
            </p>
          </Col>
          { group.isDeletePending && <div className="spinner-remove_item"><Spinner/></div> }
          {
            !group.isDeletePending &&
            <Button bsStyle="link" className="btn-delete" onClick={this.deleteGroup.bind(this)}>
              <i className="fa fa-trash"/>
            </Button>
          }
        </ListGroupItem>

        <Collapse id={'group-form' + group.id} in={this.state.open}>
          <div>
            <SpottingGroupItemForm formId={'group' + group.id}
                                   formKey={'group' + group.id}
                                   onSubmit={this.editGroup.bind(this)}
                                   errorMessage={group.errorMessage}
                                   isPending={false} />
          </div>
        </Collapse>

      </section>
    )
  }
}

export default SpottingGroupItem
