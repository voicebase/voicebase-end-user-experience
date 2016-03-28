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
    if (this.props.state.auth.emailVerified) {
      this.props.actions.createKey(this.props.state.auth.token);
    }
  }

  render () {
    return (
     <div>
      <table>
        <tbody>
        <tr>
          <td>
            Image:
          </td>
          <td>
            <img src={this.props.state.auth.picture}></img>
          </td>
        </tr>
        <tr>
          <td>
            Email:
          </td>
          <td>
            {this.props.state.auth.email}
          </td>
        </tr>
         <tr>
          <td>
            Email verified:
          </td>
          <td>
            {this.props.state.auth.emailVerified?'true':'false'}
          </td>
        </tr>
        <tr>
          <td>
            Name:
          </td>
          <td>
            {this.props.state.auth.name}
          </td>
        </tr>
        <tr>
          <td>
            User id:
          </td>
          <td>
            {this.props.state.auth.userId}
          </td>
        </tr>
        <tr>
          <td>
            User key:
          </td>
          <td>
            <textarea rows='4' cols='100' readOnly='true' value={this.props.state.auth.token}/>
          </td>
        </tr>
        <tr>
          <td>
            API key:
          </td>
          <td>
            <textarea rows='4' cols='100' readOnly='true' value={this.props.state.auth.emailVerified?this.props.state.apiKeys.apiKey:'Accept email to view api key'}/>
          </td>
        </tr>
        </tbody>
      </table>
     </div>
    )
  }
}

export default connectWrapper(apiKeyActions, ApiKeyView)
