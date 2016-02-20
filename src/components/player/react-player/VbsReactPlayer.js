import React from 'react'
import ReactPlayer from 'react-player/lib/ReactPlayer'
import players from './playersList'
import { propTypes, defaultProps } from './props'

const PROGRESS_FREQUENCY = 1000

export default class VbsReactPlayer extends ReactPlayer {
  static propTypes = propTypes;
  static defaultProps = defaultProps;

  static canPlay (url) {
    return players.some(player => player.canPlay(url))
  }

  progress = () => {
    if (this.props.url && this.refs.player) {
      let progress = {}
      const loaded = this.refs.player.getFractionLoaded()
      const played = this.refs.player.getFractionPlayed()
      const duration = this.refs.player.getDuration();

      if (loaded !== null && loaded !== this.prevLoaded) {
        progress.loaded = this.prevLoaded = loaded
      }
      if (played !== null && played !== this.prevPlayed) {
        progress.played = this.prevPlayed = played
      }
      if (progress.loaded || progress.played) {
        this.props.onProgress(progress)
      }
      if (duration && duration > 0) {
        this.props.onDuration(duration);
      }
    }
    this.progressTimeout = setTimeout(this.progress, PROGRESS_FREQUENCY)
  };

  render () {
    const style = {
      width: this.props.width,
      height: this.props.height
    }
    return (
      <div style={style} className={this.props.className}>
        {
          players.map((player) => {
            return this.props.activePlayer === player.displayName && this.renderPlayer(player)
          })
        }
      </div>
    )
  }
}
