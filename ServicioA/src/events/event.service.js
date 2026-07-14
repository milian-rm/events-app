import Event from './event.model.js';

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

  return Event.find(filter).sort({ date: 1 });
};

export const fetchEventById = async (id) => {
  return Event.findOne({ _id: id, isActive: true });
};

export const createEventRecord = async (eventData) => {
  const event = new Event(eventData);
  await event.save();
  return event;
};

export const updateEventRecord = async ({ id, updateData }) => {
  return Event.findOneAndUpdate({ _id: id, isActive: true }, updateData, {
    new: true,
    runValidators: true,
  });
};

export const deleteEventRecord = async (id) => {
  return Event.findOneAndUpdate(
    { _id: id, isActive: true },
    { isActive: false },
    { new: true }
  );
};