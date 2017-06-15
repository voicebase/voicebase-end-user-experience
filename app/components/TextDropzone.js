import React, { PropTypes } from 'react'
import { Button } from 'react-bootstrap'
import Dropzone from 'react-dropzone'
import NotificationSystem from 'react-notification-system'
import TextDropzoneFilePreview from './TextDropzoneFilePreview'

export class TextDropzone extends React.Component {
  static propTypes = {
    value: PropTypes.array,
    onChange: PropTypes.func
  };

  acceptFileFormats = ['.txt'];

  showError(message) {
    if (typeof message !== 'string') {
      console.error('TextDropzone: received non-string message', message)
      message = String(message)
    }
    this.refs.notificationSystem.addNotification({
      message,
      level: 'error'
    })
  }

  validate (files) {
    let isValid = true;
    files.forEach((file) => {
      let format = file.name.substring(file.name.lastIndexOf('.'));
      var isFileAllow = this.acceptFileFormats.filter(_format => _format === format);
      if (isFileAllow.length === 0) {
        this.showError(`Media in ${format} format is not supported. Supported extensions are ${this.acceptFileFormats.join(', ')}`);
        isValid = false;
      }
    });
    return isValid;
  }

  onDrop = (files) => {
    let isValid = this.validate(files);
    if (isValid) {
      files = files.map((file, i) => {
        file.id = i;
        return file;
      });
      this.props.onChange(files);
    }
  };

  removeFile = (id) => {
    const { value: files } = this.props;
    const newFiles = files.filter(file => file.id !== id);
    this.props.onChange(newFiles);
  };

  showFiles (files) {
    return (
      <div className="text-dropzone__files">
        {files.map((file) => {
          return (
            <TextDropzoneFilePreview
              key={'file-preview-' + file.id}
              file={file}
              onRemove={this.removeFile}
            />
          )
        })}
      </div>
    )
  }

  render () {
    const { value: files } = this.props;
    const hasFiles = files && files.length > 0;

    return (
      <div>
        <Dropzone className="text-dropzone" activeClassName="text-dropzone--active" ref="dropzone" onDrop={this.onDrop}>
          <div className="text-dropzone__zone">
            <div className="text-dropzone__message">
              <i className="fa fa-cloud-upload" />
              <div>Drag &amp; drop or</div>
              <Button bsStyle="success">Click here to browse</Button>
              <div> for a .txt file of custom terms</div>
            </div>
            {hasFiles && this.showFiles(files)}
          </div>
        </Dropzone>
        <NotificationSystem ref="notificationSystem" />
      </div>
    )
  }

}

export default TextDropzone
