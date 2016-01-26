import React, { PropTypes } from 'react'
import Player from './Player';

export class VbsPlayerApp extends React.Component {
  static propTypes = {
    token: PropTypes.string.isRequired,
    mediaId: PropTypes.string.isRequired,
    mediaState: PropTypes.object.isRequired,
    playerState: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired
  };

  componentWillMount() {
    let url = 'http://demo.voicsebasejwplayer.dev4.sibers.com/media/washington.mp3';
    this.props.actions.createPlayer(this.props.mediaId, url);
  }

  render () {
    return (
      <div className="vbs-player-app">
        <Player mediaId={this.props.mediaId}
                playerState={this.props.playerState.players[this.props.mediaId] || {loading: true}}
                actions={this.props.actions} />
      </div>
    )
  }
}

export default VbsPlayerApp
