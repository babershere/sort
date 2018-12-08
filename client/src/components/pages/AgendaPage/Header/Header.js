import React, { Component } from 'react';
import { connect } from 'react-redux'

// 3rd party
import calendarJs from 'calendar-js'

// Components
import {
  Icon,
  Button,
  Selector,
} from '../../../common'

import styles from './Header.css'

class Header extends Component {
  setMonth(inc) {
    const { month, year } = this.props
    const next = month + inc
    const update = {}
    if (next > 11) {
      update.month = 0
      update.year = year + 1
    } else if (next < 0) {
      update.month = 11
      update.year = year - 1
    } else {
      update.month = next
    }
    this.props.onMonthChange(update)
  }

  renderSelect() {
    const {
      reps,
      onRepChange,
      selectedRepId,
    } = this.props

    const repOptions = [
      {
        key: 0,
        value: '',
        display: 'View All',
      },
      ...reps.map(rep => ({
        key: rep.id,
        value: rep.value,
        display: rep.nameDisplay,
      })),
    ]

    return (
      <Selector
        selected={selectedRepId}
        options={repOptions}
        onSelect={onRepChange}
      />
    )
  }

  render() {
    const {
      year,
      month,
      onViewModal,
    } = this.props

    const calendar = calendarJs().of(year, month)
    return (
      <div className={styles.header}>
        {this.renderSelect()}
        <div className="month">
          <Icon
            name="angle-left"
            onClick={() => this.setMonth(-1)}
          />
          <span className="display">
            {calendar.month} {calendar.year}
          </span>
          <Icon
            name="angle-right"
            onClick={() => this.setMonth(1)}
          />
        </div>
        <div className="button">
          <Button
            icon="plus"
            title="SCHEDULE A NEW VISIT"
            onClick={onViewModal}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = props => {
  return {}
}

const actions = {
}

export default connect(mapStateToProps, actions)(Header);
