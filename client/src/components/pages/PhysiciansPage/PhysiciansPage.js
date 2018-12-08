import React, { Component } from 'react';
import Router from './PhysiciansPage.Router'

import styles from './PhysiciansPage.css'

class PhysiciansPage extends Component {
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

export default PhysiciansPage;
