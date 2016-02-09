import React, { PropTypes } from 'react'

export default class UploadProgress extends React.Component {
  static propTypes = {
    uploadState: PropTypes.object.isRequired,
    pendingFileIds: PropTypes.array.isRequired
  };

  render () {
    let uploadState = this.props.uploadState;
    return (
      <div className="list-group listings listing--processing__list-group" componentClass="ul">
        {
          this.props.pendingFileIds.map(id => {
            let file = uploadState.files[id];

            return (
              <div key={'upload-progress-' + id} className="list-group-item listing listing--processing">
                <h4 className="list-group-item-heading">{file.file.name}</h4>
                <div className="progress">
                  <div className="progress__step active">File uploading</div>
                </div>
              </div>
            )
          })
        }
      </div>
    )
  }
}
