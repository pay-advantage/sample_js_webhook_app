const axios = require('axios');
require('dotenv').config();

let token = null;

// Function to log into Pay Advantage and get a new token
async function login() {
  try {

    const response = await axios.post(`${process.env.API_URL}/v3/token`, {
      grant_type: "password",
      username: `${process.env.API_USERNAME}`,
      password: `${process.env.API_PASSWORD}`
    },{headers:{'Content-Type':'application/json'}})

    token = {authToken: response.data.access_token, tokenExpiry: Date.now() + ( response.data.expires_in - 60 ) * 1000, tokenType: response.data.token_type};

    return token;
  } catch (error) {
    throw new Error(`Login failed. Error: ${error}`);
  }
}

// Middleware function to handle authentication
async function authenticate(req, res, next) {
  // If token is available and not expired, use it
  if (token !== null && token.authToken && token.tokenExpiry > Date.now()) {
    req.headers['Authorization'] = `${tokenType} ${authToken}`;
    next();
  } else {
    try {
      // If token is expired or not available, log in and get a new token
      const newToken = await login();

      req.headers['Authorization'] = `Bearer ${newToken.authToken}`;
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Authentication failed.' });
    }
  }
}

module.exports = {
  login,
  authenticate
};