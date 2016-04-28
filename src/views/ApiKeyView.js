import React, { PropTypes } from 'react'
import {actions as authActions} from '../redux/modules/auth'
import connectWrapper from '../redux/utils/connect'
import ApiKeysList from '../components/apiKeys/ApiKeysList'
import NewKeyForm from '../components/apiKeys/NewKeyForm'

export class ApiKeyView extends React.Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    state: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired
  };

  componentWillMount() {
    this.props.actions.getApiKeys(this.props.state.auth.auth0Token);
  }

  onGenerateApiKey() {
    this.props.actions.createToken(this.props.state.auth.auth0Token);
  }

  render () {
    return (
     <div>
       <div className="content__heading">
         <h3>
           API Key Management
         </h3>
         <NewKeyForm authState={this.props.state.auth}
                     onGenerateApiKey={this.onGenerateApiKey.bind(this)}
         />
       </div>

       <ApiKeysList authState={this.props.state.auth}
       />
     </div>
    )
  }
}

export default connectWrapper(authActions, ApiKeyView)
