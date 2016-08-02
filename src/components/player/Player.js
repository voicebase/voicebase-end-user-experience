import React, { PropTypes } from 'react'
import classnames from 'classnames'
import VbsReactPlayer from './react-player/VbsReactPlayer'
import { ButtonGroup, Button, Popover, OverlayTrigger } from 'react-bootstrap'
import Spinner from '../Spinner';
import VolumeSlider from './VolumeSlider';
import PlayerSpeakers from './PlayerSpeakers';
import Marker from './Marker';
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
    isShowKeywordsMarkers: PropTypes.bool.isRequired,
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
    const media = this.props.mediaState;
    if (!media) {
      return false;
    }
    let duration = 0;
    if (media.metadata && media.metadata.length && media.metadata.length.milliseconds) {
      duration = media.metadata.length.milliseconds / 1000;
    }
    if (duration) {
      this.onDuration(duration);
    }
  }

  componentDidUpdate() {
    let markersState = this.props.markersState;
    if (markersState && markersState.justCreated) {
      this.seekToFirstMarker(markersState);
    }
    // save timeline width for player
    let playerState = this.props.playerState;
    if (playerState && !playerState.timelineWidth && this.refs.timeline && this.refs.timeline.clientWidth) {
      this.props.actions.setTimelineWidth(this.props.mediaId, this.refs.timeline.clientWidth);
    }
    // move to actve utterance
    if (playerState && playerState.utteranceTime !== null) {
      this.seekToUtterance(playerState.utteranceTime);
    }
  }

  togglePlay = () => {
    (this.props.playerState.playing) ? this.onPause() : this.onPlay();
  };

  onDuration = (duration) => {
    if (duration && duration > 0 && this.props.playerState.duration !== duration) {
      this.props.actions.setDuration(this.props.mediaId, duration);
    }
  };

  onPlay = () => {
    this.props.actions.play(this.props.mediaId);
  };

  onPause = () => {
    if (this.props.playerState.loaded !== 0) {
      this.props.actions.pause(this.props.mediaId);
    }
  };

  onProgress = ({played, loaded}) => {
    if (played && this.props.playerState.played !== played) {
      this.props.actions.setPosition(this.props.mediaId, played);
    }
    if (loaded && this.props.playerState.loaded !== loaded) {
      this.props.actions.setBuffered(this.props.mediaId, loaded);
    }
  };

  calcPosition(event) {
    let timelineLeftOffset = this.refs.timeline.getBoundingClientRect().left;
    let clickLeftOffset = event.pageX;
    let timelineWidth = event.currentTarget.clientWidth;
    return ((clickLeftOffset - timelineLeftOffset)) / timelineWidth;
  }

  calcTimeOffset = (time) => {
    let timelineWidth = this.refs.timeline && this.refs.timeline.clientWidth || 0;
    let duration = this.props.playerState.duration;
    if (!duration) return 0;

    return ((time * timelineWidth) / duration);
  };

  onSeekMouseDown = (event) => {
    let position = this.calcPosition(event);
    this.setState({
      seeking: true,
      seekValue: position
    });
  };

  onSeekMouseMove = (event) => {
    if (!this.state.seeking) {
      return false;
    }
    let position = this.calcPosition(event);
    this.setState({
      seekValue: position
    });
  };

  onSeekMouseUp = (event) => {
    this.setState({ seeking: false });
    let position = this.calcPosition(event);
    this.seekOnPosition(position);
  };

  onSeekMarker = (markerTime) => {
    let duration = this.props.playerState.duration;
    let position = (duration) ? markerTime / duration : 0;
    this.seekOnPosition(position);
  };

  seekToFirstMarker(markersState) {
    let firstMarker = markersState.markers[markersState.markerIds[0]];
    this.props.actions.clearJustCreatedMarkers(this.props.mediaId);
    setTimeout(() => {
      this.onSeekMarker(firstMarker.time);
    }, 100);
  }

  seekToNextMarker = () => {
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
  };

  seekToUtterance(time) {
    this.props.actions.clearUtteranceTime(this.props.mediaId);
    setTimeout(() => {
      this.onSeekMarker(time);
    }, 0);
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

  onVolumeChange = (value) => {
    this.setState({
      volume: value
    });
  };

  getSlider() {
    let id = 'volume-slider' + this.props.mediaId;
    return (
      <Popover id={id} className="volume-slider">
        <VolumeSlider
          orientation="vertical"
          value={this.state.volume}
          onChange={this.onVolumeChange}
        />
      </Popover>
    )
  }

  getMarkers() {
    let markersState = this.props.markersState;
    if (!markersState) return null;

    return markersState.markerIds.map(markerId => {
      let marker = markersState.markers[markerId];
      return (
        <Marker
          key={'marker-' + markerId}
          marker={marker}
          calcTimeOffset={this.calcTimeOffset}
          onSeekMarker={this.onSeekMarker}
        />
      )
    })
  }

  fullscreenPlayer = () => {
    this.props.actions.setFullscreen(this.props.mediaId, true);
  };

  exitFullscreen = () => {
    this.props.actions.setFullscreen(this.props.mediaId, false);
    setTimeout(() => this.forceUpdate(), 100); // for re-rendering markers
  };

  render () {
    let playerState = this.props.playerState;
    if (!playerState || playerState.loading) {
      return (
        <div className="vbs-player"><Spinner /></div>
      );
    }

    let playerClases = classnames('vbs-player', {
      'vbs-player--video': playerState.type === 'video',
      'vbs-player--fullscreen': playerState.isFullscreen
    });

    let playerOriginalClasses = classnames('vbs-player__original', {
      'vbs-player__original--video': playerState.type === 'video',
      'vbs-player__original--audio': playerState.type === 'audio'
    });

    let mediaState = this.props.mediaState;
    let duration = this.props.playerState.duration;
    let timePercentValue = (!this.state.seeking) ? (playerState.played) : (this.state.seekValue);
    let sliderValue = timePercentValue * 100;
    let sliderStyles = {left: sliderValue + '%'};
    let progressStyles = {width: sliderValue + '%'};
    let bufferStyles = {width: (playerState.loaded * 100) + '%'};

    let parsedDuration = (duration) ? parseTime(duration) : '--:--';
    let parsedPlayedTime = parseTime(duration * timePercentValue);

    let volume = (this.props.playerType === 'JwPlayer') ? this.state.volume : this.state.volume / 100;

    let speakers = null;
    let transcriptSpeakers = null;
    if (mediaState) {
      if (mediaState.transcriptSpeakers.length > 0) {
        speakers = mediaState.speakers;
        transcriptSpeakers = mediaState.transcriptSpeakers;
      }
    }

    let hasMarkers = this.props.markersState && this.props.markersState.markerIds && this.props.markersState.markerIds.length > 0;
    let isLoaded = playerState.loaded === 0;

    return (
      <div className={playerClases}>
        <div className={playerOriginalClasses}>
          <VbsReactPlayer
            ref='player'
            activePlayer={this.props.playerType}
            width='100%'
            height='100%'
            url={playerState.url}
            playing={playerState.playing}
            onPlay={this.onPlay}
            volume={volume}
            onProgress={this.onProgress}
            onEnded={this.onPause}
            onDuration={this.onDuration}
          />
          {playerState.type === 'video' && !playerState.isFullscreen &&
            <a href="#" className="vbs-player__original__fullscreen-btn" onClick={this.fullscreenPlayer}>
              <i className="fa fa-arrows-alt" />
            </a>
          }
        </div>
        <div className="player">
          <ButtonGroup className="player__buttons">
            <Button bsStyle="primary" onClick={this.togglePlay}>
              {playerState.playing && isLoaded && <i className="fa fa-fw fa-circle-o-notch fa-spin" />}
              {playerState.playing && !isLoaded && <i className="fa fa-fw fa-pause" />}
              {!playerState.playing && <i className="fa fa-fw fa-play" />}
            </Button>
            {this.props.hasNextKeywordButton &&
              <Button onClick={this.seekToNextMarker} disabled={!hasMarkers} >
                <i className="fa fa-fw fa-play fa-rotate-270" />
                <i className="fa fa-share fa-topleft" />
              </Button>
            }
          </ButtonGroup>

          <div className="player__timeline show-keywords">
            <div
              onMouseDown={this.onSeekMouseDown}
              onMouseMove={this.onSeekMouseMove}
              onMouseUp={this.onSeekMouseUp}
            >
              <div className="player__timeline__slider" style={sliderStyles}></div>
              <div ref="timeline" className="player__timeline__progress">
                <div className="player__timeline__progress__bg">
                  <div className="player__timeline__buffer" style={bufferStyles}></div>
                  {!speakers &&
                    <div className="player__timeline__progress__fg" style={progressStyles}></div>
                  }
                  {speakers &&
                    <PlayerSpeakers
                      speakers={speakers}
                      transcriptSpeakers={transcriptSpeakers}
                      calcTimeOffset={this.calcTimeOffset}
                      duration={duration}
                    />
                  }
                </div>
              </div>
            </div>

            {this.props.isShowKeywordsMarkers &&
              <div className="player__keywords">
                {this.getMarkers()}
              </div>
            }
          </div>

          <div className="player__time">
            {parsedPlayedTime} / {parsedDuration}
          </div>

          <ButtonGroup className="player__buttons">
            <OverlayTrigger trigger="click" placement={playerState.isFullscreen ? 'top' : 'bottom'} rootClose overlay={this.getSlider()}>
              <Button><i className="fa fa-fw fa-volume-up" /></Button>
            </OverlayTrigger>
            {this.props.hasDownloadButton && <Button><i className="fa fa-fw fa-cloud-download" /></Button>}
            {playerState.isFullscreen && <Button onClick={this.exitFullscreen}>Exit</Button>}
          </ButtonGroup>
        </div>
      </div>
    )
  }
}

export default Player
