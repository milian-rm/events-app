import User from './user.model.js';

export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({ isActive: true }).sort({ fullName: 1 });
    return res.status(200).json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.params.id, isActive: true });

    if (!user) {
      return res.status(404).json({ success: false, message: 'Encargado no encontrado' });
    }

    return res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

export const createUser = async (req, res, next) => {
  try {
    const user = await User.create(req.body);
    return res.status(201).json({
      success: true,
      message: 'Encargado creado correctamente',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const user = await User.findOneAndUpdate(
      { _id: req.params.id, isActive: true },
      req.body,
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ success: false, message: 'Encargado no encontrado' });
    }

    return res.status(200).json({
      success: true,
      message: 'Encargado actualizado correctamente',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findOneAndUpdate(
      { _id: req.params.id, isActive: true },
      { isActive: false },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ success: false, message: 'Encargado no encontrado' });
    }

    return res.status(200).json({
      success: true,
      message: 'Encargado eliminado correctamente',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};
