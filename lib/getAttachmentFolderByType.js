module.exports = type => {
  switch (type) {
    case 'image':
      return 'images'
    case 'expense':
      return 'expenses'
    case 'script':
      return 'scripts'
    default:
      return ''
  }
}
