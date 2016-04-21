import React, { PropTypes } from 'react'
import { Panel, Button, Table, OverlayTrigger, Tooltip } from 'react-bootstrap'
import Spinner from '../Spinner'

export class ApiKeysList extends React.Component {
  static propTypes = {
    authState: PropTypes.object.isRequired
  };

  getTooltip() {
    return (
      <Tooltip id="apikey-tooltip">
        Voicebase only remembers the last 6 digits to help you with API key management.
      </Tooltip>
    )
  }

  render () {
    const auth = this.props.authState;
    const keys = auth.keys.keys;

    return (
      <div>
        {auth.keys.isPending && <Spinner />}
        {
          !auth.keys.isPending &&
          <Panel className="auth0-key-manager">
            <div className="generate-container">
              <h4>Generate an API Key</h4>
              <Button bsStyle="success" className="generate-button">Go</Button>
            </div>

            <h4>Active API Keys</h4>

            <div className="keys-list-container">
              <Table>
                <thead>
                <tr>
                  <th>Date Generated</th>
                  <th>
                    <span>Key Reference</span>
                    <OverlayTrigger placement="right" overlay={this.getTooltip()}>
                      <i className="fa fa-question-circle tooltip-icon"/>
                    </OverlayTrigger>
                  </th>
                </tr>
                </thead>
                <tbody>
                {
                  keys.map((key, i) => {
                    return (
                      <tr key={'active-key' + i}>
                        <td>
                          Jan 11, 2016
                        </td>
                        <td>
                          ...{key.lastSix}
                        </td>
                      </tr>
                    )
                  })
                }
                </tbody>
              </Table>
            </div>
          </Panel>
        }
      </div>
    )
  }
}

export default ApiKeysList
