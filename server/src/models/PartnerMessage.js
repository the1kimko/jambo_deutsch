import mongoose from 'mongoose';

const attachmentSchema = new mongoose.Schema(
  {
    url: { type: String, trim: true },
    type: { type: String, trim: true },
    name: { type: String, trim: true },
  },
  { _id: false }
);

const partnerMessageSchema = new mongoose.Schema(
  {
    partner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PartnerProfile',
      required: true,
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    senderType: {
      type: String,
      enum: ['user', 'partner'],
      required: true,
      default: 'user',
    },
    text: {
      type: String,
      trim: true,
    },
    attachments: {
      type: [attachmentSchema],
      default: [],
    },
    readAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

partnerMessageSchema.index({ partner: 1, user: 1, createdAt: -1 });

const PartnerMessage = mongoose.model('PartnerMessage', partnerMessageSchema);

export default PartnerMessage;
