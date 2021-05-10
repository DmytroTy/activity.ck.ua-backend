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

const google = {
  query: Joi.object({
    error: Joi.string(),
    code: Joi.string(),
  })
    .xor('error', 'code')
    .unknown(),
};

module.exports = { registration, login, refresh, logout, google };
