import React from 'react';
import { shallowRender } from '../../src/common/Test'
import { CounterLabel } from '../../src/components/CounterLabel'


describe('CounterLabel component', function () {
  let component;

  beforeEach(function() {
    component = shallowRender(<CounterLabel value={0} />);
  });

  it('should render component in span container', function() {
    assert.equal(component.type, 'span');
  });

  it('should render component with class item-medium ', function() {
    assert.equal(component.props.className, 'text-muted');
  });

  it('should render component with children equal value ', function() {
    assert.equal(component.props.children, 0);
  });

});
