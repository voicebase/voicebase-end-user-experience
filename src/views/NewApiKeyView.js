import React, { PropTypes } from 'react'
import {actions as authActions} from '../redux/modules/auth'
import connectWrapper from '../redux/utils/connect'
import ApiKeyManager from '../components/apiKeys/ApiKeyManager'

export class ApiKeyView extends React.Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    state: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired
  };

  componentWillMount() {
    this.props.actions.createToken(this.props.state.auth.auth0Token);
  }

  render () {
    return (
      <div>
        <div className="content__heading">
          <h3>
            API Key Management
          </h3>
        </div>

        <ApiKeyManager authState={this.props.state.auth} />
      </div>
    )
  }
}

export default connectWrapper(authActions, ApiKeyView)
