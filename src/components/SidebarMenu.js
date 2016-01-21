import React, { PropTypes } from 'react'
import {Nav, NavItem} from 'react-bootstrap'
import Logo from '../images/voicebase-logo-2.png'
import CounterLabel from '../components/CounterLabel'

export class SidebarMenu extends React.Component {
  static propTypes = {
    state: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired
  };

  signOut() {
    this.props.actions.signOut();
  }

  isItemActive(path) {
    return this.props.state.router.path === path;
  }

  getAllItem() {
    let content = null;
    let mediaIds = this.props.state.media.mediaIds;
    if (mediaIds.length > 0) {
      content = <NavItem href="/all" active={this.isItemActive('/all')}>
        All My Files
        <CounterLabel value={mediaIds.length}/>
      </NavItem>
    }
    return content;
  }

  getLastUploadedItem() {
    let content = null;
    let lastUploadedIds = this.props.state.media.lastUploadedIds;
    if (lastUploadedIds.length > 0) {
      content = <NavItem href="/last-upload" active={this.isItemActive('/last-upload')}>
        Last Upload
        <CounterLabel value={lastUploadedIds.length}/>
      </NavItem>
    }
    return content;
  }

  render () {
    return (
      <div className='sidebar__content'>
        <div className="logo-wrapper">
          <img className="img-responsive" src={Logo} alt="VoiceBase logo" />
        </div>

        <Nav stacked>
          <NavItem href="/upload" active={this.isItemActive('/upload')} className="upload-files">
            Upload Files
          </NavItem>
          {this.getAllItem()}
          {this.getLastUploadedItem()}
        </Nav>

        <Nav stacked className="bottom">
          <NavItem href="/account" active={this.isItemActive('/account')}>My Account</NavItem>
          <NavItem href="/settings" active={this.isItemActive('/settings')}>Settings</NavItem>
          <NavItem href="#" onClick={this.signOut.bind(this)}>Logout</NavItem>
        </Nav>
      </div>
    )
  }
}

export default SidebarMenu
