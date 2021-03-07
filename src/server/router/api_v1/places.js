const Router = require('koa-joi-router');

const {
  apiV1: { places },
} = require('../../controller');
const {
  apiV1: { places: validator },
} = require('../../schema');
const {
  server: {
    prefix: { PLACES },
  },
} = require('../../../config');

const router = new Router();

router.prefix(PLACES);

router.post('/', { validate: validator.create }, places.create);
router.get('/:id', { validator: validator.getOne }, places.getOne);
router.get('/', { validate: validator.getAll }, places.getAll);

module.exports = router;
