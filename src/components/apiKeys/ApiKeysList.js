import React, { PropTypes } from 'react'
import { Panel, Table, OverlayTrigger, Tooltip } from 'react-bootstrap'
import { months } from '../../common/months'
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
          <Panel className="keys-list-container">
            <Table className="keys-list">
                <thead>
                <tr>
                  <th>
                    <span>KEY REFERENCE</span>
                    <OverlayTrigger placement="right" overlay={this.getTooltip()}>
                      <i className="fa fa-question-circle tooltip-icon"/>
                    </OverlayTrigger>
                  </th>
                  <th>DATE CREATED</th>
                </tr>
                </thead>
                <tbody>
                {
                  keys.map((key, i) => {
                    let dateLabel = '-';
                    if (key.issued) {
                      const dateObj = new Date(key.issued);
                      const day = dateObj.getDate();
                      const month = months[dateObj.getMonth() + 1].short;
                      const year = dateObj.getFullYear();
                      dateLabel = `${month} ${day}, ${year}`;
                    }

                    return (
                      <tr key={'active-key' + i}>
                        <td>
                          <code>...{key.lastSix}</code>
                        </td>
                        <td>
                          {dateLabel}
                        </td>
                      </tr>
                    )
                  })
                }
                </tbody>
              </Table>
          </Panel>
        }
      </div>
    )
  }
}

export default ApiKeysList
