import React, { PropTypes } from 'react'
import connectWrapper from '../redux/utils/connect'
import {actions as authActions} from '../redux/modules/auth'
import {Grid, Row, Col} from 'react-bootstrap'
import SidebarMenu from '../components/SidebarMenu'

export class AppLayout extends React.Component {
  static propTypes = {
    children: PropTypes.element,
    state: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired
  };

  render () {
    return (
      <Grid fluid>
        <Row>
          <Col xs={2} className="sidebar">
            <SidebarMenu state={this.props.state} actions={this.props.actions}/>
          </Col>
          <Col xs={10} className="content">
            {this.props.children}
          </Col>
        </Row>
      </Grid>
    )
  }
}

export default connectWrapper(authActions, AppLayout)

