import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// 1. Define the schema
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address'],
      index: true, // Added: improves query performance
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'], // Added error message
      select: false, // Added: prevents password from being returned in queries by default
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'], // Added
      validate: {
        validator: function (v) {
          return /^\s*\S+\s+\S+/.test(v); // at least two words
        },
        message: 'Please enter both first and last name',
      },
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    }, // Added: for future role-based access
  },
  {
    timestamps: true,
    toJSON: {virtuals: true},
    toObject: {virtuals: true},
  }
);

// // 2. Add indexes for performance
// userSchema.index({email: 1}); // Ensures fast email lookups

// 3. Add virtuals (computed fields)
userSchema.virtual('firstName').get(function () {
  return this.name.split(' ')[0];
});

userSchema.virtual('lastName').get(function () {
  const parts = this.name.split(' ');
  return parts.slice(1).join(' ') || ''; // Added: handles single-word names gracefully
});

// 4. Add middleware (hooks)
userSchema.pre('save', async function (next) {
  // Only hash if the password is modified
  if (!this.isModified('password')) return next();

  try {
    this.password = await bcrypt.hash(this.password, 12);
    next();
  } catch (error) {
    next(error); // Added: proper error handling
  }
});

// 5. Add instance methods
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Optional: Add the method to get public user data (without sensitive info)
userSchema.methods.toPublicJSON = function () {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    firstName: this.firstName,
    lastName: this.lastName,
    createdAt: this.createdAt,
  };
};

// 6. Compile and export the model
const User = mongoose.model('User', userSchema);

export default User;
