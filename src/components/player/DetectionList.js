import React, { PropTypes } from 'react'

export default class DetectionList extends React.Component {
  static propTypes = {
    mediaId: PropTypes.string.isRequired,
    utterances: PropTypes.object.isRequired,
    playerState: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired
  };

  calcTimeOffset(time) {
    let timelineWidth = this.props.playerState.timelineWidth;
    let duration = this.props.playerState.duration;
    if (!duration) return 0;

    return ((time * timelineWidth) / duration);
  }

  onClickMarker(time) {
    this.props.actions.setUtteranceTime(this.props.mediaId, time);
  }

  render() {
    let utterances = this.props.utterances;
    let playerState = this.props.playerState;

    return (
      <div className="listing__detection">
        {
          utterances.itemIds.map(utterId => {
            let utterance = utterances.items[utterId];
            let labelStyle = {
              color: utterance.color
            };
            let timelineStyle = {
              width: playerState.timelineWidth + 'px'
            };

            return (
              <div key={'utterance-item' + utterId} className="listing__detection__row blue">
                <span className="listing__detection__label" style={labelStyle}>{utterance.name}</span>
                <div className="listing__detection__container" style={timelineStyle}>
                  {
                    utterance.segments.map((segment, i) => {
                      let start = this.calcTimeOffset(segment.s / 1000);
                      let end = this.calcTimeOffset(segment.e / 1000);

                      let segmentStyles = {
                        left: start + 'px',
                        width: (end - start) + 'px',
                        backgroundColor: utterance.color
                      };

                      return (
                        <a href="#"
                           key={'utterance-marker-' + utterId + '-segment-' + i}
                           className="listing__detection__marker"
                           style={segmentStyles}
                           onClick={this.onClickMarker.bind(this, segment.s / 1000)}
                        />
                      )
                    })
                  }
                </div>
              </div>
            )
          })
        }
      </div>
    )
  }
}
