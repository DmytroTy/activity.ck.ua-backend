const { getUserToken } = require('../../db');
const {
  authorizationTokens: { verifyAccessToken, verifyRefreshToken },
  hash,
} = require('../../utils');
const {
  ROLES: { EVERY, MODERATOR },
} = require('../../config');

function isRolePermissible(roles, userRole) {
  const isModerator = userRole === MODERATOR;
  const isPermissible = roles.find((role) => role === userRole || role === EVERY);

  if (isModerator || isPermissible) {
    return true;
  }

  return false;
}

function getToken(authorization) {
  if (authorization) {
    return authorization.split(' ')[1];
  }
  return false;
}

function access(roles = []) {
  return async (ctx, next) => {
    try {
      let data = { role: EVERY };

      const token = getToken(ctx);
      if (token) {
        data = await verifyAccessToken(token);
      }

      ctx.assert(isRolePermissible(roles, data.role), 401, `Access denied`);

      ctx.state.authPayload = data;

      return next();
    } catch (err) {
      return ctx.throw(403, err);
    }
  };
}

function refresh() {
  return async (ctx, next) => {
    try {
      const token = getToken(ctx.headers.authorization);
      const payload = await verifyRefreshToken(token);

      const { refresh_token: userToken } = await getUserToken(payload.id);
      ctx.assert(userToken, 401, 'Incorrect user`s token');

      const isUserToken = hash.compare(hash.create(token), userToken);
      ctx.assert(isUserToken, 401, 'Token deprecated');

      ctx.state.authPayload = payload;

      return next();
    } catch (err) {
      return ctx.throw(403, err);
    }
  };
}

module.exports = { access, refresh };
