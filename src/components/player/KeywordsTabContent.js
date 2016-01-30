import React, { PropTypes } from 'react'
import Keywords from './Keywords'
import Transcript from './Transcript'

export class KeywordsTabContent extends React.Component {
  static propTypes = {
    mediaId: PropTypes.string.isRequired,
    mediaState: PropTypes.object.isRequired,
    playerState: PropTypes.object.isRequired,
    markersState: PropTypes.object,
    actions: PropTypes.object.isRequired
  };

  render () {
    return (
      <div>
        <Keywords mediaId={this.props.mediaId}
                  mediaState={this.props.mediaState}
                  actions={this.props.actions} />

        <Transcript mediaId={this.props.mediaId}
                    playerState={this.props.playerState}
                    mediaState={this.props.mediaState}
                    markersState={this.props.markersState}
                    actions={this.props.actions} />
      </div>
    )
  }
}

export default KeywordsTabContent
