import React from 'react';
import ReactDom from 'react-dom';
import { shallowRender } from '../../../src/common/Test'
import TestUtils from 'react-addons-test-utils'

import UploadZone from '../../../src/components/upload/UploadZone'

describe('UploadZone component', function () {
  let component;
  let rootElement;

  let options = {
    actions: {
      addFiles: function () {}
    }
  };

  let files = [{
    name: 'test.mp3',
    size: 100
  }];


  const getComponent = function (_options = {}) {
    let props = {
      ...options,
      ..._options
    };

    return TestUtils.renderIntoDocument(
      <UploadZone actions={props.actions} />
    );
  };

  beforeEach(function () {
    component = getComponent();
    rootElement = ReactDom.findDOMNode(component);
  });

  it('Check root component', function () {
    assert.equal(rootElement.tagName, 'DIV');
  });

  it('Check validate() ', function () {
    let res = component.validate(files);

    assert.equal(res, true);
  });

  it('Check validate() if files more than 3', function () {
    let _files = [].concat(files, files, files, files);
    component.showError = sinon.spy();

    let res = component.validate(_files);

    assert.equal(res, false);
    assert.equal(component.showError.calledOnce, true);
  });

  it('Check validate() with not supported format', function () {
    let _files = [{
      name: 'test.txt',
      size: 100
    }];
    component.showError = sinon.spy();

    let res = component.validate(_files);

    assert.equal(res, false);
    assert.equal(component.showError.calledOnce, true);
  });

  it('Check validate() with empty file', function () {
    let _files = [{
      name: 'test.mp3',
      size: 0
    }];
    component.showError = sinon.spy();

    let res = component.validate(_files);

    assert.equal(res, false);
    assert.equal(component.showError.calledOnce, true);
  });

  it('Check validate() with size more than 100MB', function () {
    let _files = [{
      name: 'test.mp3',
      size: 209715200
    }];
    component.showError = sinon.spy();

    let res = component.validate(_files);

    assert.equal(res, false);
    assert.equal(component.showError.calledOnce, true);
  });

  it('Check onDrop()', function () {
    let addFiles = sinon.spy();
    component = getComponent({
      ...options,
      actions: {
        addFiles
      }
    });

    component.onDrop(files);

    assert.equal(addFiles.calledOnce, true);
  });

  it('Check onDrop() with invalid files', function () {
    let addFiles = sinon.spy();
    component = getComponent({
      ...options,
      actions: {
        addFiles
      }
    });
    let _files = [{
      name: 'test.mp3',
      size: 0
    }];

    component.onDrop(_files);

    assert.equal(addFiles.called, false);
  });

});

