// Router
import { push } from 'react-router-redux'

// Types
import { teamTypes, expensesTypes } from './types'

// Services
import { users } from '../services'

const {
  CREATE_TEAM_MEMBER,
  CREATE_TEAM_MEMBER_FAILURE,
  CREATE_TEAM_MEMBER_SUCCESS,
  SET_TEAM_MEMBER,
  GET_TEAM_MEMBER,
  GET_TEAM_MEMBER_FAILURE,
  GET_TEAM_MEMBER_SUCCESS,
  PATCH_TEAM_MEMBER,
  PATCH_TEAM_MEMBER_FAILURE,
  PATCH_TEAM_MEMBER_SUCCESS,
  CLEAR_ERRORS,
  CLEAR_STATE,
} = teamTypes

const {
  GET_EXPENSES_SUCCESS,
  GET_EXPENSES_FAILURE,
} = expensesTypes

export const createTeamMember = payload => (dispatch, getState) => {
  dispatch({
    type: CREATE_TEAM_MEMBER,
  })
  users.post(payload)
    .then(res => onCreateTeamMemberSuccess({dispatch, getState, res}))
    .catch(err => onCreateTeamMemberFailure({dispatch, err}))
}

function onCreateTeamMemberSuccess({dispatch, getState, res}) {
  console.log('createTeamMember success', res);
  const { admins } = getState().main
  dispatch({
    type: CREATE_TEAM_MEMBER_SUCCESS,
    payload: [...admins, res.user],
  })
  dispatch(push('/team'))
}

function onCreateTeamMemberFailure({dispatch, err}) {
  console.log('createTeamMember failure', err);
  const payload = err.message || 'CreateTeamMember Failed'
  window.alert(payload)
  dispatch({
    type: CREATE_TEAM_MEMBER_FAILURE,
    payload,
  })
}

export const setMember = payload => dispatch => {
  const { expenses } = payload
  dispatch({
    type: SET_TEAM_MEMBER,
    payload,
  })

  dispatch({
    type: GET_EXPENSES_SUCCESS,
    payload: expenses
  })
}

export const getMemberById = userId => (dispatch, getState) => {
  // check if a user has been set yet
  const { user } = getState().team
  if (user && user.id !== userId) {
    // clear it if it is not the same one
    console.log('clearing state');
    dispatch({
      type: CLEAR_STATE,
    })
  }

  dispatch({
    type: GET_TEAM_MEMBER,
  })
  users.getById(userId)
    .then(res => onGetMemberSuccess({dispatch, res}))
    .catch(err => onGetMemberFailure({dispatch, err}))
}

function onGetMemberSuccess({dispatch, res}) {
  console.log('getMember success', res);
  dispatch({
    type: GET_TEAM_MEMBER_SUCCESS,
    payload: res.user,
  })
  dispatch({
    type: GET_EXPENSES_SUCCESS,
    payload: res.user.expenses,
  })
}

function onGetMemberFailure({dispatch, err}) {
  console.log('getMember failure', err);
  const payload = err.message || 'GetMember Failed'
  window.alert(payload)
  dispatch({
    type: GET_TEAM_MEMBER_FAILURE,
    payload,
  })
  dispatch({
    type: GET_EXPENSES_FAILURE,
    payload: ''
  })
  dispatch(push('/team'))
}

export const patchMemberById = (id, update) => (dispatch, getState) => {
  dispatch({
    type: PATCH_TEAM_MEMBER,
  })
  users.patchById(id, update)
    .then(res => onPatchMemberSuccess({dispatch, res}))
    .catch(err => onPatchMemberFailure({dispatch, err}))
}

function onPatchMemberSuccess({dispatch, res}) {
  console.log('patchMember success', res);
  dispatch({
    type: PATCH_TEAM_MEMBER_SUCCESS,
    payload: res.user,
  })
}

function onPatchMemberFailure({dispatch, err}) {
  console.log('patchMember failure', err)
  const payload = err.message || 'PatchMember Failed'
  window.alert(payload)
  dispatch({
    type: PATCH_TEAM_MEMBER_FAILURE,
    payload,
  })
}

export const clearErrors = () => {
  return {
    type: CLEAR_ERRORS
  }
}
