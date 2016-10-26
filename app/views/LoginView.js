import React, { PropTypes } from 'react'
import {actions as authActions} from '../redux/modules/auth'
import connectWrapper from '../redux/utils/connect'
import Logo from '../images/voicebase-logo-2.png'
import Spinner from '../components/Spinner'

export class LoginView extends React.Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired
  };

  static propTypes = {
    state: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired
  };

  componentWillMount () {
    this.props.actions.signIn();
  }

  componentWillUpdate(nextProps) {
    let nextAuth = nextProps.state.auth;
    if (nextAuth.token) {
      this.context.router.push('/');
    }
    if (nextAuth.auth0Token && !nextAuth.profile.email_verified) {
      this.context.router.push('/confirm');
    }
  }

  signIn() {
    this.props.actions.signIn();
  }

  render() {
    const auth = this.props.state.auth;

    return (
      <div className="login-overlay">
        <div className="login-content">
          <img src={Logo} className="img-responsive" />
          {(auth.isPending || auth.tokenPending) &&
            <Spinner />
          }
        </div>
      </div>
    )
  }
}

export default connectWrapper(authActions, LoginView)
