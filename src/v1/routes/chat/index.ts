import rescue from 'express-rescue';
import { Router } from 'express';
import { createDocumentHistory, getUsersDocuments, getUsersDocumentById, deleteUsersDocumentById, generateEmbedding } from '../../controllers/chat/chat.controller';
import authMiddleware from '../../middlewares/auth';

const chatRouter = Router();

chatRouter.route('/').post(authMiddleware,  rescue(createDocumentHistory));
chatRouter.route('/embedding').post(rescue(generateEmbedding));
chatRouter.route('/').get(authMiddleware,  rescue(getUsersDocuments));
chatRouter.route('/:id').get(authMiddleware,  rescue(getUsersDocumentById));
chatRouter.route('/:id').delete(authMiddleware,  rescue(deleteUsersDocumentById));

export default chatRouter;