import { Router } from 'express';
import {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
} from './event.controller.js';
import {
  validateCreateEvent,
  validateUpdateEvent,
  validateGetEventById,
  validateDeleteEvent,
  validateSearchEvents,
} from '../../middlewares/event-validators.js';

const router = Router();

router.get('/', validateSearchEvents, getEvents);
router.get('/:id', validateGetEventById, getEventById);
router.post('/', validateCreateEvent, createEvent);
router.put('/:id', validateUpdateEvent, updateEvent);
router.delete('/:id', validateDeleteEvent, deleteEvent);

export default router;
