import React, { PropTypes } from 'react'
import {Modal, ModalBody, ModalFooter, Button} from 'react-bootstrap'

export default class UploadZone extends React.Component {
  static propTypes = {
    children: PropTypes.element.isRequired,
    showForm: PropTypes.bool.isRequired,
    nextTab: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    onSelectTab: PropTypes.func.isRequired
  };

  render () {
    return (
      <div>
        <Modal show={this.props.showForm} onHide={this.props.onClose} dialogClassName="upload-dialog">
          <ModalBody>
            {this.props.children}
          </ModalBody>
          <ModalFooter>
            <Button onClick={this.props.nextTab} bsStyle="success" className="pull-left">Next</Button>
            <Button onClick={this.props.onClose} className="pull-right">Cancel</Button>
          </ModalFooter>
        </Modal>
      </div>
    )
  }
}
