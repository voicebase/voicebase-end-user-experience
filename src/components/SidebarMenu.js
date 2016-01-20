import React, { PropTypes } from 'react'
import {Nav, NavItem} from 'react-bootstrap'
import Logo from '../images/voicebase-logo-2.png'

export class SidebarMenu extends React.Component {
  static propTypes = {
    state: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired
  };

  signOut() {
    this.props.actions.signOut();
  }

  render () {
    return (
      <div className='sidebar__content'>
        <div className="logo-wrapper">
          <img className="img-responsive" src={Logo} alt="VoiceBase logo" />
        </div>

        <Nav stacked>
          <NavItem href="/upload" active className="upload-files">Upload Files</NavItem>
          <NavItem href="/all">
            All My Files
            <span className="text-muted">124</span>
          </NavItem>
          <NavItem href="/last-upload">
            Last Upload
            <span className="text-muted">3</span>
          </NavItem>
        </Nav>

        <Nav stacked className="bottom">
          <NavItem href="/account">My Account</NavItem>
          <NavItem href="/settings">Settings</NavItem>
          <NavItem href="#" onClick={this.signOut.bind(this)}>Logout</NavItem>
        </Nav>
      </div>
    )
  }
}

export default SidebarMenu
