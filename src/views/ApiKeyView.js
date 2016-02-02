import React, { PropTypes } from 'react'
import connectWrapper from '../redux/utils/connect'
import ApiKeyForm from '../components/ApiKeyForm'
//import {actions as authActions} from '../redux/modules/auth'
import {actions as apiKeyActions} from '../redux/modules/apiKeys'

export class ApiKeyView extends React.Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    state: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
  }

  createKey() {
    let token = this.props.state.auth.token;
    this.props.actions.createKey(token);
  }

  render () {
    return (
      <ApiKeyForm onSubmit={this.createKey.bind(this)} />
    )
  }
}

export default connectWrapper(apiKeyActions, ApiKeyView)
