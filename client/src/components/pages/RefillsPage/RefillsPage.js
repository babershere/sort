import React, { Component } from 'react';
import Router from './RefillsPage.Router'

import styles from './RefillsPage.css'

class RefillsPage extends Component {
  render() {
    return (
      <div className={styles.app}>
        <Router />
      </div>
    );
  }
}

export default RefillsPage;
