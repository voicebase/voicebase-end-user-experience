import React, { PropTypes } from 'react'
import VbsReactPlayer from './react-player/VbsReactPlayer'
import { ButtonGroup, Button, DropdownButton, Dropdown, MenuItem } from 'react-bootstrap'
import Spinner from '../Spinner';
import VolumeSlider from './VolumeSlider';

export class Player extends React.Component {
  static propTypes = {
    mediaId: PropTypes.string.isRequired,
    playerType: PropTypes.string.isRequired,
    playerState: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = { // moving slider; state is faster than redux
      seeking: false,
      seekValue: 0,
      volume: 0
    };
  }

  togglePlay() {
    (this.props.playerState.playing) ? this.onPause() : this.onPlay();
  }

  onDuration(duration) {
    this.props.actions.setDuration(this.props.mediaId, duration);
  }

  onPlay() {
    this.props.actions.play(this.props.mediaId);
  }

  onPause() {
    this.props.actions.pause(this.props.mediaId);
  }

  onProgress({played, loaded}) {
    if (played && this.props.playerState.played !== played) {
      this.props.actions.setPosition(this.props.mediaId, played);
    }
    if (loaded && this.props.playerState.loaded !== loaded) {
      this.props.actions.setBuffered(this.props.mediaId, loaded);
    }
  }

  calcPosition(event) {
    let timelineLeftOffset = this.refs.timeline.getBoundingClientRect().left;
    let clickLeftOffset = event.pageX;
    let timelineWidth = event.currentTarget.clientWidth;
    return ((clickLeftOffset - timelineLeftOffset)) / timelineWidth;
  }

  onSeekMouseDown(event) {
    let position = this.calcPosition(event);
    this.setState({
      seeking: true,
      seekValue: position
    });
  }

  onSeekMouseMove(event) {
    if (!this.state.seeking) {
      return false;
    }
    let position = this.calcPosition(event);
    this.setState({
      seekValue: position
    });
  };

  onSeekMouseUp(event) {
    this.setState({ seeking: false });
    let position = this.calcPosition(event);
    this.refs.player.seekTo(parseFloat(position));
    this.props.actions.setPosition(this.props.mediaId, position);
    if (this.props.playerType === 'JwPlayer') {
      this.onPlay();
    }
  }

  onVolumeChange(value) {
    console.log(value);
    this.setState({
      volume: value
    });
  }

  onSelect(event) {
    event.preventDefault();
    event.stopPropagation()
    event.nativeEvent.stopImmediatePropagation();
    event.nativeEvent.stopPropagation()
    event.nativeEvent.preventDefault()
  }

  render () {
    let playerState = this.props.playerState;
    if (!playerState || playerState.loading) {
      return (
        <div className="vbs-player"><Spinner/></div>
      );
    }

    let sliderValue = (!this.state.seeking) ? (playerState.played * 100) : (this.state.seekValue * 100);
    let sliderStyles = {left: sliderValue + '%'};
    let progressStyles = {width: sliderValue + '%'};
    let bufferStyles = {width: (playerState.loaded * 100) + '%'};

    return (
      <div className="vbs-player">
        <div className="player">
          <ButtonGroup className="player__buttons">
            <Button bsStyle="primary" onClick={this.togglePlay.bind(this)}>
              {playerState.playing && <i className="fa fa-fw fa-pause" />}
              {!playerState.playing && <i className="fa fa-fw fa-play" />}
            </Button>
            <Button>
              <i className="fa fa-fw fa-share" />
            </Button>
          </ButtonGroup>

          <div className="player__timeline show-keywords"
               onMouseDown={this.onSeekMouseDown.bind(this)}
               onMouseMove={this.onSeekMouseMove.bind(this)}
               onMouseUp={this.onSeekMouseUp.bind(this)}>
            <div className="player__timeline__slider" style={sliderStyles}></div>
            <div ref="timeline" className="player__timeline__progress">
              <div className="player__timeline__progress__bg">
                <div className="player__timeline__buffer" style={bufferStyles}></div>
                <div className="player__timeline__progress__fg" style={progressStyles}></div>
              </div>

              <div className="player__keywords">
              </div>
              <div className="player__detection">
                <div className="player__detection__row">
                </div>
                <div className="player__detection__row">
                </div>
              </div>

            </div>
          </div>

          <ButtonGroup className="player__buttons">
            <Dropdown id={'volume-dropdown-' + this.props.mediaId}>
              <Button bsRole="toggle"><i className="fa fa-fw fa-volume-up"/></Button>

              <div bsRole="menu" className="dropdown-menu volume-dropdown-menu pull-right">
                <VolumeSlider orientation="vertical"
                              value={this.state.volume}
                              onChange={this.onVolumeChange.bind(this)}/>
              </div>
            </Dropdown>
            <Button><i className="fa fa-fw fa-cloud-download" /></Button>
          </ButtonGroup>
        </div>

        <VbsReactPlayer
          ref='player'
          activePlayer={this.props.playerType}
          width={0}
          height={0}
          url={playerState.url}
          playing={playerState.playing}
          volume={playerState.volume}
          onProgress={this.onProgress.bind(this)}
          onEnded={this.onPause.bind(this)}
          onDuration={this.onDuration.bind(this)}
        />
      </div>
    )
  }
}

export default Player
