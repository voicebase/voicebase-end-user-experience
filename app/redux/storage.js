import persistState from 'redux-localstorage';
import { initialState as authInitialState } from './modules/auth'

const storageConfig = {
  key: 'voicebaseStorage',
  merge: (initialState, persistedState) => {
    if (persistedState && persistedState.auth && !persistedState.auth.isRemember) {
      return {
        ...persistedState,
        auth: {
          ...authInitialState
        }
      }
    }
    return initialState;
  }
};

export default persistState('auth', storageConfig);
