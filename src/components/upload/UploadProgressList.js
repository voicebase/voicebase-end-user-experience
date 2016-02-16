import React, { PropTypes } from 'react'
import UploadProgress from './UploadProgress'

export default class UploadProgressList extends React.Component {
  static propTypes = {
    uploadState: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired
  };

  componentWillUpdate(nextProps) {
    let uploadState = nextProps.uploadState;
    let processFileIds = uploadState.fileIds.filter(id => uploadState.files[id].isPostComplete);
    processFileIds.forEach(id => {
      let file = uploadState.files[id];
      this.props.actions.removeFile(id);
      this.props.actions.destroyPlayer(id);
      this.props.actions.addProcessingMedia({
        mediaId: file.data.mediaId,
        status: file.data.status,
        metadata: file.data.metadata
      });
    })
  }

  render() {
    let uploadState = this.props.uploadState;
    let pendingFileIds = uploadState.fileIds.filter(id => uploadState.files[id].isPostPending);

    return (
      <div>
        {
          pendingFileIds.length > 0 &&
          <UploadProgress uploadState={uploadState}
                          pendingFileIds={pendingFileIds}
          />
        }
      </div>
    )
  }
}
