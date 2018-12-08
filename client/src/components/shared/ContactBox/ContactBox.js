import React from 'react';
import FontAwesome from 'react-fontawesome'

import { AsYouType } from '../../../lib/phoneHelper'

import {
  Span,
} from '../../common'

import {
  AddressLine,
} from '../../shared'

import styles from './ContactBox.css'

const ContactBox = props => {
  const {
    phone,
    fax,
    address,
    editing,
    state,
    onChange,
  } = props

  const handlePhoneChange = (type, val) => {
    if (val.length > 14) {
      return
    }

    const phone = new AsYouType('US').input(val)

    onChange({ [type]: phone })
  }

  return (
    <div className={styles.contactBox}>
      <div>
        <FontAwesome name="phone" />
        <Span
          editing={editing}
          placeholder="xxx xxx xxxx"
          value={state.phone}
          onChange={phone => handlePhoneChange('phone', phone)}
        >
          {phone || 'None'}
        </Span>
      </div>
      <div>
        <FontAwesome name="fax" />
        <Span
          editing={editing}
          placeholder="xxx xxx xxxx"
          value={state.fax}
          onChange={phone => handlePhoneChange('fax', phone)}
        >
          {fax || 'None'}
        </Span>
      </div>
      <div>
        <FontAwesome name="building" />
        <AddressLine
          editing={editing}
          state={state}
          address={address}
          onChange={onChange}
        />
      </div>
    </div>
  )
}

export default ContactBox;
