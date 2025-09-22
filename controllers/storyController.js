// controllers/storyController.js
import { ObjectId } from 'mongodb';

const getStories = async (req, res, next) => {
  try {
    const { authorEmail, authorId, page = 1, limit = 10 } = req.query;
    const db = req.app.locals.db;
    const storiesCollection = db.collection('stories');

    const query = {};
    if (authorEmail) query.authorEmail = authorEmail;
    if (authorId) query.authorId = authorId;

    const stories = await storiesCollection
      .find(query)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .toArray();
    res.status(200).json(stories);
  } catch (error) {
    next(error);
  }
};

const getRandomStories = async (req, res, next) => {
  try {
    const db = req.app.locals.db;
    const storiesCollection = db.collection('stories');

    const stories = await storiesCollection.aggregate([{ $sample: { size: 3 } }]).toArray();
    res.status(200).json(stories);
  } catch (error) {
    next(error);
  }
};

const createStory = async (req, res, next) => {
  try {
    const { title, content, images, authorEmail, authorId } = req.body;
    const db = req.app.locals.db;
    const storiesCollection = db.collection('stories');

    const story = { title, content, images, authorEmail, authorId, createdAt: new Date() };
    const result = await storiesCollection.insertOne(story);
    res.status(201).json({ message: 'Story created', id: result.insertedId });
  } catch (error) {
    next(error);
  }
};

const updateStory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, content, images } = req.body;
    const db = req.app.locals.db;
    const storiesCollection = db.collection('stories');

    const result = await storiesCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { title, content, images, updatedAt: new Date() } }
    );
    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: 'Story not found' });
    }
    res.status(200).json({ message: 'Story updated' });
  } catch (error) {
    next(error);
  }
};

const deleteStory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const db = req.app.locals.db;
    const storiesCollection = db.collection('stories');

    const result = await storiesCollection.deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Story not found' });
    }
    res.status(200).json({ message: 'Story deleted' });
  } catch (error) {
    next(error);
  }
};

export {
  getStories,
  getRandomStories,
  createStory,
  updateStory,
  deleteStory,
};