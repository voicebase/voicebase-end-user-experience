import React from 'react';
import ReactDom from 'react-dom';
import TestUtils from 'react-addons-test-utils'

import UploadContainer from '../../../app/components/upload/UploadContainer'
import {
  OPTIONS_TAB,
  initialState as uploadState
} from '../../../app/redux/modules/upload'
import {
  initialState as settingsState
} from '../../../app/redux/modules/settings'
import {
  initialState as groupsState
} from '../../../app/redux/modules/groups'
import actions from '../../../app/redux/rootActions'

describe('UploadContainer component', function () {
  let component;
  let rootElement;

  window.URL = {
    createObjectURL: function () {}
  };

  let options = {
    state: {
      auth: {
        token: 'token'
      },
      upload: uploadState,
      settings: {
        items: settingsState,
        groups: groupsState
      }
    },
    onFinish: function () {},
    isModal: false,
    actions: {
      ...actions,
      getGroups: function(){}
    }
  };

  const getComponent = function (_options = {}) {
    let props = {
      ...options,
      ..._options
    };

    return TestUtils.renderIntoDocument(
      <UploadContainer state={props.state}
                       onFinish={props.onFinish}
                       isModal={props.isModal}
                       actions={props.actions}
      />
    );
  };

  beforeEach(function () {
    component = getComponent();
    rootElement = ReactDom.findDOMNode(component);
  });

  it('Check root element', function() {
    assert.equal(rootElement.tagName, 'DIV');
  });

  it('Check onClose()', function() {
    let cancelUpload = sinon.spy();
    component = getComponent({
      ...options,
      actions: {
        ...options.actions,
        cancelUpload
      }
    });
    component.onClose();
    assert.equal(cancelUpload.calledOnce, true);
  });

  it('Check onSelectTab()', function() {
    let chooseTab = sinon.spy();
    component = getComponent({
      ...options,
      actions: {
        ...options.actions,
        chooseTab
      }
    });

    component.onSelectTab();

    assert.equal(chooseTab.calledOnce, true);
  });

  it('Check nextTab() when first tab is active', function() {
    component.onSelectTab = sinon.spy();
    component.nextTab();

    assert.equal(component.onSelectTab.calledOnce, true);
  });

  it('Check nextTab() when second tab is active', function() {
    let onFinish = sinon.spy();
    let postFile = sinon.spy();

    component = getComponent({
      ...options,
      state: {
        ...options.state,
        upload: uploadState
          .setIn(['view', 'activeTab'], OPTIONS_TAB)
          .set('fileIds', ['0'])
          .set('files', {
            '0': {
              file: {
                name: 'First',
                file: 'inputData'
              },
              type: 'audio'
            }
          })
          .set('optioins', {
            'groups': ['group'],
            'predictions': ['0']
          })
      },
      actions: {
        ...options.actions,
        postFile
      },
      onFinish
    });

    component.nextTab();

    assert.equal(postFile.calledOnce, true);
    assert.equal(onFinish.calledOnce, true);
  });

});

