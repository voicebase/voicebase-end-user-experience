import React, { PropTypes } from 'react'

export class Marker extends React.Component {
  static propTypes = {
    marker: PropTypes.object.isRequired,
    calcTimeOffset: PropTypes.func.isRequired,
    onSeekMarker: PropTypes.func.isRequired
  };

  seek = () => {
    const { marker, onSeekMarker } = this.props;
    onSeekMarker(marker.time);
  };

  render () {
    const { marker, calcTimeOffset } = this.props;
    let position = calcTimeOffset(marker.time);
    let style = {
      left: position + 'px',
      borderBottomColor: marker.color
    };

    return (
      <a
        href="#"
        className="player__keywords__marker"
        style={style}
        onClick={this.seek}
      />
    )
  }

}

export default Marker
