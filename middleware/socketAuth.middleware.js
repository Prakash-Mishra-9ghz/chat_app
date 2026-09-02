const jwt = require('jsonwebtoken');

function socketAuth(socket, next) {
  try{
    const token = socket.handshake.auth.token;
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    
    socket.userId = payload.userId;
    next();
  }catch(err){
    next(new Error('Access denied. Invalid token.'));
  }
}

module.exports = socketAuth;
