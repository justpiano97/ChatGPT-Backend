import rescue from 'express-rescue';
import { Router } from 'express';
import { authorizeUser, refreshToken, logout } from '../../controllers/auth/auth.controller'

const authRouter = Router();

authRouter.route('/login').post(rescue(authorizeUser));
authRouter.route('/refresh-token').post(rescue(refreshToken));
authRouter.route('/logout').post(rescue(logout));

export default authRouter;