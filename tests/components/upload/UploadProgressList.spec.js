import React from 'react';
import ReactDom from 'react-dom';
import TestUtils from 'react-addons-test-utils'

import UploadProgressList from '../../../app/components/upload/UploadProgressList'

describe('UploadProgressList component', function () {
  let component;
  let rootElement;

  let options = {
    uploadState: {
      fileIds: ['0', '1'],
      files: {
        '0': {
          file: {name: 'First'},
          data: {mediaId: '0'},
          isPostPending: true
        },
        '1': {
          file: {name: 'Second'},
          data: {mediaId: '0'},
          isPostComplete: true
        }
      }
    },
    actions: {
      removeFile: function(){},
      addProcessingMedia: function(){}
    }
  };

  const getComponent = function (_options = {}) {
    let props = {
      ...options,
      ..._options
    };

    return TestUtils.renderIntoDocument(
      <UploadProgressList uploadState={props.uploadState}
                          actions={props.actions}
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

  it('Check componentWillUpdate', function () {
    let removeFile = sinon.spy();
    let addProcessingMedia = sinon.spy();
    component = getComponent({
      ...options,
      actions: {
        removeFile,
        addProcessingMedia
      }
    });

    component.componentWillUpdate(options);

    assert.equal(removeFile.calledOnce, true);
    assert.equal(addProcessingMedia.calledOnce, true);
  });

});

