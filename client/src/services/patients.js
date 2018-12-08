import { api } from '../config'

export default {
  getAll() {
    const url = '/patients'
    return api.get(url)
  },

  post(data) {
    const url = '/patients'
    return api.post(url, data)
  },

  getById(id) {
    const url = `/patients/${id}`
    return api.get(url)
  },

  patchById(id, update) {
    const url = `/patients/${id}`
    return api.patch(url, update)
  },

  postNoteById(id, update) {
    const url = `/patients/${id}/notes`
    return api.post(url, update)
  },
}
