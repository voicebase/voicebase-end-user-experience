import React, { PropTypes } from 'react'
import connectWrapper from '../redux/utils/connect'
import actions from '../redux/rootActions'
import SpottingGroups from '../components/settings/SpottingGroups'

export class AllView extends React.Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    state: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired
  };

  componentWillMount() {
    this.props.actions.getGroups(this.props.state.auth.token);
  }

  render () {
    let state = this.props.state;
    return (
      <div className='content-settings'>
        <div className="content__heading">
          <h3>Settings</h3>
        </div>
        <div className="content__body">
          <SpottingGroups token={this.props.state.auth.token}
                          groupsState={state.groups}
                          actions={this.props.actions}/>
        </div>
      </div>
    )
  }
}

export default connectWrapper(actions, AllView)
