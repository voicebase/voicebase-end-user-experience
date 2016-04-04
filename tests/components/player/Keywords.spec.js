import React from 'react';
import ReactDom from 'react-dom';
import TestUtils from 'react-addons-test-utils'

import Keywords from '../../../src/components/player/Keywords'

describe('Keywords component', function () {
  let component;
  let rootElement;

  let options = {
    mediaId: 'mediaId',
    type: 'keywords',
    "activeSpeaker": "unknown",
    "activeTopic": "ALL_TOPICS",
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
    actions: {
      setActiveTopic: function (mediaId, topicId, type) {},
      setMarkers: function (mediaId, []) {}
    }
  };

  const getComponent = function (_options = {}) {
    let props = {
      ...options,
      ..._options
    };
    return TestUtils.renderIntoDocument(
      <Keywords mediaId={props.mediaId}
                type={props.type}
                activeSpeaker={props.activeSpeaker}
                activeTopic={props.activeTopic}
                topicsIds={props.topicsIds}
                topics={props.topics}
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
    assert.equal(rootElement.className, 'listing__keywords');
  });

  it('Check setActiveTopic()', function () {
    let setActiveTopic = sinon.spy();
    component = getComponent({
      ...options,
      actions: {
        setActiveTopic
      }
    });
    component.setActiveTopic('1');
    assert.equal(setActiveTopic.calledOnce, true);
  });

  it('Check setMarkers()', function () {
    let setMarkers = sinon.spy();
    component = getComponent({
      ...options,
      actions: {
        setMarkers
      }
    });
    component.setMarkers([]);
    assert.equal(setMarkers.calledOnce, true);
  });

});
