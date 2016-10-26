import React from 'react';
import { shallowRender } from '../../app/common/Test'
import { Spinner } from '../../app/components/Spinner'


describe('Spinner component', function () {
  let component;

  it('should render component in div container', function() {
    component = shallowRender(<Spinner />);
    assert.equal(component.type, 'div');
  });

  it('should render component with class item-medium ', function() {
    component = shallowRender(<Spinner isMediumItem/>);
    assert.equal(component.props.className, 'spinner item-medium');
  });

  it('should render component with class item-small ', function() {
    component = shallowRender(<Spinner isSmallItem/>);
    assert.equal(component.props.className, 'spinner item-small');
  });

});
