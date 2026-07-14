import { Router } from 'express';
import {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  getEventCapacity,
} from './event.controller.js';
import {
  validateCreateEvent,
  validateUpdateEvent,
  validateGetEventById,
  validateDeleteEvent,
  validateSearchEvents,
} from '../../middlewares/event-validators.js';
import { authOrInternal } from '../../middlewares/validate-internal-token.js';

const router = Router();

router.get('/', validateSearchEvents, getEvents);
router.get('/:id', validateGetEventById, getEventById);
router.post('/', validateCreateEvent, createEvent);
router.put('/:id', validateUpdateEvent, updateEvent);
router.delete('/:id', validateDeleteEvent, deleteEvent);
router.get('/:id/capacity', authOrInternal, getEventCapacity);

export default router;
