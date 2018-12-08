import axios from 'axios'
// import uri from './uri'

// const baseURL = `http://localhost:3000/`
/* console.log(baseURL);
  // Configure Axios
axios.interceptors.request.use(config => {
    config.headers = {
      'x-access-token': localStorage.getItem('token'),
    }
    config.baseURL = baseURL
    return config
  }, error => {
    return Promise.reject(error)
  }
)
axios.interceptors.response.use(res => {
    return res && res.data
  }, error => {
    return Promise.reject(error && error.response && error.response.data)
  }
) */

export default axios
