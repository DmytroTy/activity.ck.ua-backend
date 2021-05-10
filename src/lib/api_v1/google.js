const { google } = require('googleapis');

const {
  AUTH: {
    GOOGLE: { CLIENT_ID, CLIENT_SECRET, REDIRECT_URL },
  },
} = require('../../config');

const oAuth2Client = new google.auth.OAuth2({
  clientId: CLIENT_ID,
  clientSecret: CLIENT_SECRET,
  redirectUri: REDIRECT_URL,
});

async function getUserPayload(code) {
  const ticket = await oAuth2Client.getToken(code);
  const { payload } = await oAuth2Client.verifyIdToken({
    idToken: ticket.tokens.id_token,
  });

  return payload;
}

module.exports = { getUserPayload };
