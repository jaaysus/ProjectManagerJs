const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../Models/User");
const verifyToken = require("../Middleware/verifyToken");
require('dotenv').config();


// 1- Inscription d'un utilisateur
router.post("/register", async (req, res) => {
    const { username, email, password } = req.body;
    if ( !username || !email || !password) {
        return res.status(400).json({ message: "Tous les champs sont obligatoires" });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ message: "L'email est déjà utilisé" });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();
        res.status(201).json({ message: "Utilisateur créé avec succès !" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2- Connexion
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Utilisateur non trouvé" });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Mot de passe incorrect" });
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ token });
});

// 3- Récupérer les informations de l'utilisateur
router.get("/profile", verifyToken(), async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

  //4-Mettre a jour
router.put("/update/:id", verifyToken(), async (req, res) => {
  const { username, email, password,role } = req.body;
  if ( req.user.id !== req.params.id) {
      return res.status(403).json({ message: "Accès refusé" });
  }
try {
    const id=req.params.id;
    const user=await User.updateOne({_id:id},req.body);
      res.status(200).json({ message: "Utilisateur mis à jour avec succès" ,user:user});
  } catch (err) {
      res.status(500).json({ error: err.message });
  }
});
 
// 5-Supprimer un utilisateur
router.delete("/delete/:id", verifyToken(), async (req, res) => {
  if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Accès refusé" });
  }
try {
      const user = await User.deleteOne({_id:req.params.id});
      if (!user) {
          return res.status(404).json({ message: "Utilisateur non trouvé" });
      }
      res.status(200).json({ message: "Utilisateur supprimé avec succès" });
    } catch (err) {
      res.status(500).json({ error: err.message });
  }
});

//6-Blocker un utilisateur
router.put("/block/:id", verifyToken(), async (req, res) => {
  if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Accès refusé" });
  }
try {
      const user = await User.findById(req.params.id);
      if (!user) {
          return res.status(404).json({ message: "Utilisateur non trouvé" });
      }
      user.blocked = true;
      await user.save();
      res.status(200).json({ message: "Utilisateur bloqué avec succès" });
  } catch (err) {
      res.status(500).json({ error: err.message });
  }
});

// 7-Débloquer un utilisateur
router.put("/unblock/:id", verifyToken(), async (req, res) => {
  if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Accès refusé" });
  }
  try {
      const user = await User.findById(req.params.id);
      if (!user) {
          return res.status(404).json({ message: "Utilisateur non trouvé" });
      }
      user.blocked = false;
      await user.save();
      res.status(200).json({ message: "Utilisateur débloqué avec succès" });
  } catch (err) {
      res.status(500).json({ error: err.message });
  }
});
 
//8-Recherche par nom,email et role
router.get("/search", verifyToken("admin"), async (req, res) => {
  const { username, email, role } = req.query;
  let query = {};
  if (username) query.name = { $regex: username, $options: "i" };  
  if (email) query.email = { $regex: email, $options: "i" };
  if (role) query.role = role;
try {
      const users = await User.find(query);  
      res.status(200).json(users);
  } catch (err) {
      res.status(500).json({ message: "Erreur de recherche" });
  }
});
module.exports = router;
