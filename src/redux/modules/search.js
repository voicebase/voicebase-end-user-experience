import { createAction, handleActions } from 'redux-actions'

/*
 * Constants
 * */
export const APPLY_DATE = 'APPLY_DATE';
export const CLEAR_DATE = 'CLEAR_DATE';
export const SELECT_ORDER = 'SELECT_ORDER';
export const SET_SEARCH_STRING = 'SET_SEARCH_STRING';
export const START_SEARCH = 'START_SEARCH';

/*
 * Actions
 * */
export const applyDate = createAction(APPLY_DATE, (dateObj) => dateObj);
export const clearDate = createAction(CLEAR_DATE);
export const selectOrder = createAction(SELECT_ORDER, (orderId) => orderId);
export const setSearchString = createAction(SET_SEARCH_STRING, (text) => text);
export const startSearch = createAction(START_SEARCH);

export const actions = {
  applyDate,
  clearDate,
  selectOrder,
  setSearchString,
  startSearch
};

/*
 * State
 * */
export const initialState = {
  dateFrom: '',
  dateTo: '',
  searchString: '',
  selectedOrderId: '3',
  order: {
    1: {
      name: 'Order by Title A-Z'
    },
    2: {
      name: 'Order by Title Z-A'
    },
    3: {
      name: 'Order by Newest'
    },
    4: {
      name: 'Order by Oldest'
    }
  }
};

/*
 * Reducers
 * */
export default handleActions({
  [APPLY_DATE]: (state, { payload: dateObj }) => {
    return {
      ...state,
      dateFrom: dateObj.dateFrom,
      dateTo: dateObj.dateTo
    };
  },

  [CLEAR_DATE]: (state) => {
    return {
      ...state,
      dateFrom: '',
      dateTo: ''
    };
  },

  [SELECT_ORDER]: (state, { payload: orderId }) => {
    return {
      ...state,
      selectedOrderId: orderId
    };
  },

  [SET_SEARCH_STRING]: (state, { payload: text }) => {
    return {
      ...state,
      searchString: text
    };
  }

}, initialState);
