const Router = require('koa-joi-router');

const {
  apiV1: { auth },
} = require('../../controller');
const {
  apiV1: { auth: validator },
} = require('../../schema');
const {
  checkTokens: { access, refresh },
} = require('../../middleware');
const {
  server: {
    prefix: { AUTH },
  },
  ROLES: { USER, ORGANIZER },
} = require('../../../config');

const router = Router();

router.prefix(AUTH);

router.post('/registration', { validate: validator.registration }, auth.registration);
router.post('/login', { validate: validator.login }, auth.login);

router.get('/google', { validate: validator.google }, auth.google);

router.get('/refresh', { validate: validator.refresh }, refresh(), auth.refresh);
router.get('/logout', { validate: validator.logout }, access([USER, ORGANIZER]), auth.logout);

module.exports = router;
