import React from 'react';
import { shallowRender } from '../../src/common/Test'
import { fromJS } from 'immutable'

import { SidebarMenu } from '../../src/components/SidebarMenu'
import { SidebarLink } from '../../src/components/SidebarLink'
import {Nav, NavItem} from 'react-bootstrap'
import Logo from '../../src/images/voicebase-logo-2.png'
import CounterLabel from '../../src/components/CounterLabel'

describe('SidebarMenu component', function () {
  let component;

  let options = {
    state: {
      router: {
        path: 'path'
      },
      media: {
        mediaList: fromJS({
          mediaIds: [],
          lastUploadedIds: []
        })
      }
    },
    history: {
      pushState: function (){}
    },
    actions: {
      signOut: function (){}
    }
  };

  const getComponent = function (_options = {}) {
    let props = {
      ...options,
      ..._options
    };
    return shallowRender(
      <SidebarMenu state={props.state}
                   history={props.history}
                   actions={props.actions}
      />
    );
  };

  beforeEach(function () {
    component = getComponent();
  });

  it('Check root element', function() {
    assert.equal(component.type, 'div');
    assert.equal(component.props.className, 'sidebar__content');
  });

  it('Check Logo', function() {
    let logo = component.props.children[0];
    let logoImage = logo.props.children;
    assert.equal(logo.type, 'div');
    assert.equal(logo.props.className, 'logo-wrapper');
    assert.equal(logoImage.type, 'img');
    assert.equal(logoImage.props.className, 'img-responsive');
    assert.equal(logoImage.props.src, Logo);
  });

  describe('Check Main Nav', function() {
    let nav;

    const getNav = function () {
      return component.props.children[1];
    };

    beforeEach(function () {
      nav = getNav();
    });

    it('Check root element', function() {
      assert.equal(nav.type, Nav);
      assert.equal(nav.props.stacked, true);
    });

    it('Check upload item', function() {
      let item = nav.props.children[0];
      assert.equal(item.type, SidebarLink);
      assert.equal(item.props.className, 'upload-files');
      assert.equal(item.props.url, '/upload');
    });

    it('Check empty All item', function() {
      let item = nav.props.children[1];
      assert.equal(item, null);
    });

    it('Check non-empty All item', function() {
      const redirect = sinon.spy();
      component = getComponent({
        ...options,
        state: {
          ...options.state,
          media: {
            mediaList: fromJS({
              mediaIds: ['1', '2'],
              lastUploadedIds: []
            })
          }
        }
      });
      nav = getNav();
      let item = nav.props.children[1];
      assert.equal(item.type, SidebarLink);
      assert.equal(item.props.url, '/all');
    });

    it('Check non-empty Uploaded items', function() {
      const redirect = sinon.spy();
      component = getComponent({
        ...options,
        state: {
          ...options.state,
          media: {
            mediaList: fromJS({
              mediaIds: [],
              lastUploadedIds: ['1', '2']
            })
          }
        },
        history: {
          pushState: redirect
        }
      });
      nav = getNav();
      let item = nav.props.children[2];
      assert.equal(item.type, SidebarLink);
    });

  });

  describe('Check Bottom Nav', function() {
    let nav;

    const getNav = function () {
      return component.props.children[2];
    };

    const getSettingsItem = function () {
        return nav.props.children[0];
    };

    const getLogoutItem = function () {
        return nav.props.children[1];
    };

    beforeEach(function () {
      nav = getNav();
    });

    it('Check root element', function() {
      assert.equal(nav.type, Nav);
      assert.equal(nav.props.stacked, true);
      assert.equal(nav.props.className, 'bottom');
    });

    it('Check Settings item', function() {
      let item = getSettingsItem();
      assert.equal(item.type, SidebarLink);
      assert.equal(item.props.url, '/settings');
    });

    it('Check Logout item', function() {
      let item = getLogoutItem();
      assert.equal(item.type, NavItem);
    });

  });

});
