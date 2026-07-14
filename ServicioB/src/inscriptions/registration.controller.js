import mongoose from 'mongoose';
import { Registration } from './registration.model.js';

export const getAttendeesByEvent = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'El id del evento no tiene un formato valido',
                error: 'ERROR',
            });
        }

        const registrations = await Registration.find({
            eventId: new mongoose.Types.ObjectId(id),
            status: 'active',
        })
            .select('attendeeName attendeeEmail attendeePhone registeredAt')
            .sort({ registeredAt: 1 })
            .lean();

        const attendees = registrations.map((registration) => ({
            registrationId: registration._id,
            name: registration.attendeeName,
            email: registration.attendeeEmail,
            phone: registration.attendeePhone,
            registeredAt: registration.registeredAt,
        }));

        return res.status(200).json({
            success: true,
            message: 'Asistentes del evento obtenidos correctamente',
            data: {
                eventId: id,
                totalAttendees: attendees.length,
                attendees,
            },
        });
    } catch (error) {
        next(error);
    }
};
