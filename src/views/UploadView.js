import React, { PropTypes } from 'react'
import connectWrapper from '../redux/utils/connect'
import actions from '../redux/rootActions'
import UploadZone from '../components/upload/UploadZone'
import UploadContainer from '../components/upload/UploadContainer'

export class UploadView extends React.Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    state: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired
  };

  onFinish() {
    this.props.history.pushState(null, '/all');
  }

  render () {
    let uploadState = this.props.state.upload;

    return (
      <div>
        {
          uploadState.fileIds.length === 0 &&
          <UploadZone actions={this.props.actions} />
        }
        {
          uploadState.fileIds.length > 0 &&
          <UploadContainer state={this.props.state}
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
