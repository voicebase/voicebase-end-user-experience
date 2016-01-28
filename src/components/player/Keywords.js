import React, { PropTypes } from 'react'
import { Row, Col } from 'react-bootstrap'
import classnames from 'classnames';

export class Keywords extends React.Component {
  static propTypes = {
    mediaId: PropTypes.string.isRequired,
    mediaState: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired
  };

  setActiveTopic(topicId) {
    this.props.actions.setActiveTopic(this.props.mediaId, topicId);
  }

  render () {
    let mediaState = this.props.mediaState;
    let activeTopicId = mediaState.activeTopic;
    let activeTopic = mediaState.topics[activeTopicId];
    let activeSpeakerId = mediaState.activeSpeaker;

    return (
      <div className="listing__keywords">
        <Row>
          <Col sm={3}>
            <ul className="listing__keywords__topics">
              {
                mediaState.topicsIds.map(topicId => {
                  let topic = mediaState.topics[topicId];
                  let activeClass = classnames({active: (activeTopicId === topicId)})

                  return (
                    <li key={'topic-' + topicId} className={activeClass} onClick={this.setActiveTopic.bind(this, topicId)}>
                      <a href="javascript:void(0)">{topic.name}</a>
                    </li>
                  )
                })
              }
            </ul>
          </Col>
          <Col sm={9}>
            <ul className="listing__keywords-of-topic">
              {
                activeTopic.keywordsIds.map(keywordId => {
                  let keyword = activeTopic.keywords[keywordId];
                  let times = keyword.t[activeSpeakerId];
                  return (
                    <li key={'keyword-' + keywordId}>
                      <a href="javascript:void(0)">
                        <span className="listing__keywords__keyword-name">{keyword.name}</span>
                        <span> ({times.length})</span>
                      </a>
                    </li>
                  )
                })
              }
            </ul>
          </Col>
        </Row>
      </div>
    )
  }
}

export default Keywords
