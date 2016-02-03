import { createAction, handleActions } from 'redux-actions'
import _ from 'lodash'
import PredictionsApi from '../../api/predictionsApi'
import DetectionsApi from '../../api/detectionsApi'

/*
 * Constants
 * */
export const GET_ITEMS = 'GET_ITEMS';
export const DELETE_ITEM = 'DELETE_ITEM';
export const EDIT_ITEM = 'EDIT_ITEM';
export const ADD_ITEM = 'ADD_ITEM';
export const TOGGLE_LIST = 'TOGGLE_LIST';
export const TOGGLE_CREATE_FORM = 'TOGGLE_CREATE_FORM';

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
  //else if (type === 'numbers') {
  //  api = NumbersApi;
  //}
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

export const deleteItem = createAction(DELETE_ITEM, (token, type, id) => {
  return {
    data: {
      type,
      id
    },
    promise: getApi(type).deleteItem(id)
  }
});

export const editItem = createAction(EDIT_ITEM, (token, type, id, newItem) => {
  return {
    data: {
      type,
      id
    },
    promise: getApi(type).editItem(id, newItem)
  }
});

export const addItem = createAction(ADD_ITEM, (token, type, newItem) => {
  return {
    data: {
      type
    },
    promise: getApi(type).editItem(null, newItem)
  }
});

// view
export const toggleList = createAction(TOGGLE_LIST, (type, value) => { return {type, value} });
export const toggleCreateForm = createAction(TOGGLE_CREATE_FORM, (type, value) => { return {type, value} });

export const actions = {
  getItems,
  deleteItem,
  editItem,
  addItem,
  toggleList,
  toggleCreateForm
};

/*
 * State
 * */
export const initialState = {
  predictions: {
    view: {
      title: 'Prediction Models',
      addButtonLabel: 'Add prediction model',
      isExpandList: false,
      isExpandCreateForm: false
    },
    itemIds: [],
    items: {},
    isGetPending: false,
    isAddPending: false,
    errorMessage: ''
  },
  detection: {
    view: {
      title: 'Detection Models',
      addButtonLabel: 'Add detection model',
      isExpandList: false,
      isExpandCreateForm: false
    },
    itemIds: [],
    items: {},
    isGetPending: false,
    isAddPending: false,
    errorMessage: ''
  },
  numbers: {
    view: {
      title: 'Number Formats',
      addButtonLabel: 'Add number format'
    },
    itemIds: [],
    items: {},
    isGetPending: false,
    isAddPending: false,
    errorMessage: ''
  }
};

/*
 * Reducers
 * */
export default handleActions({
  [GET_ITEMS + '_PENDING']: (state, { payload }) => {
    return {
      ...state,
      isGetPending: true,
      errorMessage: ''
    };
  },

  [GET_ITEMS + '_REJECTED']: (state, { payload }) => {
    return {
      ...state,
      isGetPending: false,
      errorMessage: payload.error
    };
  },

  [GET_ITEMS + '_FULFILLED']: (state, { payload: {type, data} }) => {
    let itemIds = [];
    let items = {};
    data.forEach((item, i) => {
      itemIds.push(i);
      items[i] = {
        ...item,
        id: i
      };
    });

    return {
      ...state,
      [type]: {
        ...state[type],
        itemIds,
        items,
        isGetPending: false,
        errorMessage: ''
      }
    };
  },

  [DELETE_ITEM + '_PENDING']: (state, { payload: {type, id} }) => {
    return {
      ...state,
      [type]: {
        ...state[type],
        items: {
          ...state[type].items,
          [id]: {
            ...state[type].items[id],
            isDeletePending: true
          }
        }
      }
    };
  },

  [DELETE_ITEM + '_REJECTED']: (state, { payload: {type, id, error} }) => {
    return {
      ...state,
      [type]: {
        ...state[type],
        items: {
          ...state[type].items,
          [id]: {
            ...state[type].items[id],
            isDeletePending: false,
            deleteError: error
          }
        }
      }
    };
  },

  [DELETE_ITEM + '_FULFILLED']: (state, { payload: {type, id} }) => {
    let itemIds = state[type].itemIds.filter(_id => id !== _id);
    return {
      ...state,
      [type]: {
        ...state[type],
        itemIds: itemIds,
        items: _.pick(state[type].items, itemIds)
      }
    };
  },

  [EDIT_ITEM + '_PENDING']: (state, { payload: {type, id} }) => {
    return {
      ...state,
      [type]: {
        ...state[type],
        items: {
          ...state[type].items,
          [id]: {
            ...state[type].items[id],
            isEditPending: true,
            editError: ''
          }
        }
      }
    };
  },

  [EDIT_ITEM + '_REJECTED']: (state, { payload: {type, id, error} }) => {
    return {
      ...state,
      [type]: {
        ...state[type],
        items: {
          ...state[type].items,
          [id]: {
            ...state[type].items[id],
            isEditPending: false,
            editError: error
          }
        }
      }
    };
  },

  [EDIT_ITEM + '_FULFILLED']: (state, { payload: {type, id, data} }) => {
    return {
      ...state,
      [type]: {
        ...state[type],
        items: {
          ...state[type].items,
          [id]: data
        }
      }
    };
  },

  [ADD_ITEM + '_PENDING']: (state, { payload: {type, id} }) => {
    return {
      ...state,
      [type]: {
        ...state[type],
        isAddPending: true
      }
    };
  },

  [ADD_ITEM + '_REJECTED']: (state, { payload: {type, error} }) => {
    return {
      ...state,
      [type]: {
        ...state[type],
        isAddPending: false,
        addError: error
      }
    };
  },

  [ADD_ITEM + '_FULFILLED']: (state, { payload: {type, data} }) => {
    let id = new Date().getTime();
    return {
      ...state,
      [type]: {
        ...state[type],
        isAddPending: false,
        addError: '',
        itemIds: state[type].itemIds.concat(id),
        items: {
          ...state[type].items,
          [id]: {
            ...data,
            id
          }
        }
      }
    };
  },

  // View
  [TOGGLE_LIST]: (state, { payload: {type, value} }) => {
    return {
      ...state,
      [type]: {
        ...state[type],
        view: {
          ...state[type].view,
          isExpandList: (typeof value !== 'undefined') ? value : !state[type].view.isExpandList
        }
      }
    }
  },

  [TOGGLE_CREATE_FORM]: (state, { payload: {type, value} }) => {
    return {
      ...state,
      [type]: {
        ...state[type],
        view: {
          ...state[type].view,
          isExpandCreateForm: (typeof value !== 'undefined') ? value : !state[type].view.isExpandCreateForm
        }
      }
    }
  }

}, initialState);
