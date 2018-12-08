import React from 'react';
import {
  Route,
  Switch
} from 'react-router-dom'

// Components
import ProductsView from './ProductsView/ProductsView'
import NotFound from '../../NotFound/NotFound'

const ProductsPageRouter = props => (
  <Switch>
    <Route
      exact
      path="/products"
      component={ProductsView}
    />
    <Route
      component={NotFound}
    />
  </Switch>
)


export default ProductsPageRouter
