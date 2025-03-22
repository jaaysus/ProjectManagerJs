const jwt = require('jsonwebtoken');
const User = require('../mMdels/User');
const verifyToken = (role = null) => {
  return async (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) {
      return res.status(403).send('Le token est obligatoire pour l\'authentification');
    }
try {
      const tokenValue = token.split(" ")[1];  
      const decoded = jwt.verify(tokenValue, 'app_secret_key');
      const user = await User.findById(decoded.id);
      if (!user) {
        return res.status(404).send('Utilisateur introuvable');
      }
      if (user.isBlocked) {
        return res.status(403).send('Utilisateur bloqué');
      }
      if (role && user.role !== role) {
        return res.status(403).send('Accès refusé');
      }
      req.user = user;
     
    } catch (err) {
      res.status(400).send('Token invalide');
    }
  };
};
module.exports = verifyToken;
