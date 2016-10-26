import React from 'react';
import ReactDom from 'react-dom';
import TestUtils from 'react-addons-test-utils'

import KeywordWord from '../../../app/components/player/KeywordWord'

describe('KeywordWord component', function () {
  let component;
  let rootElement;

  let options = {
    activeSpeakerId: null,
    keyword: {
      "t": {
        "sp1": [
          "2.64",
          "220.89",
          "240.26"
        ],
        "sp2": [
          "2.64"
        ]
      },
      "name": "John Adams",
      "score": "1"
    },
    setMarkers: function(){}
  };

  const getComponent = function (_options = {}) {
    let props = {
      ...options,
      ..._options
    };

    return TestUtils.renderIntoDocument(
      <KeywordWord activeSpeakerId={props.activeSpeakerId}
                   keyword={props.keyword}
                   setMarkers={props.setMarkers}
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

  it('Check keyword name', function () {
    let $name = rootElement.getElementsByClassName('listing__keywords__keyword-name')[0];
    assert.equal($name.textContent, options.keyword.name);
  });

  it('Check count of times', function () {
    let timesSpan = rootElement.getElementsByTagName('span')[1];
    assert.equal(timesSpan.textContent, ' (4)');
  });

  it('Check keyword with empty times', function () {
    component = getComponent({
      ...options,
      keyword: {
        ...options.keyword,
        "t": {}
      }
    });
    rootElement = ReactDom.findDOMNode(component);
    assert.equal(rootElement, null);
  });

  it('Check shouldComponentUpdate if non change', function () {
    let res = component.shouldComponentUpdate({...options});
    assert.equal(res, false);
  });

  it('Check shouldComponentUpdate if change activeSpeakerId', function () {
    let res = component.shouldComponentUpdate({
      ...options,
      activeSpeakerId: '0'
    });
    assert.equal(res, true);
  });

  it('Check shouldComponentUpdate if change keyword', function () {
    let res = component.shouldComponentUpdate({
      ...options,
      keyword: {
        ...options.keyword,
        name: 'newName'
      }
    });
    assert.equal(res, true);
  });

  it('Check onClickKeyword', function () {
    let setMarkers = sinon.spy();
    component = getComponent({
      ...options,
      setMarkers
    });

    component.onClickKeyword(options.keyword);
    assert.isTrue(setMarkers.calledOnce);
  });

  it('Check getKeywordTimes for all speakers', function () {
    let res = component.getKeywordTimes(options.keyword);
    expect(res).to.eql([
      "2.64",
      "220.89",
      "240.26",
      "2.64"
    ]);
  });

  it('Check getKeywordTimes with active speaker', function () {
    component = getComponent({
      ...options,
      activeSpeakerId: 'sp2'
    });
    let res = component.getKeywordTimes(options.keyword);
    expect(res).to.eql([
      "2.64"
    ]);
  });

});
