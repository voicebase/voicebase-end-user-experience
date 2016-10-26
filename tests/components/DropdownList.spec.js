import React from 'react';
import { shallowRender } from '../../app/common/Test'
import TestUtils from 'react-addons-test-utils'

import DropdownList from '../../app/components/DropdownList'
import {Dropdown, MenuItem} from 'react-bootstrap'

describe('DropdownList component', function () {
  let component;
  let dropdownKey = 'test';
  let items = {
    0: {id: '0', name: 'n1'},
    1: {id: '1', name: 'n2'}
  };

  let activeItemId = '0';

  const getComponent = function (onSelect, _items = items, _activeItemId = activeItemId) {
    onSelect = onSelect || function (){};
    return shallowRender(
      <DropdownList onSelect={onSelect}
                    items={_items}
                    dropdownKey={dropdownKey}
                    activeItemId={_activeItemId}
      />
    );
  };

  beforeEach(function () {
    component = getComponent();
  });

  it('Check type, id and class', function() {
    let component = getComponent();
    assert.equal(component.type, Dropdown);
    assert.equal(component.props.id, 'test-dropdown');
    assert.equal(component.props.className, 'dropdown--custom-caret');
  });

  it('check onSelect() is called', function() {
    const onSelect = sinon.spy();
    component = getComponent(onSelect);
    component.props.onSelect(null, '1');
    assert.isTrue(onSelect.calledOnce);
  });

  describe('Dropdown.Toggle', function () {
    let toggle;

    let getToggle = function (_component) {
      return _component.props.children[0];
    };

    beforeEach(function () {
      toggle = getToggle(component);
    });

    it('Check type', function() {
      assert.equal(toggle.type, Dropdown.Toggle);
    });

    it('Check name', function() {
      let name = toggle.props.children[0];
      assert.equal(name, items[activeItemId].name);
    });

    it('Check empty name', function() {
      let component = getComponent(function(){}, {}, '');
      let name = getToggle(component).props.children[0];
      assert.equal(name, undefined);
    });

    it('Check caret', function() {
      let caret = toggle.props.children[1];
      assert.equal(caret.type, 'i');
      assert.equal(caret.props.className, 'fa fa-caret-down');
    });
  });

  describe('Dropdown.Menu', function () {
    let menu;

    let getMenu = function (_component) {
      return _component.props.children[1];
    };

    beforeEach(function () {
      menu = getMenu(component);
    });

    it('Check type', function() {
      assert.equal(menu.type, Dropdown.Menu);
    });

    it('Check childrens count', function() {
      assert.equal(menu.props.children.length, Object.keys(items).length);
    });

    it('Check MenuItem', function() {
      let itemId = 0;
      let firstMenuItem = menu.props.children[itemId];
      assert.equal(firstMenuItem.type, MenuItem);
      assert.equal(firstMenuItem.key, dropdownKey + 'priority-item' + itemId);
      assert.equal(firstMenuItem.props.eventKey, itemId);
      assert.equal(firstMenuItem.props.children, items[itemId].name);
    });

    it('Check MenuItem active', function() {
      let itemId = 0;
      let firstMenuItem = menu.props.children[itemId];
      assert.equal(firstMenuItem.props.active, true);
    });

    it('Check MenuItem non-active', function() {
      let itemId = 1;
      let firstMenuItem = menu.props.children[itemId];
      assert.equal(firstMenuItem.props.active, false);
    });

  });
});
