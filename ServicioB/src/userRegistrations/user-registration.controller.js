import mongoose from 'mongoose';
import { Registration } from '../inscriptions/registration.model.js';
import { UserRegistration } from './user-registration.model.js';

const toObjectId = (id) => new mongoose.Types.ObjectId(id);
const usersCollection = () => mongoose.connection.db.collection('users');

const validateObjectId = (id, res, field) => {
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

export const createUserRegistration = async (req, res, next) => {
    try {
        const { userId, registrationId } = req.body;

        if (!validateObjectId(userId, res, 'id del usuario')) {
            return;
        }

        if (!validateObjectId(registrationId, res, 'id de la inscripcion')) {
            return;
        }

        const manager = await usersCollection().findOne({
            _id: toObjectId(userId),
            isActive: true,
            role: 'manager',
        });

        if (manager) {
            return res.status(409).json({
                success: false,
                message: 'El encargado de eventos pertenece a Servicio A y no puede agregarse a Servicio B',
                error: 'MANAGER_CANNOT_BE_LINKED',
            });
        }

        const registration = await Registration.findOne({
            _id: toObjectId(registrationId),
            status: 'active',
        }).lean();

        if (!registration) {
            return res.status(404).json({
                success: false,
                message: 'Inscripcion activa no encontrada',
                error: 'REGISTRATION_NOT_FOUND',
            });
        }

        const relation = await UserRegistration.create({
            userId: toObjectId(userId),
            registrationId: toObjectId(registrationId),
        });

        return res.status(201).json({
            success: true,
            message: 'Relacion usuario-inscripcion creada correctamente',
            data: {
                relationId: relation._id,
                userId: relation.userId,
                registrationId: relation.registrationId,
                status: relation.status,
                linkedAt: relation.linkedAt,
            },
        });
    } catch (error) {
        next(error);
    }
};

export const getUserRegistrations = async (req, res, next) => {
    try {
        const { userId } = req.params;

        if (!validateObjectId(userId, res, 'id del usuario')) {
            return;
        }

        const relations = await UserRegistration.find({
            userId: toObjectId(userId),
            status: 'active',
        })
            .populate({
                path: 'registrationId',
                select: 'eventId attendeeName attendeeEmail attendeePhone status registeredAt',
            })
            .sort({ linkedAt: -1 })
            .lean();

        return res.status(200).json({
            success: true,
            message: 'Inscripciones del usuario obtenidas correctamente',
            data: {
                userId,
                totalRegistrations: relations.length,
                registrations: relations.map((relation) => ({
                    relationId: relation._id,
                    linkedAt: relation.linkedAt,
                    registration: relation.registrationId,
                })),
            },
        });
    } catch (error) {
        next(error);
    }
};

export const getRegistrationUsers = async (req, res, next) => {
    try {
        const { registrationId } = req.params;

        if (!validateObjectId(registrationId, res, 'id de la inscripcion')) {
            return;
        }

        const relations = await UserRegistration.find({
            registrationId: toObjectId(registrationId),
            status: 'active',
        })
            .sort({ linkedAt: -1 })
            .lean();

        const managerIds = relations.map((relation) => relation.userId);
        const managers = managerIds.length > 0
            ? await usersCollection()
                .find({ _id: { $in: managerIds } })
                .project({ fullName: 1, email: 1, phone: 1, documentId: 1, isActive: 1, role: 1 })
                .toArray()
            : [];
        const managersById = new Map(
            managers.map((manager) => [manager._id.toString(), manager]),
        );

        return res.status(200).json({
            success: true,
            message: 'Usuarios de la inscripcion obtenidos correctamente',
            data: {
                registrationId,
                totalUsers: relations.length,
                users: relations.map((relation) => ({
                    relationId: relation._id,
                    linkedAt: relation.linkedAt,
                    user: managersById.get(relation.userId.toString()) || {
                        _id: relation.userId,
                    },
                })),
            },
        });
    } catch (error) {
        next(error);
    }
};

export const deleteUserRegistration = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!validateObjectId(id, res, 'id de la relacion')) {
            return;
        }

        const relation = await UserRegistration.findOneAndUpdate(
            {
                _id: toObjectId(id),
                status: 'active',
            },
            { status: 'inactive' },
            { new: true },
        ).lean();

        if (!relation) {
            return res.status(404).json({
                success: false,
                message: 'Relacion activa no encontrada',
                error: 'RELATION_NOT_FOUND',
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Relacion usuario-inscripcion eliminada correctamente',
            data: {
                relationId: relation._id,
                userId: relation.userId,
                registrationId: relation.registrationId,
                status: relation.status,
            },
        });
    } catch (error) {
        next(error);
    }
};
