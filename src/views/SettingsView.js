import React, { PropTypes } from 'react'
import connectWrapper from '../redux/utils/connect'
import actions from '../redux/rootActions'
import {Tabs, Tab} from 'react-bootstrap'
import SpottingGroups from '../components/settings/SpottingGroups'
import Predictions from '../components/settings/Predictions'
import Detections from '../components/settings/Detections'
import Numbers from '../components/settings/Numbers'

export class SettingsView extends React.Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    state: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired
  };

  componentWillMount() {
    this.props.actions.getGroups(this.props.state.auth.token);
    this.props.actions.getItems(this.props.state.auth.token, 'predictions');
    this.props.actions.getItems(this.props.state.auth.token, 'detection');
    this.props.actions.getItems(this.props.state.auth.token, 'numbers');
  }

  getTabTitle(state, idsField) {
    let ids = state.get(idsField);
    let isGetPending = state.get('isGetPending');
    return (
      <div>
        {state.getIn(['view', 'title'])}&nbsp;
        {
          !isGetPending &&
          <span className="text-muted">{ids.size}</span>
        }
      </div>
    )
  }

  render () {
    let state = this.props.state;

    return (
      <div className='content-settings'>
        <div className="content__heading">
          <h3>Settings</h3>
        </div>
        <Tabs>
          <Tab eventKey={0} title={this.getTabTitle(state.settings.groups, 'groupIds')}>
            <SpottingGroups token={this.props.state.auth.token}
                            groupsState={state.settings.groups.toJS()}
                            actions={this.props.actions}
            />
          </Tab>

          <Tab eventKey={1} title={this.getTabTitle(state.settings.items.get('predictions'), 'itemIds')}>
            <Predictions token={this.props.state.auth.token}
                         state={state.settings.items.get('predictions').toJS()}
                         actions={this.props.actions}
            />
          </Tab>

          <Tab eventKey={2} title={this.getTabTitle(state.settings.items.get('detection'), 'itemIds')}>
            <Detections token={this.props.state.auth.token}
                        state={state.settings.items.get('detection').toJS()}
                        actions={this.props.actions}
            />
          </Tab>

          <Tab eventKey={3} title={this.getTabTitle(state.settings.items.get('numbers'), 'itemIds')}>
            <Numbers token={this.props.state.auth.token}
                     state={state.settings.items.get('numbers').toJS()}
                     actions={this.props.actions}
            />
          </Tab>
        </Tabs>
      </div>
    )
  }
}

export default connectWrapper(actions, SettingsView)
