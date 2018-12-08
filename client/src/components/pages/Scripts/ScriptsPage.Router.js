import React from 'react';
import {
  Route,
  Switch,
} from 'react-router-dom'

// Components
import ScriptsView from './ScriptsView/ScriptsView'
import ScriptView from './ScriptView/ScriptView'
import AddScript from './AddScript/AddScript'
import NotFound from '../../NotFound/NotFound'

const ScriptsPageRouter = props => (
  <Switch>
    <Route
      exact
      path="/scripts"
      component={ScriptsView}
    />

    <Route
      exact
      path="/scripts/add"
      component={AddScript}
    />

    <Route
      exact
      path="/scripts/:scriptId"
      component={ScriptView}
    />

    <Route
      component={NotFound}
    />
    
  </Switch>
)


export default ScriptsPageRouter
