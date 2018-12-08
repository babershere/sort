import socketIOClient from 'socket.io-client'

// Types
import { socketsTypes } from './types'

// Config
import { uri } from '../config'

const {
  SET_SOCKET,
  CLEAR_SOCKET,
} = socketsTypes

export const connectSocket = () => (dispatch, getState) => {
  return;

  const { socket } = getState().sockets

  if (socket) {
    return
  } else {
    const options = {
      query: {
        token: localStorage.getItem('token'),
      },
    }
    const socket = socketIOClient(uri, options)

    dispatch({
      type: SET_SOCKET,
      payload: socket,
    })
  }
}

export const clearSocket = () => {
  return {
    type: CLEAR_SOCKET,
  }
}
