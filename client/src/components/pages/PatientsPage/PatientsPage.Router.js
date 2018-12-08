import React from 'react';
import {
  Route,
  Switch,
} from 'react-router-dom'

// Components
import PatientsView from './PatientsView/PatientsView'
import PatientsViewPhysician from './PatientsView_Physician/PatientsViewPhysician'
import PatientView from './PatientView/PatientView'
import PatientViewPhysician from './PatientView_Physician/PatientViewPhysician'

import AddPatient from './AddPatient/AddPatient'
import NotFound from '../../NotFound/NotFound'


class PatientsPageRouter extends React.Component {

  render() {

    console.log(this.props.props.state.userRole);

    const PatientsViewPhysicianPage = (props) => {
      return (
        <PatientsViewPhysician
          state={this.state}
          {...props}
        />
      );
    }
    return (

      <Switch>
        {this.props.props.state.userRole === "Admin" || this.props.props.state.userRole === "Rep" ?
          <Route
            exact
            path="/patients"
            component={PatientsView}
          />
          :
          <Route
            exact
            path="/patients"
            render={PatientsViewPhysicianPage}
          />
        }


        <Route
          exact
          path="/patients/add"
          component={AddPatient}
        />


        <Route
          exact
          path="/patients/:patientId"
          component={PatientView}
        />

        <Route
          exact
          path="/patients/:patientId"
          component={PatientViewPhysician}
        />

        <Route
          component={NotFound}
        />
      </Switch>
    )

  }
}

export default PatientsPageRouter;
