import {
  SET_MARKERS,
  CLEAR_JUST_CREATED_MARKERS,
  actions,
  initialState,
  default as markersReducer
} from '../../../src/redux/modules/media/markers'

import { checkActionTypes, checkCreatingAction, checkCreatingActionWithMultipleParameters } from '../../../src/common/Test'
import Immutable, { fromJS } from 'immutable'

describe('(Redux Module) markers.js', function () {
  describe('Constants', () => {
    const constants = {
      SET_MARKERS,
      CLEAR_JUST_CREATED_MARKERS
    };
    Object.keys(constants).forEach(key => {
      it(`Should export a constant ${key}`, function () {
        expect(constants[key]).to.equal(key)
      });
    });
  });

  describe('Actions', () => {
    describe('SET_MARKERS', () => {
      checkActionTypes(actions, 'setMarkers', SET_MARKERS);
      checkCreatingActionWithMultipleParameters(actions, 'setMarkers', SET_MARKERS, ['mediaId', []], ['mediaId', 'markers']);
    });

    describe('CLEAR_JUST_CREATED_MARKERS', () => {
      checkActionTypes(actions, 'clearJustCreatedMarkers', CLEAR_JUST_CREATED_MARKERS);
      checkCreatingAction(actions, 'clearJustCreatedMarkers', CLEAR_JUST_CREATED_MARKERS, ['mediaId']);
    });
  });

  describe('Reducers', () => {
    let markersData = [
      {"time": 123.55, "keywordName": "premium package"},
      {"time": 193.67, "keywordName": "premium package"}
    ];

    let normalizeMarkers = {
      "0": {"id": "0", "time": 123.55, "keywordName": "premium package"},
      "1": {"id": "1", "time": 193.67, "keywordName": "premium package"}
    };

    it(`${SET_MARKERS} reducer `, function () {
      let expectedRes = initialState
        .mergeIn(['mediaId'], {
          markerIds: ['0', '1'],
          markers: normalizeMarkers,
          justCreated: true
        });

      let res = markersReducer(initialState, {
        type: SET_MARKERS,
        payload: {mediaId: 'mediaId', markers: markersData}
      });

      assert.isTrue(Immutable.is(expectedRes, res));
    });

    it(`${CLEAR_JUST_CREATED_MARKERS} reducer `, function () {
      let expectedRes = initialState
        .mergeIn(['mediaId'], {
          markerIds: ['0', '1'],
          markers: normalizeMarkers,
          justCreated: false
        });

      let addRes = markersReducer(initialState, {
        type: SET_MARKERS,
        payload: {mediaId: 'mediaId', markers: markersData}
      });

      let res = markersReducer(addRes, {
        type: CLEAR_JUST_CREATED_MARKERS,
        payload: 'mediaId'
      });

      assert.isTrue(Immutable.is(expectedRes, res));
    });

  });

});
