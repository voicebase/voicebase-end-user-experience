import React from 'react';
import { shallowRender } from '../../app/common/Test'

import { MediaList } from '../../app/components/MediaList'
import { initialState as listState } from '../../app/redux/modules/media/mediaList'
import { initialState as dataState } from '../../app/redux/modules/media/mediaData'
import { Alert } from 'react-bootstrap'
import MediaListItem from '../../app/components/MediaListItem'
import ProcessingListItem from '../../app/components/upload/ProcessingListItem'

describe('MediaListToolbar component', function () {
  let component;

  let options = {
    token: 'token',
    state: {
      mediaList: listState,
      mediaData: dataState
    },
    actions: {}
  };

  const getComponent = function (_options = {}) {
    let props = {
      ...options,
      ..._options
    };
    return shallowRender(
      <MediaList token={props.token}
                 state={props.state}
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

  it('Check empty list', function() {
    assert.equal(component.props.children[0], false);
    let alertElem = component.props.children[1];
    assert.equal(alertElem.type, Alert);
    assert.equal(alertElem.props.bsStyle, 'warning');
    assert.equal(alertElem.props.className, 'media-list__warning');
  });

  describe('check non-empty MediaList', function () {
    let mediaResponse = {
      mediaIds: ['mediaId', 'mediaId2'],
      media: {
        'mediaId': {
          mediaId: "mediaId",
          metadata: {},
          status: "finished"
        },
        'mediaId2': {
          mediaId: "mediaId2",
          metadata: {},
          status: "finished"
        }
      },
      processingIds: [],
      processingMedia: {}
    };

    let listWrapper;
    let list;
    let optionsWithMediaIds = {
      ...options,
      state: {
        ...options.state,
        mediaList: listState.merge({...mediaResponse})
      }
    };

    const getNonEmptyComponent = function () {
      return getComponent(optionsWithMediaIds)
    };

    const getListWrapper = function () {
      return component.props.children[0];
    };

    const getList = function () {
      return component
        .props.children[0]
        .props.children[1];
    };

    beforeEach(function () {
      component = getNonEmptyComponent();
    });

    it('Check root element', function() {
      assert.equal(component.props.children[1], false);
      listWrapper = getListWrapper();
      assert.equal(listWrapper.type, 'div');
      assert.equal(listWrapper.props.className, 'list-group listings');
    });

    it('Check count of MediaListItem', function() {
      list = getList();
      assert.equal(list.length, mediaResponse.mediaIds.length);
    });

    it('Check default props of each MediaListItem', function() {
      list = getList();
      list.forEach((item, i) => {
        let mediaId = mediaResponse.mediaIds[i];
        assert.equal(item.type, MediaListItem);
        assert.equal(item.key, mediaId);
        assert.equal(item.props.mediaId, mediaId);
        assert.equal(item.props.isExpanded, false);
        assert.equal(item.props.token, optionsWithMediaIds.token);
        expect(item.props.listItemState).to.eql(mediaResponse.media[mediaId]);
        expect(item.props.actions).to.eql(optionsWithMediaIds.actions);
      });
    });

    it('Check isExpanded for active MediaListItem', function() {
      let i = 0;
      component = getComponent({
        ...optionsWithMediaIds,
        state: {
          ...optionsWithMediaIds.state,
          mediaList: optionsWithMediaIds.state.mediaList.set('activeMediaId', mediaResponse.mediaIds[i])
        }
      });
      list = getList();
      assert.equal(list[i].props.isExpanded, true);
    });
  });

  describe('check non-empty processing list', function () {
    let mediaResponse = {
      mediaIds: [],
      media: {},
      processingIds: ['mediaId1', 'mediaId2'],
      processingMedia: {
        'mediaId1': {
          mediaId: "mediaId1"
        },
        'mediaId2': {
          mediaId: "mediaId2"
        }
      }
    };

    let listWrapper;
    let list;

    let optionsWithProcessingIds = {
      ...options,
      state: {
        ...options.state,
        mediaList: listState.merge({...mediaResponse})
      }
    };

    const getNonEmptyComponent = function () {
      return getComponent(optionsWithProcessingIds)
    };

    const getListWrapper = function () {
      return component.props.children[0];
    };

    const getList = function () {
      return component
        .props.children[0]
        .props.children[0];
    };

    beforeEach(function () {
      component = getNonEmptyComponent();
    });

    it('Check root element', function() {
      listWrapper = getListWrapper();
      assert.equal(listWrapper.type, 'div');
      assert.equal(listWrapper.props.className, 'list-group listings');
    });

    it('Check count of processing items', function() {
      list = getList();
      assert.equal(list.length, mediaResponse.processingIds.length);
    });

    it('Check default props of each ProcessingListItem', function() {
      list = getList();
      list.forEach((item, i) => {
        let mediaId = mediaResponse.processingIds[i];
        assert.equal(item.type, ProcessingListItem);
        assert.equal(item.key, 'upload-progress-' + mediaId);
        assert.equal(item.props.token, optionsWithProcessingIds.token);
        assert.equal(item.props.mediaId, mediaId);
        expect(item.props.mediaDataState).to.eql(null);
        expect(item.props.actions).to.eql(optionsWithProcessingIds.actions);
      });
    });

    it('Check mediaDataState for ProcessingListItem', function() {
      let itemData = {
        mediaId1: {
          mediaId: 'mediaId1'
        }
      };

      component = getComponent({
        ...optionsWithProcessingIds,
        state: {
          ...optionsWithProcessingIds.state,
          mediaData: optionsWithProcessingIds.state.mediaData.merge(itemData)
        }
      });
      list = getList();
      expect(list[0].props.mediaDataState).to.eql(itemData.mediaId1);
    });

  });
});
