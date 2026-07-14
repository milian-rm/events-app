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

const validateCreateUserRegistration = [
    body('userId')
        .notEmpty()
        .withMessage('El usuario es obligatorio')
        .isMongoId()
        .withMessage('El id del usuario no tiene un formato valido'),
    body('registrationId')
        .notEmpty()
        .withMessage('La inscripcion es obligatoria')
        .isMongoId()
        .withMessage('El id de la inscripcion no tiene un formato valido'),
    handleValidationErrors,
];

const validateUserRegistrationId = [
    param('id')
        .isMongoId()
        .withMessage('El id de la relacion no tiene un formato valido'),
    handleValidationErrors,
];

const validateUserId = [
    param('userId')
        .isMongoId()
        .withMessage('El id del usuario no tiene un formato valido'),
    handleValidationErrors,
];

const validateRegistrationId = [
    param('registrationId')
        .isMongoId()
        .withMessage('El id de la inscripcion no tiene un formato valido'),
    handleValidationErrors,
];

export {
    validateCreateUserRegistration,
    validateUserRegistrationId,
    validateUserId,
    validateRegistrationId,
};