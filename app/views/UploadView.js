import React, { PropTypes } from 'react'
import connectWrapper from '../redux/utils/connect'
import actions from '../redux/rootActions'
import UploadZone from '../components/upload/UploadZone'
import UploadContainer from '../components/upload/UploadContainer'

export class UploadView extends React.Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired
  };

  static propTypes = {
    state: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired
  };

  onFinish = () => {
    this.context.router.push('/all');
  };

  getLocalFilesCount () {
    const uploadState = this.props.state.upload;
    const filesIds = uploadState.get('fileIds').filter((id) => {
      const file = uploadState.getIn(['files', id]);
      return !file.get('isPostPending');
    });
    return filesIds.size;
  }

  render () {
    const { state, actions } = this.props;
    const filesCount = this.getLocalFilesCount();

    return (
      <div>
        {filesCount === 0 &&
          <UploadZone actions={actions} />
        }
        {filesCount > 0 &&
          <UploadContainer
            state={state}
            isModal={false}
            onFinish={this.onFinish}
            actions={actions}
          />
        }
      </div>
    )
  }
}

export default connectWrapper(actions, UploadView)
