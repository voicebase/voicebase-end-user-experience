import React, {PropTypes} from 'react'
import classnames from 'classnames'

export class Spinner extends React.Component {
  static propTypes = {
    isSmallItem: PropTypes.bool,
    isMediumItem: PropTypes.bool
  };

  render () {
    let classes = classnames('spinner', {
      'item-medium': this.props.isMediumItem,
      'item-small': this.props.isSmallItem
    })
    return (
      <div className={classes}>
        <div className="rect1"></div>
        <div className="rect2"></div>
        <div className="rect3"></div>
        <div className="rect4"></div>
        <div className="rect5"></div>
      </div>
    )
  }
}

export default Spinner
