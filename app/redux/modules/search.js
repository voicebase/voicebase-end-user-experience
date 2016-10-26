import { createAction, handleActions } from 'redux-actions'
import { fromJS } from 'immutable';

/*
 * Constants
 * */
export const APPLY_DATE = 'APPLY_DATE';
export const CLEAR_DATE = 'CLEAR_DATE';
export const SELECT_ORDER = 'SELECT_ORDER';
export const SET_SEARCH_STRING = 'SET_SEARCH_STRING';
export const START_SEARCH = 'START_SEARCH';
export const CANCEL_SEARCH = 'CANCEL_SEARCH';
export const ORDER_DATE_DOWN = '3';
export const ORDER_DATE_UP = '4';

/*
 * Actions
 * */
export const applyDate = createAction(APPLY_DATE, (dateObj) => dateObj);
export const clearDate = createAction(CLEAR_DATE);
export const selectOrder = createAction(SELECT_ORDER, (orderId) => orderId);
export const setSearchString = createAction(SET_SEARCH_STRING, (text) => text);
export const startSearch = createAction(START_SEARCH);
export const cancelSearch = createAction(CANCEL_SEARCH);

export const actions = {
  applyDate,
  clearDate,
  selectOrder,
  setSearchString,
  startSearch,
  cancelSearch
};

/*
 * State
 * */
export const initialState = fromJS({
  view: {
    datePickerEnabled: true,
    orderEnabled: true
  },
  dateFrom: '',
  dateTo: '',
  searchString: '',
  selectedOrderId: ORDER_DATE_UP,
  isSearching: false,
  order: {
    // 1: {
    //   name: 'Order by Title A-Z'
    // },
    // 2: {
    //   name: 'Order by Title Z-A'
    // },
    [ORDER_DATE_DOWN]: {
      name: 'Order by Newest'
    },
    [ORDER_DATE_UP]: {
      name: 'Order by Oldest'
    }
  }
});

/*
 * Reducers
 * */
export default handleActions({
  [APPLY_DATE]: (state, { payload: dateObj }) => {
    return state
      .set('dateFrom', dateObj.dateFrom)
      .set('dateTo', dateObj.dateTo)
  },

  [CLEAR_DATE]: (state) => {
    return state
      .set('dateFrom', '')
      .set('dateTo', '')
  },

  [SELECT_ORDER]: (state, { payload: orderId }) => {
    return state.set('selectedOrderId', orderId)
  },

  [SET_SEARCH_STRING]: (state, { payload: text }) => {
    return state.set('searchString', text)
  },

  [START_SEARCH]: (state) => {
    return state.set('isSearching', true)
  },

  [CANCEL_SEARCH]: (state) => {
    return state.set('isSearching', false)
  }

}, initialState);
