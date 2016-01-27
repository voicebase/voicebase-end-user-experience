// https://github.com/whoisandie/react-rangeslider
/*
* https://github.com/whoisandie/react-rangeslider/issues/3
* Not compatible with react 0.14 yet.
* Rewrite for new react version
* */
import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom'

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.substr(1);
}

function maxmin(pos, min, max) {
  if (pos < min) { return min; }
  if (pos > max) { return max; }
  return pos;
}

const constants = {
  orientation: {
    horizontal: {
      dimension: 'width',
      direction: 'left',
      coordinate: 'x'
    },
    vertical: {
      dimension: 'height',
      direction: 'top',
      coordinate: 'y'
    }
  }
};

export class VolumeSlider extends React.Component {
  static propTypes = {
    min: PropTypes.number,
    max: PropTypes.number,
    step: PropTypes.number,
    value: PropTypes.number,
    orientation: PropTypes.string,
    onChange: PropTypes.func,
    className: PropTypes.string
  };

  static defaultProps = {
    min: 0,
    max: 100,
    step: 1,
    value: 0,
    orientation: 'horizontal'
  };

  state = {
    limit: 0,
    grab: 0
  };

  // Add window resize event listener here
  componentDidMount() {
    let { orientation } = this.props;
    let dimension = capitalize(constants.orientation[orientation].dimension);
    const sliderPos = ReactDOM.findDOMNode(this.refs.slider)['offset' + dimension];
    const handlePos = ReactDOM.findDOMNode(this.refs.handle)['offset' + dimension]
    this.setState({
      limit: sliderPos - handlePos,
      grab: handlePos / 2
    });
  }

  handleSliderMouseDown = (e) => {
    let value, { onChange } = this.props; // eslint-disable-line one-var
    if (!onChange) return;

    value = this.position(e);
    onChange && onChange(value);
  };

  handleKnobMouseDown = () => {
    document.addEventListener('mousemove', this.handleDrag);
    document.addEventListener('mouseup', this.handleDragEnd);
  };

  handleDrag = (e) => {
    let value, { onChange } = this.props; // eslint-disable-line one-var
    if (!onChange) return;

    value = this.position(e);
    onChange && onChange(value);
  };

  handleDragEnd = () => {
    document.removeEventListener('mousemove', this.handleDrag);
    document.removeEventListener('mouseup', this.handleDragEnd);
  };

  handleNoop = (e) => {
    e.stopPropagation();
    e.preventDefault();
  };

  getPositionFromValue = (value) => {
    let percentage, pos;
    let { limit } = this.state;
    let { min, max } = this.props;
    percentage = (value - min) / (max - min);
    pos = Math.round(percentage * limit);

    return pos;
  };

  getValueFromPosition = (pos) => {
    let percentage, value;
    let { limit } = this.state;
    let { orientation, min, max, step } = this.props;
    percentage = (maxmin(pos, 0, limit) / (limit || 1));

    if (orientation === 'horizontal') {
      value = step * Math.round(percentage * (max - min) / step) + min;
    } else {
      value = max - (step * Math.round(percentage * (max - min) / step) + min);
    }

    return value;
  };

  position = (e) => {
    let pos, value, { grab } = this.state; // eslint-disable-line one-var
    let { orientation } = this.props;
    const node = ReactDOM.findDOMNode(this.refs.slider);
    const coordinateStyle = constants.orientation[orientation].coordinate;
    const directionStyle = constants.orientation[orientation].direction;
    const coordinate = e['client' + capitalize(coordinateStyle)];
    const direction = node.getBoundingClientRect()[directionStyle];

    pos = coordinate - direction - grab;
    value = this.getValueFromPosition(pos);

    return value;
  };

  coordinates = (pos) => {
    let value, fillPos, handlePos;
    let { limit, grab } = this.state;
    let { orientation } = this.props;

    value = this.getValueFromPosition(pos);
    handlePos = this.getPositionFromValue(value);

    if (orientation === 'horizontal') {
      fillPos = handlePos + grab;
    } else {
      fillPos = limit - handlePos + grab;
    }

    return {
      fill: fillPos,
      handle: handlePos
    };
  };

  render() {
    let {value, orientation} = this.props;

    let dimension = constants.orientation[orientation].dimension;
    let direction = constants.orientation[orientation].direction;

    let position = this.getPositionFromValue(value);
    let coords = this.coordinates(position);

    let fillStyle = {[dimension]: `${coords.fill}px`};
    let handleStyle = {[direction]: `${coords.handle}px`};
    let classes = 'rangeslider rangeslider-' + orientation;
    return (
      <div
        ref="slider"
        className={classes}
        onMouseDown={this.handleSliderMouseDown}
        onClick={this.handleNoop}>
        <div
          ref="fill"
          className="rangeslider__fill"
          style={fillStyle} ></div>
        <div
          ref="handle"
          className="rangeslider__handle"
          onMouseDown={this.handleKnobMouseDown}
          onClick={this.handleNoop}
          style={handleStyle} ></div>
      </div>
    );
  }
}

export default VolumeSlider;
