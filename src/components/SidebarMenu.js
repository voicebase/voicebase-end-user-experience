import React, { PropTypes } from 'react'
import {Nav, NavItem} from 'react-bootstrap'
import Logo from '../images/voicebase-logo-2.png'
import CounterLabel from '../components/CounterLabel'

export class SidebarMenu extends React.Component {
  static propTypes = {
    state: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
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
    let mediaIds = this.props.state.media.mediaList.get('mediaIds');
    if (mediaIds.size > 0) {
      content = <NavItem active={this.isItemActive('/all')} onClick={this.redirect.bind(this, '/all')}>
        All My Files
        <CounterLabel value={mediaIds.size}/>
      </NavItem>
    }
    return content;
  }

  getLastUploadedItem() {
    let content = null;
    let lastUploadedIds = this.props.state.media.mediaList.get('lastUploadedIds');
    if (lastUploadedIds.size > 0) {
      content = <NavItem active={this.isItemActive('/last-upload')} onClick={this.redirect.bind(this, '/last-upload')}>
        Last Upload
        <CounterLabel value={lastUploadedIds.size}/>
      </NavItem>
    }
    return content;
  }

  redirect(path) {
    this.props.history.pushState(null, path);
  }

  render () {
    return (
      <div className='sidebar__content'>
        <div className="logo-wrapper">
          <img className="img-responsive" src={Logo} alt="VoiceBase logo" />
        </div>

        <Nav stacked>
          <NavItem active={this.isItemActive('/upload')} className="upload-files" onClick={this.redirect.bind(this, '/upload')}>
            Upload Files
          </NavItem>
          {this.getAllItem()}
          {this.getLastUploadedItem()}
        </Nav>

        <Nav stacked className="bottom">
          <NavItem active={this.isItemActive('/account')} onClick={this.redirect.bind(this, '/account')}>My Account</NavItem>
          <NavItem active={this.isItemActive('/settings')} onClick={this.redirect.bind(this, '/settings')}>Settings</NavItem>
          <NavItem onClick={this.signOut.bind(this)}>Logout</NavItem>
        </Nav>
      </div>
    )
  }
}

export default SidebarMenu
