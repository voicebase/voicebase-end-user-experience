import React from 'react'
import ReactPlayer from 'react-player/lib/ReactPlayer'
import players from './playersList'
import { propTypes, defaultProps } from './props'

export default class VbsReactPlayer extends ReactPlayer {
  static propTypes = propTypes;
  static defaultProps = defaultProps;

  static canPlay (url) {
    return players.some(player => player.canPlay(url))
  }

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
