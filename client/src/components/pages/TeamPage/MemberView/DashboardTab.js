import React, { Component } from 'react';
import { connect } from 'react-redux'

import {
  expenseStatusOptions,
  formatCurrencyOptions,
} from '../../../../lib'

// Components
import {
  Header,
  Button,
  Selector,
  SummaryItem,
} from '../../../common'

import {
  ExpensesTable,
  SummaryRow,
} from '../../../shared'

import {
  filterExpensesByStatus,
  bulkPatchExpenses,
} from '../../../../actions/expenses'

import styles from './DashboardTab.css'

class DashboardTab extends Component {
  constructor(props) {
    super(props)
    const bulkAction = expenseStatusOptions[0].value
    this.state = {
      statusFilter: '',
      bulkAction,
    }
  }

  filterExpensesByStatus(statusFilter) {
    this.setState({ statusFilter })
    this.props.filterExpensesByStatus(statusFilter)
  }

  bulkUpdate(status) {
    const expenseIds = this.props.checkedExpenses
    const userId = this.props.user.id
    const update = {
      expenseIds,
      userId,
      status,
    }
    const confirmed = window.confirm(`update ${expenseIds.length} expense(s) to ${status}?`)
    if (confirmed) {
      this.props.bulkPatchExpenses(update)
    }
  }

  render() {
    const {
      bulkAction,
      statusFilter,
    } = this.state

    const {
      checkedExpenses,
    } = this.props

    const statusOptions = [
      {
        value: '',
        display: 'All',
      },
      ...expenseStatusOptions,
    ]

    const {
      user,
      expensesDisplay,
    } = this.props

    const expensesTotal = expensesDisplay
      .map(el => el.amount)
      .reduce((acc, curr) => acc + curr, 0)
      .toLocaleString(...formatCurrencyOptions)

    return (
      <div className={styles.dashboardTab}>
        <SummaryRow user={user} />
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
                onSelect={this.filterExpensesByStatus.bind(this)}
              />
            </div>
            <div>
              <Selector
                label="Bulk Action"
                options={expenseStatusOptions}
                selected={bulkAction}
                onSelect={bulkAction => this.setState({ bulkAction })}
              />
              <Button
                inactive={!checkedExpenses.length}
                title="APPLY"
                onClick={() => this.bulkUpdate(bulkAction)}
              />
              <SummaryItem
                small
                title="Total"
                content={expensesTotal}
              />
            </div>
          </div>

          <ExpensesTable />
        </div>
      </div>
    )
  }
}

const mapStateToProps = ({ team, expense }) => {
  const {
    user,
  } = team

  const {
    checkedExpenses,
    expensesDisplay,
  } = expense

  return {
    user,
    expensesDisplay,
    checkedExpenses,
  }
}

const actions = {
  filterExpensesByStatus,
  bulkPatchExpenses,
}

export default connect(mapStateToProps, actions)(DashboardTab);
