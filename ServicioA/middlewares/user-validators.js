import { body, param } from 'express-validator';
import { checkValidators } from './check-validators.js';

export const validateCreateUser = [
  body('fullName')
    .trim()
    .notEmpty().withMessage('El nombre del encargado es requerido')
    .isLength({ min: 2, max: 100 }).withMessage('El nombre debe tener entre 2 y 100 caracteres'),
  body('email')
    .trim()
    .notEmpty().withMessage('El correo del encargado es requerido')
    .isEmail().withMessage('El correo no tiene un formato valido'),
  body('phone')
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .isLength({ max: 20 }).withMessage('El telefono no puede superar 20 caracteres'),
  body('documentId')
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .isLength({ max: 30 }).withMessage('El documento no puede superar 30 caracteres'),
  checkValidators,
];

export const validateUpdateUser = [
  param('id').isMongoId().withMessage('ID debe ser un ObjectId valido de MongoDB'),
  body('fullName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 }).withMessage('El nombre debe tener entre 2 y 100 caracteres'),
  body('email')
    .optional()
    .trim()
    .isEmail().withMessage('El correo no tiene un formato valido'),
  body('phone')
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .isLength({ max: 20 }).withMessage('El telefono no puede superar 20 caracteres'),
  body('documentId')
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .isLength({ max: 30 }).withMessage('El documento no puede superar 30 caracteres'),
  checkValidators,
];

export const validateUserId = [
  param('id').isMongoId().withMessage('ID debe ser un ObjectId valido de MongoDB'),
  checkValidators,
];
