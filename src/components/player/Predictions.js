import React, { PropTypes } from 'react'
import { Row, Col } from 'react-bootstrap'
import classnames from 'classnames'

export class Predictions extends React.Component {
  static propTypes = {
    predictionsState: PropTypes.object.isRequired
  };

  getClass (value, classes) {
    return classnames(classes, 'listing__prediction__value', {
      'text-success': value > 0,
      'text-muted': value <= 0
    })
  }

  render () {
    let predictions = this.props.predictionsState;

    return (
      <div className="listing__prediction">
        <Row>
          {
            predictions.sales_lead &&
            <Col sm={2}>
              <h4 className="listing__prediction__heading">Hot Sales<br/>Lead</h4>
              <h6 className={this.getClass(predictions.sales_lead.value)}>{predictions.sales_lead.value}</h6>
            </Col>
          }
          {
            predictions.request_quote &&
            <Col sm={2}>
              <h5 className="listing__prediction__heading">Request<br/>for Quote</h5>
              <h6 className={this.getClass(predictions.request_quote.value)}>{predictions.request_quote.value}</h6>
            </Col>
          }
          {
            predictions.directions &&
            <Col sm={2}>
              <h5 className="listing__prediction__heading">Directions<br/>Requested</h5>
              <h6 className={this.getClass(predictions.directions.value)}>{predictions.directions.value}</h6>
            </Col>
          }
          {
            predictions.employment &&
            <Col sm={2}>
              <h5 className="listing__prediction__heading">Asked About<br/>Employment</h5>
              <h6 className={this.getClass(predictions.employment.value)}>{predictions.employment.value}</h6>
            </Col>
          }
          {
            predictions.churn &&
            <Col sm={2}>
              <h5 className="listing__prediction__heading">Churn<br/>Risk</h5>
              <h6 className={this.getClass(predictions.churn.value, 'listing__prediction--churn')}>{predictions.churn.value}%</h6>
            </Col>
          }
          {
            predictions.appointment &&
            <Col sm={2}>
              <h4 className="listing__prediction__heading">Appointment<br/>Request</h4>
              <h6 className="listing__prediction__value text-success">
                {predictions.appointment.value && <i className="fa fa-check"/>}
                {!predictions.appointment.value && <i className="fa fa-times icon-fail"/>}
              </h6>
            </Col>
          }
        </Row>
      </div>
    )
  }
}

export default Predictions
