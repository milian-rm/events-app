'use strict';

import { Router } from 'express';
import { validateJwt } from '../../middlewares/validate-jwt.js';
import {
    cancelRegistration,
    createRegistration,
    getAttendeesByEvent,
    getAvailableEvents,
    getFullEvents,
    getOccupancySummary,
} from './registration.controller.js';
import {
    validateCreateRegistration,
    validateRegistrationId,
} from '../../middlewares/registration.validator.js';

const router = Router();

router.use(validateJwt);

router.post('/registrations', validateCreateRegistration, createRegistration);
router.delete('/registrations/:id', validateRegistrationId, cancelRegistration);

router.get('/events/:id/attendees', getAttendeesByEvent);
router.get('/events/available', getAvailableEvents);
router.get('/events/full', getFullEvents);
router.get('/summary', getOccupancySummary);

export default router;
