import React, { PropTypes } from 'react'
import connectWrapper from '../redux/utils/connect'
import actions from '../redux/rootActions'
import {Tabs, Tab} from 'react-bootstrap'
import SpottingGroups from '../components/settings/SpottingGroups'
import Predictions from '../components/settings/Predictions'
import Detections from '../components/settings/Detections'
import Numbers from '../components/settings/Numbers'
import Vocabularies from '../components/settings/Vocabularies'
import {version} from 'voicebase-player'

const versionApp = typeof VoiceBaseDemoAppVersion !== 'undefined' ? VoiceBaseDemoAppVersion : 'Demo App'

export class SettingsView extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  static propTypes = {
    history: PropTypes.object.isRequired,
    state: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired
  };

  displayVersion = () => this.setState({showVersion: !this.state.showVersion})

  componentWillMount() {
    let state = this.props.state;
    this.props.actions.getGroups(this.props.state.auth.token);
    if (state.settings.items.getIn(['predictions', 'view', 'enabled'])) {
      this.props.actions.getItems(this.props.state.auth.token, 'predictions');
    }
    if (state.settings.items.getIn(['detection', 'view', 'enabled'])) {
      this.props.actions.getItems(this.props.state.auth.token, 'detection');
    }
    if (state.settings.items.getIn(['numbers', 'view', 'enabled'])) {
      this.props.actions.getItems(this.props.state.auth.token, 'numbers');
    }
    if (state.settings.items.getIn(['vocabularies', 'view', 'enabled'])) {
      this.props.actions.getItems(this.props.state.auth.token, 'vocabularies');
    }
  }

  getTabTitle(state, idsField) {
    let ids = state.get(idsField);
    let isGetPending = state.get('isGetPending');
    return (
      <div>
        {state.getIn(['view', 'title'])}&nbsp;
        {!isGetPending &&
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
          <h3 onClick={this.displayVersion}>Settings</h3>
          {this.state.showVersion && <div style={{position: 'absolute', top: 0, right: 0, width: '100%', textAlign: 'right'}}>{versionApp}<div>{version}</div></div>}
        </div>
        <Tabs id='content-settings-tabs'>
          <Tab eventKey={0} title={this.getTabTitle(state.settings.groups, 'groupIds')}>
            <SpottingGroups
              token={this.props.state.auth.token}
              groupsState={state.settings.groups.toJS()}
              actions={this.props.actions}
            />
          </Tab>

          {state.settings.items.getIn(['predictions', 'view', 'enabled']) &&
            <Tab eventKey={1} title={this.getTabTitle(state.settings.items.get('predictions'), 'itemIds')}>
              <Predictions
                token={this.props.state.auth.token}
                state={state.settings.items.get('predictions').toJS()}
                actions={this.props.actions}
              />
            </Tab>
          }

          {state.settings.items.getIn(['detection', 'view', 'enabled']) &&
            <Tab eventKey={2} title={this.getTabTitle(state.settings.items.get('detection'), 'itemIds')}>
              <Detections
                token={this.props.state.auth.token}
                state={state.settings.items.get('detection').toJS()}
                actions={this.props.actions}
              />
            </Tab>
          }

          {state.settings.items.getIn(['numbers', 'view', 'enabled']) &&
            <Tab eventKey={3} title={this.getTabTitle(state.settings.items.get('numbers'), 'itemIds')}>
              <Numbers
                token={this.props.state.auth.token}
                state={state.settings.items.get('numbers').toJS()}
                actions={this.props.actions}
              />
            </Tab>
          }

          {state.settings.items.getIn(['vocabularies', 'view', 'enabled']) &&
            <Tab eventKey={4} title={this.getTabTitle(state.settings.items.get('vocabularies'), 'itemIds')}>
              <Vocabularies
                token={this.props.state.auth.token}
                state={state.settings.items.get('vocabularies').toJS()}
                actions={this.props.actions}
              />
            </Tab>
          }

        </Tabs>
      </div>
    )
  }
}

export default connectWrapper(actions, SettingsView)
