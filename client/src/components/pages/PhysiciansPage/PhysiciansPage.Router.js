import React from 'react';
import {
  Route,
  Switch,
} from 'react-router-dom'

// Components
import PhysiciansView from './PhysiciansView/PhysiciansView'
import PhysiciansViewRep from './PhysiciansViewRep/PhysiciansViewRep'
import PhysicianView from './PhysicianView/PhysicianView'
import AddPhysician from './AddPhysician/AddPhysician'
import NotFound from '../../NotFound/NotFound'

class PhysiciansPageRouter extends React.Component {

  render() {

    const PhysiciansViewRepPage = (props) => {
      return (
        <PhysiciansViewRep
          state={this.state}
          {...props}
        />
      );
    }
    return (
      <Switch>
        {this.props.props.state.userRole === "Admin" ?
        <Route
          exact
          path="/physicians"
          component={PhysiciansView}
        />
        :
        <Route
          exact path='/physicians'
          component={PhysiciansViewRepPage}
        />
    }

        <Route
          exact
          path="/physicians/add"
          component={AddPhysician}
        />

        <Route
          exact
          path="/physicians/:physicianId"
          component={PhysicianView}
        />

        <Route
          component={NotFound}
        />
      </Switch>
    )
  }
}


export default PhysiciansPageRouter
