import { ObjectId } from 'mongodb';

const getPackages = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const db = req.app.locals.db;
    const packagesCollection = db.collection('packages');

    const packages = await packagesCollection
      .find()
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .toArray();
    res.status(200).json(packages);
  } catch (error) {
    next(error);
  }
};

const getRandomPackages = async (req, res, next) => {
  try {
    const db = req.app.locals.db;
    const packagesCollection = db.collection('packages');

    const packages = await packagesCollection.aggregate([{ $sample: { size: 3 } }]).toArray();
    res.status(200).json(packages);
  } catch (error) {
    next(error);
  }
};

const getPackageById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const db = req.app.locals.db;
    const packagesCollection = db.collection('packages');

    const pkg = await packagesCollection.findOne({ _id: new ObjectId(id) });
    if (!pkg) {
      return res.status(404).json({ message: 'Package not found' });
    }
    res.status(200).json(pkg);
  } catch (error) {
    next(error);
  }
};

const createPackage = async (req, res, next) => {
  try {
    const { title, tourType, price, description, images, tourPlan } = req.body;
    const db = req.app.locals.db;
    const packagesCollection = db.collection('packages');

    const pkg = { title, tourType, price, description, images, tourPlan, createdAt: new Date() };
    const result = await packagesCollection.insertOne(pkg);
    res.status(201).json({ message: 'Package created', id: result.insertedId });
  } catch (error) {
    next(error);
  }
};

const updatePackage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, tourType, price, description, images, tourPlan } = req.body;
    const db = req.app.locals.db;
    const packagesCollection = db.collection('packages');

    const result = await packagesCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { title, tourType, price, description, images, tourPlan, updatedAt: new Date() } }
    );
    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: 'Package not found' });
    }
    res.status(200).json({ message: 'Package updated' });
  } catch (error) {
    next(error);
  }
};

const deletePackage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const db = req.app.locals.db;
    const packagesCollection = db.collection('packages');

    const result = await packagesCollection.deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Package not found' });
    }
    res.status(200).json({ message: 'Package deleted' });
  } catch (error) {
    next(error);
  }
};

export {
  getPackages,
  getRandomPackages,
  getPackageById,
  createPackage,
  updatePackage,
  deletePackage,
};