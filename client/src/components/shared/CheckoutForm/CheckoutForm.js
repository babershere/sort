import React, { Component } from 'react';
import { CardElement, injectStripe } from 'react-stripe-elements';
import axios from 'axios'

import {
  Input,
  Selector,
  FormModal,
} from '../../common'

import styles from './CheckoutForm.css'

class CheckoutForm extends Component {
  constructor(props) {
    super(props);
    this.state = { complete: false };
    this.submit = this.submit.bind(this);
  }

  async submit(ev) {
    ev.preventDefault();
    const loginToken = window.localStorage.getItem("token");
    let token = await this.props.stripe.createToken({name: "Name"});
    console.log(token);
    let data = token;
    axios.post('/charge',
      data, { headers: { "Authorization": "Bearer " + loginToken, "Content-Type": "text/plain"}  })
      .then((data) => {
        console.log(data);
      }).catch((error) => {
        console.error(error);
      })
  }

  componentDidMount() {
    console.log(this.props, this.state);
  }

  render() {
    const {
      content,
      onClickAway,
    } = this.props

    const claimOptions = [
      '-',
      'Patient'
    ]

    if (this.state.complete) return <h1>Purchase Complete</h1>;
    return (
      <FormModal
        title="Charge Credit Card"
        onClickAway={onClickAway}
        visible={!!content}
      // onSubmit={this.onSubmit.bind(this)}
      // className={styles.modal}
      >
        <div className="checkout">
          <p>Would you like to complete the purchase?</p>
          <CardElement />
          <Input
            label="Billing Zip"
          />
          <Selector
            options={claimOptions}
          />
          <button onClick={this.submit}>Send</button>
        </div>
      </FormModal>
    );
  }
}

export default injectStripe(CheckoutForm);