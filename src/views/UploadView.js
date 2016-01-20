import React, { PropTypes } from 'react'
import connectWrapper from '../redux/utils/connect'
import {actions as authActions} from '../redux/modules/auth'

export class AllView extends React.Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    state: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired
  };

  render () {
    return (
      <div className='container text-center'>
        <h1>Upload View</h1>
      </div>
    )
  }
}

export default connectWrapper(authActions, AllView)
