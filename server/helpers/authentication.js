var jwt = require('jsonwebtoken');

const authenticate = function(req, res, next){
  // res.send({message: "dari authentication", token: req.headers.token})
    jwt.verify(req.headers.token, 'heraldoyp', function(err, decoded){
    if(!err){
      console.log(decoded)
      next()
    }else{
      res.send({message: "Gaada JWT bro"})
      console.log(err)
    }
  })
}

module.exports = authenticate