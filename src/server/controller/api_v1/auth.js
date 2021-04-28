const { createUser, updateUser, getUserCredentials } = require('../../../db');
const { hash, authorizationTokens } = require('../../../utils');
const { google } = require('../../../lib/api_v1');
const {
  AUTH: { GOOGLE },
} = require('../../../config');
const log = require('../../../utils/logger')(__filename);

function getPasswordHash(email, password) {
  return hash.create(`${email}${password}`);
}

async function getUserTokens(id, role) {
  const payload = { id, role };
  const tokens = {
    access_token: await authorizationTokens.generateAccessToken(payload),
    refresh_token: await authorizationTokens.generateRefreshToken(payload),
  };

  const hashedRefresh = hash.create(tokens.refresh_token);
  await updateUser({ id, refresh_token: hashedRefresh });

  return tokens;
}

async function validateUser(email, password = '') {
  const user = await getUserCredentials(email);
  if (!user) {
    return false;
  }
  if (user.password_hash && password) {
    const passwordHash = getPasswordHash(email, password);
    const isCompared = hash.compare(passwordHash, user.password_hash);
    if (!isCompared) {
      return false;
    }
  } else if (!password !== !user.password_hash) {
    return false;
  }

  return user;
}

async function registration(ctx) {
  const { name, avatar, email, password } = ctx.request.body;
  const passwordHash = getPasswordHash(email, password);
  const user = { name, avatar, email, passwordHash };
  const userDB = await createUser(user);

  ctx.body = {
    user_id: userDB.id,
  };
}

async function login(ctx) {
  const { email, password } = ctx.request.body;
  const user = await validateUser(email, password);
  ctx.assert(user, 403, 'Incorrect credentials');
  const tokens = await getUserTokens(user.id, user.role);

  ctx.body = tokens;
}

async function refresh(ctx) {
  const { id, role } = ctx.state.authPayload;

  const tokens = await getUserTokens(id, role);

  ctx.body = tokens;
}

async function logout(ctx) {
  const { authPayload } = ctx.state;

  await updateUser({ id: authPayload.id, refresh_token: null });

  ctx.body = { message: 'OK' };
}

async function googleIfError(ctx, next) {
  if (ctx.request.query.error) {
    const { error } = ctx.request.query;
    log.error(`Google authorization error: ${error}`);
    return ctx.throw(400, error);
  }

  return next();
}

async function serviceRegistration(ctx) {
  try {
    const payload = await google.getUserPayloadRegistration(ctx.request.query.code);
    if (payload.aud !== GOOGLE.CLIENT_ID) {
      ctx.throw(403, 'Incorrect credentials');
    }

    const newUser = {
      name: payload.name,
      avatar: payload.picture,
      email: hash.create(payload.sub),
    };
    const user = await createUser(newUser);

    const tokens = await getUserTokens(user.id, user.role);

    ctx.body = tokens;
  } catch (err) {
    if (err.message === 'invalid_grant') {
      ctx.throw(403, 'incorrect code');
    }
    ctx.throw(err);
  }
}

async function serviceLogin(ctx) {
  try {
    const payload = await google.getUserPayloadLogin(ctx.request.query.code);
    if (payload.aud !== GOOGLE.CLIENT_ID) {
      ctx.throw(403, 'Incorrect credentials');
    }

    const user = await validateUser(hash.create(payload.sub));
    ctx.assert(user, 403, 'Incorrect credentials');
    // update user if avatar or name changed

    const tokens = await getUserTokens(user.id, user.role);

    ctx.body = tokens;
  } catch (err) {
    if (err.message === 'invalid_grant') {
      ctx.throw(403, 'incorrect code');
    }
    ctx.throw(err);
  }
}

module.exports = {
  registration,
  login,
  refresh,
  logout,
  googleRegistration: [googleIfError, serviceRegistration],
  googleLogin: [googleIfError, serviceLogin],
};
