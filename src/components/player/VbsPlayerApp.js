import React, { PropTypes } from 'react'
import Player from './Player';
import { Tabs, Tab } from 'react-bootstrap';
import KeywordsTabContent from './KeywordsTabContent'

export class VbsPlayerApp extends React.Component {
  static propTypes = {
    token: PropTypes.string.isRequired,
    mediaId: PropTypes.string.isRequired,
    mediaState: PropTypes.object.isRequired,
    playerState: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired
  };

  componentWillMount() {
    let url = 'http://demo.voicsebasejwplayer.dev4.sibers.com/media/washington.mp3';
    this.props.actions.createPlayer(this.props.mediaId, url);
  }

  render () {
    return (
      <div className="vbs-player-app">
        <Player mediaId={this.props.mediaId}
                playerType="JwPlayer"
                playerState={this.props.playerState.players[this.props.mediaId] || {loading: true}}
                actions={this.props.actions} />

        <Tabs className="listing__tabs">
          <Tab eventKey={1} title="Keywords">
            <KeywordsTabContent mediaId={this.props.mediaId}
                                mediaState={this.props.mediaState}
                                actions={this.props.actions} />
          </Tab>
          <Tab eventKey={2} title="Detection">Tab 2 content</Tab>
          <Tab eventKey={3} title="Prediction">Tab 3 content</Tab>
        </Tabs>

      </div>
    )
  }
}

export default VbsPlayerApp
