import React from 'react'
import { Route, IndexRoute, Redirect } from 'react-router'

import CoreLayout from '../views/CoreLayout'
import AppLayout from '../views/AppLayout'
import LoginView from '../views/LoginView'
import ConfirmView from '../views/ConfirmView'
import AllView from '../AllMyFiles/AllView'
import UploadView from '../views/UploadView'
import SettingsView from '../views/SettingsView'
import NotFoundView from '../views/NotFoundView'

export default function (store) {
  const redirectIfLoggedIn = (nextState, replace) => {
    const { auth } = store.getState();
    if (!auth.token) {
      replace('/login');
    }
    else {
      replace('/all');
    }
  };

  return (
    <Route path='/' component={CoreLayout}>
      <IndexRoute onEnter={redirectIfLoggedIn} />

      <Route component={AppLayout}>
        <Route path='/all' component={AllView} />
        <Route path='/upload' component={UploadView} />
        <Route path='/settings' component={SettingsView} />
      </Route>

      <Route path='/login' component={LoginView} />
      <Route path='/confirm' component={ConfirmView} />
      <Route path='/404' component={NotFoundView} />
      <Redirect from='*' to='/404' />
    </Route>
  )
}
