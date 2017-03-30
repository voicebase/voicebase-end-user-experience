import React, { PropTypes } from 'react'

export default class UploadProgress extends React.Component {
  static propTypes = {
    uploadState: PropTypes.object.isRequired
  };

  render () {
    const uploadState = this.props.uploadState;
    const pendingFileIds = uploadState.fileIds.filter(id => uploadState.files[id].isPostPending);
    if (pendingFileIds.length === 0) return null;

    return (
      <div className="list-group listings listing--processing__list-group">
        {pendingFileIds.map(id => {
          const file = uploadState.files[id];

          return (
            <div key={'upload-progress-' + id} className="list-group-item listing listing--processing">
              <h4 className="list-group-item-heading">{file.file.name}</h4>
              <div className="progress">
                <div className="progress__step active">File uploading</div>
              </div>
            </div>
          )
        })}
      </div>
    )
  }
}
