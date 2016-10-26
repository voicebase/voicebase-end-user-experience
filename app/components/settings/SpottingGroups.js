import React, { PropTypes } from 'react'
import {Panel, Collapse, ListGroup, Alert, Button} from 'react-bootstrap'
import SpottingGroupItem from './SpottingGroupItem'
import Spinner from '../Spinner'
import SpottingGroupItemForm from './SpottingGroupItemForm'
import { parseReactSelectValues } from '../../common/Common'

export class SpottingGroups extends React.Component {
  static propTypes = {
    token: PropTypes.string.isRequired,
    groupsState: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      openCreate: false
    };
  }

  expandCreateForm = (event) => {
    event.preventDefault();
    event.stopPropagation();
    this.setState({
      openCreate: true
    });
  };

  collapseCreateForm = () => {
    this.setState({
      openCreate: false
    });
  };

  addGroup = (values) => {
    let keywords = parseReactSelectValues(values.keywords);
    let newGroup = {
      name: values.name,
      keywords
    };
    this.collapseCreateForm();
    this.props.actions.addGroup(this.props.token, newGroup);
  };

  render() {
    let groupsState = this.props.groupsState;

    let initialValueForAdd = {
      name: '',
      description: '',
      isDefault: false,
      keywords: ''
    };
    let keywordsSelectValueForAdd = [];
    let activeGroup = groupsState.activeGroup;

    return (
      <div>
        {groupsState.isGetPending && <Spinner />}
        {groupsState.errorMessage &&
          <Alert bsStyle="warning">
            {groupsState.errorMessage}
          </Alert>
        }
        {!groupsState.isGetPending &&
          <div>
            {groupsState.isAddPending && <div className="btn-add-settings"><Spinner /></div>}
            {!groupsState.isAddPending &&
              <Button bsStyle="link" className="btn-add" onClick={this.expandCreateForm}>
                <i className="fa fa-plus" />&nbsp;{groupsState.view.addButtonLabel}
              </Button>
            }

            <Collapse id="add-collapse-group" in={this.state.openCreate}>
              <div>
                <SpottingGroupItemForm
                  formKey={'add-group'}
                  keywordsSelectValue={keywordsSelectValueForAdd}
                  initialValues={initialValueForAdd}
                  onSubmit={this.addGroup}
                  onCancel={this.collapseCreateForm}
                />
              </div>
            </Collapse>

            <Panel className="panel panel-default panel-settings">
              <ListGroup>
                {groupsState.groupIds.map(groupId => {
                  return (
                    <SpottingGroupItem
                      key={'group' + groupId}
                      token={this.props.token}
                      group={groupsState.groups[groupId]}
                      isActive={activeGroup === groupId}
                      actions={this.props.actions}
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

export default SpottingGroups
