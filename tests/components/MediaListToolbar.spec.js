import React from 'react';
import { shallowRender } from '../../src/common/Test'
import TestUtils from 'react-addons-test-utils'

import { MediaListToolbar } from '../../src/components/MediaListToolbar'
import {ButtonGroup, Button} from 'react-bootstrap'

describe('MediaListToolbar component', function () {
  let component;

  let options = {
    token: 'token',
    selectedMediaIds: [],
    actions: {
      selectAllMedia: function (){},
      unselectAllMedia: function (){},
      deleteMedia: function (token, id){}
    }
  };

  const getComponent = function (_options = {}) {
    let props = {
      ...options,
      ..._options
    };
    return shallowRender(
      <MediaListToolbar token={props.token}
                        selectedMediaIds={props.selectedMediaIds}
                        actions={props.actions}
      />
    );
  };

  const getCountLabel = function () {
    return component
      .props.children
      .props.children[0]
      .props.children[0]
  };

  beforeEach(function () {
    component = getComponent();
  });

  it('Check root element', function() {
    assert.equal(component.type, 'div');
    assert.equal(component.props.className, 'listings__toolbar');
  });

  it('Check styles for empty selectedMediaIds', function() {
    assert.equal(component.props.style.opacity, 0);
    assert.equal(component.props.style.maxHeight, 0);
    assert.equal(component.props.style.padding, '0 20px');
  });

  it('Check styles for non-empty selectedMediaIds', function() {
    component = getComponent({
      ...options,
      selectedMediaIds: ['media1', 'media2']
    });
    assert.equal(component.props.style.opacity, 1);
    assert.equal(component.props.style.maxHeight, '50px');
    assert.equal(component.props.style.padding, '0 20px 20px');
  });

  it('Check counts label for empty selectedMediaIds', function() {
    let countLabel = getCountLabel();
    assert.equal(countLabel.props.className, 'count');
    assert.equal(countLabel.props.children, '0');
  });

  it('Check counts label for non-empty selectedMediaIds', function() {
    component = getComponent({
      ...options,
      selectedMediaIds: ['media1', 'media2']
    });
    let countLabel = getCountLabel();
    assert.equal(countLabel.props.children, '2');
  });

  it('Check deleteSelected', function() {
    const deleteMedia = sinon.spy();
    component = getComponent({
      ...options,
      selectedMediaIds: ['media1', 'media2'],
      actions: {
        ...options.actions,
        deleteMedia: deleteMedia
      }
    });
    let delBtn = component
      .props.children
      .props.children[1];
    delBtn.props.onClick();
    assert.isTrue(deleteMedia.calledTwice);
  });

  it('Check selectAll', function() {
    const selectAllMedia = sinon.spy();
    component = getComponent({
      ...options,
      actions: {
        ...options.actions,
        selectAllMedia: selectAllMedia
      }
    });
    let selectBtn = component
      .props.children
      .props.children[2];
    selectBtn.props.onClick();
    assert.isTrue(selectAllMedia.calledOnce);
  });

  it('Check unselectAll', function() {
    const unselectAllMedia = sinon.spy();
    component = getComponent({
      ...options,
      actions: {
        ...options.actions,
        unselectAllMedia: unselectAllMedia
      }
    });
    let selectBtn = component
      .props.children
      .props.children[3];
    selectBtn.props.onClick();
    assert.isTrue(unselectAllMedia.calledOnce);
  });

});

