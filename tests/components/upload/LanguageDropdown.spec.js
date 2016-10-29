import React from 'react';
import ReactDom from 'react-dom';
import TestUtils from 'react-addons-test-utils'

import LanguageDropdown from '../../../app/components/upload/LanguageDropdown'

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

  it('Check getItemContent()', function () {
    let item = component.getItemContent(options.languages.us);
    assert.equal(item.type, 'span');
    assert.equal(item.props.children, options.languages.us.name);
  });

});


