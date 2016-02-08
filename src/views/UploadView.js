import React, { PropTypes } from 'react'
import connectWrapper from '../redux/utils/connect'
import actions from '../redux/rootActions'
import UploadZone from '../components/upload/UploadZone'
import UploadModal from '../components/upload/UploadModal'

export class UploadView extends React.Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    state: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired
  };

  render () {
    let state = this.props.state;
    return (
      <div className='container text-center'>
        <UploadZone actions={this.props.actions} />
        <UploadModal state={state}
                     actions={this.props.actions}
        />
      </div>
    )
  }
}

export default connectWrapper(actions, UploadView)
