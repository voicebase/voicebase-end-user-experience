import React, { PropTypes } from 'react'
import connectWrapper from '../redux/utils/connect'
import actions from '../redux/rootActions'
import UploadZone from '../components/upload/UploadZone'

export class UploadView extends React.Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    state: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired
  };

  onAddFiles() {
    this.props.history.pushState(null, '/all');
  }

  render () {
    return (
      <div className='container text-center'>
        <UploadZone actions={this.props.actions} onAddFiles={this.onAddFiles.bind(this)} />
      </div>
    )
  }
}

export default connectWrapper(actions, UploadView)
