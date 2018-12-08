import React from 'react';

import {
  Button,
} from '../../common'

import styles from './AddressLine.css'

const AddressLine = props => {
  const {
    editing,
    state,
    onChange,
    address,
  } = props

  // Default view. Simple span
  if (!editing) {
    return (
      <span>{address ? address.display : 'No address...'}</span>
    )
  }

  // If address is null
  if (!state.address) {
    return (
      <Button
        text
        confirm
        title="Add Address"
        onClick={() => onChange({ addressModal: {} })}
      />
    )
  }

  // If editing an address
  return (
    <div className={styles.line}>
      <span>
        {state.address.display}
      </span>

      <Button
        text
        confirm
        title="Edit Address"
        onClick={() => onChange({ addressModal: address })}
      />

      <Button
        text
        danger
        title="Clear Address"
        onClick={() => onChange({address: null})}
      />
    </div>
  )
}

export default AddressLine;
