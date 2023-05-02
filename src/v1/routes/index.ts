import { Router } from 'express';

import authRouter from './auth';
import userRouter from './user';
import subScriptionRouter from './subscription'
import chatRouter from './chat';
const router = Router();

router.use('/api/v1/auth', authRouter);
router.use('/api/v1/user', userRouter);
router.use('/api/v1/subscription', subScriptionRouter);
router.use('/api/v1/history', chatRouter);

export default router;