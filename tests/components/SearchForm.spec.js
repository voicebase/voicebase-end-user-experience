import React from 'react';
import { shallowRender } from '../../src/common/Test'
import TestUtils from 'react-addons-test-utils'

import { SearchForm } from '../../src/components/SearchForm'
import { initialState } from '../../src/redux/modules/search'
import {Row, Col, Input, Button} from 'react-bootstrap'
import DatePicker from '../../src/components/DatePicker'
import DropdownList from '../../src/components/DropdownList'

describe('SearchForm component', function () {
  let component;

  let options = {
    state: initialState,
    onSearch: function (){},
    actions: {
      applyDate: function (dateObj){},
      clearDate: function (){},
      selectOrder: function (orderId){},
      setSearchString: function (searchString){}
    }
  };

  const getComponent = function (_options = {}) {
    let props = {
      ...options,
      ..._options
    };
    return shallowRender(
      <SearchForm state={props.state}
                  onSearch={props.onSearch}
                  actions={props.actions}
      />
    );
  };

  beforeEach(function () {
    component = getComponent();
  });

  it('Check root element', function() {
    assert.equal(component.type, 'form');
    assert.equal(component.props.className, 'form--filters');
  });

  describe('Check Search Input', function() {
    let input;

    const getInput = function () {
      return component
        .props.children
        .props.children[0]
        .props.children
        .props.children[1]
    };

    beforeEach(function () {
      input = getInput();
    });

    it('Check root element', function() {
      assert.equal(input.type, Input);
    });

    it('Check value from initialState', function() {
      assert.equal(input.props.value, initialState.get('searchString'));
    });

    it('Check value from non-initialState', function() {
      component = getComponent({
        ...options,
        state: initialState.set('searchString', 'test')
      });
      input = getInput();
      assert.equal(input.props.value, 'test');
    });

    it('Check search button in default state', function() {
      let btn = input.props.buttonAfter;
      assert.equal(btn.props.bsStyle, 'primary');
      assert.equal(btn.props.disabled, false);
      assert.equal(btn.props.children, 'Search');
    });

    it('Check search button if searching', function() {
      component = getComponent({
        ...options,
        state: initialState.set('isSearching', true)
      });
      input = getInput();
      let btn = input.props.buttonAfter;
      assert.equal(btn.props.disabled, true);
      assert.equal(btn.props.children, 'Searching...');
    });

    it('Check click on search button', function() {
      const search = sinon.spy();
      component = getComponent({
        ...options,
        onSearch: search
      });
      input = getInput();
      let btn = input.props.buttonAfter;
      btn.props.onClick();
      assert.isTrue(search.calledOnce);
    });

    it('Check onKeyPress for search input', function() {
      const search = sinon.spy();
      component = getComponent({
        ...options,
        onSearch: search
      });
      input = getInput();
      input.props.onKeyPress({
        key: 'Enter',
        preventDefault: function(){}
      });
      assert.isTrue(search.calledOnce);
    });

    it('Check onChange for search input', function() {
      const changeString = sinon.spy();
      component = getComponent({
        ...options,
        actions: {
          ...options.actions,
          setSearchString: changeString
        }
      });
      input = getInput();
      input.props.onChange({target: {value: 'test'}});
      assert.isTrue(changeString.calledOnce);
    });

  });

  if (initialState.getIn(['view', 'datePickerEnabled'])) {
    describe('Check DatePicker', function() {
      let datePicker;

      const getDatePicker = function () {
        return component
          .props.children
          .props.children[1]
          .props.children
      };

      beforeEach(function () {
        datePicker = getDatePicker();
      });

      it('Check root element', function() {
        assert.equal(datePicker.type, DatePicker);
      });

      it('Check default dateFrom and dateTo', function() {
        assert.equal(datePicker.props.dateFrom, '');
        assert.equal(datePicker.props.dateTo, '');
      });

      it('Check custom dateFrom and dateTo', function() {
        component = getComponent({
          ...options,
          state: initialState
            .set('dateFrom', '03/16/2016 0:00')
            .set('dateTo', '03/25/2016 0:00')
        });
        datePicker = getDatePicker();
        assert.equal(datePicker.props.dateFrom, '03/16/2016 0:00');
        assert.equal(datePicker.props.dateTo, '03/25/2016 0:00');
      });

      it('Check applyDate for DatePicker', function() {
        const applyDate = sinon.spy();
        component = getComponent({
          ...options,
          actions: {
            ...options.actions,
            applyDate: applyDate
          }
        });
        datePicker = getDatePicker();
        datePicker.props.applyDate();
        assert.isTrue(applyDate.calledOnce);
      });

      it('Check clearDate for DatePicker', function() {
        const clearDate = sinon.spy();
        component = getComponent({
          ...options,
          actions: {
            ...options.actions,
            clearDate: clearDate
          }
        });
        datePicker = getDatePicker();
        datePicker.props.clearDate();
        assert.isTrue(clearDate.calledOnce);
      });

    });
  }

  if (initialState.getIn(['view', 'orderEnabled'])) {
    describe('Check DropdownList', function() {
      let dropdown;

      const getDropdownList = function () {
        return component
          .props.children
          .props.children[2]
          .props.children
          .props.children
      };

      beforeEach(function () {
        dropdown = getDropdownList();
      });

      it('Check root element', function() {
        assert.equal(dropdown.type, DropdownList);
        assert.equal(dropdown.props.dropdownKey, 'sort-list-dropdown');
      });

      it('Check order items', function() {
        expect(dropdown.props.items).to.eql(initialState.get('order').toJS());
      });

      it('Check active order', function() {
        expect(dropdown.props.activeItemId).to.eql(initialState.get('selectedOrderId'));
      });

      it('Check onSelect for order dropdown', function() {
        const onSelect = sinon.spy();
        component = getComponent({
          ...options,
          actions: {
            ...options.actions,
            selectOrder: onSelect
          }
        });
        dropdown = getDropdownList();
        dropdown.props.onSelect('2');
        assert.isTrue(onSelect.calledOnce);
      });

    });
  }
});
