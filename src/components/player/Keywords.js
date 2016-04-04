import React, { PropTypes } from 'react'
import { Row, Col } from 'react-bootstrap'
import { COLORS } from '../../common/Common'
import KeywordTopic from './KeywordTopic'

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

  setActiveTopic(topicId) {
    this.props.actions.setActiveTopic(this.props.mediaId, topicId, this.props.type);
  }

  setMarkers(keyword, activeSpeakerId) {
    let color = COLORS[0];
    let times = (activeSpeakerId) ? keyword.t[activeSpeakerId] : this.getAllKeywordTimes(keyword);
    let markers = times.map(_time => {
      let time = parseFloat(_time);
      return {
        time,
        keywordName: keyword.name,
        color
      }
    });
    this.props.actions.setMarkers(this.props.mediaId, markers);
  }

  getAllKeywordTimes(keyword) {
    let times = [];
    Object.keys(keyword.t).forEach(speakerName => {
      times = times.concat(keyword.t[speakerName]);
    });
    return times;
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
                  return (
                    <KeywordTopic key={'topic-' + topicId}
                                  topicName={topics[topicId].name}
                                  isActive={activeTopicId === topicId}
                                  onClickTopic={this.setActiveTopic.bind(this, topicId)}
                    />
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
                  let times = (activeSpeakerId) ? keyword.t[activeSpeakerId] : this.getAllKeywordTimes(keyword);
                  if (!times) { // no times - no keyword.
                    return null;
                  }
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
