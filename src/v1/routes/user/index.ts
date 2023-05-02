import rescue from 'express-rescue';
import { Router } from 'express';
import { getUserById, updateUserById } from '../../controllers/user/user.controller';
import authMiddleware from '../../middlewares/auth';

const authRouter = Router();

authRouter.route('/:id').get(authMiddleware, rescue(getUserById));
authRouter.route('/:id').put(authMiddleware, rescue(updateUserById));

export default authRouter;