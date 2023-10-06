
async function authenticate(req, res, next) {
    //add your internal applications token checking here

    next();

    //Do not pass in the next function if the token is failing
    
  }

module.exports = {
    authenticate
  };