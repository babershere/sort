import React, { Component } from 'react';
import { connect } from 'react-redux'
// import validator from 'validator'

import axios from 'axios'

import {
  Selector,
  Button,
  Header,
  Body,
  Input,
  Form,
} from '../../../common'

// Actions
import {
  createTeamMember,
} from '../../../../actions/team'

import styles from './AddProduct.css'

class EditProduct extends Component {
  constructor(props) {
    super(props)
    this.state = {
        product: '', name: '', NDC: '', quantity: '', packageSize: '', cost: '', schedule: '', dosage: '', form: '', unitMeasure: '', type: '', refrigerated: false, active: false
    }
  }

  componentWillMount() {
    const loginToken = window.localStorage.getItem("token");
    axios.get('/api/products/search?productId=' + this.props.match.params.productId, { headers: { "Authorization": "Bearer " + loginToken } })
      .then((resp) => {
          console.log(resp)
        let product = resp.data.response[0]
        this.setState({
          name: product.name,
          NDC: product.NDC,
          quantity: product.quantity,
          packageSize: product.packageSize,
          cost: product.cost, 
          schedule: product.schedule,
          dosage: product.dosage,
          form: product.form,
          unitMeasure: product.unitMeasure,
          type: product.type,
          refrigerated: product.refrigerated,
          active: product.active
        })

      }).catch((err) => {
        console.error(err)
      })
  }
  

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  handleCheckbox(event) {
    const target = event.target
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });

  }

  onChangeHandler = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  handleSubmit(e) {
    e.preventDefault()
    console.log(this.state)
    const loginToken = window.localStorage.getItem("token");
    let data = new FormData();
    axios.put('/api/products/update?id=' + this.props.match.params.productId + '&name=' + this.state.name + '&NDC=' + this.state.NDC + '&schedule=' + this.state.schedule + '&dosage=' + this.state.dosage +
    '&form=' + this.state.form + '&unitMeasure=' + this.state.unitMeasure + '&packageSize=' + this.state.packageSize + '&quantity=' + this.state.quantity + '&cost=' + this.state.cost
    + '&refrigerated=' + this.state.refrigerated + '&type=' + this.state.type + '&active=' + this.state.active,
      data, { headers: { "Authorization": "Bearer " + loginToken } })
      .then((data) => {
        window.location.reload();
      }).catch((error) => {
        console.error(error);
      })
    } 

  render() {

    const scheduleOptions = [
        '-',
        'C1',
        'C2',
        'C3',
        'C4',
        'C5'
    ]

    return (
      <div className='addMember'>
        <Header>
          <h2>Edit Product</h2>
          <div className='action'>
            <Button
              large
              cancel
              link="/products"
              title="CANCEL"
              style={{ marginRight: 10 }}
            />
            <Button
              onClick={this.handleSubmit.bind(this)}
              title="SAVE"
              className="submit btn btn-default"
              type="submit"
              value="Submit"
              style={{ marginRight: 8 }}
            />
          </div>
        </Header>
        <Body className={styles.body}>
          <Form
            className="form"
            onSubmit={this.handleSubmit.bind(this)}
          >
            <Input
              label='Name'
              placeholder={this.state.name}
              value={this.state.name}
              onChange={name => this.setState({ name })}
            />
           
            <Input
              label="NDC"
              placeholder={this.state.NDC}
              value={this.state.NDC}
              onChange={NDC => this.setState({ NDC })}
            />

            <label>Schedule</label>
            <Selector
              options={scheduleOptions}
              selected={this.state.schedule}
              value={this.state.schedule}
              onSelect={schedule => this.setState({ schedule })}
            />

            <Input
              label='Dosage'
              placeholder={this.state.dosage}
              value={this.state.dosage}
              onChange={dosage => this.setState({ dosage })}
            />

            <Input
              label='Form'
              placeholder={this.state.form}
              value={this.state.form}
              onChange={form => this.setState({ form })}
            />
        
            <Input
              label="Unit of Measure"
              placeholder={this.state.unitMeasure}
              value={this.state.unitMeasure}
              onChange={unitMeasure => this.setState({ unitMeasure })}
            />

            <Input
              label="Package Size"
              placeholder={this.state.packageSize}
              value={this.state.packageSize}
              onChange={packageSize => this.setState({ packageSize })}
            />

            <Input
              label="Quantity"
              placeholder={this.state.quantity}
              value={this.state.quantity}
              onChange={quantity => this.setState({ quantity })}
            />

            <Input
              label="Cost"
              placeholder={this.state.cost}
              value={this.state.cost}
              onChange={cost => this.setState({ cost })}
            />

            <div className='check'>
              <input
                type="checkbox"
                name="refrigerated"
                checked={this.state.refrigerated}
                onChange={this.handleCheckbox.bind(this)}
              />
              <label>Refrigerated</label>
            </div>

            <Input
              label="Type"
              value={this.state.type}
              onChange={type => this.setState({ type })}
            />

            <div className='check'>
              <input
                type="checkbox"
                name="active"
                checked={this.state.active}
                onChange={this.handleCheckbox.bind(this)}
              />
              <label>Active</label>
            </div>

          </Form>
        </Body>
      </div >
    );
  }
}

const mapStateToProps = ({ main }) => {
  const {
    loading,
  } = main

  return {
    loading,
  }
}

const actions = {
  createTeamMember,
}

export default connect(mapStateToProps, actions)(EditProduct)
