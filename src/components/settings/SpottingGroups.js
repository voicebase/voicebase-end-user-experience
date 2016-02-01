import React, { PropTypes } from 'react'
import {Panel, Collapse, Button, ListGroup, Alert} from 'react-bootstrap'
import SpottingGroupItem from './SpottingGroupItem'
import Spinner from '../Spinner'

export class SpottingGroups extends React.Component {
  static propTypes = {
    token: PropTypes.string.isRequired,
    groupsState: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {};
  }

  getHeader() {
    return (
      <div className="panel-heading-inner" onClick={ () => this.setState({ open: !this.state.open })}>
        <h3 className="panel-title pull-left">
          Phrase Spotting Groups <small>{this.props.groupsState.groupIds.length}</small>
        </h3>
        <Button bsStyle="link" className="pull-right no-padding">
          <i className="fa fa-plus"/> Add phrase spotting group
        </Button>
      </div>
    )
  }

  render() {
    let groupsState = this.props.groupsState;
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
            <Collapse in={this.state.open}>
              <ListGroup>
                {
                  groupsState.groupIds.map(groupId => {
                    return (
                      <SpottingGroupItem key={'group' + groupId}
                                         token={this.props.token}
                                         group={this.props.groupsState.groups[groupId]}
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
