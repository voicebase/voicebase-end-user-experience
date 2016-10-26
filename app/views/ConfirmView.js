import React, { PropTypes } from 'react'
import {actions as authActions} from '../redux/modules/auth'
import connectWrapper from '../redux/utils/connect'
import Logo from '../images/voicebase-logo-2.png'

export class ConfirmView extends React.Component {
  static propTypes = {
    actions: PropTypes.object.isRequired
  };

  componentWillMount() {
    this.props.actions.signOut();
  }

  render() {
    return (
      <div className="login-overlay">
        <div className="confirm-email-container">
          <div className="confirm-email-container_logo">
            <img src={Logo} className="img-responsive" />
          </div>
          <h1>Thank you!</h1>
          <h3>Please go to your email inbox and complete the email verification request from VoiceBase</h3>
        </div>
      </div>
    )
  }
}

export default connectWrapper(authActions, ConfirmView)
