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

  onFinish() {
    this.context.router.push('/all');
  }

  render () {
    let fileIds = this.props.state.upload.get('fileIds');

    return (
      <div>
        {fileIds.size === 0 &&
          <UploadZone actions={this.props.actions} />
        }
        {fileIds.size > 0 &&
          <UploadContainer
            state={this.props.state}
            isModal={false}
            onFinish={this.onFinish.bind(this)}
            actions={this.props.actions}
          />
        }
      </div>
    )
  }
}

export default connectWrapper(actions, UploadView)
