import { ObjectId } from 'mongodb';

const getTourGuides = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const db = req.app.locals.db;
    const usersCollection = db.collection('users');

    const tourGuides = await usersCollection
      .find({ role: 'tour-guide' })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .toArray();
    res.status(200).json(tourGuides);
  } catch (error) {
    next(error);
  }
};

const getRandomTourGuides = async (req, res, next) => {
  try {
    const db = req.app.locals.db;
    const usersCollection = db.collection('users');

    const tourGuides = await usersCollection
      .aggregate([{ $match: { role: 'tour-guide' } }, { $sample: { size: 3 } }])
      .toArray();
    res.status(200).json(tourGuides);
  } catch (error) {
    next(error);
  }
};

const getTourGuideById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const db = req.app.locals.db;
    const usersCollection = db.collection('users');

    const tourGuide = await usersCollection.findOne({ _id: new ObjectId(id), role: 'tour-guide' });
    if (!tourGuide) {
      return res.status(404).json({ message: 'Tour guide not found' });
    }
    res.status(200).json(tourGuide);
  } catch (error) {
    next(error);
  }
};

export {
  getTourGuides,
  getRandomTourGuides,
  getTourGuideById,
};