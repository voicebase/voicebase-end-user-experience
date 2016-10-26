import React from 'react';
import ReactDom from 'react-dom';
import { shallowRender } from '../../../app/common/Test'
import TestUtils from 'react-addons-test-utils'

import UploadPreview from '../../../app/components/upload/UploadPreview'

describe('UploadPreview component', function () {
  let component;
  let rootElement;

  window.URL = {
    createObjectURL: function () {}
  };

  let options = {
    uploadState: {
      fileIds: ['0', '1'],
      files: {
        '0': {
          file: {
            name: 'First',
            file: 'inputData'
          },
          type: 'audio'
        },
        '1': {
          file: {
            name: 'Second',
            file: 'inputData'
          },
          type: 'video'
        }
      }
    },
    playerState: {
      playerIds: ['0'],
      players: {
        '0': {}
      }
    },
    actions: {
      createPlayer: function () {},
      removeFile: function () {},
      destroyPlayer: function () {}
    }
  };

  const getComponent = function (_options = {}) {
    let props = {
      ...options,
      ..._options
    };

    return TestUtils.renderIntoDocument(
      <UploadPreview uploadState={props.uploadState}
                     playerState={props.playerState}
                     actions={props.actions}
      />
    );
  };

  beforeEach(function () {
    component = getComponent();
    rootElement = ReactDom.findDOMNode(component);
  });

  it('Check componentWillMount()', function () {
    let createPlayer = sinon.spy();
    component = getComponent({
      ...options,
      actions: {
        ...options.actions,
        createPlayer
      }
    });

    component.componentWillMount();

    assert.equal(createPlayer.called, true);
  });

  it('Check componentWillMount() without files', function () {
    let createPlayer = sinon.spy();
    component = getComponent({
      ...options,
      uploadState: {
        fileIds: [],
        files: {}
      },
      actions: {
        ...options.actions,
        createPlayer
      }
    });

    component.componentWillMount();

    assert.equal(createPlayer.called, false);
  });

  it('Check componentWillMount() with players', function () {
    let createPlayer = sinon.spy();
    component = getComponent({
      ...options,
      playerState: {
        playerIds: ['0', '1'],
        players: {
          '0': {},
          '1': {}
        }
      },
      actions: {
        ...options.actions,
        createPlayer
      }
    });

    component.componentWillMount();

    assert.equal(createPlayer.called, false);
  });

  it('Check componentWillUnmount()', function () {
    let destroyPlayer = sinon.spy();
    component = getComponent({
      ...options,
      actions: {
        ...options.actions,
        destroyPlayer
      }
    });

    component.componentWillUnmount();

    assert.equal(destroyPlayer.called, true);
  });

  it('Check componentWillUnmount() without files', function () {
    let destroyPlayer = sinon.spy();
    component = getComponent({
      ...options,
      uploadState: {
        fileIds: [],
        files: {}
      },
      actions: {
        ...options.actions,
        destroyPlayer
      }
    });

    component.componentWillUnmount();

    assert.equal(destroyPlayer.called, false);
  });

});

