import React, { Component } from 'react';
import Router from './ScriptsPage.Router'

import styles from './ScriptsPage.css'

class ScriptsPage extends Component {
  render() {
    return (
      <div className={styles.app}>
        <Router />       
      </div>
    );
  }
}

export default ScriptsPage;
