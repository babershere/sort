import { api } from '../config'

export default {
  getAll() {
    const url = '/scripts'
    return api.get(url)
  },

  post(data) {
    const url = '/api/scripts/create'
    return api.post(url, data)
  },

  getById(id) {
    const url = `/scripts/${id}`
    return api.get(url)
  },

  patchById(id, update) {
    const url = `/scripts/${id}`
    return api.patch(url, update)
  },

  postNoteById(id, update) {
    const url = `/scripts/${id}/notes`
    return api.post(url, update)
  },
}
