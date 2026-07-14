import Event from './event.model.js';
import User from '../users/user.model.js';

const ensureActiveManager = async (managerId) => {
  const manager = await User.findOne({
    _id: managerId,
    isActive: true,
    role: 'manager',
  });

  if (!manager) {
    const error = new Error('El encargado no existe o esta inactivo');
    error.statusCode = 404;
    error.code = 'MANAGER_NOT_FOUND';
    throw error;
  }

  return manager;
};

export const fetchEvents = async ({ name, date, location }) => {
  const filter = { isActive: true };

  if (name) filter.eventName = { $regex: name, $options: 'i' };
  if (location) filter.location = { $regex: location, $options: 'i' };
  if (date) {
    const start = new Date(date);
    const end = new Date(date);
    end.setDate(end.getDate() + 1);
    filter.date = { $gte: start, $lt: end };
  }

  return Event.find(filter).populate('managerId', 'fullName email phone documentId').sort({ date: 1 });
};

export const fetchEventById = async (id) => {
  return Event.findOne({ _id: id, isActive: true }).populate('managerId', 'fullName email phone documentId');
};

export const createEventRecord = async (eventData) => {
  await ensureActiveManager(eventData.managerId);
  const event = new Event(eventData);
  await event.save();
  return event.populate('managerId', 'fullName email phone documentId');
};

export const updateEventRecord = async ({ id, updateData }) => {
  if (updateData.managerId) {
    await ensureActiveManager(updateData.managerId);
  }

  return Event.findOneAndUpdate({ _id: id, isActive: true }, updateData, {
    new: true,
    runValidators: true,
  }).populate('managerId', 'fullName email phone documentId');
};

export const deleteEventRecord = async (id) => {
  return Event.findOneAndUpdate(
    { _id: id, isActive: true },
    { isActive: false },
    { new: true }
  );
};
