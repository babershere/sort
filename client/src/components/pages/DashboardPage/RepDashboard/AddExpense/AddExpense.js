import React, { Component } from 'react';
import { connect } from 'react-redux'

import { expenseTypeOptions } from '../../../../../lib'

import {
  Selector,
  Button,
  Header,
  Body,
  Input,
  Form,
  FileUpload,
  Icon,
} from '../../../../common'

// Actions
import {
  clearPhotos,
  removePhoto,
  createExpense,
  uploadExpensePhoto,
} from '../../../../../actions/expenses'

import styles from './AddExpense.css'

class AddMember extends Component {
  constructor(props) {
    super(props)
    this.state = {
      type: '',
      amount: 0,
      note: '',
    }
  }

  componentDidMount() {
    this.props.clearPhotos()
  }

  componentWillUnmount() {
    this.props.clearPhotos()
  }

  onSubmit(e) {
    e.preventDefault()
    if (this.formIsInvalid) {
      return
    }

    const {
      type,
      amount,
      note,
    } = this.state

    const {
      photos,
    } = this.props

    const data = {
      type,
      amount: Number(amount),
      note,
      photoIds: photos.map(el => el.id),
    }

    this.props.createExpense(data)
  }

  addPhoto(file) {
    if (file) {
      this.props.uploadExpensePhoto(file)
    }
  }

  get formIsInvalid() {
    const {
      type,
      amount,
    } = this.state

    return !(
      type
      && amount
    )
  }

  renderPhotoItem(photo) {
    return (
      <div
        key={photo.id}
        className="photo"
      >
        <span className="photo">
          {photo.name}
        </span>
        <Icon
          small
          button
          cancel
          onClick={() => this.props.removePhoto(photo)}
        />
      </div>
    )
  }

  render() {
    const {
      type,
      amount,
      note,
    } = this.state

    const {
      photos,
      loading,
      progress,
    } = this.props

    const typeOptions = [
      {
        value: '',
        display: 'Select Type...'
      },
      ...expenseTypeOptions,
    ]

    return (
      <div className={styles.body}>
        <Header>
          <h3>Add a New Expense</h3>
        </Header>
        <Body className={styles.body}>
          <Form
            className="form"
            onSubmit={this.onSubmit.bind(this)}
          >
            <label>
              Type:
            </label>
            <Selector
              wide
              selected={type}
              options={typeOptions}
              onSelect={type => this.setState({ type })}
            />

            <br />

            <label>
              Amount:
            </label>
            <Input
              type="number"
              value={amount}
              onChange={amount => this.setState({ amount })}
            />

            <br />

            <label>
              Note:
            </label>
            <Input
              placeholder="Add a note..."
              value={note}
              onChange={note => this.setState({ note })}
            />

            <br />

            <label>
              Photos:
            </label>

            <div className={styles.photoList}>
              {photos.length ? (
                photos.map(this.renderPhotoItem.bind(this))
              ) : (
                <span>
                  None
                </span>
              )}
            </div>

            <FileUpload
              id="add-expense"
              wide
              large
              confirm
              title="ADD A PHOTO"
              icon="camera"
              inactive={loading}
              onUpload={this.addPhoto.bind(this)}
              progress={progress}
            />

            <br />

            <div className="buttons">
              <Button
                large
                cancel
                link="/dashboard"
                title="CANCEL"
              />
              <Button
                large
                type="submit"
                title="CREATE"
                inactive={this.formIsInvalid}
                onClick={this.onSubmit.bind(this)}
              />
            </div>
          </Form>
        </Body>
      </div>
    );
  }
}

const mapStateToProps = ({ expense }) => {
  const {
    photos,
    progress,
    loading,
  } = expense

  return {
    photos,
    progress,
    loading,
  }
}

const actions = {
  clearPhotos,
  removePhoto,
  createExpense,
  uploadExpensePhoto,
}

export default connect(mapStateToProps, actions)(AddMember)
