## Description du Service de Chat en Temps Réel

Ce service est une **application de chat en temps réel avec authentification**, développée avec **React, Express, MongoDB et Socket.io**.

### **Fonctionnalités principales :**  
1. **Authentification des utilisateurs**  
   - Les utilisateurs peuvent **s'inscrire et se connecter** avec un nom d'utilisateur, une adresse e-mail et un mot de passe.  
   - La session des utilisateurs authentifiés est **stockée via des tokens** dans le **localStorage**.

2. **Chat en temps réel**  
   - Utilise **Socket.io** pour la messagerie instantanée.  
   - Les utilisateurs peuvent **envoyer et recevoir des messages en temps réel**.  
   - L'historique des messages est **enregistré dans MongoDB** et chargé lors de la connexion.

3. **Backend (Express + MongoDB)**  
   - Une **API REST** gère l'authentification et les données des utilisateurs.  
   - **WebSockets** permet la communication en temps réel.  
   - Les messages sont **stockés dans une base de données MongoDB** et triés par date.

4. **Frontend (React + Socket.io-client)**  
   - Interface permettant aux utilisateurs de se connecter, discuter et consulter les anciens messages.  
   - Mise à jour de l'interface **en temps réel** lors de l'envoi/réception de messages.  
   - Messages **stylisés différemment** selon l'expéditeur.

5. **Sécurité & bonnes pratiques**  
   - Utilisation de **bcryptjs** pour le hachage des mots de passe.  
   - Les tokens sont stockés de manière sécurisée dans **localStorage** pour l'authentification.  
   - **CORS activé** pour permettre la communication entre le frontend et le backend.

### **Technologies utilisées :**  
- **Frontend** : React, Axios, React Router  
- **Backend** : Express, MongoDB (via Mongoose), Socket.io  
- **Base de données** : MongoDB  
- **Authentification** : Connexion/déconnexion basée sur JWT  

Ce service est idéal pour une **application de chat en temps réel** à petite échelle ou comme base pour développer **des outils collaboratifs plus avancés**. 🚀
