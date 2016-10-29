import React from 'react';
import { shallowRender } from '../../app/common/Test'

import { MediaListItem } from '../../app/components/MediaListItem'
import { MediaListItemTitle } from '../../app/components/MediaListItemTitle'
import Spinner from '../../app/components/Spinner';
import { parseTime } from '../../app/common/Common';
import {Collapse, Alert, Row, Col} from 'react-bootstrap'

describe('MediaListItem component', function () {
  let component;

  let options = {
    token: 'token',
    mediaId: 'mediaId',
    isExpanded: false,
    listItemState: {
      mediaId: "mediaId",
      dateCreated: 'Fri May 06 2016 13:04:05',
      metadata: {
        length: {
          milliseconds: 288000,
          descriptive: '288 sec'
        },
        title: "* Cable Sales Call",
        type: "audio"
      },
      status: "finished"
    },
    actions: {
      collapseMedia: function(mediaId){},
      expandMedia: function(mediaId){},
      selectMedia: function(mediaId){},
      unselectMedia: function(mediaId){},
      deleteMedia: function(token, mediaId){},
      removeDataForMedia: function(token, mediaId){},
      destroyPlayer: function(token, mediaId){}
    }
  };

  const getComponent = function (_options = {}) {
    let props = {
      ...options,
      ..._options
    };
    return shallowRender(
      <MediaListItem
        token={props.token}
        mediaId={props.mediaId}
        isExpanded={props.isExpanded}
        listItemState={props.listItemState}
        actions={props.actions}
      />
    );
  };

  beforeEach(function () {
    component = getComponent();
  });

  it('Check root element', function() {
    assert.equal(component.type, 'div');
  });

  describe('Check Item Row', function () {
    let itemRow;

    const getItemRow = function () {
      return component.props.children[0];
    };

    beforeEach(function () {
      itemRow = getItemRow();
    });

    it('Check root itemRow element', function() {
      assert.equal(itemRow.type, 'div');
    });

    it('Check expanded classes for collapsed row', function() {
      assert.equal(itemRow.props.className, 'list-group-item listing collapsed');
    });

    it('Check expanded classes for expanded row', function() {
      component = getComponent({
        ...options,
        isExpanded: true
      });
      itemRow = getItemRow();
      assert.equal(itemRow.props.className, 'list-group-item listing');
    });

    it('Check toggle for collapsed row without data for mediaId', function() {
      let expandMedia = sinon.spy();
      component = getComponent({
        ...options,
        isExpanded: false,
        actions: {
          ...options.actions,
          expandMedia: expandMedia
        }
      });
      itemRow = getItemRow();
      itemRow.props.onClick({target: {}});
      assert.isTrue(expandMedia.calledOnce);
    });

    it('Check toggle for collapsed row with data for mediaId', function() {
      let expandMedia = sinon.spy();
      component = getComponent({
        ...options,
        isExpanded: false,
        actions: {
          ...options.actions,
          expandMedia: expandMedia
        }
      });
      itemRow = getItemRow();
      itemRow.props.onClick({target: {}});
      assert.isTrue(expandMedia.calledOnce);
    });

    it('Check toggle for expanded row', function() {
      let collapseMedia = sinon.spy();
      component = getComponent({
        ...options,
        isExpanded: true,
        actions: {
          ...options.actions,
          collapseMedia: collapseMedia
        }
      });
      itemRow = getItemRow();
      itemRow.props.onClick({target: {}});
      assert.isTrue(collapseMedia.calledOnce);
    });

    it('Check toggle when click on checkbox', function() {
      assert.isFalse(itemRow.props.onClick({
        target: {type: 'checkbox'}
      }));
    });

    it('Check item title', function() {
      let title = itemRow.props.children[0];
      assert.equal(title.type, MediaListItemTitle);
      assert.equal(title.props.mediaId, options.mediaId);
      expect(title.props.metadata).to.eql(options.listItemState.metadata);
    });

    it('Check item label', function() {
      let label = itemRow.props.children[1];
      assert.equal(label.type, 'p');
      assert.equal(label.props.className, 'list-group-item-text');
      assert.equal(label.props.children[0].props.children.join(''), 'Uploaded May 6, 2016 |');
      assert.equal(label.props.children[2].type, 'span');
    });

    it('Check item label duration', function() {
      let label = itemRow.props.children[1];
      let duration = parseTime(options.listItemState.metadata.length.milliseconds / 1000);
      assert.equal(label.props.children[2].type, 'span');
      assert.equal(label.props.children[2].props.children[0], 'Length ');
      assert.equal(label.props.children[2].props.children[1],  `${duration}`);
    });

    it('Check item label if no duration in metadata', function() {
      component = getComponent({
        ...options,
        listItemState: {
          ...options.listItemState,
          metadata: {
            title: "* Cable Sales Call",
            type: "audio"
          }
        }
      });
      itemRow = getItemRow();
      let label = itemRow.props.children[1];
      assert.isNull(label.props.children[2]);
    });

    it('Check unchecked checkbox', function() {
      let checkbox = itemRow.props.children[2];
      assert.equal(checkbox.type, 'input');
      assert.equal(checkbox.props.type, 'checkbox');
      assert.equal(checkbox.props.className, 'listing__checkbox');
      assert.isUndefined(checkbox.props.checked);
    });

    it('Check checked checkbox', function() {
      component = getComponent({
        ...options,
        listItemState: {
          ...options.listItemState,
          checked: true
        }
      });
      itemRow = getItemRow();
      let checkbox = itemRow.props.children[2];
      assert.isTrue(checkbox.props.checked);
    });

    it('Check select checkbox', function() {
      const selectMedia = sinon.spy();
      const unselectMedia = sinon.spy();
      component = getComponent({
        ...options,
        actions: {
          ...options.actions,
          selectMedia: selectMedia,
          unselectMedia: unselectMedia
        }
      });
      itemRow = getItemRow();
      let checkbox = itemRow.props.children[2];
      checkbox.props.onChange({target: {checked: true}});
      assert.isTrue(selectMedia.calledOnce);
      assert.isFalse(unselectMedia.called);
    });

    it('Check unselect checkbox', function() {
      const selectMedia = sinon.spy();
      const unselectMedia = sinon.spy();
      component = getComponent({
        ...options,
        actions: {
          ...options.actions,
          selectMedia: selectMedia,
          unselectMedia: unselectMedia
        }
      });
      itemRow = getItemRow();
      let checkbox = itemRow.props.children[2];
      checkbox.props.onChange({target: {checked: false}});
      assert.isTrue(unselectMedia.calledOnce);
      assert.isFalse(selectMedia.called);
    });

    it('Check delete spinner by default', function() {
      let spinner = itemRow.props.children[3];
      assert.isUndefined(spinner);
    });

    it('Check delete spinner', function() {
      component = getComponent({
        ...options,
        listItemState: {
          ...options.listItemState,
          deletePending: true
        }
      });
      itemRow = getItemRow();
      let spinner = itemRow.props.children[3];
      assert.equal(spinner.type, Spinner);
      assert.equal(spinner.props.isMediumItem, true);
    });

    it('Check delete button', function() {
      let delBtn = itemRow.props.children[4];
      assert.equal(delBtn.type, 'a');
      assert.equal(delBtn.props.className, 'listing__delete');
    });

    it('Check click on delete button', function() {
      const deleteMedia = sinon.spy();
      component = getComponent({
        ...options,
        actions: {
          ...options.actions,
          deleteMedia: deleteMedia
        }
      });
      itemRow = getItemRow();
      let delBtn = itemRow.props.children[4];
      delBtn.props.onClick({
        preventDefault: function(){},
        stopPropagation: function(){}
      });
      assert.isTrue(deleteMedia.calledOnce);
    });

  });

  describe('Check Collapse Block', function () {
    let collapse;

    const getCollapse = function () {
      return component.props.children[1];
    };

    beforeEach(function () {
      collapse = getCollapse();
    });

    it('Check root element', function() {
      assert.equal(collapse.type, Collapse);
      assert.equal(collapse.props.in, false);
    });

    it('Check Collapse if isExpanded == true', function() {
      component = getComponent({
        ...options,
        isExpanded: true
      });
      collapse = getCollapse();
      assert.equal(collapse.props.in, true);
    });
  });
});
