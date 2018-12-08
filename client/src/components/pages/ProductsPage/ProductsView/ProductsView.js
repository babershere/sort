
import React, { Component } from 'react';

import axios from 'axios'
import { TablePagination } from 'react-pagination-table';

import {
  Header,
  ActionBox,
  Button,
  Input,
  Table,
  SearchBar
} from '../../../common'


import styles from './ProductsView.css'

const th = ['NAME','NDC','SCHEDULE','PACKAGE SIZE','QUANTITY','COST','VALUE']

class ProductsView extends Component {

  constructor(props) {
    super(props)
    this.state = {
      products: ''
    }
  }

  

  componentDidMount() {
    const loginToken = window.localStorage.getItem("token");
    axios.get('/api/products/search/', { headers: { "Authorization": "Bearer " + loginToken } })
      .then((resp) => {
        console.log(resp);

        this.setState({
          products: resp.data.response
        })

      }).catch((err) => {
        console.error(err)
      })
  }

  searchQuery() {
    const loginToken = window.localStorage.getItem("token");
    axios.get('/api/products/search?search=' + this.state.search, { headers: { "Authorization": "Bearer " + loginToken } })
      .then((resp) => {
        console.log(resp);

        this.setState({
          products: resp.data.response
        })

      }).catch((err) => {
        console.error(err)
      })
  }

  enterPressed(event) {
    var code = event.keyCode || event.which;
    if (code === 13) { //13 is the enter keycode
      this.searchQuery();
    } 
  }




  renderTableHead() {
    return (
      <thead>
        <tr>
          <th>
            NAME
          </th>
          <th>
            NDC
          </th>
          <th>
            SCHEDULE
          </th>
          <th>
            PACKAGE SIZE
          </th>
          <th>
            QUANTITY
          </th>
          <th>
            COST
          </th>
          <th>
            VALUE
          </th>
          <th>ACTIONS</th>
        </tr>
      </thead>
    )
  }

  renderTableBody() {

    return (
      <tbody>
        {this.state.products.map(this.renderTableRow.bind(this))}
      </tbody>
    )
  }

  handleClick(value) {
    window.location = `/products/${value}/edit`
  }

  renderTableRow(product) {
    return (
      <tr value={product.id} onClick={() => this.handleClick(product.id)}>
        <td>{product.name}</td>
        <td>{product.NDC}</td>
        <td>{product.schedule}</td>
        <td>{product.packageSize}</td>
        <td>{product.quantity}</td>
        <td>{product.cost}</td>
        <td></td>
        <td>
          {/* <Button
            title="edit"
            styes={{ backgroundColor:"orange" }}
          /> */}

        </td>
      

      </tr>
    )
  }

  renderTable() {
    return (
      <Table>
        {this.renderTableHead()}
        {this.renderTableBody()}
      </Table>
    )
  }

  render() {

    if (this.state.products) {

      var productList = this.state.products.map(function (item, i) {
        return (
          <div key={i}>

          </div>
        )

      })
    }
    else {
      return <div>
        <p></p>
      </div>
    }

    return (
      <div className={styles.app}>

        <Header>

          <h2>
            Products
          </h2>

          <div className="action">

            <Button
              icon="plus"
              title="ADD A NEW PRODUCT"
              style={{ marginRight: 14 }}
              link="products/add"
            />

        </div>

        </Header>
        <div className="body">

          <ActionBox className='productSearch'>
            <div className="main" style={{paddingTop: 0}}>

              <Input
                label="Search"
                placeholder="Product name or NDC..."
                value={this.state.search}
                onChange={search => this.setState({ search })}
                onKeyPress={this.enterPressed.bind(this)}
                style={{'width': '100%'}}
              />
              <Button
                search
                icon="search"
                title="SEARCH"
                onClick={this.searchQuery.bind(this)}
                style={{marginTop: 30, height: 38, lineHeight: '1px'}}
              />

            </div>

          </ActionBox>

          {/* <TablePagination
            headers={ th }
            data={this.state.products}
            columns="name.NDC.schedule.packageSize.quantity.cost.value"
            perPageItemCount={ 10 }
            totalCount={ this.state.products.length }
            // arrayOption={ [["size", 'all', ' ']] }
        /> */}

          {this.renderTable()}
          {productList}

        </div>

      </div>
    );
  }
}

export default ProductsView;
