/* eslint-disable no-undef */
const Jwt = require('@hapi/jwt');

const AuthenticationTestHelper = {
  generateTestToken: ({ id = 'user-123', username = 'dicoding' } = {}) => {
    return Jwt.token.generate(
      {
        id,
        username,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + (60 * 60), // 1 jam
      },
      process.env.ACCESS_TOKEN_KEY
    );
  },
};

module.exports = AuthenticationTestHelper;
