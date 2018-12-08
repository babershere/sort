// Types
import { mainTypes, physiciansTypes } from './types'

// Services
import {
  visits,
  users,
  patients,
  scripts
} from '../services'

const {
  GET_VISITS,
  GET_VISITS_SUCCESS,
  GET_VISITS_FAILURE,
  GET_PHYSICIANS,
  GET_PHYSICIANS_SUCCESS,
  GET_PHYSICIANS_FAILURE,
  FILTER_PHYSICIANS,
  GET_TEAM_MEMBERS,
  GET_TEAM_MEMBERS_SUCCESS,
  GET_TEAM_MEMBERS_FAILURE,
  FILTER_TEAM_MEMBERS,
  GET_PATIENTS,
  GET_PATIENTS_SUCCESS,
  GET_PATIENTS_FAILURE,
  FILTER_PATIENTS,
  GET_REPS,
  GET_REPS_SUCCESS,
  GET_REPS_FAILURE,
  GET_SCRIPTS,
  GET_SCRIPTS_SUCCESS,
  GET_SCRIPTS_FAILURE,
  // FILTER_SCRIPTS,
  CREATE_VISIT,
  CREATE_VISIT_SUCCESS,
  CREATE_VISIT_FAILURE,
  CLEAR_ERRORS,
} = mainTypes

const {
  CREATE_NOTE_SUCCESS,
} = physiciansTypes

export const getVisits = () => dispatch => {
  dispatch({
    type: GET_VISITS,
  })
  visits.getAll()
    .then(res => onGetVisitsSuccess({dispatch, res}))
    .catch(err => onGetVisitsFailure({dispatch, err}))
}

function onGetVisitsSuccess({dispatch, res}) {
  console.log('getVisits success', res);
  dispatch({
    type: GET_VISITS_SUCCESS,
    payload: res.visits,
  })
}

function onGetVisitsFailure({dispatch, err}) {
  console.log('getVisits failure', err);
  dispatch({
    type: GET_VISITS_FAILURE,
    payload: err.message || 'Login Failed',
  })
}

// Physicians
export const getPhysicians = () => dispatch => {
  dispatch({
    type: GET_PHYSICIANS,
  })
  users.getPhysicians()
    .then(res => onGetPhysiciansSuccess({dispatch, res}))
    .catch(err => onGetPhysiciansFailure({dispatch, err}))
}

function onGetPhysiciansSuccess({dispatch, res}) {
  console.log('getPhysicians success', res);
  dispatch({
    type: GET_PHYSICIANS_SUCCESS,
    payload: res.users,
  })
}

function onGetPhysiciansFailure({dispatch, err}) {
  console.log('getPhysicians failure', err);
  dispatch({
    type: GET_PHYSICIANS_FAILURE,
    payload: err.message || 'Get Physicians Failed',
  })
}

export const filterPhysicians = (input, searchType = '') => (dispatch, getState) => {
  const search = input.toLowerCase().trim()
  const { physicians } = getState().main
  const physiciansDisplay = !search ? physicians : physicians.filter(physician => {
    const name = physician.nameDisplay.toLowerCase()
    return name.includes(search)
  })

  dispatch({
    type: FILTER_PHYSICIANS,
    payload: physiciansDisplay,
  })
}

export const getTeamMembers = () => dispatch => {
  dispatch({
    type: GET_TEAM_MEMBERS,
  })
  users.getTeam()
    .then(res => onGetTeamMembersSuccess({dispatch, res}))
    .catch(err => onGetTeamMembersFailure({dispatch, err}))
}

function onGetTeamMembersSuccess({dispatch, res}) {
  console.log('getTeamMembers success', res);
  dispatch({
    type: GET_TEAM_MEMBERS_SUCCESS,
    payload: res.users,
  })
}

function onGetTeamMembersFailure({dispatch, err}) {
  console.log('getTeamMembers failure', err);
  dispatch({
    type: GET_TEAM_MEMBERS_FAILURE,
    payload: err.message || 'Get TeamMembers Failed',
  })
}

export const filterTeamMembers = (input, searchType = '') => (dispatch, getState) => {
  const search = input.toLowerCase().trim()
  const { admins } = getState().main
  const adminsDisplay = !search ? admins : admins.filter(admin => {
    const name = admin.nameDisplay.toLowerCase()
    const email = admin.email.toLowerCase()

    const nameMatches = name.includes(search)
    const emailMatches = email.includes(search)

    switch (searchType) {
      case 'name':
        return nameMatches
      case 'email':
        return emailMatches
      default:
        return nameMatches || emailMatches
    }
  })

  dispatch({
    type: FILTER_TEAM_MEMBERS,
    payload: adminsDisplay,
  })
}

export const getPatients = () => dispatch => {
  dispatch({
    type: GET_PATIENTS,
  })
  patients.getAll()
    .then(res => onGetPatientsSuccess({dispatch, res}))
    .catch(err => onGetPatientsFailure({dispatch, err}))
}

function onGetPatientsSuccess({dispatch, res}) {
  console.log('getPatients success', res);
  dispatch({
    type: GET_PATIENTS_SUCCESS,
    payload: res.patients,
  })
}

function onGetPatientsFailure({dispatch, err}) {
  console.log('getPatients failure', err);
  const payload = err.message || 'Get Patients Failed'
  window.alert(payload)
  dispatch({
    type: GET_PATIENTS_FAILURE,
    payload,
  })
}

export const filterPatientsByName = input => (dispatch, getState) => {
  const search = input.toLowerCase().trim()
  const { patients } = getState().main
  const patientsDisplay = !search ? patients : patients.filter(patient => {
    const name = patient.nameDisplay.toLowerCase()
    return name.includes(search)
  })

  dispatch({
    type: FILTER_PATIENTS,
    payload: patientsDisplay,
  })
}

export const filterPatientsByDob = dob => (dispatch, getState) => {
  const { patients } = getState().main
  const patientsDisplay = !dob ? patients : patients.filter(patient => {
    return patient.dob === dob
  })

  dispatch({
    type: FILTER_PATIENTS,
    payload: patientsDisplay,
  })
}

export const getReps = () => dispatch => {
  dispatch({
    type: GET_REPS,
  })
  users.getReps()
    .then(res => onGetRepsSuccess({dispatch, res}))
    .catch(err => onGetRepsFailure({dispatch, err}))
}

function onGetRepsSuccess({dispatch, res}) {
  console.log('getReps success', res);
  dispatch({
    type: GET_REPS_SUCCESS,
    payload: res.users,
  })
}

function onGetRepsFailure({dispatch, err}) {
  console.log('getReps failure', err);
  dispatch({
    type: GET_REPS_FAILURE,
    payload: err.message || 'Get Reps Failed',
  })
}

export const getScripts = () => dispatch => {
  dispatch({
    type: GET_SCRIPTS,
  })
  scripts.getAll()
    .then(res => onGetScriptsSuccess({dispatch, res}))
    .catch(err => onGetScriptsFailure({dispatch, err}))
}

function onGetScriptsSuccess({dispatch, res}) {
  console.log('getScripts success', res);
  dispatch({
    type: GET_SCRIPTS_SUCCESS,
    payload: res.scripts,
  })
}

function onGetScriptsFailure({dispatch, err}) {
  console.log('getScripts failure', err);
  const payload = err.message || 'Get Scripts Failed'
  window.alert(payload)
  dispatch({
    type: GET_SCRIPTS_FAILURE,
    payload,
  })
}

export const createVisit = data => (dispatch, getState) => {
  dispatch({
    type: CREATE_VISIT,
  })
  visits.post(data)
    .then(res => onCreateVisitSuccess({dispatch, getState, res}))
    .catch(err => onCreateVisitFailure({dispatch, err}))
}

function onCreateVisitSuccess({dispatch, getState, res}) {
  console.log('createVisit success', res);
  const { visit } = res

  // update agenda view
  const { visits } = getState().main
  dispatch({
    type: CREATE_VISIT_SUCCESS,
    payload: [ ...visits, visit ],
  })

  // update physician view
  const { physician } = getState().physicians
  if (physician && physician.id === visit.physicianId) {
    physician.visits = [ ...physician.visits, visit ]
    dispatch({
      type: CREATE_NOTE_SUCCESS,
      payload: { ...physician },
    })
  }
}

function onCreateVisitFailure({dispatch, err}) {
  console.log('createVisit failure', err);
  dispatch({
    type: CREATE_VISIT_FAILURE,
    payload: err.message || 'CreateVisit Failed',
  })
}

export const clearErrors = () => {
  return {
    type: CLEAR_ERRORS
  }
}
