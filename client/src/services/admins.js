// import { api } from 'app/config'
import { users } from '../test-data'

export default {
  getAll() {
    // const url = '/admins'
    // return api.get(url)
    return Promise.resolve({success: true, admins: users})
  },
}
