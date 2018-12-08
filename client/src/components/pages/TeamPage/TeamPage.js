import React, { Component } from 'react';
import Router from './TeamPage.Router'
// import TeamView from './TeamView/TeamView'
// import DashboardTab from './MemberView/DashboardTab'

import styles from './TeamPage.css'

class TeamPage extends Component {
  render() {
    return (
      <div className={styles.app}>
        <Router
          props={this.props}
        />
      </div>
    );
  }
}

export default TeamPage;
