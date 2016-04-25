import React from 'react';
import ReactDom from 'react-dom';
import { shallowRender } from '../../../src/common/Test'
import TestUtils from 'react-addons-test-utils'

import UploadOptions from '../../../src/components/upload/UploadOptions'
import {
  initialState as uploadState
} from '../../../src/redux/modules/upload'
import {
  initialState as settingsState
} from '../../../src/redux/modules/settings'
import {
  initialState as groupsState
} from '../../../src/redux/modules/groups'

describe('UploadOptions component', function () {
  let component;
  let rootElement;

  let options = {
    token: 'token',
    uploadState: uploadState
      .set('fileIds', ['0'])
      .set('files', {
        '0': {
          file: {
            name: 'First',
            file: 'inputData'
          },
          type: 'audio'
        }
      }).toJS()
    ,
    settingsState: {
      items: settingsState,
      groups: groupsState
    },
    actions: {
      getGroups: function () {},
      getItems: function () {},
      setLanguage: function () {},
      setPriority: function () {},
      setPrediction: function () {},
      setDetection: function () {},
      setNumbers: function () {},
      setGroups: function () {}
    }
  };

  const getComponent = function (_options = {}) {
    let props = {
      ...options,
      ..._options
    };

    return TestUtils.renderIntoDocument(
      <UploadOptions token={props.token}
                     uploadState={props.uploadState}
                     settingsState={props.settingsState}
                     actions={props.actions}
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

  it('Check componentWillMount() without files', function () {
    component = getComponent({
      ...options,
      uploadState: uploadState
        .set('fileIds', [])
        .set('files', {})
        .toJS()
    });
    let res = component.componentWillMount();

    assert.equal(res, false);
  });

  it('Check componentWillMount() with enabled groups', function () {
    let getGroups = sinon.spy();
    let getItems = sinon.spy();
    component = getComponent({
      ...options,
      actions: {
        ...options.actions,
        getGroups,
        getItems
      }
    });
    component.componentWillMount();

    assert.equal(getGroups.called, true);
    assert.equal(getItems.called, false);
  });

  it('Check componentWillMount() with enabled items', function () {
    let getItems = sinon.spy();
    component = getComponent({
      ...options,
      settingsState: {
        ...options.settingsState,
        groups: groupsState
          .set('groupIds', ['0']),
        items: settingsState
          .setIn(['predictions', 'view', 'enabled'], true)
          .setIn(['detection', 'view', 'enabled'], true)
          .setIn(['numbers', 'view', 'enabled'], true)
      },
      actions: {
        ...options.actions,
        getItems
      }
    });
    component.componentWillMount();

    assert.equal(getItems.called, true);
  });

  it('Check componentDidUpdate() without files', function () {
    component = getComponent({
      ...options,
      uploadState: uploadState
        .set('fileIds', [])
        .set('files', {})
        .toJS()
    });

    let res = component.componentDidUpdate();

    assert.equal(res, false);
  });

  it('Check componentDidUpdate(): set default language and priority', function () {
    let setLanguage = sinon.spy();
    let setPriority = sinon.spy();
    component = getComponent({
      ...options,
      actions: {
        ...options.actions,
        setLanguage,
        setPriority
      }
    });

    component.componentDidUpdate();

    assert.equal(setLanguage.called, true);
    assert.equal(setPriority.called, true);
  });

  it('Check componentDidUpdate(): set other items', function () {
    let setPrediction = sinon.spy();
    let setDetection = sinon.spy();
    let setNumbers = sinon.spy();
    let setGroups = sinon.spy();
    component = getComponent({
      ...options,
      uploadState: {
        ...options.uploadState,
        options: {
          ...options.uploadState.options,
          language: 'uk',
          priority: 'high'
        }
      },
      settingsState: {
        ...options.settingsState,
        groups: groupsState
          .set('groupIds', ['0'])
          .set('groups', {'0': {}}),
        items: settingsState
          .mergeIn(['predictions'], {
            itemIds: ['0'],
            items: {'0': {}}
          })
          .mergeIn(['detection'], {
            itemIds: ['0'],
            items: {'0': {}}
          })
          .mergeIn(['numbers'], {
            itemIds: ['0'],
            items: {'0': {}}
          })
      },
      actions: {
        ...options.actions,
        setPrediction,
        setNumbers,
        setGroups,
        setDetection
      }
    });

    component.componentDidUpdate();

    assert.equal(setPrediction.called, true);
    assert.equal(setDetection.called, true);
    assert.equal(setGroups.called, true);
    assert.equal(setNumbers.called, true);
  });

  it('Check getDefaultIds()', function () {
    let items = {
      '0': {isDefault: true},
      '1': {isDefault: false}
    };

    let res = component.getDefaultIds(items);
    expect(res).to.eql(['0']);
  });

  it('Check onSelectLanguage()', function () {
    let setLanguage = sinon.spy();
    component = getComponent({
      ...options,
      actions: {
        ...options.actions,
        setLanguage
      }
    });
    component.onSelectLanguage('0');

    assert.equal(setLanguage.calledOnce, true);
  });

  it('Check onSelectPriority()', function () {
    let setPriority = sinon.spy();
    component = getComponent({
      ...options,
      actions: {
        ...options.actions,
        setPriority
      }
    });
    component.onSelectPriority('0');

    assert.equal(setPriority.calledOnce, true);
  });

  it('Check onChangePrediction()', function () {
    let setPrediction = sinon.spy();
    component = getComponent({
      ...options,
      actions: {
        ...options.actions,
        setPrediction
      }
    });
    component.onChangePrediction('0');

    assert.equal(setPrediction.calledOnce, true);
  });

  it('Check onChangeDetection()', function () {
    let setDetection = sinon.spy();
    component = getComponent({
      ...options,
      actions: {
        ...options.actions,
        setDetection
      }
    });
    component.onChangeDetection('0');

    assert.equal(setDetection.calledOnce, true);
  });

  it('Check onChangeNumbers()', function () {
    let setNumbers = sinon.spy();
    component = getComponent({
      ...options,
      actions: {
        ...options.actions,
        setNumbers
      }
    });
    component.onChangeNumbers('0');

    assert.equal(setNumbers.calledOnce, true);
  });

  it('Check onChangeGroups()', function () {
    let setGroups = sinon.spy();
    component = getComponent({
      ...options,
      actions: {
        ...options.actions,
        setGroups
      }
    });
    component.onChangeGroups('0');

    assert.equal(setGroups.calledOnce, true);
  });

  it('Check parseSelectValue()', function () {
    expect(component.parseSelectValue('0,1')).to.eql(['0', '1']);
    expect(component.parseSelectValue('')).to.eql([]);
  });

  it('Check getSelectValue()', function () {
    let expectedRes = {
      "defaultValue": ["0"],
      "selectValue": [
        {"value": "0", "label": "name"},
        {"value": "1", "label": "name2"}
      ]
    };
    component = getComponent({
      ...options,
      uploadState: {
        ...options.uploadState,
        options: {
          ...options.uploadState.options,
          groups: ['0']
        }
      }
    });

    let res = component.getSelectValue('groups', {
      '0': {id: '0', name: 'name'},
      '1': {id: '1', name: 'name2'}
    });

    expect(res).to.eql(expectedRes);
  });

});

