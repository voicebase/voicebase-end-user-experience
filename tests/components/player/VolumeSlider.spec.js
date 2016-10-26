import React from 'react';
import ReactDom from 'react-dom';
import { shallowRender } from '../../../app/common/Test'
import TestUtils from 'react-addons-test-utils'

import {
  capitalize,
  maxmin,
  default as VolumeSlider
} from '../../../app/components/player/VolumeSlider'

describe('VolumeSlider component', function () {
  let component;
  let rootElement;

  let options = {
    min: 0,
    max: 100,
    step: 1,
    value: 0,
    orientation: 'horizontal',
    className: '',
    onChange: function () {}
  };

  const getComponent = function (_options = {}) {
    let props = {
      ...options,
      ..._options
    };

    return TestUtils.renderIntoDocument(
      <VolumeSlider min={props.min}
                    max={props.max}
                    step={props.step}
                    value={props.value}
                    orientation={props.orientation}
                    className={props.className}
                    onChange={props.onChange}
      />
    );
  };

  beforeEach(function () {
    component = getComponent();
    rootElement = ReactDom.findDOMNode(component);
  });

  it('Check root element', function () {
    assert.equal(rootElement.tagName, 'DIV');
  });

  it('Check capitalize()', function () {
    let res = capitalize('str');
    assert.equal(res, 'Str');
  });

  it('Check maxmin()', function () {
    let res = maxmin(0, 1, 2);
    assert.equal(res, 1);
    res = maxmin(3, 1, 2);
    assert.equal(res, 2);

  });

  it('Check getPositionFromValue()', function () {
    component.setState({limit: 100});
    let res = component.getPositionFromValue(50);

    assert.equal(res, 50);
  });

  it('Check getValueFromPosition() for horizontal', function () {
    component.setState({limit: 100});
    let res = component.getValueFromPosition(20);

    assert.equal(res, 20);
  });

  it('Check getValueFromPosition() for vertical', function () {
    component = getComponent({
      ...options,
      orientation: 'vertical'
    });

    component.setState({limit: 100});
    let res = component.getValueFromPosition(20);

    assert.equal(res, 80);
  });

  it('Check position() for horizontal', function () {
    component.setState({limit: 100, grab: 0});
    let res = component.position({clientX: 50});

    assert.equal(res, 50);
  });

  it('Check position() for vertical', function () {
    component = getComponent({
      ...options,
      orientation: 'vertical'
    });

    component.setState({limit: 100, grab: 0});
    let res = component.position({clientY: 50});

    assert.equal(res, 50);
  });

  it('Check handleDrag()', function () {
    let onChange = sinon.spy();
    component = getComponent({
      ...options,
      onChange
    });

    component.handleDrag({
      clientY: 50,
      stopPropagation: function(){},
      preventDefault: function(){}
    });

    assert.equal(onChange.calledOnce, true);
  });

  it('Check handleDrag() without onChange', function () {
    component = getComponent({
      ...options,
      onChange: null
    });

    let res = component.handleDrag({
      clientY: 50,
      stopPropagation: function(){},
      preventDefault: function(){}
    });

    assert.equal(res, null);
  });

  it('Check handleSliderMouseDown()', function () {
    let onChange = sinon.spy();
    component = getComponent({
      ...options,
      onChange
    });

    component.handleSliderMouseDown({
      clientY: 50
    });

    assert.equal(onChange.calledOnce, true);
  });

  it('Check handleSliderMouseDown() without onChange', function () {
    component = getComponent({
      ...options,
      onChange: null
    });

    let res = component.handleSliderMouseDown({
      clientY: 50
    });

    assert.equal(res, null);
  });


});
