import mongoose from 'mongoose';

const partnerProfileSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    location: { type: String, required: true },
    level: { type: String, required: true },
    goal: { type: String, required: true },
    interests: [{ type: String }],
    online: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const PartnerProfile = mongoose.model('PartnerProfile', partnerProfileSchema);

export default PartnerProfile;
