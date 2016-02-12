import React, { PropTypes } from 'react'

export default class PlayerDetection extends React.Component {
  static propTypes = {
    utterances: PropTypes.object.isRequired,
    calcTimeOffset: PropTypes.func.isRequired,
    onSeek: PropTypes.func.isRequired
  };

  onClickMarker(startSec) {
    this.props.onSeek(startSec);
  }

  render() {
    let utterances = this.props.utterances;
    return (
      <div className="player__detection">
        {
          utterances.itemIds.map(utterId => {
            let utterance = utterances.items[utterId];

            return (
              <div className="player__detection__row" key={'utterance-marker-row' + utterId}>
                {
                  utterance.segments.map((segment, i) => {
                    let start = this.props.calcTimeOffset(segment.s / 1000);
                    let end = this.props.calcTimeOffset(segment.e / 1000);

                    let segmentStyles = {
                      left: start + 'px',
                      width: (end - start) + 'px',
                      backgroundColor: utterance.color
                    };

                    return (
                      <a href="#"
                         key={'utterance-marker-' + utterId + '-segment-' + i}
                         className="player__detection__marker"
                         style={segmentStyles}
                         onClick={this.onClickMarker.bind(this, segment.s / 1000)}
                      />
                    )
                  })
                }
              </div>
            )
          })
        }
      </div>
    )
  }
}
