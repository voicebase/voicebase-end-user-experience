import React, { PropTypes } from 'react'
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap'

export class TextDropzoneFilePreview extends React.Component {
  static propTypes = {
    file: PropTypes.object.isRequired,
    onRemove: PropTypes.func.isRequired
  };

  getTooltip (id) {
    return <Tooltip id={'tooltip-' + id}>Delete file</Tooltip>
  }

  removeFile = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const { file, onRemove } = this.props;
    onRemove(file.id);
  };

  render () {
    const { file } = this.props;
    const id = file.id;

    return (
      <div className="text-dropzone__file-preview">
        <strong>{file.name}</strong>
        <div className="text-dropzone__file-buttons">
          <OverlayTrigger placement="top" overlay={this.getTooltip(id)}>
            <Button bsStyle="link" onClick={this.removeFile}>
              <i className="fa fa-times" />
            </Button>
          </OverlayTrigger>
        </div>
      </div>
    )
  }

}

export default TextDropzoneFilePreview
