import React, { PropTypes } from 'react'
import { Row, Col } from 'react-bootstrap'

export class KeywordsTabContent extends React.Component {
  static propTypes = {
    mediaId: PropTypes.string.isRequired,
    mediaState: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired
  };

  render () {
    return (
      <div className="listing__keywords">
        <Row>
          <Col sm={3}>
            <ul className="listing__keywords__topics">
              <li><a href="">ALL TOPICS</a></li>
              <li><a href="">Public policy</a></li>
              <li><a href="">Government</a></li>
              <li className="active"><a href="">Political science</a></li>
              <li><a href="">Social sciences</a></li>
              <li><a href="">Email</a></li>
            </ul>
          </Col>
          <Col sm={9}>
            <ul>
              <li>
                <a href="">
                  <span className="listing__keywords__keyword-name">Public comment</span>
                  <span> (2)</span>
                </a>
              </li>
              <li>
                <a href="">
                  <span className="listing__keywords__keyword-name">Governance</span>
                  <span> (2)</span>
                </a>
              </li>
              <li>
                <a href="">
                  <span className="listing__keywords__keyword-name">Economics</span>
                  <span> (2)</span>
                </a>
              </li>
              <li>
                <a href="">
                  <span className="listing__keywords__keyword-name">Government</span>
                  <span> (2)</span>
                </a>
              </li>
              <li>
                <a href="">
                  <span className="listing__keywords__keyword-name">Government</span>
                  <span> (2)</span>
                </a>
              </li>
              <li>
                <a href="">
                  <span className="listing__keywords__keyword-name">Government</span>
                  <span> (2)</span>
                </a>
              </li>
            </ul>
          </Col>
        </Row>
      </div>
    )
  }
}

export default KeywordsTabContent
