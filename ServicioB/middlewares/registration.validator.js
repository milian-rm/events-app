'use strict';

import { body, param, validationResult } from 'express-validator';

const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);

    if (errors.isEmpty()) {
        return next();
    }

    return res.status(400).json({
        success: false,
        message: 'Datos invalidos',
        errors: errors.array().map((error) => ({
            field: error.path,
            message: error.msg,
        })),
    });
};

const validateCreateRegistration = [
    body('eventId')
        .notEmpty()
        .withMessage('El evento es obligatorio')
        .isMongoId()
        .withMessage('El id del evento no tiene un formato valido'),
    body('attendeeName')
        .trim()
        .notEmpty()
        .withMessage('El nombre del asistente es obligatorio')
        .isLength({ min: 2, max: 100 })
        .withMessage('El nombre debe tener entre 2 y 100 caracteres'),
    body('attendeeEmail')
        .trim()
        .notEmpty()
        .withMessage('El correo del asistente es obligatorio')
        .isEmail()
        .withMessage('El correo del asistente no es valido')
        .isLength({ max: 120 })
        .withMessage('El correo no puede superar 120 caracteres'),
    body('attendeePhone')
        .optional({ nullable: true, checkFalsy: true })
        .trim()
        .isLength({ max: 20 })
        .withMessage('El telefono no puede superar 20 caracteres'),
    handleValidationErrors,
];

const validateRegistrationId = [
    param('id')
        .isMongoId()
        .withMessage('El id de la inscripcion no tiene un formato valido'),
    handleValidationErrors,
];

export { validateCreateRegistration, validateRegistrationId };