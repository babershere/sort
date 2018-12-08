import React from 'react';
import {
  Route,
  Switch,
} from 'react-router-dom'

// Components
import TeamView from './TeamView/TeamView'
import TeamViewRep from './TeamViewRep/TeamViewRep'
import AddMember from './AddMember/AddMember'
import MemberView from './MemberView/MemberView'
import NotFound from '../../NotFound/NotFound'

class TeamPageRouter extends React.Component {
  render() {

    const TeamViewRepPage = (props) => {
      return (
        <TeamViewRep
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
            path="/team"
            component={TeamView}
          />
          :
          <Route
            exact
            path="/team"
            component={TeamViewRepPage}
          />
        }

        <Route
          exact
          path="/team/add"
          component={AddMember}
        />

        <Route
          exact
          path="/team/:memberId"
          component={MemberView}
        />

        <Route
          component={NotFound}
        />
      </Switch>
    )
  }
}


export default TeamPageRouter
