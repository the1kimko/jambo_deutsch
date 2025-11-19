import mongoose from 'mongoose';

const recordingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    phrase: { type: String, trim: true },
    location: { type: String, trim: true },
    url: { type: String, required: true },
    duration: { type: Number, default: 0 },
    transcript: { type: String, trim: true },
  },
  { timestamps: true }
);

const Recording = mongoose.model('Recording', recordingSchema);

export default Recording;
