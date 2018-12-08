import { patientsTypes } from '../actions/types'

const {
  CREATE_PATIENT,
  CREATE_PATIENT_FAILURE,
  CREATE_PATIENT_SUCCESS,
  SET_PATIENT,
  GET_PATIENT,
  GET_PATIENT_FAILURE,
  GET_PATIENT_SUCCESS,
  PATCH_PATIENT,
  PATCH_PATIENT_FAILURE,
  PATCH_PATIENT_SUCCESS,
  CREATE_NOTE,
  CREATE_NOTE_FAILURE,
  CREATE_NOTE_SUCCESS,
  CLEAR_ERRORS,
  CLEAR_STATE,
} = patientsTypes

const INITIAL_STATE = {
  patient: null,
  error: '',
  loading: false,
}

export default (state = INITIAL_STATE, action) => {
  const {type, payload} = action
  switch (type) {
    case CREATE_PATIENT:
      return {
        ...state,
        loading: true,
      }
    case CREATE_PATIENT_SUCCESS:
      return {
        ...state,
        loading: false,
      }
    case CREATE_PATIENT_FAILURE:
      return {
        ...state,
        error: payload,
        loading: false,
      }
    case SET_PATIENT:
      return {
        ...state,
        patient: payload,
      }
    case GET_PATIENT:
      return {
        ...state,
        loading: true,
      }
    case GET_PATIENT_SUCCESS:
      return {
        ...state,
        patient: payload,
        loading: false,
      }
    case GET_PATIENT_FAILURE:
      return {
        ...state,
        patient: null,
        error: payload,
        loading: false,
      }
    case PATCH_PATIENT:
      return {
        ...state,
        loading: true,
      }
    case PATCH_PATIENT_SUCCESS:
      return {
        ...state,
        patient: payload,
        loading: false,
      }
    case PATCH_PATIENT_FAILURE:
      return {
        ...state,
        error: payload,
        loading: false,
      }
    case CREATE_NOTE:
      return {
        ...state,
        loading: true,
      }
    case CREATE_NOTE_FAILURE:
      return {
        ...state,
        patient: payload,
        loading: false,
      }
    case CREATE_NOTE_SUCCESS:
      return {
        ...state,
        error: payload,
        loading: false,
      }
    case CLEAR_STATE:
      return {
        ...INITIAL_STATE,
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
