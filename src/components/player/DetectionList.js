import React, { PropTypes } from 'react'
import DetectionListItem from './DetectionListItem'

export default class DetectionList extends React.Component {
  static propTypes = {
    mediaId: PropTypes.string.isRequired,
    utterances: PropTypes.object.isRequired,
    playerState: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired
  };

  calcTimeOffset = (time) => {
    let timelineWidth = this.props.playerState.timelineWidth;
    let duration = this.props.playerState.duration;
    if (!duration) return 0;

    return ((time * timelineWidth) / duration);
  };

  onClickMarker = (time) => {
    this.props.actions.setUtteranceTime(this.props.mediaId, time);
  };

  render() {
    let utterances = this.props.utterances;
    let playerState = this.props.playerState;

    let timelineStyle = {
      width: playerState.timelineWidth + 'px'
    };

    return (
      <div className="listing__detection">
        {utterances.itemIds.map(utterId => {
          let utterance = utterances.items[utterId];
          let labelStyle = {
            color: utterance.color
          };

          return (
            <div key={'utterance-item' + utterId} className="listing__detection__row blue">
              <span className="listing__detection__label" style={labelStyle}>{utterance.name}</span>
              <div className="listing__detection__container" style={timelineStyle}>
                {utterance.segments.map((segment, i) => {
                  return (
                    <DetectionListItem
                      key={'utterance-marker-' + utterId + '-segment-' + i}
                      segment={segment}
                      color={utterance.color}
                      calcTimeOffset={this.calcTimeOffset}
                      onClickMarker={this.onClickMarker}
                    />
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    )
  }
}
