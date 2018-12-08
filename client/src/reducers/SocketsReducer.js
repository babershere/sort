import { socketsTypes } from '../actions/types'

const {
  SET_SOCKET,
  CLEAR_SOCKET,
} = socketsTypes

const INITIAL_STATE = {
  socket: null,
}

export default (state = INITIAL_STATE, action) => {
  const {type, payload} = action
  switch (type) {
    case SET_SOCKET:
      return {
        ...state,
        socket: payload,
      }
    case CLEAR_SOCKET:
      return {
        ...state,
        socket: null,
      }
    default:
      return state
  }
}
