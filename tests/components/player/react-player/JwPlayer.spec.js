import React from 'react';
import ReactDom from 'react-dom';
import { shallowRender } from '../../../../app/common/Test'
import TestUtils from 'react-addons-test-utils'

import JwPlayer from '../../../../app/components/player/react-player/JwPlayer'

describe('JwPlayer component', function () {
  let component;
  let rootElement;

  let jwplayerOptions = {
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
  };

  let jwplayerMock = function (options) {
      return function () {
        return options;
      };
  };

  let options = {
    width: 400,
    height: 400,
    onEnded: function(){}
  };

  const getComponent = function (_options = {}) {
    let props = {
      ...options,
      ..._options
    };

    return TestUtils.renderIntoDocument(
      <JwPlayer width={props.width}
                height={props.height}
                onEnded={props.onEnded}
      />
    );
  };

  beforeEach(function () {
    component = getComponent();
    rootElement = ReactDom.findDOMNode(component);
    window.jwplayer = jwplayerMock(jwplayerOptions);
  });

  it('Check root element', function () {
    assert.equal(rootElement.tagName, 'DIV');
  });

  it('Check displayName', function () {
    assert.equal(JwPlayer.displayName, 'JwPlayer');
  });

  it('Check canPlay()', function () {
    let canPlay = JwPlayer.canPlay();
    assert.equal(canPlay, true);
  });

  it('Check player init', function () {
    component.load('url');
    expect(component.player).to.eql(jwplayerOptions);
  });

  it('Check player isReady', function () {
    let _options = {
      ...jwplayerOptions,
      onReady: function (clb) {
          clb();
      }
    };
    window.jwplayer = jwplayerMock(_options);
    component.load('url');
    assert.equal(component.isReady, true);
  });

  it('Check player onComplete', function () {
    let onEnded = sinon.spy();
    component = getComponent({
      ...options,
      onEnded
    });
    let _options = {
      ...jwplayerOptions,
      onComplete: function (clb) {
          clb();
      }
    };
    window.jwplayer = jwplayerMock(_options);
    component.load('url');

    assert.equal(onEnded.calledOnce, true);
  });

  it('Check play() if state !== PLAYING', function () {
    let playSpy = sinon.spy();
    let _options = {
      ...jwplayerOptions,
      play: playSpy,
      getState: function () {
        return 'PAUSED';
      }
    };
    window.jwplayer = jwplayerMock(_options);
    component.onPlay = sinon.spy();

    component.load('url');
    component.play();

    assert.equal(playSpy.calledOnce, true);
    assert.equal(component.onPlay.calledOnce, true);
  });

  it('Check play() if state === PLAYING', function () {
    let playSpy = sinon.spy();
    let _options = {
      ...jwplayerOptions,
      play: playSpy,
      getState: function () {
        return 'PLAYING';
      }
    };
    window.jwplayer = jwplayerMock(_options);
    component.onPlay = sinon.spy();

    component.load('url');
    component.play();

    assert.equal(playSpy.called, false);
    assert.equal(component.onPlay.called, false);
  });

  it('Check pause() if state === PLAYING', function () {
    let pauseSpy = sinon.spy();
    let _options = {
      ...jwplayerOptions,
      pause: pauseSpy,
      getState: function () {
        return 'PLAYING';
      }
    };
    window.jwplayer = jwplayerMock(_options);

    component.load('url');
    component.pause();

    assert.equal(pauseSpy.calledOnce, true);
  });

  it('Check pause() if state === PAUSED', function () {
    let pauseSpy = sinon.spy();
    let _options = {
      ...jwplayerOptions,
      pause: pauseSpy,
      getState: function () {
        return 'PAUSED';
      }
    };
    window.jwplayer = jwplayerMock(_options);

    component.load('url');
    component.pause();

    assert.equal(pauseSpy.called, false);
  });

  it('Check pause() if state === IDLE', function () {
    let pauseSpy = sinon.spy();
    let _options = {
      ...jwplayerOptions,
      pause: pauseSpy,
      getState: function () {
        return 'IDLE';
      }
    };
    window.jwplayer = jwplayerMock(_options);

    component.load('url');
    component.pause();

    assert.equal(pauseSpy.called, false);
  });

  it('Check stop()', function () {
    let stop = sinon.spy();
    let _options = {
      ...jwplayerOptions,
      stop
    };
    window.jwplayer = jwplayerMock(_options);

    component.load('url');
    component.stop();

    assert.equal(stop.calledOnce, true);
  });

  it('Check seekTo()', function () {
    let seek = sinon.spy();
    let _options = {
      ...jwplayerOptions,
      seek
    };
    window.jwplayer = jwplayerMock(_options);

    component.load('url');
    component.seekTo(0);

    assert.equal(seek.calledOnce, true);
  });

  it('Check setVolume()', function () {
    let setVolume = sinon.spy();
    let _options = {
      ...jwplayerOptions,
      setVolume
    };
    window.jwplayer = jwplayerMock(_options);

    component.load('url');
    component.setVolume(0);

    assert.equal(setVolume.calledOnce, true);
  });

  it('Check getDuration()', function () {
    let getDuration = sinon.spy();
    let _options = {
      ...jwplayerOptions,
      getDuration
    };
    window.jwplayer = jwplayerMock(_options);

    component.load('url');
    component.getDuration();

    assert.equal(getDuration.calledOnce, true);
  });

  it('Check getFractionPlayed() for non-ready player', function () {
    component.load('url');
    let res = component.getFractionPlayed();

    assert.equal(res, null);
  });

  it('Check getFractionPlayed() for ready player and BUFFERING', function () {
    let _options = {
      ...jwplayerOptions,
      onReady: function (clb) {
        clb();
      },
      getState: function () {
        return 'BUFFERING';
      }
    };
    window.jwplayer = jwplayerMock(_options);

    component.load('url');
    let res = component.getFractionPlayed();

    assert.equal(res, null);
  });

  it('Check getFractionPlayed()', function () {
    let _options = {
      ...jwplayerOptions,
      onReady: function (clb) {
        clb();
      },
      getState: function () {
        return 'PLAYING';
      },
      getPosition: function () {
        return 1000;
      },
      getDuration: function () {
        return 1000;
      }
    };
    window.jwplayer = jwplayerMock(_options);

    component.load('url');
    let res = component.getFractionPlayed();

    assert.equal(res, 1);
  });

  it('Check getFractionLoaded() for non-ready player', function () {
    component.load('url');
    let res = component.getFractionLoaded();

    assert.equal(res, null);
  });

  it('Check getFractionLoaded() for ready player and no getBuffer', function () {
    let _options = {
      ...jwplayerOptions,
      onReady: function (clb) {
        clb();
      },
      getBuffer: null
    };
    window.jwplayer = jwplayerMock(_options);

    component.load('url');
    let res = component.getFractionLoaded();

    assert.equal(res, null);
  });

  it('Check getFractionLoaded()', function () {
    let expectedRes = true;
    let _options = {
      ...jwplayerOptions,
      onReady: function (clb) {
        clb();
      },
      getBuffer: function () {
          return expectedRes;
      }
    };
    window.jwplayer = jwplayerMock(_options);

    component.load('url');
    let res = component.getFractionLoaded();

    assert.equal(res, expectedRes);
  });


});
