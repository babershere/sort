import { physiciansTypes } from '../actions/types'

const {
  CREATE_PHYSICIAN,
  CREATE_PHYSICIAN_FAILURE,
  CREATE_PHYSICIAN_SUCCESS,
  SET_PHYSICIAN,
  GET_PHYSICIAN,
  GET_PHYSICIAN_FAILURE,
  GET_PHYSICIAN_SUCCESS,
  PATCH_PHYSICIAN,
  PATCH_PHYSICIAN_FAILURE,
  PATCH_PHYSICIAN_SUCCESS,
  CREATE_NOTE,
  CREATE_NOTE_SUCCESS,
  CREATE_NOTE_FAILURE,
  CLEAR_ERRORS,
  CLEAR_STATE,
} = physiciansTypes

const INITIAL_STATE = {
  physician: null,
  error: '',
  loading: false,
}

export default (state = INITIAL_STATE, action) => {
  const {type, payload} = action
  switch (type) {
    case CREATE_PHYSICIAN:
      return {
        ...state,
        loading: true,
      }
    case CREATE_PHYSICIAN_SUCCESS:
      return {
        ...state,
        loading: false,
      }
    case CREATE_PHYSICIAN_FAILURE:
      return {
        ...state,
        error: payload,
        loading: false,
      }
    case SET_PHYSICIAN:
      return {
        ...state,
        physician: payload,
      }
    case GET_PHYSICIAN:
      return {
        ...state,
        loading: true,
      }
    case GET_PHYSICIAN_SUCCESS:
      return {
        ...state,
        physician: payload,
        loading: false,
      }
    case GET_PHYSICIAN_FAILURE:
      return {
        ...state,
        physician: null,
        error: payload,
        loading: false,
      }
    case PATCH_PHYSICIAN:
      return {
        ...state,
        loading: true,
      }
    case PATCH_PHYSICIAN_SUCCESS:
      return {
        ...state,
        physician: payload,
        loading: false,
      }
    case PATCH_PHYSICIAN_FAILURE:
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
    case CREATE_NOTE_SUCCESS:
      return {
        ...state,
        physician: payload,
        loading: false,
      }
    case CREATE_NOTE_FAILURE:
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
