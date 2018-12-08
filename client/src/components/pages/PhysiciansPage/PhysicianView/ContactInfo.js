import React from 'react';

import {
  Span,
  Input,
} from '../../../common'

import {
  ContactBox,
} from '../../../shared'

const ContactInfo = ({ physician, className, editing, onChange, state }) => {
  const {
    nameDisplay,
    phoneDisplay,
    faxDisplay,
    address,
  } = physician

  const {
    firstName,
    lastName,
    group,
    specialty,
  } = state
  

  return (
    <div className={className}>
      <div className="name">
        {editing ? (
          <div className="name">
            Name:
            <Input
              placeholder="First Name"
              value={firstName}
              onChange={firstName => onChange({ firstName })}
            />
            <Input
              placeholder="Last Name"
              value={lastName}
              onChange={lastName => onChange({ lastName })}
            />
          </div>
        ) : (
          <div>
            Name: {nameDisplay}
          </div>
        )}

        <div>
          Group:
          <Span
            editing={editing}
            placeholder="Group"
            value={group}
            onChange={group => onChange({ group })}
          >
            {physician.group || 'No group set...'}
          </Span>
        </div>
        <div>
          Specialty:
          <Span
            editing={editing}
            placeholder="Specialty"
            value={specialty}
            onChange={specialty => onChange({ specialty })}
          >
            {physician.specialty || 'No specialty set...'}
          </Span>
        </div>
      </div>

      <ContactBox
        editing={editing}
        phone={phoneDisplay}
        fax={faxDisplay}
        address={address}
        state={state}
        onChange={onChange}
      />
    </div>
  )
}

export default ContactInfo;
