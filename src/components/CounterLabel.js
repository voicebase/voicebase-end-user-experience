import React, { PropTypes } from 'react'

export class CounterLabel extends React.Component {
  static propTypes = {
    value: PropTypes.number.isRequired
  };

  render () {
    return (
      <span className="text-muted">{this.props.value}</span>
    )
  }
}

export default CounterLabel
