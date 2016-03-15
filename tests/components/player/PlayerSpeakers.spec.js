import React from 'react';
import ReactDom from 'react-dom';
import { shallowRender } from '../../../src/common/Test'
import TestUtils from 'react-addons-test-utils'

import PlayerSpeakers from '../../../src/components/player/PlayerSpeakers'

describe('ProcessingListItem component', function () {
  let component;
  let rootElement;

  let options = {
    duration: 1000,
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
    "transcriptSpeakers": [
      {
        "start": 0,
        "name": "Speaker 1"
      },
      {
        "start": 100000,
        "name": "Speaker 2"
      }
    ],
    calcTimeOffset: function(time) {
      return time
    }
  };

  const getComponent = function (_options = {}) {
    let props = {
      ...options,
      ..._options
    };

    return TestUtils.renderIntoDocument(
      <PlayerSpeakers duration={props.duration}
                      speakers={props.speakers}
                      transcriptSpeakers={props.transcriptSpeakers}
                      calcTimeOffset={props.calcTimeOffset}
      />
    );
  };

  const rgb2hex = function (rgb) {
    rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    function hex(x) {
      return ("0" + parseInt(x).toString(16)).slice(-2);
    }
    return ("#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3])).toUpperCase();
  };

  beforeEach(function () {
    component = getComponent();
    rootElement = ReactDom.findDOMNode(component);
  });

  it('Check root element', function() {
    assert.equal(rootElement.tagName, 'DIV');
    assert.equal(rootElement.className, 'player__timeline__speakers');
  });

  it('Check count of speakers', function() {
    assert.equal(rootElement.children.length, options.transcriptSpeakers.length);
  });

  it('Check count of speakers', function() {
    assert.equal(rootElement.children.length, options.transcriptSpeakers.length);
  });

  it('Check styles of speakers', function() {
    let speakers = TestUtils.scryRenderedDOMComponentsWithClass(component, 'player__timeline__speaker');
    options.transcriptSpeakers.forEach((speakerData, i) => {
      let start = options.calcTimeOffset(speakerData.start / 1000);
      let end = (options.transcriptSpeakers[i + 1]) ? options.calcTimeOffset(options.transcriptSpeakers[i + 1].start / 1000) : options.calcTimeOffset(options.duration);
      assert.equal(speakers[i].style.left, start + 'px');
      assert.equal(speakers[i].style.width, (end - start) + 'px');
      assert.equal(rgb2hex(speakers[i].style.backgroundColor), options.speakers[speakerData.name].color);
    });
  });

  it('Check componentWillMount', function() {
    component.componentWillMount();
    expect(component.state).to.eql({initialRender: true});
  });

  it('Check componentDidMount', function() {
    component.componentDidMount();
    expect(component.state).to.eql({initialRender: false});
  });

});


