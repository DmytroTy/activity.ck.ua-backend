const {
  init,
  end,
  createUser,
  checkUser,
  updateUser,
  createOrganization,
  updateOrganization,
  createPlace,
  updatePlace,
  createEvent,
  updateEvent,
  addPhotos,
} = require('../index');
const { faker } = require('../../lib/api_v1');
const {
  ROLES,
  errors: { DATABASE },
} = require('../../config');
const log = require('../../utils/logger')(__filename);

const MODERATOR = {
  name: 'moderator',
  avatar:
    'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Circle-icons-profile.svg/1200px-Circle-icons-profile.svg.png',
  email: 'moderator@tourism.test.com',
  password: '12345678',
};
const SEEDS_QUANTITY = 50;
const PARAMS = {
  COUNT: 'count',
  USER: 'user_id',
  ORGANIZATION: 'organization_id',
};

async function initDefault() {
  const user = await checkUser(MODERATOR.email);
  let userId;
  if (!user) {
    const { id } = await createUser(MODERATOR);
    userId = id;
  } else {
    userId = user.id;
  }
  await updateUser({ id: userId, role: ROLES.MODERATOR });

  log.info(`MODERATOR with id ${userId} created\n`);

  const { id: organizationId } = await createOrganization({
    ...faker.organization(),
    user_id: userId,
  });
  await updateOrganization({ id: organizationId, moderated: true });

  log.info(`ORGANIZATION with id ${organizationId} created\n`);

  return { userId, organizationId };
}

function getParamValue(params, name) {
  const userParam = params.find((param) => param.includes(name));
  if (userParam) {
    return Number.parseInt(userParam.slice(userParam.indexOf('=') + 1), 10) || null;
  }
  return null;
}

async function userAndOrganizationIds(params) {
  let userId = getParamValue(params, PARAMS.USER);
  if (!userId) {
    const user = await createUser(faker.user());
    userId = user.id;
  }

  let organizationId = getParamValue(params, PARAMS.ORGANIZATION);
  if (!organizationId) {
    const organization = await createOrganization({ ...faker.organization(), user_id: userId });
    organizationId = organization.id;
  }

  return { userId, organizationId };
}

async function createPlaceOrEvent(userId, organizationId, type) {
  try {
    let id;

    try {
      const creator = {
        user_id: userId,
        organization_id: organizationId,
      };

      if (type === 'place') {
        const place = await createPlace({ ...faker.place(), ...creator });
        id = place.id;
      } else {
        const event = await createEvent({ ...faker.event(), ...creator });
        id = event.id;
      }
    } catch (err) {
      if (err.name === DATABASE) {
        throw err;
      } else {
        throw new Error(`No user with id ${userId} or/and organization with id ${organizationId}`);
      }
    }

    if (type === 'place') {
      await updatePlace({ id, moderated: true });
    } else {
      await updateEvent({ id, moderated: true });
    }

    const photos = faker.photos();
    await addPhotos(photos, id, `${type}_id`);

    log.info(`${type} ${id} created`);
  } catch (err) {
    log.error(`Cannot create ${type}: ${err.message}`);
  }
}

async function initPlaces(params) {
  const count = getParamValue(params, PARAMS.COUNT) || SEEDS_QUANTITY;

  const { userId, organizationId } = await userAndOrganizationIds(params);

  const places = [];
  for (let i = 1; i <= count; i += 1) {
    places.push(createPlaceOrEvent(userId, organizationId, 'place'));
  }
  await Promise.all(places);
}

async function initEvents(params) {
  const count = getParamValue(params, PARAMS.COUNT) || SEEDS_QUANTITY;

  const { userId, organizationId } = await userAndOrganizationIds(params);

  const events = [];
  for (let i = 1; i <= count; i += 1) {
    events.push(createPlaceOrEvent(userId, organizationId, 'event'));
  }
  await Promise.all(events);
}

async function start() {
  const type = process.argv.slice(2, 3).toString();
  const params = process.argv.slice(3);

  try {
    await init();

    switch (type) {
      case 'default':
        await initDefault();
        break;

      case 'places':
        await initPlaces(params);
        break;

      case 'events':
        await initEvents(params);
        break;

      default:
        await initDefault();
        break;
    }
  } catch (err) {
    log.fatal(err);
  } finally {
    await end();
    process.exit(0);
  }
}

start();
