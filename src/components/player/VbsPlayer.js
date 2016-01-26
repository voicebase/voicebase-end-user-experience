import React, { PropTypes } from 'react'
import Spinner from '../Spinner';

export class VbsPlayer extends React.Component {
  static propTypes = {
    token: PropTypes.string.isRequired,
    mediaId: PropTypes.string.isRequired,
    state: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired
  };

  render () {
    let url = 'http://demo.voicsebasejwplayer.dev4.sibers.com/media/washington.mp3';
    let mediaData = this.props.state.mediaData[this.props.mediaId];

    return (
      <div>
        123
      </div>
    )
  }
}

export default VbsPlayer
