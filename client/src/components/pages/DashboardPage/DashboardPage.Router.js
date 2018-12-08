import React from 'react';
import {
  Route,
  Switch,
} from 'react-router-dom'

// Components
import DashboardPage from './DashboardView/DashboardView'
import AddExpense from './RepDashboard/AddExpense/AddExpense'
import NotFound from '../../NotFound/NotFound'

const DashboardPageRouter = props => (
  <Switch>
    <Route
      exact
      path="/dashboard"
      component={DashboardPage}
    />

    <Route
      exact
      path="/dashboard/add-expense"
      component={AddExpense}
    />

    <Route
      component={NotFound}
    />
  </Switch>
)


export default DashboardPageRouter
