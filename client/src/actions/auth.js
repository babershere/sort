// Router
import { push } from 'react-router-redux'

// Types
import { authTypes } from './types'

// Services
import { auth, users } from '../services'

import axios from 'axios'


const {
  EMAIL_CHANGED,
  USERNAME_CHANGED,
  PASSWORD_CHANGED,
  CONFIRM_PASSWORD_CHANGED,

  // Scripts
  PATIENT_CHANGE,
  MEDICATION_CHANGE,
  PHARM_NPI_CHANGE,
  LOCATION_CHANGE,
  PHARM_DATE_CHANGE,
  WRITTEN_DATE_CHANGE,
  SALES_CODE_CHANGE,
  BILL_ON_DATE_CHANGE,
  COST_CHANGE,
  RX_NUMBER_CHANGE,
  PRIMARY_INSURANCE_PAY_CHANGE,
  DIAGNOSIS_CHANGE,
  SECONDARY_INSURANCE_PAY_CHANGE,
  SECONDARY_DIAGNOSIS_CHANGE,
  PATIENT_PAY_CHANGE,
  REFILLS_CHANGE,
  REFILLS_REMAINING_CHANGE,
  QUANTITY_CHANGE,
  DAYS_SUPPLY_CHANGE,
  DIRECTIONS_CHANGE,
  PHONE_CHANGE,
  EMAIL_CHANGE,

  LOGIN,
  LOGIN_FAILURE,
  LOGIN_SUCCESS,
  GET_SELF,
  GET_SELF_FAILURE,
  GET_SELF_SUCCESS,
  PATCH_SELF,
  PATCH_SELF_FAILURE,
  PATCH_SELF_SUCCESS,
  RESET_PASSWORD,
  RESET_PASSWORD_FAILURE,
  RESET_PASSWORD_SUCCESS,
  CREATE_PASSWORD,
  CLAIM_ACCOUNT,
  CREATE_PASSWORD_FAILURE,
  CREATE_PASSWORD_SUCCESS,
  CLEAR_ERRORS,
} = authTypes

// Forms
export const usernameChanged = payload => {
  return {
    type: USERNAME_CHANGED,
    payload,
  }
}

export const emailChanged = payload => {
  return {
    type: EMAIL_CHANGED,
    payload,
  }
}

export const passwordChanged = payload => {
  return {
    type: PASSWORD_CHANGED,
    payload,
  }
}

export const confirmPasswordChanged = payload => {
  return {
    type: CONFIRM_PASSWORD_CHANGED,
    payload,
  }
}

export const login = payload => {
  return dispatch => {
    dispatch({
      type: LOGIN,
    })
    auth.login(payload)
      .then(res => onLoginSuccess({dispatch, res}))
      .catch(err => onLoginFailure({dispatch, err}))
  }
}

function onLoginSuccess({dispatch, res}) {
  console.log('login success', res);
  const { token } = res
  localStorage.setItem('token', token)
  dispatch({
    type: LOGIN_SUCCESS,
  })
  dispatch(push('/'))
}

function onLoginFailure({dispatch, err}) {
  console.log('login failure', err);
  dispatch({
    type: LOGIN_FAILURE,
    payload: err == null ? 'Login Failed' : err.message
  })
}

export const getSelf = () => dispatch => {
  dispatch({
    type: GET_SELF,
  })
  users.getSelf()
    .then(res => onGetSelfSuccess({dispatch, res}))
    .catch(err => onGetSelfFailure({dispatch, err}))
}

function onGetSelfSuccess({dispatch, res}) {
  console.log('getSelf success', res);
  const { user } = res
  dispatch({
    type: GET_SELF_SUCCESS,
    payload: user,
  })
}

function onGetSelfFailure({dispatch, err}) {
  const message = err.message || 'Get Self Failed'
  console.log('getSelf failure', message);
  window.alert(message)
  dispatch({
    type: GET_SELF_FAILURE,
    payload: message,
  })
}

export const resetPassword = ({ email }) => dispatch => {
  dispatch({
    type: RESET_PASSWORD,
  })
  auth.resetPassword({ email })
    .then(res => onResetPasswordSuccess({dispatch, res}))
    .catch(err => onResetPasswordFailure({dispatch, err}))
}

function onResetPasswordSuccess({dispatch, res}) {
  console.log('resetPassword success', res);
  dispatch({
    type: RESET_PASSWORD_SUCCESS,
  })
  dispatch(push('/login'))
}

function onResetPasswordFailure({dispatch, err}) {
  const message = err.message || 'Reset Password Failed'
  console.log('resetPassword failure', message);
  window.alert(message)
  dispatch({
    type: RESET_PASSWORD_FAILURE,
    payload: message,
  })
}

export const createPassword = data => dispatch => {
  dispatch({
    type: CREATE_PASSWORD,
  })
  auth.createPassword(data)
    .then(res => onCreatePasswordSuccess({dispatch, res}))
    .catch(err => onCreatePasswordFailure({dispatch, err}))
}

export const claimAccount = data => dispatch => {
  dispatch({
    type: CLAIM_ACCOUNT,
  })
  auth.claimAccount(data)
    .then(res => onCreatePasswordSuccess({dispatch, res}))
    .catch(err => onCreatePasswordFailure({dispatch, err}))
}

function onCreatePasswordSuccess({dispatch, res}) {
  console.log('createPassword success', res);
  dispatch({
    type: CREATE_PASSWORD_SUCCESS,
  })

  // set new token for localStorage
  localStorage.setItem('token', res.token)

  dispatch(push('/'))
}

function onCreatePasswordFailure({dispatch, err}) {
  const message = err.message || 'Create Password Failed'
  console.log('createPassword failure', message);
  window.alert(message)
  dispatch({
    type: CREATE_PASSWORD_FAILURE,
    payload: message,
  })
}

export const patchSelf = update => dispatch => {
  dispatch({
    type: PATCH_SELF,
  })
  users.patchSelf(update)
    .then(res => onPatchSelfSuccess({dispatch, res}))
    .catch(err => onPatchSelfFailure({dispatch, err}))
}

function onPatchSelfSuccess({dispatch, res}) {
  console.log('patchSelf success', res);
  const { user } = res
  dispatch({
    type: PATCH_SELF_SUCCESS,
    payload: user,
  })
}

function onPatchSelfFailure({dispatch, err}) {
  const message = err.message || 'Patch Self Failed'
  console.log('patchSelf failure', message);
  window.alert(message)
  dispatch({
    type: PATCH_SELF_FAILURE,
    payload: message,
  })
}

export const logout = () => dispatch => {
  if (window.confirm('Log out?')) {
    localStorage.clear()
    dispatch(push('/login'))
  }
}

// Scripts
export const patientChange = payload => {
  return {
    type: PATIENT_CHANGE,
    payload,
  }
}

export const medicationChange = payload => {
  const loginToken = window.localStorage.getItem("token");
  axios.get('api/medications/search?s=' + payload, { headers: { "Authorization": "Bearer " + loginToken } })
  .then((res) => {
    console.log(res.data.response)
    
  })
  .catch((error) => {
    console.error(error)
  })

  return {
    type: MEDICATION_CHANGE,
    payload
  }
}

export const pharmNPIChange = payload => {
  return {
    type: PHARM_NPI_CHANGE,
    payload,
  }
}

export const locationChange = payload => {
  return {
    type: LOCATION_CHANGE,
    payload,
  }
}

export const pharmDateChange = payload => {
  return {
    type: PHARM_DATE_CHANGE,
    payload,
  }
}

export const writtenDateChange = payload => {
  return {
    type: WRITTEN_DATE_CHANGE,
    payload,
  }
}

export const salesCodeChange = payload => {
  return {
    type: SALES_CODE_CHANGE,
    payload,
  }
}

export const billOnDateChange = payload => {
  return {
    type: BILL_ON_DATE_CHANGE,
    payload,
  }
}

export const costChange = payload => {
  return {
    type: COST_CHANGE,
    payload,
  }
}

export const rxNumberChange = payload => {
  return {
    type: RX_NUMBER_CHANGE,
    payload,
  }
}

export const primInsPayChange = payload => {
  return {
    type: PRIMARY_INSURANCE_PAY_CHANGE,
    payload,
  }
}

export const diagnosisChange = payload => {
  return {
    type: DIAGNOSIS_CHANGE,
    payload,
  }
}

export const secInsPayChange = payload => {
  return {
    type: SECONDARY_INSURANCE_PAY_CHANGE,
    payload,
  }
}

export const secDiagnosisChange = payload => {
  return {
    type: SECONDARY_DIAGNOSIS_CHANGE,
    payload,
  }
}

export const patientPayChange = payload => {
  return {
    type: PATIENT_PAY_CHANGE,
    payload,
  }
}

export const refillsChange = payload => {
  return {
    type: REFILLS_CHANGE,
    payload,
  }
}

export const refillsRemainingChange = payload => {
  return {
    type: REFILLS_REMAINING_CHANGE,
    payload,
  }
}

export const quantityChange = payload => {
  return {
    type: QUANTITY_CHANGE,
    payload,
  }
}

export const daysSupplyChange = payload => {
  return {
    type: DAYS_SUPPLY_CHANGE,
    payload,
  }
}

export const directionsChange = payload => {
  return {
    type: DIRECTIONS_CHANGE,
    payload,
  }
}

export const phoneChange = payload => {
  return {
    type: PHONE_CHANGE,
    payload,
  }
}

export const emailChange = payload => {
  return {
    type: EMAIL_CHANGE,
    payload,
  }
}

export const clearErrors = () => {
  return {
    type: CLEAR_ERRORS
  }
}
