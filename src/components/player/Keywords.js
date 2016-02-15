import React, { PropTypes } from 'react'
import { Row, Col } from 'react-bootstrap'
import classnames from 'classnames';

export class Keywords extends React.Component {
  static propTypes = {
    mediaId: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    activeSpeaker: PropTypes.string.isRequired,
    activeTopic: PropTypes.string.isRequired,
    topicsIds: PropTypes.array.isRequired,
    topics: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired
  };

  setActiveTopic(topicId) {
    if (this.props.type === 'keywords') {
      this.props.actions.setActiveTopic(this.props.mediaId, topicId);
    }
    else if (this.props.type === 'groups') {
      this.props.actions.setActiveGroup(this.props.mediaId, topicId);
    }
  }

  setMarkers(keyword, activeSpeakerId) {
    let times = keyword.t[activeSpeakerId];
    let markers = times.map(_time => {
      let time = parseFloat(_time);
      return {
        time,
        keywordName: keyword.name
      }
    });
    this.props.actions.setMarkers(this.props.mediaId, markers);
  }

  render () {
    let topics = this.props.topics;
    let activeTopicId = this.props.activeTopic;
    let activeTopic = topics[activeTopicId];
    let activeSpeakerId = this.props.activeSpeaker;

    return (
      <div className="listing__keywords">
        <Row>
          <Col sm={3} className="listing__keywords__topics__container">
            <ul className="listing__keywords__topics">
              {
                this.props.topicsIds.map(topicId => {
                  let topic = topics[topicId];
                  let activeClass = classnames({active: (activeTopicId === topicId)});

                  return (
                    <li key={'topic-' + topicId} className={activeClass} onClick={this.setActiveTopic.bind(this, topicId)}>
                      <a href="javascript:void(0)">{topic.name}</a>
                    </li>
                  )
                })
              }
            </ul>
          </Col>
          <Col sm={9} className="listing__keywords__container">
            <ul className="listing__keywords-of-topic">
              {
                activeTopic.keywordsIds.map(keywordId => {
                  let keyword = activeTopic.keywords[keywordId];
                  let times = keyword.t[activeSpeakerId];
                  return (
                    <li key={'keyword-' + keywordId}>
                      <a href="javascript:void(0)" onClick={this.setMarkers.bind(this, keyword, activeSpeakerId)}>
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
