const stringifyAddress = address => {
  const {
    street1,
    street2,
    city,
    state,
    zip,
  } = address

  const street = `${street1} ${street2 ? `, ${street2}` : ''}`.trim()

  return `${street}, ${city}, ${state} ${zip}`
}

export default stringifyAddress
