import React, { PropTypes } from 'react'
import connectWrapper from '../redux/utils/connect'
import actions from '../redux/rootActions'
import {Grid, Row, Col} from 'react-bootstrap'
import SidebarMenu from '../components/SidebarMenu'
import Spinner from '../components/Spinner'

export class AppLayout extends React.Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    children: PropTypes.element,
    state: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired
  };

  componentWillMount() {
    this.redirectIfNotLoggedIn();
    const token = this.props.state.auth.token;
    if (token) {
      this.props.actions.getMedia(token);
    }
  }

  componentWillUpdate() {
    this.redirectIfNotLoggedIn();
  }

  redirectIfNotLoggedIn() {
    if (!this.props.state.auth.token) {
      this.props.history.pushState(null, '/login');
    }
  }

  render () {
    let state = this.props.state;
    return (
      <Grid fluid>
        <Row>
          <Col xs={2} className="sidebar">
            <SidebarMenu state={state} actions={this.props.actions}/>
          </Col>
          <Col xs={10} className="content">
            {state.media.mediaList.isGetPending && <Spinner />}
            {!state.media.mediaList.isGetPending && this.props.children}
          </Col>
        </Row>
      </Grid>
    )
  }
}

export default connectWrapper(actions, AppLayout)

