const Router = require('koa-joi-router');

const {
  apiV1: { users },
} = require('../../../controller');
const myselfRouter = require('./myself');
const {
  server: {
    prefix: { USERS },
  },
} = require('../../../../config');

const router = Router();
router.prefix(USERS.path);

router.head('/email/:email/free', users.emailFree);

router.use(myselfRouter);

module.exports = router;
