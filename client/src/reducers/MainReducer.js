import { mainTypes, teamTypes } from '../actions/types'

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
  CREATE_VISIT,
  CREATE_VISIT_SUCCESS,
  CREATE_VISIT_FAILURE,
  CLEAR_ERRORS,
} = mainTypes

const {
  CREATE_TEAM_MEMBER_SUCCESS,
} = teamTypes

const INITIAL_STATE = {
  reps: [],
  visits: [],

  physicians: [],
  physiciansDisplay: [],

  admins: [],
  adminsDisplay: [],

  patients: [],
  patientsDisplay: [],

  error: '',
  loading: false,
}

export default (state = INITIAL_STATE, action) => {
  const {type, payload} = action
  switch (type) {
    case GET_VISITS:
      return {
        ...state,
        loading: true,
      }
    case GET_VISITS_SUCCESS:
      return {
        ...state,
        visits: payload,
        loading: false,
      }
    case GET_VISITS_FAILURE:
      return {
        ...state,
        visits: [],
        error: payload,
        loading: false,
      }
    case GET_PHYSICIANS:
      return {
        ...state,
        loading: true,
      }
    case GET_PHYSICIANS_SUCCESS:
      return {
        ...state,
        physicians: payload,
        physiciansDisplay: payload,
        loading: false,
      }
    case FILTER_PHYSICIANS:
      return {
        ...state,
        physiciansDisplay: payload,
      }
    case GET_PHYSICIANS_FAILURE:
      return {
        ...state,
        physicians: [],
        physiciansDisplay: [],
        error: payload,
        loading: false,
      }
    case GET_TEAM_MEMBERS:
      return {
        ...state,
        loading: true,
      }
    case GET_TEAM_MEMBERS_SUCCESS:
      return {
        ...state,
        admins: payload,
        adminsDisplay: payload,
        loading: false,
      }
    case GET_TEAM_MEMBERS_FAILURE:
      return {
        ...state,
        admins: [],
        adminsDisplay: [],
        error: payload,
        loading: false,
      }
    case FILTER_TEAM_MEMBERS:
      return {
        ...state,
        adminsDisplay: payload,
      }
    case CREATE_TEAM_MEMBER_SUCCESS:
      return {
        ...state,
        admins: payload,
      }
    case GET_REPS:
      return {
        ...state,
        loading: true,
      }
    case GET_REPS_SUCCESS:
      return {
        ...state,
        reps: payload,
        loading: false,
      }
    case GET_REPS_FAILURE:
      return {
        ...state,
        reps: [],
        error: payload,
        loading: false,
      }
    case GET_PATIENTS:
      return {
        ...state,
        loading: true,
      }
    case GET_PATIENTS_SUCCESS:
      return {
        ...state,
        patients: payload,
        patientsDisplay: payload,
        loading: false,
      }
    case GET_PATIENTS_FAILURE:
      return {
        ...state,
        patients: [],
        patientsDisplay: [],
        error: payload,
        loading: false,
      }
    case FILTER_PATIENTS:
      return {
        ...state,
        patientsDisplay: payload,
      }
    case CREATE_VISIT:
      return {
        ...state,
        loading: true,
      }
    case CREATE_VISIT_SUCCESS:
      return {
        ...state,
        visits: payload,
        loading: false,
      }
    case CREATE_VISIT_FAILURE:
      return {
        ...state,
        error: payload,
        loading: false,
      }
    case CLEAR_ERRORS:
      return {
        ...state,
        error: '',
        loading: false,
      }
    default:
      return state
  }
}
