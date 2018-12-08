import { api } from '../config'
// import { user } from '../test-data'

// Private Methods
function getUsersByRole(role) {
  const url = `/users?roles=${role}`
  return api.get(url)
}

// Public Methods
export default {
  post(data) {
    const url = '/users'
    return api.post(url, data)
  },

  getTeam() {
    return getUsersByRole('admin,rep')
  },

  getReps() {
    return getUsersByRole('rep')
  },

  getPhysicians() {
    const url = '/physicians'
    return api.get(url)
  },

  getById(id) {
    const url = `/users/${id}`
    return api.get(url)
  },

  patchById(id, update) {
    const url = `/users/${id}`
    return api.patch(url, update)
  },

  getSelf() {
    const url = '/users/me'
    return api.get(url)
  },

  patchSelf(data) {
    const url = '/users/me'
    return api.patch(url, data)
  },
}
