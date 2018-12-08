import React, { Component } from 'react';
import { connect } from 'react-redux'

import { hasAuthTokenAsync, expenseStatusOptions } from '../../../../lib'

// Components
import {
  Header,
  Button,
  Selector,
} from '../../../common'

import {
  ExpensesTable,
  SummaryRow,
} from '../../../shared'

import {
  getExpenses,
  filterExpensesByStatus,
} from '../../../../actions/expenses'

import styles from './RepDashboard.css'

class RepDashboard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      statusFilter: '',
    }
  }

  componentDidMount() {
    hasAuthTokenAsync()
      .then(() => {
        this.props.getExpenses()
      })
      .catch(console.error)
  }

  filterByStatus(statusFilter) {
    this.setState({ statusFilter })
    this.props.filterExpensesByStatus(statusFilter)
  }

  render() {
    const {
      statusFilter,
    } = this.state

    const statusOptions = [
      {
        value: '',
        display: 'All',
      },
      ...expenseStatusOptions,
    ]

    return (
      <div className={styles.body}>
        <SummaryRow user={this.props.user} />
        <br />
        <div className="expenses">
          <Header>
            <h2>
              Receipts
            </h2>
          </Header>
          <div className="actions">
            <div>
              <Selector
                label="View Status"
                options={statusOptions}
                selected={statusFilter}
                onSelect={this.filterByStatus.bind(this)}
              />
            </div>
            <div>
              <Button
                icon="plus"
                title="ADD A NEW RECEIPT"
                link="/dashboard/add-expense"
              />
            </div>
          </div>

          <ExpensesTable />
        </div>
      </div>
    )
  }
}

const mapStateToProps = ({ team }) => {
  const {
    user,
  } = team

  return {
    user,
  }
}

const actions = {
  getExpenses,
  filterExpensesByStatus,
}

export default connect(mapStateToProps, actions)(RepDashboard);
