import React, { Component } from 'react';
import { connect } from 'react-redux'

// Components
import {
  Table,
} from '../../common'

import ExpenseRow from './ExpenseRow/ExpenseRow'

import styles from './ExpensesTable.css'

class ExpensesTable extends Component {
  renderTableHead() {
    const { isAdmin } = this.props
    return (
      <thead>
        <tr>
          {isAdmin && (
            <th />
          )}
          <th>
            Date
          </th>
          <th>
            Type
          </th>
          <th>
            Amount
          </th>
          <th>
            Photos
          </th>
          <th>
            Note
          </th>
          <th>
            Status
          </th>
          {!isAdmin && (
            <th />
          )}
        </tr>
      </thead>
    )
  }

  renderTableBody() {
    const { expenses, checkedExpenses } = this.props
    if (!expenses.length) {
      return (
        <tbody>
          <tr>
            <td colSpan="7" className="empty">
              No Receipts Found
            </td>
          </tr>
        </tbody>
      )
    } else {
      return (
        <tbody>
          {expenses.map(expense => (
            <ExpenseRow
              key={expense.id}
              expense={expense}
              checked={checkedExpenses.includes(expense.id)}
            />
          ))}
        </tbody>
      )
    }
  }

  render() {
    return (
      <Table className={styles.table}>
        {this.renderTableHead()}
        {this.renderTableBody()}
      </Table>
    )
  }
}

const mapStateToProps = ({ expense, auth }) => {
  const {
    isAdmin,
  } = auth

  const {
    checkedExpenses,
    expensesDisplay,
  } = expense

  return {
    isAdmin,
    expenses: expensesDisplay,
    checkedExpenses,
  }
}

export default connect(mapStateToProps, null)(ExpensesTable)
