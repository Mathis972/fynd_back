const jwt = require('jsonwebtoken')

const JWT_SIGN_SECRET = 'cThIIoDvwdueQB468K5xDc5633seEFoqwxjF_xSJyQQ'
module.exports = {
  generateTokenForUser : function(userData){
    return jwt.sign({
      userId : userData.id
    },JWT_SIGN_SECRET,
    {
      expiresIn : '1h'
    })
  }
}