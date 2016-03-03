import React from 'react';
import { shallowRender } from '../../src/common/Test'
import TestUtils from 'react-addons-test-utils'

import { DatePicker } from '../../src/components/DatePicker'
import DateRangePicker from 'react-bootstrap-daterangepicker';
import { Input } from 'react-bootstrap'
import moment from 'moment';


describe('DatePicker component', function () {
  let component;

  const getComponent = function (dateFrom = '', dateTo = '', applyDate = function(){}, clearDate = function(){}) {
    return shallowRender(
      <DatePicker dateFrom={dateFrom}
                  dateTo={dateTo}
                  applyDate={applyDate}
                  clearDate={clearDate}
      />
    );
  };

  beforeEach(function() {
    component = getComponent();
  });

  it('should render component in div container', function() {
    assert.equal(component.type, 'div');
    assert.equal(component.props.className, 'form-group form-group--date');
  });

  it('check existing of DateRangePicker', function() {
    let datePicker = component.props.children;
    assert.equal(datePicker.type, DateRangePicker);
  });

  it('check count of DateRangePicker children', function() {
    let datePicker = component.props.children;
    expect(datePicker.props.children.length).to.equal(2);
  });

  it('check icon in DateRangePicker', function() {
    let datePicker = component.props.children;
    let icon = datePicker.props.children[0];
    assert.equal(icon.type, 'i');
    assert.equal(icon.props.className, 'fa fa-calendar-o');
  });

  it('check input in DateRangePicker', function() {
    let datePicker = component.props.children;
    let input = datePicker.props.children[1];
    assert.equal(input.type, Input);
  });

  it('Check default empty value of date input', function() {
    component = getComponent();
    let datePicker = component.props.children;
    let input = datePicker.props.children[1];
    assert.equal(input.props.value, '');
  });

  it('Check default custom value of date input', function() {
    let dateFrom = "02/21/2016 0:00";
    let dateTo = "02/27/2016 23:00";
    component = getComponent(dateFrom, dateTo);
    let datePicker = component.props.children;
    let input = datePicker.props.children[1];
    assert.equal(input.props.value, `${dateFrom} - ${dateTo}`);
  });

  it('check applyDate is called', function() {
    let dateFrom = "02/21/2016 0:00";
    let dateTo = "02/27/2016 23:00";
    const applyDate = sinon.spy();
    component = getComponent('', '', applyDate);
    let datePicker = component.props.children;
    datePicker.props.onApply(null, {
      startDate: moment(dateFrom),
      endDate: moment(dateTo)
    });
    assert.isTrue(applyDate.calledOnce);
  });

  it('check clearDate is called', function() {
    const clearDate = sinon.spy();
    component = getComponent('', '', function(){}, clearDate);
    let datePicker = component.props.children;
    datePicker.props.onCancel();
    assert.isTrue(clearDate.calledOnce);
  });

});
