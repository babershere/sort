// React
import React from 'react';

// Components
import {
  Link,
} from '../common'

// Styles
import styles from './NotFound.css'

const NotFound = props => (
  <div className={styles.body}>
    <h1>404 Not found!</h1>
    <Link to="/">Go Home</Link>
  </div>

)


export default NotFound
