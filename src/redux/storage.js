import persistState from 'redux-localstorage';
import { initialState as authInitialState } from './modules/auth'

const storageConfig = {
  key: 'voicebaseStorage',
  merge: (initialState, persistedState) => {
    if (persistedState.auth && !persistedState.auth.isRemember) {
      return {
        ...persistedState,
        auth: {
          ...authInitialState
        }
      }
    }
    return persistedState;
  }
};

export default persistState('auth', storageConfig);
