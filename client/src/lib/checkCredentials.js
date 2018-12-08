import jwtDecode from 'jwt-decode'

export default () => {
  return new Promise((resolve, reject) => {
    const token = localStorage.getItem('token')
    try {
      if (!token) {
        throw new Error('Token not found')
      }
      const decoded = jwtDecode(token)
      if (!decoded.user) {
        throw new Error('User not found in token')
      }
      resolve(decoded)
    } catch (err) {
      return reject(err)
    }
  });
}
