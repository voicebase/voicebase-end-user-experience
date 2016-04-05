import React from 'react';
import { shallowRender } from '../../src/common/Test'
import TestUtils from 'react-addons-test-utils'

import { MediaListItem } from '../../src/components/MediaListItem'
import { MediaListItemTitle } from '../../src/components/MediaListItemTitle'
import VbsPlayerApp from '../../src/components/player/VbsPlayerApp';
import Spinner from '../../src/components/Spinner';
import { parseTime } from '../../src/common/Common';
import {Collapse, Alert, Row, Col} from 'react-bootstrap'

import { initialState as dataState } from '../../src/redux/modules/media/mediaData'
import { initialState as markersState } from '../../src/redux/modules/media/markers'
import {
  initialState as playerState,
  initialPlayerState
} from '../../src/redux/modules/media/player'


describe('MediaListItem component', function () {
  let component;

  let options = {
    token: 'token',
    mediaId: 'mediaId',
    isExpanded: false,
    listItemState: {
      mediaId: "mediaId",
      metadata: {
        duration: 288,
        title: "* Cable Sales Call",
        type: "audio"
      },
      status: "finished"
    },
    mediaState: {
      markers: markersState,
      mediaData: dataState,
      player: playerState
    },
    actions: {
      collapseMedia: function(mediaId){},
      getMediaUrl: function(token, mediaId){},
      getDataForMedia: function(token, mediaId){},
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
      <MediaListItem token={props.token}
                     mediaId={props.mediaId}
                     isExpanded={props.isExpanded}
                     listItemState={props.listItemState}
                     mediaState={props.mediaState}
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
      let getMediaUrl = sinon.spy();
      let getDataForMedia = sinon.spy();
      component = getComponent({
        ...options,
        isExpanded: false,
        actions: {
          ...options.actions,
          expandMedia: expandMedia,
          getDataForMedia: getDataForMedia,
          getMediaUrl: getMediaUrl
        }
      });
      itemRow = getItemRow();
      itemRow.props.onClick({target: {}});
      assert.isTrue(expandMedia.calledOnce);
      assert.isTrue(getMediaUrl.calledOnce);
      assert.isTrue(getDataForMedia.calledOnce);
    });

    it('Check toggle for collapsed row with data for mediaId', function() {
      let expandMedia = sinon.spy();
      let getMediaUrl = sinon.spy();
      let getDataForMedia = sinon.spy();
      component = getComponent({
        ...options,
        isExpanded: false,
        mediaState: {
          ...options.mediaState,
          mediaData: options.mediaState.mediaData.merge({
            mediaId: {
              mediaId: 'mediaId'
            }
          })
        },
        actions: {
          ...options.actions,
          expandMedia: expandMedia,
          getDataForMedia: getDataForMedia,
          getMediaUrl: getMediaUrl
        }
      });
      itemRow = getItemRow();
      itemRow.props.onClick({target: {}});
      assert.isTrue(expandMedia.calledOnce);
      assert.isFalse(getMediaUrl.called);
      assert.isFalse(getDataForMedia.called);
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
      //assert.equal(label.props.children[0], 'Uploaded Jan 5, 2010');
      assert.equal(label.props.children[1].type, 'span');

    });

    it('Check item label duration', function() {
      let label = itemRow.props.children[1];
      let duration = parseTime(options.listItemState.metadata.duration);
      assert.equal(label.props.children[1].type, 'span');
      assert.equal(label.props.children[1].props.children[0], ' | Length ');
      assert.equal(label.props.children[1].props.children[1],  `${duration}`);
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
      assert.isUndefined(label.props.children[1]);
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

    const getBody = function () {
      return component
        .props.children[1]
        .props.children;
    };

    const getError = function () {
      return component
        .props.children[1]
        .props.children
        .props.children[1];
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

    it('Check Collapse children without mediaData', function() {
      let body = getBody();
      body.props.children.forEach(child => {
        assert.isNull(child);
      });
    });

    describe('Check Spinner for getting mediaData', function () {
      const getSpinner = function () {
        return component
          .props.children[1]
          .props.children
          .props.children[0];
      };

      it('Check Spinner without pending flags', function() {
        component = getComponent({
          ...options,
          mediaState: {
            ...options.mediaState,
            mediaData: options.mediaState.mediaData.merge({
              mediaId: {
                mediaId: 'mediaId'
              }
            })
          }
        });
        let spinner = getSpinner();
        assert.isUndefined(spinner);
      });

      it('Check Spinner with getPending flag', function() {
        component = getComponent({
          ...options,
          mediaState: {
            ...options.mediaState,
            mediaData: options.mediaState.mediaData.merge({
              mediaId: {
                mediaId: 'mediaId',
                getPending: true
              }
            })
          }
        });
        let spinner = getSpinner();
        assert.equal(spinner.type, 'div');
        assert.equal(spinner.props.className, 'spinner-media_item');
        assert.equal(spinner.props.children.type, Spinner);
      });

      it('Check Spinner with getUrlPending flag', function() {
        component = getComponent({
          ...options,
          mediaState: {
            ...options.mediaState,
            mediaData: options.mediaState.mediaData.merge({
              mediaId: {
                mediaId: 'mediaId',
                getUrlPending: true
              }
            })
          }
        });
        let spinner = getSpinner();
        assert.equal(spinner.type, 'div');
      });

      it('Check Spinner with getPending && getUrlPending flag', function() {
        component = getComponent({
          ...options,
          mediaState: {
            ...options.mediaState,
            mediaData: options.mediaState.mediaData.merge({
              mediaId: {
                mediaId: 'mediaId',
                getPending: true,
                getUrlPending: true
              }
            })
          }
        });
        let spinner = getSpinner();
        assert.equal(spinner.type, 'div');
      });

    });

    it('Check error if status === "failed"', function() {
      component = getComponent({
        ...options,
        mediaState: {
          ...options.mediaState,
          mediaData: options.mediaState.mediaData.merge({
            mediaId: {
              mediaId: 'mediaId',
              status: 'failed'
            }
          })
        }
      });
      let error = getError();
      assert.equal(error.type, Row);
    });

    describe('Check Player Block', function () {
      const getPlayer = function () {
        return component
          .props.children[1]
          .props.children
          .props.children[2];
      };

      it('Check player block without mediaData.data', function() {
        component = getComponent({
          ...options,
          mediaState: {
            ...options.mediaState,
            mediaData: options.mediaState.mediaData.merge({
              mediaId: {
                mediaId: 'mediaId'
              }
            })
          }
        });
        let playerApp = getPlayer();
        assert.isFalse(playerApp);
      });

      it('Check player block without status === "finished"', function() {
        component = getComponent({
          ...options,
          mediaState: {
            ...options.mediaState,
            mediaData: options.mediaState.mediaData.merge({
              mediaId: {
                mediaId: 'mediaId',
                data: {},
                status: 'failed'
              }
            })
          }
        });
        let playerApp = getPlayer();
        assert.isFalse(playerApp);
      });

      it('Check player block with default settings', function() {
        component = getComponent({
          ...options,
          mediaState: {
            ...options.mediaState,
            mediaData: options.mediaState.mediaData.merge({
              mediaId: {
                mediaId: 'mediaId',
                data: {},
                status: 'finished'
              }
            })
          }
        });
        let playerApp = getPlayer();
        assert.equal(playerApp.type, VbsPlayerApp);
        assert.equal(playerApp.props.token, options.token);
        assert.equal(playerApp.props.mediaId, options.mediaId);
        expect(playerApp.props.playerState).to.eql({loading: true});
        expect(playerApp.props.actions).to.eql(options.actions);
      });

      it('Check player state of player block', function() {
        let _initialPlayerState = {
          ...initialPlayerState,
          url: 'url',
          type: 'audio'
        };
        component = getComponent({
          ...options,
          mediaState: {
            ...options.mediaState,
            player: options.mediaState.player.merge({
              playerIds: ['mediaId'],
              players: {
                mediaId: _initialPlayerState
              }
            }),
            mediaData: options.mediaState.mediaData.merge({
              mediaId: {
                mediaId: 'mediaId',
                data: {},
                status: 'finished'
              }
            })
          }
        });
        let playerApp = getPlayer();
        expect(playerApp.props.playerState).to.eql(_initialPlayerState);
      });

      it('Check mediaDataState of player block', function() {
        let data = {
          mediaId: 'mediaId',
          data: {},
          status: 'finished'
        };

        component = getComponent({
          ...options,
          mediaState: {
            ...options.mediaState,
            mediaData: options.mediaState.mediaData.merge({
              mediaId: data
            })
          }
        });
        let playerApp = getPlayer();
        expect(playerApp.props.mediaDataState).to.eql(data);
      });

      it('Check empty markersState of player block', function() {
        component = getComponent({
          ...options,
          mediaState: {
            ...options.mediaState,
            mediaData: options.mediaState.mediaData.merge({
              mediaId: {
                mediaId: 'mediaId',
                data: {},
                status: 'finished'
              }
            })
          }
        });
        let playerApp = getPlayer();
        expect(playerApp.props.markersState).to.eql(null);
      });

      it('Check non-empty markersState of player block', function() {
        let markersState = {
          "mediaId": {
            "markerIds": ["0"],
            "markers": {
              "0": {"id": "0", "time": 123.55, "keywordName": "premium package"}
            },
            "justCreated": true
          }
        };
        component = getComponent({
          ...options,
          mediaState: {
            ...options.mediaState,
            markers: options.mediaState.markers.merge(markersState),
            mediaData: options.mediaState.mediaData.merge({
              mediaId: {
                mediaId: 'mediaId',
                data: {},
                status: 'finished'
              }
            })
          }
        });
        let playerApp = getPlayer();
        expect(playerApp.props.markersState).to.eql(markersState['mediaId']);
      });
    });
  });
});
