// controllers/userController.js
import { ObjectId } from 'mongodb';

const getUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const db = req.app.locals.db;
    const usersCollection = db.collection('users');

    const users = await usersCollection
      .find()
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .toArray();
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const { email } = req.params;
    const { name, photoURL, role } = req.body;
    const db = req.app.locals.db;
    const usersCollection = db.collection('users');

    const updateData = {};
    if (name) updateData.name = name;
    if (photoURL) updateData.photoURL = photoURL;
    if (role) updateData.role = role;

    const result = await usersCollection.updateOne(
      { email },
      { $set: { ...updateData, updatedAt: new Date() } }
    );
    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User updated' });
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const { email } = req.params;
    const db = req.app.locals.db;
    const usersCollection = db.collection('users');

    const result = await usersCollection.deleteOne({ email });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted' });
  } catch (error) {
    next(error);
  }
};

export { getUsers, updateUser, deleteUser };