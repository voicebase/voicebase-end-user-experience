import React from 'react';
import { shallowRender } from '../../../app/common/Test'
import TestUtils from 'react-addons-test-utils'

import UploadModal from '../../../app/components/upload/UploadModal'

describe('UploadModal component', function () {
  let component;

  let options = {
    children: React.createElement('div'),
    showForm: true,
    nextButtonText: 'next',
    nextTab: function (){},
    onClose: function (){},
    onSelectTab: function (){}
  };

  const getComponent = function (_options = {}) {
    let props = {
      ...options,
      ..._options
    };
    return shallowRender(
      <UploadModal children={props.children}
                   showForm={props.showForm}
                   nextButtonText={props.nextButtonText}
                   nextTab={props.nextTab}
                   onClose={props.onClose}
                   onSelectTab={props.onSelectTab}
      />
    );
  };

  beforeEach(function () {
    component = getComponent();
  });

  it('Check root element', function() {
    assert.equal(component.type, 'div');
  });
});


