const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../index');
const User = require('../Models/User');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const users = [
  { username: 'Giovanni Rossi', email: 'giovanni.rossi@example.com', password: 'password123', role: 'admin' },
  { username: 'Maria Bianchi', email: 'maria.bianchi@example.com', password: 'password123', role: 'member' },
  { username: 'Luca Verdi', email: 'luca.verdi@example.com', password: 'password123', role: 'guest' }
];

const createToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
};

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  await User.deleteMany({});
  await User.insertMany(users);
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('User Routes', () => {
  let adminUser;
  let memberUser;
  let guestUser;

  beforeAll(async () => {
    adminUser = await User.findOne({ role: 'admin' });
    memberUser = await User.findOne({ role: 'member' });
    guestUser = await User.findOne({ role: 'guest' });
  });

  describe('GET /api/users', () => {
    it('should allow admin to get all users', async () => {
      const token = createToken(adminUser);

      const response = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body).toHaveLength(3);
    });

    it('should deny non-admin users from getting all users', async () => {
      const token = createToken(memberUser);

      const response = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${token}`)
        .expect(403);

      expect(response.body.error).toBe('Access denied');
    });
  });

  describe('GET /api/users/:id', () => {
    it('should allow user to view their own profile', async () => {
      const token = createToken(memberUser);

      const response = await request(app)
        .get(`/api/users/${memberUser._id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.username).toBe(memberUser.username);
    });

    it('should allow admin to view any user profile', async () => {
      const token = createToken(adminUser);

      const response = await request(app)
        .get(`/api/users/${memberUser._id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.username).toBe(memberUser.username);
    });

    it('should deny non-admin from viewing another user profile', async () => {
      const token = createToken(guestUser);

      const response = await request(app)
        .get(`/api/users/${adminUser._id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(403);

      expect(response.body.error).toBe('Access denied');
    });
  });

  describe('POST /api/users/create', () => {
    it('should allow admin to create a user', async () => {
      const token = createToken(adminUser);
      const newUser = { username: 'Giuseppe Neri', email: 'giuseppe.neri@example.com', password: 'password123', role: 'member' };

      const response = await request(app)
        .post('/api/users/create')
        .set('Authorization', `Bearer ${token}`)
        .send(newUser)
        .expect(201);

      expect(response.body.message).toBe('User created successfully');
      const createdUser = await User.findOne({ email: newUser.email });
      expect(createdUser).toBeTruthy();
    });

    it('should deny non-admin from creating a user', async () => {
      const token = createToken(memberUser);
      const newUser = { username: 'Giuseppe Neri', email: 'giuseppe.neri@example.com', password: 'password123', role: 'member' };

      const response = await request(app)
        .post('/api/users/create')
        .set('Authorization', `Bearer ${token}`)
        .send(newUser)
        .expect(403);

      expect(response.body.error).toBe('Access denied');
    });
  });

  describe('PUT /api/users/:id', () => {
    it('should allow user to update their own profile', async () => {
      const token = createToken(memberUser);
      const updatedData = { username: 'Updated Name', email: 'updated.email@example.com' };

      const response = await request(app)
        .put(`/api/users/${memberUser._id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updatedData)
        .expect(200);

      expect(response.body.username).toBe(updatedData.username);
      expect(response.body.email).toBe(updatedData.email);
    });

    it('should allow admin to update any user profile', async () => {
      const token = createToken(adminUser);
      const updatedData = { username: 'Admin Updated', email: 'admin.updated@example.com' };

      const response = await request(app)
        .put(`/api/users/${memberUser._id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updatedData)
        .expect(200);

      expect(response.body.username).toBe(updatedData.username);
      expect(response.body.email).toBe(updatedData.email);
    });

    it('should deny non-admin from updating another user profile', async () => {
      const token = createToken(guestUser);
      const updatedData = { username: 'Updated Guest', email: 'guest.updated@example.com' };

      const response = await request(app)
        .put(`/api/users/${adminUser._id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updatedData)
        .expect(403);

      expect(response.body.error).toBe('Access denied');
    });
  });

  describe('PUT /api/users/block/:id', () => {
    it('should allow admin to block a user', async () => {
      const token = createToken(adminUser);

      const response = await request(app)
        .put(`/api/users/block/${memberUser._id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.message).toBe('User blocked successfully');
    });

    it('should deny non-admin from blocking a user', async () => {
      const token = createToken(memberUser);

      const response = await request(app)
        .put(`/api/users/block/${memberUser._id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(403);

      expect(response.body.error).toBe('Access denied');
    });
  });

  describe('PUT /api/users/unblock/:id', () => {
    it('should allow admin to unblock a user', async () => {
      const token = createToken(adminUser);

      const response = await request(app)
        .put(`/api/users/unblock/${memberUser._id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.message).toBe('User unblocked successfully');
    });

    it('should deny non-admin from unblocking a user', async () => {
      const token = createToken(memberUser);

      const response = await request(app)
        .put(`/api/users/unblock/${memberUser._id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(403);

      expect(response.body.error).toBe('Access denied');
    });
  });

  describe('GET /api/users/search', () => {
    it('should allow admin to search users by query', async () => {
      const token = createToken(adminUser);

      const response = await request(app)
        .get('/api/users/search?name=Giovanni')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body).toHaveLength(1);
      expect(response.body[0].username).toBe('Giovanni Rossi');
    });

    it('should deny non-admin from searching users', async () => {
      const token = createToken(memberUser);

      const response = await request(app)
        .get('/api/users/search?name=Giovanni')
        .set('Authorization', `Bearer ${token}`)
        .expect(403);

      expect(response.body.error).toBe('Access denied');
    });
  });

  describe('DELETE /api/users/:id', () => {
    it('should allow admin to delete a user', async () => {
      const token = createToken(adminUser);

      const response = await request(app)
        .delete(`/api/users/${memberUser._id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.message).toBe('User deleted successfully');
    });

    it('should deny non-admin from deleting a user', async () => {
      const token = createToken(guestUser);

      const response = await request(app)
        .delete(`/api/users/${memberUser._id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(403);

      expect(response.body.error).toBe('Access denied');
    });
  });
});
