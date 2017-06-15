import React from 'react'
import PropTypes from 'prop-types'
import {Provider} from 'react-redux'
import {Router} from 'react-router'

export default class Root extends React.Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    routes: PropTypes.element.isRequired,
    store: PropTypes.object.isRequired
  }

  get devTools () {
    if (__DEBUG__) {
      if (!window.devToolsExtension) {
        const DevTools = require('containers/DevTools').default
        return <DevTools />
      }
      else {
        window.devToolsExtension.open()
      }
    }
  }

  render () {
    return (
      <Provider store={this.props.store}>
        <div style={{height: '100%'}}>
          <Router history={this.props.history}>
            {this.props.routes}
          </Router>
          {this.devTools}
        </div>
      </Provider>
    )
  }
}
