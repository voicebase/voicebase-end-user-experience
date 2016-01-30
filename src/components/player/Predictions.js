import React, { PropTypes } from 'react'
import jQuery from 'jquery';
import circliful from '../../vendors/circliful/jquery.circliful.min'
import '../../vendors/circliful/jquery.circliful.scss'
import { Row, Col } from 'react-bootstrap'

circliful.init(jQuery)

export class Predictions extends React.Component {
  static propTypes = {
    mediaId: PropTypes.string.isRequired,
    predictionsState: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired
  };

  componentDidMount() {
    jQuery(this.refs.salesLead).circliful();
    jQuery(this.refs.request).circliful();
    jQuery(this.refs.directions).circliful();
    jQuery(this.refs.employment).circliful();
    jQuery(this.refs.churn).circliful();
  }

  render () {
    let predictions = this.props.predictionsState;

    let salesPercent = predictions['sales-lead'] * 10;
    let requestPercent = predictions['request-quote'] * 10;
    let directionsPercent = predictions['directions'] * 10;
    let employmentPercent = predictions['employment'] * 10;

    return (
      <div className="listing__prediction">
        <div className="listing__prediction__charts">
          <Row>
            <Col sm={2}>
              <h4>Hot Lead</h4>
              <div ref="salesLead" className="circliful-chart green" data-text={predictions['sales-lead']} data-percent={salesPercent} data-fgcolor="#85d04a"></div>
            </Col>
            <Col sm={2}>
              <h5>Quote</h5>
              <div ref="request" className="circliful-chart green" data-text={predictions['request-quote']} data-percent={requestPercent} data-fgcolor="#85d04a"></div>
            </Col>
            <Col sm={2}>
              <h5>Directions</h5>
              <div ref="directions" className="circliful-chart green" data-text={predictions['directions']} data-percent={directionsPercent} data-fgcolor="#85d04a"></div>
            </Col>
            <Col sm={2}>
              <h5>Employment</h5>
              <div ref="employment" className="circliful-chart grey" data-text={predictions['employment']} data-percent={employmentPercent} data-fgcolor="#85d04a"></div>
            </Col>
            <Col sm={2}>
              <h5>Churn</h5>
              <div ref="churn" className="circliful-chart amber" data-text={predictions['churn'] + '%'} data-percent={predictions['churn']} data-fgcolor="#e59242"></div>
            </Col>
            <Col sm={2}>
              <h4>Appointment</h4>
              {predictions.appointment && <i className="fa fa-check-circle icon-success"/>}
              {!predictions.appointment && <i className="fa fa-times-circle icon-fail"/>}
            </Col>
          </Row>
        </div>
      </div>
    )
  }
}

export default Predictions
