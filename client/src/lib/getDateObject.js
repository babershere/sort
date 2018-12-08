export default () => {
  const now = new Date()
  return {
    date: now.getDate(),
    month: now.getMonth(),
    year: now.getFullYear(),
  }
}
