import React, { Component } from 'react';
import { connect } from 'react-redux'
import moment from 'moment'

import {
  formatCurrencyOptions,
  expenseStatusOptions,
  expenseTypeOptions,
} from '../../../../lib'

// Components
import {
  Span,
  Icon,
  Input,
  Selector,
} from '../../../common'

import {
  checkExpense,
  patchExpenseById,
  deleteExpenseById,
  patchExpenseStatus,
} from '../../../../actions/expenses'

import styles from './ExpenseRow.css'

class ExpenseRow extends Component {
  constructor(props) {
    super(props)
    this.state = this.initialState
  }

  get initialState() {
    const {
      note,
      amount,
      type,
    } = this.props.expense

    return {
      editing: false,
      note,
      amount,
      type,
    }
  }

  get formIsInvalid() {
    const {
      amount,
      type,
    } = this.state

    return !(
      amount
      && type
    )
  }

  setEditState(editing) {
    this.setState({
      ...this.initialState,
      editing,
    })
  }

  save() {
    if (this.formIsInvalid) {
      return
    }

    const {
      type,
      note,
    } = this.state

    const update = {
      amount: Number(this.state.amount),
      type,
      note,
    }

    const { id } = this.props.expense

    this.props.patchExpenseById(id, update)
    this.setState({ editing: false })
  }

  delete() {
    const message = `Are you sure you want to delete this receipt?`
    const confirmed = window.confirm(message)
    if (!confirmed) {
      return
    }

    const { id } = this.props.expense

    this.props.deleteExpenseById(id)
  }

  renderIcons() {
    const { editing } = this.state
    const { isAdmin } = this.props
    if (isAdmin) {
      return null
    } else if (editing) {
      return (
        <td className="icons">
          <Icon
            small
            cancel
            onClick={() => this.setEditState(false)}
          />
          <Icon
            small
            save
            onClick={() => this.save()}
          />
        </td>
      )
    } else {
      return (
        <td className="icons">
          <Icon
            small
            edit
            onClick={() => this.setEditState(true)}
          />
          <Icon
            small
            cancel
            onClick={() => this.delete()}
          />
        </td>
      )
    }
  }

  setExpenseStatus(status) {
    const { expense } = this.props
    const { userId } = expense
    const expenseId = expense.id
    this.props.patchExpenseStatus({ userId, expenseId, status })
  }

  renderPhotoLink(photo, index) {
    return (
      <a
        className="photo-link"
        href={photo.url}
        target="_blank"
        rel="noopener noreferrer"
        key={photo.id}
      >
        Photo {index + 1}
      </a>
    )
  }

  render() {
    const {
      expense,
      isAdmin,
      checked,
    } = this.props

    const {
      created_at,
      photos,
      status,
    } = expense

    const date = moment(created_at).format('MM/DD/YYYY')

    const {
      editing,
      amount,
      type,
      note,
    } = this.state

    return (
      <tr className={styles.row}>
        {isAdmin && (
          <td className="checkbox">
            <Input
              type="checkbox"
              className="checkbox"
              value={checked}
              onChange={() => this.props.checkExpense(expense)}
            />
          </td>
        )}
        <td>
          <Span icon="calendar" >
            {date}
          </Span>
        </td>
        <td>
          {editing ? (
            <Selector
              options={expenseTypeOptions}
              selected={type}
              onSelect={type => this.setState({ type })}
            />
          ) : (
            expense.type
          )}
        </td>
        <td>
          <Span
            editing={editing}
            value={amount}
            type="number"
            onChange={amount => this.setState({ amount })}
          >
            {expense.amount.toLocaleString(...formatCurrencyOptions)}
          </Span>
        </td>

        <td className="photos">
          {photos && photos.length ? (
            photos.map(this.renderPhotoLink.bind(this))
          ) : (
            'No Photos'
          )}
        </td>

        <td>
          <Span
            editing={editing}
            value={note}
            placeholder="Note"
            onChange={note => this.setState({ note })}
          >
            {expense.note}
          </Span>
        </td>
        <td>
          {isAdmin ? (
            <Selector
              options={expenseStatusOptions}
              selected={status}
              onSelect={this.setExpenseStatus.bind(this)}
            />
          ) : (
            status
          )}
        </td>

        {this.renderIcons()}
      </tr>
    )
  }
}

const mapStateToProps = ({ auth }) => {
  const {
    isAdmin,
  } = auth

  return {
    isAdmin,
  }
}

const actions = {
  checkExpense,
  patchExpenseById,
  deleteExpenseById,
  patchExpenseStatus,
}

export default connect(mapStateToProps, actions)(ExpenseRow)
