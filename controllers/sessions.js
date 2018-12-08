const { Op } = require('sequelize')
const { Session } = require('../models')
const OpenSession = Session.scope('open')

module.exports = {
  closeOtherOpenSessions(userIds = []) {
    // update the open sessions that have not been closed out
    const update = { out: new Date() }
    const query = {
      where: {
        userId: { [Op.notIn]: userIds },
      },
    }
    console.log('bulk closing open sessions');
    return OpenSession.update(update, query)
  },

  closeSessionByUserId(userId) {
    const update = { out: new Date() }
    const query = {
      where: {
        userId,
      },
    }
    console.log('closing single open session');
    return OpenSession.update(update, query)
  },

  createSessionByUserId(userId) {
    const data = { userId }
    const options = { where: data }
    console.log('finding or creating user session');
    return OpenSession.findOrCreate(options)
      .spread((session, created) => session)
  },
}
