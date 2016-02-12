import React, { PropTypes } from 'react'
import {Panel, Button} from 'react-bootstrap'

export default class UploadPanel extends React.Component {
  static propTypes = {
    children: PropTypes.element.isRequired,
    showForm: PropTypes.bool.isRequired,
    nextButtonText: PropTypes.string.isRequired,
    nextTab: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    onSelectTab: PropTypes.func.isRequired
  };

  getFooter() {
    return (
      <div>
        <Button onClick={this.props.nextTab} bsStyle="success" className="pull-left">Next</Button>
        <Button onClick={this.props.onClose} className="pull-right">Cancel</Button>
      </div>
    )
  }

  render () {
    return (
      <div>
        <Panel className="upload-panel"
               collapsible
               expanded={this.props.showForm}
        >
          {this.props.children}
          <div className="upload-panel__footer">
            <Button onClick={this.props.nextTab} bsStyle="success" className="pull-left">{this.props.nextButtonText}</Button>
            <Button onClick={this.props.onClose} className="pull-right">Cancel</Button>
          </div>
        </Panel>
      </div>
    )
  }
}
