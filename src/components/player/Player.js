import React, { PropTypes } from 'react'
import VbsReactPlayer from './react-player/VbsReactPlayer'
import { ButtonGroup, Button, Popover, OverlayTrigger } from 'react-bootstrap'
import Spinner from '../Spinner';
import VolumeSlider from './VolumeSlider';
import { parseTime } from '../../common/Common';

export class Player extends React.Component {
  static propTypes = {
    mediaId: PropTypes.string.isRequired,
    playerType: PropTypes.string.isRequired,
    mediaState: PropTypes.object,
    markersState: PropTypes.object,
    playerState: PropTypes.object.isRequired,
    hasNextKeywordButton: PropTypes.bool.isRequired,
    hasDownloadButton: PropTypes.bool.isRequired,
    actions: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = { // moving slider; state is faster than redux
      seeking: false,
      seekValue: 0,
      volume: 100
    };
  }

  componentWillMount() {
    if (!this.props.mediaState) {
      return false;
    }
    let duration = this.props.mediaState.data.metadata.duration;
    if (duration) {
      this.onDuration(duration);
    }
  }

  componentDidUpdate() {
    let markersState = this.props.markersState;
    if (markersState && markersState.justCreated) {
      this.seekToFirstMarker(markersState);
    }
  }

  togglePlay() {
    (this.props.playerState.playing) ? this.onPause() : this.onPlay();
  }

  onDuration(duration) {
    if (duration && duration > 0) {
      this.props.actions.setDuration(this.props.mediaId, duration);
    }
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

  calcMarkerOffset(time) {
    let timelineWidth = this.refs.timeline.clientWidth;
    let duration = this.props.playerState.duration;
    if (!duration) return 0;

    return ((time * timelineWidth) / duration);
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
    this.seekOnPosition(position);
  }

  onSeekMarker(markerTime) {
    this.seekOnPosition(markerTime / this.props.playerState.duration);
  }

  seekToFirstMarker(markersState) {
    let firstMarker = markersState.markers[markersState.markerIds[0]];
    this.props.actions.clearJustCreatedMarkers(this.props.mediaId);
    setTimeout(() => {
      this.onSeekMarker(firstMarker.time);
    }, 100);
  }

  seekToNextMarker() {
    let isLastMarker = true;
    let markersState = this.props.markersState;
    for (let markerId of markersState.markerIds) {
      let marker = markersState.markers[markerId];
      const ONE_SECOND = 1;
      let markerPosition = (marker.time - ONE_SECOND) / this.props.playerState.duration;
      if (markerPosition > this.props.playerState.played) {
        this.seekOnPosition(markerPosition);
        isLastMarker = false;
        return false;
      }
    }
    if (isLastMarker) {
      let firstMarker = markersState.markers[markersState.markerIds[0]];
      this.onSeekMarker(firstMarker.time);
    }
  }

  /*
  * position is a percent value / 100
  * */
  seekOnPosition(position) {
    this.refs.player.seekTo(parseFloat(position));
    this.props.actions.setPosition(this.props.mediaId, position);
    if (this.props.playerType === 'JwPlayer') {
      this.onPlay();
    }
  }

  onVolumeChange(value) {
    this.setState({
      volume: value
    });
  }

  getSlider() {
    let id = 'volume-slider' + this.props.mediaId;
    return (
      <Popover id={id} className="volume-slider">
        <VolumeSlider orientation="vertical"
                      value={this.state.volume}
                      onChange={this.onVolumeChange.bind(this)}/>
      </Popover>
    )
  }

  getMarkers() {
    let markersState = this.props.markersState;
    if (!markersState) return null;

    return markersState.markerIds.map(markerId => {
      let marker = markersState.markers[markerId];
      let position = this.calcMarkerOffset(marker.time);
      let offsetStyle = {left: position + 'px'};
      return (
        <a href="#"
           key={'marker-' + markerId}
           className="player__keywords__marker"
           style={offsetStyle}
           onClick={this.onSeekMarker.bind(this, marker.time)} />
      )
    })
  }

  render () {
    let playerState = this.props.playerState;
    if (!playerState || playerState.loading) {
      return (
        <div className="vbs-player"><Spinner/></div>
      );
    }

    let duration = this.props.playerState.duration;
    let timePercentValue = (!this.state.seeking) ? (playerState.played) : (this.state.seekValue)
    let sliderValue = timePercentValue * 100;
    let sliderStyles = {left: sliderValue + '%'};
    let progressStyles = {width: sliderValue + '%'};
    let bufferStyles = {width: (playerState.loaded * 100) + '%'};

    let parsedDuration = (duration) ? parseTime(duration) : '--:--';
    let parsedPlayedTime = parseTime(duration * timePercentValue);

    let volume = (this.props.playerType === 'JwPlayer') ? this.state.volume : this.state.volume / 100;

    return (
      <div className="vbs-player">
        <div className="player">
          <ButtonGroup className="player__buttons">
            <Button bsStyle="primary" onClick={this.togglePlay.bind(this)}>
              {playerState.playing && <i className="fa fa-fw fa-pause" />}
              {!playerState.playing && <i className="fa fa-fw fa-play" />}
            </Button>
            {
              this.props.hasNextKeywordButton &&
              <Button onClick={this.seekToNextMarker.bind(this)}>
                <i className="fa fa-fw fa-play fa-rotate-270" />
                <i className="fa fa-share fa-topleft" />
              </Button>
            }
          </ButtonGroup>

          <div className="player__timeline show-keywords">
            <div onMouseDown={this.onSeekMouseDown.bind(this)}
                 onMouseMove={this.onSeekMouseMove.bind(this)}
                 onMouseUp={this.onSeekMouseUp.bind(this)}>
              <div className="player__timeline__slider" style={sliderStyles}></div>
              <div ref="timeline" className="player__timeline__progress">
                <div className="player__timeline__progress__bg">
                  <div className="player__timeline__buffer" style={bufferStyles}></div>
                  <div className="player__timeline__progress__fg" style={progressStyles}></div>
                </div>
              </div>
            </div>

            <div className="player__keywords">
              {this.getMarkers()}
            </div>

            <div className="player__detection">
              <div className="player__detection__row">
              </div>
              <div className="player__detection__row">
              </div>
            </div>

          </div>

          <div className="player__time">
            {parsedPlayedTime} / {parsedDuration}
          </div>

          <ButtonGroup className="player__buttons">
            <OverlayTrigger trigger="click" placement="bottom" overlay={this.getSlider()}>
              <Button><i className="fa fa-fw fa-volume-up"/></Button>
            </OverlayTrigger>
            { this.props.hasDownloadButton && <Button><i className="fa fa-fw fa-cloud-download" /></Button> }
          </ButtonGroup>
        </div>

        <VbsReactPlayer
          ref='player'
          activePlayer={this.props.playerType}
          width={0}
          height={0}
          url={playerState.url}
          playing={playerState.playing}
          onPlay={this.onPlay.bind(this)}
          volume={volume}
          onProgress={this.onProgress.bind(this)}
          onEnded={this.onPause.bind(this)}
          onDuration={this.onDuration.bind(this)}
        />
      </div>
    )
  }
}

export default Player
