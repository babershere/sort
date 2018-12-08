import { api } from '../config'

export default {
  getAll() {
    const url = '/physicians'
    return api.get(url)
  },

  post(data) {
    const url = '/physicians'
    return api.post(url, data)
  },

  getById(id) {
    const url = `/physicians/${id}`
    return api.get(url)
  },

  patchById(id, update) {
    const url = `/physicians/${id}`
    return api.patch(url, update)
  },
}
