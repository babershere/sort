import React, { Component } from 'react';

import { stringifyAddress, statesArray } from '../../../lib'

// Components
import {
  Input,
  Button,
  Selector,
  FormModal,
} from '../../common'

import styles from './AddressModal.css'

class AddressModal extends Component {
  constructor(props) {
    super(props)
    this.state = this.initialState
  }

  get initialState() {
    const initialState = {
      street1: '',
      street2: '',
      city: '',
      state: '',
      zip: '',
    }

    return initialState
  }

  static getDerivedStateFromProps(newProps) {
    return newProps.content || null
  }

  get inactive() {
    const {
      street1,
      city,
      state,
      zip,
    } = this.state

    return !(
      street1
      && city
      && state
      && zip
    )
  }

  close() {
    this.props.onClickAway()
    this.setState({ ...this.initialState })
  }

  submit(e) {
    e.preventDefault()
    if (this.invalid) {
      return
    }

    const {
      street1,
      street2,
      city,
      state,
      zip,
    } = this.state

    const data = {
      street1,
      street2,
      city,
      state,
      zip,
    }

    data.display = stringifyAddress(data)

    this.props.onSubmit(data)
    this.close()
  }

  render() {
    const {
      content,
    } = this.props

    const {
      street1,
      street2,
      city,
      state,
      zip,
    } = this.state

    const stateOptions = [
      {
        value: '',
        display: 'State',
      },
      ...statesArray,
    ]

    return (
      <FormModal
        title="Enter Address"
        onClickAway={() => this.close()}
        visible={!!content}
        onSubmit={this.submit.bind(this)}
        className={styles.modal}
      >
        {/* Address */}
        <label>
          Address
        </label>
        <Input
          placeholder="Address Line 1"
          value={street1}
          onChange={street1 => this.setState({ street1 })}
        />
        <Input
          placeholder="Address Line 2"
          value={street2}
          onChange={street2 => this.setState({ street2 })}
        />
        <div className="line">
          <Input
            placeholder="City"
            value={city}
            onChange={city => this.setState({ city })}
          />

          <Selector
            options={stateOptions}
            value={state}
            onSelect={state => this.setState({ state })}
          />

          <Input
            placeholder="Zip Code"
            value={zip}
            onChange={zip => this.setState({ zip })}
          />
        </div>

        <br />

        <div className="buttons">
          <Button
            large
            cancel
            type="button"
            title="Cancel"
            onClick={() => this.close()}
          />
          <Button
            large
            inactive={this.inactive}
            type="submit"
            title="Confirm"
          />
        </div>
      </FormModal>
    )
  }
}

export default AddressModal
