import React, { PropTypes } from 'react'
import ProcessingListItem from './ProcessingListItem'
import UploadProgress from './UploadProgress'

export default class ProcessingList extends React.Component {
  static propTypes = {
    state: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired
  };

  render() {
    let state = this.props.state;
    let uploadState = state.upload;
    let mediaData = state.media.mediaData.data;

    let processFileIds = uploadState.fileIds.filter(id => uploadState.files[id].isPostComplete);
    let pendingFileIds = uploadState.fileIds.filter(id => uploadState.files[id].isPostPending);

    return (
      <div>
        {
          pendingFileIds.length > 0 &&
          <UploadProgress uploadState={uploadState}
                          pendingFileIds={pendingFileIds}
          />
        }

        {
          processFileIds.length > 0 &&
          <div className="list-group listings listing--processing__list-group">
            {
              processFileIds.map(id => {
                let file = uploadState.files[id];

                return (
                  <ProcessingListItem key={'upload-progress-' + id}
                                      token={state.auth.token}
                                      fileId={id}
                                      fileState={file}
                                      mediaDataState={mediaData[file.mediaId]}
                                      actions={this.props.actions}
                  />
                )
              })
            }
          </div>
        }
      </div>
    )
  }
}
