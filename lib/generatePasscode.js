module.exports = () => {
  const randomString = String(Math.random()).split('.')[1]
  const passcode = randomString.slice(0, 6)
  return passcode
}
