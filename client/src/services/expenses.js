import { api } from '../config'

export default {
  getAll() {
    const url = '/expenses'
    return api.get(url)
  },

  post(data) {
    const url = '/expenses'
    return api.post(url, data)
  },

  patchById(id, update) {
    const url = `/expenses/${id}`
    return api.patch(url, update)
  },

  patchStatus({userId, expenseId, ...update}) {
    const url = `/users/${userId}/expenses/${expenseId}`
    return api.patch(url, update)
  },

  bulkPatch({userId, ...update}) {
    const url = `/users/${userId}/expenses`
    return api.patch(url, update)
  },

  deleteById(id) {
    const url = `/expenses/${id}`
    return api.delete(url)
  },
}
