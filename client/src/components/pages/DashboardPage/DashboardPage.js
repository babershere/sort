import React, { Component } from 'react';
import Router from './DashboardPage.Router'

import styles from './DashboardPage.css'

class DashboardPage extends Component {
  render() {
    return (
      <div className={styles.app}>
        <Router />
      </div>
    );
  }
}

export default DashboardPage;
