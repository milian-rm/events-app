import mongoose from 'mongoose';
import { Registration } from './registration.model.js';

const toObjectId = (id) => new mongoose.Types.ObjectId(id);
const eventsCollection = () => mongoose.connection.db.collection('events');
const usersCollection = () => mongoose.connection.db.collection('users');

const validateObjectId = (id, res, field = 'id') => {
    if (mongoose.Types.ObjectId.isValid(id)) {
        return true;
    }

    res.status(400).json({
        success: false,
        message: `El ${field} no tiene un formato valido`,
        error: 'INVALID_ID',
    });

    return false;
};

const formatEvent = (event, activeRegistrations = 0) => {
    const capacity = Number(event.capacity || 0);
    const availableSpots = Math.max(capacity - activeRegistrations, 0);

    return {
        eventId: event._id,
        eventName: event.eventName,
        date: event.date,
        location: event.location,
        capacity,
        activeRegistrations,
        availableSpots,
        isFull: capacity > 0 && activeRegistrations >= capacity,
        occupancyPercentage: capacity > 0
            ? Number(((activeRegistrations / capacity) * 100).toFixed(2))
            : 0,
    };
};

const getActiveCountsByEvent = async () => {
    const counts = await Registration.aggregate([
        { $match: { status: 'active' } },
        { $group: { _id: '$eventId', activeRegistrations: { $sum: 1 } } },
    ]);

    return new Map(
        counts.map((count) => [
            count._id.toString(),
            count.activeRegistrations,
        ]),
    );
};

export const createRegistration = async (req, res, next) => {
    try {
        const {
            eventId,
            attendeeName,
            attendeeEmail,
            attendeePhone,
        } = req.body;

        if (!validateObjectId(eventId, res, 'id del evento')) {
            return;
        }

        const event = await eventsCollection().findOne({
            _id: toObjectId(eventId),
            isActive: true,
        });

        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Evento no encontrado o inactivo',
                error: 'EVENT_NOT_FOUND',
            });
        }

        const manager = await usersCollection().findOne({
            email: attendeeEmail.toLowerCase(),
            isActive: true,
            role: 'manager',
        });

        if (manager) {
            return res.status(409).json({
                success: false,
                message: 'El encargado de eventos no puede registrarse como asistente en Servicio B',
                error: 'MANAGER_CANNOT_REGISTER',
            });
        }

        const activeRegistrations = await Registration.countDocuments({
            eventId: toObjectId(eventId),
            status: 'active',
        });

        if (activeRegistrations >= event.capacity) {
            return res.status(409).json({
                success: false,
                message: 'El evento ya no tiene cupos disponibles',
                error: 'EVENT_FULL',
            });
        }

        const existingRegistration = await Registration.findOne({
            eventId: toObjectId(eventId),
            attendeeEmail: attendeeEmail.toLowerCase(),
            status: 'active',
        }).lean();

        if (existingRegistration) {
            return res.status(409).json({
                success: false,
                message: 'El asistente ya esta inscrito en este evento',
                error: 'REGISTRATION_ALREADY_EXISTS',
            });
        }

        const registration = await Registration.create({
            eventId: toObjectId(eventId),
            attendeeName,
            attendeeEmail,
            attendeePhone: attendeePhone || null,
        });

        return res.status(201).json({
            success: true,
            message: 'Inscripcion creada correctamente',
            data: {
                registrationId: registration._id,
                eventId: registration.eventId,
                attendeeName: registration.attendeeName,
                attendeeEmail: registration.attendeeEmail,
                attendeePhone: registration.attendeePhone,
                status: registration.status,
                registeredAt: registration.registeredAt,
                event: formatEvent(event, activeRegistrations + 1),
            },
        });
    } catch (error) {
        next(error);
    }
};

export const cancelRegistration = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!validateObjectId(id, res, 'id de la inscripcion')) {
            return;
        }

        const registration = await Registration.findOneAndUpdate(
            {
                _id: toObjectId(id),
                status: 'active',
            },
            {
                status: 'cancelled',
                cancelledAt: new Date(),
            },
            {
                new: true,
            },
        ).lean();

        if (!registration) {
            return res.status(404).json({
                success: false,
                message: 'Inscripcion activa no encontrada',
                error: 'REGISTRATION_NOT_FOUND',
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Inscripcion cancelada correctamente',
            data: {
                registrationId: registration._id,
                eventId: registration.eventId,
                attendeeName: registration.attendeeName,
                attendeeEmail: registration.attendeeEmail,
                status: registration.status,
                cancelledAt: registration.cancelledAt,
            },
        });
    } catch (error) {
        next(error);
    }
};

export const getAttendeesByEvent = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!validateObjectId(id, res, 'id del evento')) {
            return;
        }

        const event = await eventsCollection().findOne({
            _id: toObjectId(id),
            isActive: true,
        });

        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Evento no encontrado o inactivo',
                error: 'EVENT_NOT_FOUND',
            });
        }

        const registrations = await Registration.find({
            eventId: toObjectId(id),
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
                eventName: event.eventName,
                capacity: event.capacity,
                totalAttendees: attendees.length,
                availableSpots: Math.max(event.capacity - attendees.length, 0),
                attendees,
            },
        });
    } catch (error) {
        next(error);
    }
};

export const getAvailableEvents = async (req, res, next) => {
    try {
        const events = await eventsCollection()
            .find({ isActive: true })
            .sort({ date: 1 })
            .toArray();
        const countsByEvent = await getActiveCountsByEvent();

        const availableEvents = events
            .map((event) => formatEvent(
                event,
                countsByEvent.get(event._id.toString()) || 0,
            ))
            .filter((event) => event.availableSpots > 0);

        return res.status(200).json({
            success: true,
            message: 'Eventos con cupos disponibles obtenidos correctamente',
            data: {
                totalEvents: availableEvents.length,
                events: availableEvents,
            },
        });
    } catch (error) {
        next(error);
    }
};

export const getFullEvents = async (req, res, next) => {
    try {
        const events = await eventsCollection()
            .find({ isActive: true })
            .sort({ date: 1 })
            .toArray();
        const countsByEvent = await getActiveCountsByEvent();

        const fullEvents = events
            .map((event) => formatEvent(
                event,
                countsByEvent.get(event._id.toString()) || 0,
            ))
            .filter((event) => event.isFull);

        return res.status(200).json({
            success: true,
            message: 'Eventos con cupo completo obtenidos correctamente',
            data: {
                totalEvents: fullEvents.length,
                events: fullEvents,
            },
        });
    } catch (error) {
        next(error);
    }
};

export const getOccupancySummary = async (req, res, next) => {
    try {
        const events = await eventsCollection()
            .find({ isActive: true })
            .sort({ date: 1 })
            .toArray();
        const countsByEvent = await getActiveCountsByEvent();

        const eventSummaries = events.map((event) => formatEvent(
            event,
            countsByEvent.get(event._id.toString()) || 0,
        ));

        const totals = eventSummaries.reduce(
            (accumulator, event) => {
                accumulator.totalCapacity += event.capacity;
                accumulator.totalAttendees += event.activeRegistrations;

                if (event.isFull) {
                    accumulator.fullEvents += 1;
                } else {
                    accumulator.availableEvents += 1;
                }

                return accumulator;
            },
            {
                totalEvents: eventSummaries.length,
                availableEvents: 0,
                fullEvents: 0,
                totalCapacity: 0,
                totalAttendees: 0,
            },
        );

        return res.status(200).json({
            success: true,
            message: 'Resumen de ocupacion obtenido correctamente',
            data: {
                ...totals,
                globalOccupancyPercentage: totals.totalCapacity > 0
                    ? Number(((totals.totalAttendees / totals.totalCapacity) * 100).toFixed(2))
                    : 0,
                events: eventSummaries,
            },
        });
    } catch (error) {
        next(error);
    }
};
