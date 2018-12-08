import * as phoneLib from 'libphonenumber-js'

export const formatNumber = phone => {
  if (!phone) {
    return ''
  }

  const country = 'US'

  return phoneLib.formatNumber({phone, country}, 'National')
}

export const unformatNumber = phone => {
  return phoneLib.parseNumber(phone, 'US').phone
}

export const parseNumber = phone => {
  return phoneLib.parseNumber(phone, 'US')
}

export const AsYouType = phoneLib.AsYouType
