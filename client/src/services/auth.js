import { api } from '../config'

export default {
  login(data) {
    const url = '/auth/login'
    return api.post(url, data)
  },

  resetPassword(data) {
    const url = '/auth/reset-password'
    return api.post(url, data)
  },

  createPassword(data) {
    const url = '/auth/verify-email'
    return api.post(url, data)
  },

  claimAccount(data) {
    const url = '/auth/claim-account'
    return api.post(url, data)
  },
}
