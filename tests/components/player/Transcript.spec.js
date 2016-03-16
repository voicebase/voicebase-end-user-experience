import React from 'react';
import ReactDom from 'react-dom';
import { shallowRender } from '../../../src/common/Test'
import TestUtils from 'react-addons-test-utils'

import Transcript from '../../../src/components/player/Transcript'
import { DETECTION_TAB } from '../../../src/redux/modules/media/mediaData'

describe('Transcript component', function () {
  let component;
  let rootElement;

  let options = {
    mediaId: 'mediaId',
    playerState: {
      "played": 0,
      "duration": 5
    },
    mediaState: {
      "utterances": {
        "itemIds": [
          "0",
          "1"
        ],
        "items": {
          "0": {
            "name": "PCI",
            "segments": [
              {
                "s": 0,
                "e": 1000
              }
            ],
            "id": "0",
            "color": "#3D80CA"
          },
          "1": {
            "name": "Sentiment",
            "segments": [
              {
                "s": 2000,
                "e": 3000
              },
              {
                "s": 4000,
                "e": 5000
              }
            ],
            "id": "1",
            "color": "#5D7AA2"
          }
        }
      },
      "view": {
        "activeTab": 1
      },
      "transcriptSpeakers": [
        {
          "start": 0,
          "name": "Speaker 1"
        },
        {
          "start": 3000,
          "name": "Speaker 2"
        }
      ],
      "status": "finished",
      "speakers": {
        "Speaker 1": {
          "name": "Speaker 1",
          "color": "#2818B0"
        },
        "Speaker 2": {
          "name": "Speaker 2",
          "color": "#21128B"
        }
      },
      "transcript": {
        "wordIds": [
          "0",
          "1",
          "2",
          "3",
          "4",
          "5",
          "6"
        ],
        "words": {
          "0": {
            "p": 0,
            "c": 0.1,
            "s": 0,
            "e": 50220,
            "w": "Speaker 1: ",
            "m": "turn"
          },
          "1": {
            "w": "George",
            "e": 1430,
            "s": 710,
            "c": 0.503,
            "p": 0
          },
          "2": {
            "w": "Washington",
            "e": 1439,
            "s": 1430,
            "c": 0.862,
            "p": 1
          },
          "3": {
            "w": "Thomas",
            "e": 2340,
            "s": 1440,
            "c": 0.548,
            "p": 2
          },
          "4": {
            "p": 3,
            "e": 3000,
            "s": 2341,
            "c": 0.501,
            "w": "Speaker 2: ",
            "m": "turn"
          },
          "5": {
            "w": "Thank",
            "e": 4000,
            "s": 3001,
            "c": 0.501,
            "p": 4
          },
          "6": {
            "w": "you",
            "e": 5000,
            "s": 4001,
            "c": 0.598,
            "p": 5
          }
        }
      },
      "activeSpeaker": "Speaker 1"
    },
    markersState: null,
    actions: {}
  };

  const getComponent = function (_options = {}) {
    let props = {
      ...options,
      ..._options
    };

    return TestUtils.renderIntoDocument(
      <Transcript mediaId={props.mediaId}
                  playerState={props.playerState}
                  mediaState={props.mediaState}
                  markersState={props.markersState}
                  actions={props.actions}
      />
    );
  };

  beforeEach(function () {
    component = getComponent();
    rootElement = ReactDom.findDOMNode(component);
  });

  it('Check root element', function() {
    assert.equal(rootElement.tagName, 'DIV');
    assert.equal(rootElement.className, 'listing__transcript');
  });

  it('Check constructor', function() {
    component.constructor(options);
    assert.isNull(component.state.hoverUtterance);
    assert.isNull(component.state.hoverKeyword);
  });

  it('Check onHoverTranscript', function() {
    assert.isFalse(component.isHoverTranscript);
    component.onHoverTranscript();
    assert.isTrue(component.isHoverTranscript);
  });

  it('Check onBlurTranscript', function() {
    component.onHoverTranscript();
    component.onBlurTranscript();
    assert.isFalse(component.isHoverTranscript);
  });

  it('Check findDetectionSegment', function() {
    let findUtterance = component.findDetectionSegment(500);
    assert.isNotNull(findUtterance);
  });

  it('Check onHoverDetectionSegment with utterance', function() {
    let findUtterance = component.findDetectionSegment(500);
    component.onHoverDetectionSegment(findUtterance, null);
    expect(component.state.hoverUtterance).to.eql(findUtterance);
    expect(component.state.hoverKeyword).to.eql(null);
  });

  it('Check onHoverDetectionSegment with keyword', function() {
    let keyword = {keywordId: 1};
    component.onHoverDetectionSegment(null, keyword);
    expect(component.state.hoverUtterance).to.eql(null);
    expect(component.state.hoverKeyword).to.eql(keyword.keywordId);
  });

  it('Check onBlurDetectionSegment', function() {
    component.onBlurDetectionSegment();
    assert.isNull(component.state.hoverUtterance);
    assert.isNull(component.state.hoverKeyword);
  });

  it('Check checkPhrase', function() {
    let res = component.checkPhrase({
      id: "0",
      keywordName: "thank you"
    }, options.mediaState.transcript.words, 5);
    expect(Object.keys(res)).to.eql(['4', '5']);
  });

  it('Check getMarkers with empty markersState', function() {
    let res = component.getMarkers();
    expect(res).to.eql({});
  });

  it('Check getMarkers with non-empty markersState', function() {
    let markersState = {
      markerIds: ['0', '1'],
      markers: {
        0: {
          id: "0",
          keywordName: "george washington",
          time: 0.71
        },
        1: {
          id: "1",
          keywordName: "george washington",
          time: 57
        }
      }
    };

    component = getComponent({
      ...options,
      markersState: markersState
    });
    let res = component.getMarkers();

    expect(res).to.eql({
      "0.71": markersState.markers[0],
      "57.00": markersState.markers[1]
    });
  });

  it('Check isSpeaker', function() {
    assert.isFalse(component.isSpeaker({}));
    assert.isFalse(component.isSpeaker({m: 'test'}));
    assert.isTrue(component.isSpeaker({m: 'turn'}));
  });

  it('Check getSpeakerColor', function() {
    let res = component.getSpeakerColor({w: 'Speaker 1:'});
    assert.equal(res, options.mediaState.speakers['Speaker 1'].color);
  });

  it('Check isHoverUtterance if no utterance', function() {
    let utterance = options.mediaState.utterances.items['0'];
    let res = component.isHoverUtterance(utterance);
    assert.isNotTrue(res);
  });

  it('Check isHoverUtterance with utterance', function() {
    let utterance = {
      ...options.mediaState.utterances.items['0'],
      segmentIndex: '0'
    };
    component.state.hoverUtterance = utterance;
    let res = component.isHoverUtterance(utterance);
    assert.isTrue(res);
  });

  it('Check DETECTION_TAB', function() {
    component = getComponent({
      ...options,
      mediaState: {
        ...options.mediaState,
        "view": {
          "activeTab": DETECTION_TAB
        }
      }
    });
    component.findDetectionSegment = sinon.spy();
    component.render();
    assert.isTrue(component.findDetectionSegment.called);
  });


});
