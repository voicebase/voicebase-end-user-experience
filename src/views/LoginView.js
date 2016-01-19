import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import {actions as authActions} from '../redux/modules/auth'
import {Panel} from 'react-bootstrap'
import Logo from '../images/voicebase-logo-2.png'
import LoginForm from '../components/LoginForm'

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
      this.props.history.pushState(null, '/all')
    }
  }

  signIn(credentials) {
    this.props.actions.signIn(credentials);
  }

  setRemember(isRemember) {
    this.props.actions.setRemember(isRemember);
  }

  render() {
    return (
      <div className="login-overlay">
        <div className="login-content">
          <img src={Logo} className="img-responsive"/>
          <Panel>
            <LoginForm onSubmit={this.signIn.bind(this)}
                       handleRemember={this.setRemember.bind(this)}
                       isRemember={this.props.state.auth.isRemember}
                       errorMessage={this.props.state.auth.errorMessage}
                       isPending={this.props.state.auth.isPending} />
          </Panel>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  state
});

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(authActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginView)
