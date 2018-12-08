// Redux
import { combineReducers } from 'redux'

// Redux Router
import { routerReducer } from 'react-router-redux'

// Reducers
import auth from './AuthReducer'
import main from './MainReducer'
import physicians from './PhysiciansReducer'
import patients from './PatientsReducer'
import expense from './ExpenseReducer'
import team from './TeamReducer'
import scripts from './ScriptsReducer'
import sockets from './SocketsReducer'

const reducers = {
  auth,
  main,
  physicians,
  patients,
  expense,
  team,
  scripts,
  sockets,
  router: routerReducer,
}

export default combineReducers(reducers)
