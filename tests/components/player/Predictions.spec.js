import React from 'react';
import { shallowRender } from '../../../app/common/Test'
import TestUtils from 'react-addons-test-utils'

import Predictions from '../../../app/components/player/Predictions'

describe('Predictions component', function () {
  let component;

  let options = {
    "sales_lead": {
      "value": 7
    },
    "request_quote": {
      "value": 5.5
    },
    "directions": {
      "value": 3.3
    },
    "employment": {
      "value": 2
    },
    "churn": {
      "value": 92
    },
    "appointment": {
      "value": true
    }
  };

  const getComponent = function (_options = {}) {
    let props = {
      ...options,
      ..._options
    };
    return shallowRender(
      <Predictions predictionsState={props} />
    );
  };

  const getRow = function () {
      return component.props.children;
  };

  const checkDefaultSettings = function (key, i) {
    it(`Check ${key} default settings`, function () {
      let row = getRow();
      let block = row.props.children[i];
      let valBlock = block.props.children[1];
      assert.equal(valBlock.props.className, 'listing__prediction__value text-success');
      assert.equal(valBlock.props.children, options[key].value);
    });
  };

  const checkEmptyValue = function (key, i) {
    it(`Check ${key} with value == 0`, function () {
      component = getComponent({
        ...options,
        [key]: {
          "value": 0
        }
      });
      let row = getRow();
      let block = row.props.children[i];
      let valBlock = block.props.children[1];
      assert.equal(valBlock.props.className, 'listing__prediction__value text-muted');
      assert.equal(valBlock.props.children, 0);
    });
  };

  const checkNoData = function (key, i) {
    it(`Check ${key} if no data`, function () {
      let opts = {...options};
      delete opts[key];
      component = shallowRender(
        <Predictions predictionsState={opts} />
      );
      let row = getRow();
      let block = row.props.children[i];
      assert.isUndefined(block);
    });
  };

  beforeEach(function () {
    component = getComponent();
  });

  it('Check root element', function () {
    assert.equal(component.type, 'div');
    assert.equal(component.props.className, 'listing__prediction');
  });

  let simpleFields = ['sales_lead', 'request_quote', 'directions', 'employment'];

  simpleFields.forEach((key, i) => {
    checkDefaultSettings(key, i);
    checkEmptyValue(key, i);
    checkNoData(key, i);
  });

  // Check Churn
  it(`Check churn default settings`, function () {
    let row = getRow();
    let block = row.props.children[4];
    let valBlock = block.props.children[1];
    assert.equal(valBlock.props.className, 'listing__prediction--churn listing__prediction__value text-success');
    assert.equal(valBlock.props.children.join(''), options['churn'].value + '%');
  });

  it(`Check churn with value == 0`, function () {
    component = getComponent({
      ...options,
      churn: {
        "value": 0
      }
    });
    let row = getRow();
    let block = row.props.children[4];
    let valBlock = block.props.children[1];
    assert.equal(valBlock.props.className, 'listing__prediction--churn listing__prediction__value text-muted');
    assert.equal(valBlock.props.children.join(''), '0%');
  });

  checkNoData('churn', 4);

  // Check appointment
  it(`Check appointment default settings`, function () {
    let row = getRow();
    let block = row.props.children[5];
    let valBlock = block.props.children[1];
    assert.equal(valBlock.props.className, 'listing__prediction__value text-success');
    assert.equal(valBlock.props.children[0].props.className, 'fa fa-check');
    assert.equal(valBlock.props.children[1], false);
  });

  it(`Check appointment with value == 0`, function () {
    component = getComponent({
      ...options,
      appointment: {
        "value": false
      }
    });
    let row = getRow();
    let block = row.props.children[5];
    let valBlock = block.props.children[1];
    assert.equal(valBlock.props.className, 'listing__prediction__value text-success');
    assert.equal(valBlock.props.children[0], false);
    assert.equal(valBlock.props.children[1].props.className, 'fa fa-times icon-fail');
  });

  checkNoData('appointment', 5);
});
