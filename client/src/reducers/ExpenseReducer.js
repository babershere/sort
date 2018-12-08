import { expensesTypes } from '../actions/types'

const {
  GET_EXPENSES,
  GET_EXPENSES_FAILURE,
  GET_EXPENSES_SUCCESS,

  CREATE_EXPENSE,
  CREATE_EXPENSE_FAILURE,
  CREATE_EXPENSE_SUCCESS,

  PATCH_EXPENSE,
  PATCH_EXPENSE_FAILURE,
  PATCH_EXPENSE_SUCCESS,

  DELETE_EXPENSE,
  DELETE_EXPENSE_FAILURE,
  DELETE_EXPENSE_SUCCESS,

  FILTER_EXPENSES,

  UPLOAD_FILE,
  UPLOAD_FILE_PROGRESS,
  UPLOAD_FILE_SUCCESS,
  UPLOAD_FILE_FAILURE,

  SET_CHECKED_EXPENSES,

  SET_PHOTOS,

  CLEAR_PHOTOS,
  CLEAR_ERRORS,
  CLEAR_STATE,
} = expensesTypes

const INITIAL_STATE = {
  expenses: [],
  expensesDisplay: [],

  checkedExpenses: [],

  photos: [],
  progress: 0,

  error: '',
  loading: false,
}

export default (state = INITIAL_STATE, action) => {
  const {type, payload} = action
  switch (type) {
    case GET_EXPENSES:
      return {
        ...state,
        loading: true,
      }
    case GET_EXPENSES_SUCCESS:
      return {
        ...state,
        expenses: payload,
        expensesDisplay: payload,
        loading: false,
      }
    case GET_EXPENSES_FAILURE:
      return {
        ...state,
        error: payload,
        loading: false,
      }

    case CREATE_EXPENSE:
      return {
        ...state,
        loading: true,
      }
    case CREATE_EXPENSE_SUCCESS:
      return {
        ...state,
        expenses: payload,
        expensesDisplay: payload,
        loading: false,
      }
    case CREATE_EXPENSE_FAILURE:
      return {
        ...state,
        photos: [],
        error: payload,
        loading: false,
      }

    case PATCH_EXPENSE:
      return {
        ...state,
        loading: true,
      }
    case PATCH_EXPENSE_SUCCESS:
      return {
        ...state,
        expenses: payload,
        expensesDisplay: payload,
        loading: false,
      }
    case PATCH_EXPENSE_FAILURE:
      return {
        ...state,
        error: payload,
        loading: false,
      }

    case DELETE_EXPENSE:
      return {
        ...state,
        loading: true,
      }
    case DELETE_EXPENSE_SUCCESS:
      return {
        ...state,
        expenses: payload,
        expensesDisplay: payload,
        loading: false,
      }
    case DELETE_EXPENSE_FAILURE:
      return {
        ...state,
        error: payload,
        loading: false,
      }

    // case SET_STATUS_FILTER:
    //   return {
    //     ...state,
    //     statusFilter: payload,
    //   }

    case UPLOAD_FILE:
      return {
        ...state,
        progress: 0,
        loading: true,
      }
    case UPLOAD_FILE_PROGRESS:
      return {
        ...state,
        progress: payload,
      }
    case UPLOAD_FILE_SUCCESS:
      return {
        ...state,
        progress: 0,
        photos: [...state.photos, payload],
        loading: false,
      }
    case UPLOAD_FILE_FAILURE:
      return {
        ...state,
        progress: 0,
        loading: false,
      }

    case FILTER_EXPENSES:
      return {
        ...state,
        expensesDisplay: payload,
        checkedExpenses: [],
      }

    case SET_CHECKED_EXPENSES:
      return {
        ...state,
        checkedExpenses: payload,
      }

    case SET_PHOTOS:
      return {
        ...state,
        photos: payload,
      }

    case CLEAR_STATE:
      return {
        ...INITIAL_STATE,
      }
    case CLEAR_PHOTOS:
      return {
        ...state,
        photos: [],
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
