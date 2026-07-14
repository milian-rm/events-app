'use strict';

import { Router } from 'express';
import { validateJwt } from '../../middlewares/validate-jwt.js';
import {
    createUserRegistration,
    deleteUserRegistration,
    getRegistrationUsers,
    getUserRegistrations,
} from './user-registration.controller.js';
import {
    validateCreateUserRegistration,
    validateUserRegistrationId,
    validateUserId,
    validateRegistrationId,
} from '../../middlewares/user-registration.validator.js';

const router = Router();

router.use(validateJwt);

router.post('/user-registrations', validateCreateUserRegistration, createUserRegistration);
router.get('/users/:userId/registrations', validateUserId, getUserRegistrations);
router.get('/registrations/:registrationId/users', validateRegistrationId, getRegistrationUsers);
router.delete('/user-registrations/:id', validateUserRegistrationId, deleteUserRegistration);

export default router;
