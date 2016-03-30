import React, { PropTypes } from 'react'
import classnames from 'classnames';

export default class KeywordTopic extends React.Component {
  static propTypes = {
    topicName: PropTypes.string.isRequired,
    isActive: PropTypes.bool.isRequired,
    onClickTopic: PropTypes.func.isRequired
  };

  shouldComponentUpdate (nextProps) {
    return this.props.isActive !== nextProps.isActive;
  }

  render () {
    let activeClass = classnames({active: this.props.isActive});

    return (
      <li className={activeClass} onClick={this.props.onClickTopic}>
        <a href="javascript:void(0)">{this.props.topicName}</a>
      </li>
    )
  }
}
