// React
import React from 'react';

import TitleBar from './TitleBar/TitleBar'
import NavBar from './NavBar/NavBar'

import 'react-spinner/react-spinner.css'
import styles from './TopNav.css'

export default () => (
  <div className={styles.topNav}>
    <TitleBar />
    <NavBar />
  </div>
)
