import mongoose from "mongoose";

const uri = process.env.MONGODBATLAS_URI || process.env.MONGODB_URI;

if (!uri) {
  console.error('Missing MongoDB URI. Set MONGODBATLAS_URI or MONGODB_URI in environment.');
  // exit so Railway shows a clear crash reason
  process.exit(1);
}

const connectDB = async () => {
  try {
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('✅ MongoDB connected');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  }
};

export default connectDB;