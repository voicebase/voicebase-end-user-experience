import { createAction, handleActions } from 'redux-actions'
import { combineReducers } from 'redux'
import groups from './groups';

import { fromJS } from 'immutable'
import { normalize } from '../../common/Normalize'
import PredictionsApi from '../../api/predictionsApi'
import DetectionsApi from '../../api/detectionsApi'
import NumbersApi from '../../api/numbersApi'
import VocabularyApi from '../../api/vocabularyApi'

/*
 * Constants
 * */
export const GET_ITEMS = 'GET_ITEMS';
export const DELETE_ITEM = 'DELETE_ITEM';
export const EDIT_ITEM = 'EDIT_ITEM';
export const ADD_ITEM = 'ADD_ITEM';
export const TOGGLE_CREATE_FORM = 'TOGGLE_CREATE_FORM';
export const SET_ACTIVE_ITEM = 'SET_ACTIVE_ITEM';
export const CLEAR_ACTIVE_ITEM = 'CLEAR_ACTIVE_ITEM';

/*
 * Actions
 * */

const getApi = function (type) {
  let api;
  if (type === 'predictions') {
    api = PredictionsApi;
  }
  else if (type === 'detection') {
    api = DetectionsApi;
  }
  else if (type === 'numbers') {
    api = NumbersApi;
  }
  else if (type === 'vocabularies') {
    api = VocabularyApi;
  }
  return api;
};

// api
export const getItems = createAction(GET_ITEMS, (token, type) => {
  return {
    data: {
      type
    },
    promise: getApi(type).getItems(token)
  }
});

export const deleteItem = createAction(DELETE_ITEM, (token, type, id, name) => {
  return {
    data: {
      type,
      id
    },
    promise: getApi(type).deleteItem(token, id, name)
  }
});

export const editItem = createAction(EDIT_ITEM, (token, type, id, newItem) => {
  return {
    data: {
      type,
      id
    },
    promise: getApi(type).editItem(token, id, newItem)
  }
});

export const addItem = createAction(ADD_ITEM, (token, type, newItem) => {
  return {
    data: {
      type
    },
    promise: getApi(type).editItem(token, null, newItem)
  }
});

// view
export const toggleCreateForm = createAction(TOGGLE_CREATE_FORM, (type, value) => { return {type, value} });
export const setActiveItem = createAction(SET_ACTIVE_ITEM, (type, itemId) => { return {type, itemId} });
export const clearActiveItem = createAction(CLEAR_ACTIVE_ITEM, (type) => type);

export const actions = {
  getItems,
  deleteItem,
  editItem,
  addItem,
  toggleCreateForm,
  setActiveItem,
  clearActiveItem
};

/*
 * State
 * */
export const itemInitialState = {
  view: {},
  itemIds: [],
  items: {},
  activeItem: null,
  isGetPending: false,
  isAddPending: false,
  errorMessage: ''
};

export const initialState = fromJS({
  predictions: {
    ...itemInitialState,
    view: {
      enabled: false,
      title: 'Prediction Models',
      addButtonLabel: 'Add prediction model',
      isExpandList: false,
      isExpandCreateForm: false
    }
  },
  detection: {
    ...itemInitialState,
    view: {
      enabled: false,
      title: 'Detection Models',
      addButtonLabel: 'Add detection model',
      isExpandList: false,
      isExpandCreateForm: false
    }
  },
  numbers: {
    ...itemInitialState,
    view: {
      enabled: false,
      title: 'Number Formats',
      addButtonLabel: 'Add number format',
      isExpandList: false,
      isExpandCreateForm: false
    }
  },
  vocabularies: {
    ...itemInitialState,
    view: {
      enabled: true,
      title: 'Custom terms',
      addButtonLabel: 'Add terms list',
      isExpandList: false,
      isExpandCreateForm: false
    }
  },
  languages: {
    itemIds: ['fr', 'de', 'it', 'pt', 'us'],
    items: {
      'en-US': {
        id: 'en-US',
        name: 'US English'
      },
      'en-UK': {
        id: 'en-UK',
        name: 'UK English'
      },
      'en-AU': {
        id: 'en-AU',
        name: 'Australian English'
      },
      'es-LA': {
        id: 'es-LA',
        name: 'Latin American Spanish'
      },
      'pt-BZ': {
        id: 'pt-BZ',
        name: 'Brazilian Portuguese'
      }
    },
    defaultLanguage: 'en-US'
  },
  priority: {
    itemIds: ['high', 'medium', 'low'],
    items: {
      high: {
        id: 'high',
        name: 'High'
      },
      medium: {
        id: 'medium',
        name: 'Normal'
      },
      low: {
        id: 'low',
        name: 'Low'
      }
    },
    defaultPriority: 'medium'
  }
});

/*
 * Reducers
 * */
export const settings = handleActions({
  [GET_ITEMS + '_PENDING']: (state, { payload }) => {
    return state.mergeIn([payload.type], {
      isGetPending: true,
      errorMessage: ''
    });
  },

  [GET_ITEMS + '_REJECTED']: (state, { payload }) => {
    return state.mergeIn([payload.type], {
      isGetPending: false,
      errorMessage: payload.error
    });
  },

  [GET_ITEMS + '_FULFILLED']: (state, { payload: {type, data} }) => {
    let result = normalize(data, (item, i) => {
      return {
        ...item,
        id: i.toString()
      }
    });

    return state.mergeIn([type], {
      itemIds: result.ids,
      items: result.entities,
      isGetPending: false,
      errorMessage: ''
    });
  },

  [DELETE_ITEM + '_PENDING']: (state, { payload: {type, id} }) => {
    return state.setIn([type, 'items', id, 'isDeletePending'], true);
  },

  [DELETE_ITEM + '_REJECTED']: (state, { payload: {type, id, error} }) => {
    return state.mergeIn([type, 'items', id], {
      isDeletePending: false,
      deleteError: error
    });
  },

  [DELETE_ITEM + '_FULFILLED']: (state, { payload: {type, id} }) => {
    let itemIds = state.getIn([type, 'itemIds']).filter(_id => id !== _id);
    return state
      .setIn([type, 'itemIds'], itemIds)
      .deleteIn([type, 'items', id]);
  },

  [EDIT_ITEM + '_PENDING']: (state, { payload: {type, id} }) => {
    return state.mergeIn([type, 'items', id], {
      isEditPending: true,
      editError: ''
    });
  },

  [EDIT_ITEM + '_REJECTED']: (state, { payload: {type, id, error} }) => {
    return state.mergeIn([type, 'items', id], {
      isEditPending: false,
      editError: error
    });
  },

  [EDIT_ITEM + '_FULFILLED']: (state, { payload: {type, id, data} }) => {
    return state.mergeIn([type, 'items', id], {
      ...data,
      isEditPending: false,
      editError: ''
    });
  },

  [ADD_ITEM + '_PENDING']: (state, { payload: {type} }) => {
    return state.setIn([type, 'isAddPending'], true);
  },

  [ADD_ITEM + '_REJECTED']: (state, { payload: {type, error} }) => {
    return state.mergeIn([type], {
      isAddPending: false,
      addError: error
    });
  },

  [ADD_ITEM + '_FULFILLED']: (state, { payload: {type, data} }) => {
    let id = new Date().getTime().toString();
    let itemIds = state.getIn([type, 'itemIds']).concat(id);

    return state
      .mergeIn([type], {
        isAddPending: false,
        addError: '',
        itemIds
      })
      .mergeIn([type, 'items', id], {
        ...data,
        id
      });
  },

  // View
  [TOGGLE_CREATE_FORM]: (state, { payload: {type, value} }) => {
    let isExpandCreateForm = (typeof value !== 'undefined') ? value : !state.getIn([type, 'view', 'isExpandCreateForm']);
    return state.setIn([type, 'view', 'isExpandCreateForm'], isExpandCreateForm);
  },

  [SET_ACTIVE_ITEM]: (state, { payload: {type, itemId} }) => {
    let id = (state.getIn([type, 'activeItem']) !== itemId) ? itemId : null;
    return state.setIn([type, 'activeItem'], id);
  },

  [CLEAR_ACTIVE_ITEM]: (state, { payload: type }) => {
    return state.setIn([type, 'activeItem'], null);
  }

}, initialState);

export default combineReducers({
  items: settings,
  groups
});
