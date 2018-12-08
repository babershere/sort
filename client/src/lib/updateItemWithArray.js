const updateItemWithArray = (item, array) => {
  const updated = array.find(newItem => newItem.id === item.id)
  return updated || item
}

export default updateItemWithArray
