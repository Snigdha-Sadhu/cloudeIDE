import express from 'express';
const router=express.Router();
import { signup,login,getMe } from '../controllers/authController.js';
import {auth} from '../middleware/Auth.js';
router.post('/signup',signup);
router.post('/login',login);
router.get('/me',auth,getMe);
export default router;