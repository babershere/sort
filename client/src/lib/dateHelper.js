import moment from 'moment'

export const unformatDate = date => moment(date, 'YYYY-MM-DD').toISOString()

export const formatDate = date => moment(date).format('YYYY-MM-DD')
