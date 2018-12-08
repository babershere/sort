import { scriptsTypes } from '../actions/types'

const {
  CLEAR_ERRORS
} = scriptsTypes

const INITIAL_STATE = {
  me: null,
  error: '',
  loading: false,
  isAdmin: false,
  // formErrors: {
  //   email: '',
  //   password: '',
  //   response: '',
  // },
}

export default (state = INITIAL_STATE, action) => {
  // const {type, payload} = action
  const {type} = action

  switch (type) {
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
