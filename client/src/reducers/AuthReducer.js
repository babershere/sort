import { authTypes } from '../actions/types'

const {
  EMAIL_CHANGED,
  USERNAME_CHANGED,
  PASSWORD_CHANGED,

  // Scripts
  PATIENT_CHANGE,
  MEDICATION_CHANGE,
  PHARM_NPI_CHANGE,
  LOCATION_CHANGE,
  PHARM_DATE_CHANGE,
  WRITTEN_DATE_CHANGE,
  SALES_CODE_CHANGE,
  BILL_ON_DATE_CHANGE,
  COST_CHANGE,
  RX_NUMBER_CHANGE,
  PRIMARY_INSURANCE_PAY_CHANGE,
  DIAGNOSIS_CHANGE,
  SECONDARY_INSURANCE_PAY_CHANGE,
  SECONDARY_DIAGNOSIS_CHANGE,
  PATIENT_PAY_CHANGE,
  REFILLS_CHANGE,
  REFILLS_REMAINING_CHANGE,
  QUANTITY_CHANGE,
  DAYS_SUPPLY_CHANGE,
  DIRECTIONS_CHANGE,
  PHONE_CHANGE,
  EMAIL_CHANGE,

  CONFIRM_PASSWORD_CHANGED,
  LOGIN,
  LOGIN_FAILURE,
  LOGIN_SUCCESS,
  GET_SELF,
  GET_SELF_FAILURE,
  GET_SELF_SUCCESS,
  PATCH_SELF,
  PATCH_SELF_FAILURE,
  PATCH_SELF_SUCCESS,
  RESET_PASSWORD,
  RESET_PASSWORD_FAILURE,
  RESET_PASSWORD_SUCCESS,
  CREATE_PASSWORD,
  CREATE_PASSWORD_FAILURE,
  CREATE_PASSWORD_SUCCESS,
  CLAIM_ACCOUNT,
  CLEAR_ERRORS,
} = authTypes

const INITIAL_STATE = {
  username: '',
  password: '',
  confirmPassword: '',
  patient: '',
  medication: '',
  pharmNPI: '',
  location: '',
  pharmDate: '',
  writtenDate: '',
  salesCode: '',
  billOnDate: '',
  cost: '',
  rxNumber: '',
  primInsPay: '',
  diagnosis: '',
  secInsPay: '',
  secDiagnosis: '',
  patientPay: '',
  refills: '',
  refillsRemaining: '',
  quantity: '',
  daysSupply: '',
  directions: '',
  phone: '',
  email: '',
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
  const {type, payload} = action

  switch (type) {
    case EMAIL_CHANGED:
      return {
        ...state,
        email: payload,
      }
    case USERNAME_CHANGED:
      return {
        ...state,
        username: payload,
      }
    case PASSWORD_CHANGED:
      return {
        ...state,
        password: payload,
      }
    case CONFIRM_PASSWORD_CHANGED:
      return {
        ...state,
        confirmPassword: payload,
      }


    // Scripts
    case PATIENT_CHANGE:
      return {
        ...state,
        patient: payload
      }
    case MEDICATION_CHANGE:
      return {
        ...state,
        medication: payload
      }
    case PHARM_NPI_CHANGE:
      return {
        ...state,
        pharmNPI: payload
      }
    case LOCATION_CHANGE:
      return {
        ...state,
        location: payload
      }
    case PHARM_DATE_CHANGE:
      return {
        ...state,
        pharmDate: payload
      }
    case WRITTEN_DATE_CHANGE:
      return {
        ...state,
        writtenDate: payload
      }
    case SALES_CODE_CHANGE:
      return {
        ...state,
        salesCode: payload
      }
    case BILL_ON_DATE_CHANGE:
      return {
        ...state,
        billOnDate: payload
      }
    case COST_CHANGE:
      return {
        ...state,
        cost: payload
      }
    case RX_NUMBER_CHANGE:
      return {
        ...state,
        rxNumber: payload
      }
    case PRIMARY_INSURANCE_PAY_CHANGE:
      return {
        ...state,
        primInsPay: payload
      }
    case DIAGNOSIS_CHANGE:
      return {
        ...state,
        diagnosis: payload
      }
    case SECONDARY_INSURANCE_PAY_CHANGE:
      return {
        ...state,
        secInsPay: payload
      }
    case SECONDARY_DIAGNOSIS_CHANGE:
      return {
        ...state,
        secDiagnosis: payload
      }
    case PATIENT_PAY_CHANGE:
      return {
        ...state,
        patientPay: payload
      }
    case REFILLS_CHANGE:
      return {
        ...state,
        refills: payload
      }
    case REFILLS_REMAINING_CHANGE:
      return {
        ...state,
        refillsRemaining: payload
      }
    case QUANTITY_CHANGE:
      return {
        ...state,
        quantity: payload
      }
    case DAYS_SUPPLY_CHANGE:
      return {
        ...state,
        daysSupply: payload
      }
    case DIRECTIONS_CHANGE:
      return {
        ...state,
        directions: payload
      }
    case PHONE_CHANGE:
      return {
        ...state,
        phone: payload
      }
    case EMAIL_CHANGE:
      return {
        ...state,
        email: payload
      }


    case LOGIN:
      return {
        ...state,
        error: '',
        loading: true,
      }
    case LOGIN_SUCCESS:
      return {
        ...INITIAL_STATE,
      }
    case LOGIN_FAILURE:
      return {
        ...INITIAL_STATE,
        error: payload,
      }
    case GET_SELF:
      return {
        ...state,
        loading: true,
      }
    case GET_SELF_SUCCESS:
      return {
        ...state,
        me: payload,
        isAdmin: payload.role === 'admin',
        loading: false,
      }
    case GET_SELF_FAILURE:
      return {
        ...state,
        me: null,
        isAdmin: false,
        loading: false,
        error: payload,
      }
    case PATCH_SELF:
      return {
        ...state,
        loading: true,
      }
    case PATCH_SELF_SUCCESS:
      return {
        ...state,
        me: payload,
        loading: false,
      }
    case PATCH_SELF_FAILURE:
      return {
        ...state,
        loading: false,
        error: payload,
      }
    case RESET_PASSWORD:
      return {
        ...state,
        password: '',
        error: '',
        loading: true,
      }
    case RESET_PASSWORD_SUCCESS:
      return {
        ...state,
        loading: false,
      }
    case RESET_PASSWORD_FAILURE:
      return {
        ...state,
        error: payload,
        loading: false,
      }
    case CREATE_PASSWORD:
      return {
        ...state,
        error: '',
        loading: true,
      }
    case CLAIM_ACCOUNT:
      return {
        ...state,
        error: '',
        loading: true,
      }
    case CREATE_PASSWORD_SUCCESS:
      return {
        ...INITIAL_STATE,
      }
    case CREATE_PASSWORD_FAILURE:
      return {
        ...state,
        password: '',
        confirmPassword: '',
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
