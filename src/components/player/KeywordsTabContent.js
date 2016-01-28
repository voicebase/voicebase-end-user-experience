import React, { PropTypes } from 'react'
import Keywords from './Keywords'

export class KeywordsTabContent extends React.Component {
  static propTypes = {
    mediaId: PropTypes.string.isRequired,
    mediaState: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired
  };

  render () {
    return (
      <div>
        <Keywords mediaId={this.props.mediaId}
                  mediaState={this.props.mediaState}
                  actions={this.props.actions} />
      </div>
    )
  }
}

export default KeywordsTabContent
