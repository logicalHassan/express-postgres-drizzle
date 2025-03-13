import authController from '@/controllers/auth.controller';
import auth from '@/middlewares/auth';
import validate from '@/middlewares/validate';
import authValidation from '@/validations/auth.validation';
import express from 'express';

const router = express.Router();

router.post('/register', validate(authValidation.register), authController.register);
router.post('/login', validate(authValidation.login), authController.login);
router.post('/forgot-password', validate(authValidation.forgotPassword), authController.forgotPassword);
router.post('/reset-password', validate(authValidation.resetPassword), authController.resetPassword);
router.post('/send-verification-email', auth(), authController.sendVerificationEmail);
router.post('/verify-email', auth(), validate(authValidation.verifyEmail), authController.verifyEmail);

export default router;
