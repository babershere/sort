import React from 'react';
import { connect } from 'react-redux'

import {
  Selector,
  Span,
} from '../../../common'

const MiscInfo = props => {
  const {
    physician,
    className,
    editing,
    state,
    onChange,
    reps,
  } = props

  const {
    repId,
    pointOfContact,
    npi,
    dea,
  } = state

  const repOptions = [
    {
      value: '',
      display: 'Select Rep',
    },
    ...reps.map(rep => ({
      value: rep.id,
      display: rep.nameDisplay,
    }))
  ]

  // TODO: Figure out revenue
  const revenue = 8562

  return (
    <div className={className}>
      <div className="grid">
        <div className="item">
          <label>
            Physician's NPI
          </label>
          <Span
            placeholder="Physician's NPI"
            editing={editing}
            value={npi}
            onChange={npi => onChange({ npi })}
          >
            {physician.npi || 'None'}
          </Span>
        </div>
        <div className="item">
          <label>
            Physician's DEA
          </label>
          <Span
            placeholder="Physician's DEA"
            editing={editing}
            value={dea}
            onChange={dea => onChange({ dea })}
          >
            {physician.dea || 'None'}
          </Span>
        </div>
        <div className="item">
          <label>
            Sales Rep
          </label>
          {editing ? (
            <Selector
              options={repOptions}
              value={repId}
              onSelect={repId => onChange({ repId })}
            />
          ) : (
            <Span>
              {physician.rep ? physician.rep.nameDisplay : 'Unassigned'}
            </Span>
          )}
        </div>
        <div className="item">
          <label>
            Point of Contact
          </label>
          <Span
            placeholder="Point of Contact"
            editing={editing}
            value={pointOfContact}
            onChange={pointOfContact => onChange({ pointOfContact })}
          >
            {physician.pointOfContact || 'None'}
          </Span>
        </div>
      </div>
      <div className="revenue">
        <label>
          Physician's Revenue
        </label>
        <span className="amount">
          ${revenue}
        </span>
      </div>
    </div>
  )
}

const mapStateToProps = ({ main }) => {
  return {
    reps: main.reps,
  }
}

export default connect(mapStateToProps, null)(MiscInfo);
