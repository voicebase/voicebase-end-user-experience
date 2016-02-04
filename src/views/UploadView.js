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

  render () {
    return (
      <div className='container text-center'>
        <UploadZone state={this.props.state}
                  actions={this.props.actions}
        />
      </div>
    )
  }
}

export default connectWrapper(actions, UploadView)
