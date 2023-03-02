const jwt = require('jsonwebtoken');
const secret = 'RESTAPI';

const checkToken = (req, res, next) => {
  const header = req.headers['authorization'];
  console.log(header);
  if (typeof header !== 'undefined') {
   
    try {
        
      const decoded = jwt.verify(header, secret);
      req.user = decoded;
      
      next();
    } catch (err) {
      res.status(401).send({message:'Invalid token'});
    }
  } else {
    res.status(401).send('Access denied. No token provided.');
  }
};

module.exports = checkToken;
