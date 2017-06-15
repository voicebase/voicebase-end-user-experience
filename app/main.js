import React from 'react'
import ReactDOM from 'react-dom'
import createBrowserHistory from 'history/lib/createBrowserHistory'
import {useRouterHistory} from 'react-router'
import {syncHistoryWithStore} from 'react-router-redux'
import configureRoutes from './Router/routes'
import Root from './Router/Root'
import configureStore from './redux/configureStore'

;(async function mainJs() {
  const browserHistory = useRouterHistory(createBrowserHistory)({
    basename: __BASENAME__
  })
  const store = configureStore(window.__INITIAL_STATE__)
  const history = syncHistoryWithStore(browserHistory, store)
  const routes = configureRoutes(store, history)

  ReactDOM.render(
    <Root history={history} routes={routes} store={store} />,
    document.getElementById('root'),
  )
})().catch(e => {
  const m = 'app/main.js initial render Error:'
  console.error(m, e)
  if (document && document.body) {
    const message = `${m} ${e && e.message}`
    const node = document.createTextNode(message)
    document.body.insertBefore(node, document.body.firstChild)
    document.body.style.color = 'red'
  }
})
