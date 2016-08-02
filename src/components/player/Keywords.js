import React, { PropTypes } from 'react'
import { Row, Col } from 'react-bootstrap'
import KeywordTopic from './KeywordTopic'
import KeywordWord from './KeywordWord'

export class Keywords extends React.Component {
  static propTypes = {
    mediaId: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    activeSpeaker: PropTypes.string,
    activeTopic: PropTypes.string.isRequired,
    topicsIds: PropTypes.array.isRequired,
    topics: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired
  };

  setActiveTopic = (topicId) => {
    this.props.actions.setActiveTopic(this.props.mediaId, topicId, this.props.type);
  };

  setMarkers = (markers) => {
    this.props.actions.setMarkers(this.props.mediaId, markers);
  };

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
              {this.props.topicsIds.map(topicId => {
                return (
                  <KeywordTopic
                    key={'topic-' + topicId}
                    topicId={topicId}
                    topicName={topics[topicId].name}
                    isActive={activeTopicId === topicId}
                    onClickTopic={this.setActiveTopic}
                  />
                )
              })}
            </ul>
          </Col>
          <Col sm={9} className="listing__keywords__container">
            <ul className="listing__keywords-of-topic">
              {activeTopic.keywordsIds.map(keywordId => {
                let keyword = activeTopic.keywords[keywordId];
                return (
                  <KeywordWord
                    key={'keyword-' + keywordId}
                    keyword={keyword}
                    activeSpeakerId={activeSpeakerId}
                    setMarkers={this.setMarkers}
                  />
                )
              })}
            </ul>
          </Col>
        </Row>
      </div>
    )
  }
}

export default Keywords
