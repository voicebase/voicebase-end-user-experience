import React, { PropTypes } from 'react'

export default class UploadPreview extends React.Component {
  static propTypes = {
    uploadState: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired
  };

  componentWillMount() {
  }

  componentWillUnmount() {
  }

  render () {
    return (
      <div>
        tab2
      </div>
    )
  }
}
