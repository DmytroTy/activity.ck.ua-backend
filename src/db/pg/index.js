const { Pool } = require('pg');
const users = require('./users');
const organizations = require('./organizations');
const places = require('./places');
const reviews = require('./reviews');
const photos = require('./photos');
const events = require('./events');
const activities = require('./activities');
const log = require('../../utils/logger')(__filename);

const name = 'pg';

module.exports = (config) => {
  const client = new Pool(config);
  const {
    createUser,
    getUser,
    checkUser,
    getUserCredentials,
    getUserToken,
    updateUser,
    deleteUser,
  } = users(client);
  const {
    createOrganization,
    getOrganizations,
    updateOrganization,
    deleteOrganization,
  } = organizations(client);
  const {
    createPlace,
    getPlace,
    getPlaces,
    getPlacesCount,
    isUserPlace,
    getUserPlaces,
    searchPlaces,
    searchPlacesByAddress,
    updatePlace,
    deletePlace,
  } = places(client);
  const { upsertReview, getReviews, updateReview, deleteReview } = reviews(client);
  const { addPhotos, getPhotos, deletePhotos } = photos(client);
  const {
    createEvent,
    getEvent,
    getEvents,
    getCurrentEvents,
    isUserEvent,
    getUserEvents,
    getPlaceEvents,
    searchEvents,
    updateEvent,
    deleteEvent,
  } = events(client);
  const {
    addFavoritePlace,
    addVisitedPlace,
    addScheduledEvent,
    getExplore,
    getFavoritePlaces,
    getVisitedPlaces,
    getScheduledEvents,
    detachFavoritePlace,
    detachVisitedPlace,
    detachScheduledEvent,
  } = activities(client);

  return {
    testConnection: async () => {
      try {
        log.info(`Hello from ${name} testConnection`);
        await client.query('SELECT NOW();');
      } catch (err) {
        log.error(err.message || err);
        throw err;
      }
    },

    close: async () => {
      log.info(`Closing ${name} DB wrapper`);
      client.end();
    },

    createUser,
    getUser,
    checkUser,
    getUserCredentials,
    getUserToken,
    updateUser,
    deleteUser,

    createOrganization,
    getOrganizations,
    updateOrganization,
    deleteOrganization,

    createPlace,
    getPlace,
    getPlaces,
    getPlacesCount,
    isUserPlace,
    getUserPlaces,
    searchPlaces,
    searchPlacesByAddress,
    updatePlace,
    deletePlace,

    upsertReview,
    getReviews,
    updateReview,
    deleteReview,

    addPhotos,
    getPhotos,
    deletePhotos,

    createEvent,
    getEvent,
    getEvents,
    getCurrentEvents,
    isUserEvent,
    getUserEvents,
    getPlaceEvents,
    searchEvents,
    updateEvent,
    deleteEvent,

    addFavoritePlace,
    addVisitedPlace,
    addScheduledEvent,
    getExplore,
    getFavoritePlaces,
    getVisitedPlaces,
    getScheduledEvents,
    detachFavoritePlace,
    detachVisitedPlace,
    detachScheduledEvent,
  };
};
