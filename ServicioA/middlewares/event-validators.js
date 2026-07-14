import { body, param, query } from 'express-validator';
import { authOrInternal } from './validate-internal-token.js';
import { checkValidators } from './check-validators.js';

export const validateCreateEvent = [
  authOrInternal,
  body('eventName')
    .trim()
    .notEmpty().withMessage('El nombre del evento es requerido')
    .isLength({ min: 2, max: 100 }).withMessage('El nombre debe tener entre 2 y 100 caracteres'),
  body('date')
    .notEmpty().withMessage('La fecha es requerida')
    .isISO8601().withMessage('La fecha debe tener formato válido (YYYY-MM-DD)'),
  body('location')
    .trim()
    .notEmpty().withMessage('El lugar es requerido'),
  body('capacity')
    .notEmpty().withMessage('La capacidad es requerida')
    .isInt({ min: 1 }).withMessage('La capacidad debe ser un entero mayor a 0'),
  body('managerId')
    .optional({ nullable: true, checkFalsy: true })
    .isMongoId().withMessage('El encargado debe ser un ObjectId valido de MongoDB'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('La descripción no puede exceder 500 caracteres'),
  checkValidators,
];

export const validateUpdateEvent = [
  authOrInternal,
  param('id').isMongoId().withMessage('ID debe ser un ObjectId válido de MongoDB'),
  body('eventName').optional().trim().isLength({ min: 2, max: 100 }),
  body('date').optional().isISO8601(),
  body('location').optional().trim().notEmpty(),
  body('capacity').optional().isInt({ min: 1 }),
  body('managerId').optional().isMongoId().withMessage('El encargado debe ser un ObjectId valido de MongoDB'),
  body('description').optional().trim().isLength({ max: 500 }),
  checkValidators,
];

export const validateGetEventById = [
  authOrInternal,
  param('id').isMongoId().withMessage('ID debe ser un ObjectId válido de MongoDB'),
  checkValidators,
];

export const validateDeleteEvent = [
  authOrInternal,
  param('id').isMongoId().withMessage('ID debe ser un ObjectId válido de MongoDB'),
  checkValidators,
];

export const validateSearchEvents = [
  authOrInternal,
  query('name').optional().trim(),
  query('date').optional().isISO8601(),
  query('location').optional().trim(),
  checkValidators,
];
