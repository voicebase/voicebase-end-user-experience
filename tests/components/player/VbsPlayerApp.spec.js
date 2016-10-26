import React from 'react';
import ReactDom from 'react-dom';
import { shallowRender } from '../../../app/common/Test'
import TestUtils from 'react-addons-test-utils'

import VbsPlayerApp from '../../../app/components/player/VbsPlayerApp'

describe('VbsPlayerApp component', function () {
  let component;
  let rootElement;

  window.jwplayer = function () {
    return {
      setup: function () {return this},
      onReady: function () {},
      onComplete: function () {},
      getState: function () {},
      play: function () {},
      pause: function () {},
      stop: function () {},
      seek: function () {},
      setVolume: function () {},
      getDuration: function () {},
      getPosition: function () {},
      getBuffer: function () {}
    }
  };

  let options = {
    token: 'token',
    mediaId: 'mediaId',
    playerType: 'FileInputPlayer',
    playerState: {
      loaded: 100,
      isFullscreen: false,
      timelineWidth: 1000,
      error: "",
      playing: false,
      url: "url",
      played: 0.1,
      duration: 1000,
      type: "audio",
      utteranceTime: null
    },
    mediaDataState: {
      metadata: {
        duration: 1000,
        type: 'audio'
      },
      "view": {
        "activeTab": 1
      },
      mediaUrl: 'url',
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
      "activeSpeaker": "Speaker 1",
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
      "activeTopic": "ALL_TOPICS",
      "activeGroup": "0",
      "topicsIds": [
        "ALL_TOPICS"
      ],
      "topics": {
        "ALL_TOPICS": {
          "name": "ALL TOPICS",
          "type": "category",
          "keywordsIds": [
            "0",
            "1"
          ],
          "keywords": {
            "0": {
              "t": {
                "unknown": [
                  "5.02"
                ]
              },
              "name": "ability"
            },
            "1": {
              "t": {
                "unknown": [
                  "6.89"
                ]
              },
              "name": "upload"
            }
          },
          "speakers": [
            "unknown"
          ]
        }
      },
      "groupsIds": [
        "0",
        "1"
      ],
      "groups": {
        "0": {
          "keywords": {
            "0": {
              "t": {
                "Speaker 1": [
                  "0.71"
                ]
              },
              "name": "George Washington",
              "score": "1"
            }
          },
          "name": "George Washington",
          "keywordsIds": [
            "0"
          ],
          "speakers": [
            "Speaker 1"
          ],
          "type": "group",
          "subcategories": [],
          "key": "0"
        },
        "1": {
          "keywords": {
            "0": {
              "internalName": [
                "wife"
              ],
              "t": {
                "Speaker 1": [
                  "249.3"
                ]
              },
              "name": "Wife",
              "score": "1"
            }
          },
          "name": "Family",
          "keywordsIds": [
            "0"
          ],
          "speakers": [
            "Speaker 1"
          ],
          "type": "category",
          "key": "1"
        }
      },
      "predictions": {
        "sales_lead": {
          "value": 7,
          "data": {
            "type": "binary",
            "name": "Hot Sales Lead",
            "score": 0.72,
            "class": "Prospect"
          }
        },
        "request_quote": {
          "value": 5.5,
          "data": {
            "type": "binary",
            "name": "Request for Quote",
            "score": 5.51
          }
        },
        "directions": {
          "value": 3.3,
          "data": {
            "type": "binary",
            "name": "Directions Requested",
            "score": 3.3
          }
        },
        "employment": {
          "value": 0,
          "data": {
            "type": "binary",
            "name": "Asked About Employment",
            "score": 0
          }
        },
        "churn": {
          "value": 92,
          "data": {
            "type": "binary",
            "name": "Churn Risk",
            "score": 92
          }
        },
        "appointment": {
          "value": false,
          "data": {
            "type": "binary",
            "name": "Appointment Request",
            "score": false
          }
        }
      },
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
                "e": 18000
              }
            ],
            "id": "0",
            "color": "#4A436C"
          },
          "1": {
            "name": "Sentiment",
            "segments": [
              {
                "s": 20000,
                "e": 35000
              },
              {
                "s": 180000,
                "e": 205000
              }
            ],
            "id": "1",
            "color": "#2C7624"
          }
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
      }
    },
    markersState: {
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
    },
    actions: {
      createPlayer: function (mediaId, url, playerType) {},
      destroyPlayer: function (mediaId) {},
      choosePlayerAppTab: function (mediaId, key) {}
    }
  };

  const getComponent = function (_options = {}) {
    let props = {
      ...options,
      ..._options
    };

    return TestUtils.renderIntoDocument(
      <VbsPlayerApp token={props.token}
                    mediaId={props.mediaId}
                    playerState={props.playerState}
                    mediaDataState={props.mediaDataState}
                    markersState={props.markersState}
                    actions={props.actions}
      />
    );
  };

  beforeEach(function () {
    component = getComponent();
    rootElement = ReactDom.findDOMNode(component);
  });

  it('Check root element', function () {
    assert.equal(rootElement.tagName, 'DIV');
    assert.equal(rootElement.className, 'vbs-player-app');
  });

  it('Check componentWillMount', function () {
    let createPlayer = sinon.spy();
    component = getComponent({
      ...options,
      actions: {
        ...options.actions,
        createPlayer
      }
    });
    component.componentWillMount();
    assert.equal(createPlayer.called, true);
  });

  it('Check componentWillUnmount', function () {
    let destroyPlayer = sinon.spy();
    let removeDataForMedia = sinon.spy();
    component = getComponent({
      ...options,
      actions: {
        ...options.actions,
        destroyPlayer,
        removeDataForMedia
      }
    });
    component.componentWillUnmount();
    assert.equal(destroyPlayer.called, true);
    assert.equal(removeDataForMedia.called, true);
  });

  it('Check selectTab', function () {
    let choosePlayerAppTab = sinon.spy();
    component = getComponent({
      ...options,
      actions: {
        ...options.actions,
        choosePlayerAppTab
      }
    });
    component.selectTab(1);
    assert.equal(choosePlayerAppTab.called, true);
  });

});
