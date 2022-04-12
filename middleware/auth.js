// This middleware is used to verify/authroize the users from accessing protected data
// we can use this in the routes

const jwt = require('jsonwebtoken')
const config = require('config')


module.exports = function(req, res, next){
  // Get the token from the header
  // we send the token within the header when we make a request to a secured route
  const token = req.header('x-auth-token')
  // x-auth-token is the header key in which the token is sent
  
  // check if a token is passed
  if(!token){
    return res.status(401).json({ msg:'No Token, Authorization denied' })
  }

  // Verify token
  try{
    const decoded = jwt.verify(token,config.get('jsonwebSecret'));
    // once the user is authorized
    // as it is now stored in the req object we can use it anywhere it basically acts like a session variable
    req.user = decoded.user;
    next();
  }catch(err){
    res.status(401).json({ msg:'Token is not valid' })
  }


}