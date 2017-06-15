import React, { PropTypes } from 'react'
import Dropzone from 'react-dropzone'
import NotificationSystem from 'react-notification-system'
import { Button } from 'react-bootstrap'

export default class UploadZone extends React.Component {
  static propTypes = {
    actions: PropTypes.object.isRequired
  };

  showError(message) {
    if (typeof message !== 'string') {
      console.error('UploadZone: received non-string message', message)
      message = String(message)
    }
    this.refs.notificationSystem.addNotification({
      message,
      level: 'error'
    })
  }

  acceptFileFormats = ['.mp3', '.mp4', '.flv', '.wmv', '.avi', '.mpeg', '.aac', '.aiff', '.au', '.ogg', '.3gp', '.flac', '.ra', '.m4a', '.wma', '.m4v', '.caf', '.cf', '.mov', '.mpg', '.webm', '.wav', '.asf', '.amr'];

  validate (files) {
    let isValid = true;
    // validate count of files
    if (files.length > 3) {
      this.showError('The 3 file limit has been exceeded. Please select 3 or fewer files at a time.');
      isValid = false;
    }
    files.forEach(file => {
      // validate file format
      let format = file.name.substring(file.name.lastIndexOf('.'));
      var isFileAllow = this.acceptFileFormats.filter(_format => _format === format);
      if (isFileAllow.length === 0) {
        this.showError(`Media in ${format} format is not supported. Supported extensions are ${this.acceptFileFormats.join(', ')}`);
        isValid = false;
      }
      // validate file size
      if (file.size === 0) {
        this.showError(`Sorry, the file ${file.name} you selected is empty and can not be uploaded`);
        isValid = false;
      }
      if (file.size / 1024 / 1024 > 100) {
        this.showError('Sorry, the max file upload = 100 MB');
        isValid = false;
      }
    });

    return isValid;
  }

  onDrop = (files) => {
    console.log(files);
    let isValid = this.validate(files);
    if (isValid) {
      this.props.actions.addFiles(files);
    }
  };

  render () {
    return (
      <div>
        <Dropzone className="upload-dropzone" ref="dropzone" onDrop={this.onDrop} activeClassName="upload-dropzone--active">
          <div className="empty-overlay">
            <div className="empty-overlay__message">
              <i className="fa fa-cloud-upload" />
              <p>Drag &amp; drop the audio file</p>
              <div className="or-divider"><span>or</span></div>
              <Button bsStyle="success">Click here to browse</Button>
            </div>
          </div>
        </Dropzone>
        <NotificationSystem ref="notificationSystem" />
      </div>
    )
  }
}
