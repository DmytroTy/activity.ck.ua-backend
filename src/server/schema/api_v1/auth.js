const { Joi } = require('koa-joi-router');

const registration = {
  body: Joi.object({
    name: Joi.string().min(3).max(255).required(),
    avatar: Joi.string().uri().required(),
    email: Joi.string().email().required(),
    password: Joi.string().pattern(/^\w+$/).min(8).max(255).required(),
  }),
  type: 'json',
};

const login = {
  body: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().pattern(/^\w+$/).min(8).max(255).required(),
  }),
  type: 'json',
};

const refresh = {
  header: Joi.object({
    authorization: Joi.string()
      .pattern(/^[a-zA-Z]+ .+$/)
      .required(),
  }).unknown(),
};

const logout = {
  header: Joi.object({
    authorization: Joi.string()
      .pattern(/^[a-zA-Z]+ .+$/)
      .required(),
  }).unknown(),
};

const googleRegistration = {
  query: Joi.object({
    error: Joi.string(),
    code: Joi.string(),
  })
    .xor('error', 'code')
    .unknown(),
};

const googleLogin = {
  query: Joi.object({
    error: Joi.string(),
    code: Joi.string(),
  })
    .xor('error', 'code')
    .unknown(),
};

const facebookRegistration = {
  query: Joi.object({
    code: Joi.string(),
  }).unknown(),
};

const facebookLogin = {
  query: Joi.object({
    code: Joi.string(),
  }).unknown(),
};

module.exports = {
  registration,
  login,
  refresh,
  logout,
  googleRegistration,
  googleLogin,
  facebookRegistration,
  facebookLogin,
};
