import React, { PropTypes } from 'react'
import connectWrapper from '../redux/utils/connect'
import actions from '../redux/rootActions'
import {Grid, Row, Col} from 'react-bootstrap'
import SidebarMenu from '../components/SidebarMenu'

export class AppLayout extends React.Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired
  };

  static propTypes = {
    children: PropTypes.element,
    state: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired
  };

  componentWillMount() {
    this.props.actions.handleErrors();
    this.redirectIfNotLoggedIn();
    const token = this.props.state.auth && this.props.state.auth.token;
    if (token) {
      this.props.actions.regenerateToken(); // returns undefined
      this.props.actions.getMedia(token).catch(e => { // avoid reject without catch
        console.log('getMedia failed in AppLayout, probably due to an expired token ')
        console.log(e)
      })
    }
  }

  componentDidUpdate() {
    this.redirectIfNotLoggedIn();
  }

  redirectIfNotLoggedIn() {
    if (!this.props.state.auth.token) {
      this.context.router.push('/login');
    }
  }

  render () {
    let state = this.props.state;
    return (
      <Grid fluid>
        <Row>
          <Col xs={2} className="sidebar">
            <SidebarMenu state={state} actions={this.props.actions} />
          </Col>
          <Col xs={10} className="content">
            {this.props.children}
          </Col>
        </Row>
      </Grid>
    )
  }
}

export default connectWrapper(actions, AppLayout)

