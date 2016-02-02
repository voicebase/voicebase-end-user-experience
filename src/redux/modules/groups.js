import { createAction, handleActions } from 'redux-actions'
import _ from 'lodash'
import GroupsApi from '../../api/groupsApi'

/*
 * Constants
 * */
export const GET_GROUPS = 'GET_GROUPS';
export const DELETE_GROUP = 'DELETE_GROUP';
export const EDIT_GROUP = 'EDIT_GROUP';

/*
 * Actions
 * */
export const getGroups = createAction(GET_GROUPS, (token) => {
  return {
    promise: GroupsApi.getGroups(token)
  }
});

export const deleteGroup = createAction(DELETE_GROUP, (token, groupId, groupName) => {
  return {
    data: {
      token,
      groupId
    },
    promise: GroupsApi.deleteGroup(token, groupId, groupName)
  }
});

export const editGroup = createAction(EDIT_GROUP, (token, groupId, newGroup) => {
  return {
    data: {
      token,
      groupId
    },
    promise: GroupsApi.createGroup(token, groupId, newGroup)
  }
});

export const actions = {
  getGroups,
  deleteGroup,
  editGroup
};

/*
 * State
 * */
export const initialState = {
  groupIds: [],
  groups: {},
  isGetPending: false,
  errorMessage: ''
};

/*
 * Reducers
 * */
export default handleActions({
  [GET_GROUPS + '_PENDING']: (state, { payload }) => {
    return {
      ...state,
      isGetPending: true,
      errorMessage: ''
    };
  },

  [GET_GROUPS + '_REJECTED']: (state, { payload }) => {
    return {
      ...state,
      errorMessage: payload.error
    };
  },

  [GET_GROUPS + '_FULFILLED']: (state, { payload: response }) => {
    let groupIds = [];
    let groups = {};
    response.groups.forEach((group, i) => {
      groupIds.push(i);
      let keywordIds = [];
      let keywords = {};
      group.keywords.forEach((keyword, i) => {
        keywordIds.push(i);
        keywords[i] = keyword;
      });
      groups[i] = {
        name: group.name,
        keywordIds,
        keywords,
        id: i
      };
    });
    return {
      groupIds: groupIds,
      groups: groups,
      isGetPending: false,
      errorMessage: ''
    };
  },

  [DELETE_GROUP + '_PENDING']: (state, { payload }) => {
    return {
      ...state,
      groups: {
        ...state.groups,
        [payload.groupId]: {
          ...state.groups[payload.groupId],
          isDeletePending: true
        }
      }
    };
  },

  [DELETE_GROUP + '_REJECTED']: (state, { payload }) => {
    return {
      ...state,
      groups: {
        ...state.groups,
        [payload.groupId]: {
          ...state.groups[payload.groupId],
          isDeletePending: false,
          deleteError: payload.error
        }
      }
    };
  },

  [DELETE_GROUP + '_FULFILLED']: (state, { payload }) => {
    let groupIds = state.groupIds.filter(groupId => payload.groupId !== groupId);
    return {
      ...state,
      groupIds,
      groups: _.pick(state.groups, groupIds)
    };
  },

  [EDIT_GROUP + '_PENDING']: (state, { payload }) => {
    return {
      ...state,
      groups: {
        ...state.groups,
        [payload.groupId]: {
          ...state.groups[payload.groupId],
          isEditPending: true,
          editError: ''
        }
      }
    };
  },

  [EDIT_GROUP + '_REJECTED']: (state, { payload }) => {
    return {
      ...state,
      groups: {
        ...state.groups,
        [payload.groupId]: {
          ...state.groups[payload.groupId],
          isEditPending: false,
          editError: payload.error
        }
      }
    };
  },

  [EDIT_GROUP + '_FULFILLED']: (state, { payload }) => {
    let keywordIds = [];
    let keywords = {};
    payload.data.keywords.forEach((keyword, i) => {
      keywordIds.push(i);
      keywords[i] = keyword;
    });

    return {
      ...state,
      groups: {
        ...state.groups,
        [payload.groupId]: {
          ...state.groups[payload.groupId],
          name: payload.data.name,
          keywordIds,
          keywords,
          isEditPending: false,
          editError: ''
        }
      }
    };
  }

}, initialState);
