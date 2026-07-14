'use strict';

import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema(
  {
    eventName: {
      type: String,
      required: [true, 'El nombre del evento es requerido'],
      trim: true,
    },
    date: {
      type: Date,
      required: [true, 'La fecha del evento es requerida'],
    },
    location: {
      type: String,
      required: [true, 'El lugar del evento es requerido'],
      trim: true,
    },
    capacity: {
      type: Number,
      required: [true, 'La capacidad es requerida'],
      min: [1, 'La capacidad debe ser mayor a 0'],
    },
    description: {
      type: String,
      default: '',
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

eventSchema.index({ date: 1 });
eventSchema.index({ isActive: 1 });

export default mongoose.model('Event', eventSchema);