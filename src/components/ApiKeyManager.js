import React, { PropTypes } from 'react'
import { Panel, Button } from 'react-bootstrap'
import ClipboardButton from 'react-clipboard.js'
import { saveAs } from 'filesaverjs'

export class ApiKeyManager extends React.Component {
  static propTypes = {
    authState: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      isCopied: false
    }
  }

  onCopySuccess() {
    this.setState({isCopied: true});
  }

  downloadKey() {
    var blob = new Blob([this.props.authState.token], {type: 'text/plain;charset=utf-8'});
    saveAs(blob, 'voicebase-api-key.txt');
  }

  render () {
    const auth = this.props.authState;

    return (
      <Panel className="auth0-key-manager">
        <form>
          <h4>API Key</h4>

          <div className="form-group">
            <textarea className="form-control" rows="4" readOnly value={auth.token} />
          </div>

          <div className="form-group">Copy or download this key and use it for your application</div>

          <div className="form-group text-warning">
            <strong>Warning!</strong> This key is only is only displayed this one time. It will not be displayed again once you navigate away from this page
          </div>

          <ClipboardButton className="btn btn-success copy-button" data-clipboard-text={auth.token} onSuccess={this.onCopySuccess.bind(this)}>
            {this.state.isCopied ? 'Copied!' : 'Copy to clipboard'}
          </ClipboardButton>
          <Button bsStyle="success" onClick={this.downloadKey.bind(this)}>Download</Button>
        </form>
      </Panel>
    )
  }
}

export default ApiKeyManager
