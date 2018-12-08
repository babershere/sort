import React, { Component } from 'react';
import Router from './PatientsPage.Router'

import styles from './PatientsPage.css'

class PatientsPage extends Component {
  render() {
console.log(this.props, this.state);
    return (
      <div className={styles.app}>
        <Router
          props={this.props}
        />
      </div>
    );
  }
}

export default PatientsPage;
