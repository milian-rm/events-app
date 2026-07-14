import {
  fetchEvents,
  fetchEventById,
  createEventRecord,
  updateEventRecord,
  deleteEventRecord,
} from './event.service.js';

export const getEvents = async (req, res, next) => {
  try {
    const { name, date, location } = req.query;
    const events = await fetchEvents({ name, date, location });
    res.status(200).json({ success: true, data: events });
  } catch (error) {
    next(error);
  }
};

export const getEventById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const event = await fetchEventById(id);

    if (!event) {
      return res.status(404).json({ success: false, message: 'Evento no encontrado' });
    }

    res.status(200).json({ success: true, data: event });
  } catch (error) {
    next(error);
  }
};

export const createEvent = async (req, res, next) => {
  try {
    const event = await createEventRecord(req.body);
    res.status(201).json({ success: true, data: event });
  } catch (error) {
    next(error);
  }
};

export const updateEvent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const event = await updateEventRecord({ id, updateData: req.body });

    if (!event) {
      return res.status(404).json({ success: false, message: 'Evento no encontrado' });
    }

    res.status(200).json({ success: true, data: event });
  } catch (error) {
    next(error);
  }
};

export const deleteEvent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const event = await deleteEventRecord(id);

    if (!event) {
      return res.status(404).json({ success: false, message: 'Evento no encontrado' });
    }

    res.status(200).json({
      success: true,
      message: 'Evento eliminado exitosamente',
      data: event,
    });
  } catch (error) {
    next(error);
  }
};

export const getEventCapacity = async (req, res, next) => {
  try {
    const event = await fetchEventById(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Evento no encontrado' });
    }
    return res.status(200).json({
      success: true,
      data: { eventId: event._id, capacity: event.capacity, isActive: event.isActive },
    });
  } catch (error) {
    next(error);
  }
};