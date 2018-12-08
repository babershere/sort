const router = require('express').Router()
const auth = require('../controllers').auth
const salesRepresentatives = require('../controllers').salesRepresentatives


/* User is trying to log in */
router.post('/auth/login', auth.login)

/* Sales Representative is trying to verify themselves */
router.post('/salesRepresentative/verify', salesRepresentatives.verify)

/* For any other request, needs to be authenticated */
router.use(auth.authentication)

module.exports = router
