// Router
import { push } from 'react-router-redux'

// Types
import { expensesTypes } from './types'

// Services
import { expenses, uploads } from '../services'

// Helpers
import { updateItemWithArray, updateArrayWithItem } from '../lib'

const {
  GET_EXPENSES,
  GET_EXPENSES_FAILURE,
  GET_EXPENSES_SUCCESS,

  CREATE_EXPENSE,
  CREATE_EXPENSE_FAILURE,
  CREATE_EXPENSE_SUCCESS,

  PATCH_EXPENSE,
  PATCH_EXPENSE_FAILURE,

  DELETE_EXPENSE,
  DELETE_EXPENSE_FAILURE,
  DELETE_EXPENSE_SUCCESS,

  FILTER_EXPENSES,

  SET_CHECKED_EXPENSES,

  UPLOAD_FILE,
  UPLOAD_FILE_PROGRESS,
  UPLOAD_FILE_SUCCESS,
  UPLOAD_FILE_FAILURE,

  SET_PHOTOS,

  CLEAR_PHOTOS,
  CLEAR_ERRORS,
  CLEAR_STATE,
} = expensesTypes

export const getExpenses = () => dispatch => {
  dispatch({
    type: GET_EXPENSES,
  })
  expenses.getAll()
    .then(res => onGetExpensesSuccess({dispatch, res}))
    .catch(err => onGetExpensesFailure({dispatch, err}))
}

function onGetExpensesSuccess({dispatch, res}) {
  console.log('GetExpenses success', res);
  dispatch({
    type: GET_EXPENSES_SUCCESS,
    payload: res.expenses
  })
}

function onGetExpensesFailure({dispatch, err}) {
  console.log('GetExpenses failure', err);
  const payload = err.message || 'GetExpenses Failed'
  window.alert(payload)
  dispatch({
    type: GET_EXPENSES_FAILURE,
    payload,
  })
}

export const bulkPatchExpenses = update => (dispatch, getState) => {
  dispatch({
    type: GET_EXPENSES,
  })
  expenses.bulkPatch(update)
    .then(res => onBulkPatchExpensesSuccess({dispatch, getState, res}))
    .catch(err => onBulkPatchExpensesFailure({dispatch, err}))
}

function onBulkPatchExpensesSuccess({dispatch, getState, res}) {
  console.log('BulkPatchExpenses success', res);
  const { expenses, expensesDisplay } = getState().expense

  const updateExpense = expense => updateItemWithArray(expense, res.expenses)

  dispatch({
    type: GET_EXPENSES_SUCCESS,
    payload: expenses.map(updateExpense),
  })
  dispatch({
    type: FILTER_EXPENSES,
    payload: expensesDisplay.map(updateExpense),
  })
}

function onBulkPatchExpensesFailure({dispatch, err}) {
  console.log('BulkPatchExpenses failure', err);
  const payload = err.message || 'BulkPatchExpenses Failed'
  window.alert(payload)
  dispatch({
    type: GET_EXPENSES_FAILURE,
    payload,
  })
}

export const createExpense = payload => (dispatch, getState) => {
  dispatch({
    type: CREATE_EXPENSE,
  })
  expenses.post(payload)
    .then(res => onCreateExpenseSuccess({dispatch, getState, res}))
    .catch(err => onCreateExpenseFailure({dispatch, err}))
}

function onCreateExpenseSuccess({dispatch, getState, res}) {
  console.log('createExpense success', res);
  const { expenses } = getState().expense
  dispatch({
    type: CREATE_EXPENSE_SUCCESS,
    payload: [res.expense, ...expenses]
  })
  dispatch(push('/dashboard'))
}

function onCreateExpenseFailure({dispatch, err}) {
  console.log('createExpense failure', err);
  const payload = err.message || 'CreateExpense Failed'
  window.alert(payload)
  dispatch({
    type: CREATE_EXPENSE_FAILURE,
    payload,
  })
}

export const patchExpenseById = (id, update) => (dispatch, getState) => {
  dispatch({
    type: PATCH_EXPENSE,
  })
  expenses.patchById(id, update)
    .then(res => onPatchExpenseSuccess({dispatch, getState, res}))
    .catch(err => onPatchExpenseFailure({dispatch, err}))
}

export const patchExpenseStatus = update => (dispatch, getState) => {
  dispatch({
    type: PATCH_EXPENSE,
  })
  expenses.patchStatus(update)
    .then(res => onPatchExpenseSuccess({dispatch, getState, res}))
    .catch(err => onPatchExpenseFailure({dispatch, err}))
}

function onPatchExpenseSuccess({dispatch, getState, res}) {
  console.log('patchExpense success', res);
  let { expenses, expensesDisplay } = getState().expense

  dispatch({
    type: GET_EXPENSES_SUCCESS,
    payload: updateArrayWithItem(expenses, res.expense)
  })
  dispatch({
    type: FILTER_EXPENSES,
    payload: updateArrayWithItem(expensesDisplay, res.expense),
  })
}

function onPatchExpenseFailure({dispatch, err}) {
  console.log('patchExpense failure', err)
  const payload = err.message || 'PatchExpense Failed'
  window.alert(payload)
  dispatch({
    type: PATCH_EXPENSE_FAILURE,
    payload,
  })
}

export const deleteExpenseById = id => (dispatch, getState) => {
  dispatch({
    type: DELETE_EXPENSE,
  })
  expenses.deleteById(id)
    .then(res => onDeleteExpenseSuccess({dispatch, getState, res}))
    .catch(err => onDeleteExpenseFailure({dispatch, err}))
}

function onDeleteExpenseSuccess({dispatch, getState, res}) {
  console.log('DeleteExpense success', res);
  const expenses = getState().expense.expenses.filter(el => el.id !== res.expense.id)

  dispatch({
    type: DELETE_EXPENSE_SUCCESS,
    payload: [...expenses],
  })
}

function onDeleteExpenseFailure({dispatch, err}) {
  console.log('DeleteExpense failure', err)
  const payload = err.message || 'DeleteExpense Failed'
  window.alert(payload)
  dispatch({
    type: DELETE_EXPENSE_FAILURE,
    payload,
  })
}

export const filterExpensesByStatus = status => (dispatch, getState) => {
  const { expenses } = getState().expense

  const payload = status ? (
    expenses.filter(el => el.status === status)
  ) : (
    [...expenses]
  )

  dispatch({
    type: FILTER_EXPENSES,
    payload,
  })
}

export const checkExpense = ({id}) => (dispatch, getState) => {
  const { checkedExpenses } = getState().expense

  let payload = []
  if (checkedExpenses.includes(id)) {
    payload = checkedExpenses.filter(el => el !== id)
  } else {
    payload = [...checkedExpenses, id]
  }

  dispatch({
    type: SET_CHECKED_EXPENSES,
    payload,
  })
}

export const uploadExpensePhoto = file => dispatch => {
  const type = 'expense'
  const url = window.URL.createObjectURL(file)
  dispatch({
    type: UPLOAD_FILE,
    payload: url,
  })

  uploads.getSignedUrl({ file, type })
    .then(({ url, attachment }) => {
      const onProgress = e => dispatch(updateProgress(e))
      return uploads.uploadToS3({url, file, attachment, onProgress})
    })
    .then(res => onUploadFileSuccess({dispatch, res}))
    .catch(err => onUploadFileFailure({dispatch, err}))
}

const updateProgress = payload => {
  return {
    type: UPLOAD_FILE_PROGRESS,
    payload,
  }
}

function onUploadFileSuccess({dispatch, res}) {
  console.log('uploaded to s3', res)
  const payload = {
    ...res,
    name: 'Photo',
  }
  dispatch({
    type: UPLOAD_FILE_SUCCESS,
    payload,
  })
}

function onUploadFileFailure({dispatch, err}) {
  window.alert(err.message || 'Unknown error during file upload')
  dispatch({
    type: UPLOAD_FILE_FAILURE,
  })
}

export const removePhoto = photo => (dispatch, getState) => {
  const { photos } = getState().expense
  const payload = photos.filter(el => el.id !== photo.id)
  dispatch({
    type: SET_PHOTOS,
    payload,
  })
}

export const clearPhotos = () => {
  return {
    type: CLEAR_PHOTOS,
  }
}

export const clearErrors = () => {
  return {
    type: CLEAR_ERRORS,
  }
}

export const clearState = () => {
  return {
    type: CLEAR_STATE,
  }
}
