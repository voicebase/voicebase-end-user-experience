import React, { PropTypes } from 'react'
import {actions as authActions} from '../redux/modules/auth'
import connectWrapper from '../redux/utils/connect'

export class ApiKeyView extends React.Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    state: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired
  };

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
            <img src={this.props.state.auth.profile.picture} />
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
            Email verified:
          </td>
          <td>
            {this.props.state.auth.profile.email_verified ? 'true' : 'false'}
          </td>
        </tr>
        <tr>
          <td>
            Name:
          </td>
          <td>
            {this.props.state.auth.profile.name}
          </td>
        </tr>
        <tr>
          <td>
            User id:
          </td>
          <td>
            {this.props.state.auth.profile.userId}
          </td>
        </tr>
        <tr>
          <td>
            User key:
          </td>
          <td>
            <textarea rows='4' cols='100' readOnly='true' value={this.props.state.auth.auth0Token}/>
          </td>
        </tr>
        <tr>
          <td>
            API key:
          </td>
          <td>
            <textarea rows='4' cols='100' readOnly='true' value={this.props.state.auth.token}/>
          </td>
        </tr>
        </tbody>
      </table>
     </div>
    )
  }
}

export default connectWrapper(authActions, ApiKeyView)
