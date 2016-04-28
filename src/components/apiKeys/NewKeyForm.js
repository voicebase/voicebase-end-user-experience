import React, { PropTypes } from 'react'
import { Button, Collapse, Well } from 'react-bootstrap'
import ApiKeyManager from './ApiKeyManager'

export class NewKeyForm extends React.Component {
  static propTypes = {
    authState: PropTypes.object.isRequired,
    onGenerateApiKey: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      openForm: false,
      showGeneratedKey: false
    };
  }

  toggleForm() {
    this.setState({
      open: !this.state.open
    });
  }

  hideForm() {
    this.setState({
      open: false,
      showGeneratedKey: false
    });
  }

  onCreateKey() {
    this.props.onGenerateApiKey();
    this.setState({
      showGeneratedKey: true
    });
  }

  render () {
    const auth = this.props.authState;

    return (
      <div>
        <Button bsStyle="success" bsSize="small" className="add-key-btn" onClick={this.toggleForm.bind(this)}>
          <i className="fa fa-plus"/>&nbsp;
          Add new Key
        </Button>
        <Collapse in={this.state.open} className="add-key-collapse-form">
          <div>
            <Well>
              {
                !this.state.showGeneratedKey &&
                <form className="auth0-add-key-form">
                  <div className="form-group">
                    <input className="form-control" type="text" placeholder="Label your key" />
                  </div>
                  <div className="form-group">
                    <select className="form-control">
                      <option disabled>Key type</option>
                      <option>Bearer token</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <select className="form-control">
                      <option disabled>Rights</option>
                      <option>All Access</option>
                    </select>
                  </div>
                  <hr/>
                  <div className="form-group">
                    <Button bsStyle="success" onClick={this.onCreateKey.bind(this)}>
                      {auth.tokenPending && <div>Creating key...</div>}
                      {!auth.tokenPending && <div>Create Key</div>}
                    </Button>
                    <Button className="cancel-button" onClick={this.hideForm.bind(this)}>Cancel</Button>
                  </div>
                </form>
              }
              {
                this.state.showGeneratedKey &&
                  <div>
                    <ApiKeyManager authState={auth} />
                    <Button bsStyle="primary" onClick={this.hideForm.bind(this)}>
                      Done
                    </Button>
                  </div>
                }
            </Well>
          </div>
        </Collapse>
      </div>
    )
  }
}

export default NewKeyForm
