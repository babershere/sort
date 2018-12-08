import { teamTypes } from '../actions/types'

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

const INITIAL_STATE = {
  user: null,

  error: '',
  loading: false,
}

export default (state = INITIAL_STATE, action) => {
  const {type, payload} = action
  switch (type) {
    case CREATE_TEAM_MEMBER:
      return {
        ...state,
        loading: true,
      }
    case CREATE_TEAM_MEMBER_SUCCESS:
      return {
        ...state,
        loading: false,
      }
    case CREATE_TEAM_MEMBER_FAILURE:
      return {
        ...state,
        error: payload,
        loading: false,
      }
    case SET_TEAM_MEMBER:
      return {
        ...state,
        user: payload,
      }
    case GET_TEAM_MEMBER:
      return {
        ...state,
        loading: true,
      }
    case GET_TEAM_MEMBER_SUCCESS:
      return {
        ...state,
        user: payload,
        loading: false,
      }
    case GET_TEAM_MEMBER_FAILURE:
      return {
        ...state,
        user: null,
        error: payload,
        loading: false,
      }
    case PATCH_TEAM_MEMBER:
      return {
        ...state,
        loading: true,
      }
    case PATCH_TEAM_MEMBER_SUCCESS:
      return {
        ...state,
        user: payload,
        loading: false,
      }
    case PATCH_TEAM_MEMBER_FAILURE:
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
