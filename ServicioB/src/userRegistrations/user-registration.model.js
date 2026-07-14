import mongoose from 'mongoose';

const userRegistrationSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: [true, 'El usuario es obligatorio'],
            index: true,
        },
        registrationId: {
            type: mongoose.Schema.Types.ObjectId,
            required: [true, 'La inscripcion es obligatoria'],
            ref: 'Registration',
            index: true,
        },
        status: {
            type: String,
            enum: ['active', 'inactive'],
            default: 'active',
            index: true,
        },
        linkedAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    },
);

userRegistrationSchema.index(
    { userId: 1, registrationId: 1, status: 1 },
    { unique: true, partialFilterExpression: { status: 'active' } },
);

export const UserRegistration = mongoose.model(
    'UserRegistration',
    userRegistrationSchema,
);
