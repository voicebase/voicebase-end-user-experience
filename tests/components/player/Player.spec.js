import React from 'react';
import ReactDom from 'react-dom';
import { shallowRender } from '../../../src/common/Test'
import TestUtils from 'react-addons-test-utils'

import Player from '../../../src/components/player/Player'

describe('Player component', function () {
  let component;
  let rootElement;

  let options = {
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
    mediaState: {
      metadata: {
        duration: 1000
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
      "speakers": {
        "Speaker 1": {
          "name": "Speaker 1",
          "color": "#2818B0"
        },
        "Speaker 2": {
          "name": "Speaker 2",
          "color": "#21128B"
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
    hasNextKeywordButton: true,
    hasDownloadButton: true,
    isShowKeywordsMarkers: true,
    actions: {
      setTimelineWidth: function (mediaId, width) {},
      setDuration: function (mediaId, duration) {},
      setPosition: function (mediaId, played) {},
      setBuffered: function (mediaId, loaded) {},
      setFullscreen: function (mediaId, isFullscreen) {},
      play: function (mediaId) {},
      pause: function (mediaId) {},
      clearJustCreatedMarkers: function (mediaId) {},
      clearUtteranceTime: function (mediaId) {}
    }
  };

  const getComponent = function (_options = {}) {
    let props = {
      ...options,
      ..._options
    };

    return TestUtils.renderIntoDocument(
      <Player mediaId={props.mediaId}
              playerType={props.playerType}
              playerState={props.playerState}
              mediaState={props.mediaState}
              markersState={props.markersState}
              hasNextKeywordButton={props.hasNextKeywordButton}
              hasDownloadButton={props.hasDownloadButton}
              isShowKeywordsMarkers={props.isShowKeywordsMarkers}
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
    assert.equal(rootElement.className, 'vbs-player');
  });

  it('Check root element for video', function() {
    component = getComponent({
      ...options,
      playerState: {
        ...options.playerState,
        type: "video"
      }
    });
    rootElement = ReactDom.findDOMNode(component);
    assert.equal(rootElement.className, 'vbs-player vbs-player--video');
  });

  it('Check root element for video fullscreen', function() {
    component = getComponent({
      ...options,
      playerState: {
        ...options.playerState,
        type: "video",
        isFullscreen: true
      }
    });
    rootElement = ReactDom.findDOMNode(component);
    assert.equal(rootElement.className, 'vbs-player vbs-player--video vbs-player--fullscreen');
  });

  it('Check react-player classes for audio', function() {
    let reactPlayer = TestUtils.findRenderedDOMComponentWithClass(component, 'vbs-player__original');
    assert.equal(reactPlayer.className, 'vbs-player__original vbs-player__original--audio');
  });

  it('Check react-player classes for video', function() {
    component = getComponent({
      ...options,
      playerState: {
        ...options.playerState,
        type: "video"
      }
    });
    let reactPlayer = TestUtils.findRenderedDOMComponentWithClass(component, 'vbs-player__original');
    assert.equal(reactPlayer.className, 'vbs-player__original vbs-player__original--video');
  });

  it('Check constructor', function() {
    component.constructor();
    assert.equal(component.state.seeking, false);
    assert.equal(component.state.seekValue, 0);
    assert.equal(component.state.volume, 100);
  });

  it('check componentWillMount without mediaState', function() {
    component = getComponent({
      ...options,
      mediaState: null
    });
    assert.equal(component.componentWillMount(), false);
  });

  it('check componentWillMount without duration', function() {
    component = getComponent({
      ...options,
      mediaState: {
        ...options.mediaState,
        metadata: {
          duration: null
        }
      }
    });
    component.onDuration = sinon.spy();
    component.componentWillMount();
    assert.isFalse(component.onDuration.called);
  });

  it('check componentWillMount with duration', function() {
    component.onDuration = sinon.spy();
    component.componentWillMount();
    assert.isTrue(component.onDuration.calledOnce);
  });

  it('check componentDidUpdate with justCreated markers', function() {
    component = getComponent({
      ...options,
      markersState: {
        ...options.markersState,
        justCreated: true
      }
    });
    component.seekToFirstMarker = sinon.spy();
    component.componentDidUpdate();
    assert.isTrue(component.seekToFirstMarker.calledOnce);
  });

  it('check componentDidUpdate with utteranceTime', function() {
    component = getComponent({
      ...options,
      playerState: {
        ...options.markersState,
        utteranceTime: 100
      }
    });
    component.seekToUtterance = sinon.spy();
    component.componentDidUpdate();
    assert.isTrue(component.seekToUtterance.calledOnce);
  });

  it('check togglePlay if paused', function() {
    component.onPause = sinon.spy();
    component.onPlay = sinon.spy();
    component.togglePlay();
    assert.isFalse(component.onPause.called);
    assert.isTrue(component.onPlay.calledOnce);
  });

  it('check togglePlay if played', function() {
    component = getComponent({
      ...options,
      playerState: {
        ...options.playerState,
        playing: true
      }
    });
    component.onPause = sinon.spy();
    component.onPlay = sinon.spy();
    component.togglePlay();
    assert.isFalse(component.onPlay.called);
    assert.isTrue(component.onPause.calledOnce);
  });

  it('check onDuration', function() {
    let setDuration = sinon.spy();
    component = getComponent({
      ...options,
      actions: {
        ...options.actions,
        setDuration
      }
    });
    component.onDuration(900);
    assert.isTrue(setDuration.calledOnce);
  });

  it('check onDuration with negative argument', function() {
    let setDuration = sinon.spy();
    component = getComponent({
      ...options,
      actions: {
        ...options.actions,
        setDuration
      }
    });
    component.onDuration(-1);
    assert.isFalse(setDuration.called);
  });

  it('check onDuration with same duration', function() {
    let setDuration = sinon.spy();
    component = getComponent({
      ...options,
      actions: {
        ...options.actions,
        setDuration
      }
    });
    component.onDuration(options.playerState.duration);
    assert.isFalse(setDuration.called);
  });

  it('check onPlay', function() {
    let play = sinon.spy();
    component = getComponent({
      ...options,
      actions: {
        ...options.actions,
        play
      }
    });
    component.onPlay();
    assert.isTrue(play.calledOnce);
  });

  it('check onPause', function() {
    let pause = sinon.spy();
    component = getComponent({
      ...options,
      actions: {
        ...options.actions,
        pause
      }
    });
    component.onPause();
    assert.isTrue(pause.calledOnce);
  });

  it('check onPause if loaded == 0', function() {
    let pause = sinon.spy();
    component = getComponent({
      ...options,
      playerState: {
        ...options.playerState,
        loaded: 0
      },
      actions: {
        ...options.actions,
        pause
      }
    });
    component.onPause();
    assert.isFalse(pause.called);
  });

  it('check onProgress for played', function() {
    let setPosition = sinon.spy();
    component = getComponent({
      ...options,
      actions: {
        ...options.actions,
        setPosition
      }
    });
    component.onProgress({played: 0.2});
    assert.isTrue(setPosition.calledOnce);
  });

  it('check onProgress for the same played', function() {
    let setPosition = sinon.spy();
    component = getComponent({
      ...options,
      actions: {
        ...options.actions,
        setPosition
      }
    });
    component.onProgress(options.playerState.played);
    assert.isFalse(setPosition.called);
  });

  it('check onProgress for loaded', function() {
    let setBuffered = sinon.spy();
    component = getComponent({
      ...options,
      actions: {
        ...options.actions,
        setBuffered
      }
    });
    component.onProgress({loaded: 200});
    assert.isTrue(setBuffered.calledOnce);
  });

  it('check onProgress for the same loaded', function() {
    let setBuffered = sinon.spy();
    component = getComponent({
      ...options,
      actions: {
        ...options.actions,
        setBuffered
      }
    });
    component.onProgress(options.playerState.loaded);
    assert.isFalse(setBuffered.called);
  });

  it('check onSeekMouseDown', function() {
    component.calcPosition = function () {
      return 100;
    };
    component.onSeekMouseDown();
    assert.equal(component.state.seeking, true);
    assert.equal(component.state.seekValue, 100);
  });

  it('check onSeekMouseMove with seeking == false', function() {
    component.state.seeking = false;
    component.onSeekMouseMove();
    assert.equal(component.onSeekMouseMove(), false);
  });

  it('check onSeekMouseDown', function() {
    component.calcPosition = function () {
      return 100;
    };
    component.state.seeking = true;
    component.onSeekMouseMove();
    assert.equal(component.state.seekValue, 100);
  });

  it('check onSeekMouseUp', function() {
    component.calcPosition = function () {
      return 100;
    };
    component.state.seeking = true;
    component.seekOnPosition = sinon.spy();
    component.onSeekMouseUp();
    assert.equal(component.state.seeking, false);
    assert.equal(component.seekOnPosition.calledOnce, true);
  });

  it('check onVolumeChange', function() {
    component.onVolumeChange(50);
    assert.equal(component.state.volume, 50);
  });

  it('check fullscreenPlayer', function() {
    let setFullscreen = sinon.spy();
    component = getComponent({
      ...options,
      actions: {
        ...options.actions,
        setFullscreen
      }
    });
    component.fullscreenPlayer();
    assert.isTrue(setFullscreen.calledOnce);
  });

  it('check exitFullscreen', function() {
    let setFullscreen = sinon.spy();
    component = getComponent({
      ...options,
      actions: {
        ...options.actions,
        setFullscreen
      }
    });
    component.exitFullscreen();
    assert.isTrue(setFullscreen.calledOnce);
  });

  it('check calcTimeOffset', function() {
    let res = component.calcTimeOffset(100);
    assert.equal(res, 0);
  });

  it('check calcTimeOffset without duration', function() {
    component = getComponent({
      ...options,
      mediaState: {
        ...options.mediaState,
        metadata: {
          duration: null
        }
      }
    });
    let res = component.calcTimeOffset(100);
    assert.equal(res, 0);
  });

  it('check calcPosition', function() {
    let res = component.calcPosition({
      pageX: 1000,
      currentTarget: {
        clientWidth: 1000
      }
    });
    assert.equal(res, 1);
  });

  it('check seekToFirstMarker', function() {
    var clock = sinon.useFakeTimers();
    let clearJustCreatedMarkers= sinon.spy();
    component = getComponent({
      ...options,
      actions: {
        ...options.actions,
        clearJustCreatedMarkers
      }
    });
    component.onSeekMarker = sinon.spy();
    component.seekToFirstMarker(options.markersState);
    clock.tick(200);

    assert.equal(clearJustCreatedMarkers.calledOnce, true);
    assert.equal(component.onSeekMarker.calledOnce, true);
    clock.restore();
  });

  it('check seekToNextMarker from last markers', function() {
    component = getComponent({
      ...options,
      playerState: {
        ...options.playerState,
        played: 100
      }
    });
    component.seekOnPosition = sinon.spy();
    component.onSeekMarker = sinon.spy();
    component.seekToNextMarker();

    assert.equal(component.onSeekMarker.calledOnce, true);
    assert.equal(component.seekOnPosition.called, false);
  });

  it('check seekToNextMarker from non-last markers', function() {
    component = getComponent({
      ...options,
      playerState: {
        ...options.playerState,
        duration: 100
      }
    });

    component.seekOnPosition = sinon.spy();
    component.onSeekMarker = sinon.spy();
    component.seekToNextMarker();

    assert.equal(component.onSeekMarker.called, false);
    assert.equal(component.seekOnPosition.calledOnce, true);
  });

  it('check seekToUtterance', function() {
    var clock = sinon.useFakeTimers();
    let clearUtteranceTime= sinon.spy();
    component = getComponent({
      ...options,
      actions: {
        ...options.actions,
        clearUtteranceTime
      }
    });
    component.onSeekMarker = sinon.spy();
    component.seekToUtterance(100);
    clock.tick(100);

    assert.equal(clearUtteranceTime.calledOnce, true);
    assert.equal(component.onSeekMarker.calledOnce, true);
    clock.restore();
  });

  it('check seekOnPosition', function() {
    let setPosition= sinon.spy();
    component = getComponent({
      ...options,
      actions: {
        ...options.actions,
        setPosition
      }
    });
    component.seekOnPosition(100);

    assert.equal(setPosition.calledOnce, true);
  });

  it('check onSeekMarker', function() {
    component.seekOnPosition = sinon.spy();
    component.onSeekMarker();
    assert.equal(component.seekOnPosition.calledOnce, true);
  });


});

