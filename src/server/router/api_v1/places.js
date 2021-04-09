const Router = require('koa-joi-router');

const {
  apiV1: { places },
} = require('../../controller');
const {
  apiV1: { places: validator },
} = require('../../schema');
const {
  checkTokens: { access },
} = require('../../middleware');
const {
  server: {
    prefix: { PLACES },
  },
  ROLES: { USER, ORGANIZER },
} = require('../../../config');

const router = Router();

router.prefix(PLACES);

router.post('/', { validate: validator.create }, access(['user', 'organizer']), places.create);
router.get('/:id', { validate: validator.getOne }, places.getOne);
router.get('/', { validate: validator.getApproved }, places.getApproved);
router.put('/:id', { validate: validator.update }, access(), places.update);
router.delete('/:id', { validate: validator.remove }, access(), places.remove);

router.post(
  '/:id/reviews/',
  { validate: validator.addReview },
  access([USER, ORGANIZER]),
  places.addReview,
);
router.get('/:id/reviews/', { validate: validator.getReviews }, places.getReviews);

router.post(
  '/:id/attends/',
  { validate: validator.addAttend },
  access([USER, ORGANIZER]),
  places.addAttend,
);

router.post(
  '/:id/favorites/',
  { validate: validator.addFavorite },
  access([USER, ORGANIZER]),
  places.addFavorite,
);

module.exports = router;
