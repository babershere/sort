import checkCredentials from './checkCredentials'

export default () => {
  return checkCredentials()
    .then(({ type }) => {
      if (type === 'auth') {
        return Promise.resolve()
      } else {
        return Promise.reject({message: 'incorrect token type'})
      }
    })
}
