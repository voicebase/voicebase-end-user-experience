import React, { PropTypes } from 'react'
import {NavItem} from 'react-bootstrap'

export class SidebarLink extends React.Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired
  };

  static propTypes = {
    url: PropTypes.string.isRequired,
    children: PropTypes.object.isRequired,
    className: PropTypes.string
  };

  isItemActive(path) {
    return this.context.router.isActive(path);
  }

  onRedirect = () => {
    const { url } = this.props;
    this.context.router.push(url);
  };

  render () {
    const { children, url, className } = this.props;
    return (
      <NavItem className={className} active={this.isItemActive(url)} onClick={this.onRedirect}>
        {children}
      </NavItem>
    )
  }

}

export default SidebarLink
