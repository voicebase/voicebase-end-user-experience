import React from 'react'
import ReactDOM from 'react-dom'
import createBrowserHistory from 'history/lib/createBrowserHistory'
import { useRouterHistory } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'
import configureRoutes from './routes'
import Root from './containers/Root'
import configureStore from './redux/configureStore'

const browserHistory = useRouterHistory(createBrowserHistory)({
  basename: __BASENAME__
});

const store = configureStore(window.__INITIAL_STATE__ || {});
const history = syncHistoryWithStore(browserHistory, store);
const routes = configureRoutes(store, history);

// Render the React application to the DOM
ReactDOM.render(
  <Root history={history} routes={routes} store={store} />,
  document.getElementById('root')
);
