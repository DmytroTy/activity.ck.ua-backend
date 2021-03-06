const { Joi } = require('koa-joi-router');

const getUser = {
  header: Joi.object({
    authorization: Joi.string()
      .pattern(/^[a-zA-Z]+ .+$/)
      .required(),
  }).unknown(),
};

const addVisitedPlace = {
  header: Joi.object({
    authorization: Joi.string()
      .pattern(/^[a-zA-Z]+ .+$/)
      .required(),
  }).unknown(),
  params: Joi.object({
    placeId: Joi.string()
      .pattern(/^[1-9]\d*$/)
      .required(),
  }),
};

const getVisitedPlaces = {
  header: Joi.object({
    authorization: Joi.string()
      .pattern(/^[a-zA-Z]+ .+$/)
      .required(),
  }).unknown(),
  query: Joi.object({
    _page: Joi.string()
      .pattern(/^[1-9]\d*$/)
      .required(),
    _limit: Joi.string()
      .pattern(/^[1-9]\d*$/)
      .required(),
  }),
};

const deleteVisitedPlace = {
  header: Joi.object({
    authorization: Joi.string()
      .pattern(/^[a-zA-Z]+ .+$/)
      .required(),
  }).unknown(),
  params: Joi.object({
    placeId: Joi.string()
      .pattern(/^[1-9]\d*$/)
      .required(),
  }),
};

const addFavoritePlace = {
  header: Joi.object({
    authorization: Joi.string()
      .pattern(/^[a-zA-Z]+ .+$/)
      .required(),
  }).unknown(),
  params: Joi.object({
    placeId: Joi.string()
      .pattern(/^[1-9]\d*$/)
      .required(),
  }),
};

const getFavoritePlaces = {
  header: Joi.object({
    authorization: Joi.string()
      .pattern(/^[a-zA-Z]+ .+$/)
      .required(),
  }).unknown(),
  query: Joi.object({
    _page: Joi.string()
      .pattern(/^[1-9]\d*$/)
      .required(),
    _limit: Joi.string()
      .pattern(/^[1-9]\d*$/)
      .required(),
  }),
};

const deleteFavoritePlace = {
  header: Joi.object({
    authorization: Joi.string()
      .pattern(/^[a-zA-Z]+ .+$/)
      .required(),
  }).unknown(),
  params: Joi.object({
    placeId: Joi.string()
      .pattern(/^[1-9]\d*$/)
      .required(),
  }),
};

const addScheduledEvent = {
  header: Joi.object({
    authorization: Joi.string()
      .pattern(/^[a-zA-Z]+ .+$/)
      .required(),
  }).unknown(),
  params: Joi.object({
    eventId: Joi.string()
      .pattern(/^[1-9]\d*$/)
      .required(),
  }),
};
const getScheduledEvents = {
  header: Joi.object({
    authorization: Joi.string()
      .pattern(/^[a-zA-Z]+ .+$/)
      .required(),
  }).unknown(),
  query: Joi.object({
    _page: Joi.string()
      .pattern(/^[1-9]\d*$/)
      .required(),
    _limit: Joi.string()
      .pattern(/^[1-9]\d*$/)
      .required(),
  }),
};
const deleteScheduledEvent = {
  header: Joi.object({
    authorization: Joi.string()
      .pattern(/^[a-zA-Z]+ .+$/)
      .required(),
  }).unknown(),
  params: Joi.object({
    eventId: Joi.string()
      .pattern(/^[1-9]\d*$/)
      .required(),
  }),
};

const getPlaces = {
  header: Joi.object({
    authorization: Joi.string()
      .pattern(/^[a-zA-Z]+ .+$/)
      .required(),
  }).unknown(),
  query: Joi.object({
    _page: Joi.string()
      .pattern(/^[1-9]\d*$/)
      .required(),
    _limit: Joi.string()
      .pattern(/^[1-9]\d*$/)
      .required(),
  }),
};

const getEvents = {
  header: Joi.object({
    authorization: Joi.string()
      .pattern(/^[a-zA-Z]+ .+$/)
      .required(),
  }).unknown(),
  query: Joi.object({
    _page: Joi.string()
      .pattern(/^[1-9]\d*$/)
      .required(),
    _limit: Joi.string()
      .pattern(/^[1-9]\d*$/)
      .required(),
  }),
};

const getExplore = {
  header: Joi.object({
    authorization: Joi.string()
      .pattern(/^[a-zA-Z]+ .+$/)
      .required(),
  }).unknown(),
  query: Joi.object({
    category_id: Joi.string().min(3),
  }),
};

module.exports = {
  getUser,
  addVisitedPlace,
  getVisitedPlaces,
  deleteVisitedPlace,
  addFavoritePlace,
  getFavoritePlaces,
  deleteFavoritePlace,
  addScheduledEvent,
  getScheduledEvents,
  deleteScheduledEvent,
  getPlaces,
  getEvents,
  getExplore,
};
