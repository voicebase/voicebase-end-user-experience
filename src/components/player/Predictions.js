import React, { PropTypes } from 'react'
import { Row, Col } from 'react-bootstrap'

export class Predictions extends React.Component {
  static propTypes = {
    predictionsState: PropTypes.object.isRequired
  };

  render () {
    let predictions = this.props.predictionsState;

    return (
      <div className="listing__prediction">
        <Row>
          <Col sm={2}>
            <h4 className="listing__prediction__heading">Hot Sales<br/>Lead</h4>
            <h6 className="listing__prediction__value text-success">{predictions['sales-lead']}</h6>
          </Col>
          <Col sm={2}>
            <h5 className="listing__prediction__heading">Request<br/>for Quote</h5>
            <h6 className="listing__prediction__value text-success">{predictions['request-quote']}</h6>
          </Col>
          <Col sm={2}>
            <h5 className="listing__prediction__heading">Directions<br/>Requested</h5>
            <h6 className="listing__prediction__value text-success">{predictions['directions']}</h6>
          </Col>
          <Col sm={2}>
            <h5 className="listing__prediction__heading">Asked About<br/>Employment</h5>
            <h6 className="listing__prediction__value text-muted">{predictions['employment']}</h6>
          </Col>
          <Col sm={2}>
            <h5 className="listing__prediction__heading">Churn<br/>Risk</h5>
            <h6 className="listing__prediction__value text-warning">{predictions['churn']}%</h6>
          </Col>
          <Col sm={2}>
            <h4 className="listing__prediction__heading">Appointment<br/>Request</h4>
            <h6 className="listing__prediction__value text-success">
              {predictions.appointment && <i className="fa fa-check"/>}
              {!predictions.appointment && <i className="fa fa-times icon-fail"/>}
            </h6>
          </Col>
        </Row>
      </div>
    )
  }
}

export default Predictions
