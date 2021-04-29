const { Joi } = require('koa-joi-router');

const {
  places: {
    schema: { PHONE },
  },
  REVIEW: { RATING },
} = require('../../../config');

const DAYS = ['sat', 'mon', 'tue', 'wed', 'thu', 'fri', 'sun'];
const TIME = /^\d{1,2}:\d{2}$/;
const TYPE_IDS = /^[\w-]+$/;

const create = {
  // header: Joi.object({
  //   authorization: Joi.string()
  //     .pattern(/^[a-zA-Z]+ .+$/)
  //     .required(),
  // }).unknown(),
  body: Joi.object({
    organization_id: Joi.number().min(0),
    organization: Joi.object({
      name: Joi.string().min(3).max(255).required(),
      phones: Joi.array().items(Joi.string().pattern(PHONE).required()).required(),
      email: Joi.string().email().required(),
    }),
    place: Joi.object({
      name: Joi.string().min(3).max(255).required(),
      category_id: Joi.string().min(3).max(255).required(), // change to ENUM
      type_id: Joi.string().pattern(TYPE_IDS),
      address: Joi.string().min(3).max(255).required(),
      phones: Joi.array().items(Joi.string().pattern(PHONE)).default([]),
      website: Joi.alternatives(Joi.allow(null), Joi.string().uri({ allowRelative: true })),
      work_time: Joi.object()
        .min(1)
        .pattern(
          new RegExp(`^(${DAYS.join('|')})$`),
          Joi.object({
            start: Joi.string().pattern(TIME).required(),
            end: Joi.string().pattern(TIME).required(),
          }).required(),
        )
        .required(),
      accessibility: Joi.boolean().required(),
      dog_friendly: Joi.boolean().required(),
      child_friendly: Joi.boolean().required(),
      description: Joi.string().min(20).required(),
      main_photo: Joi.string().uri().required(),
    }),
    photos: Joi.array()
      .items(
        Joi.object({
          url: Joi.string().uri().required(),
          author_name: Joi.string().min(3).max(255),
          author_link: Joi.string().uri(),
        }).required(),
      )
      .required(),
  }).xor('organization_id', 'organization'),
  type: 'json',
};

const getOne = {
  params: Joi.object({
    id: Joi.string()
      .pattern(/^[1-9]\d*$/)
      .required(),
  }),
};

const getApproved = {
  query: Joi.object({
    category_id: Joi.string(),
    type_id: Joi.string().pattern(TYPE_IDS),
    accessibility: Joi.boolean().truthy('true').falsy('false'),
    dog_friendly: Joi.boolean().truthy('true').falsy('false'),
    child_friendly: Joi.boolean().truthy('true').falsy('false'),
    unexplored: Joi.boolean().truthy('true').falsy('false'),
    _page: Joi.string()
      .pattern(/^[1-9]\d*$/)
      .required(),
    _limit: Joi.string()
      .pattern(/^[1-9]\d*$/)
      .required(),
  }).xor('category_id', 'type_id'),
};

const update = {
  // header: Joi.object({
  //   authorization: Joi.string()
  //     .pattern(/^[a-zA-Z]+ .+$/)
  //     .required(),
  // }).unknown(),
  params: Joi.object({
    id: Joi.string()
      .pattern(/^[1-9]\d*$/)
      .required(),
  }),
  body: Joi.object({
    organization_id: Joi.number().min(0),
    place: Joi.object({
      name: Joi.string().min(3).max(255),
      category_id: Joi.string().min(3).max(255), // change to ENUM
      type_id: Joi.string().pattern(TYPE_IDS),
      address: Joi.string().min(3).max(255),
      phones: Joi.array().items(Joi.string().pattern(PHONE).required()),
      website: Joi.alternatives(Joi.allow(null), Joi.string().uri({ allowRelative: true })),
      work_time: Joi.object()
        .min(1)
        .pattern(
          new RegExp(`^(${DAYS.join('|')})$`),
          Joi.object({
            start: Joi.string().pattern(TIME).required(),
            end: Joi.string().pattern(TIME).required(),
          }).required(),
        ),
      accessibility: Joi.boolean(),
      dog_friendly: Joi.boolean(),
      child_friendly: Joi.boolean(),
      description: Joi.string().min(20),
      main_photo: Joi.string().uri(),
      moderated: Joi.boolean(),
    }),
  }).or(
    'place.name',
    'place.category_id',
    'place.typeId',
    'place.address',
    'place.phones',
    'place.website',
    'place.work_time',
    'place.accessibility',
    'place.dog_friendly',
    'place.child_friendly',
    'place.description',
    'place.main_photo',
    'place.moderated',
  ),
  type: 'json',
};

const remove = {
  // header: Joi.object({
  //   authorization: Joi.string()
  //     .pattern(/^[a-zA-Z]+ .+$/)
  //     .required(),
  // }).unknown(),
  params: Joi.object({
    id: Joi.string()
      .pattern(/^[1-9]\d*$/)
      .required(),
  }),
};

const upsertReview = {
  // header: Joi.object({
  //   authorization: Joi.string()
  //     .pattern(/^[a-zA-Z]+ .+$/)
  //     .required(),
  // }).unknown(),
  params: Joi.object({
    id: Joi.string()
      .pattern(/^[1-9]\d*$/)
      .required(),
  }),
  body: Joi.object({
    rating: Joi.number().integer().min(RATING.MIN).max(RATING.MAX).required(),
    comment: Joi.alternatives(Joi.allow(null), Joi.string()).required(),
  }),
  type: 'json',
};

const getReviews = {
  params: Joi.object({
    id: Joi.string()
      .pattern(/^[1-9]\d*$/)
      .required(),
  }),
  query: Joi.object({
    _page: Joi.string()
      .pattern(/^[1-9]\d*$/)
      .required(),
    _limit: Joi.string()
      .pattern(/^[1-9]\d*$/)
      .required(),
  }),
};

const updateReview = {
  // header: Joi.object({
  //   authorization: Joi.string()
  //     .pattern(/^[a-zA-Z]+ .+$/)
  //     .required(),
  // }).unknown(),
  params: Joi.object({
    id: Joi.string()
      .pattern(/^[1-9]\d*$/)
      .required(),
  }),
  body: Joi.object({
    user_id: Joi.number().integer().min(1).required(),
    rating: Joi.number().integer().min(RATING.MIN).max(RATING.MAX),
    comment: Joi.alternatives(Joi.allow(null), Joi.string()),
  }).or('rating', 'comment'),
  type: 'json',
};

const deleteReview = {
  // header: Joi.object({
  //   authorization: Joi.string()
  //     .pattern(/^[a-zA-Z]+ .+$/)
  //     .required(),
  // }).unknown(),
  params: Joi.object({
    id: Joi.string()
      .pattern(/^[1-9]\d*$/)
      .required(),
  }),
  body: Joi.object({
    user_id: Joi.number().integer().min(1).required(),
  }),
  type: 'json',
};

module.exports = {
  create,
  getOne,
  getApproved,
  update,
  remove,
  upsertReview,
  getReviews,
  updateReview,
  deleteReview,
};
