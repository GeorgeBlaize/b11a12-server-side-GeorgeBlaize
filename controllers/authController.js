import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';

const register = async (req, res, next) => {
  try {
    const { name, email, photoURL, role } = req.body;
    const db = req.app.locals.db;
    const usersCollection = db.collection('users');

    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = { name, email, photoURL, role: role || 'tourist' };
    await usersCollection.insertOne(user);

    const token = jwt.sign({ email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.status(201).json({ token });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email } = req.body;
    const db = req.app.locals.db;
    const usersCollection = db.collection('users');

    const user = await usersCollection.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const token = jwt.sign({ email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.status(200).json({ token });
  } catch (error) {
    next(error);
  }
};

const googleLogin = async (req, res, next) => {
  try {
    const { name, email, photoURL, role } = req.body;
    const db = req.app.locals.db;
    const usersCollection = db.collection('users');

    let user = await usersCollection.findOne({ email });
    if (!user) {
      user = { name, email, photoURL, role: role || 'tourist' };
      await usersCollection.insertOne(user);
    }

    const token = jwt.sign({ email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.status(200).json({ token });
  } catch (error) {
    next(error);
  }
};

const getMe = async (req, res, next) => {
  try {
    const { email } = req.user;
    const db = req.app.locals.db;
    const usersCollection = db.collection('users');

    const user = await usersCollection.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export { register, login, googleLogin, getMe };