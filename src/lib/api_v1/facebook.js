const { Facebook } = require('fb');

const {
  AUTH: {
    FACEBOOK: {
      CLIENT_ID,
      CLIENT_SECRET,
      REDIRECT_URLS: { LOGIN, REGISTRATION },
    },
  },
} = require('../../config');

const FB = new Facebook();
FB.options({ version: 'v10.0' });

async function getUser(code, isLogin) {
  const { access_token: accessToken } = await FB.api('oauth/access_token', {
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    redirect_uri: isLogin ? LOGIN : REGISTRATION,
    code,
  });

  const user = await FB.api('me', {
    fields: ['id', 'name', 'picture'],
    access_token: accessToken,
  });

  return user;
}

module.exports = { getUser };
