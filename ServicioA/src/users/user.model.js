'use strict';

import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'El nombre del encargado es requerido'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'El correo del encargado es requerido'],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'El correo no tiene un formato valido'],
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    documentId: {
      type: String,
      trim: true,
      default: '',
    },
    role: {
      type: String,
      enum: ['manager'],
      default: 'manager',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

userSchema.index(
  { email: 1, isActive: 1 },
  { unique: true, partialFilterExpression: { isActive: true } }
);

export default mongoose.model('User', userSchema);
