import React from 'react';
import ReactDom from 'react-dom';
import { shallowRender } from '../../../src/common/Test'
import TestUtils from 'react-addons-test-utils'

import KeywordTopic from '../../../src/components/player/KeywordTopic'

describe('KeywordTopic component', function () {
  let component;
  let rootElement;

  let options = {
    topicName: 'topicName',
    isActive: false,
    onClickTopic: function(){}
  };

  const getComponent = function (_options = {}) {
    let props = {
      ...options,
      ..._options
    };

    return TestUtils.renderIntoDocument(
      <KeywordTopic topicName={props.topicName}
                    isActive={props.isActive}
                    onClickTopic={props.onClickTopic}
      />
    );
  };

  beforeEach(function () {
    component = getComponent();
    rootElement = ReactDom.findDOMNode(component);
  });

  it('Check root element', function () {
    assert.equal(rootElement.tagName, 'LI');
  });

  it('Check topic name', function () {
    let link = rootElement.children[0];
    assert.equal(link.textContent, options.topicName);
  });

  it('Check active topic', function () {
    component = getComponent({
      ...options,
      isActive: true
    });
    rootElement = ReactDom.findDOMNode(component);
    assert.equal(rootElement.className, 'active');
  });

  it('Check shouldComponentUpdate with changed isActive', function () {
    let res = component.shouldComponentUpdate({
      ...options,
      isActive: true
    });

    assert.isTrue(res);
  });

  it('Check shouldComponentUpdate with non-changed isActive', function () {
    let res = component.shouldComponentUpdate({
      ...options
    });

    assert.isFalse(res);
  });

});
