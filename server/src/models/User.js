import mongoose from 'mongoose';

const partnerPreferencesSchema = new mongoose.Schema(
  {
    location: { type: String, trim: true },
    goal: { type: String, trim: true },
    level: { type: String, trim: true },
    interests: [{ type: String }],
  },
  { _id: false }
);

const progressSchema = new mongoose.Schema(
  {
    modules: {
      type: Map,
      of: Number,
      default: () => new Map(),
    },
    streak: {
      type: Number,
      default: 0,
    },
    xp: {
      type: Number,
      default: 0,
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    externalId: {
      type: String,
      index: true,
      sparse: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address'],
      index: true,
    },
    name: {
      type: String,
      trim: true,
      default: '',
    },
    firstName: {
      type: String,
      trim: true,
      default: '',
    },
    lastName: {
      type: String,
      trim: true,
      default: '',
    },
    avatarUrl: {
      type: String,
      trim: true,
    },
    goal: {
      type: String,
      enum: ['General', 'Visa Prep', 'Exam Prep', 'Other'],
      default: 'General',
    },
    location: {
      type: String,
      trim: true,
      default: '',
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    partnerPreferences: {
      type: partnerPreferencesSchema,
      default: () => ({}),
    },
    progress: {
      type: progressSchema,
      default: () => ({}),
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

userSchema.virtual('fullName').get(function () {
  if (this.name) return this.name;
  return [this.firstName, this.lastName].filter(Boolean).join(' ').trim();
});

userSchema.methods.toPublicJSON = function () {
  const moduleProgress = {};
  const modulesData = this.progress?.modules;
  if (modulesData instanceof Map) {
    for (const [key, value] of modulesData.entries()) {
      moduleProgress[key] = value;
    }
  } else if (modulesData && typeof modulesData === 'object') {
    Object.entries(modulesData).forEach(([key, value]) => {
      moduleProgress[key] = value;
    });
  }

  return {
    id: this._id,
    externalId: this.externalId,
    name: this.fullName,
    firstName: this.firstName || this.fullName?.split(' ')[0] || '',
    lastName: this.lastName || this.fullName?.split(' ').slice(1).join(' ') || '',
    email: this.email,
    goal: this.goal,
    role: this.role,
    avatarUrl: this.avatarUrl,
    progress: {
      modules: moduleProgress,
      streak: this.progress?.streak || 0,
      xp: this.progress?.xp || 0,
      lastUpdated: this.progress?.lastUpdated,
    },
    partnerPreferences: this.partnerPreferences,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

const User = mongoose.model('User', userSchema);

export default User;
