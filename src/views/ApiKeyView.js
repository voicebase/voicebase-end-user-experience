import React, { PropTypes } from 'react'
import connectWrapper from '../redux/utils/connect'
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

  componentDidMount(nextProps) {
    this.props.actions.createKey(this.props.state.auth.token);
  }

  render () {
    return (
     <div>
      <p>Happy days are here again, buddy!</p>
      <table>
        <tr>
          <td>
            Image:
          </td>
          <td>
            <img src={this.props.state.auth.profile.picture}></img>
          </td>
        </tr>
        <tr>
          <td>
            Email:
          </td>
          <td>
            {this.props.state.auth.profile.email}
          </td>
        </tr>
        <tr>
          <td>
            Name:
          </td>
          <td>
            {this.props.state.auth.profile.nickname}
          </td>
        </tr>
        <tr>
          <td>
            User id:
          </td>
          <td>
            {this.props.state.auth.profile.user_id}
          </td>
        </tr>
        <tr>
          <td>
            User key:
          </td>
          <td>
            <textarea rows='4' cols='100'>{this.props.state.auth.token}</textarea>
          </td>
        </tr>
        <tr>
          <td>
            API key:
          </td>
          <td>
            <textarea rows='4' cols='100'>{this.props.state.apiKeys.apiKey}</textarea>
          </td>
        </tr>
      </table>
     </div>
    )
  }
}

export default connectWrapper(apiKeyActions, ApiKeyView)
