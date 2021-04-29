const Router = require('koa-joi-router');

const {
  apiV1: { auth },
} = require('../../controller');
const {
  apiV1: { auth: validator },
} = require('../../schema');
const {
  checkTokens: { refresh },
} = require('../../middleware');
const {
  server: {
    prefix: { AUTH },
  },
} = require('../../../config');

const router = Router();

router.prefix(AUTH);

router.post('/registration', { validate: validator.registration }, auth.registration);
router.get(
  '/registration/google',
  { validate: validator.googleRegistration },
  auth.googleRegistration,
);
router.get(
  '/registration/facebook',
  { validate: validator.facebookRegistration },
  auth.facebookRegistration,
);
router.post('/login', { validate: validator.login }, auth.login);
router.get('/login/google', { validate: validator.googleLogin }, auth.googleLogin);
router.get('/login/facebook', { validate: validator.facebookLogin }, auth.facebookLogin);
router.get('/refresh', { validate: validator.refresh }, refresh(), auth.refresh);
router.get('/logout', { validate: validator.logout }, refresh(), auth.logout);

module.exports = router;
