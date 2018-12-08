import React from 'react';
import {
  Route,
  Switch,
} from 'react-router-dom'

// Components
import RefillsView from './RefillsView/RefillsView'
import NotFound from '../../NotFound/NotFound'

const RefillsPageRouter = props => (
  <Switch>
    <Route
      exact
      path="/refills"
      component={RefillsView}
    />

    <Route
      component={NotFound}
    />
  </Switch>
)


export default RefillsPageRouter
