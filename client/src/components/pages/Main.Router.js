import React from 'react';
import {
  Route,
  Switch,
  Redirect,
} from 'react-router-dom'

// Components
/* import DashboardPage from './DashboardPage/DashboardPage'
import AgendaPage from './AgendaPage/AgendaPage'
import PhysiciansPage from './PhysiciansPage/PhysiciansPage'
import PatientsPage from './PatientsPage/PatientsPage' */
// import ScriptsPage from './Scripts/ScriptsPage'
/* import RefillsPage from './RefillsPage/RefillsPage'
import TeamPage from './TeamPage/TeamPage'
import ProfilePage from './ProfilePage/ProfilePage'
import ProductsPage from './ProductsPage/ProductsPage' */

// Fallback
import NotFound from '../NotFound/NotFound'

// Restrictions
// import restricted from '../restricted'

const MainRouter = props => (
  <Switch>
    <Redirect
      exact
      from="/"
      to="/dashboard"
    />

    {/* <Route
      path="/dashboard"
      component={DashboardPage}
    />

    <Route
      path="/agenda"
      component={AgendaPage}
    />

    <Route
      path="/physicians"
      component={PhysiciansPage}
    />

    <Route
      path="/patients"
      component={PatientsPage}
    /> */}

    {/* <Route
      path="/scripts"
      component={ScriptsPage}
    /> */}

    {/* <Route
      path="/refills"
      component={restricted(RefillsPage, 'auth', 'admin')}
    />

    <Route
      path="/products"
      component={ProductsPage}
    />

    <Route
      path="/team"
      component={restricted(TeamPage, 'auth', 'admin')}
    />

    <Route
      exact
      path="/profile"
      component={ProfilePage}
    /> */}

    <Route
      component={NotFound}
    />
  </Switch>
)


export default MainRouter
