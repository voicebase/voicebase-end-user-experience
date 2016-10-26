import React, { PropTypes } from 'react'
import {Nav, NavItem} from 'react-bootstrap'
import Logo from '../images/voicebase-logo-2.png'
import CounterLabel from '../components/CounterLabel'
import SidebarLink from './SidebarLink'

export class SidebarMenu extends React.Component {
  static propTypes = {
    state: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired
  };

  signOut = () => {
    this.props.actions.signOut();
  };

  getAllItem() {
    let mediaIds = this.props.state.media.mediaList.get('mediaIds');
    if (mediaIds.size <= 0) return null;

    return (
      <SidebarLink url='/all'>
        <div>
          All My Files
          <CounterLabel value={mediaIds.size} />
        </div>
      </SidebarLink>
    )
  }

  getLastUploadedItem() {
    let lastUploadedIds = this.props.state.media.mediaList.get('lastUploadedIds');
    if (lastUploadedIds.size <= 0) return null;

    return (
      <SidebarLink url='/last-upload'>
        <div>
          Last Upload
          <CounterLabel value={lastUploadedIds.size} />
        </div>
      </SidebarLink>
    )
  }

  redirect(path) {
    this.context.router.push(path);
  }

  render () {
    return (
      <div className='sidebar__content'>
        <div className="logo-wrapper">
          <img className="img-responsive" src={Logo} alt="VoiceBase logo" />
        </div>

        <Nav stacked>
          <SidebarLink url='/upload' className="upload-files">
            <div>Upload Files</div>
          </SidebarLink>
          {this.getAllItem()}
          {this.getLastUploadedItem()}
        </Nav>

        <Nav stacked className="bottom">
          <SidebarLink url='/settings'>
            <div>Settings</div>
          </SidebarLink>
          <NavItem onClick={this.signOut}>Logout</NavItem>
        </Nav>
      </div>
    )
  }
}

export default SidebarMenu
