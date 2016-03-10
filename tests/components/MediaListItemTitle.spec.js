import React from 'react';
import { shallowRender } from '../../src/common/Test'
import TestUtils from 'react-addons-test-utils'

import { MediaListItemTitle } from '../../src/components/MediaListItemTitle'

describe('MediaListItemTitle component', function () {
  let component;

  let options = {
    mediaId: 'mediaId',
    metadata: {}
  };

  const getComponent = function (_options = {}) {
    let props = {
      ...options,
      ..._options
    };
    return shallowRender(
      <MediaListItemTitle mediaId={props.mediaId}
                          metadata={props.metadata}
      />
    );
  };

  beforeEach(function () {
    component = getComponent();
  });

  it('Check root element', function() {
    assert.equal(component.type, 'h4');
    assert.equal(component.props.className, 'list-group-item-heading');
  });

  it('Check title if no metadata', function() {
    assert.equal(component.props.children, options.mediaId);
  });

  it('Check title with externalId', function() {
    let externalId = 'externalId';
    component = getComponent({
      ...options,
      metadata: {
        external: {
          id: externalId
        }
      }
    });
    assert.equal(component.props.children, externalId);
  });

  it('Check title with title', function() {
    let title = 'title';
    component = getComponent({
      ...options,
      metadata: {
        title: title
      }
    });
    assert.equal(component.props.children, title);
  });

  it('Check title with title and external id', function() {
    let title = 'title';
    let externalId = 'externalId';
    component = getComponent({
      ...options,
      metadata: {
        title: title,
        external: {
          id: externalId
        }
      }
    });
    assert.equal(component.props.children, title);
  });


});
