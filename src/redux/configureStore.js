import thunk from 'redux-thunk'
import rootReducer from './rootReducer'
import promiseMiddleware from 'redux-promise-middleware';
import {
  applyMiddleware,
  compose,
  createStore
} from 'redux'

import storage from './storage';

export default function configureStore (initialState) {
  let createStoreWithMiddleware
  const middleware = applyMiddleware(thunk, promiseMiddleware())

  if (__DEBUG__) {
    createStoreWithMiddleware = compose(
      middleware,
      storage,
      window.devToolsExtension
        ? window.devToolsExtension()
        : require('containers/DevTools').default.instrument()
    )
  } else {
    createStoreWithMiddleware = compose(
      middleware,
      storage
    )
  }

  const store = createStoreWithMiddleware(createStore)(
    rootReducer, initialState
  )
  if (module.hot) {
    module.hot.accept('./rootReducer', () => {
      const nextRootReducer = require('./rootReducer').default

      store.replaceReducer(nextRootReducer)
    })
  }
  return store
}
