import React, { PropTypes } from 'react'

export default class DetectionListItem extends React.Component {
  static propTypes = {
    segment: PropTypes.object.isRequired,
    color: PropTypes.string.isRequired,
    calcTimeOffset: PropTypes.func.isRequired,
    onClickMarker: PropTypes.func.isRequired
  };

  onClickDetection = () => {
    const { segment, onClickMarker } = this.props;
    const time = segment.s / 1000;
    onClickMarker(time);
  };

  render() {
    const { segment, color, calcTimeOffset } = this.props;
    let start = calcTimeOffset(segment.s / 1000);
    let end = calcTimeOffset(segment.e / 1000);

    let segmentStyles = {
      left: start + 'px',
      width: (end - start) + 'px',
      backgroundColor: color
    };

    return (
      <a
        href="#"
        className="listing__detection__marker"
        style={segmentStyles}
        onClick={this.onClickDetection}
      />
    )
  }
}
