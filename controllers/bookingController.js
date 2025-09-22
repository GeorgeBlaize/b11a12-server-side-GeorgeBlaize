import { ObjectId } from 'mongodb';
import Stripe from 'stripe';
import dotenv from 'dotenv';  
dotenv.config();


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const getBookings = async (req, res, next) => {
  try {
    const { email, tourGuideEmail, page = 1, limit = 10 } = req.query;
    const db = req.app.locals.db;
    const bookingsCollection = db.collection('bookings');

    const query = {};
    if (email) query.touristEmail = email;
    if (tourGuideEmail) query.tourGuideEmail = tourGuideEmail;

    const bookings = await bookingsCollection
      .find(query)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .toArray();
    res.status(200).json(bookings);
  } catch (error) {
    next(error);
  }
};

const createBooking = async (req, res, next) => {
  try {
    const { packageId, packageName, touristName, touristEmail, touristImage, price, tourDate, tourGuide } = req.body;
    const db = req.app.locals.db;
    const bookingsCollection = db.collection('bookings');

    const booking = {
      packageId: new ObjectId(packageId),
      packageName,
      touristName,
      touristEmail,
      touristImage,
      price,
      tourDate: new Date(tourDate),
      tourGuide,
      status: 'pending',
      createdAt: new Date(),
    };
    const result = await bookingsCollection.insertOne(booking);
    res.status(201).json({ message: 'Booking created', id: result.insertedId });
  } catch (error) {
    next(error);
  }
};

const updateBooking = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, transactionId } = req.body;
    const db = req.app.locals.db;
    const bookingsCollection = db.collection('bookings');

    const updateData = { status };
    if (transactionId) updateData.transactionId = transactionId;
    updateData.updatedAt = new Date();

    const result = await bookingsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );
    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.status(200).json({ message: 'Booking updated' });
  } catch (error) {
    next(error);
  }
};

const deleteBooking = async (req, res, next) => {
  try {
    const { id } = req.params;
    const db = req.app.locals.db;
    const bookingsCollection = db.collection('bookings');

    const result = await bookingsCollection.deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.status(200).json({ message: 'Booking deleted' });
  } catch (error) {
    next(error);
  }
};

const createPaymentIntent = async (req, res, next) => {
  try {
    const { amount } = req.body;
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      payment_method_types: ['card'],
    });
    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    next(error);
  }
};

export {
  getBookings,
  createBooking,
  updateBooking,
  deleteBooking,
  createPaymentIntent,
};