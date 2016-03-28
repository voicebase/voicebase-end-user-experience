import React, { PropTypes } from 'react'
import Player from './Player';
import { Tabs, Tab } from 'react-bootstrap';
import { KEYWORDS_TAB, DETECTION_TAB, PREDICTION_TAB, GROUPS_TAB } from '../../redux/modules/media/mediaData'
import Keywords from './Keywords'
import Transcript from './Transcript'
import Predictions from './Predictions'
import DetectionList from './DetectionList'

export class VbsPlayerApp extends React.Component {
  static propTypes = {
    token: PropTypes.string.isRequired,
    mediaId: PropTypes.string.isRequired,
    mediaDataState: PropTypes.object.isRequired,
    playerState: PropTypes.object.isRequired,
    markersState: PropTypes.object,
    actions: PropTypes.object.isRequired
  };

  componentWillMount() {
    let mediaData = this.props.mediaDataState;
    this.props.actions.createPlayer(this.props.mediaId, mediaData.mediaUrl, mediaData.metadata.type || 'audio');
  }

  componentWillUnmount() {
    this.props.actions.destroyPlayer(this.props.mediaId);
    this.props.actions.removeDataForMedia(this.props.mediaId);
  }

  selectTab(key) {
    this.props.actions.choosePlayerAppTab(this.props.mediaId, key);
  }

  render () {
    let playerState = this.props.playerState;
    let mediaData = this.props.mediaDataState;
    let activeTab = mediaData.view.activeTab;
    let markersState = this.props.markersState;

    return (
      <div className="vbs-player-app">
        <Player mediaId={this.props.mediaId}
                playerType="JwPlayer"
                mediaState={mediaData}
                markersState={markersState}
                playerState={playerState}
                hasNextKeywordButton
                hasDownloadButton
                isShowKeywordsMarkers={activeTab === KEYWORDS_TAB || activeTab === GROUPS_TAB}
                actions={this.props.actions} />

        <Tabs className="listing__tabs" activeKey={activeTab} onSelect={this.selectTab.bind(this)}>
          <Tab eventKey={KEYWORDS_TAB} title="Keywords">
            <Keywords mediaId={this.props.mediaId}
                      type="keywords"
                      activeSpeaker={mediaData.activeSpeaker}
                      activeTopic={mediaData.activeTopic}
                      topicsIds={mediaData.topicsIds}
                      topics={mediaData.topics}
                      actions={this.props.actions}
            />
          </Tab>
          {
            mediaData.groupsIds && mediaData.groupsIds.length > 0 &&
            <Tab eventKey={GROUPS_TAB} title="Phrase Groups">
              <Keywords mediaId={this.props.mediaId}
                        type="groups"
                        activeSpeaker={mediaData.activeSpeaker}
                        activeTopic={mediaData.activeGroup}
                        topicsIds={mediaData.groupsIds}
                        topics={mediaData.groups}
                        actions={this.props.actions}
              />
            </Tab>
          }
          {
            mediaData.predictions &&
            <Tab eventKey={PREDICTION_TAB} title="Prediction">
              <Predictions predictionsState={mediaData.predictions} />
            </Tab>
          }
          {
            mediaData.utterances &&
            <Tab eventKey={DETECTION_TAB} title="Detection">
              <DetectionList mediaId={this.props.mediaId}
                             utterances={mediaData.utterances}
                             playerState={playerState}
                             actions={this.props.actions}
              />
            </Tab>
          }
        </Tabs>

        {
          (activeTab === KEYWORDS_TAB || activeTab === DETECTION_TAB || activeTab === GROUPS_TAB) &&
          <Transcript mediaId={this.props.mediaId}
                      playerState={playerState}
                      mediaState={mediaData}
                      markersState={markersState}
                      actions={this.props.actions}
          />
        }
      </div>
    )
  }
}

export default VbsPlayerApp
