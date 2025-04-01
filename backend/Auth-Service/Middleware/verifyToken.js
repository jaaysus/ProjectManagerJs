const jwt = require('jsonwebtoken');
const User = require('../Models/User');
const verifyToken = (role = null) => {
  return async (req, res, next) => {
      const token = req.headers['authorization'];
    if (!token) {
      return res.status(403).send('Le token est obligatoire pour l\'authentification');
    }
try {
      const tokenValue=token;
      const decoded = jwt.verify(tokenValue,process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);
      console.log(user);
      if (!user) {
        return res.status(404).send('Utilisateur introuvable');
      }
      if (user.blocked) {
        return res.status(403).send('Utilisateur bloqué');
      }
      if (role && user.role !== role) {
        return res.status(403).send('Accès refusé');
      }
      req.user = user;
      next();
    } catch (err) {
      res.status(400).send('Token invalide');
    }
  };
};
module.exports = verifyToken;
