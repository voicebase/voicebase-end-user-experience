import React, { PropTypes } from 'react'
import {actions as authActions} from '../redux/modules/auth'
import connectWrapper from '../redux/utils/connect'
import {Panel} from 'react-bootstrap'
import Logo from '../images/voicebase-logo-2.png'

export class LoginView extends React.Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    state: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
  }

  componentWillUpdate(nextProps) {
    if (nextProps.state.auth.token) {
      this.props.history.pushState(null, '/');
    }
  }

  showLock() {
    this.props.actions.showLock(window.Auth0Lock);
  }

  render() {
    return (
      <div className="login-overlay">
        <div className="login-content">
          <img src={Logo} className="img-responsive"/>
          <Panel>
            <a onClick={this.showLock.bind(this)} className="btn btn-primary btn-lg btn-login btn-block">I Dare You to Sign In</a>
          </Panel>
        </div>
      </div>
    )
  }
}

export default connectWrapper(authActions, LoginView)
