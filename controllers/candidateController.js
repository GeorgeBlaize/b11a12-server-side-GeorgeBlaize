import { ObjectId } from 'mongodb';

const getCandidates = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const db = req.app.locals.db;
    const candidatesCollection = db.collection('candidates');

    const candidates = await candidatesCollection
      .find()
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .toArray();
    res.status(200).json(candidates);
  } catch (error) {
    next(error);
  }
};

const createCandidate = async (req, res, next) => {
  try {
    const { title, reason, cvLink, applicantEmail, applicantName } = req.body;
    const db = req.app.locals.db;
    const candidatesCollection = db.collection('candidates');

    const candidate = {
      title,
      reason,
      cvLink,
      applicantEmail,
      applicantName,
      status: 'pending',
      createdAt: new Date(),
    };
    const result = await candidatesCollection.insertOne(candidate);
    res.status(201).json({ message: 'Candidate application created', id: result.insertedId });
  } catch (error) {
    next(error);
  }
};

const updateCandidateStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const db = req.app.locals.db;
    const candidatesCollection = db.collection('candidates');

    const result = await candidatesCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { status, updatedAt: new Date() } }
    );
    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: 'Candidate not found' });
    }
    res.status(200).json({ message: 'Candidate status updated' });
  } catch (error) {
    next(error);
  }
};

const deleteCandidate = async (req, res, next) => {
  try {
    const { id } = req.params;
    const db = req.app.locals.db;
    const candidatesCollection = db.collection('candidates');

    const result = await candidatesCollection.deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Candidate not found' });
    }
    res.status(200).json({ message: 'Candidate deleted' });
  } catch (error) {
    next(error);
  }
};

export {
  getCandidates,
  createCandidate,
  updateCandidateStatus,
  deleteCandidate,
};