import { Router } from 'express';
import { getAttendeesByEvent } from './registration.controller.js';

const router = Router();

router.get('/events/:id/attendees', getAttendeesByEvent);

export default router;
