import { createAction, handleActions } from 'redux-actions'
import { fromJS } from 'immutable';
import { getRandomId } from '../../common/Common'

/*
 * Constants
 * */
export const PUSH_ERROR = 'PUSH_ERROR';
export const REMOVE_ERROR = 'REMOVE_ERROR';

/*
 * Actions
 * */
export const pushError = createAction(PUSH_ERROR, (message) => message);
export const removeError = createAction(REMOVE_ERROR, (id) => id);

export const actions = {
  pushError,
  removeError
};

/*
 * State
 * */
export const initialState = fromJS({
  ids: [],
  entities: {}
});

export const initialErrorState = fromJS({
  id: null,
  message: ''
});

/*
 * Reducers
 * */
export default handleActions({
  [PUSH_ERROR]: (state, {payload: message}) => {
    const newId = getRandomId('error');
    const ids = state.get('ids').concat(newId);
    const error = initialErrorState.merge({
      id: newId,
      message
    });
    return state
      .set('ids', ids)
      .mergeIn(['entities', newId], error);
  },
  
  [REMOVE_ERROR]: (state, {payload: id}) => {
    const ids = state.get('ids').filter(_id => _id !== id);
    return state
      .set('ids', ids)
      .deleteIn(['entities', id])
  }
  
}, initialState);
