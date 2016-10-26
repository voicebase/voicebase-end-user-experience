import React from 'react';
import { shallowRender } from '../../../app/common/Test'
import TestUtils from 'react-addons-test-utils'

import DetectionList from '../../../app/components/player/DetectionList'

describe('DetectionList component', function () {
  let component;

  let options = {
    mediaId: 'mediaId',
    utterances: {
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
          "color": "#3B5A5B"
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
          "color": "#08DAD3"
        }
      }
    },
    playerState: {
      "loaded": 0,
      "isFullscreen": false,
      "timelineWidth": 663,
      "error": "",
      "playing": false,
      "url": "url",
      "played": 0,
      "duration": 360,
      "type": "audio",
      "utteranceTime": null
    },
    actions: {
      setUtteranceTime: function(mediaId, time){}
    }
  };

  const getComponent = function (_options = {}) {
    let props = {
      ...options,
      ..._options
    };
    return shallowRender(
      <DetectionList mediaId={props.mediaId}
                     utterances={props.utterances}
                     playerState={props.playerState}
                     actions={props.actions}
      />
    );
  };

  const getUtteranceItem = function (index) {
    return component.props.children[index];
  };

  beforeEach(function () {
    component = getComponent();
  });

  it('Check root element', function () {
    assert.equal(component.type, 'div');
    assert.equal(component.props.className, 'listing__detection');
    assert.equal(component.props.children.length, options.utterances.itemIds.length);
  });

  it('Check key of utterance item element', function () {
    options.utterances.itemIds.forEach((itemId, i) => {
      let item = getUtteranceItem(i);
      assert.equal(item.key, 'utterance-item' + itemId);
    });
  });

  it('Check utterance name', function () {
    options.utterances.itemIds.forEach((itemId, i) => {
      let item = getUtteranceItem(i);
      let itemData = options.utterances.items[itemId];
      let nameLabel = item.props.children[0];
      assert.equal(nameLabel.props.children, itemData.name);
    });
  });

  it('Check utterance name color', function () {
    options.utterances.itemIds.forEach((itemId, i) => {
      let item = getUtteranceItem(i);
      let itemData = options.utterances.items[itemId];
      let nameLabel = item.props.children[0];
      assert.equal(nameLabel.props.style.color, itemData.color);
    });
  });

  it('Check utterance segmentsContainer', function () {
    options.utterances.itemIds.forEach((itemId, i) => {
      let item = getUtteranceItem(i);
      let segmentsContainer = item.props.children[1];
      assert.equal(segmentsContainer.props.style.width, options.playerState.timelineWidth + 'px');
    });
  });

  it('Check utterance segments count', function () {
    options.utterances.itemIds.forEach((itemId, i) => {
      let item = getUtteranceItem(i);
      let itemData = options.utterances.items[itemId];
      let segmentsContainer = item.props.children[1];
      assert.equal(segmentsContainer.props.children.length, itemData.segments.length);
    });
  });

  it('Check utterance segments keys', function () {
    options.utterances.itemIds.forEach((itemId, i) => {
      let item = getUtteranceItem(i);
      let segmentsContainer = item.props.children[1];
      segmentsContainer.props.children.forEach((segment, i) => {
        assert.equal(segment.key, 'utterance-marker-' + itemId + '-segment-' + i);
      });
    });
  });
  
});
