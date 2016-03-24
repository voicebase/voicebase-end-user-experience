import React from 'react';
import ReactDom from 'react-dom';
import { shallowRender } from '../../../src/common/Test'
import TestUtils from 'react-addons-test-utils'

import LanguageDropdown from '../../../src/components/upload/LanguageDropdown'
import UsFlag from '../../../src/images/us.png'
import UkFlag from '../../../src/images/uk.png'

describe('LanguageDropdown component', function () {
  let component;
  let rootElement;

  let options = {
    languages: {
      "us": {
        "id": "us",
        "name": "US English"
      },
      "uk": {
        "id": "uk",
        "name": "UK English"
      }
    },
    activeLanguageId: 'us',
    onSelect: function () {}
  };

  const getComponent = function (_options = {}) {
    let props = {
      ...options,
      ..._options
    };

    return TestUtils.renderIntoDocument(
      <LanguageDropdown languages={props.languages}
                        activeLanguageId={props.activeLanguageId}
                        onSelect={props.onSelect}
      />
    );
  };

  beforeEach(function () {
    component = getComponent();
    rootElement = ReactDom.findDOMNode(component);
  });

  it('Check onSelectItem()', function () {
    let onSelect = sinon.spy();
    component = getComponent({
      ...options,
      onSelect
    });
    component.onSelectItem();
    assert.equal(onSelect.calledOnce, true);
  });

  it('Check getFlag()', function () {
    let res = component.getFlag('us');
    expect(res).to.eql(UsFlag);
    res = component.getFlag('uk');
    expect(res).to.eql(UkFlag);
    res = component.getFlag('');
    assert.isUndefined(res);
  });

  it('Check getItemContent()', function () {
    let item = component.getItemContent(options.languages.us);
    let child = item.props.children;
    let img = child[0];
    let space = child[1];
    let name = child[2];
    assert.equal(item.type, 'span');
    assert.equal(img.type, 'img');
    assert.equal(img.props.className, 'flag');
    assert.equal(img.props.src, UsFlag);
    assert.equal(space, ' ');
    assert.equal(name, options.languages.us.name);
  });

});


