const updateArrayWithItem = (array, item, field = 'id') => {
  const index = array.findIndex(el => el[field] === item[field])
  array[index] = item
  return [...array]
}

export default updateArrayWithItem
