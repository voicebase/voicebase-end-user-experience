import React from 'react';
import { shallowRender } from '../../../src/common/Test'
import TestUtils from 'react-addons-test-utils'

import Keywords from '../../../src/components/player/Keywords'

describe('Keywords component', function () {
  let component;

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
      setActiveTopic: function (mediaId, topicId) {},
      setActiveGroup: function (mediaId, topicId) {},
      setMarkers: function (mediaId, []) {}
    }
  };

  const getComponent = function (_options = {}) {
    let props = {
      ...options,
      ..._options
    };
    return shallowRender(
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

  const getTopicList = function () {
    return component
      .props.children
      .props.children[0]
      .props.children
  };

  const getKeywordsList = function () {
    return component
      .props.children
      .props.children[1]
      .props.children
  };

  beforeEach(function () {
    component = getComponent();
  });

  it('Check root element', function () {
    assert.equal(component.type, 'div');
    assert.equal(component.props.className, 'listing__keywords');
  });

  describe('Check topics list', function () {
    it('Check root element of topics list', function () {
      let topicList = getTopicList();
      assert.equal(topicList.type, 'ul');
      assert.equal(topicList.props.className, 'listing__keywords__topics');
    });

    it('Check count of topics in topics list', function () {
      let topicList = getTopicList();
      assert.equal(topicList.props.children.length, options.topicsIds.length);
    });

    it('Check items in topics list', function () {
      let topicList = getTopicList();
      topicList.props.children.forEach((topicItem, i) => {
        let topicId = options.topicsIds[i];
        let topicData = options.topics[topicId];
        let link = topicItem.props.children;

        assert.equal(topicItem.type, 'li');
        assert.equal(topicItem.key, 'topic-' + topicId);
        assert.equal(topicItem.props.className, (options.activeTopic === topicId) ? 'active' : '');
        assert.equal(link.props.children, topicData.name);
      });
    });

    it('Check click on topic item', function () {
      let setActiveTopic = sinon.spy();
      component = getComponent({
        ...options,
        actions: {
          ...options.actions,
          setActiveTopic
        }
      });
      let topicList = getTopicList();
      let topicItem = topicList.props.children[0];
      topicItem.props.onClick('topicId');
      assert.isTrue(setActiveTopic.calledOnce);
    });

    it('Check click on group item', function () {
      let setActiveGroup = sinon.spy();
      component = getComponent({
        ...options,
        type: 'groups',
        actions: {
          ...options.actions,
          setActiveGroup
        }
      });
      let topicList = getTopicList();
      let topicItem = topicList.props.children[0];
      topicItem.props.onClick('topicId');
      assert.isTrue(setActiveGroup.calledOnce);
    });
  });

  describe('Check keywords list', function () {
    it('Check root element of keywords list', function () {
      let keywordsList = getKeywordsList();
      assert.equal(keywordsList.type, 'ul');
      assert.equal(keywordsList.props.className, 'listing__keywords-of-topic');
    });

    it('Check count of keywords in keywords list', function () {
      let keywordsList = getKeywordsList();
      let topic = options.topics[options.activeTopic];
      assert.equal(keywordsList.props.children.length, topic.keywordsIds.length);
    });

    it('Check keys of keywords', function () {
      let keywordsList = getKeywordsList();
      let topic = options.topics[options.activeTopic];
      keywordsList.props.children.forEach((keywordItem, i) => {
        let keywordId = topic.keywordsIds[i];
        assert.equal(keywordItem.type, 'li');
        assert.equal(keywordItem.key, 'keyword-' + keywordId);
      });
    });

    it('Check names of keywords', function () {
      let keywordsList = getKeywordsList();
      let topic = options.topics[options.activeTopic];
      keywordsList.props.children.forEach((keywordItem, i) => {
        let keywordId = topic.keywordsIds[i];
        let keywordData = topic.keywords[keywordId];
        let nameBlock = keywordItem.props.children.props.children[0];
        assert.equal(nameBlock.type, 'span');
        assert.equal(nameBlock.props.children, keywordData.name);
      });
    });

    it('Check times of keywords', function () {
      let keywordsList = getKeywordsList();
      let topic = options.topics[options.activeTopic];
      keywordsList.props.children.forEach((keywordItem, i) => {
        let keywordId = topic.keywordsIds[i];
        let keywordData = topic.keywords[keywordId];
        let times = keywordData.t[options.activeSpeaker];
        let timesBlock = keywordItem.props.children.props.children[1];
        assert.equal(timesBlock.type, 'span');
        assert.equal(timesBlock.props.children.join(''), ` (${times.length})`);
      });
    });

    it('Check empty times of keywords', function () {
      component = getComponent({
        ...options,
        topics: {
          "ALL_TOPICS": {
            "name": "ALL TOPICS",
            "type": "category",
            "keywordsIds": [
              "0",
              "1"
            ],
            "keywords": {
              "0": {
                "name": "ability",
                "t": {}
              },
              "1": {
                "name": "upload",
                "t": {}
              }
            },
            "speakers": [
              "unknown"
            ]
          }
        }
      });

      let keywordsList = getKeywordsList();
      keywordsList.props.children.forEach((keywordItem, i) => {
        assert.isNull(keywordItem);
      });
    });

    it('Check click on keyword', function () {
      let setMarkers = sinon.spy();
      component = getComponent({
        ...options,
        actions: {
          setMarkers
        }
      });

      let keywordsList = getKeywordsList();
      let firstKeyword = keywordsList.props.children[0].props.children;
      firstKeyword.props.onClick();
      assert.isTrue(setMarkers.calledOnce);
    });

  });

});
