import React, { Component } from 'react';
import Router from './ProductsPage.Router'

import styles from './ProductsPage.scss'

class ProductsPage extends Component {
  render() {
    return (
      <div className={styles.app}>
        <Router />
      </div>
    );
  }
}

export default ProductsPage;
