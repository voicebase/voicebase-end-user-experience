import React from 'react'
import VbsBase from './Base';

const PLAYER_ID = 'react-jwplayer'

export default class JwPlayer extends VbsBase {
  static displayName = 'JwPlayer';

  static canPlay (url) {
    return true;
  }

  playerId = `${PLAYER_ID}_${Date.now()}`;
  isReady = false;

  componentDidMount () {
    super.componentDidMount()
  }
  load (url) {
    this.player = window.jwplayer(this.playerId).setup({
      file: url,
      primary: 'html5',
      width: this.props.width,
      height: this.props.height
    });
    this.player.onReady(() => {
      this.isReady = true;
    });
    this.player.onComplete(() => this.props.onEnded());
  }
  play () {
    if (this.player.getState() !== 'PLAYING') {
      this.player.play()
    }
  }
  pause () {
    if (this.player.getState() !== 'PAUSED') {
      this.player.pause()
    }
  }
  stop () {
    this.player.stop()
  }
  seekTo (fraction) {
    super.seekTo(fraction);
    this.player.seek(this.getDuration() * fraction);
  }
  setVolume (fraction) {
    this.player.setVolume(fraction)
  }
  getDuration () {
    if (!this.isReady) return null;
    return this.player.getDuration()
  }
  getFractionPlayed () {
    if (!this.isReady) return null;
    return this.player.getPosition() / this.getDuration()
  }
  getFractionLoaded () {
    if (!this.isReady || !this.player.getBuffer) return null;
    return this.player.getBuffer()
  }
  render () {
    return (
      <div id={this.playerId}></div>
    )
  }

}