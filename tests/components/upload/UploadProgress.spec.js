import React from 'react';
import ReactDom from 'react-dom';
import { shallowRender } from '../../../app/common/Test'
import TestUtils from 'react-addons-test-utils'

import UploadProgress from '../../../app/components/upload/UploadProgress'

describe('UploadProgress component', function () {
  let component;
  let rootElement;

  let options = {
    uploadState: {
      files: {
        '0': {
          file: {name: 'First'}
        },
        '1': {
          file: {name: 'Second'}
        }
      }
    },
    pendingFileIds: ['0', '1']
  };

  const getComponent = function (_options = {}) {
    let props = {
      ...options,
      ..._options
    };

    return TestUtils.renderIntoDocument(
      <UploadProgress uploadState={props.uploadState}
                      pendingFileIds={props.pendingFileIds}
      />
    );
  };

  beforeEach(function () {
    component = getComponent();
    rootElement = ReactDom.findDOMNode(component);
  });

  it('Check root component', function () {
    assert.equal(rootElement.tagName, 'DIV');
  });

  it('Check count of progress bars', function () {
    assert.equal(rootElement.children.length, options.pendingFileIds.length);
  });

  it('Check names of progress bars', function () {
    for (let i = 0; i < rootElement.children.length; i++) {
      let bar = rootElement.children[i];
      let title = bar.getElementsByClassName('list-group-item-heading');
      assert.equal(title[0].textContent, options.uploadState.files[i].file.name);
    }
  });

});

