import React, { PropTypes } from 'react'
import {Panel, Collapse, ListGroup, Alert} from 'react-bootstrap'
import SettingsListHeader from './SettingsListHeader'
import SpottingGroupItem from './SpottingGroupItem'
import Spinner from '../Spinner'
import SpottingGroupItemForm from './SpottingGroupItemForm'

export class SpottingGroups extends React.Component {
  static propTypes = {
    token: PropTypes.string.isRequired,
    groupsState: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      open: false,
      openCreate: false
    };
  }

  toggleList() {
    this.setState({ open: !this.state.open });
  }

  expandCreateForm(event) {
    event.preventDefault();
    event.stopPropagation();
    this.setState({
      open: true,
      openCreate: true
    });
  }

  collapseCreateForm() {
    this.setState({
      openCreate: false
    });
  }

  addGroup(values) {
    let keywords = values.keywords.split(',');
    let newGroup = {
      name: values.name,
      keywords
    };
    this.collapseCreateForm();
    this.props.actions.addGroup(this.props.token, newGroup);
  }

  getHeader() {
    let groupsState = this.props.groupsState;
    return (
      <SettingsListHeader title={groupsState.view.title}
                          addButtonLabel={groupsState.view.addButtonLabel}
                          length={groupsState.groupIds.length}
                          isAddPending={groupsState.isAddPending}
                          handleClickHeader={this.toggleList.bind(this)}
                          handleClickAdd={this.expandCreateForm.bind(this)}
      />
    )
  }

  render() {
    let groupsState = this.props.groupsState;

    let initialValueForAdd = {
      name: '',
      description: '',
      isDefault: false,
      keywords: ''
    };
    let keywordsSelectValueForAdd = [];

    return (
      <div>
        { groupsState.isGetPending && <Spinner /> }
        {
          groupsState.errorMessage &&
          <Alert bsStyle="warning">
            {groupsState.errorMessage}
          </Alert>
        }
        {
          !groupsState.isGetPending &&
          <Panel className="panel panel-default panel-settings" header={this.getHeader()}>
            <Collapse id="list-collapse-group" in={this.state.open}>
              <ListGroup>

                <Collapse id="add-collapse-group" in={this.state.openCreate}>
                  <div>
                    <SpottingGroupItemForm formKey={'add-group'}
                                           keywordsSelectValue={keywordsSelectValueForAdd}
                                           initialValues={initialValueForAdd}
                                           onSubmit={this.addGroup.bind(this)}
                                           onCancel={this.collapseCreateForm.bind(this)}
                    />
                  </div>
                </Collapse>

                {
                  groupsState.groupIds.map(groupId => {
                    return (
                      <SpottingGroupItem key={'group' + groupId}
                                         token={this.props.token}
                                         group={groupsState.groups[groupId]}
                                         actions={this.props.actions}/>
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

export default SpottingGroups
