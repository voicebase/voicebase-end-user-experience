import React, { PropTypes } from 'react'
import connectWrapper from '../redux/utils/connect'
import {actions as authActions} from '../redux/modules/auth'

export class AllView extends React.Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    state: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired
  };

  componentWillUpdate(nextProps) {
    if (!nextProps.state.auth.token) {
      this.props.history.pushState(null, '/login')
    }
  }

  signOut() {
    this.props.actions.signOut();
  }

  render () {
    return (
      <div className='container text-center'>
        <h1>This is a all media page!</h1>
        <button type="button" onClick={this.signOut.bind(this)}>Logout</button>
      </div>
    )
  }
}

export default connectWrapper(authActions, AllView)
