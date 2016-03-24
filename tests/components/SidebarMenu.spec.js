import React from 'react';
import { shallowRender } from '../../src/common/Test'
import TestUtils from 'react-addons-test-utils'
import { fromJS } from 'immutable'

import { SidebarMenu } from '../../src/components/SidebarMenu'
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
      assert.equal(item.type, NavItem);
      assert.equal(item.props.className, 'upload-files');
      assert.equal(item.props.children, 'Upload Files');
    });

    it('Check redirect after click upload item', function() {
      const redirect = sinon.spy();
      component = getComponent({
        ...options,
        history: {
          pushState: redirect
        }
      });
      nav = getNav();
      let item = nav.props.children[0];
      item.props.onClick('/upload');
      assert.isTrue(redirect.calledOnce);
    });

    it('Check non-active upload item', function() {
      let item = nav.props.children[0];
      assert.equal(item.props.active, false);
    });

    it('Check active upload item', function() {
      component = getComponent({
        ...options,
        state: {
          ...options.state,
          router: {
            path: '/upload'
          }
        }
      });
      nav = getNav();
      let item = nav.props.children[0];
      assert.equal(item.props.active, true);
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
        },
        history: {
          pushState: redirect
        }
      });
      nav = getNav();
      let item = nav.props.children[1];
      assert.equal(item.type, NavItem);
      assert.equal(item.props.active, false);
      assert.equal(item.props.children[0], 'All My Files');
      assert.equal(item.props.children[1].type, CounterLabel);
      assert.equal(item.props.children[1].props.value, 2);
      item.props.onClick('/all');
      assert.isTrue(redirect.calledOnce);
    });

    it('Check active All item', function() {
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
          },
          router: {
            path: '/all'
          }
        }
      });
      nav = getNav();
      let item = nav.props.children[1];
      assert.equal(item.props.active, true);
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
      assert.equal(item.type, NavItem);
      assert.equal(item.props.active, false);
      assert.equal(item.props.children[0], 'Last Upload');
      assert.equal(item.props.children[1].type, CounterLabel);
      assert.equal(item.props.children[1].props.value, 2);
      item.props.onClick('/last-upload');
      assert.isTrue(redirect.calledOnce);
    });

    it('Check active Upload item', function() {
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
          },
          router: {
            path: '/last-upload'
          }
        }
      });
      nav = getNav();
      let item = nav.props.children[2];
      assert.equal(item.props.active, true);
    });

  });

  describe('Check Bottom Nav', function() {
    let nav;

    const getNav = function () {
      return component.props.children[2];
    };

    //const getAccountItem = function () {
    //    return nav.props.children[0];
    //};

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

/*
    it('Check My Account item', function() {
      let item = nav.props.children[0];
      assert.equal(item.type, NavItem);
      assert.equal(item.props.children, 'My Account');
      assert.equal(item.props.active, false);
    });

    it('Check active My Account item', function() {
      component = getComponent({
        ...options,
        state: {
          ...options.state,
          router: {
            path: '/account'
          }
        }
      });
      nav = getNav();
      let item = nav.props.children[0];
      assert.equal(item.props.active, true);
    });

    it('Check redirect after click My Account item', function() {
      const redirect = sinon.spy();
      component = getComponent({
        ...options,
        history: {
          pushState: redirect
        }
      });
      nav = getNav();
      let item = nav.props.children[0];
      item.props.onClick('/account');
      assert.isTrue(redirect.calledOnce);
    });
*/

    it('Check Settings item', function() {
      let item = getSettingsItem();
      assert.equal(item.type, NavItem);
      assert.equal(item.props.children, 'Settings');
      assert.equal(item.props.active, false);
    });

    it('Check active Settings item', function() {
      component = getComponent({
        ...options,
        state: {
          ...options.state,
          router: {
            path: '/settings'
          }
        }
      });
      nav = getNav();
      let item = getSettingsItem();
      assert.equal(item.props.active, true);
    });

    it('Check redirect after click Settings item', function() {
      const redirect = sinon.spy();
      component = getComponent({
        ...options,
        history: {
          pushState: redirect
        }
      });
      nav = getNav();
      let item = getSettingsItem();
      item.props.onClick('/settings');
      assert.isTrue(redirect.calledOnce);
    });

    it('Check Logout item', function() {
      let item = getLogoutItem();
      assert.equal(item.type, NavItem);
    });

    it('Check redirect after click Logout item', function() {
      const redirect = sinon.spy();
      component = getComponent({
        ...options,
        actions: {
          signOut: redirect
        }
      });
      nav = getNav();
      let item = getLogoutItem();
      item.props.onClick();
      assert.isTrue(redirect.calledOnce);
    });

  });

});
