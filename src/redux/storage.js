import persistState from 'redux-localstorage';

const storageConfig = {
  key: 'voicebaseStorage',
  merge: (initialState, persistedState) => {
    if (persistedState.auth && !persistedState.auth.isRemember) {
      return {
        ...persistedState,
        auth: {
          ...persistedState.auth,
          token: ''
        }
      }
    }
    return persistedState;
  }
};

export default persistState('auth', storageConfig);
