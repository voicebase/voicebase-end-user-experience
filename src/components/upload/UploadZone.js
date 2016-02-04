import React, { PropTypes } from 'react'
import Dropzone from 'react-dropzone'

export default class UploadZone extends React.Component {
  static propTypes = {
    state: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired
  };

  onDrop (files) {
    console.log(files);
  }

  render () {
    return (
      <Dropzone className="upload-dropzone" ref="dropzone" onDrop={this.onDrop}>
        <div className="empty-overlay">
          <div className="empty-overlay__message">
            <i className="fa fa-cloud-upload" />
            <h2>No files uploaded yet</h2>
            <p><strong>Drag and drop</strong> audio from your computer or <strong>click</strong> to upload</p>
          </div>
        </div>
      </Dropzone>
    )
  }
}
