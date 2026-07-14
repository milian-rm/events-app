import mongoose from 'mongoose';

const registrationSchema = new mongoose.Schema(
    {
        eventId: {
            type: mongoose.Schema.Types.ObjectId,
            required: [true, 'El evento es obligatorio'],
            index: true,
        },
        attendeeName: {
            type: String,
            required: [true, 'El nombre del asistente es obligatorio'],
            trim: true,
            maxlength: [100, 'El nombre no puede superar 100 caracteres'],
        },
        attendeeEmail: {
            type: String,
            required: [true, 'El correo del asistente es obligatorio'],
            trim: true,
            lowercase: true,
            maxlength: [120, 'El correo no puede superar 120 caracteres'],
        },
        attendeePhone: {
            type: String,
            trim: true,
            default: null,
        },
        status: {
            type: String,
            enum: ['active', 'cancelled'],
            default: 'active',
            index: true,
        },
        registeredAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    },
);

registrationSchema.index({ eventId: 1, status: 1 });
registrationSchema.index(
    { eventId: 1, attendeeEmail: 1, status: 1 },
    { unique: true, partialFilterExpression: { status: 'active' } },
);

export const Registration = mongoose.model('Registration', registrationSchema);
