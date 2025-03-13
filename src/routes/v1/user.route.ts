import userController from '@/controllers/user.controller';
import express from 'express';

const router = express.Router();

router.get('/:userId', userController.getUser);

export default router;
