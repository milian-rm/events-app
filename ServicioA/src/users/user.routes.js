import { Router } from 'express';
import { validateJWT } from '../../middlewares/validate-JWT.js';
import {
  createUser,
  deleteUser,
  getUserById,
  getUsers,
  updateUser,
} from './user.controller.js';
import {
  validateCreateUser,
  validateUpdateUser,
  validateUserId,
} from '../../middlewares/user-validators.js';

const router = Router();

router.use(validateJWT);

router.get('/', getUsers);
router.get('/:id', validateUserId, getUserById);
router.post('/', validateCreateUser, createUser);
router.put('/:id', validateUpdateUser, updateUser);
router.delete('/:id', validateUserId, deleteUser);

export default router;
